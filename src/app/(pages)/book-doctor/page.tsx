import Loading from '@/app/loading'
import OnlineDoctorsCards from '@/components/BookingOnlineDoctors/OnlineDoctorCard'
import { fetchUserData } from '@/lib/actions/user.actions'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
  title:"Book Your Doctor",
  description: 'This is a page where the visitors of the wabsite can choose a doctor according to their specialty and pay fees in order to see them.',
};

export default async function BookOnlineDoctors() {
  const {userId}=await auth()
  const {user}=await fetchUserData()
  if(!userId){
    redirect("/auth/sign-in")
  }

 if(user.role !== "user"){
  redirect("/not-found")
 }

  return (
    <Suspense fallback={<Loading/>}>
       <OnlineDoctorsCards/>
    </Suspense>
  )
}
