"use client"
import { CreateDepositSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { RiGroupLine } from 'react-icons/ri'
import { formatNumber } from '../../lib/utils';
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { toast } from '@/hooks/use-toast'
import 'react-phone-number-input/style.css'


const SESSION_PRICE = 500;
const MAX_SESSIONS = 10;
const MIN_SESSIONS = 1;

const Deposit = ({user}:{user:User}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionNumber,setSessionNumber]=useState<number>(1)

 const form=useForm<z.infer<typeof CreateDepositSchema>>({
  resolver:zodResolver(CreateDepositSchema),
  defaultValues:{
    phoneNumber: user?.phone || "",
    price: sessionNumber * SESSION_PRICE
  }
 })
 const handlePhoneChange = (value: E164Number) => {
  form.setValue('phoneNumber', value || '');
};

const onSubmit = async (data: z.infer<typeof CreateDepositSchema>) => {
  try {
    setIsLoading(true);
    // API call implementation here
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {price,...others}=data
    
    const response = await fetch('/api/mpesa/pay', {
      method: 'POST',
      body: JSON.stringify({
        ...others,
        price: sessionNumber * SESSION_PRICE,
        time:new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error('Failed to process deposit');
    
    toast({description:'Deposit successful'});
    form.reset();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast({
      variant:"destructive",
      title:"!Ooops",
      description:'Something went wrong'
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-3">
      <div className="w-full md:w-4/12 bg-dark-500/50 p-3 rounded-md">
        <div className="flex items-center gap-3">
          <RiGroupLine />
          <span className="text-sm font-semibold">Number of sessions.</span>
        </div>
        <div className="w-full flex items-center justify-center gap-8 py-8">
          <Button
            type="button"
            variant={"secondary"}
            disabled={sessionNumber <= MIN_SESSIONS || isLoading}
            onClick={() => setSessionNumber((prev) => prev - 1)}
            className="p-3 rounded-full bg-green-500 "
          >
            <FaMinus size={24} />
          </Button>
          <span className="text-6xl font-semibold font-mono">
            {sessionNumber}
          </span>
          <Button
            type="button"
            variant={"secondary"}
            disabled={sessionNumber >= MAX_SESSIONS || isLoading}
            onClick={() => setSessionNumber((prev) => prev + 1)}
            className="p-3 rounded-full bg-green-500 "
          >
            <FaPlus />
          </Button>
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-light">Session</span>
            <span className="font-semibold">{sessionNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-light">Price</span>
            <span className="font-semibold">
              Ksh {formatNumber(sessionNumber * 500)}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-4/12">
        <div className="w-full flex items-center justify-between">
          <span className="text-sm font-semibold">PhoneNumber</span>
          <Button variant={"link"} type='button'  onClick={() => handlePhoneChange(user?.phone as E164Number)}  className="text-sm hover:text-green-500">
            Choose the registered number.
          </Button>
        </div>
        <PhoneInput
          defaultCountry="KE"
          placeholder={"71234567"}
          international
          withCountryCallingCode
          value={form.watch('phoneNumber')}
          onChange={handlePhoneChange}
          className="input-phone"
        />
      </div>
      {form.formState.errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.phoneNumber.message}</p>
        )}
      <Button
        type="submit"
        variant={"secondary"}
        disabled={isLoading}
        className={"w-full md:w-4/12 shad-primary-btn  active:scale-95"}
      >
        {isLoading ? 'Processing...' : 'Deposit'}
      </Button>
    </form>
  );
}

export default Deposit