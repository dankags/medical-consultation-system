import DoctorProfilePage from '@/components/profile/doctorProfile-section'
import UserProfilePage from '@/components/profile/userProfile-section'
import { fetchUserData } from '@/lib/actions/user.actions'
import { auth } from '@clerk/nextjs/server'
import { LucideServerOff } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata: Metadata = {
  title: "Profile.",
  description:"This is a page dedicated for user and doctors profile.",
};

export default async function ProfilePage() {
    const [{userId},user]=await Promise.all([auth(),fetchUserData()])
     if(!userId){
        redirect("/auth/sign-in")
      }
      try {
        if(user.error){throw new Error(user.error)}
        if(user.user.role==="user"){
          return(
            <div className='w-full h-[calc(100vh-80px)] flex flex-col '>
            <UserProfilePage/>
            {/* <DoctorProfilePage/> */}
       </div>
        )
        }
        if(user.user.role==="doctor"){

        return(
            <div className='w-full h-[calc(100vh-80px)] flex flex-col  px-3  '>
           <DoctorProfilePage/>
       </div>
        )
        }
        redirect("/")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error:any) {
        console.log(error)
        return(
            <div className='w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center px-3  xl:px-12 2xl:px-32 pb-16 pt-3'>
            <div className='flex flex-col items-center justify-center gap-3 p-4 rounded-md bg-red-800/35'>
            <div className="flex items-center justify-center p-3 mb-4 bg-red-800/70 text-red-500 rounded-full"><LucideServerOff size={35}/></div>
                <h4 className="text-xl font-semibold">!Ooops something went wrong.</h4> 
               <span className="text-red-500">Internal server error</span>
               <Link href={"/profile"} className='mt-4 px-3 py-2 rounded-md bg-red-700/80'>Refresh Page</Link>
           </div>
       </div>
            
        )
      }
}
