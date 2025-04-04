import SignInForm from '@/components/forms/SignInForm'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Login() {
 const {userId}=await auth()

 if(userId){
  redirect("/")
 }

  return (
    <div className="w-full h-screen min-h-screen flex ">
      <ScrollArea className='w-full md:w-1/2'>
  <section className="remove-scrollbar container my-auto">
    <div className="sub-container max-w-[496px]">
      <Image src="/assets/icons/logo-full.svg" alt="patient" width={1000} height={1000} className="h-10 w-fit mb-12" />

     <SignInForm/>
     <div className="w-full flex items-center justify-center gap-2 mt-8">
      <span className="text-dark-700">Do not have an account?</span>
      <Link href={"/auth/sign-up"} className='text-green-500 font-semibold hover:underline hover:text-green-400'>Sign-up</Link>
     </div>
      <div className="text-14-regular mt-20 flex justify-between">
        <p className="justify-items-end text-dark-600 xl:text-left">
          © 2024 CarePluse
        </p>
        <Link href="/?admin=true" className="text-green-500">
          Admin
        </Link>
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
  className="side-img max-w-[50%] "
/>
</div>
  )
}
