import React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import {  useClerk } from "@clerk/nextjs"
import { useSocket } from "@/stores/useSocket"


const DropDownMenu = ({children}:{children:React.ReactNode}) => {
    const router=useRouter()
    const {socket:userSocket,removeSocket}=useSocket()
    const { signOut } = useClerk()
  return (
    <DropdownMenu >
    <DropdownMenuTrigger asChild className="aria-[expanded=true]:bg-neutral-700 focus-visible:ring-offset-0 focus-visible:ring-0">
      {children}
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56 dark:bg-dark-200 dark:border-neutral-700">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="hover:cursor-pointer" onClick={()=>router.push(`/profile`)}>
            <User />
            <span>Profile</span>
    </DropdownMenuItem>
    
      <DropdownMenuSeparator />
      <DropdownMenuItem className="hover:cursor-pointer" onClick={async()=>{
        removeSocket();
        userSocket?.emit("logout");
         await signOut({ redirectUrl: '/auth/sign-in' })
      }}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

export default DropDownMenu