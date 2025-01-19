"use client"
import { useSocket } from '@/stores/useSocket';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react'

type SocketUser={
    socketId:string;
    newUserId:string;
    role:"doctor"|"user"|"admin"
    status:"free"|"occupied"
}

const PreviewDoctorOnlineBanner = ({doctorId}:{doctorId:string}) => {
    const {socket}=useSocket()
         const [isDoctorAvailable, setIsDoctorAvailable] = useState(false);
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
            console.log(doctorId)
  return (
    <div className={clsx("size-6 rounded-full ring-4 ring-dark-300 bg-green-500",!isDoctorAvailable&&"hidden")}></div>
  )
}

export default PreviewDoctorOnlineBanner