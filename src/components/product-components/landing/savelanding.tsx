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
                    <div className="md:w-[110%] md:flex gap-4 mt-8 ">
                        <div className="z-10  md:min-h-[10rem]  min-h-[4rem] items-center ">
                            <div
                                className={cn(
                                    "group rounded-full w-56 border border-black/5  transition-all ease-in  text-base text-white  hover:cursor-pointer  dark:border-white/5 dark:hover:text-white dark:bg-gradient-to-r from-[#A587FF] to-[#5E29FF] dark:hover:bg-blue-800",
                                )}
                            >
                                <Link href='/bookdemo'>

                                    <div className="inline-flex text-2xl items-center justify-center px-6 py-2 transition ease-out hover:text-neutral-600 hover:duration-900  hover:dark:text-white">
                                        <span className="flex mt-auto text-xl  font-medium  gap-2">
                                            <div className="m ">
                                            </div>
                                            <h1 className=" text-sm">
                                                Join Live Master Classes
                                            </h1>
                                        </span>

                                    </div>
                                </Link>
                            </div>

                        </div>
                        <div className=''>
                            <Link href='/signup'>
                                <button className='w-56 bg-gradient-to-b text-sm from-[#1C1F3E]  to-[#010313] border px-4 py-2 rounded-3xl text-[#815BF5]'>Create Your Free Account </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}