"use client"
import { CreditCard } from 'lucide-react'
import React from 'react'
import PatientTransactionsTable from './PatientTransactionsTable'
import { Transaction } from '@/types'

const PatientTransactionHistory = ({transactions}:{transactions:Transaction[]}) => {
  return (
     <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Transaction History
            </h2>
            <p className="text-slate-500 dark:text-neutral-400 mt-1">
              View and manage your payment transactions
            </p>
          </div>
          {transactions.length > 0 ? (
            <PatientTransactionsTable data={transactions} />
          ) : (
            <div className="w-full h-[400px] dark:bg-dark-400 rounded-md flex items-center justify-center">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center w-16 h-16 rounded-lg dark:bg-emerald-900/30">
                  <CreditCard className="h-8 w-8 dark:text-emerald-400" />
                </div>
                <span className="text-2xl font-semibold">No recent payments</span>
                <span className="text-slate-500 dark:text-slate-400">
                  You have no recent payments
                </span>
              </div>
            </div>
          )}
        </div>
  )
}

export default PatientTransactionHistory