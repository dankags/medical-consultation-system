"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useSocket } from '@/stores/useSocket'
import { toast } from '@/hooks/use-toast'
import { useBalance } from '@/stores/useBalance'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { useCurrentUser } from '../providers/UserProvider'

type SocketUser={
    socketId:string;
    newUserId:string;
    role:"doctor"|"user"|"admin";
    status:"free"|"occupied"
}
type Doctor={
  name: string,
  rating: number,
  specialty: string[],
  title: string|null,
  description: string,
  doctorId:string,
}


const BookingBtn = ({doctorId,doctor}:{doctorId:string,doctor:Doctor}) => {
    const {socket}=useSocket()
    const router=useRouter()
    const {userId}=useAuth()
    const {user}=useCurrentUser()
     const [isDoctorAvailable, setIsDoctorAvailable] = useState(false);
     const [isDoctorOccupied,setIsDoctorOccupied]=useState(false)
      const {balance,setBalance}=useBalance()
    useEffect(() => {
          if(!socket) return
          const handleDoctorOnline = (socketUsers:SocketUser[]) => {
            const doctor=socketUsers.filter((item)=>item.newUserId===doctorId)

            if(socketUsers?.some((user) => user.newUserId === doctorId)){
                setIsDoctorAvailable(true)
                if(doctor.length>0){
                  if(doctor[0].status==="occupied"){
                    setIsDoctorOccupied(true)
                    return
                  }
                  setIsDoctorOccupied(false)
                  return
                } 
                return
            }
            setIsDoctorAvailable(false)
            setIsDoctorOccupied(false)
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
               description:"The doctor you trying to book is currently offline."
             })
             return
          }
          if(isDoctorOccupied){
            toast({
              variant:"destructive",
              title:"!Ooops something went wrong",
              description:"The doctor you trying to book is currently in a session."
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
          socket?.emit("sendBookingRequest", {
            patientId: user?.id,
            doctorId,
            message: `Hello Dr. ${doctor?.name} its ${user?.name} and I would like to book a session with you argently.`,
          });
      
        }
  return (
    <Button onClick={handleBooking} variant={"secondary"} disabled={!isDoctorAvailable} className={`capitalize bg-green-500 active:bg-green-500/75 ${!isDoctorAvailable&&"text-gray-300 bg-neutral-500/30  disabled:cursor-not-allowed"}`}>
      Book Doctor
    </Button>
  )
}

export default BookingBtn