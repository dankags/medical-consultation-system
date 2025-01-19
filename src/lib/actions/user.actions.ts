"use server"

import { auth } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import {
    APPOINTMENT_COLLECTION_ID,
    DATABASE_ID,
    USER_COLLECTION_ID,
    databases,
  } from "../appwrite.config";
import { Query } from "node-appwrite";
import { cookies } from 'next/headers';


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
        const user=await await databases.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal("clerkId",userId) ]
          );
          if(user.total===0)  return parseStringify({error:"User does not exist"})
            const queries = [
                Query.equal("patient", user.documents[0].$id),
                Query.select([
                    "appointmentDate",
                    "confirmed",
                    "status",
                    "$id",
                    "doctor.name",
                    "doctor.email",
                    "doctor.$id",
                    "patient.name",
                    "patient.email",
                    "patient.$id"
                ]),
                Query.orderAsc("appointmentDate"),
              ];
              
              if (limit) {
                queries.push(Query.limit(limit));
              }
        const userAppointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
           queries,
        
          );
          const processedAppointments = userAppointments.documents.map((doc) => {
            return {
                id: doc.$id, // Rename $id to id
                appointmentDate: doc.appointmentDate,
                confirmed: doc.confirmed,
                status: doc.status,
                doctor: {
                    name: doc.doctor.name,
                    email: doc.doctor.email,
                },
                patient: {
                    name: doc.patient.name,
                    email: doc.patient.email,
                },
            };
        });
        // destructure the appointments json



        return parseStringify({appointments:processedAppointments})
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
                id:doctor.$id,
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

        const {gender,balance,patient,myPayments,$databaseId,$collectionId,birthDate,clerkId,$id,$permissions,$updatedAt,$createdAt,...userData} = user.documents[0];
        return parseStringify({ user: {...userData,id:$id} });

     } catch (err:any) {
        return parseStringify({ error: "Internal Server Error" });
     }
}

//Set user cookie
export const createUserCookie = async () => {
    const { userId } = await auth();

    const cookieStore = await cookies();
    console.log(userId);
    if (!userId) return parseStringify({ error: "Not Authenticated" });

    try {
        const user = await databases.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal("clerkId", userId!)]
        );

        if (user.total === 0) return parseStringify({ error: "User does not exist" });

        const userData = user.documents[0];
        const {gender,balance,clerkId,...others}=userData
        return parseStringify({ user: others });

        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        cookieStore.set('user', JSON.stringify(userCookie), { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            expires 
        });

        return parseStringify({ success: true });
    } catch (err: any) {
        console.log(err);
        return parseStringify({ error: "Internal Server Error" });
    }
}