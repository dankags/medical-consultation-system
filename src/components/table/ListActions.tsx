"use client"

import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Appointment } from '@/types/appwrite.types'

interface ListActionType{
  setActiveRow:(id:string|null)=>void,
   item:Appointment,
   children:React.ReactNode,
   setIsCanceling:(value:boolean)=>void,
   setIsEdit:(value:boolean)=>void
}

const ListActions = ({setActiveRow, item,children,setIsCanceling,setIsEdit}:ListActionType) => {
    
    
    const handleOpen=(open:boolean)=>{
      if(open){
        setActiveRow(item.id)
        return
      }
      setActiveRow(null)
    }

  
  
  return (
    <DropdownMenu  onOpenChange={(open)=>{handleOpen(open)}}>
    <DropdownMenuTrigger asChild>
      {children}
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-8">
    <DropdownMenuLabel>Action</DropdownMenuLabel>
    <DropdownMenuGroup>
     
           <DropdownMenuItem onClick={()=>setIsEdit(true)}>
           
           <span>Schedule</span>
         </DropdownMenuItem>
         <DropdownMenuItem onClick={()=>setIsCanceling(true)}>
          
           <span>Cancel</span>
         </DropdownMenuItem>
        </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>

);

}

export default ListActions