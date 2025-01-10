import React from 'react'
import { AnimatedFeatures } from './features-animated'
import { OrbitingCirclesDemo } from './orbits'
import { TypewriterEffectSmooth } from '../ui/typewriter-effect'
import { TextGenerateEffect } from '../ui/text-generate-effect';
import { FlipWordsDemo } from './flip-words';

export default function Features() {

    return (
        <div className='grid grid-cols-1 md:grid-cols-2  gap-8 mt-24 max-w-[1100px] '>
            <div className='md:w-[130%]'>
                {/* <h1 className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent font-bold text-4xl'>Key Features</h1> */}
                <FlipWordsDemo />
                <p className='mt-4 text-[#ffffff] text-start mx-4 md:mx-0'>
                    <span className='text-lg font-bold'>
                        🚀 Supercharge your workflow with Zapllo !
                    </span>
                    <div className='ml-4 mt-4 space-y-2 text-sm'>

                        <li>Get your Business Automation Score via our unique Business Health Check-Up</li>

                        <li>Discover the true potential of Notion the Secret Weapon for SME industry !</li>
                        <li>How to Automate Any Business Process using Zapier, Make.com, cPanel & WhatsApp in less than <span className='ml-5'>30 minutes</span> </li>
                        <li>Business Automation Checklist - tools and systems you need to build a business that works <span className='ml-5'>without you</span></li>
                        <li>What can you do with the help of WhatsApp automation?</li>
                        <li>How to start your Business Automation journey to automate everything in less than 2 weeks ?</li>
                    </div>
                </p>
                {/* <TypewriterEffectSmooth words={words} /> */}

            </div>
            <OrbitingCirclesDemo />

        </div>
    )
}
