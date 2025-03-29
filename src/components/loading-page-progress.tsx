"use client"
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import Image from 'next/image'

const LoadingPageProgress = () => {
      const [loadingProgress, setLoadingProgress] = useState(0)
      const [loadingText, setLoadingText] = useState("Connecting to CarePulse")
      const loadingMessages = [
        "Connecting to CarePulse",
        "Fetching your health data",
        "Loading doctor profiles",
        "Preparing your dashboard",
        "Almost there",
      ]
    
    useEffect(() => {
      // Simulate loading progress
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 1
        })
      }, 50)
  
      // Change loading message periodically
      const messageInterval = setInterval(() => {
        setLoadingText((prev) => {
          const currentIndex = loadingMessages.indexOf(prev)
          const nextIndex = (currentIndex + 1) % loadingMessages.length
          return loadingMessages[nextIndex]
        })
      }, 2000)
  
      return () => {
        clearInterval(interval)
        clearInterval(messageInterval)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <>
     <div className="relative mb-8">
               <div className="flex size-14 p-2 items-center justify-center rounded-full shadow-lg">
                 <Image src="/assets/icons/logo-icon.svg" alt="CarePulse" height={40} width={40} className="object-cover"/>
               </div>
     
               {/* Pulse Rings Animation */}
               {[1, 2, 3].map((ring) => (
                 <motion.div
                   key={ring}
                   className="absolute inset-0 rounded-full border-4 border-teal-500/20 dark:border-teal-400/20"
                   initial={{ opacity: 0.7, scale: 1 }}
                   animate={{
                     opacity: 0,
                     scale: 1.8,
                   }}
                   transition={{
                     duration: 2.5,
                     repeat: Number.POSITIVE_INFINITY,
                     delay: ring * 0.7,
                     ease: "easeInOut",
                   }}
                 />
               ))}
             </div>
     
             <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">CarePulse</h1>
             <p className="text-muted-foreground text-center mb-8">Your Health, Our Priority</p>
    
    <div className="w-10/12 mb-4">
    <div className="h-1.5 w-full bg-slate-200 dark:bg-dark-500 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-teal-400 to-emerald-500"
        initial={{ width: "0%" }}
        animate={{ width: `${loadingProgress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
      <span>{loadingProgress}%</span>
      <span>{loadingText}</span>
    </div>
  </div>

   {/* Medical Icons */}
   <div className="grid grid-cols-3 gap-4 mt-12">
          <IconCard icon={<HeartIcon />} delay={0} />
          <IconCard icon={<StethoscopeIcon />} delay={0.2} />
          <IconCard icon={<PillIcon />} delay={0.4} />
        </div>
  </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IconCard({ icon, delay = 0 }:{icon:any,delay:number}) {
  return (
    <motion.div
      className="flex items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
    >
      <div className="text-teal-500 dark:text-teal-400">{icon}</div>
    </motion.div>
  )
}

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    </svg>
  )
}

function StethoscopeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
      <circle cx="20" cy="10" r="2"></circle>
    </svg>
  )
}

function PillIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
      <path d="m8.5 8.5 7 7"></path>
    </svg>
  )
}



export default LoadingPageProgress