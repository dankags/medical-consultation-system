"use client"
import { Transaction } from '@/types'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PatientOverView from './PatientOverView'
import PatientTransactionHistory from './PatientTransactionHistory'


const UserPaymentTabs = ({transactions}:{transactions:Transaction[]}) => {
  return (
    <div>
    <Tabs defaultValue="overview"  className="w-full">
      <div className="border-b border-neutral-200 dark:border-neutraldark:-700 mb-6">
        <TabsList className="bg-transparent h-auto p-0 w-full justify-start dark:bg-transparent">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent dark:data-[state=active]:border-emerald-500 dark:data-[state=active]:bg-transparent dark:data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
          >
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="history"
            className="rounded-none border-b-2 border-transparent dark:data-[state=active]:border-emerald-500 dark:data-[state=active]:bg-transparent dark:data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
          >
            Transaction History
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="mt-0">
        <PatientOverView transactions={transactions}/>
      </TabsContent>

      <TabsContent value="history" className="mt-0">
        <PatientTransactionHistory />
      </TabsContent>

     
    </Tabs>
  </div>
  )
}

export default UserPaymentTabs