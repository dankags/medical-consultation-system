"use client"
import { CreateDepositSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils';
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import 'react-phone-number-input/style.css'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Clock, CreditCard, Minus, Phone, Plus, Shield } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import Image from 'next/image'
import { Label } from '../ui/label'
import { useCallback } from 'react';
import { toast } from 'sonner'
import { MdOutlineCreditCard } from 'react-icons/md'


const SESSION_PRICE = 500;
const MAX_SESSIONS = 10;
const MIN_SESSIONS = 1;

const Deposit = memo(({user}:{user:User}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionNumber,setSessionNumber]=useState<number>(1)
  const [paymentMethod, setPaymentMethod] = useState("mpesa")

 const form=useForm<z.infer<typeof CreateDepositSchema>>({
  resolver:zodResolver(CreateDepositSchema),
  defaultValues:{
    phoneNumber: user?.phone || "",
    price: sessionNumber * SESSION_PRICE
  }
 })
 const handlePhoneChange = useCallback((value: E164Number) => {
  form.setValue('phoneNumber', value || '');
},[]);

const onSubmit = useCallback(async (data: z.infer<typeof CreateDepositSchema>) => {
  try {
    setIsLoading(true);
    // API call implementation here
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {price,...others}=data
    
    const response = await fetch('/api/mpesa/recharge', {
      method: 'POST',
      body: JSON.stringify({
        ...others,
        price: sessionNumber * SESSION_PRICE,
        time:new Date().toISOString(),
        userId:user?.id
      })
    });

    if (!response.ok) throw new Error('Failed to process deposit');
    
    toast.success("Deposit was initiated successfully");
    form.reset();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error("!Ooops",{
      description:'Internal server error'
    });
  } finally {
    setIsLoading(false);
  }
},[]); 


return (
  <form
    onSubmit={form.handleSubmit(onSubmit)}
    className="min-h-screen w-full flex flex-col relative pb-16 md:pb-0"
  >
    {/* Main Content */}
    <main className="flex-1  mx-auto px-4 py-8 max-w-3xl">
      <div className="w-full grid gap-8 md:grid-cols-5 ">
        {/* Left Column - Payment Details */}
        <div className="md:col-span-3 space-y-6">
          <Card className="dark:border-neutral-700">
            <CardHeader className="pb-4">
              <CardTitle>Session Details</CardTitle>
              <CardDescription>
                Adjust the number of sessions you want to book
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 dark:bg-dark-400 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Number of sessions
                  </span>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={
                        sessionNumber <= MIN_SESSIONS || isLoading
                          ? "ghost"
                          : "outline"
                      }
                      size="icon"
                      type="button"
                      className={cn(
                        "h-10 w-10 rounded-full ",
                        sessionNumber <= MIN_SESSIONS || isLoading
                          ? "dark:bg-green-500/30"
                          : "bg-white dark:bg-green-500 border-gray-200 dark:border-green-600"
                      )}
                      onClick={() => setSessionNumber((prev) => prev - 1)}
                      disabled={sessionNumber <= MIN_SESSIONS || isLoading}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-2xl font-semibold text-gray-900 dark:text-white min-w-[30px] text-center">
                      {sessionNumber}
                    </span>
                    <Button
                      variant={
                        sessionNumber >= MAX_SESSIONS || isLoading
                          ? "ghost"
                          : "outline"
                      }
                      type="button"
                      size="icon"
                      className={cn(
                        "h-10 w-10 rounded-full ",
                        sessionNumber >= MAX_SESSIONS || isLoading
                          ? "dark:bg-green-500/30"
                          : "bg-white dark:bg-green-500 border-gray-200 dark:border-green-600"
                      )}
                      onClick={() => setSessionNumber((prev) => prev + 1)}
                      disabled={sessionNumber >= MAX_SESSIONS || isLoading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Session price
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Ksh {SESSION_PRICE.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Sessions
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {sessionNumber}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="font-semibold text-lg text-gray-900 dark:text-white">
                        Ksh {(sessionNumber * SESSION_PRICE).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:border-neutral-700">
            <CardHeader className="pb-4">
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Select your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="mpesa"
                className="w-full"
                onValueChange={setPaymentMethod}
              >
                <TabsList className="grid w-full grid-cols-2 mb-6 dark:bg-dark-400">
                  <TabsTrigger
                    type="button"
                    value="mpesa"
                    className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900 dark:data-[state=active]:text-emerald-100"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 relative">
                        <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20"></div>
                        <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span>M-Pesa</span>
                    </div>
                  </TabsTrigger>

                  <TabsTrigger
                    type="button"
                    value="card"
                    className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900 dark:data-[state=active]:text-emerald-100 dark:data-[state="
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 relative">
                        <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20"></div>
                        <MdOutlineCreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span>Card</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="mpesa" className="mt-0">
                  <div className="space-y-4">
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800/70 flex items-center justify-center">
                          <Image
                            src="/assets/icons/icons8-mpesa.svg"
                            alt="M-Pesa Logo"
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          M-Pesa Payment
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Enter your M-Pesa registered phone number to receive a
                          payment prompt.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5">
                          <div className="w-5 h-3.5 bg-red-600 relative overflow-hidden rounded-sm">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-4 h-4 bg-green-600 transform rotate-45 translate-y-2"></div>
                              <div className="absolute w-4 h-0.5 bg-white"></div>
                              <div className="absolute h-4 w-0.5 bg-white"></div>
                            </div>
                          </div>
                        </div>
                        <PhoneInput
                          defaultCountry="KE"
                          placeholder={"71234567"}
                          international
                          withCountryCallingCode
                          value={form.watch("phoneNumber")}
                          onChange={handlePhoneChange}
                          className="input-phone"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Enter the phone number registered with M-Pesa
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="card" className="mt-0">
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Card Payment
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Pay securely with your credit or debit card.
                        </p>
                      </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      Card payment option coming soon
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="md:col-span-2">
          <div className="sticky top-0">
            <Card className="dark:border-neutral-700">
              <CardHeader className="pb-4">
                <CardTitle>Payment Summary</CardTitle>
                <CardDescription>Review your payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Sessions
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {sessionNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Price per session
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      Ksh {SESSION_PRICE.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Total Amount
                      </span>
                      <span className="font-semibold text-lg text-emerald-600 dark:text-emerald-400">
                        Ksh {(sessionNumber * SESSION_PRICE).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-dark-400 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Secure Payment
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Your payment information is encrypted and secure. We never
                    store your full payment details.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                {isLoading ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-3 h-12 dark:bg-green-500/30 text-white"
                  >
                    <Image
                      src="/assets/icons/loader.svg"
                      alt="loader"
                      width={24}
                      height={24}
                      className="animate-spin"
                    />
                    <span>Initiating Payment</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant={paymentMethod === "mpesa" ? "default" : "ghost"}
                    disabled={paymentMethod !== "mpesa"}
                    className={cn("w-full h-12 dark:bg-emerald-600/30 text-neutral-100",paymentMethod === "mpesa"&&"dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white")}
                  >
                    {paymentMethod === "mpesa"
                      ? "Recharge with M-Pesa"
                      : "Pay with Card"}
                  </Button>
                )}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Estimated processing time: 1-2 minutes</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  </form>
);

},(prevProp,nextProp)=>(
  prevProp.user.id===nextProp.user.id&&
  prevProp.user.$id===nextProp.user.$id&&
  prevProp.user.birthDate===nextProp.user.birthDate&&
  prevProp.user.role===nextProp.user.role&&
  prevProp.user.clerkId===nextProp.user.clerkId&&
  prevProp.user.gender===nextProp.user.gender&&
  prevProp.user.email===nextProp.user.email&&
  prevProp.user.phone===nextProp.user.phone&&
  prevProp.user.name===nextProp.user.name
))

Deposit.displayName="Deposit"

export default Deposit