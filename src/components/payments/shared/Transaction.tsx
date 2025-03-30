"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { extractInitials, formatDateTime, nameColor } from '@/lib/utils'
import type { Transaction } from '@/types'
import React from 'react'

const Transaction = ({transaction,doctorView}:{transaction:Transaction,doctorView:boolean}) => {
  return (
        <div
          key={transaction.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-dark-500/50 transition-colors gap-3"
        >
          <div className="flex items-center gap-3">
            {transaction.counterparty ? (
              <Avatar className="h-10 w-10 border border-slate-200 dark:border-white">
                <AvatarImage src={transaction.counterparty.avatar} alt={transaction.counterparty.name} />
                <AvatarFallback style={{backgroundColor:`${nameColor(transaction.counterparty.name)}`}} className="dark:text-black">
                  {extractInitials(transaction.counterparty.name)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-neutral-300 text-xs font-medium">
                  {transaction.type === "deposit"
                    ? "DEP"
                    : transaction.type === "withdrawal"
                      ? "WDR"
                      : transaction.type === "refund"
                        ? "REF"
                        : "PAY"}
                </span>
              </div>
            )}
            <div>
              <div className="font-medium">{transaction.description}</div>
              <div className="text-sm text-slate-500 dark:text-neutral-400">
                {transaction.counterparty
                  ? transaction.counterparty.name
                  : transaction.paymentMethod
                    ? transaction.paymentMethod
                    : transaction.reference
                      ? `Ref: ${transaction.reference}`
                      : ""}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end mt-2 sm:mt-0">
            <div
              className={`font-medium ${
                (doctorView && transaction.type === "payment") ||
                (!doctorView && (transaction.type === "deposit" || transaction.type === "refund"))
                  ? "text-emerald-600 dark:text-emerald-400"
                  : ""
              }`}
            >
              {(doctorView && transaction.type === "payment") ||
              (!doctorView && (transaction.type === "deposit" || transaction.type === "refund"))
                ? "+"
                : "-"}
              KSh {transaction.amount}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge
                variant="outline"
                className={`
                  px-2 py-0.5 text-xs rounded-full font-medium capitalize
                  ${
                    transaction.status === "completed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
                      : transaction.status === "pending"
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900"
                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
                  }
                `}
              >
                {transaction.status}
              </Badge>
              <span className="text-xs text-slate-500 dark:text-neutral-400">{formatDateTime(transaction.date).dateOnly}</span>
            </div>
          </div>
        </div>
      
  )
}

export default Transaction