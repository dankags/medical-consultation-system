import { DATABASE_ID, databases, USER_COLLECTION_ID } from "@/lib/appwrite.config"
import { getAuth } from "@clerk/nextjs/server"
import { NextApiRequest } from "next"
import { Query } from "node-appwrite"


export const GET =async ( req:NextApiRequest,{ params }: { params: Promise<{ userId: string }> }) => {
    const user = (await params).userId
    const { userId } =await getAuth(req)

    if (!userId) {
        return new Response(JSON.stringify({ error: "UnAutheticated" }), { status: 401 });
    }

    if (userId !== user) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
      }

    try{
      const userBalance = await databases.listDocuments(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        [Query.equal("clerkId",userId)]
      );
     return new Response(JSON.stringify({balance:userBalance.documents[0].balance}), { status: 200 });
    }catch(err:any){
      console.log(err)
      new Response(JSON.stringify({error:err}), { status: 500 })
    }
 }