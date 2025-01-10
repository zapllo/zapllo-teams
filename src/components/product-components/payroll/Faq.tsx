import React from 'react'
import { Accordion2, AccordionContent2, AccordionItem2, AccordionTrigger2 } from '@/components/ui/accordion2'
import { Separator } from '@/components/ui/separator'

type Props = {
    onAccordionChange: (value: string) => void;
};


export default function PayrollFaq({ onAccordionChange }: Props) {
    return (
        <div className='md:mx-0 mx-12'>
            <div className='md:mt-4  space-y-4'>
                <Accordion2
                    onValueChange={(value) => onAccordionChange(value)} // Call the prop function on change
                    type="single"
                    collapsible
                    defaultValue='item-1'
                    className=' space-y-4'>
                    <AccordionItem2 value="item-1">
                        <AccordionTrigger2 iconSrc="/product/faceicon.png">Facial Recognition</AccordionTrigger2>
                        {/* <Separator /> */}
                        <AccordionContent2>
                            <Separator className='absolute w-[500px] -ml-6 -mt-2 ' />

                            Employees can effortlessly punch in and out through their mobile
                            phones, enhancing security and efficiency. With real-time face
                            detection, offsite employees can easily manage attendance.
                        </AccordionContent2>
                    </AccordionItem2>

                    <AccordionItem2 value="item-2">
                        <AccordionTrigger2 iconSrc="/product/icons/map.png">Geo Tagging & Geo Fencing</AccordionTrigger2>
                        <AccordionContent2>
                            <Separator className='absolute w-[500px] -ml-6 -mt-2 ' />
                            Auto Geo-location tagging ensures authenticity by capturing staff locations during logins and logouts, preventing fraud.
                        </AccordionContent2>
                    </AccordionItem2>

                    <AccordionItem2 value="item-3">
                        <AccordionTrigger2 iconSrc="/product/icons/tick.png">Apply with ease</AccordionTrigger2>
                        <AccordionContent2>
                            <Separator className='absolute w-[500px] -ml-6 -mt-2 ' />
                            Employees can request leave by specifying type, dates, and reason, with the option to add voice notes or upload documents.
                        </AccordionContent2>
                    </AccordionItem2>

                    <AccordionItem2 value="item-4">
                        <AccordionTrigger2 iconSrc="/product/icons/attendance.png">Attendance Regularization</AccordionTrigger2>
                        <AccordionContent2>
                            <Separator className='absolute w-[500px] -ml-6 -mt-2 ' />
                            Team members can also use Regularisation to mark the attendance of past dates, in which case reporting managers will get a notification from where they can approve/reject such requests.
                        </AccordionContent2>
                    </AccordionItem2>

                    <AccordionItem2 value="item-5">
                        <AccordionTrigger2 iconSrc="/product/icons/backdated.png">Backdated Leaves</AccordionTrigger2>
                        <AccordionContent2>
                            <Separator className='absolute w-[500px] -ml-6 -mt-2 ' />
                            Employee can request leave for a period that has already passed, usually due to emergencies or administrative delays
                        </AccordionContent2>
                    </AccordionItem2>

                    <AccordionItem2 value="item-6">
                        <AccordionTrigger2 iconSrc="/product/icons/bell2.png">WhatsApp/Email Notifications</AccordionTrigger2>
                        <AccordionContent2>
                            <Separator className='absolute w-[500px] -ml-6 -mt-2 ' />
                            Reporting Managers receive leave request notifications via WhatsApp and email, allowing them to review and approve or reject directly.
                        </AccordionContent2>
                    </AccordionItem2>
                </Accordion2>
            </div>
        </div>
    )
}
