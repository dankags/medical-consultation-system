"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SelectItem } from "@/components/ui/select";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { getAppointmentSchema } from "@/lib/validation";
import { DoctorAppointments } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { Form } from "../ui/form";
import emailjs from "@emailjs/browser";
import { formatDateTime, generateCalendarLinks } from "@/lib/utils";
import { useCurrentUser } from "../providers/UserProvider";
import { toast } from "sonner";
import { CalendarEvent, Status } from "@/types";


type Doctor={
  doctorId:string,
  image:string,
  name:string
}

export const AppointmentForm = ({
  userId,
  patientId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "schedule" | "cancel";
  appointment?: DoctorAppointments;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [doctors,setDoctors]=useState<Doctor[]>([])
  const {user}=useCurrentUser()
  const [isPending,startTransition]=useTransition()

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      doctor: appointment ? appointment?.doctor.doctorId : "",
      schedule: appointment
        ? new Date(appointment?.appointmentDate)
        : new Date(Date.now()),
      reason: appointment ? appointment.patient.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {


    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }
startTransition(async()=>{
    try {
      if (type === "create" && patientId) {
        const appointment = {
          user: patientId,
          doctor: values.doctor,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        };

        const newAppointment = await createAppointment(appointment);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      } else {
        if(!appointment) return
        console.log(values.schedule)
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.id as string,
          appointment: {
            reason: values.reason,
            note: values.note,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };
        
        const appointmentObj:CalendarEvent={
          title:"Appointment reschedule",
          description:"hello world",
          locationUrl:`${process.env.NEXT_PUBLIC_URL}/appointments/${appointment?.id}/meetup`,
          startDate:new Date(values.schedule).toISOString(),
          endDate:new Date(values.schedule).toISOString()
        }

        const calenderAppointmentLink=generateCalendarLinks(appointmentObj)
        console.log(calenderAppointmentLink)

        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        console.log(updateAppointment) 
        if(updatedAppointment.error) {
          toast.error("Error updating appointment", { 
            description: updatedAppointment.error,
          });
          return
        }
        if (updatedAppointment) {
          await emailjs.send(
            
            process.env.NEXT_PUBLIC_SERVICE_ID!,
            process.env.NEXT_PUBLIC_TEMPLATE_TWO_ID!,
            {
              from_email:user?.email,
              // remember to update this to patient email.
              to_email:user?.email,
              doctor_name:user?.name,
              // remember to update this to patient name.
              patient_name:user?.name,
              schedule_date:formatDateTime(values.schedule).dateOnly,
              google_calendar:calenderAppointmentLink?.googleCalendarLink,
              outlook_calendar:calenderAppointmentLink?.outlookCalendarLink,
              apple_calendar:calenderAppointmentLink?.icalFileLink
            },
            {
              publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,

            }
          );
          toast.success("Appointment Scheduled successfully", {
            description: "Check your email for confirmation",
          });
          if (setOpen) {
            setOpen(false);
          }
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating appointment", { 
        description: "Internal server error",
      });
    }
  })
   

  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Apppointment";
  }

  useEffect(()=>{
    const controler=new AbortController()
    const fetchDoctors=async()=>{
      try {
        const res = await fetch("/api/doctors",{signal:controler.signal})
         
        if(res.ok){
          const data=await res.json()
          setDoctors(data)
        }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error:any) {
        console.log(error)
      }
      
    }
    fetchDoctors()
    return ()=>{
      controler.abort()
    }
  },[])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6 ">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}

        {type !== "cancel" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {doctors.map((doctor) => (
                <SelectItem key={doctor.doctorId} value={doctor.doctorId}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image||"/assets/images/noavatar.jpg"}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p className="capitalize">Dr. {doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />

            <div
              className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}
            >
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Appointment reason"
                placeholder="Annual montly check-up"
                // disabled={type === "schedule"}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
                // disabled={type === "schedule"}
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Urgent meeting came up"
          />
        )}

        <SubmitButton
          isLoading={isPending}
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};