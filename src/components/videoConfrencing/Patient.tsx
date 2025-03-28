"use client"
import React, { useEffect, useState } from 'react'
import { useCurrentUser } from '../providers/UserProvider';
import { useSocket } from '@/stores/useSocket';
import { fetchAPI } from '@/lib/fetch';
import '@livekit/components-styles';
import { FaVideoSlash } from 'react-icons/fa';
import clsx from 'clsx';
import { Button } from '../ui/button';
import emailjs from "@emailjs/browser";
import { toast } from 'sonner';
import LivekitRoomLayOut from './LivekitRoomLayOut';
import { Avatar, AvatarImage } from '../ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { extractInitials, nameColor } from '@/lib/utils';
import { User } from '@/types';



type SocketUser={
    socketId:string;
    newUserId:string;
    role:"doctor"|"user"|"admin"
    status:"free"|"occupied"
}

interface VideoLayoutProps {
    appointmentId: string; 
    doctor: User;        
  }

const Patient : React.FC<VideoLayoutProps> = ({appointmentId,doctor}) => {
     const [token, setToken] = useState("")
     const {user}=useCurrentUser()
     const [isDoctorAvailable, setIsDoctorAvailable] = useState(false);
     const {socket}=useSocket()
     const userNameColor=nameColor(doctor.name||"John Doe")

   

    //   checks if the doctor is available
    useEffect(() => {
     if(!socket) return
      const handleFirstOnlineDoctors=(doctors: SocketUser[]) => {
        if(doctors?.some((user) => user.newUserId === doctor?.id)){
          setIsDoctorAvailable(true)
          return
      }
      setIsDoctorAvailable(false)
      return
     
      };

      const handleDoctorOnline = (socketUsers:SocketUser[]) => {
        
        if(socketUsers?.some((user) => user.newUserId === doctor?.id)){
            setIsDoctorAvailable(true)
            return
        }
        setIsDoctorAvailable(false)
        return
    };
    socket.on("getCurrentOnlineDoctors",(data:SocketUser[]|null)=>{
      if(data){
        handleFirstOnlineDoctors(data)
      }
    })
      socket?.on("getOnlineDoctors", handleDoctorOnline);
    
      return () => {
        socket?.off("getOnlineDoctors", handleDoctorOnline);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket,appointmentId])

    

    //  create room token
  const fetchRoomToken = async (room: string, username: string | undefined, controller?: AbortController): Promise<string> => {
      try {
          const res = await fetchAPI(`/api/token/join-room`,{
              method:"POST",
              signal:controller?.signal,
              body:JSON.stringify({
                userName:username,
                roomName:room,
                role:user?.role
              })
          });
          if(res.error){
            throw Error(res.error)
          }
          return res.token;

      } catch (err) {
        throw Error((err as Error).message) ;
      } 
    }; 

      // handles the patient or user side by enabling them to join the meeting
    const handleJoin = async () => {
        try {
          // Fetch token from your API
          const data = await fetchRoomToken(appointmentId, user?.name);
          setToken(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
          toast.error("Uh oh! Something went wrong.",{
            description: `${error?.message}`,
          })
        }
      };

     const handleNotification=async()=>{
      try {
        const message={
            name:user?.name??"John Doe",
            appointmentId,
            description:`Hello Dr. ${doctor.name??"John Doe"} you have an appointment today with ${user?.name??"John Doe"}`
        }
        socket?.emit("sendPatientNotification",{patientId:user?.id,doctorId:doctor?.id,message})
        const res = await emailjs.send(
          process.env.NEXT_PUBLIC_SERVICE_ID!,
          process.env.NEXT_PUBLIC_TEMPLATE_ID!,
          {
            from_email: user?.email.toString(),
            patient_name: user?.name,
            doctor_name: doctor?.name ?? "John Doe",
            appointment_id: appointmentId,
            to_email: doctor?.email.toString(),
          },
          {
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
          }
        );
        console.log(res)
        // const res=await fetchAPI(`/api/send?appointmentId=${appointmentId}&subject=${encodeURIComponent("CarePulse: Kindly Create the Meeting Room")}`,{
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // })
        // if(res){
        //   console.log(res)
        //   toast({
        //     variant: "default", // Use "success" for positive feedback
        //     title: "Notification Sent",
        //     description: "The doctor was notified successfully.",
        //   });
        //   return
        // }
      } catch (error) {
        console.log(error)
      }
     } 

    if(  token === ""){
        return (
          <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center ">
           <div className='w-10/12 md:w-5/12 lg:w-4/12 aspect-square flex flex-col items-center justify-center gap-3 p-3 rounded-md bg-dark-400'>
                <div className="w-6/12 aspect-square relative rounded-full flex items-center justify-center ">
                 
                                           <Avatar className="size-8/12 border-4 dark:border-white">
                                             <AvatarImage
                                               src={doctor?.image ? doctor?.image : ""}
                                               alt="@shadcn"
                                             />
                                             <AvatarFallback
                                               style={{ backgroundColor: `${userNameColor}` }}
                                               className="text-3xl font-semibold"
                                             >
                                               {extractInitials(user?.name || "John Doe")}
                                             </AvatarFallback>
                                           </Avatar>
                </div>
                <h4 className="font-semibold text-lg capitalize">Dr. {doctor?.name ?? "John Doe"}</h4>
                <div className="flex items-center gap-2">
                  <div className={clsx("size-2 rounded-full bg-green-500",!isDoctorAvailable&&"bg-neutral-500")} />
                  <span className={clsx("font-thin text-sm",!isDoctorAvailable&&"text-gray-300")}>{isDoctorAvailable?"Online":"Offline"}</span>
           </div>
          

            <Button
              variant={"secondary"}
              className={`capitalize  ${isDoctorAvailable?"dark:bg-green-500 dark:text-white flex items-center gap-2 dark:hover:bg-green-500/90 dark:active:bg-green-500/75":"dark:text-gray-300 dark:bg-neutral-500/30  disabled:cursor-not-allowed"}`}
              onClick={handleJoin}
              disabled={!isDoctorAvailable}
            >
              Join Meeting
            </Button>


            <Button
              variant={"link"}
              className={`capitalize`}
              onClick={handleNotification}
            >
              Notify doctor
            </Button>

            </div>
          </div>
        );
    }

     if(token !== ""){
          return (
            <LivekitRoomLayOut role='user' token={token}/>
            );
      }
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <div className="text-gray-300">
          <FaVideoSlash size={52} />
        </div>
        <h4 className="font-semibold text-4xl text-gray-300">Sorry!!!</h4>
        <p className="font-medium ">Something went wrong when creating or joining a room. Please try again later.</p>
      </div>
    );
}

export default Patient