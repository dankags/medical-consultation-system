"use server"

import { auth } from "@clerk/nextjs/server";
import { generateTimestamp, getOneMonthAgoISO, parseStringify } from '../utils';
import {
    APPOINTMENT_COLLECTION_ID,
    DATABASE_ID,
    DOCTOR_COLLECTION_ID,
    FEEDBACK_COLLECTION_ID,
    PAYMENT_COLLECTION_ID,
    USER_COLLECTION_ID,
    databases,
  } from "../appwrite.config";
import { ID, Query } from "node-appwrite";
import { DoctorAppointmentDocument, Feedback, PatientAppointmentDocument, Transaction } from "@/types";
import { startOfDay } from "date-fns";
import { DoctorInfo } from "@/types/appwrite.types";



interface MpesaTokenResponse {
    access_token: string;
    expires_in: string;
  }

  type GetAppointmentsResult =
  | { success: true; data: PatientAppointmentDocument[]|DoctorAppointmentDocument[] }
  | { success: false; error: string };

type UserRole = "doctor"|"user"| "admin";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err:any) {
        console.log(err)
        return parseStringify({error:"Internal Server Error"})
    }
}

// Get doctors patients
export const getDoctorsPatients=async(doctorUserId:string,role:UserRole)=>{
  const {userId}=await auth()

    if(!userId)  return parseStringify({error:"Not Autheticated"});
    if(!doctorUserId) return parseStringify({error:"There are some parameters missing"})
      if(role !== "doctor") return parseStringify({error:"You are not authorized to make this request."})

    try {
      const doctor=await databases.listDocuments(
        DATABASE_ID!,
        DOCTOR_COLLECTION_ID!,
        [Query.equal("user",doctorUserId) ]
      );
      if(doctor.total===0) return parseStringify({error:"This doctor does not exist"})

      const appointments=await databases.listDocuments(
        DATABASE_ID!,
       APPOINTMENT_COLLECTION_ID!,
       [Query.equal("doctor",doctor.documents[0].$id)]
      )
      if(appointments.total===0) return parseStringify({error:"This doctor does not have any patient"})
     
    const doctorsPatients=Array.from(
      new Map(
        appointments.documents.map((item) => [
          item.user.$id,
          {
            id: item.user.$id,
            name: item.user.name,
            email: item.user.email,
            avatar: item.user.image,
          },
        ])
      ).values()
    );
    return parseStringify({patients:doctorsPatients,doctorId:doctor.documents[0].$id})
    } catch (error) {
      console.log("Appointments Error: ",error)
        return parseStringify({error:"internal server error"})
    }  
}



// GET users appointments
export const getUserAppointments=async()=>{
    const {userId}=await auth()

    if(!userId)  return parseStringify({error:"Not Autheticated"});

    try {
        const user= await databases.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal("clerkId",userId) ]
          );
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let appointments: any[] = [];
          let doctor=null

          if(user.total===0)  return parseStringify({error:"User does not exist"})
          if(user.documents[0].role==="doctor"){
            doctor=await databases.listDocuments(
                DATABASE_ID!,
                DOCTOR_COLLECTION_ID!,
                [Query.equal("user",user.documents[0].$id) ]
              );
              if(doctor.total===0) return parseStringify({error:"This doctor does not exist"})
                appointments=doctor.documents[0].appointments
          }
          if(user.documents[0].role==="user"){
           appointments=user.documents[0].appointments
          }


          
          
            if(appointments.length===0) return parseStringify({appointments:[]})

        
          const processedAppointments = appointments?.map((doc) => {
            if(user.documents[0].role!=="doctor"){
            return {
                id: doc.$id, // Rename $id to id
                appointmentDate: doc.schedule,
                status: doc.status,
                doctor: {
                    name: doc.doctor.name,
                    reason:doc.doctor.reason,
                },
                patient: {
                    id:user.documents[0].$id,
                    name: user.documents[0].name,
                    email: user.documents[0].email,
                },
            };
        }
        return{
            id: doc.$id, // Rename $id to id
                appointmentDate: doc.schedule,
                status: doc.status,
                patient: {
                    id:doc.user.$id,
                    name: doc.user.name,
                    reason:doc.reason,
                },
                doctor: {
                  doctorId:doctor?.documents[0].$id,
                   id: user.documents[0].$id,
                    name: user.documents[0].name,
                    email: user.documents[0].email,
                },
        }
        });
        // destructure the appointments json
       


        return parseStringify({appointments:processedAppointments.sort((a,b)=>new Date(b.appointmentDate).getTime()-new Date(a.appointmentDate).getTime())})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err:any) {
        console.log("Appointments Error: ",err)
        return parseStringify({error:"internal server error"})
    }
}

