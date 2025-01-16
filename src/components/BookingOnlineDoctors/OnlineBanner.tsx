import { useSocket } from '@/stores/useSocket'
import clsx from 'clsx';
import React, { useEffect, useState } from 'react'

type OnlineUsers={
    id:string;
    newUserId:string;
    role:"doctor"|"user"|"admin"
  }

const OnlineBanner = ({userId}:{userId:string}) => {
   const {socket}=useSocket()
   const [isUserOnline,setIsUserOnline]=useState(false)

   useEffect(()=>{
    if(!socket) return
    const handleGetUsers = (users:OnlineUsers[]) => {
        setIsUserOnline(users?.some((item) => item.newUserId === userId));
      };

    socket?.on("getUsers",handleGetUsers)
    return () => {
        if (socket) {
          socket.off("getUsers", handleGetUsers);
        }
      };
   },[socket])

  
   

  return (
    <div className='flex items-center gap-2'>
     <div className={clsx("size-2 rounded-full bg-green-500",!isUserOnline&&"bg-neutral-500")} />
     <span className={clsx("font-thin text-sm",!isUserOnline&&"text-gray-300")}>{isUserOnline?"Online":"Offline"}</span>
    </div>
  )
}

export default OnlineBanner