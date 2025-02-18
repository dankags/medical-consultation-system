import { DATABASE_ID, databases, USER_COLLECTION_ID } from '@/lib/appwrite.config';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Query } from 'node-appwrite';


export async function GET() {
    const {userId}=await auth()
    if(!userId){return NextResponse.json("user is not autheticated", { status: 401 })}
    try {
        const doctors = await databases.listDocuments(
            DATABASE_ID!,     // Add your database ID
            USER_COLLECTION_ID!,   // Add your collection ID
            [
                Query.equal('role', 'DOCTOR')
            ]
        );

      const filteredDoctors=doctors.documents.map((item)=>{
        return{
            name:item.doctorInfo.name,
            doctorId:item.doctorInfo.$id,
            image:""
        }
      })

        return NextResponse.json(filteredDoctors, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err:any) {
        console.error(err)
        return NextResponse.json(
            { message: 'Failed to fetch doctors' },
            { status: 500 }
        );
    }
}
