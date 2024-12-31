import { auth } from '@clerk/nextjs/server'
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { fetchUserData, getUserAppointments } from '@/lib/actions/user.actions';
import Loading from '@/app/loading';
import { DataTable } from '@/components/table/DataTable';
import { FaUserDoctor } from "react-icons/fa6";
import type { Metadata } from 'next'
import {  userAppointmentColumns } from '../../../components/table/Columns';


  export async function generateMetadata(): Promise<Metadata> {
    const user = await  fetchUserData()

    return {
      title: `${user.user.name} appointments`,
      description:`This page contains all ${user.user.name} appointments with the ${user.user.role==="doctor"?"patient":"doctor"}`
    }
  }

export default async function AppointmentsPage() {
     const {userId}=await auth()
    const allAppointments= await getUserAppointments()
 
      if(!userId){
         redirect("/auth/sign-in")
       }

  return (
    <div className="w-full h-screen min-h-screen flex-col px-3  xl:px-12 2xl:px-32 ">
    <Suspense fallback={<Loading/>}>
        {allAppointments?.appointments.length>0 ? 
        <div className="">
          <DataTable data={allAppointments?.appointments} columns={userAppointmentColumns} />
        </div>
        :
        <div className='w-full h-full flex flex-col items-center justify-center gap-3'>
          <div className="text-gray-300">
          <FaUserDoctor size={52}/>
          </div>
          <h4 className="font-semibold text-4xl text-gray-300">Sorry!!!</h4>
         <p className='font-medium '> You do not have any appointments</p>
          </div>}
    </Suspense>
    </div>
  )
}
