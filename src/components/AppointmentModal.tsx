"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment } from "@/types/appwrite.types.ts";



import "react-datepicker/dist/react-datepicker.css";
import { AppointmentForm } from "./forms/AppointmentForm";

export const AppointmentModal = ({
  patientId,
  userId,
  appointment,
  type,
  setIsOpened,
  parentClosed,
}: {
  patientId: string;
  userId: string;
  appointment?: Appointment;
  type: "schedule" | "cancel";
  title: string;
  description: string;
  setIsOpened:Dispatch<SetStateAction<boolean>>;
  parentClosed:boolean
}) => {

  const [isOpen,setIsOpen]=useState(parentClosed)

  const handleOpenChange=()=>{
      if (isOpen) {
          setIsOpened(false)
          setIsOpen(false)
          return
      }
  }
  

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize ${type === "schedule" && "text-green-500"}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>
            Please fill in the following details to {type} appointment
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
};