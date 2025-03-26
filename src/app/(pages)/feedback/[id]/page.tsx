import Loading from '@/app/loading';
import FeedBackForm from '@/components/forms/FeedBackForm';
import { fetchUserData } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react'


type Params = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export const metadata: Metadata = {
    title:"Feedback.",
    description: 'Heatlth care consultation system',
  };

export default async function page(props: {
    params: Params
    searchParams: SearchParams
  }) {
  const {id} = await props.params
  const [{userId},user]=await Promise.all([auth(),fetchUserData()])



  if(!userId){
    redirect("/auth/sign-in")
  }

  if(!id || (user.user.id!==id)){
    redirect("/not-found")
  }

  return (
    <div className="w-full pb-12">
      <Suspense fallback={<Loading/>}>
        <FeedBackForm userId={id}/>
       </Suspense>
    </div>
  )
}
