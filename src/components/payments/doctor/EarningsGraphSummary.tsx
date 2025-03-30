"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import { Monitor } from 'lucide-react'
import { Bar, BarChart, CartesianGrid,  XAxis } from 'recharts'
 


const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: Monitor,
    theme: {
      light: "#2563eb",
      dark: "#24AE7C",
    },
  },
} satisfies ChartConfig


const EarningsGraphSummary = ({className}:{className?:string}) => {
  const weeklyData = [
    { name: "Mon", value: 1200 },
    { name: "Tue", value: 900 },
    { name: "Wed", value: 1500 },
    { name: "Thu", value: 1800 },
    { name: "Fri", value: 2100 },
    { name: "Sat", value: 1000 },
    { name: "Sun", value: 500 },
  ]

  const monthlyData = [
    { name: "Jan", value: 12000 },
    { name: "Feb", value: 15000 },
    { name: "Mar", value: 18000 },
    { name: "Apr", value: 16000 },
    { name: "May", value: 21000 },
    { name: "Jun", value: 19000 },
    { name: "Jul", value: 22000 },
    { name: "Aug", value: 25000 },
    { name: "Sep", value: 28000 },
    { name: "Oct", value: 30000 },
    { name: "Nov", value: 35000 },
    { name: "Dec", value: 45000 },
  ]

  return (
    <Card
      className={`max-h-[500px] border-slate-200 dark:border-neutral-700 shadow-sm dark:shadow-slate-900/10 dark:bg-dark-400 backdrop-blur-sm ${className}`}
    >
      <CardHeader className="pb-3">
        <CardTitle>Earnings Analytics</CardTitle>
        <CardDescription>Track your earnings over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 dark:bg-dark-500/30 border border-slate-200 dark:border-neutral-700">
            <TabsTrigger
              value="weekly"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-emerald-700"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-emerald-700"
            >
              Monthly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="h-full overflow-hidden">
            <ChartContainer config={chartConfig}>
              <BarChart
                data={weeklyData}
                className="h-[250px]"
              >
                 <CartesianGrid vertical={false} stroke='rgb(64,64,64)' />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  tick={{fill:"rgb(255,255,255)" }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="value" fill="var(--color-desktop)" radius={8} />
               
                
              </BarChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="monthly" className="h-full overflow-hidden">
          <ChartContainer config={chartConfig}>
              <BarChart
                data={monthlyData}
                className="h-[250px]"
              >
                 <CartesianGrid vertical={false} stroke='rgb(64,64,64)' />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  tick={{fill:"rgb(255,255,255)" }}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="value" fill="var(--color-desktop)" radius={8} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default EarningsGraphSummary