"use client"
import React, { ReactNode } from 'react'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CoreRow } from '@tanstack/react-table';
import { Appointment } from '@/types/appwrite.types';
import Image from 'next/image';
import { ScrollArea } from './ui/scroll-area';

const GeneralAppointmentView = ({children,appointment}:{children:ReactNode,appointment:CoreRow<Appointment>}) => {
  
    
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className=" shad-dialog sm:max-w-md bg-dark-300 border-neutral-700">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">
            {" "}
            Appointment Overview
          </DialogTitle>
        </DialogHeader>


        <ScrollArea className="w-full h-full">
            <div className="w-full">
              <div className="w-full flex items-center gap-3">
                <div className="w-3/12 aspect-square relative rounded-full flex items-center justify-center ">
                  <Image
                    src={"/assets/images/noavatar.jpg"}
                    alt="doctor"
                    height={56}
                    width={56}
                    priority
                    className="w-full aspect-square rounded-full"
                  />
                </div>
                <div className="flex flex-col justify-start gap-3">
                  <span className="capitalize font-semibold text-3xl truncate">
                    Dr. {appointment?.doctor?.name ?? "John Doe"}
                  </span>
                  <span className="capitalize truncate font-medium  text-gray-400">
                    radiology | peditrician
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <h4 className="font-semibold text-xl">Purpose of appointment</h4>
                <p className="font-thin">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit
                  veniam hic impedit, nostrum, reprehenderit odit quas odio, ut
                  voluptatem rem cupiditate dolorem molestiae similique temporibus
                  obcaecati corporis ipsam eveniet deserunt.
                </p>
              </div>
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default GeneralAppointmentView