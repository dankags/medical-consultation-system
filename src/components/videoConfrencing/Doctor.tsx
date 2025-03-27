"use client"
import { fetchAPI } from '@/lib/fetch';
import React, { useEffect, useState } from 'react'
import '@livekit/components-styles';
import LivekitRoomLayOut from './LivekitRoomLayOut';
import { FaVideoSlash } from 'react-icons/fa';

type VideoLayoutProps={
    appointmentId:string;
    doctor:User|null
    role?:"doctor"|null
   
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Doctor = ({appointmentId,doctor,role}:VideoLayoutProps) => {
    const [token, setToken] = useState('')
   //  create room token
    const fetchRoomToken = async (room: string, username: string | undefined, controller?: AbortController): Promise<string> => {
        try {
            const res = await fetchAPI(`/api/token/create-room`,{
                method:"POST",
                signal:controller?.signal,
                body:JSON.stringify({
                  userName:username,
                  roomName:room 
                })
            });
            return res.token;
        } catch (err) {
          throw Error((err as Error).message) ;
        } 
      }; 
  
 //   creates a room if the user is a doctor which is passed from the SSC
     useEffect(() => {
       const controller = new AbortController();
       const createRoomToken = async () => {
         try {
           const data = await fetchRoomToken(appointmentId,`Dr. ${doctor?.name}`,controller)
           setToken(data);
         } catch (e) {
           console.log(e);
         }
       };
 
       if (doctor && appointmentId) {
         createRoomToken();
       }
 
       return () => {
         controller.abort();
       };
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [doctor, appointmentId]);

    if(token !== ''){
         return (
     <LivekitRoomLayOut role='doctor' token={token}/>
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

export default Doctor