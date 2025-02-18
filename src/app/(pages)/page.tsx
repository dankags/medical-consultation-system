import { getTimeOfDay } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatNumber } from '../../lib/utils';
import { FaArrowRight } from "react-icons/fa";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserAppointments, getUserBalance } from "@/lib/actions/user.actions";
import { fetchUserData } from '../../lib/actions/user.actions';
import { DataTable } from "@/components/table/DataTable";
import { doctorAppointmentscolumns, userAppointmentColumns } from "@/components/table/Columns";
import { BiGroup } from "react-icons/bi";


export const metadata: Metadata = {
  title:"Home",
  description: 'Heatlth care consultation system',
};

export const revalidate = 300



export default async function Home() {
  const [{userId},user,res,appointments]=await Promise.all([auth(),fetchUserData(),getUserBalance(),getUserAppointments()])
  
 
  if(!userId||res?.error==="Not Autheticated"){
    redirect("/auth/sign-in")
  }
  return (
    <div className="w-full min-h-screen flex-col px-3  xl:px-12 2xl:px-32 pb-12">
      <h3 className="text-2xl md:text-3xl font-semibold">
        Good {getTimeOfDay()} Daniel
      </h3>
      <section className="w-full flex items-center justify-between my-6">
        <div className="flex flex-col justify-center gap-2">
          <h4 className="text-xl font-semibold text-neutral-100">Balance</h4>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg md:text-xl text-neutral-400">
              Ksh.
            </span>
            <Suspense
              fallback={
                <Skeleton className="w-[150px] h-8 rounded-full bg-neutral-400" />
              }
            >
              <span className="font-mono text-lg md:text-xl">
                {formatNumber(res?.balance)}
              </span>
            </Suspense>
          </div>
        </div>
        {user?.user?.role === "user" && (
          <div className="flex items-center justify-center">
            <Link
              className="py-2 px-3 text-sm md:py-3 md:px-4 flex gap-3 border-2 border-emerald-500 hover:bg-emerald-600/30 rounded-full font-medium"
              href={"/book-doctor"}
            >
              Book Doctor <FaArrowRight size={20} />
            </Link>
          </div>
        )}
      </section>

      <div className=" w-full flex items-center justify-center ">
        <section className="-z-10 relative  w-full h-[200px] md:w-10/12  md:h-[320px] lg:h-[400px] xl:h-[400px]  rounded-md bg-neutral-500">
          <Image
            src={"/assets/images/heroImage2.jpg"}
            alt=""
            fill
            className=" w-full aspect-video object-fit"
          />
        </section>
      </div>

      <section className="my-6 flex flex-col gap-3">
       <div className="flex items-center w-full p-3 justify-start gap-3">
                     <div className="p-3 rounded-md text-white bg-dark-500"><BiGroup size={24}/></div>
                     <h4 className="text-2xl font-semibold">Upcomming Appointments.</h4>
                   </div>
        <Suspense fallback={<AppointmentsSkeleton />}>
          {appointments?.appointments?.length >= 0 ? (
            <>
              {" "}
              {user.user.role !== "doctor" ? (
                <DataTable
                  data={appointments?.appointments}
                  columns={userAppointmentColumns}
                />
              ) : (
                <DataTable
                  data={appointments?.appointments}
                  columns={doctorAppointmentscolumns}
                />
              )}
            </>
          ) : (
            <div className="w-full p-3 flex items-center justify-center text-xl font-semibold">
              {"You Don't Have Any Appointments."}
            </div>
          )}
        </Suspense>
      </section>
    </div>
  );
}

const AppointmentsSkeleton=()=>{
  return(
    <div className="flex flex-col ">
        <div className="w-full flex items-center justify-between py-3 px-2">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full bg-neutral-400"/>
            <div className="flex flex-col gap-2">
            <Skeleton className="w-[200px] h-3 rounded-full bg-neutral-400"/>
            <Skeleton className="w-[150px] h-3 rounded-full bg-neutral-400"/>
            </div>
          </div>
          <div className="hidden md:block">
          <Skeleton className="w-[150px] h-3 rounded-full bg-neutral-400"/>
          </div>
          <div className="">
          <Skeleton className="size-8 rounded-full bg-neutral-400"/>
          </div>
        </div>

        <div className="w-full flex items-center justify-between py-3 px-2">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full bg-neutral-400"/>
            <div className="flex flex-col gap-2">
            <Skeleton className="w-[200px] h-3 rounded-full bg-neutral-400"/>
            <Skeleton className="w-[150px] h-3 rounded-full bg-neutral-400"/>
            </div>
          </div>
          <div className="hidden md:block">
          <Skeleton className="w-[150px] h-3 rounded-full bg-neutral-400"/>
          </div>
          <div className="">
          <Skeleton className="size-8 rounded-full bg-neutral-400"/>
          </div>
        </div>

        <div className="w-full flex md:hidden items-center justify-between py-3 px-2">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full bg-neutral-400"/>
            <div className="flex flex-col gap-2">
            <Skeleton className="w-[200px] h-3 rounded-full bg-neutral-400"/>
            <Skeleton className="w-[150px] h-3 rounded-full bg-neutral-400"/>
            </div>
          </div>
          <div className="hidden md:block">
          <Skeleton className="w-[150px] h-3 rounded-full bg-neutral-400"/>
          </div>
          <div className="">
          <Skeleton className="size-8 rounded-full bg-neutral-400"/>
          </div>
        </div>

        <div className="w-full flex md:hidden items-center justify-between py-3 px-2">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full bg-neutral-400"/>
            <div className="flex flex-col gap-2">
            <Skeleton className="w-[200px] h-3 rounded-full bg-neutral-400"/>
            <Skeleton className="w-[150px] h-3 rounded-full bg-neutral-400"/>
            </div>
          </div>
          <div className="hidden md:block">
          <Skeleton className="w-[150px] h-3 rounded-full bg-neutral-400"/>
          </div>
          <div className="">
          <Skeleton className="size-8 rounded-full bg-neutral-400"/>
          </div>
        </div>

        <div className="flex items-center justify-center py-3">
          <Image src={"/assets/icons/loader.svg"} alt="" height={24} width={24} className="object-cover"/>
        </div>
    </div>
  )
}