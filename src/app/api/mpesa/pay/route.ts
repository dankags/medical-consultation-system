import { generateMpesaToken, generateSTKPassword } from '@/lib/actions/user.actions';
import { NextResponse } from 'next/server';
import { E164Number } from "libphonenumber-js/core";

interface MpesaRequest {
  time: Date;
  price: number;
  phoneNumber: E164Number;
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
    
    if (!body.price || !body.phoneNumber || !body.time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    console.log(body)
  
    const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

    try {
    const { password, timestamp } = await generateSTKPassword(body.time);
    // 2. Format phone number
    const phone = body.phoneNumber.toString().replace('+', '');
    if (!/^254\d{9}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
    }
    
    // 3. Generate STK password and token
    const tokenResponse = await generateMpesaToken();
    
    
    if (tokenResponse?.error) {
      throw new Error(tokenResponse.error);
    }
   
    const response =await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: 'POST',
      headers:{
        'Authorization': `Bearer ${tokenResponse.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "BusinessShortCode": process.env.M_PESA_SHORTCODE,
        "Password": `${password}`,
        "Timestamp": `${timestamp}`,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": Math.round(1),
        "PartyA": phone,
        "PartyB": process.env.M_PESA_SHORTCODE,
        "PhoneNumber": phone,
        "CallBackURL": "https://43db-102-215-33-50.ngrok-free.app/",
        "AccountReference": "CarePulse consoltation.",
        "TransactionDesc": "Recharge of CarePulse account." 
      }),
      signal: controller.signal,
    })
      

    const data: MpesaResponse = await response.json();
    clearTimeout(timeout);

    if (data.ResponseCode === '0') {
      return NextResponse.json({ success: true, data },{status: 200});
    }

    throw new Error(data.ResponseDescription || 'Payment initiation failed');
  } catch (error) {
    clearTimeout(timeout);
    console.error(error);
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}