// GET appointment by Id
export const   getAppointmentById=async(id:string)=>{
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
        
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {gender,balance,reviews,appointments,payments,doctorInfo,patient,myPayments,$databaseId,$collectionId,birthDate,clerkId,$id,$permissions,$updatedAt,$createdAt,...userData} = user.documents[0];
        return parseStringify({ user: {...userData,id:$id},error:null });

     // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
     } catch (err:any) {
        return parseStringify({user:null, error: "Internal Server Error" });
     }
}


//   Generate Mpesa Token
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      clearTimeout(timeout);
      console.error('Error generating M-Pesa token:', error.message);
      return parseStringify({error:error?.message?`Error generating M-Pesa token:,${ error.message}`:'internal server error'});
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

  export const getUserPayments = async (id: string) => {
    const { userId } = await auth();
  
    if (!userId) return parseStringify({ error: "Not Authenticated" });
    if (!id) return parseStringify({ error: "User ID is required" });
  
    try {
      // Fetch user and payments concurrently
      const [user, userPayments] = await Promise.all([
        databases.getDocument(DATABASE_ID!, USER_COLLECTION_ID!, id),
        databases.listDocuments(DATABASE_ID!, PAYMENT_COLLECTION_ID!, [
          Query.or([Query.equal("user", id), Query.equal("doctor", id)]),
        ]),
      ]);
  
      if (!user) return parseStringify({ error: "User does not exist" });
      if (userPayments.total === 0) return parseStringify({ payments: [] });
  
      const filteredPayments: Transaction[] = [];
  
      for (const doc of userPayments.documents) {
        try {
          let counterparty;
  
          // Check if it's a doctor payment and the doctor ID exists
          if (doc.user.$id === id && doc.doctor) {
            try {
              // Fetch doctor document safely
              const doctor = await databases.getDocument(
                DATABASE_ID!,
                USER_COLLECTION_ID!,
                doc.doctor
              );
  
              counterparty = {
                avatar: doctor?.image ?? "", // Ensure no undefined error
                name: doctor?.name ?? "Unknown",
                id: doctor?.$id ?? "N/A",
              };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
            } catch (error:any) {
              console.warn(`Doctor document not found: ${doc.doctor}`);
              counterparty = {
                avatar: "",
                name: "Unknown",
                id: "N/A",
              };
            }
          } else {
            // Default to user data
            counterparty = {
              avatar: doc.user.image ?? "",
              name: doc.user.name ?? "Unknown",
              id: doc.user.$id ?? "N/A",
            };
          }
  
          // Push transaction data
          filteredPayments.push({
            id: doc.$id,
            type: doc.type,
            status: doc.status,
            counterparty,
            description: doc.description,
            amount: doc.amount,
            date: doc.date,
            paymentMethod: doc.paymentMethod,
            reference: doc.reference,
          });
        } catch (error) {
          console.error("Error processing payment:", error);
          continue; // Skip the current iteration instead of stopping the entire function
        }
      }
  
      // Return sorted payments
      return parseStringify({
        payments: filteredPayments.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      });
    } catch (error) {
      console.error("Internal Server Error:", error);
      return parseStringify({ error: "Internal Server Error" });
    }
  };
  

