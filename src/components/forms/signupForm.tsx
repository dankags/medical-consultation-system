"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useSignUp } from "@clerk/nextjs";
import ConfirmEmail from "../Dialogs/ConfirmEmail";
import { useToast } from "@/hooks/use-toast";


type User={
  name: string;
    email: string;
    phone: string;
    gender: "male"|"female";
    birthDate:Date;
    
}

const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {signUp,isLoaded,setActive}=useSignUp()
  const [userDetails,setUserDetails]=useState<User>({
    name: "",
    email: "",
    phone: "",
    gender: "male",
    birthDate:new Date()
  })
  const [showConfirmDialog,setShowConfirmDialog]=useState(false)
  const { toast } = useToast()
  const [verification, setVerification] = useState({
    state:"default",
    error:"",
    code:""
  })
  


  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthDate:new Date(),
      password:"",
    },
  });


  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);
    const {password,...others}=values
    try {
      setUserDetails({...others})
       const signUpRes=await signUp?.create({
        emailAddress:values.email,
        password:values.password
       })
       console.log(signUpRes)
       await signUp?.prepareEmailAddressVerification({ strategy: 'email_code' })
       setShowConfirmDialog(true)
       setVerification({...verification,state:"pending"})
    
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const confirmEmail=async()=>{
    if (!isLoaded) return;

    try {
       

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code:verification.code,
      })
 
      if (completeSignUp.status === 'complete') {
        
        const user = {
         ...userDetails,
          clerkId:completeSignUp?.createdUserId
        };
        
        const newUser = await createUser(user); 
        
        if (newUser) {
          toast({
            description:"User created successfully",
          })
          router.push(`/auth/sign-in`);
        }
        await setActive({ session: completeSignUp.createdSessionId })
        setVerification({...verification,state:"success"})
        setShowConfirmDialog(false)
      } else {
        toast({
          title: "!Ooops something went wrong.",
           variant: "destructive",
          description:"Verification failed",
        })
        setVerification({...verification,error:`Verification failed`,state:"failed"})
      }
    } catch (err: any) {
      toast({
        title: "!Ooops something went wrong.",
         variant: "destructive",
        description:err.errors[0].longMessage,
      })
      setVerification({...verification,error:err.errors[0].longMessage,state:"failed"})
    }
  }
 
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
        name="name"
        label="Full name"
        placeholder="John Doe"
        iconSrc="/assets/icons/user.svg"
        iconAlt="user"
      />

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="email"
        label="Email"
        placeholder="johndoe@gmail.com"
        iconSrc="/assets/icons/email.svg"
        iconAlt="email"
      />

      <CustomFormField
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name="phone"
        label="Phone number (safaricom number)"
        placeholder="(555) 123-4567"
      />
<CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="password"
        label="Password"
        placeholder="Password"
        iconAlt="password"
      />

  <CustomFormField
        fieldType={FormFieldType.DATE_PICKER}
        control={form.control}
        name="birthDate"
        label="Date Of Birth"
      />



      <div className="w-full flex flex-col items-start gap-3">
      <div className="pt-4">
        <span className="text-sm font-medium shad-input-label">
          What&apos;s your gender?
        </span>
        </div>

        <div className=" flex items-center gap-3">
          <div className="flex gap-4 pb-3">
          <CustomFormField
        fieldType={FormFieldType.RADIO}
        control={form.control}
        name="gender"
        label="male"
      />
      <CustomFormField
        fieldType={FormFieldType.RADIO}
        control={form.control}
        name="gender"
        label="female"
      />
        </div>


        </div>
        </div>
         
            {/* CAPTCHA Widget */}
        <div id="clerk-captcha"></div>
        
      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    <ConfirmEmail opened={showConfirmDialog} setIsOpened={setShowConfirmDialog} setConfirmationCode={(code)=>setVerification(prev=>({...prev,code}))} handleOTPConfirmation={confirmEmail}/>
    </form>
  </Form>
  )
}




export default SignUpForm