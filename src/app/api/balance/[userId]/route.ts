import { DATABASE_ID, databases, USER_COLLECTION_ID } from "@/lib/appwrite.config"
import {  auth } from "@clerk/nextjs/server"


export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
    const user = (await params).userId;
    const { userId } =await auth()

    if (!userId) {
        return new Response(JSON.stringify({ error: "UnAutheticated" }), { status: 401 });
    }

    if (!DATABASE_ID || !USER_COLLECTION_ID) {
      return new Response(JSON.stringify({ error: "Missing environment variables" }), { status: 500 });
    }

    try{
      const userBalance = await databases.getDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        user
      );

if (userId !== userBalance.clerkId) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
      }

     return new Response(JSON.stringify({balance:userBalance.balance}), { status: 200 });
    }catch(err){
      console.log(err)
     return new Response(JSON.stringify({error:err}), { status: 500 })
    }
 }