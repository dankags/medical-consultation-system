import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title:"404 Not Found",
    description: 'The page you wrer looking for does not exist.',
  };

export default function NotFound() {
  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center gap-3">
    <span className="text-3xl text-gray-400 font-semibold">!Ooops Error: 404</span>
    <span className="">The page you are looking for does not exist or not found.</span>
 </div>
  )
}
