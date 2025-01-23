import Loading from '@/app/loading'
import { getDoctorPreview } from '@/lib/actions/patient.actions'
import { redirect } from 'next/navigation'
import React, { cache, Suspense } from 'react'
import Image from 'next/image';
import BookingBtn from '@/components/BookingOnlineDoctors/BookingBtn';
import PreviewDoctorOnlineBanner from '@/components/BookingOnlineDoctors/PreviewDoctorOnlineBanner';

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
type Doctor={
  name: string,
  rating: number,
  specialty: string[],
  title: string|null,
  description: string,
  doctorId:string,
}


const doctorData=cache(async(id:string,doctorId:string)=>{
  try {
    const data = await getDoctorPreview(id, doctorId);
    return data;
  } catch (err) {
    console.error(`Error fetching doctor data for id: ${id}, doctorId: ${doctorId}`, err);
    return { error: "Failed to fetch doctor data" };
  }
})

export async function generateMetadata(props:{
  params: Params
  searchParams: SearchParams
}) {

  const params = await props.params
    const searchParams = await props.searchParams

    const doctorId =
    typeof searchParams.doctorId === "string"
      ? searchParams.doctorId
      : Array.isArray(searchParams.doctorId)
      ? searchParams.doctorId[0]
      : undefined;

  if (!doctorId) {
    throw new Error("doctorId is missing or invalid.");
  }

    const data=await doctorData(params.id,doctorId)
  if(data?.error){
    return {
      title: `404 doctor not found`,
      description:`This page is dedicated for users to preview the doctor before booking a session with the doctor.`
    }
  }

  return {
    title: `preview Dr. ${decodeURIComponent(data?.name)}`,
    description:`This page is dedicated for users to preview the doctor before booking a session with the doctor.`
  }
}

export default async function PreviewDoctor (props: {
    params: Params
    searchParams: SearchParams
  }) {

    const params = await props.params
    const searchParams = await props.searchParams
    const doctorId =
    typeof searchParams.doctorId === "string"
      ? searchParams.doctorId
      : Array.isArray(searchParams.doctorId)
      ? searchParams.doctorId[0]
      : undefined;

  
    if(!params || !searchParams || !doctorId){
        redirect("/not-found")
    }
    const data=await doctorData(params.id,doctorId)
    if(data?.error){
      redirect("/not-found")
    }
    const doctor:Doctor=data as Doctor
    


  return (
    <Suspense fallback={<Loading/>}>
    <div className='w-full flex flex-col gap-12 md:gap-24 lg:gap-36'>
      <div className="relative w-full ">
        <div className="w-full h-[300px] relative">
          <Image src={"/assets/images/noimage3.jpg"} alt="" priority fill className=' object-center' />
        </div>
        <div className="w-5/12 md:w-3/12 lg:w-2/12 aspect-square rounded-full absolute top-2/3 left-0 right-0 m-auto  ring-8 ring-dark-300">
        <Image src={"/assets/images/noavatar.jpg"} alt="" priority width={200} height={200} className='w-full aspect-square object-cover rounded-full' />
        <div className="absolute top-0  right-4 sm:right-7 ">
          <PreviewDoctorOnlineBanner doctorId={params.id}/>
        </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-3 p-3 relative">
        <div className="w-full flex flex-col gap-3 mb-8 relative">
          <h4 className="text-4xl font-bold capitalize truncate">Dr. {doctor?.name||"John Doe"}</h4>
          <span className="text-2xl">Rarting: {doctor?.rating}</span>
          <div className="absolute right-4 -bottom-2 md:top-1/2 md:-translate-y-1/2"> <BookingBtn doctorId={params.id} doctor={doctor}/></div>
          
        </div>
        <div className="flex flex-col gap-3">
        <h4 className="text-2xl font-bold capitalize">{doctor?.title||"No title"}</h4>
        <p className="text-base">{doctor?.description||""}</p>
        <h4 className="text-2xl font-bold capitalize">Skills</h4>
         <div className="flex items-center flex-wrap gap-3">
         {doctor?.specialty?.length>0
    ? doctor.specialty.map((item, i) => (
        <div className="px-3 py-2 bg-neutral-600 rounded-full" key={i}>
          {item}
        </div>
      ))
    : "No specialties available"}
         </div>
        </div>
      </div>
    </div>
    </Suspense>
  )
}
