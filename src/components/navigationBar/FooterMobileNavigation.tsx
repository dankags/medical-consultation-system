"use client"
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'
import { GoHome, GoHomeFill } from "react-icons/go";
import { RiCalendarScheduleFill, RiCalendarScheduleLine } from "react-icons/ri";
import { MdOutlinePayments, MdPayments } from "react-icons/md";
import { useAuth } from '@clerk/nextjs';
import { PiHandCoinsFill, PiHandCoins } from "react-icons/pi";
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '../providers/UserProvider';
import { GrTransaction } from "react-icons/gr";


const FooterMobileNavigation = () => {
  const pathname=usePathname()
  const {userId}=useAuth()
  const {user}=useCurrentUser()
  const navlinks = useMemo<NavigationLink[]>(() => {
    if(!user){return []}
    if(user?.role==="doctor"){
      return [
        {
          name: "Home",
          href: "/",
          active: pathname === "/",
          Icon: () => (pathname === "/" ? <GoHomeFill size={24} /> : <GoHome size={24} />),
        },
        {
          name: "Appointments",
          href: `/appointments`,
          active: pathname.includes("/appointments"),
          Icon: () =>
            pathname.includes("/appointments") ? (
              <RiCalendarScheduleFill size={24} />
            ) : (
              <RiCalendarScheduleLine size={24} />
            ),
        },
        {
          name: "Payments",
          href: `/payments/${userId}`,
          active: pathname.includes("/payments"),
          Icon: () =>
            pathname.includes("/payments") ? (
              <MdOutlinePayments size={24} />
            ) : (
              <MdPayments size={24} />
            ),
        },
        {
          name: "Withdraw",
          href: `/withdraw/${userId}`,
          active: pathname.includes("/withdraw"),
          Icon: () =>
            pathname.includes("/withdraw") ? (
              <GrTransaction  size={24} />
            ) : (
              <GrTransaction size={24} />
            ),
        },
      ]
    }
    return [
      {
        name: "Home",
        href: "/",
        active: pathname === "/",
        Icon: () => (pathname === "/" ? <GoHomeFill size={24} /> : <GoHome size={24} />),
      },
      {
        name: "Appointments",
        href: `/appointments`,
        active: pathname.includes("/appointments"),
        Icon: () =>
          pathname.includes("/appointments") ? (
            <RiCalendarScheduleFill size={24} />
          ) : (
            <RiCalendarScheduleLine size={24} />
          ),
      },
      {
        name: "Payments",
        href: `/payments/${userId}`,
        active: pathname.includes("/payments"),
        Icon: () =>
          pathname.includes("/payments") ? (
            <MdOutlinePayments size={24} />
          ) : (
            <MdPayments size={24} />
          ),
      },
      {
        name: "Deposit",
        href: `/deposit/${userId}`,
        active: pathname.includes("/deposit"),
        Icon: () =>
          pathname.includes("/deposit") ? (
            <PiHandCoinsFill size={24} />
          ) : (
            <PiHandCoins size={24} />
          ),
      },
    ];
  }, [pathname, userId,user]);

    if(pathname.includes('/auth'))  return

  return (
    <div className='z-10 fixed bottom-0 w-full md:hidden flex  p-3 items-center  justify-between bg-dark-300 border-t-[1px] border-neutral-700'>
        {navlinks.length>0&&
            navlinks.map((item,i)=>
             <Link key={i} href={item.href} className={cn("flex flex-col justify-center items-center gap-2 font-medium text-neutral-400",item.active&&"text-white")}>
                <div>{item.Icon && <item.Icon />}</div>
                <span className={cn("text-sm",item.active&&"text-white font-semibold")}>{item.name}</span>
             </Link>
            )
        }
   </div>
  )
}

export default FooterMobileNavigation