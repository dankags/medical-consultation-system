import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, DollarSign, MessageSquare, Video } from "lucide-react"
import { PatientAppointmentDocument } from "@/types"
import { extractInitials, formatDateTime, nameColor } from "@/lib/utils"

export function PatientAppointmentCard({ appointment }: {appointment:PatientAppointmentDocument}) {
    const inputDate = new Date(appointment.schedule);
  const now = new Date();

    // Calculate the difference in calendar days
    const daysDifference = Math.round(
      (inputDate.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
    );

  return (
    <Card className="p-4 border border-slate-200 dark:border-neutral-800 bg-white dark:bg-transparent hover:border-primary/50 dark:hover:bg-dark-500/50 dark:hover:border-neutal-800/50 transition-colors">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 border border-slate-200 dark:border-white">
          <AvatarImage src={appointment.doctor.image} alt={appointment.doctor.name} />
          <AvatarFallback style={{backgroundColor:`${nameColor(appointment.doctor.name)}`}} className="dark:text-white">{extractInitials(appointment.doctor.name)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-slate-900 dark:text-white truncate">{appointment.doctor.name}</h4>
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900"
            >
              {appointment.status}
            </Badge>
          </div>

          <p className="text-sm text-slate-500 dark:text-neutral-400">{appointment.doctor.speciality.join(" • ")}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-neutral-400">
            <div className="flex items-center">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              <span>{daysDifference<=7?formatDateTime(appointment.schedule).relativeDate:formatDateTime(appointment.schedule).dateOnly}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-3.5 w-3.5" />
              <span>{formatDateTime(appointment.schedule).timeOnly}</span>
            </div>
          
          </div>

          <div className="mt-3 flex items-center justify-between">
            {appointment.paymentStatus==="paid" ? (
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
              >
                <DollarSign className="mr-1 h-3 w-3" />
                Paid
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
              >
                <DollarSign className="mr-1 h-3 w-3" />
                Payment Required
              </Badge>
            )}

            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Message</span>
              </Button>

              <Button
                size="sm"
                className={
                  appointment.paymentStatus==="paid"
                    ? "dark:bg-green-500 dakr:hover:bg-green-500"
                    : "bg-slate-300 dark:bg-emerald-700 cursor-not-allowed"
                }
                disabled={appointment.paymentStatus==="unpaid"}
                asChild
              >
                {appointment.paymentStatus==="paid" ? (
                  <Link href={`/appointments/${appointment.appointmentId}/meetup`}>
                    <Video className="mr-1.5 h-3.5 w-3.5" />
                    Join
                  </Link>
                ) : (
                  <Link href={`#`}>
                    <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                    Pay
                  </Link>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

