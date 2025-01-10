import React from 'react'
import PayrollFaq from './Faq'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {}

export default function SettingUp4({ }: Props) {
    return (
        <div className='justify-center md:mx-20 mx-12 flex md:-mt-24'>
            <div className=' mt-4 '>
              
                <div className='grid md:grid-cols-2 mt-12 md:mt-0  w-full max-w-7xl items-center'>

                    <div>
                        <div className=' rounded-xl'>
                            {/* <PayrollFaq /> */}
                            <img src='/product/icons/calendar.png' className='rounded-xl h-16 md:h-20' />
                        </div>
                        <h1 className='md:text-3xl text-2xl font-bold mt-4'>Setup Holiday Calendar</h1>
                        <p className='text-muted-foreground w-full max-w-lg mt-4 text-'>Start by adding your teammates & assigning their reporting managers. This means all leave and attendance requests go straight to the right people for quick approval or rejection. Smooth, organized, and hassle-free!.</p>
                      
                    </div>
                    <div className='w-full h-full scale-150 md:scale-100 md:h-[648px] rounded-xl'>
                        <img src='/product/holiday.png' className='rounded-xl object-cover h-full w-full' />
                    </div>
                </div>
            </div>
        </div>
    )
};