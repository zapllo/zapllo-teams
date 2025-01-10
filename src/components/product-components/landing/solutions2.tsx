import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {}

export default function Solutions2({ }: Props) {
    return (
        <div className='flex justify-center md:mx-20 mx-12 -mt-24'>
            <div className='mb-16 mt-4 '>

            <div className='grid md:grid-cols-2 md:mx-12 gap-4 items-center'>
                    
                    <div>
                        <div className=' rounded-xl flex items-center gap-4'>
                            {/* <PayrollFaq /> */}
                            <img src='/landing/icons/02.png' className='rounded-xl h-16' />
                            <h1 className='text-3xl font-bold bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text  text-transparent'>Zapllo Payroll</h1>
                        </div>
                        <div className='text-[#676B93] text-sm'>
                            <h1 className='font-bold text-2xl mt-4 mb-4 text-white'>Leave & Attendance Tracking App</h1>
                            <h1 className='mt-4' >
                            Streamline your HR operations </h1>
                            <h1 className='mt-4' >
                            Real-time attendance monitoring & payroll</h1>
                            <h1 className='mt-4' >
                            Get a seamless leave requests experience</h1>
                            <h1 className='mt-4' >
                            Compliance checks fostering a more transparent and efficient workforce</h1>
                        </div>
                    </div>
                    <div className='mb-4  rounded-xl'>
                        <img src='/landing/mockup2.png' className='rounded-xl object-cover scale-75 ' />
                    </div>
                </div>
            </div>
        </div>
    )
};