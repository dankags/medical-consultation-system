"use client"
import { formatNumber } from '@/lib/utils'
import { useBalance } from '@/stores/useBalance'
import clsx from 'clsx'
import React from 'react'

const UserBalance = () => {
    const {balance}=useBalance()
  return (
    <div className='p-4 flex flex-col justify-center gap-3 ring-1 ring-dark-600 bg-gray-500/10 rounded-md my-3'>
      <h4 className="text-xl font-bold">Available Balance.</h4>
      <span className={clsx('text-lg font-semibold',balance>0&&"text-green-500")}>Ksh. {formatNumber(balance)}</span>
    </div>
  )
}

export default UserBalance