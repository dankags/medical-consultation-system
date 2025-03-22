import { useBalance } from "@/stores/useBalance";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../providers/UserProvider";
import { useEffect, useState } from "react";
import { cn, extractInitials, nameColor } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MapPin } from "lucide-react";
import { Badge } from "../ui/badge";
import { DefaultEventsMap, Socket } from 'socket.io';
import { Calendar } from "../ui/calendar";

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

const OnlineDoctorCard=({doctor,socket}:{doctor:DoctorCard,socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> | null})=>{
  const router=useRouter()
  const {balance}=useBalance()
  const {userId}=useAuth();
  const {user}=useCurrentUser()
  const [isUserOnline,setIsUserOnline]=useState(true)
 const [isDoctorOccupied,setIsDoctorOccupied]=useState(false)
 const doctorNameColor=nameColor(doctor.name)
  
    useEffect(()=>{
       if(!socket) return
       
      const handleGetUsers = (users:OnlineDoctor[]) => {
        const doctors=users.filter((item)=>item.newUserId===doctor.doctorUserId)
        if(users?.some((user) => user.newUserId === doctor?.doctorUserId)){
          setIsUserOnline(true)
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
      setIsUserOnline(false)
      return
        };
       
      socket?.on("getOnlineDoctors",handleGetUsers)
      return () => {
          if (socket) {
            socket.off("getOnlineDoctors", handleGetUsers);
          }
        };
     },[socket,doctor])

 

  const handleBooking=async()=>{
    if(!isUserOnline){
       toast.error("!Ooops something went wrong",{
         description:"The doctor you trying to book is currently offline."
       })
       return
    }
    if(!balance || balance < 500){
      toast.error("!Ooops something went wrong",{
        description:"You have insufficient funds to book this session.",
        action:<Button variant={"outline"} onClick={()=>router.push(`/deposit/${userId}`)}>Recharge</Button>
      })
      return
    }
    if(isDoctorOccupied){
                toast.error("!Ooops something went wrong",{
                  description:"The doctor you trying to book is currently in a session."
                })
                return
             }

    socket?.emit("sendBookingRequest", {
      patientId: user?.id,
      doctorId: doctor?.doctorUserId,
      message: `Hello Dr. ${doctor?.name} its ${user?.name} and I would like to book a session with you argently.`,
    });

  }

  return (
    <Card className="overflow-hidden col-span-1 transition-all hover:shadow-md dark:border-neutral-600 dark:bg-dark-400">
      <CardContent className="p-4 pt-6">
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <div className="relative mb-4">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 shadow-sm">
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
            <div
              className={cn(
                "absolute bottom-0 right-0 h-4 w-4 rounded-full ring-2 ring-white dark:ring-neutral-800",
                isUserOnline
                  ? "bg-emerald-500"
                  : "bg-slate-300 dark:bg-neutral-600"
              )}
            ></div>
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
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{doctor.experience||"4"}+ years experience</span>
            </div>

            {/* Status Badge */}
            <div className="pt-1">
              <Badge
                variant={isDoctorOccupied ? "default" : "secondary"}
                className={cn(
                  "rounded-full px-3",
                  isDoctorOccupied
                    ? "dark:text-white dark:bg-emerald-500/80 dark:hover:bg-emerald-500/70"
                    : "dark:bg-neutral-800/80"
                )}
              >
                {isDoctorOccupied ? "Available Now" : "In a session"}
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
        <Button
          onClick={handleBooking}
          variant={"secondary"}
          disabled={isDoctorOccupied || isUserOnline}
          className={cn(
            "w-full dark:bg-emerald-500 dark:hover:bg-emerald-500/80 dark:disabled:bg-emerald-500/30 "
          )}
          size="sm"
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );

  
}

export default OnlineDoctorCard