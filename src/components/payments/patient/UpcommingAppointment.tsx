"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { extractInitials, formatDateTime, nameColor } from '@/lib/utils'
import { AppointmentDocument } from '@/types'
import { Calendar } from 'lucide-react'
import React from 'react'

const UpcommingAppointment = ({payment}:{payment:AppointmentDocument}) => {
  return (
    <div key={payment.appointmentId} className="rounded-lg border border-slate-200 dark:border-neutral-700 dark:hover:bg-dark-500/50 p-4">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 border border-slate-200 dark:border-white">
          <AvatarImage src={payment.doctor.image} alt={payment.doctor.name} />
          <AvatarFallback style={{backgroundColor:`${nameColor(payment.doctor.name)}`}} className="dark:text-black">
            {extractInitials(payment.doctor.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{payment.doctor.name}</h4>
          <p className="text-sm text-slate-500 dark:text-neutral-400">{payment.doctor.speciality.join(" • ")}</p>
          <p className="text-sm mt-1">{payment.reason}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">Ksh 500</p>
      </div>
    </div>

    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-neutral-400">
        <div className="flex items-center">
          <Calendar className="mr-1 h-3.5 w-3.5" />
          <span>{formatDateTime(payment.schedule).dateOnly}</span>
        </div>
      </div>
      <Button size="sm" className="dark:bg-green-500 dark:hover:bg-green-500/90 dark:text-white">
        Pay Now
      </Button>
    </div>
  </div>
  )
}

export default UpcommingAppointment