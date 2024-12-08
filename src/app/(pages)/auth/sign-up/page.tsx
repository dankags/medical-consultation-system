import SignUpForm from '@/components/forms/signupForm';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { SignUp } from '@clerk/nextjs';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'


export const metadata: Metadata = {
  title:"Sign-up",
  description: 'Heatlth care consultation system',
};

export default function Register() {
  return(
     <div className="w-full h-screen min-h-screen flex ">
      <ScrollArea className='w-full md:w-1/2'>
  <section className="remove-scrollbar container my-auto">
    <div className="sub-container max-w-[496px]">
      <Image src="/assets/icons/logo-full.svg" alt="patient" width={1000} height={1000} className="h-10 w-fit mb-12" />

     <SignUpForm/>

      <div className="text-14-regular mt-20 flex justify-between">
        <p className="justify-items-end text-dark-600 xl:text-left">
          © 2024 CarePluse
        </p>
     
      </div>
    </div>
  

  </section>
  <ScrollBar/>
  </ScrollArea>
  <Image
  src="/assets/images/onboarding-img.png"
  height={1000}
  width={1000}
  alt="patient"
  className="side-img max-w-[50%] rounded-l-lg"
/>
</div>
  );
}