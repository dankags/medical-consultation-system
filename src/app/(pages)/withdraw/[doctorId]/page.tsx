import { auth } from '@clerk/nextjs/server'
import { cache } from "react";
import { redirect } from "next/navigation";
import { fetchUserData} from '@/lib/actions/user.actions';
import type { Metadata } from 'next'
import Withdraw from '@/components/forms/Withdraw';
import UserBalance from '@/components/withdrawComp/UserBalance';

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
    <div className="w-full h-screen min-h-screen flex flex-col md:flex-row items-center justify-center gap-3 px-3  xl:px-12 2xl:px-32 ">
      <div className="w-1/2 h-full hidden md:flex flex-col  gap-3 py-4">
        <h4 className="text-3xl font-bold">CarePulse</h4>
        <UserBalance/>
        <p className="text-base font-normal text-dark-700">{"Thank you for being an essential part of our healthcare community! Your dedication and expertise have made it easier and more affordable for patients to access quality medical consultations from the comfort of their homes. By offering your services through our platform, you are not only transforming lives but also redefining the future of healthcare. We appreciate your commitment to making healthcare more accessible, and we are honored to support you in your journey. Your earnings are a testament to the value you bring to those in need—withdraw with confidence, knowing you’re making a real difference!"}</p>
      </div>
      <div className="w-full md:w-1/2 h-full">
        <Withdraw user={user.user}/>
      </div>
    </div>
  );
}
