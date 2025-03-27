import { auth } from '@clerk/nextjs/server'
import { cache } from "react";
import { redirect } from "next/navigation";
import { fetchUserData} from '@/lib/actions/user.actions';
import type { Metadata } from 'next'
import WithdrawalPage from '@/components/forms/withdraw-test';

const getUser=cache(async()=>{
  const data=await fetchUserData()
  return data
})

export const metadata: Metadata = {
  title:"Withdraw Cash.",
  description: 'Heatlth care consultation system',
};

export default async function AppointmentsPage() {
    const [{userId},user]=await Promise.all([auth(),getUser()])
 
      if(!userId){
         redirect("/auth/sign-in")
       }


      if( user.error){
        return(
          <div className="w-full h-[calc(100vh-80px)] flex flex-col gap-3 items-center justify-center text-red-500">
          <span className="text-2xl font-semibold">Ooops!</span>
          <span className="">Internal Server Error.</span>
          </div>
        )
      } 


      if(user.user.role!=="doctor"){
        redirect("/not-found")
      }

  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col  ">
     <WithdrawalPage/>
    </div>
  );
}
