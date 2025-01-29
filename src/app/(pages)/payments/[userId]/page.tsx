import { fetchUserData } from '@/lib/actions/user.actions'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React, { cache, Suspense } from 'react'
import { getUserPayments } from '@/lib/actions/user.actions'
import { MdOutlinePayment } from 'react-icons/md'
import Loading from '@/app/loading'
import { DataTable } from '@/components/table/DataTable'
import { PaymentsColumns } from '@/components/table/Columns'

const getUser=cache(async()=>{
  const data=await fetchUserData()
  return data
})

export async function generateMetadata() {

  const data=await fetchUserData()
  if(data?.error){
    return {
      title: `404 user not found`,
      description:`This page is dedicated for users to preview the doctor before booking a session with the doctor.`
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
    <div className='w-full h-full '>
      <div className="flex items-center w-full p-3 justify-start gap-3">
        <div className="p-3 rounded-md text-white bg-dark-500"><MdOutlinePayment size={24}/></div>
        <h4 className="text-3xl font-semibold">Payments</h4>
      </div>
      <Suspense fallback={<Loading/>}>
         {userPayments.error?
         <div className="w-full h-[calc(100vh-80px)] flex flex-col gap-3 items-center justify-center text-red-500">
          <span className="text-2xl font-semibold">Ooops!</span>
          <span className="">{userPayments.error}</span>
          </div>
         :
         <div className="w-full h-full p-3">
         {userPayments.payments?.length>0
         ?
         <DataTable data={userPayments.payments} columns={PaymentsColumns}/>
         :
         <div className="w-full h-[calc(100vh-80px)] flex flex-col gap-3 items-center justify-center ">
          <span className="text-2xl font-semibold text-gray-500">Ooops!</span>
          <p className="">You have not yet made any payment recently.</p>
          </div>
          }
          </div>
         }
      </Suspense>
    </div>
  )
}
