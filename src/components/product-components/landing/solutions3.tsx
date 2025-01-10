import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {}

export default function Solutions3({ }: Props) {
    return (
        <div className='w-full flex max-w-8xl items-center justify-center'>

            {/**First Setting up */}
            <div className='grid md:grid-cols-2 mx-12 gap-4 items-center'>
                <div className='mb-4 hidden md:block rounded-xl'>
                    <img src='/landing/mockup3.png' className='rounded-xl object-cover scale-75 ' />
                </div>
                <div>
                    <div className=' rounded-xl flex items-center gap-4'>
                        {/* <PayrollFaq /> */}
                        <img src='/landing/icons/01.png' className='rounded-xl h-16' />
                        <h1 className='text-3xl font-bold bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent'>Zapllo WABA</h1>
                    </div>
                    <div className='text-[#676B93] text-sm'>
                        <h1 className='font-bold text-2xl mt-4 mb-4 text-white'>Official WhatsApp API</h1>
                        <h1 className='mt-4' >
                        Automate & Grow Your Business 24/7 on WhatsApp</h1>
                        <h1 className='mt-4' >
                        Accelerate your business growth with Official WhatsApp API, doubling your conversion rates through enhanced lead management</h1>
                        <h1 className='mt-4' >
                        Personalized customer interactions, and data-driven insights.</h1>
                        <h1 className='mt-4' >
                            Chatbots & Automated Support Systems for your Business.</h1>
                    </div>
                </div>
                <div className='mb-4 md:hidden block rounded-xl'>
                    <img src='/landing/mockup3.png' className='rounded-xl object-cover scale-75 ' />
                </div>
            </div>


        </div>
    )
};