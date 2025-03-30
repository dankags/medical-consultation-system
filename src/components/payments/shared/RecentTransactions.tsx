"use client"
import React from 'react'
import Transaction from './Transaction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Transaction as TransactionType } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <Card className="max-h-[500px] border-slate-200 dark:border-neutral-700 shadow-sm dark:shadow-slate-900/10 dark:bg-dark-400 backdrop-blur-sm">
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
            className="gap-1 text-sm text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white dark:hover:bg-green-500"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <ScrollArea className='w-full h-full'>
      <div className="w-full space-y-4">
        {limitedTransactions.map((transaction) => (
        <Transaction
          key={transaction.id}
          transaction={transaction}
          doctorView={doctorView}
          />
        ))}
      </div>
      </ScrollArea>
    </CardContent>
  </Card>
  )
}

export default RecentTransactions