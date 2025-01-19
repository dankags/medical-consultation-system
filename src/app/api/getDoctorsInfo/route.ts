import { DATABASE_ID, databases, USER_COLLECTION_ID } from '@/lib/appwrite.config';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { Query } from 'node-appwrite';


export async function POST(req: NextRequest) {
  const body = await req.json();
  const {userId}=await auth()
  console.log(body?.doctorsIds)

  if(!userId) return NextResponse.json({ error: 'UnAutheticated' }, { status: 401 });

  try{
      const users = await databases.listDocuments(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        [
          Query.equal("$id", body?.doctorsIds),
        //   Query.select(['$id', 'doctorInfo'])
        ]);
      
        const filteredData=users?.documents.map(({ $id, doctorInfo }) => ({
            id: $id,
            doctorId:doctorInfo?.$id,
            name:doctorInfo?.name,
            description:doctorInfo?.description,
            specialty:doctorInfo?.speciality,
          }))
    
     return NextResponse.json(filteredData, { status: 200 })
  }catch(err){
    console.log("the error is because:",err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
  
}