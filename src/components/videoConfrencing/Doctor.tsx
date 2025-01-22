"use client"
import { fetchAPI } from '@/lib/fetch';
import React, { useEffect, useState } from 'react'
import { LiveKitRoom, RoomAudioRenderer, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { FaVideoSlash } from 'react-icons/fa';
import { useSocket } from '@/stores/useSocket';
import { useCurrentUser } from '../providers/UserProvider';

type VideoLayoutProps={
    appointmentId:string;
    doctor:User|null
    role?:"doctor"|null
   
}

const Doctor = ({appointmentId,doctor,role}:VideoLayoutProps) => {
    const [token, setToken] = useState('')
    const {socket}=useSocket()
    const {user}=useCurrentUser()  
    

   //  create room token
    const fetchRoomToken = async (room: string, username: string | undefined, controller?: AbortController): Promise<string> => {
        try {
            const res = await fetchAPI(`/api/token?room=${room}&username=${username}&role=${role}`,{
                method:"GET",
                signal:controller?.signal
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
     }, [doctor, appointmentId]);

    if(token !== ''){
         return (
             <LiveKitRoom
               token={token}
               connect={true}
               video={true}
               audio={true}
               serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
               data-lk-theme="default"
               style={{ height: "100dvh" }}
               onDisconnected={() => {
                socket?.emit("updateStatus",{userId:user?.id,status:"free"})
               }}
             >
               <VideoConference />
               <RoomAudioRenderer />
               {/* <ControlBar /> */}
             </LiveKitRoom>
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