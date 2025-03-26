"use client"

import type React from "react"

import { useCallback, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CreditCard,  CheckCircle2, AlertCircle, History } from "lucide-react"
import { E164Number, PhoneNumber } from "libphonenumber-js/core";
import 'react-phone-number-input/style.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "../ui/scroll-area"
import { CreateDepositSchema, CreateWithdrawSchema } from "@/lib/validation"
import { z } from "zod"
import CustomFormField, { FormFieldType } from "../CustomFormField"
import { Form } from "../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCurrentUser } from "../providers/UserProvider"
import { useBalance } from "@/stores/useBalance"
import { Input } from "../ui/input"
import PhoneInput from 'react-phone-number-input';

export default function WithdrawalPage() {
  const [amount, setAmount] = useState("")
  const {user}=useCurrentUser()
  const {balance}=useBalance()
  const [phoneNumber,setPhoneNumber]=useState<E164Number|string>()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  

  const availableBalance = 1000
  const recentTransactions = [
    { id: 1, date: "Mar 20, 2025", amount: 500, status: "completed" },
    { id: 2, date: "Mar 15, 2025", amount: 750, status: "completed" },
    { id: 3, date: "Mar 05, 2025", amount: 1200, status: "completed" },
  ]

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setAmount(value)
      setError("")
    }
  }

 

  const handleWithdraw = () => {
    // Validate amount
    if (!amount) {
      setError("Please enter an amount to withdraw")
      return
    }

    const amountValue = Number.parseInt(amount)

    if (amountValue <= 0) {
      setError("Please enter an amount greater than 0")
      return
    }

    if (amountValue > availableBalance) {
      setError("Insufficient funds. Please enter a lower amount.")
      return
    }

    // Show confirmation dialog
    setShowConfirmation(true)
  }

  const confirmWithdrawal = () => {
    setShowConfirmation(false)
    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      setShowSuccess(true)
    }, 2000)
  }

  const closeSuccessDialog = () => {
    setShowSuccess(false)
    setAmount("")
  }

  return (
    <div className="w-full h-full dark:bg-transparent dark:text-white">
      

      {/* Main Content */}
      <ScrollArea className="w-full h-full">
      <main className="w-full mx-auto px-4 py-8">
        <div className="w-full mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column */}
            <div className="w-full md:w-1/3 space-y-6">
              <Card className=" shadow-md dark:bg-dark-400 dark:border-neutral-600">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-white">Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      Ksh {balance.toLocaleString()}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">Last updated: Today, 11:30 AM</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md dark:bg-dark-400 dark:border-neutral-600">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-white">Withdrawal Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 rounded-lg">
                      <div className="w-10 h-10 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center mr-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="4" fill="#43B02A" fillOpacity="0.1" />
                          <path
                            d="M18.5 6H5.5C4.67157 6 4 6.67157 4 7.5V16.5C4 17.3284 4.67157 18 5.5 18H18.5C19.3284 18 20 17.3284 20 16.5V7.5C20 6.67157 19.3284 6 18.5 6Z"
                            stroke="#43B02A"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                            stroke="#43B02A"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white">M-Pesa</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Instant withdrawal</p>
                      </div>
                      <Badge variant="outline" className="bg-emerald-900/30 text-emerald-400 border-emerald-800">
                        Active
                      </Badge>
                    </div>

                    <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg opacity-60">
                      <div className="w-10 h-10 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center mr-3">
                        <CreditCard className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Card</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Coming soon</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      >
                        Unavailable
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md dark:bg-dark-400 dark:border-neutral-600">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <History className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    <span className="text-slate-900 dark:text-white">Recent Withdrawals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Ksh {transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{transaction.date}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        >
                          Completed
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-2/3">
              <Card className="shadow-md dark:bg-dark-400 dark:border-neutral-600">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Withdraw Funds</CardTitle>
                  <CardDescription className="text-slate-500 dark:text-neutral-400">
                    Withdraw your earnings directly to your M-Pesa account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="mpesa" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 mb-6 dark:bg-neutral-700">
                      <TabsTrigger
                        value="mpesa"
                        className="dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-400"
                      >
                        M-Pesa Withdrawal
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="mpesa" className="space-y-6">
                        
                      <div  className="space-y-4">
                        <div>
                          <label
                            htmlFor="amount"
                            className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1.5"
                          >
                            Amount (Ksh)
                          </label>
                          <div className="relative">
                          <Input/>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <span className="text-slate-500 dark:text-neutral-400 text-lg">Ksh</span>
                            </div>
                          </div>
                          {error && (
                            <p className="mt-1.5 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {error}
                            </p>
                          )}

                          <div className="mt-2 flex justify-between text-sm">
                            <span className="text-slate-500 dark:text-neutral-400">
                              Available: Ksh {availableBalance.toLocaleString()}
                            </span>
                            <button
                              type="button"
                              className="text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-300"
                              onClick={() => setAmount(availableBalance.toString())}
                            >
                              Withdraw Max
                            </button>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1.5"
                          >
                            M-Pesa Phone Number
                          </label>
                          <div className="relative">
                          <PhoneInput
            defaultCountry="KE"
            international
            withCountryCallingCode
            value={user?.phone}
            onChange={(value)=>setPhoneNumber(value)}
            className="input-phone"
          />
                          </div>
                          <p className="mt-1.5 text-sm text-slate-500 dark:text-neutral-400">
                            Funds will be sent to this M-Pesa number
                          </p>
                        </div>

                        <div className="dark:bg-dark-500 p-4 rounded-lg border dark:border-neutral-600">
                          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                            Withdrawal Summary
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500 dark:text-neutral-400">Amount</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {amount ? `Ksh ${Number.parseInt(amount).toLocaleString()}` : "Ksh 0"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 dark:text-neutral-400">Transaction Fee</span>
                              <span className="font-medium text-slate-900 dark:text-white">Ksh 0</span>
                            </div>
                            <div className="pt-2 border-t border-slate-200 dark:border-neutral-500 flex justify-between">
                              <span className="font-medium text-slate-700 dark:text-neutral-300">Total to Receive</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {amount ? `Ksh ${Number.parseInt(amount).toLocaleString()}` : "Ksh 0"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                  
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    onClick={handleWithdraw}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white h-12 text-base"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      <span>Withdraw to M-Pesa</span>
                    )}
                  </Button>

                  <div className="text-sm text-slate-500 dark:text-neutral-400 text-center">
                    <p>
                      By proceeding, you agree to our{" "}
                      <Link href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </CardFooter>
              </Card>

              <div className="mt-8 bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-md  dark:bg-dark-400 dark:border-neutral-600">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Thank You for Your Service
                </h3>
                <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
                  Thank you for being an essential part of our healthcare community! Your dedication and expertise have
                  made it easier and more affordable for patients to access quality medical consultations from the
                  comfort of their homes.
                </p>
                <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed mt-2">
                  By offering your services through our platform, you are not only transforming lives but also
                  redefining the future of healthcare. We appreciate your commitment to making healthcare more
                  accessible, and we are honored to support you in your journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      </ScrollArea>
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md dark:bg-dark-400 dark:border-neutral-600 text-white">
          <DialogHeader>
            <DialogTitle className="text-center">Confirm Withdrawal</DialogTitle>
            <DialogDescription className="text-center">Please confirm your M-Pesa withdrawal details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="dark:bg-dark-300 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500 dark:text-neutral-400">Amount</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    Ksh {amount ? Number.parseInt(amount).toLocaleString() : "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500 dark:text-neutral-400">M-Pesa Number</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{phoneNumber}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Total to Receive</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Ksh {amount ? Number.parseInt(amount).toLocaleString() : "0"}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-neutral-400 text-center">
              You will receive an M-Pesa prompt on your phone to complete the transaction.
            </p>
            
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button className="sm:w-full dark:bg-red-700/80 dark:hover:bg-red-700/95 dark:text-white" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button className="sm:w-full dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white" onClick={confirmWithdrawal}>
              Confirm Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md dark:bg-dark-400 dark:border-neutral-600 text-white">
        <DialogHeader>
            <DialogTitle>Withdrawal Successful!</DialogTitle>
        </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Withdrawal Successful!</h2>
            <p className="text-slate-500 dark:text-neutral-400 text-center mb-6">
              Your withdrawal of{" "}
              <span className="px-2 font-medium text-slate-900 dark:text-white">
                Ksh {amount ? Number.parseInt(amount).toLocaleString() : "0"}
              </span>{" "}
              has been processed successfully.
            </p>
            <div className="w-full bg-slate-50 dark:bg-dark-300 p-4 rounded-lg mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500 dark:text-neutral-400">Transaction ID</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    MP{Math.floor(Math.random() * 1000000)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500 dark:text-neutral-400">Date & Time</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {new Date().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500 dark:text-neutral-400">Status</span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Completed</span>
                </div>
              </div>
            </div>
            <Button className="w-full dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white" onClick={closeSuccessDialog}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

