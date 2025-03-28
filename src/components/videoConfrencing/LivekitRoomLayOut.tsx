"use client"
import { useSocket } from '@/stores/useSocket'
import { LiveKitRoom, RoomAudioRenderer, VideoConference } from '@livekit/components-react'
import React from 'react'
import { useCurrentUser } from '../providers/UserProvider'
import { useRouter } from 'next/navigation'

type LivekitProps={
    token:string
    role:"doctor"|"user"
}
const LivekitRoomLayOut = ({token,role}:LivekitProps) => {
    const {socket}=useSocket()
    const {user}=useCurrentUser()
    const router=useRouter()
  return (
    <LiveKitRoom
                   token={token}
                   connect={true}
                   video={true}
                   audio={true}
                   serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                   data-lk-theme="default"
                   className=' w-full h-[40vh] md:h-[calc(100vh-80px)] rounded-lg'
                   onDisconnected={() => {
                    if(role==="user"){
                        router.push(`/feedback/${user?.id}`)
                    }else if(role==="doctor"){
                        socket?.emit("updateStatus",{userId:user?.id,status:"free"})
                    }
                   }}
                 >
                   <VideoConference className='max-h-[calc(100vh-80px)]'/>
                   <RoomAudioRenderer />
                   {/* <ControlBar /> */}
                 </LiveKitRoom>
  )
}

export default LivekitRoomLayOut