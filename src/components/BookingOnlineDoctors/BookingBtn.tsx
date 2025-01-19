"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useSocket } from '@/stores/useSocket'
import { toast } from '@/hooks/use-toast'
import { useBalance } from '@/stores/useBalance'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

type SocketUser={
    socketId:string;
    newUserId:string;
    role:"doctor"|"user"|"admin"
}


const BookingBtn = ({doctorId}:{doctorId:string}) => {
    const {socket}=useSocket()
    const router=useRouter()
    const {userId}=useAuth()
     const [isDoctorAvailable, setIsDoctorAvailable] = useState(false);
      const {balance,setBalance}=useBalance()
    useEffect(() => {
          if(!socket) return
          const handleDoctorOnline = (socketUsers:SocketUser[]) => {
            if(socketUsers?.some((user) => user.newUserId === doctorId)){
                setIsDoctorAvailable(true)
                return
            }
            setIsDoctorAvailable(false)
            return
        };
        
          socket?.on("getOnlineDoctors", handleDoctorOnline);
        
          return () => {
            socket?.off("getOnlineDoctors", handleDoctorOnline);
          };
        }, [socket])

        const handleBooking=async()=>{
          if(!isDoctorAvailable){
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
    <Button onClick={handleBooking} variant={"secondary"} disabled={!isDoctorAvailable} className={`capitalize bg-green-500 active:bg-green-500/75 ${!isDoctorAvailable&&"text-gray-300 bg-neutral-500/30  disabled:cursor-not-allowed"}`}>
      Book Doctor
    </Button>
  )
}

export default BookingBtn