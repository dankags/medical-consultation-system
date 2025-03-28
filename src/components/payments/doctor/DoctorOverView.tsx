"use client"
import React from 'react'
import EarningSummary from './earning-summary'
import { Transaction } from '@/types'
import RecentTransactions from '../shared/RecentTransactions'
import { CreditCard, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import EarningsGraphSummary from './EarningsGraphSummary'

const DoctorOverView = ({transactions}:{transactions:Transaction[]}) => {
  
  return (
    <div className='space-y-8'>
      <EarningSummary/>
      <div className="grid gap-6 md:grid-cols-2">
        
       {transactions.length>0? <RecentTransactions
          title="Recent Payments"
          description="Your latest received payments"
          transactions={transactions}
          limit={5}
          showViewAll={true}
          doctorView={true}
        />:
        <div className="w-full md:col-span-1 h-[500px] flex flex-col gap-3 items-center justify-center bg-slate-200 dark:bg-dark-400 rounded-md shadow-sm dark:shadow-slate-900/10 backdrop-blur-sm">
           
             <div className="flex items-center justify-center w-16 h-16 rounded-lg dark:bg-emerald-900/30">
                        <CreditCard className="h-8 w-8 dark:text-emerald-400" />
                      </div>
            <span className="text-2xl font-semibold">No recent payments</span>
            <span className="text-slate-500 dark:text-slate-400">You have no recent payments</span>
            <Link href="/"><Button variant="secondary" className="w-fit dark:bg-green-500 dark:hover:bg-green-500/90 dark:active:bg-green-500/75">Go Home</Button></Link>
        </div>
        }
        
        {transactions.length>0?
        <EarningsGraphSummary />:
        <div className="w-full md:col-span-1 h-[500px] flex flex-col gap-3 items-center justify-center bg-slate-200 dark:bg-dark-400 rounded-md shadow-sm dark:shadow-slate-900/10 backdrop-blur-sm">
          <div className="flex items-center justify-center w-16 h-16 rounded-lg dark:bg-emerald-900/30">
            <TrendingDown className="h-8 w-8 dark:text-emerald-400" />
          </div>
          <span className="text-2xl font-semibold">Earnings Growth Graph.</span>
          <span className="text-slate-500 dark:text-slate-400">Your earnings graph will be here.</span>
          
        </div>
        }
      </div>
      </div>
  )
}

export default DoctorOverView