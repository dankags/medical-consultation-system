
<div align="center">
  <br />
      <img src="public/assets/icons/logo-full.svg" alt="Project Banner">

  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Appwrite-black?style=for-the-badge&logoColor=white&logo=appwrite&color=FD366E" alt="appwrite" />
    <img src="https://img.shields.io/badge/-SocketIo-black?style=for-the-badge&logoColor=white&logo=socketdotio&color=010101" alt="appwrite" />
     <img src="https://img.shields.io/badge/-Clerk-black?style=for-the-badge&logoColor=white&logo=clerk&color=6C47FF" alt="appwrite" />

  </div>

  <h3 align="center">A Digital Health Consoltation System.</h3>
</div>

## <a name="introduction">🤖 Introduction</a>

A Digital Health Consoltation System application that allows patients to easily register, book a video confernce, and manage their appointments with doctors, featuring administrative tools for scheduling, confirming, and canceling appointments, along with SMS, Socket and email notifications, all built using Next.js.
## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- Appwrite 
- Typescript
- TailwindCSS
- ShadCN
- Twilio
- Socket.IO
- Livekit
- Clerk
- M-Pesa
- ngrok
- Email.js

## <a name="features">🔋 Features</a>

👉 **Register as a Patient**: Users can sign up and create a personal profile.

👉 **Book a New Appointment with Doctor**: Patients can schedule appointments with doctors at their convenience and can book multiple appointments.

👉 **Confirm/Schedule Appointment from Doctors Side**: Doctors can confirm and set appointment times to ensure they are properly scheduled.

👉 **Cancel Appointment from Doctor Side**: Doctors have the ability to cancel any appointment as needed.

👉 **Send SMS on Appointment Confirmation**: Patients receive SMS notifications to confirm their appointment details.

👉 **Send live notification and booking request**: patients are able to send live booking request to online doctors and also notification through the help of [socketIO](https://socket.io/docs/v4/).

👉 **Send Email on Appointment Confirmation**: patients can be able to send notification to doctors about their appointment and also scheduled appointment so they could put it on their calender as a reminder.

👉 **M-Pesa**: patients can be able to pay for any appointment through m-pesa and also the doctors can withdraw from the app using the [M-Pesa Daraja](https://developer.safaricom.co.ke/).

👉 **Video confrencing meeting**: patients can be able to meet with the doctor they like through the video call in the app this is achieved by the use of [LiveKit](https://livekit.io/use-cases/video-conferencing).

👉 **Complete Responsiveness**: The application works seamlessly on all device types and screen sizes.

👉 **File Upload Using Appwrite Storage**: Users can upload and store files securely within the app using Appwrite storage services.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/dankags/medical-consultation-system.git

```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:


```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
PROJECT_ID=
DATABASE_ID=
APP_WRITE_API_KEY=
PATIENT_COLLECTION_ID=
USER_COLLECTION_ID=
SSE_COLLECTION_ID=
PAYMENT_COLLECTION_ID=
REVIEWS_COLLECTION_ID=
DOCTOR_COLLECTION_ID=
APPOINTMENT_COLLECTION_ID=
NEXT_PUBLIC_BUCKET_ID=
NEXT_PUBLIC_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_URL= #http://localhost:3000 for development or your domain in production
PORT=3000
NEXT_PUBLIC_ADMIN_PASSKEY=1111
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
RESEND_API_KEY=
NEXT_PUBLIC_SERVICE_ID=
NEXT_PUBLIC_TEMPLATE_ID=
NEXT_PUBLIC_PUBLIC_KEY=
M_PESA_SHORTCODE=
M_PESA_PASSKEY=
M_PESA_CONSUMER_KEY=
M_PESA_CONSUMER_SECRET=
M_PESA_API_URL=

```

Replace the placeholder values with your actual Appwrite credentials. You can obtain these credentials by signing up on the [Appwrite website](https://appwrite.io/).

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.


## Learn More

To learn more about the technologies used, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Clerk](https://clerk.com/docs) which i used for authetication and API route and pages routes protection.
- [Shadcn](https://ui.shadcn.com/docs/installation/next) - i used shadcn which is a rich UI library which makes development much faster.
- [Mpesa](https://developer.safaricom.co.ke/) - Since the project is centraled more on `Kenya` i used mpesa to make transaction like deposit for `users` and withdraws for `doctors`.
- [ngrok](https://ngrok.com/) - I used it to test the mpesa APIs in development mode since it does not support http.
- [Twilio](https://www.twilio.com/docs) - i used twilio which support `sms` which i used to notify patients if there were any new appointments.
- [Appwrite](https://appwrite.io/) - this is the web app memory or database for both files and documents.
- [SocketIO](https://socket.io/docs/v4/) - patients are able to send live booking request to online doctors and also notification.
- [LiveKit](https://livekit.io/use-cases/video-conferencing) - This is an open source kit with many features like `Video Confrencing`, `Video Streaming` and `Voice agent` that you can intergrate with your app to have the above features.
- [Email.js](https://www.emailjs.com/docs/examples/reactjs/) - i used this in order to send email between the doctors and patients.

## Deployment

For deployment we could have used [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

But since vercel does not support socket server you could use alternatives like [render](https://render.com/) as your choice or you could search online for deployment platforms that support socket serve.

Check out our example [Example](https://medical-consultation-system.onrender.com)
