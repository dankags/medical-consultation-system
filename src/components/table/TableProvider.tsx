"use client"
import React from 'react'
import { Table,
    TableBody,
    TableCaption,
    
    TableHead,
    TableHeader,
    TableRow, } from '../ui/table'

type TableProps={
    children:React.ReactNode;
    head?:string[]
}

const TableProvider = ({children,head}:TableProps) => {
  return (
    <Table>
      <TableCaption>A list of your upcoming Appointments.</TableCaption>
      <TableHeader>
        <TableRow>
            {head?.map((item,i)=>
              <TableHead key={i} className="">{item}</TableHead>
            )}
         
        </TableRow>
      </TableHeader>
      <TableBody>
        {children}
      </TableBody>
    </Table>
  )
}

export default TableProvider