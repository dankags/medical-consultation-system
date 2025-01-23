import Deposit from '@/components/forms/Deposit';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchUserData } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'

type AuthResponse = {
  userId: string | null
}

interface UserData {
  error?: string;
  user: User;
}

export const metadata: Metadata = {
  title: "Recharge your account.",
  description:"This is a page dedicated for recharging the consoltation fee.",
};


export default async function DepositCash(){
  try {
    const [{userId}, userData]: [AuthResponse, UserData] = await Promise.all([
      auth(),
      fetchUserData()
    ]);

    if (!userId) {
      return redirect("/auth/sign-in");
    }

    if (userData.error) {
      return (
        <main className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="p-6 bg-red-50 rounded-lg text-red-600">
            {userData.error}
          </div>
        </main>
      );
    }

    return (
      <main className="w-full h-[calc(100vh-80px)] flex flex-col md:flex-row">       
        <section className="w-full h-full p-4">
          <ScrollArea className="w-full h-full">
            <div className="w-full flex items-center justify-center">
              <Deposit user={userData.user} />
            </div>
          </ScrollArea>
        </section>
      </main>
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error:any) {
    return (
      <main className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="p-6 bg-red-50 rounded-lg text-red-600">
          An unexpected error occurred. Please try again later.
        </div>
      </main>
    );
  }
}
