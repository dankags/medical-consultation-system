import VideoLayout from '@/components/videoConfrencing/VideoLayout';
import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
  title: "Video confrence meeting",
  description:
    "This is the page where the patient and the doctor meet up virtualy through video confrencing.But the patient must pay first in order to activate the video confrence",
};

export default function VideoMeetUpPage() {

  return (
    <div className="w-full h-screen min-h-screen flex-col px-3  xl:px-12 2xl:px-32 ">
      <VideoLayout/>
    </div>
  )
}
