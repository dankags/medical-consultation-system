import { fetchUserData } from '@/lib/actions/user.actions'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React, { cache, Suspense } from 'react'
import { getUserPayments } from '@/lib/actions/user.actions'
import Loading from '@/app/loading'
import { CreditCard } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import DoctorPaymentTabs from '@/components/payments/doctor/DoctorPaymentTabs'
import UserPaymentTabs from '@/components/payments/patient/UserPaymentTabs'


const getUser=cache(async()=>{
  const data=await fetchUserData()
  return data
})

export async function generateMetadata() {

  const data=await getUser()
  if(data?.error){
    return {
      title: `404 user not found`,
      description:`This page is dedicated for users to payment history but it seems that the user wasn't found.`
    }
  }

  return {
    title: `${decodeURIComponent(data?.user.name)} payment history.`,
    description:`This page is dedicated for users to payment history.`
  }
}

export default async function Payments() {
  const [{userId},user]=await Promise.all([auth(),getUser()])
  if(!userId || !user || user.error ){
    return redirect("/not-found")
  }
  const userPayments=await getUserPayments(user?.user.id)

  return (
    <div className='w-full h-[calc(100vh-80px)] '>
      <ScrollArea className="w-full h-full pb-20 md:pb-0">
        <div className="w-full ">
       <div className='mx-auto px-4 py-6'>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg dark:bg-emerald-900/30">
            <CreditCard className="h-5 w-5 dark:text-emerald-400" />
          </div>
          Payments
        </h1>
        <p className="mt-1.5 text-sm dark:text-neutral-400">Manage your payments and transaction history</p>
      </div>
      <Suspense fallback={<Loading/>}>
         {userPayments.error?
         <div className="w-full h-[calc(100vh-80px)] flex flex-col gap-3 items-center justify-center text-red-500">
          <span className="text-2xl font-semibold">Ooops!</span>
          <span className="">{userPayments.error}</span>
          </div>
         :
         <div className="w-full h-full p-3">
          {user.user.role==="doctor" ?
        <DoctorPaymentTabs transactions={userPayments.payments}/>
         :
        <UserPaymentTabs transactions={userPayments.payments}/>
        }
          </div>
         }
      </Suspense>
      </div>
      </ScrollArea>
    </div>
  )
}
