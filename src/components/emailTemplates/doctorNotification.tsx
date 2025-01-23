import React from 'react'
import { Body, Button,  Container, Head, Heading,  Html, Img,  Preview,  Section, Text, Tailwind } from '@react-email/components';

interface AppointmentEmailProps{
    doctor:User;
    patient:User;
    appointmentId:string
}
const baseUrl=process.env.NEXT_PUBLIC_UR!

const DoctorNotificationEmail = ({doctor,patient,appointmentId}:AppointmentEmailProps) => {
    const previewText = `Appointment Notification from CarePulse by ${patient?.name} who is a patient !`;
  return (
    <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Tailwind>
    <Body className="bg-white my-auto mx-auto font-sans">
      <Container className="my-10 mx-auto p-5 w-[465px]">
        <Section className="mt-8">
          <Img
            src={`https://res.cloudinary.com/dxqbb56ul/image/upload/v1735905021/logo-full_ega1dk.svg`}
            width="80"
            height="80"
            alt="Logo Example"
            className="my-0 mx-auto"
          />
        </Section>
        <Heading className="text-2xl font-normal text-center p-0 my-8 mx-0">
        <strong>CarePulse</strong>, appointment with  {patient.name}!
        </Heading>
        <Text className="text-sm">
          Hello Dr. {doctor?.name},
        </Text>
        <Text className="text-sm">
          We&apos;re excited to infor you that you have an appointment with {patient?.name}.
        </Text>
        <Section className="text-center mt-[32px] mb-[32px]">
            <Button
              className="bg-green-500 px-5 py-3 rounded text-white text-xs font-semibold no-underline text-center"
              href={`${baseUrl}/appointments/${appointmentId}/meetup`}
            >
              Create meeting
            </Button>
        </Section>
        <Text className="text-sm">
          The CarePulse Team appreciate you for your service.
        </Text>
      </Container>
    </Body>
    </Tailwind>
  </Html>
  )
}

export default DoctorNotificationEmail