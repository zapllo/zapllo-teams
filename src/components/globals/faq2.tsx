import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import GradientText from '../magicui/gradient'

export default function Faq2() {
    return (
        <div>
            <GradientText>
                <h1 className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent text-center font-bold text-3xl'>FAQ</h1>
            </GradientText>
            <h1 className='md:text-3xl text-xl text-center mx-4 md:mx-0 font-bold mt-2'>You have Questions, We have Answers</h1>
            <div className='mt-12 space-y-4'>
                <Accordion type="single" collapsible className='md:w-[900px] md:mx-0  mx-4 space-y-4'>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is the Attendance Tracker?
                        </AccordionTrigger>
                        <AccordionContent>
                            This is a feature that allows employees to clock in and out of their shifts electronically using facial recognition. It can also capture their location.

                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className=''>
                            What are the benefits of Attendance Tracking?
                        </AccordionTrigger>
                        <AccordionContent>
                            It simplifies timekeeping, reduces errors, and provides accurate data for payroll processing.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>
                            What is Leave Management and How does it work?
                        </AccordionTrigger>
                        <AccordionContent>
                            This feature streamlines the process of requesting, tracking, and approving employee leave. Employees submit leave requests electronically, specifying the type and duration. Managers can then review and approve or deny the request through the system.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>Do I need both Attendance Tracking and Leave Management?
                        </AccordionTrigger>
                        <AccordionContent>
                            No, it depends on your needs. However, using both offers a comprehensive solution for managing employee time and leave.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger>What are the advantages of using both features together?
                        </AccordionTrigger>
                        <AccordionContent>
                            They provide a centralized platform for all employee time-related data, streamlining processes and improving overall HR efficiency.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                        <AccordionTrigger>Can I track remote employee attendance?</AccordionTrigger>
                        <AccordionContent>
                            Yes, some Attendance Trackers offer mobile app options with features like geolocation capture to ensure remote employees are clocking in/out from designated locations.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                        <AccordionTrigger>What happens if there are attendance discrepancies?             </AccordionTrigger>
                        <AccordionContent>
                            Reporting managers will be able to see such discrepencies including missed punbhes. Employees can then address these within the platform for approval.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8">
                        <AccordionTrigger>What types of leave can be tracked?                        </AccordionTrigger>
                        <AccordionContent>
                            The system can be customized to accommodate various leave types like sick leave, vacation time, personal days, etc.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-9">
                        <AccordionTrigger>Can employees see their remaining leave balance?
                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, most Leave Management systems provide a self-service portal where employees can view their leave requests, approvals, and remaining leave balances.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-10">
                        <AccordionTrigger>What happens if employees forgot to mark attendance?
                        </AccordionTrigger>
                        <AccordionContent>
                            Employees can mark attendance for past dates using Regularisation form. Once the employee submits this request, reporting manager shall approve or reject such attendance.

                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-11">
                        <AccordionTrigger>
                            Is there any training required to use the system?
                        </AccordionTrigger>
                        <AccordionContent>
                            Most systems are user-friendly and require minimal training. However, some platforms may offer training resources or webinars for both employees and managers.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-12">
                        <AccordionTrigger>
                            How can this package help me improve my business efficiency?
                        </AccordionTrigger>
                        <AccordionContent>
                            By automating tasks, streamlining workflows, and improving communication, this package can significantly boost your overall business efficiency.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}
