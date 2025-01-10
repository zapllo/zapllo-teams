
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


export default function PayrollHero() {

    return (
        <div className='md:flex justify-center w-full mx-auto md:ml-0  '>
            <div className='bg-[#05071E] '>
                <div className="z-10 flex items-center w-full justify-">
                    <AnimatedGradientText>

                        <span
                            className={cn(
                                `inline animate- text-md  text-center md:text-xl  text-muted-foreground`,
                            )}
                        >
                            Are you frustrated with employees taking random leaves, coming in late & going early? Then, you&apos;re at the right place!
                        </span>
                    </AnimatedGradientText>

                </div>
                <div className='flex justify-center'>
                    <h1 className='text-center text-xl  bg-clip-text    md:text-5xl mt-4   mx-4 max-w-5xl'><span className='bg-gradient-to-r from-[#815BF5] bg-clip-text text-transparent font-semibold   to-[#FC8929]'>Leave & Attendance Tracker
                    </span> - Staff Management Made Easy</h1>

                </div>

                <div className='flex justify-center '>
                    <p className={`max-w-[1000px] text-center mx-4 text-balance md:mx-0 mt-4 md:text-lg leading-relaxed text-muted-foreground ${golos.className}`}>Seamless attendance marking with Facial Recognition & automatic Location capturing. Effortless leave application process and
                        automated WhatsApp notifications.</p>
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
        </div>
    )
}
