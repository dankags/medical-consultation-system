import { NextResponse } from 'next/server';
import { generateMpesaToken } from '@/utils/mpesaToken';

export async function POST(req: Request) {
  const { amount, phoneNumber } = await req.json();

  try {
    const token = await generateMpesaToken();

    const response = await fetch(
      `${process.env.MPESA_API_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: process.env.MPESA_PASSWORD,
          Timestamp: new Date().toISOString().replace(/[-:.TZ]/g, ''), // YYYYMMDDHHMMSS
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: phoneNumber,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: 'MedicalConsultation',
          TransactionDesc: 'Payment for Consultation',
        }),
      }
    );

    const data = await response.json();

    if (data.ResponseCode === '0') {
      return NextResponse.json({ message: 'Payment initiated successfully', data });
    } else {
      return NextResponse.json({ message: 'Payment initiation failed', data }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  }
}