"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ColumnDef, CoreRow } from "@tanstack/react-table";
import Image from "next/image";

import { Doctors } from "@/constants";
import { extractInitials, formatDateTime, nameColor } from "@/lib/utils";


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
import { Appointment, DoctorAppointments } from "@/types/appwrite.types";
import PaymentStatusBadge from "../PaymentStatusBadge";
import { AppointmentModal } from "../AppointmentModal";
import { IoVideocamOutline } from "react-icons/io5";
import { ProcessedPayment, Transaction, TransactionType } from "@/types";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

type PaymentStatus = "paid" | "deposited" | "withdrew"

export const doctorAppointmentscolumns: ColumnDef<DoctorAppointments>[] = [
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
      return <div className="flex flex-col justify-center gap-2 overflow-hidden">
        <span className="font-semibold">{appointment.patient.name}</span>
        <p className="w-48 line-clamp-1  text-sm text-gray-500 first-letter:capitalize">{appointment.patient.reason}</p>
        </div>;
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
          {formatDateTime(appointment.appointmentDate).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;

      

      return (
        <div className="flex items-center gap-3">
          <Image
            src={appointment?.doctor.image||"/assets/images/noavatar.jpg"}
            alt="doctor"
            width={100}
            height={100}
            className="size-8 rounded-sm"
          />
          <p className="whitespace-nowrap capitalize font-semibold">Dr. {appointment.doctor?.name}</p>
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
          <AppointmentModal
            patientId={appointment.patient.id as string}
            userId={appointment.doctor?.id as string}
            appointment={appointment}
            type="schedule"
            title="Schedule Appointment"
            description="Please confirm the following details to schedule."
          />
          <AppointmentModal
            patientId={appointment.patient.id as string}
            userId={appointment.doctor?.id as string}
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
        <p className=" text-14-regular min-w-[100px]">
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

export const DoctorsPaymentsColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="text-slate-500 dark:text-neutral-400 font-mono text-xs">{row.original.id}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <span>Date</span>
        <Button
          variant="ghost"
          size="sm"
          className=" h-8 dark:data-[state=open]:bg-green-500 dark:hover:bg-green-500/50"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-slate-500 dark:text-neutral-400">{formatDateTime(row.original.date).dateOnly}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const transaction = row.original

      return (
        <div className="flex items-center gap-3">
          {transaction.counterparty ? (
            <>
              <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700">
                <AvatarImage src={transaction.counterparty.avatar} alt={transaction.counterparty.name} />
                <AvatarFallback style={{backgroundColor:`${nameColor(transaction.counterparty.name||"John Doe")}`}} className="dark:text-black">
                  {extractInitials(transaction.counterparty.name||"John Doe")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{transaction.description}</div>
                <div className="text-sm text-slate-500 dark:text-neutral-400">{transaction.counterparty.name}</div>
              </div>
            </>
          ) : (
            <div>
              <div className="font-medium">{transaction.description}</div>
              {transaction.reference && (
                <div className="text-sm text-slate-500 dark:text-neutral-400">Ref: {transaction.reference}</div>
              )}
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type: TransactionType = row.original.type

      const typeConfig = {
        payment: {
          label: "Payment",
          class:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900",
        },
        withdrawal: {
          label: "Withdrawal",
          class:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900",
        },
        refund: {
          label: "Refund",
          class:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900",
        },
        deposit: {
          label: "Deposit",
          class:
            "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900",
        },
      }

      return (
        <Badge
          variant="outline"
          className={`px-2.5 py-0.5 rounded-full font-medium capitalize ${typeConfig[type].class}`}
        >
          {typeConfig[type].label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status

      return (
        <Badge
          variant="outline"
          className={`px-2.5 py-0.5 rounded-full font-medium capitalize ${
            status === "completed"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
              : status === "pending"
                ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900"
                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
          }`}
        >
          <span
            className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
              status === "completed" ? "bg-emerald-500" : status === "pending" ? "bg-amber-500" : "bg-red-500"
            }`}
          />
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="flex items-center justify-end gap-2">
        <span>Amount</span>
        <Button
          variant="ghost"
          size="sm"
          className=" h-8 dark:data-[state=open]:bg-green-500 dark:hover:bg-green-500/50"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const type = row.original.type
      const amount = row.original.amount

      return (
        <div
          className={`text-right font-medium ${
            type === "payment"
              ? "text-emerald-600 dark:text-emerald-400"
              : type === "refund"
                ? "text-amber-600 dark:text-amber-400"
                : ""
          }`}
        >
          {type === "payment" ? "+" : type === "refund" ? "+" : "-"}
          KSh {amount.toLocaleString()}
        </div>
      )
    },
  },
  {
    id: "actions",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: ({row}) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 dark:hover:bg-green-500/40 dark:text-white">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-700"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer dark:hover:bg-neutral-800">View details</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer dark:hover:bg-neutral-800">Download receipt</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-neutral-700" />
            <DropdownMenuItem className="cursor-pointer dark:hover:bg-neutral-800">Report issue</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

export const PatientPaymentsColumns:ColumnDef<Transaction>[]=[
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="text-slate-500 dark:text-neutral-400 font-mono text-xs">{row.original.id}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <span>Date</span>
        <Button
          variant="ghost"
          size="sm"
          className=" h-8 data-[state=open]:bg-accent dark:hover:bg-green-500/50"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-slate-500 dark:text-neutral-400">{row.original.date}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const transaction = row.original

      return (
        <div className="flex items-center gap-3">
          {transaction.counterparty ? (
            <>
              <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700">
                <AvatarImage src={transaction.counterparty.avatar} alt={transaction.counterparty.name} />
                <AvatarFallback style={{backgroundColor:`${nameColor(transaction.counterparty.name||"John Doe")}`}} className="dark:text-black">
                  {extractInitials(transaction.counterparty.name||"John Doe")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{transaction.description}</div>
                <div className="text-sm text-slate-500 dark:text-neutral-400">{transaction.counterparty.name}</div>
              </div>
            </>
          ) : (
            <div className="font-medium">{transaction.description}</div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type: TransactionType = row.original.type

      const typeConfig = {
        deposit: {
          label: "Deposit",
          class:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900",
        },
        payment: {
          label: "Payment",
          class:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900",
        },
        withdrawal: {
          label: "Withdrawal",
          class:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900",
        },
        refund: {
          label: "Refund",
          class:
            "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900",
        },
      }

      return (
        <Badge
          variant="outline"
          className={`px-2.5 py-0.5 rounded-full font-medium capitalize ${typeConfig[type].class}`}
        >
          {typeConfig[type].label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status

      return (
        <Badge
          variant="outline"
          className={`
            px-2.5 py-0.5 rounded-full font-medium capitalize
            ${
              status === "completed"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
                : status === "pending"
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900"
                  : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
            }
          `}
        >
          <span
            className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
              status === "completed" ? "bg-emerald-500" : status === "pending" ? "bg-amber-500" : "bg-red-500"
            }`}
          />
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="flex items-center justify-end gap-2">
        <span>Amount</span>
        <Button
          variant="ghost"
          size="sm"
          className=" h-8 data-[state=open]:bg-accent dark:hover:bg-green-500/50"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const type = row.original.type
      const amount = row.original.amount

      return (
        <div
          className={`text-right font-medium ${
            type === "deposit" || type === "refund" ? "text-emerald-600 dark:text-emerald-400" : ""
          }`}
        >
          {type === "deposit" || type === "refund" ? "+" : "-"}
          KSh {amount.toLocaleString()}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: () => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 dark:hover:bg-green-500/40 dark:text-white">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-700"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer dark:hover:bg-neutral-800">View details</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer dark:hover:bg-neutral-800">Download receipt</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-neutral-700" />
            <DropdownMenuItem className="cursor-pointer dark:hover:bg-neutral-800">Report issue</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
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



if (status!=="authenticated") {
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
      {isMeetActive&&<Button variant={"secondary"} className={`capitalize  dark:bg-green-500 dark:text-white flex items-center gap-2 dark:hover:bg-green-500/90 dark:active:bg-green-500/75`} onClick={()=>{router.push(`/appointments/${appointment?.id}/meetup`)}}>
       <IoVideocamOutline /> <span className="">Meet</span>
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
