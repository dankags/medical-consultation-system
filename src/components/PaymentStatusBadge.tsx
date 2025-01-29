"use client"

import clsx from 'clsx'
import React from 'react'

type PaymentStatus = "paid" | "deposited" | "withdrew"

interface PaymentStatusBadgeProps {
  paymentStatus: PaymentStatus
}

const statusStyles = {
  paid: "bg-green-500 ",
  deposited: "bg-blue-500 ",
  withdrew: "bg-red-500 "
} as const

const PaymentStatusBadge = ({ paymentStatus }: PaymentStatusBadgeProps) => {
  return (
    <div
      className={clsx(
        "w-max px-3 py-1 flex items-center justify-center rounded-3xl text-white text-sm font-medium  capitalize",
        statusStyles[paymentStatus]
      )}
    >
      <span>{paymentStatus}</span>
    </div>
  )
}

export default PaymentStatusBadge