"use client"
import { useSocket } from '@/stores/useSocket'
import React, { useEffect, useState } from 'react'
import { useCurrentUser } from '../providers/UserProvider';
import { cn } from '@/lib/utils';

type OnlineUsers={
  id:string;
  newUserId:string;
  role:"doctor"
  status:"free"|"occupied"
  }

const OnlineBanner = ({userId,className}:{userId:string,className?:string}) => {
   const {socket}=useSocket()
   const {user,status}=useCurrentUser()
   const [isUserOnline,setIsUserOnline]=useState(false)
   const [doctorsOnliene,setDoctorsOnline]=useState<OnlineUsers[]>([])
 

   useEffect(()=>{
     if(!socket) return
     
    const handleGetUsers = (users:OnlineUsers[]) => {
      setDoctorsOnline(users);
      if(users?.some((user) => user.newUserId === userId)){
        setIsUserOnline(true)
        return
    }
    setIsUserOnline(false)
    return
      };


socket.emit("requestCurrentOnlineDoctors",{userId:user?.id})
socket.on("getCurrentOnlineDoctors",(data:OnlineUsers[])=>{handleGetUsers(data)})
socket.on("getOnlineDoctors",(data:OnlineUsers[])=>{handleGetUsers(data)})

    return () => {
        if (socket) {
          socket.off("getOnlineDoctors", handleGetUsers);
          socket.off("requestCurrentOnlineDoctors");
        }
      };
   },[socket,userId])

  
   

  return (
    <div className={cn(" absolute right-2 bottom-4 md:bottom-5 isolate flex items-center gap-2",className)}>
      <div
      title={isUserOnline?"Online":"Offline"}
        className={cn(
          "size-5 rounded-full bg-green-500 ring-2 ring-neutral-50",
          !isUserOnline && "bg-neutral-500"
        )}
      />
    </div>
  );
}

export default OnlineBanner