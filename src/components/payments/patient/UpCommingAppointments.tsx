"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppointmentDocument } from '@/types'
import React, { useEffect, useState } from 'react'
import UpcommingAppointment from './UpcommingAppointment'
import { useCurrentUser } from '@/components/providers/UserProvider'
import { getUpcomingAppointmentsForUser } from '@/lib/actions/user.actions'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar } from 'lucide-react'

const UpCommingAppointments = () => {
  const {user}=useCurrentUser()
  const [upcomingPayments, setUpcomingPayments] = useState<AppointmentDocument[]>([])

 useEffect(()=>{
  if(!user) return
  const fetchUserPayments=async()=>{
    try {
      const response=await getUpcomingAppointmentsForUser(user?.id)
      
      if(!response.success){
        toast.error(response.error)
        return
      }
      setUpcomingPayments(response.data)
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    }
  }
  fetchUserPayments()
 },[user])


  return (
    <Card className="max-h-[500px] border-slate-200 dark:border-neutral-700 shadow-sm dark:shadow-slate-900/10 dark:bg-dark-400 backdrop-blur-sm">
    <CardHeader className="pb-3">
      <CardTitle>Upcoming Appointments</CardTitle>
      <CardDescription>Scheduled consultations requiring payment</CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea className='w-full h-full'>
      {upcomingPayments.length>0?<div className="w-full space-y-4">
        {upcomingPayments.map((payment) => (
          <UpcommingAppointment key={payment.appointmentId} payment={payment}/>
        ))}
      </div>
      :
      <div className="w-full py-4  flex flex-col gap-3 items-center justify-center bg-slate-200 dark:bg-dark-400 rounded-md shadow-sm dark:shadow-slate-900/10 backdrop-blur-sm">
        <div className="flex items-center justify-center w-16 h-16 rounded-lg dark:bg-emerald-900/30">
          <Calendar className="h-8 w-8 dark:text-emerald-400" />
        </div>
        <span className="text-2xl font-semibold">No Upcomming Appointments.</span>
        <span className="text-slate-500 dark:text-neutral-400">You don&apos;t have any upcomming appointment.</span>
        
      </div>
    }
      </ScrollArea>
    </CardContent>
  </Card>
  )
}

export default UpCommingAppointments