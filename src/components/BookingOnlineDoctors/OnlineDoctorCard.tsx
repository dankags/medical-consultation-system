"use client"
import { fetchAPI } from '@/lib/fetch';
import { useSocket } from '@/stores/useSocket'
import React, { useEffect,useState } from 'react'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { BiSearch } from "react-icons/bi";
import { ScrollArea } from '../ui/scroll-area';
import { Skeleton } from '../ui/skeleton';
import { useCurrentUser } from '../providers/UserProvider';
import { useCallback } from 'react';
import OnlineDoctorCard from './DoctorCard';

type OnlineDoctor={
  id:string;
  newUserId:string;
  role:"doctor"
  status:"free"|"occupied"
}
type DoctorCard={
  id:string;
  doctorId:string;
  name:string;
  specialty:string[];
  description?:string;
  image?:string;
  location?:string
  experience?:string
}



const OnlineDoctorsCards = () => {
    const {socket}=useSocket()
    const {user}=useCurrentUser()
    const [onlineDoctors,setOnlineDoctors]=useState<OnlineDoctor[]>([])
    const [doctors,setDoctors]=useState<DoctorCard[]>([])
    const [isFetchingDoctorsInfo,setIsFetchingDoctorsInfo]=useState(true)
    const [searchInput,setSearchInput]=useState("")
    const [filteredDoctors,setFilteredDoctors]=useState<DoctorCard[]>([])
    

    const fetchDoctorInfo = useCallback(async (controller:AbortController) => {
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ doctorsIds }),
          signal: controller.signal,
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
    },[onlineDoctors])
  
    useEffect(() => {
    
      if(!socket) return

      const handleFirstOnlineDoctors=(doctors: OnlineDoctor[]) => {
          setOnlineDoctors(doctors); // Set immediately on first call
      };

      const handleGetOnlineDoctors = (doctors: OnlineDoctor[]) => {
          setTimeout(() => {
            setOnlineDoctors(doctors);
          }, 30000); 
      };

     socket.emit("requestCurrentOnlineDoctors",{userId:user?.id})

     socket.on("getCurrentOnlineDoctors",(data:OnlineDoctor[])=>{handleFirstOnlineDoctors(data)})

      // Initial load
      socket?.on("getOnlineDoctors",(data:OnlineDoctor[])=>{handleGetOnlineDoctors(data)});
      // Cleanup
      return () => {
        socket?.off("getOnlineDoctors");
        socket?.off("getCurrentOnlineDoctors");
        socket?.off("requestCurrentOnlineDoctors");
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

  useEffect(()=>{
    const controller = new AbortController();
    
    fetchDoctorInfo(controller)
    return ()=>{
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[onlineDoctors])



    const handleSearchSpecialty=()=>{
      const regex = new RegExp(`${searchInput}`, "i");
      const searchedDoctors=doctors.filter(item => item.specialty.some(spec => regex.test(spec)))
      setFilteredDoctors(searchedDoctors)
    }



  return (
    <div  className=" w-full h-[calc(100vh-80px)] ">
      <ScrollArea className="w-full h-full ">
        <div className="w-full flex flex-col gap-3 relative pt-3">
          <div className=" py-1  flex flex-col gap-3 items-center justify-center bg-dark-300 space-y-3">
          <h1 className="text-center text-3xl font-bold tracking-tight md:text-4xl">Find Your Perfect Doctor</h1>
          <p className="text-center text-neutral-400">Book appointments with top specialists in your area</p>
            <div className="z-10 sticky top-0 w-11/12 md:w-8/12 lg:w-5/12  flex items-center p-2 ring-2 ring-neutral-500 rounded-full focus-within:bg-neutral-800 focus-within:ring-neutral-200 ">
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
          {doctors.length>0?(<div className="w-full  grid grid-flow-row md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-3  p-3">
            {!isFetchingDoctorsInfo ? (
              <>
               {(filteredDoctors.length > 0 ? filteredDoctors : doctors).map((doctor) => (
      <OnlineDoctorCard key={doctor.id} doctor={doctor} socket={socket}/>
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