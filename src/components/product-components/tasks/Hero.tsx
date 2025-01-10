
import React, { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Golos_Text } from 'next/font/google';
import Image from 'next/image';
import { Check } from 'lucide-react';
import Link from 'next/link';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { ShinyText } from '@/components/ui/shinytext';
import VideoComponent from '@/components/globals/video';
import { MasterClass } from './Buttons/Masterclass';

const golos = Golos_Text({ subsets: ["latin"] });


export default function TasksHero() {

    return (
        <div className='bg-[#05071E] '>
            <div className="z-10 flex items-center justify-center">
                <AnimatedGradientText>

                    <span
                        className={cn(
                            `inline animate- text-sm text-center md:text-lg text-muted-foreground`,
                        )}
                    >
                        Are you a Chief Followup Officer wasting 4 hours per day in delegating work & frustrated with delayed work?
                    </span>
                </AnimatedGradientText>

            </div>
            <div className='flex justify-center'>
                <h1 className='text-center text-4xl  bg-clip-text    md:text-5xl   mt-4   mx-4 max-w-5xl'><span className='bg-gradient-to-r from-[#815BF5] bg-clip-text text-transparent font-semibold   to-[#FC8929]'>Task Delegation App <br />
                </span>

                </h1>
            </div>
            <div className='flex justify-center'>
                <span className='mt-4 text-center md:text-4xl text-xl'>  Manage your Team in just 10 mins a day </span>
            </div>
            <div className='flex justify-center '>
                <p className={`max-w-[700px] text-center mx-4 text-xs  md:mx-0 mt-4 md:text-md leading-relaxed text-muted-foreground ${golos.className}`}>Effortless Task Delegation, Automated WhatsApp reminders Realtime Department & Employee Performance Reports 
                </p>
            </div>
            <div className='flex -mt-8 justify-center'>
                <MasterClass />
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
