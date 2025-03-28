"use client"
import React from 'react'
import Transaction from './Transaction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Transaction as TransactionType } from '@/types';

interface RecentTransactionsProps {
    title: string;
    description: string;
    limit?: number;
    showViewAll?: boolean;
    doctorView?: boolean;
    transactions: TransactionType[]
  }


const RecentTransactions = ({
    title,
    description,
    transactions,
    limit = 3,
    showViewAll = false,
    doctorView = false,
  }: RecentTransactionsProps) => {

    const limitedTransactions = transactions.slice(0, limit)

  return (
    <Card className="border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/10 dark:bg-slate-800/50 backdrop-blur-sm">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {showViewAll && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {limitedTransactions.map((transaction) => (
        <Transaction
          key={transaction.id}
          transaction={transaction}
          doctorView={doctorView}
          />
        ))}
      </div>
    </CardContent>
  </Card>
  )
}

export default RecentTransactions