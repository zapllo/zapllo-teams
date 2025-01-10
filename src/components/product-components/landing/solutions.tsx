import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {}

export default function Solutions({ }: Props) {
    return (
        <div className='w-full flex max-w-8xl items-center justify-center'>
            <div className=' mt-20 '>
                <div className='flex justify-center   w-full'>
                    <h1 className='text-center  text-3xl font-bold md:max-w-xl'><span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent '>
                       Our Solutions
                    </span> </h1>
                </div>
                <h1 className='font-bold text-center mb-4 text-4xl mt-4'>
                    Apps that help you Grow your Business
                </h1>
                <p className='text-lg text-[#676B93] mx-4 font-medium mt-4 mb-4 text-center '>
                    Zapllo is dedicated to help Business Owners get freedom from day to day firefighting<br />
                </p>
                {/**First Setting up */}
                <div className='grid grid-cols-1 md:grid-cols-2 mx-12 gap-4 items-center'>
                    <div className='mb-4  rounded-xl'>
                        <img src='/landing/mockup1.png' className='rounded-xl object-cover scale-75 ' />
                    </div>
                    <div>
                        <div className=' rounded-xl flex items-center gap-4'>
                            {/* <PayrollFaq /> */}
                            <img src='/landing/icons/01.png' className='rounded-xl h-16' />
                            <h1 className='text-3xl font-bold bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent'>Zapllo Tasks</h1>
                        </div>
                        <div className='text-[#676B93] text-sm'>
                            <h1 className='font-bold text-2xl mt-4 mb-4 text-white'>Task Delegation App</h1>
                            <h1 className='mt-4' >
                                Organize, prioritize, and track tasks efficiently for enhanced productivity.</h1>
                            <h1 className='mt-4' >
                                Assign tasks with deadlines and priorities, with their frequency to ensure efficient completion and management.</h1>
                            <h1 className='mt-4' >
                                Receive real-time task updates, while analyzing employee performance with MIS scores for accountability.</h1>
                            <h1 className='mt-4' >
                                Send Automated notifications & follow up reminders on WhatsApp & Email.</h1>
                        </div>
                    </div>

                </div>


            </div>

        </div>
    )
};