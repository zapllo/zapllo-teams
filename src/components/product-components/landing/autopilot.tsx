import { InfiniteMoving2 } from '@/components/globals/infinite-moving2';
import Link from 'next/link';
import React from 'react'



export default function Autopilot() {
    return (
        <div className='w-full flex justify-center'>
            <div className='mb-16 mt-20 '>
                <div className=''>

                    <div className='flex mt-4  justify-center'>
                        <h1 className='text-center  text-3xl font-bold  bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent '>
                            To Run your Business on Autopilot
                        </h1>
                    </div>
                    <div className='flex mt-4  justify-center'>
                        <h1 className='text-2xl'>For Your Everyday Business needs</h1>
                    </div>
                </div>
                <div className='flex justify-center '>
                    <div className='grid grid-cols-1 mx-4 md:grid-cols-4 w-full gap-4   justify-center mt-8     -400'>
                        <Link href='/products/zapllo-teams'>
                            <div className='bg-[#0A0D28] hover:border-[#815bf5] cursor-pointer border hover:scale-105 p-4 rounded'>
                                <img src='/landing/tasks.png' className='h-12 mt-4' />
                                <div className='mt-4'>
                                    <h1 className='text-xl font-bold' >Task Delegation App</h1>
                                    <p className='text-[#676B93] mb-4 md:max-w-[220px] w-full text-sm mt-4'>
                                        Boost productivity, saving up to 5 hours per day. Prioritize, schedule, and delegate tasks efficiently, ensuring smoother workflows and timely project completion.
                                    </p>
                                </div>
                            </div>
                        </Link>


                        <Link href='/products/zapllo-payroll'>

                            <div className='bg-[#0A0D28] hover:border-[#815bf5] cursor-pointer border hover:scale-105 p-4 rounded'>
                                <img src='/landing/payroll.png' className='h-12 mt-4' />
                                <div className='mt-4'>
                                    <h1 className='text-xl  font-bold' >Zapllo Payroll <br />(Leave & Attendance)</h1>
                                    <p className='text-[#676B93] mb-4 md:max-w-[220px] w-full text-sm mt-4'>
                                        Streamline your HR operations providing seamless leave requests, real-time attendance monitoring & payroll.
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <div className='bg-[#0A0D28] hover:border-[#815bf5] cursor-pointer border hover:scale-105 p-4 rounded'>
                            <img src='/landing/whatsapp.png' className='h-12 mt-4' />
                            <div className='mt-4'>
                                <h1 className='text-xl font-bold' >Official WhatsApp API</h1>
                                <p className='text-[#676B93] mb-4 md:max-w-[220px] w-full text-sm mt-4'>
                                    Accelerate your business growth with Official WhatsApp API, doubling your conversion rates & making your business run 24X7.
                                </p>
                            </div>
                        </div>
                        <div className='bg-[#0A0D28] opacity-80 hover:border-[#815bf5] cursor-pointer border hover:scale-105 p-4 rounded'>
                            <img src='/icons/crm.png' className='h-12 mt-4' />
                            <div className='mt-4'>
                                <h1 className='text-xl font-bold' >Zapllo CRM (Coming Soon)</h1>
                                <p className='text-[#676B93] mb-4 md:max-w-[220px] w-full text-sm mt-4'>
                                    Take control of your finances and save upto 40% expenses by optimizing spending through streamlined tracking, approval workflows, and insightful reporting.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}