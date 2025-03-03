import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {}

export default function SaveMore3({ }: Props) {
    return (
        <div className='justify-center md:mx-20 mx-12  flex '>
            <div className='grid md:grid-cols-2   mt-4 justify-center items-center '>
                <div className='w-full'>
                    <img src="/product/noexcuse.png" className='w-[487px] ' />
                </div>
                <div className="max-w-3xl mt-12 md:mt-0 w-full">
                    <h1 className="md:text-3xl text-xl font-semibold">
                        Start saving money and start investing in growth
                    </h1>
                    <p className="text-sm md:max-w-lg  text-muted-foreground mt-4">
                        Unlock the Power of TASK DELEGATION APP with WhatsApp Reminders & 10X your Team&apos;s Productivity🚀
                    </p>
                    <div className="md:w-[110%] items-center w-56  gap-4 mt-8 ">


                        <Link href='https://masterclass.zapllo.com/workshop/'>
                            <Button className="mt-8 mb-4 relative py-7 w-80 text-xl font-semibold bg-primary text-white rounded-full shadow-lg flex items-center ">
                                <p className="-ml-8">   Join Live Masterclass</p>
                                <img src="/icons/rocket.png" className="h-20 absolute right-0" />
                            </Button>
                        </Link>

                        <div className=' '>
                            <Link href='/signup'>
                                <button className='bg-gradient-to-b text-xl from-[#1C1F3E]  w-80 to-[#010313] border px-4 py-2 rounded-3xl text-[#815BF5]'>Create Your Free Account </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}