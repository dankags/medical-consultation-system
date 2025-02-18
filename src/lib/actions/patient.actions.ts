"use server";

import { ID, Query,  } from 'node-appwrite';

import {
  BUCKET_ID,
  DATABASE_ID,
  DOCTOR_COLLECTION_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  USER_COLLECTION_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { auth } from '@clerk/nextjs/server';



// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => { 
 
  try {
    if(!user || !user.clerkId){
      throw new Error("user is not initialized.")
    }
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await databases.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      user.clerkId,
      {
       ...user
      }
    );

    return parseStringify(newuser);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile = identificationDocument.get("blobFile") as File ;
        // &&
        // InputFile.fromBlob(
        //   identificationDocument?.get("blobFile") as Blob,
        //   identificationDocument?.get("fileName") as string
        // );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};

// GET Doctors Preview profile
export const getDoctorPreview=async(id:string,doctorId:string)=>{
  const {userId}=await auth()

  if (!userId) return parseStringify({ error: "Not Authenticated" });

  try {
    const [user, doctor] = await Promise.all([
      databases.getDocument(DATABASE_ID!, USER_COLLECTION_ID!, id,[Query.select([])]),
      databases.getDocument(DATABASE_ID!, DOCTOR_COLLECTION_ID!, doctorId),
    ]);

   if (!user || !doctor) return parseStringify({ error: "This Doctor Does not exist" });


    const resData={
      name:doctor?.name,
      rating:doctor?.rating,
      specialty:doctor?.speciality,
      title:doctor?.title,
      description:doctor?.description,
      doctorClerkId:user?.clerkId
    }

    return parseStringify(resData);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err:any) {
    console.log(err)
    return parseStringify({ error: "Internal Server Error" });
  }

}