"use client"

import React, { FormEvent, useRef, useState } from 'react'
import { Separator } from '../ui/separator'
import ShimmerButton from '../magicui/shimmer-button'
import { BookCall } from '../ui/bookcall'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { BookCall2 } from '../ui/bookdemo'
import { LetsCall } from '../ui/letscall'
import Link from 'next/link'
import ShineBorder from '../magicui/shine-border'
import Newsletter from './newsletter'
import { motion } from 'framer-motion'


export default function Footer() {


    const gearVariant = {
        hidden: { scale: 0.98 },
        visible: {
            scale: 1,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        }
    };

    return (
        <footer className='max-w-8xl  p-4 w-full overflow-hidden'>
            <div className='flex justify-center'>
                <Separator className=' w-[95%] flex mt-12' />

            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 w-full  p-6 gap-12'>
                <div className='Zapllo my-8  '>
                    <img src='/logo.png' className='h-6' />
                    <div className='flex gap-3 text-xs mt-6'>
                        <Link href='https://zapllo.notion.site/Work-at-Zapllo-9c970622e3d142919bdca4c42ee38aab?pvs=4'>
                            <h1>CAREERS</h1>
                        </Link>
                        <Link href='/support'>
                            <h1>SUPPORT</h1>
                        </Link>
                        <Link href='/contact'>
                            <h1>CONTACT</h1>
                        </Link>
                        <Link href='/pressRelease'>
                            <h1>PRESS RELEASE</h1>
                        </Link>
                    </div>
                    <div className='flex gap-3 mt-6'>
                        <img src="/twitter.png" alt="" className='h-8' />
                        <img src="/facebook.png" alt="" className='h-8' />
                        <img src="/instagram.png" alt="" className='h-8' />
                    </div>
                    <div className='flex w-full justify-start  mt-8'>
                        {/* <Link
                            href="/dashboard"
                            className="relative inline-fl ex h-10 overflow-hidden rounded-full p-[2px] "
                        >
                            <ShineBorder borderRadius={50}
                                className="text-center text-xl font-bold capitalize"
                                color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                            >
                                <h1>
                                    Get Started
                                </h1>
                            </ShineBorder>
                        </Link> */}
                        <LetsCall />
                    </div>
                </div>
                <div className='empty rectangle hidden lg:block '>
                    <motion.div className='-ml-12' initial="hidden" animate="visible" variants={gearVariant}>

                        <img src='/shards.png' className='absolute -mt-40  h-56' />

                    </motion.div>
                    <img src='/gear.png' className='h-[100%]' />
                </div>
                <div className=' overflow-visible  my-8  '>
                    <div className='flex md:justify-end gap-6'>
                        {/* <img src='at.png' className='h-full' /> */}

                        <img src='/at.gif' className='bg-gradient-to-r p-3 rounded-2xl from-[#815BF5] via-[#FC8929] to-[#FC8929]   h-20' />

                        <div>
                            <h1 className='text-lg   font-bold'>Subscribe to Zapllo Insider</h1>
                            <p className='text-[#676B93] text-xs w-56  mt-2'>Get latest updates on how technology is transforming Businesses and leveraging AI for 10X results</p>
                        </div>
                        {/* <img src='ellipse.png' className='absolute h- w-48 rounded-full object-cover' /> */}
                    </div>
                    <div className='flex md:justify-end'>
                        <Newsletter />
                    </div>
                </div>
            </div>
            <div className='flex justify-center'>
                <Separator className=' w-[95%] flex -mt-6' />
            </div>
            <div className='md:flex md:justify-between px-6 '>
                <div className='md:max-w-[600px]'>
                    <h1 className='text-[#676B93] mt-6 text-xs md:text-sm'>Copyright © 2025 Zapllo Technologies Private Limited. All rights reserved.</h1>
                    <p className='text-[#676B93] text-xs '>This site is not a part of the Facebook website or Facebook Inc. Additionally, This site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.</p>
                </div>
                <div className='md:flex items-center mt-4 mb-4  gap-1 md:gap-2'>
                    <h1 className='text-xs w-[500px] md:w-full md:text-md text-[#676B93]'>
                        🔒 We care about privacy (
                            
                        <Link className='hover:underline text-blue-400' href='/privacypolicy'>

                            Privacy Policy
                        </Link> & <Link className='hover:underline text-blue-400' href='/terms'>Terms of Service</Link>)

                    </h1>
                    {/* <Link href='/disclaimer'>
                        <h1 className='text-[#676B93] mt-6 text-xs md:text-sm cursor-pointer hover:text-gray-200'>Disclaimer</h1>
                    </Link> */}
                    {/* <h1 className='text-[#676B93] mt-6  hidden md:block text-xs md:text-sm'>|</h1> */}



                    {/* <Link href='/refundpolicy'>
                        <h1 className='text-[#676B93] mt-6 text-xs md:text-sm cursor-pointer hover:text-gray-200'>Refund Policy</h1>
                    </Link> */}
                    {/* <h1 className='text-[#676B93] mt-6  hidden md:block text-xs md:text-sm'>|</h1> */}


                    {/* <h1 className='text-[#676B93] mt-6 hidden md:block text-xs md:text-sm'>|</h1> */}
                    {/* <Link href='/contactus'>
                        <h1 className='text-[#676B93] mt-6 text-xs md:text-sm cursor-pointer hover:text-gray-200'>Contact Us</h1>
                    </Link> */}

                </div>
            </div >
        </footer >
    )
}
