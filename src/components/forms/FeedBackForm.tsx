"use client"
import React, { useEffect, useState, useTransition } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Progress } from '../ui/progress'
import Image from 'next/image'
import { createUserFeedback } from '@/lib/actions/user.actions'
import { useCurrentUser } from '../providers/UserProvider'
import { toast } from 'sonner'
import { Feedback } from '@/types'

const FeedBackForm = ({userId}:{userId:string}) => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<Feedback>({
      user:"",
      userFriendly:false,
      mpesaIntegration: false,
      recommendation:false,
      accuracy:false,
      additionalFeatures:"",
      challenges:"",
      improvements:""
    })
    const [isPending,startTransition]=useTransition()
    const {user}=useCurrentUser()
    const totalSteps = 4
    const progress = (step / totalSteps) * 100
  
    const handleRadioChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: (value==="true") }))
    }
  
    const handleTextChange = (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  
    const handleSubmit=async()=>{
      if (step !== totalSteps) {
        setStep(step + 1)
        return
      } 
      if(formData.user===null) return
      startTransition(async()=>{
        try {
          const feedback=await createUserFeedback(formData)

          if(feedback?.error){
            throw new Error("Something went wrong when creating your feedback.")
          }

          toast.success("success",{description:`Your feedback was sent successfully`})

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error:any) {
          console.log(error)
          toast.error("!Ooops",{description:`${error?.message}`})
        }
      })
    }
 
   useEffect(()=>{
    if(!userId || !user || user?.id!==userId) return
    setFormData(prev=>({...prev,user:userId}))
   },[userId,user])

    return (
      <div className="min-h-screen p-4 md:p-8">
        <Card className="mx-auto max-w-3xl border-neutral-600">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-primary">
              Consultation Feedback
            </CardTitle>
            <Progress value={progress} className="h-2 mt-4 " />
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg">
                    Does the platform provide a user-friendly experience for all
                    age groups?
                  </Label>
                  <RadioGroup
                    onValueChange={(value) =>
                      handleRadioChange("userFriendly", value)
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="user-friendly-yes" />
                      <Label htmlFor="user-friendly-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="user-friendly-no" />
                      <Label htmlFor="user-friendly-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg">
                    Is the M-Pesa integration seamless for health-related
                    transactions?
                  </Label>
                  <RadioGroup
                    onValueChange={(value) =>
                      handleRadioChange("mpesaIntegration", value)
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="mpesa-yes" />
                      <Label htmlFor="mpesa-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="mpesa-no" />
                      <Label htmlFor="mpesa-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg">
                    Would you recommend this platform to others for healthcare
                    consultations?
                  </Label>
                  <RadioGroup
                    onValueChange={(value) =>
                      handleRadioChange("recommendation", value)
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="recommend-yes" />
                      <Label htmlFor="recommend-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="recommend-no" />
                      <Label htmlFor="recommend-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg">
                    Do you feel confident in the accuracy of the information
                    provided by the healthcare providers?
                  </Label>
                  <RadioGroup
                    onValueChange={(value) =>
                      handleRadioChange("accuracy", value)
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="accuracy-yes" />
                      <Label htmlFor="accuracy-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="accuracy-no" />
                      <Label htmlFor="accuracy-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg">
                    What additional features would you like to see implemented?
                  </Label>
                  <Textarea
                    value={formData.additionalFeatures}
                    onChange={(e) =>
                      handleTextChange("additionalFeatures", e.target.value)
                    }
                    placeholder="Share your suggestions..."
                    className="h-32 shad-textArea"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-lg">
                    Describe any challenges or difficulties you faced while
                    using the platform.
                  </Label>
                  <Textarea
                    value={formData.challenges}
                    onChange={(e) =>
                      handleTextChange("challenges", e.target.value)
                    }
                    placeholder="Describe any issues..."
                    className="h-32 shad-textArea"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg">
                    How has the platform impacted your overall healthcare
                    experience in terms of accessibility, cost, and convenience?
                  </Label>
                  <Textarea
                    value={formData.impact}
                    onChange={(e) => handleTextChange("impact", e.target.value)}
                    placeholder="Share your experience..."
                    className="h-32 shad-textArea"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-lg">
                    Are there any improvements you would suggest for enhancing
                    the system&apos;s usability or efficiency?
                  </Label>
                  <Textarea
                    value={formData.improvements}
                    onChange={(e) =>
                      handleTextChange("improvements", e.target.value)
                    }
                    placeholder="Suggest improvements..."
                    className="h-32 shad-textArea"
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleSubmit}
              className="shad-primary-btn px-3 py-2  active:scale-95"
            >
              {isPending ? (
                <>
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="animate-spin"
                  />
                </>
              ) : (
                <>
                  {step === totalSteps ? "Submit" : "Next"}
                  {step !== totalSteps && (
                    <ChevronRight className="w-4 h-4 ml-2" />
                  )}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
}

export default FeedBackForm