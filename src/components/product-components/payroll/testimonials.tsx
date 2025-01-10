import { TestimonialCards2 } from '@/components/globals/TestimonialCards'
import { TestimonialCards } from '@/components/globals/testimonialscards'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {}

export default function PayrollTestimonials({ }: Props) {
    return (
        <div className='justify-center mx-12 m flex '>
            <div className='mb-4 mt-20 '>
                <div className='flex justify-center   w-full'>
                    <h1 className='text-center  text-3xl font-bold md:max-w-xl'><span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent '>
                        Testimonials
                    </span> </h1>
                </div>
                <h1 className='font-bold text-center text-xl  md:text-3xl mt-4'>
                    What Folks Are Saying About #Zapllo
                </h1>
                <TestimonialCards />
                {/* <div className="z-10 flex justify-center w-full   min-h-[10rem]   items-center ">
                    <div
                        className={cn(
                            "group rounded-full border border-black/5  transition-all ease-in  text-base text-white  hover:cursor-pointer  dark:border-white/5 dark:hover:text-white dark:bg-gradient-to-r from-[#A587FF] to-[#5E29FF] dark:hover:bg-blue-800",
                        )}
                    >
                        <Link href='/bookdemo'>

                            <div className="inline-flex text-2xl items-center justify-center px-6 py-2 transition ease-out hover:text-neutral-600 hover:duration-900  hover:dark:text-white">
                                <span className="flex mt-auto text-xl  font-medium  gap-2">
                                    <div className="m ">

                                    </div>
                                    <h1 className=" text-md">
                                        Watch All Reviews
                                    </h1>
                                </span>

                            </div>
                        </Link>
                    </div>
                </div> */}
            </div>
        </div>

    )
}