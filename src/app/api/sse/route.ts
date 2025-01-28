import { DATABASE_ID, databases, SSE_COLLECTION_ID, USER_COLLECTION_ID } from "@/lib/appwrite.config";
import StreamStore from '@/lib/streamStore';
import { auth } from "@clerk/nextjs/server";
import {  Query } from "node-appwrite";


// Handle incoming SSE connections
export async function GET(req: Request) {
  const { userId } =await auth(); // Get the Clerk user ID

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  console.log(stream)

  // Set SSE headers
  const headers = new Headers();
  headers.set('Content-Type', 'text/event-stream');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Connection', 'keep-alive');

  const response = new Response(stream.readable, { headers });

  try {
    const user= await databases.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("clerkId",userId) ]
    );
    if(user.total===0){
      return new Response('This user doesnot exist', { status: 401 });
    }
    const {writable,readable}=stream
    StreamStore.addStream(user.documents[0].$id, { readable, writable });
    console.log(JSON.stringify(stream) ) 

    // Add the client to the Appwrite database
    await databases.createDocument(
      DATABASE_ID!,
      SSE_COLLECTION_ID!,
      user.documents[0].$id, // Use the Clerk user ID as the document ID
      {
        userId:user.documents[0].$id,
        writable: JSON.stringify({ readable, writable:{
          isLocked: writable.locked, // Example: Store the locked state
      } }),
      }
    );

    console.log(`Client connected: ${userId}`);

    // Handle client disconnection
    req.signal.addEventListener('abort', async () => {
      StreamStore.removeStream(user.documents[0].$id);
      await databases.deleteDocument(DATABASE_ID!, SSE_COLLECTION_ID!, user.documents[0].$id);
      console.log(`Client disconnected: ${userId}`);
      writer.close();
    });

    // Send an initial message to the client
    writer.write(encoder.encode('data: Connected to SSE\n\n'));

    return response;
  } catch (error) {
    console.error('Error handling SSE connection:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
