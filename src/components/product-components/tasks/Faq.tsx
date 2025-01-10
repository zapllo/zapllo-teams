import React from 'react'
import { Accordion2, AccordionContent2, AccordionItem2, AccordionTrigger2 } from '@/components/ui/accordion2'

export default function PayrollFaq() {
    return (
        <div className=''>
            <div className='mt-4  space-y-4'>
                <Accordion2 type="single" collapsible className=' '>
                    <AccordionItem2 value="item-1">
                        <AccordionTrigger2 className=''>Facial Recognition</AccordionTrigger2>
                        <AccordionContent2>
                            Employees can effortlessly punch in and out through their mobile
                            phones, enhancing security and efficiency. With real-time face
                            detection, offsite employees can easily manage attendance.
                        </AccordionContent2>
                    </AccordionItem2>
                </Accordion2>
                <Accordion2 type="single" collapsible className=' '>
                    <AccordionItem2 value="item-1">
                        <AccordionTrigger2>Geo Location Tagging</AccordionTrigger2>
                        <AccordionContent2>
                            Employees can effortlessly punch in and out through their mobile
                            phones, enhancing security and efficiency. With real-time face
                            detection, offsite employees can easily manage attendance.
                        </AccordionContent2>
                    </AccordionItem2>
                </Accordion2>
                <Accordion2 type="single" collapsible className=' '>
                    <AccordionItem2 value="item-1">
                        <AccordionTrigger2>Apply with ease</AccordionTrigger2>
                        <AccordionContent2>
                            Employees can effortlessly punch in and out through their mobile
                            phones, enhancing security and efficiency. With real-time face
                            detection, offsite employees can easily manage attendance.
                        </AccordionContent2>
                    </AccordionItem2>
                </Accordion2>
                <Accordion2 type="single" collapsible className=' '>
                    <AccordionItem2 value="item-1">
                        <AccordionTrigger2>Attendance Regularization</AccordionTrigger2>
                        <AccordionContent2>
                            Employees can effortlessly punch in and out through their mobile
                            phones, enhancing security and efficiency. With real-time face
                            detection, offsite employees can easily manage attendance.
                        </AccordionContent2>
                    </AccordionItem2>
                </Accordion2>
                <Accordion2 type="single" collapsible className=' '>
                    <AccordionItem2 value="item-1">
                        <AccordionTrigger2>Backdated Leaves</AccordionTrigger2>
                        <AccordionContent2>
                            Employees can effortlessly punch in and out through their mobile
                            phones, enhancing security and efficiency. With real-time face
                            detection, offsite employees can easily manage attendance.
                        </AccordionContent2>
                    </AccordionItem2>
                </Accordion2>
                <Accordion2 type="single" collapsible className=' '>
                    <AccordionItem2 value="item-1">
                        <AccordionTrigger2>WhatsApp/Email Notifications</AccordionTrigger2>
                        <AccordionContent2>
                            Employees can effortlessly punch in and out through their mobile
                            phones, enhancing security and efficiency. With real-time face
                            detection, offsite employees can easily manage attendance.
                        </AccordionContent2>
                    </AccordionItem2>
                </Accordion2>
            </div>
        </div>
    )
}
