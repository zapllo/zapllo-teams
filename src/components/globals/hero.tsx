
import React, { useRef, useState } from 'react'
import AnimatedGradientText from '../magicui/animated-gradient-text'
import { cn } from '@/lib/utils'
import { Golos_Text } from 'next/font/google';
import { ShinyText } from '../ui/shinytext';
import Image from 'next/image';
import VideoComponent from './video';
import { Check } from 'lucide-react';
import Link from 'next/link';

const golos = Golos_Text({ subsets: ["latin"] });


export default function Hero() {

    return (
        <div className='bg-[#05071E] '>
            <div className="z-10 flex items-center justify-center">
                <AnimatedGradientText>

                    <span
                        className={cn(
                            `inline animate- text-md text-center md:text-xl font-bold bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929]  bg-clip-text text-transparent`,
                        )}
                    >
                        Are you facing issues in you current Workflow  ?
                    </span>
                </AnimatedGradientText>

            </div>
            <div className='flex justify-center'>
                <h1 className='text-center text-2xl  bg-clip-text  font-extrabold  md:text-5xl mt-4   mx-4 md:max-w-[1000px]'>How to run your Business on Autopilot with  <span className='bg-gradient-to-r from-[#815BF5] bg-clip-text text-transparent font-bold  via-[#FC8929] to-[#FC8929]'>zapllo</span><span className='text-[#835CF1]'>.com
                    </span></h1>

            </div>

            <div className='flex justify-center '>
                <p className={`max-w-[1000px] text-center mx-4 text-balance md:mx-0 mt-4 md:text-lg leading-relaxed text-[#676B93] ${golos.className}`}>Maximize your Productivity 10X with Zapllo’s custom DYF automations for every businesses.<br /> Our <span className='text-white'>PARA 4.0, CORE 2.0, Ultimate Notion Brain Version 4.0 and Business OS </span>has helped around <span className='text-white'>6000+</span> businesses all around the world in getting their workflow streamlined and efficient. We insists on using a single application rather than using multiple application to <span className='text-white'>manage your business in one place.</span> </p>
            </div>
            <div className='flex -mt-8 justify-center'>
                <ShinyText />

            </div>
            <div className='flex justify-center'>
                <div className='grid grid-cols-2 gap-2 max-w-3xl w-full  text-xs -mt-12 mb-12'>
                    <div className='flex gap-2'>
                        <img src='tick.png' className='h-4' />
                        <h1>No Technical Expertise Required</h1>
                    </div>
                    <div className='flex gap-2'>
                        {/* <Check className='h-4' /> */}
                        <img src='tick.png' className='h-4' />

                        <h1>Proven Methods with 8+ years of Experience </h1>
                    </div>
                    <div className='flex gap-2'>
                        {/* <Check className='h-4' /> */}
                        <img src='tick.png' className='h-4' />

                        <h1>Without any expensive software/EPR/CRM</h1>
                    </div>
                    <div className='flex gap-2'>
                        {/* <Check className='h-4 ' /> */}
                        <img src='tick.png' className='h-4' />

                        <h1>Implemented by 3600+ businesses across 130+ countries</h1>
                    </div>
                </div>
            </div>
            {/* <div className='flex justify-center -mt-8 mb-12 '>
                <img src='ratings.png' className='md:h-14 h-7' />
            </div> */}
            <div className='relative flex -mt-40 md:mt-0  justify-center '>

                <VideoComponent />
            </div>
        </div>
    )
}
