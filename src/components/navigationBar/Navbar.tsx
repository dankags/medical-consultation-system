"use client"
import { usePathname } from 'next/navigation'
import React from 'react'

const Navbar = () => {
    const pathname=usePathname()
    if(pathname.includes('/auth')){
        return
    }
  return (
    <div>Navbar</div>
  )
}

export default Navbar