"use client"
import { useCurrentUser } from '@/components/providers/UserProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress';
import { getPaymentStats } from '@/lib/actions/user.actions';
import { formatDateTime, formatNumber } from '@/lib/utils';
import { useBalance } from '@/stores/useBalance';
import { ArrowUpRight, TrendingUp, Wallet, CreditCard, DollarSign } from 'lucide-react';
import React, { useEffect } from 'react'
import { toast } from 'sonner';


interface PaymentStats {
  totalPaid: number;
  transactionCount: number;
  dueDate?: string;
  monthlyBudget?: number;
  totalPending: number;
  pendingTrnsactionCount?: number;
  upcommingPayment?:Date
}
const PatientSpendingOverview = () => {
    const {balance}=useBalance()
    const {user}=useCurrentUser()
    
    const [userPaymentStats, setUserPaymentStats] = React.useState<PaymentStats | null>(null);

  useEffect(()=>{
   if(!user) return
   
   const fetchUserPaymentStatus=async()=>{
    try {
        if (user?.role !== 'user' && user?.role !== 'doctor' && user?.role !== 'admin') return;
        const response=await getPaymentStats(user?.id,user?.role as "user" | "doctor" | "admin")
         
        if (response.error) {
          toast.error(response.error)
          return
        }
        setUserPaymentStats(response as PaymentStats)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      toast.error(error?.message || "Something went wrong")
    }
   } 
   fetchUserPaymentStatus()
  },[user])

  return (
    <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Account Summary</h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden border-slate-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/10 dark:bg-dark-400 backdrop-blur-sm">
            <div className="h-1.5 bg-emerald-500" />
            <CardHeader className="pb-2">
              <CardDescription>Available Balance</CardDescription>
              <CardTitle className="text-2xl font-bold">Ksh {formatNumber(balance)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+12% from last month</span>
                </div>
                <Wallet className="h-4 w-4 text-neutral-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-slate-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/10 dark:bg-dark-400 backdrop-blur-sm">
            <div className="h-1.5 bg-blue-500" />
            <CardHeader className="pb-2">
              <CardDescription>Total Spent</CardDescription>
              <CardTitle className="text-2xl font-bold">Ksh {formatNumber(userPaymentStats?.totalPaid)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>{formatNumber(userPaymentStats?.transactionCount)} transactions this month</span>
                </div>
                <CreditCard className="h-4 w-4 text-neutral-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-slate-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/10 dark:bg-dark-400 backdrop-blur-sm">
            <div className="h-1.5 bg-violet-500" />
            <CardHeader className="pb-2">
              <CardDescription>Upcoming Payment</CardDescription>
              <CardTitle className="text-2xl font-bold">Ksh {formatNumber(userPaymentStats?.totalPending)}</CardTitle>
            </CardHeader>
            <CardContent>
              {userPaymentStats?.upcommingPayment?<div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-violet-600 dark:text-violet-400">
                  <DollarSign className="mr-1 h-4 w-4" />
                  <span>Due in {formatDateTime(userPaymentStats?.upcommingPayment).relativeDate}</span>
                </div>
                <div className="text-neutral-400">{formatDateTime(userPaymentStats?.upcommingPayment).dateOnly}</div>
              </div>
             :
             <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-violet-600 dark:text-violet-400">
                  <DollarSign className="mr-1 h-4 w-4" />
                  <span>No pending payments.</span>
                </div>
             </div>  
            }
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-slate-200 dark:border-neutral-700 shadow-sm dark:shadow-neutral-900/10 dark:bg-dark-400 backdrop-blur-sm">
            <div className="h-1.5 bg-amber-500" />
            <CardHeader className="pb-2">
              <CardDescription>Monthly Budget</CardDescription>
              <CardTitle className="flex items-center justify-between text-2xl font-bold">
                <span>Ksh 1,000</span>
                <span className="text-sm font-normal text-slate-500 dark:text-neutral-400">10%</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={10} className="h-2 bg-amber-100 dark:bg-neutral-700">
                <div className="h-full bg-green-500 rounded-full" />
              </Progress>
              <div className="mt-2 text-sm text-slate-500 dark:text-neutral-400">Ksh 1,000 remaining</div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}

export default PatientSpendingOverview