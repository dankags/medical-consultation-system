
import DoctorNotificationEmail from '@/components/emailTemplates/doctorNotification';
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from '@/lib/appwrite.config';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    const appointmentId=req.nextUrl.searchParams.get("appointmentId")!
    const subject=decodeURIComponent(req.nextUrl.searchParams.get("subject")!)

    console.log(subject)

    if ( !appointmentId || !subject) {
      return NextResponse.json(
        { error: 'Missing required query parameters.' },
        { status: 400 }
      );
    }
    
  try {

   const userAppointment = await databases.getDocument(
               DATABASE_ID!,
               APPOINTMENT_COLLECTION_ID!,
               appointmentId,
             );
     console.log(userAppointment.doctor.email)
    if (!userAppointment) {
      return NextResponse.json(
        { error: 'The appointment does not exist or has not been created yet.' },
        { status: 404 }
      );
    }
  
  
    const { data, error } = await resend.emails.send({
      from: `danielkirungu70@gmail.com`,
      to: `danielkirungu70@gmail.com`,
      subject:subject?.toString(),
      react: DoctorNotificationEmail({
        doctor: userAppointment.doctor,
        patient: userAppointment.patient,
        appointmentId,
      })
    });
   console.log("resend Data",data)
   console.log("resend Error:",error)
    if (error) {
      return Response.json({ error }, { status: 500 });
    }
    
    return Response.json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
       return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
