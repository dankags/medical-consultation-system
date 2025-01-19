"use client"
import { fetchAPI } from '@/lib/fetch';
import { useSocket } from '@/stores/useSocket'
import Image from 'next/image';
import React, { useEffect,useState } from 'react'
import { Button } from '../ui/button';
import OnlineBanner from './OnlineBanner';
import { Input } from '../ui/input';
import { BiSearch } from "react-icons/bi";
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { useBalance } from '@/stores/useBalance';
import { useAuth } from '@clerk/nextjs';
import { DefaultEventsMap, Socket } from 'socket.io';

type OnlineDoctor={
  id:string;
  newUserId:string;
  role:"doctor"
}
type DoctorCard={
  id:string;
  doctorId:string;
  name:string;
  specialty:string[];
  description:string;
}

const OnlineDoctorsCards = () => {
    const {socket}=useSocket()
    const [onlineDoctors,setOnlineDoctors]=useState<OnlineDoctor[]>([])
    const [doctors,setDoctors]=useState<DoctorCard[]>([])
    const [isFetchingDoctorsInfo,setIsFetchingDoctorsInfo]=useState(true)
    const [searchInput,setSearchInput]=useState("")
    const [isInitialRender,setIsInitialRender]=useState(true)
    const [filteredDoctors,setFilteredDoctors]=useState<DoctorCard[]>([])
  
    useEffect(()=>{
      
      if (!socket) return;
      setIsInitialRender(false)
  const controller = new AbortController();

  const handleGetOnlineDoctors = (doctors: OnlineDoctor[]) => {
    if(!isInitialRender){
      setOnlineDoctors(doctors);
      return
    }
    setTimeout(() => {
    setOnlineDoctors(doctors);
    },10000)

  };

  const fetchDoctorInfo = async () => {
    if (onlineDoctors.length === 0) {
      setDoctors([]);
      return;
    }

    setIsFetchingDoctorsInfo(true);
    const doctorsIds = onlineDoctors.map((item) => item.newUserId);

    try {
      const res = await fetchAPI("/api/getDoctorsInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ doctorsIds }),
        signal: controller.signal
      });
      if (res.error) {
        throw new Error(res.error);
      }
      setDoctors(res);
    } catch (error) {
      console.log("Error fetching Doctor Info:", error);
    } finally {
      setIsFetchingDoctorsInfo(false);
    }
  };

  // Initial load
  socket.on("getOnlineDoctors", handleGetOnlineDoctors);

  // Fetch doctor info whenever onlineDoctors changes
  fetchDoctorInfo();

  // Poll for online doctors every 10 seconds
  const intervalId = setInterval(() => {
    console.log("refreshing online doctors");
    socket.off("getOnlineDoctors", handleGetOnlineDoctors);
    socket.on("getOnlineDoctors", handleGetOnlineDoctors);
  }, 10000);

  // Cleanup
  return () => {
    socket.off("getOnlineDoctors", handleGetOnlineDoctors);
    clearInterval(intervalId);
    controller.abort();
  };
    },[socket,onlineDoctors])

  

   console.log(onlineDoctors)

    const handleSearchSpecialty=()=>{
      const regex = new RegExp(`${searchInput}`, "i");
      const searchedDoctors=doctors.filter(item => item.specialty.some(spec => regex.test(spec)))
      setFilteredDoctors(searchedDoctors)
    }



  return (
    <div className=" w-full h-[calc(100vh-80px)] ">
      <ScrollArea className="w-full h-full ">
        <div className="w-full flex flex-col gap-3 relative">
          <div className="z-10 py-1 sticky top-0  flex items-center justify-center bg-dark-300 ">
            <div className="w-11/12 md:w-8/12 lg:w-5/12  flex items-center p-2 ring-2 ring-neutral-500 rounded-full focus-within:bg-neutral-800 focus-within:ring-neutral-200 ">
              <Input
                type="text"
                onChange={(e)=>setSearchInput(e.target.value)}
                placeholder="Search by doctor specialty..."
                className="border-none ring-0 ring-offset-0 bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0 "
              />
              <Button
                variant={"secondary"}
                onClick={handleSearchSpecialty}
                className={`p-3 capitalize bg-green-500 rounded-full active:bg-green-500/75`}
              >
                <BiSearch size={24} />
              </Button>
            </div>
          </div>
          {onlineDoctors.length>0?(<div className="w-full  grid grid-flow-row md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-3  p-3">
            {!isFetchingDoctorsInfo ? (
              <>
               {(filteredDoctors.length > 0 ? filteredDoctors : doctors).map((doctor) => (
      <OnlineDoctorCard key={doctor.id} doctor={doctor} doctors={onlineDoctors} socket={socket}/>
    ))}
              </>
            ) : (
              <>
                 {Array.from({ length: 10 }).map((_, index) => (
      <OnlineDoctorCardSkeleton key={index} />
    ))}
              </>
            )}
          </div>):(
            <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3">
               <span className="text-3xl text-gray-400 font-semibold">!Ooops</span>
               <span className="">There no doctors who are currently online.</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

const OnlineDoctorCard=({doctor,socket}:{doctor:DoctorCard,socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null})=>{
  const router=useRouter()
  const {balance,setBalance}=useBalance()
  const {userId}=useAuth();
  const [isUserOnline,setIsUserOnline]=useState(true)

  
    useEffect(()=>{
       if(!socket) return
       
      const handleGetUsers = (users:OnlineDoctor[]) => {
        if(users?.some((user) => user.newUserId === userId)){
          setIsUserOnline(true)
          return
      }
      setIsUserOnline(false)
      return
        };
  
      socket?.on("getOnlineDoctors",handleGetUsers)
      return () => {
          if (socket) {
            socket.off("getOnlineDoctors", handleGetUsers);
          }
        };
     },[socket,doctor])

 

  const handleBooking=async()=>{
    if(!isUserOnline){
       toast({
         variant:"destructive",
         title:"!Ooops something went wrong",
         description:"The doctor you tryng to book is currently offline."
       })
       return
    }
    if(!balance || balance < 500){
      toast({
        variant:"destructive",
        title:"!Ooops something went wrong",
        description:"You have insufficient funds to book this session.",
        action:<Button variant={"outline"} onClick={()=>router.push(`/deposit/${userId}`)}>Recharge</Button>
      })
      return
    }

  }

  return (
    <div className="col-span-1 p-3 flex flex-col gap-3 bg-dark-400 rounded-md">
    <div className="w-full flex items-center gap-3 relative">
      <div className=" relative w-1/12 aspect-auto rounded-full bg-neutral-600">
        
        <Image
          src={"/assets/images/noavatar.jpg"}
          alt="doctor"
          height={120}
          width={120}
          priority
          className=" w-full aspect-square rounded-full"
        />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <h4 className="capitalize font-semibold  truncate">
          Dr. {doctor?.name||"john doe"}
        </h4>
        <p className="flex items-center gap-1">
        {doctor?.specialty.map((item,i)=>{
          if((doctor?.specialty.length-1)===i){
            return(
              <span key={i} className="capitalize truncate text-sm font-medium  text-gray-400">
              {` ${item}`}
            </span>
            )
          }
         return(<span key={i} className="capitalize truncate text-sm font-medium  text-gray-400">
          {`${item} | `}
        </span>) 
      })}
       </p>
       
      </div>
      <div className="absolute top-3 right-3">
      <OnlineBanner userId={doctor?.id}/>
      </div>
    </div>
    <p className="text-sm font-thin line-clamp-2">
          {doctor?.description||""}
        </p>
        <div className="flex items-center justify-end gap-3">
          <Button variant={"link"} className={`capitalize`} onClick={()=>router.push(`/book-doctor/preview/${doctor.id}?doctorId=${doctor.doctorId}`)}>
            Preview Doctor
          </Button>
          <Button onClick={handleBooking} variant={"secondary"} className={`capitalize bg-green-500 active:bg-green-500/75`}>
            Book Doctor
          </Button>
        </div>
    </div>
  );
}

const OnlineDoctorCardSkeleton=()=>{
  return(
    <div className="col-span-1 p-3 flex flex-col gap-3 bg-dark-400 rounded-md">
    <div className="w-full flex items-center gap-3 relative">
      <div className=" relative w-1/12 aspect-auto rounded-full ">
        
      <Skeleton className='w-full aspect-square rounded-full bg-dark-500'/>
      </div>
      <div className="flex-1 flex flex-col gap-1">
      <Skeleton className='w-4/12 h-4 rounded-full bg-dark-500'/>
        <Skeleton className='w-5/12 h-4 rounded-full bg-dark-500'/>
       
       
      </div>
    </div>
    <Skeleton className='w-full h-4 rounded-full bg-dark-500'/>
    <Skeleton className='w-4/12 h-4 rounded-full bg-dark-500'/>
        <div className="flex items-center justify-end gap-3">
        <Skeleton className='w-4/12 h-4 rounded-full bg-dark-500'/>
        <Skeleton className='w-4/12 h-10 rounded-md bg-dark-500'/>
        </div>
    </div>
  )
}

export default OnlineDoctorsCards