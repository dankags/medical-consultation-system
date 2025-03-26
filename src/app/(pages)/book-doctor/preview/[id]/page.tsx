import Loading from '@/app/loading'
import { getDoctorPreview } from '@/lib/actions/patient.actions'
import { redirect } from 'next/navigation'
import React, { cache, Suspense } from 'react'
import Image from 'next/image';
import BookingBtn from '@/components/BookingOnlineDoctors/BookingBtn';
import PreviewDoctorOnlineBanner from '@/components/BookingOnlineDoctors/PreviewDoctorOnlineBanner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { extractInitials, nameColor } from '@/lib/utils';
import OnlineBanner from '@/components/BookingOnlineDoctors/OnlineBanner';
import { Award, Briefcase, FileText, Globe, Mail, MapPin } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>
type Doctor={
  doctorUserId:string,
  doctorProfileImage?:string,
  doctorCoverImage?:string,
  name: string,
  rating: number,
  specialty: string[],
  title: string|null,
  description: string,
  doctorId:string,
}


const doctorData=cache(async(id:string,doctorId:string)=>{
  try {
    const data = await getDoctorPreview(id, doctorId);
    return data;
  } catch (err) {
    console.error(`Error fetching doctor data for id: ${id}, doctorId: ${doctorId}`, err);
    return { error: "Failed to fetch doctor data" };
  }
})

export async function generateMetadata(props:{
  params: Params
  searchParams: SearchParams
}) {

  const params = await props.params
    const searchParams = await props.searchParams

    const doctorId =
    typeof searchParams.doctorId === "string"
      ? searchParams.doctorId
      : Array.isArray(searchParams.doctorId)
      ? searchParams.doctorId[0]
      : undefined;

  if (!doctorId) {
    throw new Error("doctorId is missing or invalid.");
  }

    const data=await doctorData(params.id,doctorId)
  if(data?.error){
    return {
      title: `404 doctor not found`,
      description:`This page is dedicated for users to preview the doctor before booking a session with the doctor.`
    }
  }
  

  return {
    title: `preview Dr. ${decodeURIComponent(data?.name)}`,
    description:`This page is dedicated for users to preview the doctor before booking a session with the doctor.`
  }
}

export default async function PreviewDoctor (props: {
    params: Params
    searchParams: SearchParams
  }) {

    const params = await props.params
    const searchParams = await props.searchParams
    const doctorId =
    typeof searchParams.doctorId === "string"
      ? searchParams.doctorId
      : Array.isArray(searchParams.doctorId)
      ? searchParams.doctorId[0]
      : undefined;

  
    if(!params || !searchParams || !doctorId){
        redirect("/not-found")
    }
    const data=await doctorData(params.id,doctorId)
    if(data?.error){
      redirect("/not-found")
    }
    const doctor:Doctor=data as Doctor
    const userNameColor=nameColor(doctor.name||"John Doe")


  return (
    <Suspense fallback={<Loading/>}>
    <div className='w-full h-[calc(100vh-80px)]'>
        <ScrollArea className="w-full h-full pb-16 md:pb-0">
      <main className="w-full">
        {/* Cover Image */}
        <div className=" relative h-64 md:h-80 w-full overflow-hidden">
          <Image
            src="/assets/images/Premium Vector _ Iridescent Holographic Background.jpeg"
            alt="Cover"
            fill
            className=" object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Profile Section */}
        <div className="container relative -mt-24 pb-10">
          <div className="bg-background rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 pb-0">
              <div className="flex flex-col md:flex-row gap-6 md:items-end">
                {/* Profile Image */}
                <div className="">
                  <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full   shadow-md">
                    <Avatar className="w-full h-full border-4 border-background">
                      <AvatarImage
                        src={ ""}
                        alt="@shadcn"
                      />
                      <AvatarFallback
                        style={{ backgroundColor: `${userNameColor}` }}
                        className="text-4xl font-semibold"
                      >
                        {extractInitials(doctor.name||"John Doe")}
                      </AvatarFallback>
                    </Avatar>
                  <OnlineBanner userId={params.id}/>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold">
                        Dr. {doctor.name||"John Doe"}
                      </h1>
                      <p className="text-neutral-400">
                        {doctor.specialty.join(" • ")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                     
                   <BookingBtn doctor={doctor} doctorId={doctor.doctorUserId}/>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-neutral-400" />
                      <span className="text-sm">Nairobi Medical Center</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-neutral-400" />
                      <span className="text-sm">15+ years experience</span>
                    </div>
                 <PreviewDoctorOnlineBanner doctorId={doctor.doctorUserId}/>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="about" className="mt-8">
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
                  
                </TabsList>
              </Tabs>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {/* About Tab */}
              <div className="space-y-8">
                {/* Bio Section */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    About Dr. {doctor.name||"John Doe"}
                  </h2>
                  <p className="text-neutral-400">
                    Dr. {doctor.name||"John Doe"} is a board-certified cardiologist with
                    over 15 years of experience in treating complex heart
                    conditions. He specializes in interventional cardiology,
                    pediatric cardiology, and cardiac surgery. Dr. Kirungu is
                    known for his patient-centered approach and commitment to
                    providing the highest quality of care.
                  </p>
                  <p className="text-neutral-400 mt-3">
                    He completed his medical training at the University of
                    Nairobi and pursued further specialization at Johns Hopkins
                    University. Dr. Kirungu has published numerous research
                    papers in prestigious medical journals and is a frequent
                    speaker at international cardiology conferences.
                  </p>
                </section>

                {/* Specialties Section */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">Specialties</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="dark:border-neutral-600">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">
                          Interventional Cardiology
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-neutral-400">
                          Specializes in catheter-based treatment of heart
                          diseases, including angioplasty and stent placement.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="dark:border-neutral-600">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">
                          Pediatric Cardiology
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-neutral-400">
                          Diagnosis and treatment of congenital heart defects,
                          heart problems in infants, children, and adolescents.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="dark:border-neutral-600">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">
                          Cardiac Surgery
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-neutral-400">
                          Performs surgical procedures on the heart and great
                          vessels, including bypass surgery and valve repair.
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="dark:border-neutral-600">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">
                          Preventive Cardiology
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-neutral-400">
                          Focuses on preventing heart disease through risk
                          assessment, lifestyle changes, and medication
                          management.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Education & Certifications */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    Education & Certifications
                  </h2>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                        <Award className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Fellowship in Interventional Cardiology
                        </h3>
                        <p className="text-sm text-neutral-400">
                          Johns Hopkins University, 2010-2012
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                        <Award className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Residency in Cardiology</h3>
                        <p className="text-sm text-neutral-400">
                          Mayo Clinic, 2007-2010
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                        <Award className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Doctor of Medicine (MD)</h3>
                        <p className="text-sm text-neutral-400">
                          University of Nairobi, 2001-2006
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Board Certification in Cardiology
                        </h3>
                        <p className="text-sm text-neutral-400">
                          American Board of Internal Medicine, 2012
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact Information */}
                <section>
                  <h2 className="text-xl font-semibold mb-4">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Email</p>
                        <p className="font-medium">dr.kirungu@carepulse.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Office</p>
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
                        <p className="text-sm text-neutral-400">Website</p>
                        <Link href={"#"} className="font-medium">www.drkirungu.com</Link>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      </ScrollArea>
    </div>
    </Suspense>
  )
}
