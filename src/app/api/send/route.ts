
import { EmailTemplate } from '@/components/email-template';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    const fromEmail=req.nextUrl.searchParams.get("from")!
    const toEmail=req.nextUrl.searchParams.get("to")!
    const subject=req.nextUrl.searchParams.get("subject")!

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail?.toString(),
      to: toEmail?.toString(),
      subject:subject?.toString(),
      react: EmailTemplate({ firstName: 'John' }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}