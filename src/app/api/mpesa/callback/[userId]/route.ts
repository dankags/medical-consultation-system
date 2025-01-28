import { DATABASE_ID, databases, USER_COLLECTION_ID } from '@/lib/appwrite.config';
import {  NextResponse } from 'next/server';


export async function POST(req: Request,
  { params }: { params: Promise<{ userId: string }> }) {
  const callbackData = await req.json();
  const userId = (await params).userId
  
  console.log(callbackData,userId)

  if(!userId){
    return NextResponse.json({message:"Please provide the userId of the customer who initiated the payment."},{status:400})
  }

  if(!callbackData.Body){
    return NextResponse.json({message:"mpesa stk response body needed."},{status:400})
  }

  const { Body } = callbackData;

  if(Body.stkCallback.ResultCode !== 0){
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
   
    return NextResponse.json({ message: 'Payment processed successfully' },{status:200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}

