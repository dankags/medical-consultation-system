"use client"
import { ControlBar, GridLayout, LiveKitRoom, ParticipantTile, PreJoin, RoomAudioRenderer, useTracks, VideoConference } from '@livekit/components-react'
import { Track } from 'livekit-client'
import React, { useEffect, useState } from 'react'
import '@livekit/components-styles';
import { useCurrentUser } from '../providers/UserProvider';
import { FaVideoSlash } from 'react-icons/fa';
import { useSocket } from '@/stores/useSocket';
import { fetchAPI } from '@/lib/fetch';


type VideoLayoutProps={
    appointmentId:string;
    doctor:User|null
}


const VideoLayout = ({appointmentId,doctor}:VideoLayoutProps) => {
    
  const [token, setToken] = useState('')
  const {user,status}=useCurrentUser()
  const {socket}=useSocket()
  const [isDoctorAvailable, setIsDoctorAvailable] = useState(false);
  const [roomId, setRoomId] = useState('');

//  create room token
const fetchRoomToken = async (room: string, username: string | undefined, controller?: AbortController): Promise<string> => {
    try {
        const res = await fetchAPI(`/api/token?room=${room}&username=${username}`,{
            method:"GET",
            signal:controller?.signal
        });
        return res.token;
    } catch (err) {
      throw Error((err as Error).message) ;
    } 
  }; 

//   checks if the doctor is available | online
useEffect(() => {
  if(!socket) return
  const handleDoctorOnline = (value:boolean) => setIsDoctorAvailable(value);

  socket.on("isDoctorOnline", handleDoctorOnline);

  return () => {
    socket.off("isDoctorOnline", handleDoctorOnline);
  };
}, [socket])

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

    // handles the patient or user side by enabling them to join the meeting
    const handleJoin = async () => {
        try {
          // Fetch token from my API
          const data = await fetchRoomToken(roomId, user?.name);
          setToken(data);
        } catch (error) {
          console.log("Error fetching token:", error);
        }
      };

      if( user?.role === "admin"){
        return (<div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <div className="text-gray-300">
          <FaVideoSlash size={52} />
        </div>
        <h4 className="font-semibold text-4xl text-gray-300">Sorry!!!</h4>
        <p className="font-medium ">Only doctors and patient are permited to join or create virtual meeting.</p>
      </div>);
      }

      if (status === "loading" ) {
        return <div>Getting token...</div>;
      }
    
    if( user?.role === "user" && token === ""){
        return (
            <div className='w-full h-full flex flex-col items-center justify-center'>
              
            <h2>Join Meeting</h2>
            
            <button onClick={handleJoin} className="btn">
              Join Room
            </button>
          </div>
          );
    }
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


function MyVideoConference() {
    // `useTracks` returns all camera and screen share tracks. If a user
    // joins without a published camera track, a placeholder track is returned.
    const tracks = useTracks(
      [
        { source: Track.Source.Camera, withPlaceholder: true },
        { source: Track.Source.ScreenShare, withPlaceholder: false },
      ],
      { onlySubscribed: false },
    );
    return (
      <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
        {/* The GridLayout accepts zero or one child. The child is used
        as a template to render all passed in tracks. */}
        <ParticipantTile />
      </GridLayout>
    );
  }

export default VideoLayout