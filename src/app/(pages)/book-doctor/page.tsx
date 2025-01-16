import Loading from '@/app/loading'
import OnlineDoctorsCards from '@/components/BookingOnlineDoctors/OnlineDoctorCard'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title:"Book Your Doctor",
  description: 'This is a page where the visitors of the wabsite can choose a doctor according to their specialty and pay fees in order to see them.',
};

export default async function BookOnlineDoctors() {
  const {userId}=await auth()
  if(!userId){
    redirect("/auth/sign-in")
  }
  return (
    <Suspense fallback={<Loading/>}>
       <OnlineDoctorsCards/>
    </Suspense>
  )
}
