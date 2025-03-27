import { useRouter } from "next/navigation";
import { memo, useEffect, useState, useRef } from "react";
import { cn, extractInitials, nameColor } from "@/lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { useSocket } from "@/stores/useSocket";
import BookingBtn from "./BookingBtn";
import OnlineBanner from "./OnlineBanner";

type OnlineDoctor={
    id:string;
    newUserId:string;
    role:"doctor"
    status:"free"|"occupied"
  }
  type DoctorCard={
    // doctorUserId: database Id
    doctorUserId:string;
    doctorId:string;
    name:string;
    specialty:string[];
    description?:string;
    image?:string;
    location?:string
    experience?:string
  }

const OnlineDoctorCard=memo(({doctor}:{doctor:DoctorCard})=>{
  const router=useRouter()
  const {socket}=useSocket()
  const [isDoctorOccupied,setIsDoctorOccupied]=useState(false)
 const doctorNameColor=nameColor(doctor.name)
 const parentRef=useRef<HTMLDivElement|null>(null)

  
 useEffect(()=>{
  if(!socket) return
  
 const handleGetUsers = (users:OnlineDoctor[]) => {
   const doctors=users.filter((item)=>item.newUserId===doctor.doctorUserId)
   if(users?.some((user) => user.newUserId === doctor?.doctorUserId)){
   
     if(doctors.length>0){
       if(doctors[0].status==="occupied"){
         setIsDoctorOccupied(true)
         return
       }
       setIsDoctorOccupied(false)
       return
     } 
     return
 }
 setIsDoctorOccupied(false)

 return
   };
  
 socket?.on("getOnlineDoctors",handleGetUsers)
 return () => {
     if (socket) {
       socket.off("getOnlineDoctors", handleGetUsers);
     }
   };
},[socket,doctor])


console.log("first")


  return (
    <Card ref={parentRef} className="overflow-hidden col-span-1 transition-all hover:shadow-md dark:border-neutral-600 dark:bg-dark-400">
      <CardContent className="p-4 pt-6">
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <div className="relative mb-4">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white dark:border-neutral-100 shadow-sm">
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={doctor.image ? doctor.image : ""}
                  alt="@shadcn"
                />
                <AvatarFallback
                  style={{ backgroundColor: `${doctorNameColor}` }}
                  className="text-xl font-semibold"
                >
                  {extractInitials(doctor?.name || "John Doe")}
                </AvatarFallback>
              </Avatar>
            </div>
         

            <OnlineBanner userId={doctor.doctorUserId} className="-bottom-2 -right-1"/>
          </div>

          {/* Doctor Info */}
          <div className="w-full  space-y-2 flex flex-col items-start">
            <div className="w-full flex items-center justify-center gap-2">
              <h3 className="font-bold">{doctor.name}</h3>
            </div>
            <div className="w-full flex items-center gap-2 flex-wrap">
              {doctor.specialty.map((item, i) => (
                <Badge
                  key={i}
                  variant={"outline"}
                  className="dark:bg-neutral-600"
                >
                  {item}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{doctor.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              
              <span>{doctor.experience||"4"}+ years experience</span>
            </div>

            {/* Status Badge */}
            <div className="pt-1">
              <Badge
                variant={!isDoctorOccupied ? "default" : "secondary"}
                className={cn(
                  "rounded-full px-3",
                  !isDoctorOccupied
                    ? "dark:text-white dark:bg-emerald-500/80 dark:hover:bg-emerald-500/70"
                    : "dark:bg-neutral-800/80"
                )}
              >
                {!isDoctorOccupied ? "Available Now" : "In a session"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          onClick={() =>
            router.push(
              `/book-doctor/preview/${doctor.doctorUserId}?doctorId=${doctor.doctorId}`
            )
          }
          className="w-full dark:bg-neutral-800/40 dark:border-neutral-500"
          variant="outline"
          size="sm"
        >
          Preview
        </Button>
     <BookingBtn doctorId={doctor.doctorUserId} doctor={doctor}/>
      </CardFooter>
    </Card>
  );

  
},(prevProps,nextProps)=>(
  prevProps.doctor.doctorUserId===nextProps.doctor.doctorUserId
))

OnlineDoctorCard.displayName="OnlineDoctorCard"

export default OnlineDoctorCard