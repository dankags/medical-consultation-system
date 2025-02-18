"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { CreateWithdrawSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from '@/hooks/use-toast'
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css'
import { E164Number } from 'libphonenumber-js/core'
import clsx from 'clsx'
import { useBalance } from '@/stores/useBalance'
import { formatNumber } from '@/lib/utils'
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { Form } from '../ui/form'

const Withdraw = ({user}:{user:User}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userBalance,setUserBalance]=useState(0)
  const {balance}=useBalance()

useEffect(()=>{
  setUserBalance(balance)
},[balance])


const form=useForm<z.infer<typeof CreateWithdrawSchema>>({
  resolver:zodResolver(CreateWithdrawSchema),
  defaultValues:{
    phoneNumber: user?.phone || "",
    amount:0
  }
 })

  const handlePhoneChange = (value: E164Number) => {
   form.setValue('phoneNumber', value || '');
 };

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const handleAmountChange=(e:any)=>{
  const amount=parseInt(e.target.value)
  if(!Number.isNaN(amount)){
    setUserBalance((balance-amount))
    return
  }
  setUserBalance(balance)
 }
 

 const onSubmit = async (data: z.infer<typeof CreateWithdrawSchema>) => {
  try {
    setIsLoading(true);
    // API call implementation here
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
   
    
    const response = await fetch('/api/mpesa/withdraw', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        time:new Date().toISOString(),
        doctorId:user?.id
      })
    });
    const resData=await response.json()

    if (!response.ok) throw new Error(`${resData?.message}`);
    
    toast({description:'Deposit successful'});
    form.reset();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  } catch (error:any) {
 
    toast({
      variant:"destructive",
      title:"!Ooops",
      description:`${error?.message}`
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col  gap-3 px-3 py-5 rounded-md bg-neutral-800/45">
        <div className=' flex md:hidden flex-col justify-center gap-3 '>
            <h4 className="text-xl font-bold">Available Balance.</h4>
            <span className={clsx('text-lg font-semibold',userBalance>0&&"text-green-500",userBalance<0&&"text-red-500")}>Ksh. {formatNumber(userBalance)}</span>
          </div>

          <div className="w-full ">
          <CustomFormField
        fieldType={FormFieldType.NUMBER}
        control={form.control}
        name="amount"
        label="Amount"
        onChange={handleAmountChange}
        placeholder="Amount"
      />
          </div>

      <div className="w-full ">
        <div className="w-full flex items-center justify-between">
          <span className="text-sm font-semibold text-dark-700">PhoneNumber</span>
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
        className={"w-full shad-primary-btn  active:scale-95"}
      >
        {isLoading ? 'Processing...' : 'Withdraw'}
      </Button>
    </form>
    </Form>
  )
}

export default Withdraw