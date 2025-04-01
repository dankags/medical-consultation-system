import { auth } from '@clerk/nextjs/server'
import { cache, Suspense } from "react";
import { redirect } from "next/navigation";
import { fetchUserData, getDoctorsPatients, getUserAppointments } from '@/lib/actions/user.actions';
import Loading from '@/app/loading';
import { DataTable } from '@/components/table/DataTable';
import { FaUserDoctor } from "react-icons/fa6";
import type { Metadata } from 'next'
import {  doctorAppointmentscolumns, userAppointmentColumns } from '@/components/table/Columns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar} from 'lucide-react';
import CreateAppointmentButton from '@/components/appointments/doctor/create-apointment-button';
import { Skeleton } from '@/components/ui/skeleton';

const getUser=cache(async()=>{
  const data=await fetchUserData()
  return data
})

export async function generateMetadata(): Promise<Metadata> {
    const user = await getUser()

    if(user?.error){
      return {
        title: `404 user not found`,
        description:`This page is dedicated for users to appointment history and rescheduling but it seems that the user wasn't found.`
      }
    }

    return {
      title: `${user.user.role==="doctor"?`Dr. ${user.user.name}`:`${user.user.name}`} appointments`,
      description:`This page contains all ${user.user.name} appointments with the ${user.user.role==="doctor"?"patient":"doctor"}`
    }
  }

export default async function AppointmentsPage() {
    const [{userId},allAppointments,user]=await Promise.all([auth(),getUserAppointments(),getUser()])
    
 
      if(!userId){
         redirect("/auth/sign-in")
       }

      if(!allAppointments || allAppointments.error || user.error){
        return(
          <div className="w-full h-[calc(100vh-80px)] flex flex-col gap-3 items-center justify-center text-red-500">
          <span className="text-2xl font-semibold">Ooops!</span>
          <span className="">Internal Server Error.</span>
          </div>
        )
      } 
      const doctorPatients=await getDoctorsPatients(user.user.id,user.user.role)
     

  return (
    <div className="w-full h-[calc(100vh-80px)] flex-col px-3  ">
      <ScrollArea className="w-full h-full pb-16 md:pb-4">
        <div className="w-full space-y-4">
        {user.user.role==="doctor"?
        <div className='w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6'>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            Doctor&apos;s Appointments
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-neutral-400">
            Manage your patient appointments and consultations
          </p>
        </div>
         
         {doctorPatients.error?<></>:<div className="">
         <Suspense fallback={<div><Skeleton className='w-[100px] h-3 rounded-md'/></div>}>
         <CreateAppointmentButton patients={doctorPatients.patients} />
         </Suspense>
         </div>}
      </div>
      :
      <div className='w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6'>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              
              <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
             
            </div>
            Appointments
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-neutral-400">
            Manage your upcoming and past medical consultations
          </p>
        </div>
      </div>
      }
      <Suspense fallback={<Loading />}>
        {allAppointments?.appointments.length > 0 ? (
          <div className="">
            {user.user.role !== "doctor" ? (
              <DataTable
                data={allAppointments?.appointments}
                columns={userAppointmentColumns}
              />
            ) : (
              <DataTable
                data={allAppointments?.appointments}
                columns={doctorAppointmentscolumns}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="text-gray-300">
              <FaUserDoctor size={52} />
            </div>
            <h4 className="font-semibold text-4xl text-gray-300">Sorry!!!</h4>
            <p className="font-medium "> You do not have any appointments</p>
          </div>
        )}
      </Suspense>
      </div>
      </ScrollArea>
    </div>
  );
}
