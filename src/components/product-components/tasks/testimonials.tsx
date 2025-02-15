import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {}

export default function PayrollTestimonials({ }: Props) {
    return (
        <div className='justify-center mx-12  flex '>
            <div className='mb-4 mt-20 '>
                <div className='flex justify-center   w-full'>
                    <h1 className='text-center  text-2xl font-bold md:max-w-xl'><span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent '>
                        Testimonials
                    </span> </h1>
                </div>
                <h1 className='font-bold text-center mb-4 text-2xl mt-4'>
                    What Folks Are Saying About #Zapllo
                </h1>
                <div className='grid grid-cols-3 gap-6 mt-4 justify-center items-center '>
                    <div className='bg-[#0A0D28] rounded-xl border'>
                        <div className='p-4'>
                            <img src='/rect.png' className='invert-[100]' />
                            <img src='/star.png' className='mt-4' />
                            <h1 className='text-2xl mt-4'>Shubhodeep</h1>
                            <p className='text-sm text-muted-foreground'>
                                Our custom opt-in pages captivate and convert audiences into engaged subscribers. Designed for optimal conversion, these visually engaging pages capture attention and inspire action, all while maintaining your brand&apos;s unique identity for a cohesive user experience.
                            </p>
                        </div>
                    </div>
                    <div className='bg-[#0A0D28] rounded-xl border'>
                        <div className='p-4'>
                            <img src='/rect.png' className='invert-[100]' />
                            <img src='/star.png' className='mt-4' />
                            <h1 className='text-2xl mt-4'>Shubhodeep</h1>
                            <p className='text-sm text-muted-foreground'>
                                Our custom opt-in pages captivate and convert audiences into engaged subscribers. Designed for optimal conversion, these visually engaging pages capture attention and inspire action, all while maintaining your brand&apos;s unique identity for a cohesive user experience.
                            </p>
                        </div>
                    </div>
                    <div className='bg-[#0A0D28] rounded-xl border'>
                        <div className='p-4'>
                            <img src='/rect.png' className='invert-[100]' />
                            <img src='/star.png' className='mt-4' />
                            <h1 className='text-2xl mt-4'>Shubhodeep</h1>
                            <p className='text-sm text-muted-foreground'>
                                Our custom opt-in pages captivate and convert audiences into engaged subscribers. Designed for optimal conversion, these visually engaging pages capture attention and inspire action, all while maintaining your brand&apos;s unique identity for a cohesive user experience.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="z-10 flex justify-center w-full   min-h-[10rem]   items-center ">
                    <div
                        className={cn(
                            "group rounded-full border border-black/5  transition-all ease-in  text-base text-white  hover:cursor-pointer  dark:border-white/5 dark:hover:text-white dark:bg-gradient-to-r from-[#A587FF] to-[#5E29FF] dark:hover:bg-blue-800",
                        )}
                    >
                        <Link href='https://masterclass.zapllo.com/workshop/'>
                            <Button className="mt-8 mb-4 relative py-7 w-72 text-xl font-semibold bg-primary text-white rounded-full shadow-lg flex items-center ">
                                <p className="-ml-8">   Join Live Masterclass</p>
                                <img src="/icons/rocket.png" className="h-20 absolute right-0" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    )
}