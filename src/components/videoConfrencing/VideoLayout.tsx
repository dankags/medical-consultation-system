"use client"
import { ControlBar, GridLayout, LiveKitRoom, ParticipantTile, RoomAudioRenderer, useTracks, VideoConference } from '@livekit/components-react'
import { Track } from 'livekit-client'
import React, { useEffect, useState } from 'react'
import '@livekit/components-styles';

const VideoLayout = () => {
    
  const [token, setToken] = useState('')

    useEffect(() => {
        (async () => {
          try {
            const resp = await fetch(`/api/token?room=${"fehiu3462djkufjhf"}&username=${"Dr. DanKags"}`);
            const data = await resp.json();
            setToken(data.token);
          } catch (e) {
            console.log(e);
          }
        })();
      }, []);

      if (token === '') {
        return <div>Getting token...</div>;
      }
    

  return (
    <LiveKitRoom
      token={token}
      connect={true}
      video={true}
      audio={true}
      serverUrl={process.env.LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: "100dvh" }}
    >
      <VideoConference />
      <RoomAudioRenderer />
      {/* <ControlBar /> */}
    </LiveKitRoom>
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