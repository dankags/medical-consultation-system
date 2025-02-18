import { NextResponse } from 'next/server'
import { DATABASE_ID, databases, PAYMENT_COLLECTION_ID, USER_COLLECTION_ID } from '@/lib/appwrite.config';
import { ID } from 'node-appwrite';
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { autoConnect: false });

export async function POST(request: Request) {
const callbackData = await request.json();
const url = new URL(request.url);
const userId = url.searchParams.get('userId');
const time=url.searchParams.get('time')


if (!userId || !time) {
    return NextResponse.json(
        { error: 'UserId or time is required' },
        { status: 400 }
    );
}

if (socket.connected) {
  console.log("🔌 Disconnecting existing socket...");
  socket.disconnect();
}

// 🔗 Reconnect for this transaction
socket.connect();


if(!callbackData.Body){

    return NextResponse.json({message:"mpesa stk response body needed."},{status:400})
  }

  const { Body } = callbackData;

  if(Body.stkCallback.ResultCode !== 0){


        socket.emit("updatePayment", { 
            userId, 
            message: Body.stkCallback.ResultDesc, 
            status: "error" 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, (ack:any) => {
          console.log(ack.success ? "✅ Payment update sent successfully" : "❌ Failed to send payment update:");
          socket.disconnect();
        });
    return NextResponse.json({message:Body.stkCallback.ResultDesc},{status:400})
  }


  const { amount } = Body.stkCallback.CallbackMetadata.Item.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: any, item: any) => {
      acc[item.Name.toLowerCase()] = item.Value; // Convert Name to lowercase and map to Value
      return acc;
    },
    {}
  );

    socket.emit("updatePayment", { 
        userId, 
        amount, 
        message: "Your Payment was processed successfully", 
        status: "success" 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, (ack:any) => {
      console.log(ack.success ? "✅ Payment update sent successfully" : "❌ Failed to send payment update:");
      socket.disconnect();
    });

    try {
        const user = await databases.getDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            userId
            
        );
    
        if (!user) {
          return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
    
        await databases.updateDocument(DATABASE_ID!,USER_COLLECTION_ID!,user.$id,{
            balance: (user.balance || 0) + amount,
          })
        
          const createdPayment= await databases.createDocument(
            DATABASE_ID!,
            PAYMENT_COLLECTION_ID!,
            ID.unique(),
            {
              user:user.$id,
              amount,
              status:"deposited",
              date:new Date(time)
            }
          )

          if(!createdPayment){
            throw new Error('Something went wrong when creating payment.');
          }

          

       
        return NextResponse.json({ message: 'Payment processed successfully' },{status:200});
    } catch (error) {
        console.error('Callback Error:', error)
        return NextResponse.json(
            { error: 'Failed to process callback' },
            { status: 400 }
        )
    }
}