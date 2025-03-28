"use client"
import { Card,CardHeader,CardTitle,CardContent,CardDescription   } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowUpRight, CreditCard, DollarSign, TrendingUp, Wallet } from 'lucide-react'
import React from 'react'

const EarningSummary = () => {
  return (
    <div>
    <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Earnings Summary</h2>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden border-slate-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/10 dark:bg-dark-400 backdrop-blur-sm">
        <div className="h-1.5 bg-emerald-500" />
        <CardHeader className="pb-2">
          <CardDescription>Available Balance</CardDescription>
          <CardTitle className="text-2xl font-bold">Ksh 15,500</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="mr-1 h-4 w-4" />
              <span>+18% from last month</span>
            </div>
            <Wallet className="h-4 w-4 text-neutral-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-slate-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/10 dark:bg-dark-400 backdrop-blur-sm">
        <div className="h-1.5 bg-blue-500" />
        <CardHeader className="pb-2">
          <CardDescription>Total Earnings</CardDescription>
          <CardTitle className="text-2xl font-bold">Ksh 45,000</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>25 consultations this month</span>
            </div>
            <CreditCard className="h-4 w-4 text-neutral-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-slate-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/10 dark:bg-dark-400 backdrop-blur-sm">
        <div className="h-1.5 bg-violet-500" />
        <CardHeader className="pb-2">
          <CardDescription>Pending Payments</CardDescription>
          <CardTitle className="text-2xl font-bold">Ksh 3,500</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-violet-600 dark:text-violet-400">
              <DollarSign className="mr-1 h-4 w-4" />
              <span>3 pending transactions</span>
            </div>
            <div className="text-neutral-400">Processing</div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-slate-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/10 dark:bg-dark-400 backdrop-blur-sm">
        <div className="h-1.5 bg-amber-500" />
        <CardHeader className="pb-2">
          <CardDescription>Monthly Target</CardDescription>
          <CardTitle className="flex items-center justify-between text-2xl font-bold">
            <span>Ksh 50,000</span>
            <span className="text-sm font-normal text-slate-500 dark:text-neutral-400">90%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={90} className="h-2 bg-amber-100 dark:bg-neutral-600">
            <div className="h-full bg-amber-500 dark:bg-green-500 rounded-full" />
          </Progress>
          <div className="mt-2 text-sm text-slate-500 dark:text-neutral-400">Ksh 5,000 to go</div>
        </CardContent>
      </Card>
    </div>
  </div>
  )
}

export default EarningSummary