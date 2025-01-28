import { Query } from "node-appwrite";
import { DATABASE_ID, databases, SSE_COLLECTION_ID } from "./appwrite.config";
import { parseStringify } from "./utils";
import StreamStore from '@/lib/streamStore';

// Broadcast data to all clients
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const broadcast =async (data: any) => {
  const clients=await databases.listDocuments(DATABASE_ID!,SSE_COLLECTION_ID!)

  if (clients.total === 0) {
    return { message: 'No clients are currently connected.' };
  }

  const encoder = new TextEncoder();

  for (const client of clients.documents) {
    try {
      const writable = JSON.parse(client.writable); // Deserialize the writable stream
      writable.getWriter().write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    } catch (error) {
      console.error(`Failed to broadcast to user ${client.userId}:`, error);

      // Remove disconnected client from the Appwrite database
      await databases.deleteDocument(DATABASE_ID!, SSE_COLLECTION_ID!, client.$id);
    }
  }

  return { message: 'Broadcast sent to all connected clients.' };

};

// Broadcast data to specific client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const broadcastToSpecificUser=async (userId:string,data:any)=>{
  const streamData = StreamStore.getStream(userId);
  console.log(`{userId:${userId},\ndata:${data},\nstream:${streamData}}`)
  if (!streamData) {
    console.error(`No stream found for userId: ${userId}`);
    return { error: 'User is not connected' };
  }

 
  try {
    const client=await databases.listDocuments(DATABASE_ID!,SSE_COLLECTION_ID!,[Query.equal("userId",userId)])
    console.log(client)
    if(client.total===0){
      return parseStringify({error:"This user is not online ordoes not exist"})
    }
    const { writable } = streamData;
    const encoder = new TextEncoder();
    const writer = writable.getWriter();

    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    
    console.log(`Broadcasted to user: ${userId}`);
    writer.releaseLock();
  } catch (error) {
    console.log(error)
    return parseStringify({error:"Internal server error."})
  }

  return { success: true };
}
