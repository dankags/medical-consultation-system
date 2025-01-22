"use server"

import { auth } from "@clerk/nextjs/server";
import { generateTimestamp, parseStringify } from "../utils";
import {
    APPOINTMENT_COLLECTION_ID,
    DATABASE_ID,
    DOCTOR_COLLECTION_ID,
    USER_COLLECTION_ID,
    databases,
  } from "../appwrite.config";
import { Query } from "node-appwrite";

interface MpesaTokenResponse {
    access_token: string;
    expires_in: string;
  }

//  GET user amount balance 
export const getUserBalance=async()=>{
    const {userId}=await auth()

    if(!userId)  return parseStringify({error:"Not Autheticated"});

    try {
        const userBalance = await databases.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal("clerkId",userId)]
          );
        return parseStringify({balance:userBalance.documents[0].balance})
    } catch (err:any) {
        console.log(err)
        return parseStringify({error:"Internal Server Error"})
    }
}

// GET users appointments
export const getUserAppointments=async(limit?:number)=>{
    const {userId}=await auth()

    if(!userId)  return parseStringify({error:"Not Autheticated"});

    try {
        const user= await databases.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal("clerkId",userId) ]
          );
          
          let appointments: any[] = [];

          if(user.total===0)  return parseStringify({error:"User does not exist"})
          if(user.documents[0].role==="doctor"){
            const doctor=await databases.listDocuments(
                DATABASE_ID!,
                DOCTOR_COLLECTION_ID!,
                [Query.equal("user",user.documents[0].$id) ]
              );
              if(doctor.total===0) return parseStringify({appointments:[]})
                appointments=doctor.documents[0].appointments
          }
          if(user.documents[0].role==="user"){
           appointments=user.documents[0].appointments
          }


          
          
            if(appointments.length===0) return parseStringify({appointments:[]})
        
          const processedAppointments = appointments?.map((doc) => {
            if(user.documents[0].role==="user"){
            return {
                id: doc.$id, // Rename $id to id
                appointmentDate: doc.schedule,
                status: doc.status,
                doctor: {
                    name: doc.doctor.name,
                    reason:doc.doctor.reason,
                },
                patient: {
                    name: user.documents[0].name,
                    email: user.documents[0].email,
                },
            };
        }
        return{
            id: doc.$id, // Rename $id to id
                appointmentDate: doc.schedule,
                status: doc.status,
                doctor: {
                    name: doc.user.name,
                    reason:doc.reason,
                },
                patient: {
                    name: user.documents[0].name,
                    email: user.documents[0].email,
                },
        }
        });
        // destructure the appointments json


        return parseStringify({appointments:processedAppointments.sort((a,b)=>new Date(b.appointmentDate).getTime()-new Date(a.appointmentDate).getTime())})
    } catch (err:any) {
        console.log("Appointments Error: ",err)
        return parseStringify({error:"internal server error"})
    }
}

// GET appointment by Id
export const getAppointmentById=async(id:string)=>{
    const {userId}=await auth()

    if(!userId)  return parseStringify({error:"Not Autheticated"});

    try {
        const user = await databases.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal("clerkId", userId!)]
        );

        if (user.total === 0) return parseStringify({ error: "User does not exist" });
              
             
        const userAppointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            id,
          );
        
         const {$id,doctor,patient,$permissions,$databaseId,$createdAt,$updatedAt,$collectionId,...others}=userAppointment
         
         const resData={
            ...others,
            id:$id,
            doctor:{
                id:doctor.user.$id,
                name:doctor.name,
                email:doctor.email
            }
         }
        

        return parseStringify({appointments:resData})
    } catch (err:any) {
        console.log("Appointments Error: ",err)
        return parseStringify({error:"internal server error"})
    }
}

//GET user info
export const fetchUserData=async()=>{
    const { userId } = await auth();

    if (!userId) return parseStringify({ error: "Not Authenticated" });

     try {
        const user = await databases.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal("clerkId", userId!)]
        );

        if (user.total === 0) return parseStringify({ error: "User does not exist" });

        const {gender,balance,reviews,appointments,payments,doctorInfo,patient,myPayments,$databaseId,$collectionId,birthDate,clerkId,$id,$permissions,$updatedAt,$createdAt,...userData} = user.documents[0];
        return parseStringify({ user: {...userData,id:$id} });

     } catch (err:any) {
        return parseStringify({ error: "Internal Server Error" });
     }
}


//   Generate Mpesa Token
  export const generateMpesaToken = async (): Promise<any> => {
    if (!process.env.M_PESA_CONSUMER_KEY || !process.env.M_PESA_CONSUMER_SECRET) {
      return parseStringify({error:'M-Pesa credentials are not set in the environment variables'});
    }
  
    const credentials = Buffer.from(
      `${process.env.M_PESA_CONSUMER_KEY}:${process.env.M_PESA_CONSUMER_SECRET}`
    ).toString('base64');
   
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout
  
    try {
     
      const response = await fetch(
        `${process.env.M_PESA_API_URL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        }
      );
  
      clearTimeout(timeout);
  
      if (!response.ok) {
        return parseStringify({
          error: `Failed to generate M-Pesa token: ${response.status} ${response.statusText}`
        });
      }
  
      const data: MpesaTokenResponse = await response.json();
  
      if (!data.access_token) {
        return parseStringify({
          error: 'Invalid response: Missing access token'
        });
      }
      return parseStringify({ token: data.access_token });
  
    } catch (error) {
      clearTimeout(timeout);
      console.error('Error generating M-Pesa token:', error.message);
      return parseStringify({error:'internal server error'});
    }
  };

//   Generate Mpesa Password
export const generateSTKPassword = async (time:Date): Promise<{ password: string; timestamp: string }> => {
    const shortCode = process.env.M_PESA_SHORTCODE!;
  const passkey = process.env.M_PESA_PASSKEY!;
    const timestamp = await generateTimestamp(time)
    const password = Buffer.from(
       `${shortCode}${passkey}${timestamp}`
      ).toString('base64');
  
    return { password, timestamp };
  };