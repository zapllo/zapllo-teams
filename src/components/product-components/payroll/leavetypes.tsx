import React from 'react'
import PayrollFaq from './Faq'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {}

export default function SettingUp3({ }: Props) {
    return (
        <div className='w-full flex md:-mt-24 max-w-8xl  items-center justify-center'>
            <div className=''>
                <div className='grid md:grid-cols-2  items-center'>
                    <div className='w-full md:h-[648px] md:block hidden md:scale-100 scale-150 rounded-xl'>
                        <img src='/product/leavetypes.png' className='rounded-xl object-cover h-full w-full' />
                    </div>
                    <div className='mx-12 md:mx-0'>
                        <div className=' rounded-xl'>
                            {/* <PayrollFaq /> */}
                            <img src='/product/icons/leavetype.png' className='rounded-xl h-16 md:h-20' />
                        </div>
                        <h1 className='text-2xl md:text-3xl font-bold mt-4'>Define Leave Types</h1>
                        <p className='text-muted-foreground w-full max-w-lg mt-4 '>Customize your leave policies effortlessly. Define leave types such as casual, sick, or maternity leave. Decide on the total number of allotted leaves, whether they are paid or unpaid, and set durations from full days to short breaks.</p>
                      
                    </div>
                    <div className='w-full md:h-[648px] mt-12 md:mt-0 block md:hidden md:scale-100 scale-125 rounded-xl'>
                        <img src='/product/leavetypes.png' className='rounded-xl object-cover h-full w-full' />
                    </div>
                </div>

              
            </div>

        </div>
    )
};