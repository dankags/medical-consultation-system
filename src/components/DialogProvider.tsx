"use Client"

import React, {JSX } from "react"
import { Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
   } from "./ui/dialog"

type Props={
    title:string,
    description?:string,
    children:React.ReactNode,
    FooterComp?:()=>JSX.Element,
    opened:boolean,
    setOpenedState:(open:boolean)=>void
}

const DialogProvider:React.FC<Props> = ({title,description,children,opened,FooterComp,setOpenedState}) => {

  const handleDialogIsOpened=(opened:boolean)=>{
     
     setOpenedState(opened)
  }

  return (
    <Dialog open={opened} onOpenChange={(open)=>handleDialogIsOpened(open)}>
    <DialogContent className="sm:max-w-[425px] bg-dark-300 border-neutral-700">
      <DialogHeader>
        {title&&<DialogTitle>{title}</DialogTitle>}
        {description&&<DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
     {children}
      <DialogFooter>
        {FooterComp&&<FooterComp/>}
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

export default DialogProvider