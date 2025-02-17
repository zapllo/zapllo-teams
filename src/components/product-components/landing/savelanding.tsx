import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {}

export default function SaveLanding({ }: Props) {
    return (
        <div className='justify-center md:mx-20 mx-12  flex '>
            <div className='grid md:grid-cols-2   mt-4 justify-center items-center '>
                <div className='w-full'>
                    <img src="/product/update.png" className='w-[487px] ' />
                </div>
                <div className="max-w-3xl w-full">
                    <h1 className="md:text-3xl md:mt-0 mt-4 text-2xl font-semibold">
                        Start saving money and start investing in growth
                    </h1>
                    <p className="text-sm  text-muted-foreground mt-4">
                        Unlock the Power of ZAPLLO with WhatsApp Reminders & 10X Team Productivity🚀
                    </p>
                    <div className="md:w-[110%] items-center w-56  gap-4 mt-8 ">
                        <Link href='https://masterclass.zapllo.com/workshop/'>
                            <Button className="mt-8 mb-4 relative py-7 w-72 text-xl font-semibold bg-primary text-white rounded-full shadow-lg flex items-center ">
                                <p className="-ml-8">   Join Live Masterclass</p>
                                <img src="/icons/rocket.png" className="h-20 absolute right-0" />
                            </Button>
                        </Link>

                        <div className=' '>
                            <button className='bg-gradient-to-b text-xl from-[#1C1F3E]  w-72 to-[#010313] border px-4 py-2 rounded-3xl text-[#815BF5]'>Create Your Free Account </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}