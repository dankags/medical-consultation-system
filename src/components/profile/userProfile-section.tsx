"use client"
import {
  Calendar,
  MapPin,
  Mail,
  Phone,
  FileText,
  CreditCard,
  ChevronRight,
  Edit,
  LogOut,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import Image from "next/image"
import { useCurrentUser } from "../providers/UserProvider"
import { extractInitials, nameColor } from "@/lib/utils"
import { useSocket } from "@/stores/useSocket"
import { useClerk } from "@clerk/nextjs"
import Link from "next/link"

export default function UserProfilePage() {
    const {user}=useCurrentUser()
    const {socket:userSocket,removeSocket}=useSocket()
    const { signOut } = useClerk()
    const userNameColor=nameColor(user?.name||"John Doe")
  return (
    <ScrollArea className="w-full h-full pb-16 md:pb-0">
      <main className="w-full">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 w-full overflow-hidden">
          <Image
            src="/assets/images/Premium Vector _ Iridescent Holographic Background.jpeg"
            alt="Cover"
            width={1200}
            height={500}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 bg-black/20 text-white dark:hover:text-black dark:hover:bg-white/30"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        </div>

        {/* Profile Section */}
        <div className="container relative -mt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Sidebar */}
            <div className="md:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="overflow-hidden dark:bg-dark-300 dark:border-neutral-700">
                <CardContent className="p-0">
                  <div className="flex flex-col items-center p-6 pb-4">
                    <div className="relative mb-4">
                      <div className="h-24 w-24 rounded-full overflow-hidden ring-2 ring-offset-2 dark:ring-white dark:ring-offset-neutral-900 shadow-md">
                        <Avatar className="w-full h-full">
                          <AvatarImage
                            src={user?.image ? user?.image : ""}
                            alt="@shadcn"
                          />
                          <AvatarFallback
                            style={{ backgroundColor: `${userNameColor}` }}
                            className="text-xl font-semibold"
                          >
                            {extractInitials(user?.name || "John Doe")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full ring-2 ring-offset-1 dark:ring-neutral-500 dark:ring-offset-neutral-900  dark:bg-green-500 dark:hover:bg-green-500/95 shadow-sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>

                    <h2 className="text-xl font-bold">{user?.name||"John Doe"}</h2>
                 

                    <div className="w-full mt-6">
                      <Button variant="secondary" className="w-full dark:bg-green-500 dark:hover:bg-green-500/80">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Phone</p>
                        <p className="font-medium">{user?.phone||"+254 712345678"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Email</p>
                        <p className="font-medium">{user?.email||"johndoe@example.com"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Address</p>
                        <p className="font-medium">123 Moi Avenue, Nairobi</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="dark:bg-dark-300 dark:border-neutral-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Link href={"/appointment"}   className="w-full flex items-center justify-start gap-2 px-4 rounded-md py-2 dark:hover:bg-dark-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      My Appointments
                    </Link>
                    <Button variant="ghost" className="w-full justify-start dark:hover:bg-dark-500">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Methods
                    </Button>
                    <Separator className="my-2" />
                    <Button
                      onClick={async () => {
                        removeSocket();
                        userSocket?.emit("logout");
                        await signOut({ redirectUrl: "/auth/sign-in" });
                      }}
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-800/70"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Upcoming Appointments */}
              <Card className="dark:bg-dark-300 dark:border-neutral-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm border border-neutral-50"
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AppointmentCard
                      doctor={{
                        id: "1",
                        name: "Dr. Daniel Kirungu",
                        doctorId: "1",
                        specialty: ["Cardiologist"],
                        image: "/placeholder.svg?height=48&width=48",
                      }}
                      date="Today, 2:30 PM"
                      status="confirmed"
                    />
                    <AppointmentCard
                      doctor={{
                        id: "2",
                        name: "Dr. Sarah Mwangi",
                        doctorId: "2",
                        specialty: ["Dermatologist"],
                        image: "/placeholder.svg?height=48&width=48",
                      }}
                      date="Friday, 10:00 AM"
                      status="pending"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Medical Information */}
              <Card className="dark:bg-dark-300 dark:border-neutral-700">
                <CardHeader className="pb-2">
                  <CardTitle>Medical Information</CardTitle>
                  <CardDescription>
                    Your personal health information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="summary">
                    <TabsList className="grid w-full grid-cols-3 dark:bg-dark-400">
                      <TabsTrigger
                        value="summary"
                        className="dark:data-[state=active]:bg-green-500/50"
                      >
                        Summary
                      </TabsTrigger>
                      <TabsTrigger
                        value="history"
                        className="dark:data-[state=active]:bg-green-500/50"
                      >
                        History
                      </TabsTrigger>
                      <TabsTrigger
                        value="allergies"
                        className="dark:data-[state=active]:bg-green-500/50"
                      >
                        Allergies
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="summary" className="pt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-neutral-400">
                              Blood Type
                            </p>
                            <p className="font-medium">O Positive</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-neutral-400">Height</p>
                            <p className="font-medium">175 cm</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-neutral-400">Weight</p>
                            <p className="font-medium">72 kg</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-neutral-400">BMI</p>
                            <p className="font-medium">23.5 (Normal)</p>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-medium mb-2">
                            Chronic Conditions
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Hypertension</Badge>
                            <Badge variant="outline">Mild Asthma</Badge>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">
                            Current Medications
                          </h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Lisinopril</p>
                                <p className="text-sm text-neutral-400">
                                  10mg, once daily
                                </p>
                              </div>
                              <Badge>Active</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Ventolin Inhaler</p>
                                <p className="text-sm text-neutral-400">
                                  As needed
                                </p>
                              </div>
                              <Badge>Active</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="history" className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Past Surgeries</h3>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between">
                                <p className="font-medium">Appendectomy</p>
                                <p className="text-sm">2018</p>
                              </div>
                              <p className="text-sm text-neutral-400">
                                Nairobi Hospital
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-medium mb-2">Hospitalizations</h3>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between">
                                <p className="font-medium">Pneumonia</p>
                                <p className="text-sm">2020</p>
                              </div>
                              <p className="text-sm text-neutral-400">
                                Kenyatta National Hospital, 5 days
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-medium mb-2">Family History</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <p>Hypertension</p>
                              <p className="text-sm text-neutral-400">Father</p>
                            </div>
                            <div className="flex justify-between">
                              <p>Diabetes Type 2</p>
                              <p className="text-sm text-neutral-400">Mother</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="allergies" className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">
                            Medication Allergies
                          </h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Penicillin</p>
                                <p className="text-sm text-neutral-400">
                                  Moderate reaction - Rash
                                </p>
                              </div>
                              <Badge variant="destructive">High Risk</Badge>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-medium mb-2">Food Allergies</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Peanuts</p>
                                <p className="text-sm text-neutral-400">
                                  Mild reaction - Itching
                                </p>
                              </div>
                              <Badge variant="secondary">Low Risk</Badge>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="font-medium mb-2">Other Allergies</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">Dust Mites</p>
                                <p className="text-sm text-neutral-400">
                                  Triggers asthma symptoms
                                </p>
                              </div>
                              <Badge variant="outline">Managed</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="dark:bg-dark-300 dark:border-neutral-700">
                <CardHeader className="pb-2">
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Appointment Scheduled</p>
                        <p className="text-sm text-neutral-400">
                          You scheduled an appointment with Dr. Sarah Mwangi
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          2 days ago
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Medical Record Updated</p>
                        <p className="text-sm text-neutral-400">
                          Your blood pressure readings were updated
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          1 week ago
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">Payment Processed</p>
                        <p className="text-sm text-neutral-400">
                          Payment for Dr. Daniel Kirungu&apos;s appointment
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          2 weeks ago
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </ScrollArea>
  );
}

function AppointmentCard({ doctor, date, status }:{doctor:DoctorCard,date:string,status:string}) {
    const doctorNameColor=nameColor(doctor.name)
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border dark:border-neutral-600">
      <Avatar className="h-12 w-12">
        <AvatarImage src={doctor.image} alt={doctor.name} />
        <AvatarFallback style={{backgroundColor:`${doctorNameColor}`}}>
          {extractInitials(doctor.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
          <h3 className="font-medium truncate">{doctor.name}</h3>
          <Badge
            variant={status === "confirmed" ? "default" : "secondary"}
            className={status === "confirmed" ? "w-fit dark:bg-green-800/40 dark:text-green-400 dark:hover:bg-green-600" : "w-fit"}
          >
            {status === "confirmed" ? "Confirmed" : "Pending"}
          </Badge>
        </div>
        <p className="text-sm text-neutral-400">{doctor.specialty.join(" • ")}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 text-neutral-500" />
            <span>{date}</span>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="shrink-0">
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}

