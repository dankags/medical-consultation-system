"use client"
import { useSocket } from '@/stores/useSocket'
import clsx from 'clsx';
import React, { useEffect, useState } from 'react'

type OnlineUsers={
  id:string;
  newUserId:string;
  role:"doctor"
  status:"free"|"occupied"
  }

const OnlineBanner = ({userId}:{userId:string}) => {
   const {socket}=useSocket()
   const [isUserOnline,setIsUserOnline]=useState(true)


   useEffect(()=>{
     if(!socket) return
     
    const handleGetUsers = (users:OnlineUsers[]) => {
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
   },[socket,userId])

  
   

  return (
    <div className=" absolute right-2 bottom-4 md:bottom-5 isolate flex items-center gap-2">
      <div
        className={clsx(
          "size-5 rounded-full bg-green-500 ring-2 ring-neutral-50",
          !isUserOnline && "bg-neutral-500"
        )}
      />
    </div>
  );
}

export default OnlineBanner