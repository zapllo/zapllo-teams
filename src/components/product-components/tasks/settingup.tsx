import React from 'react'
import PayrollFaq from './Faq'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {}

export default function SettingUp({ }: Props) {
    return (
        <div className='w-full flex max-w-8xl  items-center justify-center'>
            <div className=' mt-20 '>
                <div className='flex justify-center   w-full'>
                    <h1 className='text-center text-xl md:text-3xl font-bold md:max-w-xl'><span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent '>
                      Task Delegation App
                    </span> </h1>
                </div>
                <h1 className='font-bold text-center mb-4 text-xl md:text-3xl mt-4'>How Zapllo Tasks Work?</h1>
                {/**First Setting up */}
                <div className='grid mx-12 md:grid-cols-2 items-center'>
                    <div className='w-full hidden md:block scale-150 md:scale-100 md:mt-0 mt-12 md:h-[648px] rounded-xl'>
                        <img src='/product/addmember.png' className='rounded-xl object-cover h-full w-full' />
                    </div>
                    <div>
                        <div className=' rounded-xl'>
                            {/* <PayrollFaq /> */}
                            <img src='/product/icons/setup.png' className='rounded-xl h-16 md:h-20' />
                        </div>
                        <h1 className='md:text-3xl text-2xl font-bold mt-4'>Setup your Account</h1>
                        <p className='text-muted-foreground w-full max-w-lg mt-4 text-'>Add your teammates, assign roles to each member and ensure everyone knows their daily, weekly and monthly tasks.
                            <br/>
                            You can group teams department-wise, thus ensuring quick task assignments to relevant employees.
                        </p>
                      
                    </div>
                    <div className='w-full block md:hidden scale-150 md:scale-100 md:mt-0 mt-12 md:h-[648px] rounded-xl'>
                        <img src='/product/addmember.png' className='rounded-xl object-cover h-full w-full' />
                    </div>
                </div>

              
            </div>

        </div>
    )
};