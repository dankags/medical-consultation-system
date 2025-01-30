import { auth } from '@clerk/nextjs/server'
import { cache, Suspense } from "react";
import { redirect } from "next/navigation";
import { fetchUserData, getUserAppointments } from '@/lib/actions/user.actions';
import Loading from '@/app/loading';
import { DataTable } from '@/components/table/DataTable';
import { FaUserDoctor } from "react-icons/fa6";
import type { Metadata } from 'next'
import {  doctorAppointmentscolumns, userAppointmentColumns } from '@/components/table/Columns';
import { BiGroup } from 'react-icons/bi';

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

  return (
    <div className="w-full h-screen min-h-screen flex-col px-3  xl:px-12 2xl:px-32 ">
       <div className="flex items-center w-full p-3 justify-start gap-3">
              <div className="p-3 rounded-md text-white bg-dark-500"><BiGroup size={24}/></div>
              <h4 className="text-3xl font-semibold">Appointments</h4>
            </div>
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
  );
}
