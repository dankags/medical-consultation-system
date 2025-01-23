import { generateMpesaToken } from "@/lib/actions/user.actions";
import { DATABASE_ID, databases, USER_COLLECTION_ID } from "@/lib/appwrite.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { doctorId, amount } = await req.json();
  
    try {
      // Fetch doctor from Appwrite database
      const doctor = await databases.getDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        doctorId
      );
  
    if(!doctor || doctor.role!=="doctor"){
        return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
    }

      if ( (doctor.balance || 0) < amount) {
        return NextResponse.json({ message: 'Insufficient balance' }, { status: 400 });
      }
  
      const token = await generateMpesaToken();
  
      const response = await fetch(
        `${process.env.MPESA_API_URL}/mpesa/b2c/v1/paymentrequest`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            InitiatorName: process.env.MPESA_INITIATOR_NAME,
            SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
            CommandID: 'BusinessPayment',
            Amount: amount,
            PartyA: process.env.MPESA_SHORTCODE,
            PartyB: doctor.phoneNumber,
            Remarks: 'Doctor Withdrawal',
            QueueTimeOutURL: `${process.env.MPESA_CALLBACK_URL}/timeout`,
            ResultURL: `${process.env.MPESA_CALLBACK_URL}/result`,
          }),
        }
      );
  
      if (!response.ok) {
        return NextResponse.json({ message: 'Withdrawal failed' }, { status: 400 });
      }
  
      // Update doctor's balance in Appwrite database
      await databases.updateDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        doctor.$id,
        {
            balance: doctor.balance - amount,
        }
      );
  
      // Create a transaction log in Appwrite
    //   await databases.createDocument(
    //     process.env.APPWRITE_DATABASE_ID as string,
    //     process.env.APPWRITE_TRANSACTION_COLLECTION_ID as string,
    //     'unique()', // Auto-generate an ID
    //     {
    //       userId: doctorId,
    //       amount,
    //       type: 'WITHDRAW',
    //       createdAt: new Date().toISOString(),
    //     }
    //   );
  
      return NextResponse.json({ message: 'Withdrawal successful' });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
    }
  }
  