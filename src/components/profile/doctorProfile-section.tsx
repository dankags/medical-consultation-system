"use client"
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  Briefcase,
  Star,
  Heart,
  Shield,
  Video,
  Edit,
  Calendar,
  CreditCard,
  LogOut,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { cn, extractInitials, nameColor } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import Link from "next/link"
import { useCurrentUser } from "../providers/UserProvider"
import { useSocket } from "@/stores/useSocket"
import { useClerk } from "@clerk/nextjs"
import Image from "next/image"


export default function EnhancedDoctorProfile() {
    const {user}=useCurrentUser()
      const {socket:userSocket,removeSocket}=useSocket()
      const { signOut } = useClerk()
      const userNameColor=nameColor(user?.name||"John Doe")

  return (
    <div className="w-full h-full ">
      <ScrollArea className="w-full h-full pb-16 md:pb-0">
        <main className="w-full">
          {/* Cover Image */}
          <div className="relative h-64 md:h-80 w-full overflow-hidden">
            <Image
              src="/assets/images/Premium Vector _ Iridescent Holographic Background.jpeg"
              alt="Cover"
              width={1200}
              height={500}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Profile Section */}
          <div className="container relative -mt-24 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Sidebar */}
              <div className="md:col-span-1 space-y-6">
                {/* Profile Card */}
                <Card className="overflow-hidden dark:bg-dark-300 dark:border-neutral-700">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center p-6">
                      {/* Profile Image */}
                      <div className="relative mb-4">
                        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-background shadow-md">
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
                        <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-green-500 ring-4 ring-background"></div>
                      </div>

                      <h1 className="text-xl font-bold text-center">
                      {user?.name||"John Doe"}
                      </h1>
                      <p className="text-sm text-muted-foreground text-center">
                        Cardiologist • Pediatrician • Surgeon
                      </p>

                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium">
                          4.9 (128 reviews)
                        </span>
                      </div>

                      <div className="flex gap-2 mt-4 w-full">
                        <Button
                          variant="secondary"
                          className="w-full dark:bg-green-500 dark:hover:bg-green-500/80"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Contact Information */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{user?.phone||"+254 712345678"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">
                          {user?.email||"johndoe@example.com"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Office
                          </p>
                          <p className="font-medium">
                            Nairobi Medical Center, 3rd Floor
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Website
                          </p>
                          <p className="font-medium">www.drkirungu.com</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Languages */}
                    <div className="p-6">
                      <h3 className="font-medium mb-3">Languages</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>English</span>
                          <span className="text-sm text-muted-foreground">
                            Native
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Swahili</span>
                          <span className="text-sm text-muted-foreground">
                            Fluent
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>French</span>
                          <span className="text-sm text-muted-foreground">
                            Intermediate
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Availability Card */}
                <Card className="dark:bg-dark-300 dark:border-neutral-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Link
                        href={"/appointment"}
                        className="w-full flex items-center justify-start gap-2 px-4 rounded-md py-2 dark:hover:bg-dark-500"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        My Appointments
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start dark:hover:bg-dark-500"
                      >
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
                {/* Tabs Navigation */}
                <Card  className="dark:bg-dark-300 dark:border-neutral-700">
                  <CardContent className="p-0">
                    <Tabs defaultValue="about" className="w-full">
                      <TabsList className="w-full justify-start border-b dark:border-neutral-700 rounded-none dark:bg-dark-400 h-auto p-0 mb-0">
                        <TabsTrigger
                          value="about"
                          className="rounded-none border-b-2 border-transparent dark:data-[state=active]:border-green-500 dark:data-[state=active]:bg-transparent py-3 text-neutral-400 dark:data-[state=active]:text-white"
                        >
                          About
                        </TabsTrigger>
                        <TabsTrigger
                          value="experience"
                          className="rounded-none border-b-2 border-transparent dark:data-[state=active]:border-green-500 dark:data-[state=active]:bg-transparent py-3 text-neutral-400 dark:data-[state=active]:text-white"
                        >
                          Experience
                        </TabsTrigger>
                        <TabsTrigger
                          value="services"
                          className="rounded-none border-b-2 border-transparent dark:data-[state=active]:border-green-500 dark:data-[state=active]:bg-transparent py-3 text-neutral-400 dark:data-[state=active]:text-white"
                        >
                          Services
                        </TabsTrigger>
                        <TabsTrigger
                          value="reviews"
                          className="rounded-none border-b-2 border-transparent dark:data-[state=active]:border-green-500 dark:data-[state=active]:bg-transparent py-3 text-neutral-400 dark:data-[state=active]:text-white"
                        >
                          Reviews
                        </TabsTrigger>
                        <TabsTrigger
                          value="gallery"
                          className="rounded-none border-b-2 border-transparent dark:data-[state=active]:border-green-500 dark:data-[state=active]:bg-transparent py-3 text-neutral-400 dark:data-[state=active]:text-white"
                        >
                          Gallery
                        </TabsTrigger>
                      </TabsList>

                      {/* About Tab */}
                      <TabsContent value="about" className="p-6">
                        <div className="space-y-6">
                          <section>
                            <h2 className="text-xl font-semibold mb-4">
                              About Dr. Daniel Kirungu
                            </h2>
                            <div className="space-y-3 dark:text-neutral-600">
                              <p>
                                Dr. Daniel Kirungu is a board-certified
                                cardiologist with over 15 years of experience in
                                treating complex heart conditions. He
                                specializes in interventional cardiology,
                                pediatric cardiology, and cardiac surgery. Dr.
                                Kirungu is known for his patient-centered
                                approach and commitment to providing the highest
                                quality of care.
                              </p>
                              <p>
                                He completed his medical training at the
                                University of Nairobi and pursued further
                                specialization at Johns Hopkins University. Dr.
                                Kirungu has published numerous research papers
                                in prestigious medical journals and is a
                                frequent speaker at international cardiology
                                conferences.
                              </p>
                              <p>
                                Dr. Kirungu&apos;s approach to patient care combines
                                the latest medical advancements with
                                compassionate, personalized treatment. He
                                believes in empowering patients through
                                education and involving them in the
                                decision-making process for their healthcare
                                journey.
                              </p>
                            </div>
                          </section>

                          <section>
                            <h2 className="text-xl font-semibold mb-4">
                              Specialties
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card>
                                <CardHeader className="p-4 pb-2">
                                  <CardTitle className="text-base">
                                    Interventional Cardiology
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <p className="text-sm dark:text-neutral-600">
                                    Specializes in catheter-based treatment of
                                    heart diseases, including angioplasty and
                                    stent placement.
                                  </p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="p-4 pb-2">
                                  <CardTitle className="text-base">
                                    Pediatric Cardiology
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <p className="text-sm dark:text-neutral-600">
                                    Diagnosis and treatment of congenital heart
                                    defects, heart problems in infants,
                                    children, and adolescents.
                                  </p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="p-4 pb-2">
                                  <CardTitle className="text-base">
                                    Cardiac Surgery
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <p className="text-sm dark:text-neutral-600">
                                    Performs surgical procedures on the heart
                                    and great vessels, including bypass surgery
                                    and valve repair.
                                  </p>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="p-4 pb-2">
                                  <CardTitle className="text-base">
                                    Preventive Cardiology
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <p className="text-sm dark:text-neutral-600">
                                    Focuses on preventing heart disease through
                                    risk assessment, lifestyle changes, and
                                    medication management.
                                  </p>
                                </CardContent>
                              </Card>
                            </div>
                          </section>

                          <section>
                            <h2 className="text-xl font-semibold mb-4">
                              Professional Memberships
                            </h2>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                <span>American College of Cardiology</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                <span>Kenya Cardiac Society</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                <span>European Society of Cardiology</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                <span>
                                  International Society for Heart Research
                                </span>
                              </div>
                            </div>
                          </section>
                        </div>
                      </TabsContent>

                      {/* Experience Tab */}
                      <TabsContent value="experience" className="p-6">
                        <div className="space-y-6">
                          <section>
                            <h2 className="text-xl font-semibold mb-4">
                              Education & Training
                            </h2>
                            <div className="space-y-6">
                              <div className="relative pl-8 pb-6 border-l border-slate-200 dark:border-slate-800">
                                <div className="absolute top-0 left-0 -translate-x-1/2 h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                                  <Award className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    Fellowship in Interventional Cardiology
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Johns Hopkins University, 2010-2012
                                  </p>
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    Specialized training in advanced cardiac
                                    interventions, including complex coronary
                                    interventions, structural heart disease
                                    interventions, and peripheral vascular
                                    interventions.
                                  </p>
                                </div>
                              </div>

                              <div className="relative pl-8 pb-6 border-l border-slate-200 dark:border-slate-800">
                                <div className="absolute top-0 left-0 -translate-x-1/2 h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                                  <Award className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    Residency in Cardiology
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Mayo Clinic, 2007-2010
                                  </p>
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    Comprehensive training in all aspects of
                                    cardiovascular medicine, including cardiac
                                    imaging, electrophysiology, and heart
                                    failure management.
                                  </p>
                                </div>
                              </div>

                              <div className="relative pl-8 pb-6 border-l border-slate-200 dark:border-slate-800">
                                <div className="absolute top-0 left-0 -translate-x-1/2 h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                                  <Award className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    Internship in Internal Medicine
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Kenyatta National Hospital, 2006-2007
                                  </p>
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    Rotational training in various medical
                                    specialties, with a focus on internal
                                    medicine and cardiology.
                                  </p>
                                </div>
                              </div>

                              <div className="relative pl-8 border-l border-slate-200 dark:border-slate-800">
                                <div className="absolute top-0 left-0 -translate-x-1/2 h-6 w-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                                  <Award className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    Doctor of Medicine (MD)
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    University of Nairobi, 2001-2006
                                  </p>
                                  <p className="mt-2 text-sm text-muted-foreground">
                                   {` Graduated with honors. Thesis on "Early
                                    Detection of Cardiovascular Disease in Young
                                    Adults."`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </section>

                          <section>
                            <h2 className="text-xl font-semibold mb-4">
                              Work Experience
                            </h2>
                            <div className="space-y-6">
                              <div className="relative pl-8 pb-6 border-l border-slate-200 dark:border-slate-800">
                                <div className="absolute top-0 left-0 -translate-x-1/2 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                  <Briefcase className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    Head of Cardiology Department
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Nairobi Medical Center, 2018-Present
                                  </p>
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    Leading a team of 12 cardiologists and 25
                                    support staff. Responsible for departmental
                                    operations, quality improvement, and patient
                                    care standards.
                                  </p>
                                </div>
                              </div>

                              <div className="relative pl-8 pb-6 border-l border-slate-200 dark:border-slate-800">
                                <div className="absolute top-0 left-0 -translate-x-1/2 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                  <Briefcase className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                </div>

                                <div>
                                  <h3 className="font-medium">
                                    Senior Cardiologist
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Kenyatta National Hospital, 2012-2018
                                  </p>
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    Specialized in complex cardiac interventions
                                    and pediatric cardiology. Established the
                                    hospital&apos;s first dedicated pediatric
                                    cardiology unit.
                                  </p>
                                </div>
                              </div>

                              <div className="relative pl-8 border-l border-slate-200 dark:border-slate-800">
                                <div className="absolute top-0 left-0 -translate-x-1/2 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                  <Briefcase className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    Research Fellow
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Johns Hopkins University, 2010-2012
                                  </p>
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    Conducted research on novel interventional
                                    techniques for structural heart disease.
                                    Published 8 papers in peer-reviewed
                                    journals.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </section>

                          <section>
                            <h2 className="text-xl font-semibold mb-4">
                              Publications & Research
                            </h2>
                            <div className="space-y-4">
                              <div className="p-4 border rounded-lg">
                                <h3 className="font-medium">
                                  Novel Approaches to Pediatric Congenital Heart
                                  Disease Treatment
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Journal of Pediatric Cardiology, 2020
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  A comprehensive review of minimally invasive
                                  techniques for treating congenital heart
                                  defects in children.
                                </p>
                                <div className="mt-2">
                                  <Button
                                    variant="link"
                                    className="h-auto p-0 text-teal-600 dark:text-teal-400"
                                  >
                                    Read Publication
                                  </Button>
                                </div>
                              </div>

                              <div className="p-4 border rounded-lg">
                                <h3 className="font-medium">
                                  Long-term Outcomes of Transcatheter Aortic
                                  Valve Replacement in Elderly Patients
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  European Heart Journal, 2018
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  A 5-year follow-up study of elderly patients
                                  who underwent TAVR procedures.
                                </p>
                                <div className="mt-2">
                                  <Button
                                    variant="link"
                                    className="h-auto p-0 text-teal-600 dark:text-teal-400"
                                  >
                                    Read Publication
                                  </Button>
                                </div>
                              </div>

                              <div className="p-4 border rounded-lg">
                                <h3 className="font-medium">
                                  Cardiovascular Disease Patterns in Sub-Saharan
                                  Africa: A Comparative Analysis
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  African Journal of Medicine, 2016
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  An epidemiological study of cardiovascular
                                  disease patterns across different regions in
                                  Sub-Saharan Africa.
                                </p>
                                <div className="mt-2">
                                  <Button
                                    variant="link"
                                    className="h-auto p-0 text-teal-600 dark:text-teal-400"
                                  >
                                    Read Publication
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </TabsContent>

                      {/* Services Tab */}
                      <TabsContent value="services" className="p-6">
                        <div className="space-y-6">
                          <section>
                            <h2 className="text-xl font-semibold mb-4">
                              Services Offered
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card>
                                <CardContent className="p-6">
                                  <div className="flex gap-4 items-start">
                                    <div className="h-12 w-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                                      <Heart className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">
                                        Cardiac Consultation
                                      </h3>
                                      <p className="text-sm dark:text-neutral-600 mt-1">
                                        Comprehensive evaluation of heart
                                        health, including medical history
                                        review, physical examination, and
                                        diagnostic test interpretation.
                                      </p>
                                      <p className="text-sm font-medium mt-2">
                                        Ksh 5,000
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardContent className="p-6">
                                  <div className="flex gap-4 items-start">
                                    <div className="h-12 w-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                                      <Activity className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">
                                        Echocardiogram
                                      </h3>
                                      <p className="text-sm dark:text-neutral-600 mt-1">
                                        Ultrasound imaging of the heart to
                                        assess structure and function, detect
                                        abnormalities, and evaluate blood flow.
                                      </p>
                                      <p className="text-sm font-medium mt-2">
                                        Ksh 8,500
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardContent className="p-6">
                                  <div className="flex gap-4 items-start">
                                    <div className="h-12 w-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                                      <Activity className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">
                                        Stress Test
                                      </h3>
                                      <p className="text-sm dark:text-neutral-600 mt-1">
                                        Evaluation of heart function during
                                        physical activity to detect coronary
                                        artery disease and assess exercise
                                        capacity.
                                      </p>
                                      <p className="text-sm font-medium mt-2">
                                        Ksh 7,500
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardContent className="p-6">
                                  <div className="flex gap-4 items-start">
                                    <div className="h-12 w-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                                      <Stethoscope className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">
                                        Holter Monitoring
                                      </h3>
                                      <p className="text-sm dark:text-neutral-600 mt-1">
                                        Continuous ECG recording over 24-48
                                        hours to detect irregular heart rhythms
                                        and evaluate symptoms.
                                      </p>
                                      <p className="text-sm font-medium mt-2">
                                        Ksh 6,000
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardContent className="p-6">
                                  <div className="flex gap-4 items-start">
                                    <div className="h-12 w-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                                      <HeartPulse className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">
                                        Cardiac Catheterization
                                      </h3>
                                      <p className="text-sm dark:text-neutral-600 mt-1">
                                        Minimally invasive procedure to diagnose
                                        and treat heart conditions, including
                                        coronary artery disease.
                                      </p>
                                      <p className="text-sm font-medium mt-2">
                                        Ksh 120,000
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardContent className="p-6">
                                  <div className="flex gap-4 items-start">
                                    <div className="h-12 w-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                                      <Baby className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium">
                                        Pediatric Cardiology Consultation
                                      </h3>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        Specialized evaluation of heart
                                        conditions in infants, children, and
                                        adolescents.
                                      </p>
                                      <p className="text-sm font-medium mt-2">
                                        Ksh 6,500
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </section>

                          <section>
                            <h2 className="text-xl font-semibold mb-4">
                              Procedures
                            </h2>
                            <div className="space-y-4">
                              <div className="p-4 border rounded-lg">
                                <div className="flex justify-between">
                                  <h3 className="font-medium">
                                    Coronary Angioplasty and Stenting
                                  </h3>
                                  <Badge>Specialized</Badge>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  Procedure to open blocked coronary arteries
                                  and restore blood flow to the heart muscle
                                  using balloon angioplasty and stent placement.
                                </p>
                              </div>

                              <div className="p-4 border rounded-lg">
                                <div className="flex justify-between">
                                  <h3 className="font-medium">
                                    Transcatheter Aortic Valve Replacement
                                    (TAVR)
                                  </h3>
                                  <Badge>Specialized</Badge>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  Minimally invasive procedure to replace a
                                  narrowed aortic valve that fails to open
                                  properly (aortic stenosis).
                                </p>
                              </div>

                              <div className="p-4 border rounded-lg">
                                <div className="flex justify-between">
                                  <h3 className="font-medium">
                                    Atrial Septal Defect (ASD) Closure
                                  </h3>
                                  <Badge>Specialized</Badge>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  Procedure to close a hole in the wall (septum)
                                  between the two upper chambers of the heart
                                  (atria).
                                </p>
                              </div>

                              <div className="p-4 border rounded-lg">
                                <div className="flex justify-between">
                                  <h3 className="font-medium">
                                    Pacemaker Implantation
                                  </h3>
                                  <Badge>Specialized</Badge>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  Surgical placement of a small device that
                                  helps regulate the heartbeat in patients with
                                  certain heart rhythm disorders.
                                </p>
                              </div>
                            </div>
                          </section>
                        </div>
                      </TabsContent>

                      {/* Reviews Tab */}
                      <TabsContent value="reviews" className="p-6">
                        <div className="space-y-6">
                          <section>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                              <div className="w-full md:w-64 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                <div className="text-center">
                                  <div className="text-4xl font-bold">4.9</div>
                                  <div className="flex justify-center mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={cn(
                                          "h-5 w-5",
                                          star <= 4
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "fill-yellow-400 text-yellow-400"
                                        )}
                                      />
                                    ))}
                                  </div>
                                  <div className="text-sm dark:text-neutral-600 mt-1">
                                    Based on 128 reviews
                                  </div>
                                </div>

                                <div className="mt-6 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm">5</div>
                                    <Progress value={85} className="h-2" />
                                    <div className="text-sm">85%</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm">4</div>
                                    <Progress value={12} className="h-2" />
                                    <div className="text-sm">12%</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm">3</div>
                                    <Progress value={2} className="h-2" />
                                    <div className="text-sm">2%</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm">2</div>
                                    <Progress value={1} className="h-2" />
                                    <div className="text-sm">1%</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="text-sm">1</div>
                                    <Progress value={0} className="h-2" />
                                    <div className="text-sm">0%</div>
                                  </div>
                                </div>

                                <Button className="w-full mt-6">
                                  Write a Review
                                </Button>
                              </div>

                              <div className="flex-1 space-y-6">
                                <div className="space-y-4">
                                  <div className="p-4 border rounded-lg">
                                    <div className="flex justify-between">
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-10 w-10">
                                          <AvatarImage
                                            src="/placeholder.svg?height=40&width=40"
                                            alt="Jane Doe"
                                          />
                                          <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h3 className="font-medium">
                                            Jane Doe
                                          </h3>
                                          <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <Star
                                                key={star}
                                                className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                                              />
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-sm dark:text-neutral-600">
                                        2 weeks ago
                                      </div>
                                    </div>
                                    <p className="mt-3 text-sm dark:text-neutral-600">
                                      Dr. Kirungu is an exceptional
                                      cardiologist. He took the time to explain
                                      my condition in detail and answered all my
                                      questions patiently. His expertise and
                                      compassionate care made a difficult
                                      diagnosis much easier to handle.
                                    </p>
                                  </div>

                                  <div className="p-4 border rounded-lg">
                                    <div className="flex justify-between">
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-10 w-10">
                                          <AvatarImage
                                            src="/placeholder.svg?height=40&width=40"
                                            alt="John Smith"
                                          />
                                          <AvatarFallback>JS</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h3 className="font-medium">
                                            John Smith
                                          </h3>
                                          <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <Star
                                                key={star}
                                                className={cn(
                                                  "h-3.5 w-3.5",
                                                  star <= 4
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-slate-300 dark:text-slate-600"
                                                )}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-sm dark:text-neutral-600">
                                        1 month ago
                                      </div>
                                    </div>
                                    <p className="mt-3 text-sm dark:text-neutral-600">
                                      My son had a congenital heart defect, and
                                      Dr. Kirungu performed the surgery. His
                                      skill and expertise are unmatched. The
                                      follow-up care was excellent, and my son
                                      has made a full recovery. We are forever
                                      grateful.
                                    </p>
                                  </div>

                                  <div className="p-4 border rounded-lg">
                                    <div className="flex justify-between">
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-10 w-10">
                                          <AvatarImage
                                            src="/placeholder.svg?height=40&width=40"
                                            alt="Mary Johnson"
                                          />
                                          <AvatarFallback>MJ</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <h3 className="font-medium">
                                            Mary Johnson
                                          </h3>
                                          <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <Star
                                                key={star}
                                                className={cn(
                                                  "h-3.5 w-3.5",
                                                  star <= 5
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-slate-300 dark:text-slate-600"
                                                )}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-sm dark:text-neutral-600">
                                        2 months ago
                                      </div>
                                    </div>
                                    <p className="mt-3 text-sm dark:text-neutral-600">
                                      I&apos;ve been seeing Dr. Kirungu for my heart
                                      condition for over 5 years. He is always
                                      up-to-date with the latest treatments and
                                      takes a holistic approach to cardiac care.
                                      His staff is also very professional and
                                      friendly.
                                    </p>
                                  </div>
                                </div>

                                <Button variant="outline" className="w-full">
                                  Load More Reviews
                                </Button>
                              </div>
                            </div>
                          </section>
                        </div>
                      </TabsContent>

                      {/* Gallery Tab */}
                      <TabsContent value="gallery" className="p-6">
                        <div className="space-y-6">
                          <section>
                            <h2 className="text-xl font-semibold mb-4">
                              Office & Facilities
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              <div className="relative aspect-video rounded-lg overflow-hidden">
                                <Image
                                  src="/assets/images/Premium Vector _ Iridescent Holographic Background.jpeg"
                                  alt="Office Reception"
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="relative aspect-video rounded-lg overflow-hidden">
                                <Image
                                  src="/assets/images/Premium Vector _ Iridescent Holographic Background.jpeg"
                                  alt="Office Reception"
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="relative aspect-video rounded-lg overflow-hidden">
                                <Image
                                  src="/assets/images/Premium Vector _ Iridescent Holographic Background.jpeg"
                                  alt="Office Reception"
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="relative aspect-video rounded-lg overflow-hidden">
                                <Image
                                  src="/assets/images/Premium Vector _ Iridescent Holographic Background.jpeg"
                                  alt="Office Reception"
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="relative aspect-video rounded-lg overflow-hidden">
                                <Image
                                  src="/assets/images/Premium Vector _ Iridescent Holographic Background.jpeg"
                                  alt="Office Reception"
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="relative aspect-video rounded-lg overflow-hidden">
                                <Image
                                  src="/assets/images/Premium Vector _ Iridescent Holographic Background.jpeg"
                                  alt="Office Reception"
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          </section>

                          <section>
                            <h2 className="text-xl font-semibold mb-4">
                              Videos
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="rounded-lg overflow-hidden border">
                                <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                  <Video className="h-12 w-12 text-slate-400" />
                                </div>
                                <div className="p-4">
                                  <h3 className="font-medium">
                                    Understanding Heart Health
                                  </h3>
                                  <p className="text-sm dark:text-neutral-600 mt-1">
                                    Dr. Kirungu explains the basics of heart
                                    health and preventive measures.
                                  </p>
                                </div>
                              </div>
                              <div className="rounded-lg overflow-hidden border">
                                <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                  <Video className="h-12 w-12 text-slate-400" />
                                </div>
                                <div className="p-4">
                                  <h3 className="font-medium">
                                    Cardiac Surgery: What to Expect
                                  </h3>
                                  <p className="text-sm dark:text-neutral-600 mt-1">
                                    A walkthrough of the cardiac surgery process
                                    and recovery.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </section>

                          <section>
                            <h2 className="text-xl font-semibold mb-4">
                              Certificates & Awards
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              <div className="aspect-square rounded-lg overflow-hidden border p-4 flex flex-col items-center justify-center text-center">
                                <Award className="h-12 w-12 text-yellow-500 mb-4" />
                                <h3 className="font-medium">
                                  Excellence in Cardiology
                                </h3>
                                <p className="text-sm dark:text-neutral-600 mt-1">
                                  Kenya Medical Association, 2019
                                </p>
                              </div>
                              <div className="aspect-square rounded-lg overflow-hidden border p-4 flex flex-col items-center justify-center text-center">
                                <Award className="h-12 w-12 text-yellow-500 mb-4" />
                                <h3 className="font-medium">
                                  Outstanding Physician Award
                                </h3>
                                <p className="text-sm dark:text-neutral-600 mt-1">
                                  Nairobi Medical Center, 2021
                                </p>
                              </div>
                              <div className="aspect-square rounded-lg overflow-hidden border p-4 flex flex-col items-center justify-center text-center">
                                <Award className="h-12 w-12 text-yellow-500 mb-4" />
                                <h3 className="font-medium">
                                  Research Excellence
                                </h3>
                                <p className="text-sm dark:text-neutral-600 mt-1">
                                  African Cardiac Society, 2018
                                </p>
                              </div>
                            </div>
                          </section>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Similar Doctors */}
                <Card  className="dark:bg-dark-300 dark:border-neutral-700">
                  <CardHeader className="pb-2">
                    <CardTitle>Similar Doctors</CardTitle>
                    <CardDescription>
                      Other specialists you might be interested in
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 p-4 rounded-lg border dark:border-neutral-600">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src="/placeholder.svg?height=64&width=64"
                            alt="Dr. Sarah Mwangi"
                          />
                          <AvatarFallback>SM</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">Dr. Sarah Mwangi</h3>
                          <p className="text-sm text-neutral-400">
                            Cardiologist
                          </p>
                          <div className="flex items-center mt-1">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs ml-1">
                              4.7 (98 reviews)
                            </span>
                          </div>
                        </div>
                        <Button size="sm" className="dark:bg-green-500 dark:hover:bg-green-500/80">View</Button>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-lg border dark:border-neutral-600">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src="/placeholder.svg?height=64&width=64"
                            alt="Dr. James Omondi"
                          />
                          <AvatarFallback>JO</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">Dr. James Omondi</h3>
                          <p className="text-sm text-neutral-400">
                            Cardiac Surgeon
                          </p>
                          <div className="flex items-center mt-1">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs ml-1">
                              4.8 (112 reviews)
                            </span>
                          </div>
                        </div>
                        <Button size="sm" className="dark:bg-green-500 dark:hover:bg-green-500/80">View</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Section */}
                <Card  className="dark:bg-dark-300 dark:border-neutral-700">
                  <CardHeader className="pb-2">
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border dark:border-neutral-600">
                        <h3 className="font-medium">
                          What insurance plans do you accept?
                        </h3>
                        <p className="text-sm text-neutral-400 mt-2">
                          Dr. Kirungu accepts most major insurance plans,
                          including NHIF, AAR, Jubilee, Britam, and Madison.
                          Please contact our office to verify your specific
                          insurance coverage.
                        </p>
                      </div>

                      <div className="p-4 rounded-lg border dark:border-neutral-600 ">
                        <h3 className="font-medium">
                          How long does a typical appointment last?
                        </h3>
                        <p className="text-sm text-neutral-400 mt-2">
                          Initial consultations typically last 45-60 minutes,
                          while follow-up appointments are usually 20-30
                          minutes. Complex cases may require additional time.
                        </p>
                      </div>

                      <div className="p-4 rounded-lg border dark:border-neutral-600">
                        <h3 className="font-medium">
                          Do I need a referral to see Dr. Kirungu?
                        </h3>
                        <p className="text-sm text-neutral-400 mt-2">
                          While referrals are not always required, they are
                          recommended. Some insurance plans may require a
                          referral from your primary care physician for
                          coverage.
                        </p>
                      </div>

                      <div className="p-4 rounded-lg border dark:border-neutral-600">
                        <h3 className="font-medium">
                          What should I bring to my first appointment?
                        </h3>
                        <p className="text-sm text-neutral-400 mt-2">
                         Please bring your ID, insurance card, a list of
                          current medications, any relevant medical records or
                          test results, and a list of questions or concerns
                          you&apos;d like to discuss.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </ScrollArea>
    </div>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Activity({ className, ...props }:{className:string,props?:any}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-activity", className)}
      {...props}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Stethoscope({ className, ...props }:{className:string,props?:any}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-stethoscope", className)}
      {...props}
    >
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
      <circle cx="20" cy="10" r="2"></circle>
    </svg>
  )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HeartPulse({ className, ...props }:{className:string,props?:any}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-heart-pulse", className)}
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"></path>
    </svg>
  )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Baby({ className, ...props }:{className:string,props?:any}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-baby", className)}
      {...props}
    >
      <path d="M9 12h.01"></path>
      <path d="M15 12h.01"></path>
      <path d="M10 16c.5.3 1.5.5 2 .5s1.5-.2 2-.5"></path>
      <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 5 6.3"></path>
      <path d="M6 9a6 6 0 0 1 12 0"></path>
    </svg>
  )
}



