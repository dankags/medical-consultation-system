"use client"
import { format, isValid, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { Input } from "./input"

type Props = {
    setFormDate: (date: Date) => void; 
  };

export default function DatePickerDemo({ setFormDate }: Props) {
  const [date, setDate] = useState<Date>()
  const [month, setMonth] = useState(new Date());
  const [inputValue,setInputValue]=useState("Pick a date")

  useEffect(()=>{
    if(date){
        setFormDate(date)
        // setInputValue(format(date,"MM/dd/yyyy"))
     return
    }
    return
  },[date])

  const handleDayPickerSelect = (date: Date | undefined) => {
    if (!date) {
      setInputValue("");
      setDate(undefined);
    } else {
      setDate(date);
      setMonth(date);
      setInputValue(format(date, "MM/dd/yyyy"));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // keep the input value in sync

    const parsedDate = parse(e.target.value, "MM/dd/yyyy", new Date());

    if (isValid(parsedDate)) {
        setDate(parsedDate);
      setMonth(parsedDate);
    } else {
        setDate(undefined);
    }
  };

console.log(date,inputValue)
  return (
    <Popover  >
      <div className='flex'>
        <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          type="button"
          className={cn(
            "w-fit justify-start text-left font-normal ring-0 ring-offset-0 border-none",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon/>
        </Button>
        </PopoverTrigger>
        <Input value={inputValue} onChange={handleInputChange} className='bg-transparent border-none pl-0 focus-within:ring-transparent focus-within:ring-offset-transparent'/>
      </div>
    
      <PopoverContent className="w-auto p-0 bg-dark-300 shadow-[0_4px_60px_0] shadow-black/50  data-[state=open]:border-neutral-700 focus-within:outline-bg-neutral-500" align="start" >
        <Calendar
          mode="single"
          selected={date}
          month={month}
          onMonthChange={setMonth}
          onSelect={handleDayPickerSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
