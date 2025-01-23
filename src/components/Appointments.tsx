"use client"
import { MoreHorizontal } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { TableCell, TableRow } from './ui/table'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const Appointments = () => {
  return (
    <TableRow  className={""}>
    <TableCell>
      {/* <DialogProvider editForm={<ProjectOverView item={item}/>}>
      <button className="">
        <div className="flex items-center space-x-3">
        <IKImage
          
          src={item.coverImage}
          alt={`${item.name}'s avatar`}
          className="w-10 h-10 rounded-full object-cover"
          width={40} 
          height={40}
        />
        <div className='flex flex-col items-start'>
          <div className="font-medium capitalize">{item.name}</div>
          
        </div>
        </div>
      </button>
      </DialogProvider> */}

<div className="flex items-center space-x-3">
        <Image
          
          src={"/assets/images/noavatar.jpg"}
          alt={` avatar`}
          className="w-10 h-10 rounded-full object-cover"
          width={40} 
          height={40}
        />
        <div className='flex flex-col items-start'>
          <div className="font-medium capitalize">John Doe</div>
          
        </div>
        </div>
    </TableCell>
 
    <TableCell  className='max-lg:hidden'>12 June 2024</TableCell>

        <TableCell  className='max-lg:hidden'>
          {/* <span className={cn(" p-1 px-3 rounded-full bg-green-500/80")}>
          Paid
          </span> */}
          <span className={cn(" p-1 px-3 rounded-full bg-red-500/80")}>
          Unpaid
          </span>
        </TableCell>
   
   
        <TableCell  className='max-lg:hidden gap-2'>
          <span className="text-neutral-300 mr-2">Ksh.</span>
          <span className="font-mono text-base">500</span>
        </TableCell>

    <TableCell>
       
        
          <Button variant="ghost" className="h-8 w-8 p-0" >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          
    </TableCell>
  </TableRow>
  )
}

export default Appointments