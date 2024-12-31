"use client";

import { ColumnDef, CoreRow } from "@tanstack/react-table";
import Image from "next/image";

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";

import { AppointmentModal } from "../AppointmentModal";
import { StatusBadge } from "../StatusBadge";
import { TfiMoreAlt } from "react-icons/tfi";
import Appointments from '../../app/(pages)/appointments/[userId]/page';
import * as Popover from '@radix-ui/react-popover'
import { useEffect, useState } from "react";
import ListActions from "./ListActions";
import { Button } from "../ui/button";
import { useCurrentUser } from "../providers/UserProvider";
import GeneralAppointmentView from "../GeneralAppointmentView";
import { isToday } from "date-fns";
import { useRouter } from "next/navigation";

export const doctorAppointmentscolumns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium ">{appointment.patient.name}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image!}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="flex gap-1">
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
          />
        </div>
      );
    },
  },
];

export const userAppointmentColumns: ColumnDef<Appointment>[]=[
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {

      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment?.doctor
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image??'/assets/images/noavatar.jpg'}
            alt="doctor"
            width={100}
            height={100}
            priority
            className="size-8 rounded"
          />
          <p className="whitespace-nowrap capitalize truncate">Dr. {appointment?.doctor?.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment?.appointmentDate).relativeDate}
        </p>
      );
    },
  },
 
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      return <AppointmentActions appointment={row.original} />
    },
  },
]

const AppointmentActions=({appointment}:{appointment:CoreRow<Appointment>})=>{
  const [activeRow, setActiveRow] = useState(null)
  const [isCanceling,setIsCanceling]=useState(false)
  const [isEdit,setIsEdit]=useState(false)
  const [isMeetActive,setIsMeetActive]=useState(false)
  const {user,status}=useCurrentUser()
  const router=useRouter()

  useEffect(() => {
    if(!appointment) return
    if(isToday(appointment?.appointmentDate)){
      setIsMeetActive(true)
    }
    // Start the interval
    const activateMeetBtn = setInterval(() => {
      if(isToday(appointment?.appointmentDate)){
        setIsMeetActive(true)
        return
      }
    }, 300000);

    // Cleanup function to clear the interval
    return () => {
      clearInterval(activateMeetBtn);
    };
  }, [appointment]);



if (status!=="autheticated") {
  return(
    <div className="">
       <Image
              src="/assets/icons/loader.svg"
              alt="loader"
              width={24}
              height={24}
              className="animate-spin"
            />
    </div>
  );
}

 if(user?.role!=="doctor"){
  return (
    <div className=" flex items-center gap-3">
      {isMeetActive&&<Button variant={"secondary"} className={`capitalize  bg-green-500`} onClick={()=>{router.push(`/appointments/meetup/${appointment?.id}`)}}>
        Meet
      </Button>}
      <GeneralAppointmentView appointment={appointment}>
        <Button variant="default" className={`capitalize py-1 px-2 text-green-500`} >
          view
        </Button>
      </GeneralAppointmentView>
    </div>
  );
 }

  return(
    <div className="">

    {/* mobile actions */}
   <div className=" flex md:hidden items-center justify-center">
   {isEdit&&<AppointmentModal
        patientId={appointment.patient.id}
        userId={appointment.userId}
        appointment={appointment}
        type="schedule"
        title="Schedule Appointment"
        description="Please confirm the following details to schedule."
        parentClosed={isEdit}
        setIsOpened={setIsEdit}
      />}
       {isCanceling&&<AppointmentModal
        patientId={appointment.patient.id}
        userId={appointment.userId}
        appointment={appointment}
        type="cancel"
        title="Cancel Appointment"
        description="Are you sure you want to cancel your appointment?"
        parentClosed={isCanceling}
        setIsOpened={setIsCanceling}
      />}
             <ListActions setActiveRow={setActiveRow} item={appointment}   setIsCanceling={setIsCanceling} setIsEdit={setIsEdit}>
              <Button variant="ghost" className="h-8 w-8 p-0" >
                <span className="sr-only">Open menu</span>
                <TfiMoreAlt  className="h-4 w-4" />
              </Button>
              </ListActions>
   </div>
  {/* desktop actions */}
   <div className="hidden md:flex gap-1">

      <AppointmentModal
        patientId={appointment.patient.id}
        userId={appointment.userId}
        appointment={appointment}
        type="schedule"
        title="Schedule Appointment"
        description="Please confirm the following details to schedule."
      />
      <AppointmentModal
        patientId={appointment.patient.id}
        userId={appointment.userId}
        appointment={appointment}
        type="cancel"
        title="Cancel Appointment"
        description="Are you sure you want to cancel your appointment?"
      />
   </div>
  </div>
  )
}
