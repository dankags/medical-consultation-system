import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react"

interface DoctorStatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  description: string
  trend: string
  trendUp: boolean
}

export function DoctorStatsCard({ title, value, icon: Icon, description, trend, trendUp }: DoctorStatsCardProps) {
  return (
    <Card className="bg-white dark:bg-dark-400 border-slate-200 dark:border-neutral-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-lg dark:bg-emerald-900/30 p-2">
            <Icon className="h-5 w-5  dark:text-emerald-400" />
          </div>
          <span
            className={cn(
              "text-xs font-medium flex items-center gap-1",
              trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
            )}
          >
            {trendUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {trend}
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-500 dark:text-neutral-400">{title}</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

