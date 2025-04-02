"use client"
import React,{KeyboardEvent, useEffect, useRef, useState, useTransition} from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from "sonner"
import { useCurrentUser } from '@/components/providers/UserProvider'
import { Plus, X } from 'lucide-react'
import { createDoctor } from '@/lib/actions/user.actions'
import { RiErrorWarningLine } from 'react-icons/ri'

interface CreateDoctorInfoProps {
    open: boolean
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  }
  interface DoctorInfo {
    name: string
    description: string
  }
    



const CreateDoctorInfo = ({open,onOpenChange}:CreateDoctorInfoProps) => {
    const {status,user}=useCurrentUser()
    const [isPending,startTransition]=useTransition()
    const [doctorinfo,setDoctorInfo]=useState<DoctorInfo>({
        name:"",
        description:"",
    })
    
    const [tags, setTags] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen,setIsOpen]=useState(false)

  useEffect(()=>{
    setIsOpen(open)
  },[open])

  const handleOpen=(value:boolean)=>{
    setIsOpen(false)
    onOpenChange(value)
  }

  const handleAddTag = () => {
    if (inputValue.trim() !== "") {
      if (editIndex !== null) {
        // Edit existing tag
        const newTags = [...tags]
        newTags[editIndex] = inputValue
        setTags(newTags)
        setEditIndex(null)
      } else {
        // Add new tag
        setTags([...tags, inputValue])
      }
      setInputValue("")
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0 && editIndex === null) {
      // Start editing the last tag when backspace is pressed with empty input
      const lastTag = tags[tags.length - 1]
      setInputValue(lastTag)
      setEditIndex(tags.length - 1)
      setTags(tags.slice(0, -1))
    }
  }

  const removeTag = (index: number) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
    if (editIndex === index) {
      setEditIndex(null)
      setInputValue("")
    }
  }

//   const editTag = (index: number) => {
//     setInputValue(tags[index])
//     setEditIndex(index)
//     removeTag(index)
//     inputRef.current?.focus()
//   }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange=(e:React.ChangeEvent<any>)=>{
    setDoctorInfo((prev)=>({...prev,[e.target.name]:e.target.value}))
  }

    const handleDoctorCreation=async()=>{
        if(tags.length===0||!user||!doctorinfo.name||!doctorinfo.description){
            toast.error("Please provide the doctor's information.")
            return
        }
        startTransition(async()=>{
            try{
                const newDoctor=await createDoctor({
                    ...doctorinfo,
                    speciality:tags,
                    user:user?.id
                })
                if(newDoctor.success){
                    toast.success("success",{description:"Your doctor profile was created successfully."})
                    setIsOpen(false)
                    onOpenChange(false)
                    return
                }
                if(newDoctor.error){
                    throw new Error(newDoctor.error)
                }
              
            }catch(error){
                console.log(error)
                toast.error("Error Occured",{description:`${error?error:"Internal server error"}`})
                return
            }
        })
    }
 if(status!=="authenticated") return
  return (
<Dialog open={isOpen} onOpenChange={(e)=>handleOpen(e)}>
      <DialogContent className="sm:max-w-[600px] sm:h-[500px] dark:bg-dark-400 dark:border-neutral-700">
      <ScrollArea className="w-full h-full  pb-8 md:pb-4">
        <div className="w-full px-3 relative">
            <DialogHeader className=" px-2 py-4  dark:dark:bg-dark-400">
                <DialogTitle className="text-2xl">Create Doctor Info</DialogTitle>
        
              <div className='flex flex-col gap-2 text-sm dark:text-neutral-400'>
                    <span>Please fill in the required information to create your doctor profile. </span>
                    <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center  dark:text-red-300"><RiErrorWarningLine /></div>
                    <p><span className="dark:text-red-300">Note:</span> This ensures yo appear in patient booking page.</p>
                    </div>
              </div>
                
               
            </DialogHeader>
            <div className="flex flex-col gap-4 px-2 py-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                    <Input type="text" id="name" name='name' onChange={handleChange} className="border border-gray-300 rounded-md p-2 dark:bg-dark-200 dark:focus:bg-dark-500/40 dark:focus-visible:ring-green-500 dark:focus-visible:ring-offset-dark-400" placeholder="Enter your full name" required/>
                </div>
                <div className="w-full  mx-auto">
      <label className="block text-sm font-medium mb-2">Enter Specialty.</label>
      <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md bg-background focus-within:ring-2 dark:border-neutral-700 focus-within:ring-ring focus-within:ring-offset-2 dark:focus-within:ring-offset-dark-300 dark:focus-within:ring-green-500">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-3 py-1 rounded-sm dark:bg-emerald-600/70 text-primary-foreground/90 transition-all group hover:bg-primary/15"
          >
            <span className="text-sm">{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="w-4 h-4 rounded-full flex items-center justify-center text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <div className="flex-1 flex items-center min-w-[180px]">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="px-2 flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-8 text-sm dark:bg-transparent dark:focus:bg-dark-500/40 dark:focus-visible:ring-green-500 dark:focus-visible:ring-offset-dark-400"
            placeholder={tags.length === 0 ? "Add tags..." : ""}
          />
          <Button
            type="button"
            onClick={handleAddTag}
            disabled={inputValue.trim() === ""}
            size="sm"
            variant="ghost"
            className="h-8 px-2 ml-1 dark:hover:bg-green-500"
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Add Tag</span>
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">Press Enter to add a tag. Click a tag to edit it.</p>
    </div>
               
                <div className="flex flex-col gap-2">
                    <Label htmlFor="contact" className="text-sm font-semibold">Description.</Label>
                    <Textarea
                  id="description"
                  placeholder="Add any additional information about this appointment..."
                 name='description'
                 onChange={(e)=>handleChange(e)}
                  className="min-h-[100px] dark:bg-dark-200 dark:focus:bg-dark-500/40 dark:focus-visible:ring-green-500 dark:focus-visible:ring-offset-dark-400"
                />
                </div>
            </div>
            <div className="flex justify-end px-2 py-4">
                <Button variant="outline" className='dark:hover:bg-neutral-950/80' onClick={() => onOpenChange(false)}>
                Cancel
                </Button>
                <Button disabled={isPending} onClick={handleDoctorCreation} variant={"secondary"} className="ml-2 dark:text-white dark:bg-emerald-500 dark:hover:bg-emerald-700 disabled:bg-emerald-800" >
                Save
                </Button>
            </div>
        </div>
         </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default CreateDoctorInfo