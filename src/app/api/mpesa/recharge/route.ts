import { generateMpesaToken, generateSTKPassword } from '@/lib/actions/user.actions';
import { NextResponse } from 'next/server';
import { E164Number } from "libphonenumber-js/core";
import axios from 'axios';
import { auth } from '@clerk/nextjs/server';

interface MpesaRequest {
  time: Date;
  price: number;
  phoneNumber: E164Number;
  userId:string
}

interface MpesaResponse {
  ResponseCode: string;
  CustomerMessage: string;
  CheckoutRequestID: string;
  ResponseDescription: string;
  MerchantRequestID: string;
}

export async function POST(req: Request) {
  // 1. Validate request body
  const body: MpesaRequest = await req.json();
  const {userId:clerkId}=await auth()

  if(!clerkId){
    NextResponse.json(
      { error: 'You have not autheticated to make this request. Please login.' },
      { status: 401 }
    );
  }
  
    
    if (!body.price || !body.phoneNumber || !body.time || !body.userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if(body.price < 500){
      return NextResponse.json(
        { error: 'Minimum price fro recharging is 500 shillings' },
        { status: 400 }
      );
    }
 
  
    // 2. Format phone number
    const phone = body.phoneNumber.toString().replace('+', '');
    if (!/^254\d{9}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }
    const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      // 3. Generate STK password, timestamp and token
      const [tokenResponse,{password, timestamp}]=await Promise.all([generateMpesaToken(),generateSTKPassword(body.time)])
     
    if (tokenResponse?.error) {
      throw new Error(tokenResponse.error);
    }

    // 4. Make STK push request
    const response=await axios
    .post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.M_PESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(1),
        PartyA: phone,
        PartyB: process.env.M_PESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: `${process.env.NEXT_PUBLIC_URL}/api/mpesa/callback?userId=${encodeURIComponent(body.userId)}&time=${body.time}`,
        AccountReference: "CarePulse consoltation.",
        TransactionDesc: "Recharge",
      },
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.token}`,
        },
        signal: controller.signal,
      }
    )
     
    if (response.status !== 200) {
      throw new Error('Payment initiation failed');
    }


    const data: MpesaResponse = await response.data;


    clearTimeout(timeout);

    if (data.ResponseCode === '0') {
      return NextResponse.json({
        msg: "Request is successful done ✔✔. Please enter mpesa pin to complete the transaction",
        status: true,
      },{status:200})
    }

    throw new Error(data.ResponseDescription || 'Payment initiation failed');
  } catch (error) {
    clearTimeout(timeout);
    console.error(error);
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}
