import React from 'react'
import DialogProvider from '../DialogProvider'
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Button } from '../ui/button';


type Props={
    opened:boolean,
    setIsOpened:(open: boolean) => void,
    handleOTPConfirmation:()=>void,
    setConfirmationCode:(value:string)=>void
}

const ConfirmEmail:React.FC<Props> = ({opened,setIsOpened,setConfirmationCode,handleOTPConfirmation}) => {

  return (
    <DialogProvider
      opened={opened}
      setOpenedState={setIsOpened}
      title="Confirm Registration"
      description="Please enter the OTP sent to the email inbox."
      FooterComp={()=>{return(
        <div className='w-full flex items-center justify-center'>
            <Button onClick={handleOTPConfirmation} className='shad-primary-btn w-full active:scale-95'>Confirm OTP</Button>
        </div>
      )}}
    >
      <div className="w-full flex items-center justify-center">
        <InputOTP onChange={(value)=>setConfirmationCode(value)} maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </DialogProvider>
  );
}

export default ConfirmEmail