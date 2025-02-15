import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {}

export default function SaveMoreTasks({ }: Props) {
    return (
        <div className='justify-center mt-12    w-full  flex '>
            <div className='grid md:grid-cols-2 gap-2 max-w-5xl w-full  mt-4 justify-center items-center '>
                <div className='w-full'>
                    <img src="/product/noexcuse.png" className='scale-75' />
                </div>
                <div className='mx-12'>
                    <div>
                        <h1 className="md:text-3xl text-xl whitespace-nowrap font-semibold">
                            No excuses, only Task Completion-using <br /> Zapllo Tasks App
                        </h1>
                        <p className="text-sm  text-muted-foreground mt-4">
                            Sign up for Task Automation Masterclass to learn how to delegate Tasks to your Team, Watch live demo. Register Now
                        </p>
                    </div>
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