export async function getPaymentStats(
  userId: string, 
  role: UserRole
) {
  const {userId:authenticatedId}=await auth()
  if(!authenticatedId) return parseStringify({error:"user not autheticated"})
  // We want payments from the last 1 month
  const oneMonthAgo = getOneMonthAgoISO();

  // Build the base queries
  // Query.greaterEqual('date', oneMonthAgo) => gets docs whose `date >= oneMonthAgo`
  const queries = [ Query.greaterThanEqual('date', oneMonthAgo) ];

  // If user is a doctor, filter by the `doctor` field
  // If user is a patient, filter by the `user` field
  if (role === 'doctor') {
    queries.push(Query.equal('doctor', userId));
  } else {
    // role === 'patient'
    queries.push(Query.equal('user', userId));
  }

  // Fetch all the relevant documents
  try {
    const now = new Date();
    const response = await databases.listDocuments(
      DATABASE_ID!,
      PAYMENT_COLLECTION_ID!,
      queries
    );

    const payments = response.documents;

  // We will keep track of sums
  let totalEarnings = 0;
  let totalPending = 0;
  let totalPaid = 0;
  let transactionCount=0
  let pendingTrnsactionCount=0
  const latestPendingpayments=[]

  for (const payment of payments) {
    // Check the status
    if (payment.status === 'completed') {
      if (role === 'doctor') {
        // For doctors, sum completed payments as "earnings"
        if(payment.type==="payment"){
        totalEarnings += payment.amount;
        transactionCount+=1
        }
      } else {
        // For patients, sum completed payments as "paid"
        if(payment.type==="payment"){
        totalPaid += payment.amount;
        transactionCount+=1
        }
      }
    } else if (payment.status === 'pending') {
      // For doctors, you might want to track how much is pending
      // If you also want to see future vs past pending, 
      //   compare the `date` with the current date
      if (role === 'doctor') {
        totalPending += payment.amount;
        pendingTrnsactionCount+=1
      }

      if( role === "user"){
        const paymentDate = new Date(payment.date);
        if(paymentDate > now){
          totalPending += payment.amount;
          pendingTrnsactionCount+=1
          latestPendingpayments.push(payment)
        }
      }

      // For patients, you might or might not need this; 
      //   adapt as needed
    }
  }
  const upcommingPendingPaymentDate=latestPendingpayments[0]?.date
  // Return the computed stats
  if (role === 'doctor') {
    return {
      totalEarnings,
      totalPending,
      transactionCount,
      pendingTrnsactionCount
    };
  } else {
    return {
      totalPaid,
      transactionCount,
      totalPending,
      pendingTrnsactionCount,
      upcommingPayment:upcommingPendingPaymentDate,
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    console.error("Error fetching payment stats:", error);
    return parseStringify({error:"Internal server error"})
    
  }
 



  // Iterate through the payments
 
}

// GET upcoming appointments for a user
export async function getUpcomingAppointmentsForUser(
  userId: string
): Promise<GetAppointmentsResult> {

  if (!userId) {
    return { success: false, error: 'User ID is required.' };
  }
  const {userId:authenticatedId}=await auth()
  if(!authenticatedId) return parseStringify({error:"user not autheticated"})
  
  try {

    const todayStartISO = startOfDay(new Date()).toISOString();

    const user=await databases.getDocument(DATABASE_ID!,USER_COLLECTION_ID!,userId)
    if(!user) {return {
      success: false,
      error: `User with given id doesnot exist`,
    }}
    const queries:string[]=[]
    if(user.role==="user"){
      queries.push(Query.equal('user', userId))
    }else if(user.role==="doctor"){
      queries.push(Query.equal('doctor', user.doctorInfo.$id))
    }
    const response = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [
        ...queries,
        Query.greaterThanEqual('schedule', todayStartISO), // Filter for schedule >= start of today
        Query.orderAsc('schedule'), // Order by schedule date, earliest first
        Query.limit(10), // Add a limit to prevent fetching too much data (adjust as needed)
        // Query.equal('status', 'scheduled'),
      ]
    );

    if(user.role==="user"){
      const appointments:PatientAppointmentDocument[] = response.documents.map((doc) => {
       
          return{
            appointmentId: doc.$id,
            schedule: doc.schedule,
            reason:doc.reason,
            paymentStatus:doc.paymentStatus,
            status:doc.status,
            doctor:{
              doctorUserId:doc.doctor.user.$id,
              image:doc.doctor.user.image,
              speciality:doc.doctor.speciality,
              name:doc.doctor.name
            }
          }
        
        
      })
      return { success: true, data: appointments };

    }else if(user.role==="doctor"){
      const appointments:DoctorAppointmentDocument[] = response.documents.map((doc) => {
        
          return{
            appointmentId: doc.$id,
            schedule: doc.schedule,
            reason:doc.reason,
            paymentStatus:doc.paymentStatus,
            status:doc.status,
            patient:{
              patientUserId:doc.doctor.user.$id,
              image:doc.doctor.user.image,
              name:doc.doctor.name
            }
          }
        
        
      })
      return { success: true, data: appointments };

    }
   

    return {
      success: false,
      error: `Failed to fetch appointments. `,
    };
    

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching upcoming appointments:', error);
    // Provide a generic error message to the client
    return {
      success: false,
      error: `Failed to fetch appointments. ${error.message || ''}`,
    };
  }
}

// 
export const makeAppointmentPayment=async(doctorId:string,patientId:string,time:Date)=>{
  const {userId}=await auth()
  if(!userId) return parseStringify({error:"user not autheticated"})
  
  if(!doctorId || !patientId || !time) return parseStringify({error:"Doctor , time and Patient Id is required"})
  
    try {
      const [doctor,patient]=await Promise.all([databases.getDocument(DATABASE_ID!,USER_COLLECTION_ID!,doctorId),databases.getDocument(DATABASE_ID!,USER_COLLECTION_ID!,patientId)])
      if(!doctor || !patient) return parseStringify({error:"User does not exist"})
      if(patient.balance===0) return parseStringify({error:"You cannot create an appointment due to funds issue."})  
      await databases.updateDocument(DATABASE_ID!,USER_COLLECTION_ID!,patient.$id,{ balance:patient.balance-500})
     await databases.updateDocument(DATABASE_ID!,USER_COLLECTION_ID!,doctor.$id,{ balance:doctor.balance+500})
     const createPaymentInvoice=await databases.createDocument(
      DATABASE_ID!,
      PAYMENT_COLLECTION_ID!,
      ID.unique(),
      {
        amount: 500,
        date:new Date(time),
        status: "completed",
        type:"payment",
        description: "Urgent appointment payment",
        paymentMethod:"CarePulse-App",
        user:patient.$id,
        doctor:doctor.$id
      })
      if(!createPaymentInvoice) return parseStringify({error:"Failed to create payment invoice."})
      return parseStringify({success:"Payment made successfully"})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log(error)
      return parseStringify({error:"Internal server error."})
    }
}

export const createUserFeedback=async(userFeedback:Feedback)=>{
  try {
    const {userId}=await auth()
    if(!userId){throw new Error("user not autheticated")}
    const feedback=await databases.createDocument(DATABASE_ID!,FEEDBACK_COLLECTION_ID!,ID.unique(),{...userFeedback})
    if(!feedback){
      throw new Error("Something wnt wrong when creating a feedback.")
    }
    return parseStringify({message:"Feedback was created successfully."})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    console.error(error)
    return parseStringify({error:"Internal Server."})
  }
}

export const getDoctor=async()=>{
  const {userId}=await auth()
  if(!userId) return parseStringify({error:"user not autheticated"})
  try {
const user=await databases.listDocuments(DATABASE_ID!,USER_COLLECTION_ID!,[Query.equal("clerkId",userId)])
if(user.total===0) return parseStringify({error:"User does not exist."})
if(user.documents[0].role!=="doctor") return parseStringify({error:"You are not a doctor."})
    const doctor=await databases.listDocuments(DATABASE_ID!,DOCTOR_COLLECTION_ID!,[Query.equal("user",user.documents[0].$id)])
    if(doctor.total===0) return parseStringify({error:"Doctor does not exist."})
    return parseStringify({doctor:doctor.documents[0]})
  } catch (error) {
    console.log(error)
    return parseStringify({error:"Internal server error."})
  }
}

export const createDoctor=async(doctorInfo:DoctorInfo)=>{
  const {userId}=await auth()
  if(!userId) return parseStringify({error:"user not autheticated"})
    if(!doctorInfo) return parseStringify({error:"Please provide doctor info"})
  try {
    const doctorExist=await databases.listDocuments(DATABASE_ID!,DOCTOR_COLLECTION_ID!,[Query.equal("user",doctorInfo.user)])
    if(doctorExist.total!==0) return parseStringify({error:"Doctor already exist."})
     const doctor=await databases.createDocument(DATABASE_ID!,DOCTOR_COLLECTION_ID!,
      ID.unique(),
      {
      ...doctorInfo
     })
     if(!doctor) return parseStringify({error:"Please provide doctor info"})
      return parseStringify({success:true})
  } catch (error) {
    console.log(error)
    return parseStringify({error:"Internal server error."})
  }
} 