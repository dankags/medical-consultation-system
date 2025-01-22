import { DATABASE_ID, databases, USER_COLLECTION_ID } from '@/lib/appwrite.config';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Query } from 'node-appwrite';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

export async function POST(req: Request) {
  const callbackData = await req.json();
  const { userId } = await auth();

  console.log('Callback Received:', callbackData);

  const { Body } = callbackData;

  const { phoneNumber, amount } = Body.stkCallback.CallbackMetadata.Item.reduce(
    (acc: any, item: any) => {
      acc[item.Name.toLowerCase()] = item.Value;
      return acc;
    },
    {}
  );

  try {
    const user = await databases.listDocuments(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        [Query.equal("phone", phoneNumber!),]
    );

    if (user.total===0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await databases.updateDocument(DATABASE_ID!,USER_COLLECTION_ID!,user.documents[0].$id,{
        balance: (user.documents[0].balance || 0) + amount,
      })

    // await prisma.user.update({
    //   where: { phoneNumber },
    //   data: { balance: user.balance + amount },
    // });

    // await prisma.transaction.create({
    //   data: {
    //     userId: user.id,
    //     amount,
    //     type: 'DEPOSIT',
    //   },
    // });

    return NextResponse.json({ message: 'Payment processed successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}

