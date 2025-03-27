import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cn, formatNumber, getTimeOfDay } from '../../lib/utils';
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserAppointments, getUserBalance } from "@/lib/actions/user.actions";
import { fetchUserData } from '../../lib/actions/user.actions';
import { DataTable } from "@/components/table/DataTable";
import { doctorAppointmentscolumns, userAppointmentColumns } from "@/components/table/Columns";
import { BiGroup } from "react-icons/bi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaUserDoctor } from "react-icons/fa6";


export const metadata: Metadata = {
  title:"Home",
  description: 'Heatlth care consultation system',
};

export const revalidate = 300



export default async function Home() {
  const [{userId},{user},res,appointments]=await Promise.all([auth(),fetchUserData(),getUserBalance(),getUserAppointments()])
  
 
  if(!userId||res?.error==="Not Autheticated"){
    redirect("/auth/sign-in")
  }
  if(user.error){
    redirect("/not-found")
  }

  return (
    <div className="w-full min-h-screen flex-col px-3  xl:px-12 2xl:px-32 pb-16 pt-3">
      
      <section className={cn("w-full flex flex-col md:flex-row items-center justify-between gap-3 my-6")}>
        <div className={cn("w-full md:w-6/12 flex flex-col justify-cente gap-2 md:gap-3",user?.role === "doctor"&&"md:w-full md:flex-row justify-between ")}>
        <h3 className="text-xl md:text-3xl font-semibold">
        Good {getTimeOfDay()} {user?.name||"John Doe"}
      </h3>
      <Card className="mt-4 w-full md:w-fit md:mt-0  dark:border-neutral-600 dark:bg-dark-400">
            <CardContent className="flex items-center p-4">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-nowrap">Account Balance</p>
                <p className="text-2xl font-bold text-nowrap">KSh {formatNumber(res?.balance)}</p>
              </div>
            </CardContent>
          </Card>
          </div>
        {user?.role === "user" && (
           <Card className="w-full md:w-4/12 dark:bg-dark-400 dark:border-neutral-600">
           <CardHeader className="flex-row items-center gap-3">
            <div className="p-2 rounded-md dark:bg-dark-500 dark:text-neutral-100"><FaUserDoctor  size={35}/></div>
            <div className="flex flex-col gap-3">
             <CardTitle>Book a Doctor</CardTitle>
             <CardDescription>Schedule a consultation with our specialists</CardDescription>
             </div>
           </CardHeader>
          
           <CardFooter>
             <Link href="/book-doctor" className="w-full">
               <Button className="w-full dark:text-white dark:bg-green-500 dark:hover:bg-green-500/90">Book Appointment</Button>
             </Link>
           </CardFooter>
         </Card>
         
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
       <div className="flex items-center w-full p-3 justify-between gap-3">
                     <div className="flex items-center gap-3">
                       <div className="p-2 md:p-3 rounded-md dark:text-emerald-500 dark:bg-green-500/20"><BiGroup size={24}/></div>
                       <h4 className="text-lg md:text-2xl font-bold tracking-tight">Upcomming Appointments.</h4>
                     </div>
                     <Link href="/appointments" className="">
               <Button variant="outline" size={"sm"} className="w-fit dark:text-white dark:bg-transparent dark:border-neutral-500 dark:hover:border-neutral-100 dark:hover:bg-green-500">View All</Button>
             </Link>
        </div>
        <Suspense fallback={<AppointmentsSkeleton />}>
          {appointments?.appointments?.length >= 0 ? (
            <>
              {" "}
              {user.role !== "doctor" ? (
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