"use client"
import { useSignIn } from '@clerk/nextjs'
import React, { useState } from 'react'
import { Form } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSignInValidation } from '@/lib/validation'
import CustomFormField, { FormFieldType } from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { useRouter, useSearchParams } from 'next/navigation'





function SignInForm() {
   const { signIn, setActive } = useSignIn()
    const [isLoading,setIsLoading]=useState(false)
    const router=useRouter()
    const searchParams=useSearchParams()
    const redirectUrl=searchParams.get("redirect_url")
  

    const form = useForm<z.infer<typeof userSignInValidation>>({
        resolver: zodResolver(userSignInValidation),
        defaultValues: {
         email:"",
         password:""
        },
      });



      const onSubmit = async (values: z.infer<typeof userSignInValidation>) => {
        setIsLoading(true);
        
        try {
          if (!signIn || !setActive) {
            throw new Error("Sign-in functionality is unavailable.");
          }
          const signInAttempt= await signIn?.create({
            identifier:values.email,
            password:values.password
           })
          
    
      
    
          if (signInAttempt?.status === 'complete') {
            if(signInAttempt?.createdSessionId){
            await setActive({ session:signInAttempt?.createdSessionId })
          }
            if(redirectUrl){
              router.replace(`${redirectUrl}`)
            }
            router.replace('/')
          } else {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.log(JSON.stringify(signInAttempt, null, 2))
          }
        } catch (error) {
          console.log(error);
        }
    
        setIsLoading(false);
      
      };
    

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
      <section className="mb-12 space-y-4">
        <h1 className="header ">Hi there 👋</h1>
        <p className="text-dark-700">Get started with appointments.</p>
      </section>

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="email"
        label="Email"
        placeholder="Johndoe@example.com"
        iconSrc="/assets/icons/user.svg"
        iconAlt="user"
      />

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        type='password'
        name="password"
        label="Password"
        placeholder="Password"
        iconAlt="password"
      />


<SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  </Form>
  )
}

export default SignInForm