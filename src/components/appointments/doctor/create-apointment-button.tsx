"use client"
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import { CreateAppointmentDialog } from './create-appointment-dialog'
import { useCurrentUser } from '../../providers/UserProvider';
type Patient= {
  id: string,
  name: string,
  email: string,
  avatar: string,
}
const CreateAppointmentButton = ({patients}:{patients:Patient[]}) => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const {user}=useCurrentUser()
    if(!user||user?.role!=="doctor") return null
  return (
    <>
       {user?.role==="doctor" &&<CreateAppointmentDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} patients={patients} >
          <Button className="dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white" onClick={()=>setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Appointment
          </Button>
        </CreateAppointmentDialog>}
        </>
  )
}

export default CreateAppointmentButton