import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cn, getTimeOfDay, extractInitials, nameColor, formatNumber } from '../../lib/utils';
import { getUpcomingAppointmentsForUser,  getUserBalance, getUserPayments } from "@/lib/actions/user.actions";
import { fetchUserData } from '../../lib/actions/user.actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronRight, Clock, CreditCard, DollarSign, FileText, MessageSquare, Plus, User, Video} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoctorStatsCard } from "@/components/home/doctor/stats-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DoctorAppointmentCard } from "@/components/home/doctor/appointment-card";
import { PatientAppointmentCard } from "@/components/home/patient/appointment-card";
import { DoctorAppointmentDocument, PatientAppointmentDocument } from "@/types";
import RecentTransactions from "@/components/payments/shared/RecentTransactions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export const metadata: Metadata = {
  title:"Home",
  description: 'Heatlth care consultation system',
};

export const revalidate = 300



export default async function Home() {
  const [{userId},user,res]=await Promise.all([auth(),fetchUserData(),getUserBalance()])
  
 
  if(!userId||res?.error==="Not Autheticated"){
    redirect("/auth/sign-in")
  }
  if(user.error){
    redirect("/not-found")
  }
 const filteredAppointments=await getUpcomingAppointmentsForUser(user.user.id)
 const userPayments=await getUserPayments(user?.user.id)
  return (
    <div className="w-full h-[calc(100vh-80px)] flex-col ">
      <ScrollArea className="w-full h-full px-3 pb-24 md:pb-4">
        <main className="w-full">
          <section
            className={cn(
              "w-full flex flex-col  items-center justify-between gap-3 my-6"
            )}
          >
            <div
              className={cn(
                "w-full  flex flex-col justify-cente gap-2 md:gap-3"
              )}
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-bold tracking-tight">
                  Good {getTimeOfDay()}, {user?.user.role === "doctor" && "Dr."}{" "}
                  {user?.user.name || "John Doe"}
                </h3>
                <p className="mt-1 dark:text-neutral-400">
                  Welcome to your health home. How are you feeling today?
                </p>
              </div>
              {user?.user.role !== "admin" && (
                <>
                  {user?.user.role === "doctor" ? (
                    <div className="grid gap-6 md:grid-cols-4 mb-8">
                      <DoctorStatsCard
                        title="Today's Appointments"
                        value="2"
                        icon={Calendar}
                        description="2 upcoming"
                        trend="+1 from yesterday"
                        trendUp={true}
                      />

                      <DoctorStatsCard
                        title="Total Patients"
                        value="124"
                        icon={User}
                        description="3 new this week"
                        trend="+12% this month"
                        trendUp={true}
                      />

                      <DoctorStatsCard
                        title="Earnings"
                        value="KSh 15,500"
                        icon={DollarSign}
                        description="Available balance"
                        trend="+18% this month"
                        trendUp={true}
                      />

                      <DoctorStatsCard
                        title="Consultation Time"
                        value="24h"
                        icon={Clock}
                        description="This week"
                        trend="+2h from last week"
                        trendUp={true}
                      />
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-3 mb-8">
                      <Card className="bg-white dark:bg-dark-400 border-slate-200 dark:border-neutral-700">
                        <CardHeader className="pb-2">
                          <CardDescription>Account Balance</CardDescription>
                          <CardTitle className="text-3xl font-bold">
                            KSh {formatNumber(res.balance||0)}
                          </CardTitle>
                        </CardHeader>
                        <CardFooter>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full dark:bg-green-500 dark:hover:bg-green-500/90 dark:text-white"
                            asChild
                          >
                            <Link href={`/deposit/${user?.user.id}`}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Funds
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card className="bg-white dark:bg-dark-400 border-slate-200 dark:border-neutral-700">
                        <CardHeader className="pb-2">
                          <CardDescription>
                            Upcoming Appointments
                          </CardDescription>
                          <CardTitle className="text-3xl font-bold">
                            2
                          </CardTitle>
                        </CardHeader>
                        <CardFooter>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full dark:bg-green-500 dark:hover:bg-green-500/90 dark:text-white"
                            asChild
                          >
                            <Link href="/appointments">
                              <Calendar className="mr-2 h-4 w-4" />
                              View All
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card className="bg-white dark:bg-dark-400 border-slate-200 dark:border-neutral-700">
                        <CardHeader className="pb-2">
                          <CardDescription>Unread Messages</CardDescription>
                          <CardTitle className="text-3xl font-bold">
                            3
                          </CardTitle>
                        </CardHeader>
                        <CardFooter>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full dark:bg-green-500 dark:hover:bg-green-500/90 dark:text-white"
                            asChild
                          >
                            <Link href="#">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Open Inbox
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  )}
                </>
              )}
            </div>
            
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            {/* Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {user?.user.role !== "admin" && (
                <>
                  {user?.user.role === "user" ? (
                    <>
                      {/* Book Appointment Card */}
                      <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 dark:from-green-500/20 dark:to-green-500/5 dark:border-neutral-700">
                        <CardHeader>
                          <CardTitle>Book a Doctor</CardTitle>
                          <CardDescription>
                            Schedule a consultation with our specialists
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                              className="dark:bg-green-500 hover:bg-green-500/90 dark:text-white"
                              asChild
                            >
                              <Link href="/book-doctor">
                                <Calendar className="mr-2 h-4 w-4" />
                                Book Appointment
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Upcoming Appointments */}
                      <Card className="bg-white dark:bg-dark-400 border-slate-200 dark:border-neutral-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <div>
                            <CardTitle>Upcoming Appointments</CardTitle>
                            <CardDescription>
                              Your scheduled consultations
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 dark:hover:bg-green-500"
                            asChild
                          >
                            <Link href="/patient/appointments">
                              View All
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {filteredAppointments.success ? (
                              <>
                                {filteredAppointments?.data
                                  .slice(0, 4)
                                  .map((appointment) => (
                                    <PatientAppointmentCard
                                      key={appointment.appointmentId}
                                      appointment={
                                        appointment as PatientAppointmentDocument
                                      }
                                    />
                                  ))}
                              </>
                            ) : (
                              <div className="w-full aspect-square flex items-center justify-center">
                                {filteredAppointments.error}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Recent Transactions */}
                      {userPayments.payments.length > 0 ? (
                        <RecentTransactions
                          title="Recent Payments"
                          description="Your latest received payments"
                          transactions={userPayments.payments}
                          limit={5}
                          showViewAll={true}
                          doctorView={false}
                        />
                      ) : (
                        <div className="w-full md:col-span-1 h-[500px] flex flex-col gap-3 items-center justify-center bg-slate-200 dark:bg-dark-400 rounded-md shadow-sm dark:shadow-slate-900/10 backdrop-blur-sm">
                          <div className="flex items-center justify-center w-16 h-16 rounded-lg dark:bg-emerald-900/30">
                            <CreditCard className="h-8 w-8 dark:text-emerald-400" />
                          </div>
                          <span className="text-2xl font-semibold">
                            No recent payments
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            You have no recent payments
                          </span>
                          <Link href="/">
                            <Button
                              variant="secondary"
                              className="w-fit dark:bg-green-500 dark:hover:bg-green-500/90 dark:active:bg-green-500/75"
                            >
                              Go Home
                            </Button>
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Create Appointment Card */}
                      <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 dark:from-green-500/20 dark:to-green-500/5 dark:border-neutral-700">
                        <CardHeader>
                          <CardTitle>Create Appointment</CardTitle>
                          <CardDescription>
                            Schedule a new consultation with a patient
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                              className="dark:bg-green-500 hover:bg-green-500/90 dark:text-white"
                              asChild
                            >
                              <Link href="r/appointments/new">
                                <Plus className="mr-2 h-4 w-4" />
                                New Appointment
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Upcoming Appointments */}
                      <Card className="bg-white dark:bg-dark-400 border-slate-200 dark:border-neutral-700">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <div>
                            <CardTitle>Today&apos;s Appointments</CardTitle>
                            <CardDescription>
                              Your scheduled consultations for today
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 dark:hover:bg-green-500"
                            asChild
                          >
                            <Link href="/appointments">
                              View All
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {filteredAppointments.success ? (
                              <>
                                {filteredAppointments?.data
                                  .slice(0, 4)
                                  .map((appointment) => (
                                    <DoctorAppointmentCard
                                      key={appointment.appointmentId}
                                      appointment={
                                        appointment as DoctorAppointmentDocument
                                      }
                                    />
                                  ))}
                              </>
                            ) : (
                              <div className="w-full aspect-square flex items-center justify-center">
                                {filteredAppointments.error}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Recent Transactions */}
                      {userPayments.payments.length > 0 ? (
                        <RecentTransactions
                          title="Recent Payments"
                          description="Your latest received payments"
                          transactions={userPayments.payments}
                          limit={5}
                          showViewAll={true}
                          doctorView={true}
                        />
                      ) : (
                        <div className="w-full md:col-span-1 h-[500px] flex flex-col gap-3 items-center justify-center bg-slate-200 dark:bg-dark-400 rounded-md shadow-sm dark:shadow-slate-900/10 backdrop-blur-sm">
                          <div className="flex items-center justify-center w-16 h-16 rounded-lg dark:bg-emerald-900/30">
                            <CreditCard className="h-8 w-8 dark:text-emerald-400" />
                          </div>
                          <span className="text-2xl font-semibold">
                            No recent payments
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            You have no recent payments
                          </span>
                          <Link href="/">
                            <Button
                              variant="secondary"
                              className="w-fit dark:bg-green-500 dark:hover:bg-green-500/90 dark:active:bg-green-500/75"
                            >
                              Go Home
                            </Button>
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Right side */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="bg-white dark:bg-dark-400 border-slate-200 dark:border-neutral-700">
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-2">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.user.image||""} alt={user?.user.role === "doctor"?`Dr. ${user?.user.name}`:`${user?.user.name}`} />
                      <AvatarFallback style={{backgroundColor:`${nameColor(user?.user.name||"John Doe")}`}} className="text-lg dark:text-white">
                        {extractInitials(user?.user.name||"John Doe")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle>{user?.user.role !== "admin" && user?.user.role === "doctor"?`Dr. ${user?.user.name}`:`${user?.user.name}`}</CardTitle>
                  {user?.user.role==="doctor"&&<CardDescription>General Practitioner</CardDescription>}
                </CardHeader>
                <CardContent>
                  {user?.user.role !== "admin" && (
                    <>
                      {user?.user.role === "doctor" ? (
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <div>
                            <p className="text-sm text-slate-500 dark:text-neutral-400">
                              Experience
                            </p>
                            <p className="font-medium text-slate-900 dark:text-white">
                              12 years
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 dark:text-neutral-400">
                              Rating
                            </p>
                            <p className="font-medium text-slate-900 dark:text-white">
                              4.9/5
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <div>
                            <p className="text-sm text-slate-500 dark:text-neutral-400">
                              Age
                            </p>
                            <p className="font-medium text-slate-900 dark:text-white">
                              38
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 dark:text-neutral-400">
                              Blood Type
                            </p>
                            <p className="font-medium text-slate-900 dark:text-white">
                              O+
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full dark:bg-green-500 dark:hover:bg-green-500/90"
                    asChild
                  >
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
                 {user?.user.role==="doctor"?
                 <>
                     <Card className="bg-white dark:bg-dark-400 border-slate-200 dark:border-neutral-700">
                <CardHeader>
                  <CardTitle>Account Balance</CardTitle>
                  <CardDescription>Your current earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">KSh {formatNumber(res.balance||0)}</p>
                    <p className="text-sm text-slate-500 dark:text-neutral-400 mt-1">Available for withdrawal</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full dark:text-white dark:bg-green-500 dark:hover:bg-green-500/90 " asChild>
                    <Link href={`/withdraw/${user?.user.id}`}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Withdraw Funds
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
                 </>
                 :
                 <>
                     {/* Health Tips */}
              <Card className="bg-white dark:bg-dark-400 border-slate-200 dark:border-neutral-700">
                <CardHeader>
                  <CardTitle>Health Tips</CardTitle>
                  <CardDescription>Daily wellness advice</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                      <h4 className="font-medium text-blue-700 dark:text-blue-400">Stay Hydrated</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                        Drink at least 8 glasses of water daily to maintain optimal health and energy levels.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                      <h4 className="font-medium text-emerald-700 dark:text-emerald-400">Regular Exercise</h4>
                      <p className="text-sm text-emerald-600 dark:text-emerald-300 mt-1">
                        Aim for at least 30 minutes of moderate activity each day for better health.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
                 </>}
              {/* Quick Actions */}
              <Card className="bg-white dark:bg-dark-400 border-slate-200 dark:border-neutral-700">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  {user?.user.role!=="admin"&&<>
                    {user?.user.role==="doctor"?
                    <>
                     <Button variant="outline" className="justify-start dark:bg-dark-500/40 dark:hover:bg-dark-500/60" asChild>
                    <Link href="#">
                      <User className="mr-2 h-4 w-4" />
                      Patient Directory
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start dark:bg-dark-500/40 dark:hover:bg-dark-500/60" asChild>
                    <Link href="#">
                      <FileText className="mr-2 h-4 w-4" />
                      Write Prescription
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start dark:bg-dark-500/40 dark:hover:bg-dark-500/60" asChild>
                    <Link href="#">
                      <Video className="mr-2 h-4 w-4" />
                      Start Consultation
                    </Link>
                  </Button>
                    </>
                    :
                    <>
                        <Button variant="outline" className="justify-start dark:bg-dark-500/40 dark:hover:bg-dark-500/60" asChild>
                    <Link href="#">
                      <FileText className="mr-2 h-4 w-4" />
                      Medical Records
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start dark:bg-dark-500/40 dark:hover:bg-dark-500/60" asChild>
                    <Link href="#">
                      <FileText className="mr-2 h-4 w-4" />
                      Prescriptions
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start dark:bg-dark-500/40 dark:hover:bg-dark-500/60" asChild>
                    <Link href="#">
                      <User className="mr-2 h-4 w-4" />
                      Emergency Contacts
                    </Link>
                  </Button>
                    </>}
                  </>}
                 
                </CardContent>
              </Card>
            </div>

         
          </section>
        </main>
      </ScrollArea>
    </div>
  );
}

