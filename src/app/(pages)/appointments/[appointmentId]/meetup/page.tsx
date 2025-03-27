import Doctor from '@/components/videoConfrencing/Doctor';
import Patient from '@/components/videoConfrencing/Patient';
import { fetchUserData, getAppointmentById } from '@/lib/actions/user.actions';
import { Metadata } from 'next';
import React from 'react'
import { FaVideoSlash } from 'react-icons/fa';



type Params = Promise<{ appointmentId: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export const metadata: Metadata = {
  title: "Video confrence meeting",
  description:
    "This is the page where the patient and the doctor meet up virtualy through video confrencing.But the patient must pay first in order to activate the video confrence",
};

export default async function VideoMeetUpPage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params
  const [{user},appointment]=await Promise.all([fetchUserData(),getAppointmentById(params.appointmentId)])
  

 

  if(appointment?.error){
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="text-gray-300">
              <FaVideoSlash size={52} />
            </div>
            <h4 className="font-semibold text-4xl text-gray-300">Sorry!!!</h4>
            <p className="font-medium ">This appointment does not exist.</p>
          </div>
  }
   
 if(user?.role==="admin"){
  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
  <div className="text-gray-300">
    <FaVideoSlash size={52} />
  </div>
  <h4 className="font-semibold text-4xl text-gray-300">Sorry!!!</h4>
  <p className="font-medium ">This page is dedicaated for users and doctors only.</p>
</div>
 }

  return (
    <div className="w-full h-screen min-h-screen flex-col px-3  xl:px-12 2xl:px-32 pb-20 md:pb-0">
      { user?.role === "doctor" ?
      <Doctor appointmentId={params.appointmentId} doctor={user} role={"doctor"}/>
      :
      <Patient appointmentId={params.appointmentId} doctor={appointment?.appointments?.doctor}/>
      }
    </div>
  )
}
