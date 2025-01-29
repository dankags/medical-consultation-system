"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ColumnDef, CoreRow } from "@tanstack/react-table";
import Image from "next/image";

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";


// import { AppointmentModal } from "../AppointmentModal";
import { StatusBadge } from "../StatusBadge";
import { TfiMoreAlt } from "react-icons/tfi";


import { useEffect, useState } from "react";
import ListActions from "./ListActions";
import { Button } from "../ui/button";
import { useCurrentUser } from '../providers/UserProvider';
import GeneralAppointmentView from "../GeneralAppointmentView";
import { isToday } from "date-fns";
import { useRouter } from "next/navigation";
import { Appointment } from "@/types/appwrite.types";
import PaymentStatusBadge from "../PaymentStatusBadge";

type PaymentStatus = "paid" | "deposited" | "withdrew"

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
            src={doctor?.image||"/assets/images/noavatar.jpg"}
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const appointment = row.original;

      return (
        <div className="flex gap-1">
          {/* <AppointmentModal
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
          /> */}
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
        (doctor) => doctor.name === appointment?.doctor.name
      );

      return (
        <AppointMentUserColumn doctor={doctor} appointment={appointment}/>  
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

export const PaymentsColumns: ColumnDef<ProcessedPayment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "paidBy",
    header: "Paid By",
    cell: ({ row }) => {
      const payment = row.original;
      return <PaymentUser payment={payment as ProcessedPayment} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="min-w-[115px] flex items-center ">
          <PaymentStatusBadge paymentStatus={payment.status as PaymentStatus} />
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <p className="hidden md:block text-14-regular min-w-[100px]">
          {formatDateTime(payment.date).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const payment = row.original;
      return <p className="text-14-medium ">{payment.amount}</p>;
    },
  },
]

const PaymentUser=({payment}:{payment:ProcessedPayment})=>{
  const {user}=useCurrentUser()
  return(
    <div className="flex items-center gap-3">
      <div className="relative size-9 bg-dark-500 rounded-full overflow-hidden">
        <Image src={"/assets/images/noavatar.jpg"} fill loading="lazy" alt="" className="object-cover rounded-full" />
      </div>
      <div className="flex flex-col gap-3 justify-center">
        {user
         ?
        <span className="text-white font-semibold capitalize">
          {user?.id===payment.paidBy.id?`${payment.paidBy.name}`:`${payment.paidBy.role!=="doctor"?payment.paidBy.name:`Dr. ${payment.paidBy.name}`}`}
        </span>
          :
          <span>John Doe</span>
          }
      <span className="block md:hidden text-sm text-gray-500">{formatDateTime(payment.date).dateTime}</span>
      </div>
    </div>
  )
}

const AppointMentUserColumn=({doctor,appointment}:{doctor:{
  image: string;
  name: string;
} | undefined,appointment:Appointment})=>{
  const {user}=useCurrentUser()

  return(
    <div className="flex items-center gap-3">
    <Image
      src={doctor?.image??'/assets/images/noavatar.jpg'}
      alt="doctor"
      width={100}
      height={100}
      priority
      className="size-8 rounded"
    />
    <p className="whitespace-nowrap capitalize truncate">{user?.role==="doctor"?`${appointment?.doctor?.name}`:`Dr. ${appointment?.doctor?.name}`}</p>
  </div>
  )
}

const AppointmentActions=({appointment}:{appointment:Appointment})=>{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeRow, setActiveRow] = useState<string|null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCanceling,setIsCanceling]=useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      {isMeetActive&&<Button variant={"secondary"} className={`capitalize  bg-green-500`} onClick={()=>{router.push(`/appointments/${appointment?.id}/meetup`)}}>
        Meet
      </Button>}
      <GeneralAppointmentView appointment={appointment}>
        <Button variant="default" className={`capitalize py-1 px-2 text-green-500`} >
          Overview
        </Button>
      </GeneralAppointmentView>
    </div>
  );
 }

  return(
    <div className="">

    {/* mobile actions */}
   <div className=" flex md:hidden items-center justify-center">
   {/* {isEdit&&<AppointmentModal
        patientId={appointment?.patient.id||appointment.id}
        userId={appointment?.userId}
        appointment={appointment}
        type="schedule"
        title="Schedule Appointment"
        description="Please confirm the following details to schedule."
        parentClosed={isEdit}
        setIsOpened={setIsEdit}
      />}
       {isCanceling&&<AppointmentModal
        patientId={appointment?.patient.id||appointment.id}
        userId={appointment?.userId}
        appointment={appointment}
        type="cancel"
        title="Cancel Appointment"
        description="Are you sure you want to cancel your appointment?"
        parentClosed={isCanceling}
        setIsOpened={setIsCanceling}
      />} */}
             <ListActions setActiveRow={setActiveRow} item={appointment}   setIsCanceling={setIsCanceling} setIsEdit={setIsEdit}>
              <Button variant="ghost" className="h-8 w-8 p-0" >
                <span className="sr-only">Open menu</span>
                <TfiMoreAlt  className="h-4 w-4" />
              </Button>
              </ListActions>
   </div>
  {/* desktop actions */}
   <div className="hidden md:flex gap-1">

      {/* <AppointmentModal
        appointment={appointment}
        type="schedule"
        title="Schedule Appointment"
        description="Please confirm the following details to schedule."
      />
      <AppointmentModal
        patientId={appointment?.patient.id||appointment?.id}
        userId={appointment?.userId}
        appointment={appointment}
        type="cancel"
        title="Cancel Appointment"
        description="Are you sure you want to cancel your appointment?"
      /> */}
        patientId={appointment?.patient.id||appointment.id}
        userId={appointment?.userId}
   </div>
  </div>
  )
}
