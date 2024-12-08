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
import { months } from "@/constants";


const SignUpForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {signUp,isLoaded,setActive}=useSignUp()


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
console.log(form)
  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);
    console.log(values)
    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };
      //  await signUp?.create({
      //   emailAddressOrPhoneNumber
      //  })
      const newUser = await createUser(user);

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
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


      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  </Form>
  )
}

export default SignUpForm