"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock,  AlertCircle, Search, User, Plus,  Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { extractInitials, nameColor } from "@/lib/utils"
import { createAppointment } from "@/lib/actions/appointment.actions"
import { toast } from "sonner"
import { useCurrentUser } from "@/components/providers/UserProvider"

type Patient= {
  id: string,
  name: string,
  email: string,
  avatar: string,
}

interface CreateAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?:React.ReactNode
  patients:Patient[]
  doctorId?:string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CreateAppointmentDialog({ open, onOpenChange,children,patients }: CreateAppointmentDialogProps) {
  const [step, setStep] = useState<"patient" | "details" | "confirmation">("patient")
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [note,setNote]=useState("")
  const [reason,setReason]=useState<string|null>(null)
  const [appointmentDate,setAppointmentDate]=useState<string|null>(null)
  const {user}=useCurrentUser()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  // Mock patient search results
 

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )


  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setStep("details")
  }

  const handleCreateAppointment = async() => {
    if(!selectedPatient || !appointmentDate || !reason ||!user){
      toast.error("Error Occured",{description:"You need to provide a patient, doctor, reason or date in order to create an appointment."})
      return
    }
    // Here you would typically submit the appointment data to your backend
  
    try {
      const createdAppointment=await createAppointment({
                  doctor: user?.id,
                  user: selectedPatient.id,
                  schedule: appointmentDate,
                  status: "scheduled",
                  reason: reason,
                  note: note,
                  paymentStatus:"unpaid"
                })

      if(createdAppointment.error){
        throw new Error(createdAppointment.error)
      }          
      setStep("confirmation")
      toast.success("appointment was created successfully.")
    } catch (error) {
      console.log(error)
      toast.error("internal server error",{description:`${error?error:"Could ot createyour appointment."}`})
    }
  }

  const handleNewAppointment = () => {
    setSelectedPatient(null)
    setSearchQuery("")
    setStep("patient")
  }

  useEffect(()=>{
    const combineDateTime = (dateString: string, timeString: string): void=> {
      if (!dateString || !timeString) return;
  
      // Create a new Date object from the selected date
      const dateObj = new Date(dateString);
  
      // Extract hours and minutes from the time string
      const [hours, minutes] = timeString.split(":").map(Number);
  
      // Set hours and minutes on the Date object
      dateObj.setHours(hours, minutes, 0, 0);
  
      // Convert to ISOString format
       setAppointmentDate(dateObj.toISOString());
    };
    if (date && time){combineDateTime(date,time)}
  },[date,time])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] sm:h-[500px] dark:bg-dark-400 dark:border-neutral-700">
      <ScrollArea className="w-full h-full  pb-8 md:pb-4">
        <div className="w-full px-3">
        {step === "patient" && (
          <>
            <DialogHeader>
              <DialogTitle>Create New Appointment</DialogTitle>
              <DialogDescription>Search for an existing patient or create a new patient record.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 ">
              <div className="relative px-2">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search by name, ID, or email..."
                  className="pl-9 dark:bg-dark-200 dark:focus:bg-dark-500/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <Card
                      key={patient.id}
                      className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:bg-transparent dark:border-neutral-700 dark:hover:bg-dark-500/30"
                      onClick={() => handleSelectPatient(patient)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                          <AvatarImage src={patient.avatar} alt={patient.name} />
                          <AvatarFallback style={{backgroundColor:`${nameColor(patient.name)}`}} className="">
                            {extractInitials(patient.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-white">{patient.name}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            ID: {patient.id} • {patient.email}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="dark:hover:bg-green-500" onClick={()=>setSelectedPatient(patient)}>
                        Select
                      </Button>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-dark-300 flex items-center justify-center mb-3">
                      <User className="h-6 w-6 text-slate-400" />
                    </div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">No patients found</h4>
                    <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">
                      Try a different search or create a new patient record.
                    </p>
                    <Button className="mt-4 dark:bg-emerald-600 dark;hover:bg-emerald-700 dark:text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Patient
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="dark:bg-red-600 dark:hover:bg-red-700">
                Cancel
              </Button>
              <Button
                className="dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white"
                onClick={() => setStep("details")}
                disabled={!selectedPatient}
              >
                Continue
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "details" && selectedPatient && (
 
            <>
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
              <DialogDescription>Schedule an appointment for {selectedPatient.name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                  <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                  <AvatarFallback style={{backgroundColor:`${nameColor(selectedPatient.name)}`}} className="">
                  {extractInitials(selectedPatient.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">{selectedPatient.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    ID: {selectedPatient.id} • {selectedPatient.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointment-date">Appointment Date</Label>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Input
                    id="appointment-date"
                    type="date"
                    className="flex-1 dark:bg-dark-200 dark:focus:bg-dark-500/40 dark:focus-visible:ring-green-500"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e)=>setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointment-time">Appointment Time</Label>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2">
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <Input id="appointment-time" type="time" onChange={(e)=>setTime(e.target.value)} className="flex-1 dark:bg-dark-200 dark:focus:bg-dark-500/40 dark:focus-visible:ring-green-500" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Appointment</Label>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-2">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <Select onValueChange={(e)=>setReason(e)}>
                    <SelectTrigger className="flex-1 dark:bg-dark-200 dark:focus:bg-dark-500/40 dark:focus:ring-green-500">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-dark-300">
                      <SelectItem value="general-checkup" className="dark:hover:bg-dark-500/50">General Check-up</SelectItem>
                      <SelectItem value="follow-up" className="dark:hover:bg-dark-500/50">Follow-up Appointment</SelectItem>
                      <SelectItem value="consultation" className="dark:hover:bg-dark-500/50">Consultation</SelectItem>
                      <SelectItem value="prescription" className="dark:hover:bg-dark-500/50">Prescription Renewal</SelectItem>
                      <SelectItem value="lab-results" className="dark:hover:bg-dark-500/50">Lab Results Review</SelectItem>
                      <SelectItem value="other" className="dark:hover:bg-dark-500/50">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Notes</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional information about this appointment..."
                  onChange={(e)=>setNote(e.target.value)}
                  className="min-h-[100px] dark:bg-dark-200 dark:focus:bg-dark-500/40 dark:focus-visible:ring-green-500 dark:focus-visible:ring-offset-dark-400"
                />
              </div>

          
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("patient")} className="dark:bg-neutral-950 dark:focus-visible:bg-neutral-900">
                Back
              </Button>
              <Button className="dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white" onClick={handleCreateAppointment}>
                Create Appointment
              </Button>
            </DialogFooter>
            </>
         
        )}

        {step === "confirmation" && (
          <>
            <DialogHeader>
              <DialogTitle>Appointment Created</DialogTitle>
              <DialogDescription>The appointment has been successfully scheduled.</DialogDescription>
            </DialogHeader>

            <div className="py-6 text-center">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Appointment Confirmed</h3>
              <p className="text-sm text-slate-500 dark:text-neutral-400 mt-2">
                An appointment has been scheduled for {selectedPatient?.name} on April 5, 2025 at 10:30 AM.
              </p>

              <div className="mt-6 space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-neutral-400">Patient:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{selectedPatient?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-neutral-400">Date & Time:</span>
                  <span className="font-medium text-slate-900 dark:text-white">April 5, 2025 at 10:30 AM</span>
                </div>
              
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-neutral-400">Reason:</span>
                  <span className="font-medium text-slate-900 dark:text-white">General Check-up</span>
                </div>
             
              </div>

              <div className="mt-6 p-3 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Payment Required</span>
                </div>
                <p className="mt-1">The patient will need to complete payment before the consultation can begin.</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button className="dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white" onClick={handleNewAppointment}>
                Create Another
              </Button>
            </DialogFooter>
          </>
        )}
        </div>
         </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}


