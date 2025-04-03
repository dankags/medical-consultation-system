"use client"
import React, { Suspense, useEffect, useState } from 'react'
import { useCurrentUser } from '../../providers/UserProvider';
import { getDoctor } from '@/lib/actions/user.actions';
import dynamic from 'next/dynamic';
// import { toast } from 'sonner';


const CreateDoctorInfo=dynamic(()=>import('./CreateDoctorInfo'),{ssr:false})

const DoctorAccountSetUp = () => {
    const {user,status}=useCurrentUser()
    const [isDoctorInfoExist,setIsDoctorInfoExist]=useState(true)
    
    useEffect(()=>{
        if(!user) return
        const fetchDoctorInfo=async()=>{
            try {
                const res=await getDoctor()
            if(res.error){
                setIsDoctorInfoExist(false)
                return
            }
            // toast.error("this doctor already exist")
            setIsDoctorInfoExist(true)
           return 
            } catch (error) {
                console.log(error)
            }
           
        }
        fetchDoctorInfo()
    },[user])
    // console.log(isDoctorInfoExist)
    if(status!=="authenticated"||!user||user.role!=="doctor") return null
  return (
    <div>
        <Suspense fallback={<div></div>}>
        <CreateDoctorInfo open={!isDoctorInfoExist} onOpenChange={setIsDoctorInfoExist}/>
        </Suspense>
    </div>
  )
}

export default DoctorAccountSetUp