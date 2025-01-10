'use client'

import RegistrationSuccess from '@/components/cards/onboardingSuccess'
import YouTubeEmbed from '@/components/cards/youtubeEmbed'
import React from 'react'

type Props = {}

export default function page({ }: Props) {
    return (
        <div className='bg-[#05071E] '>
            <RegistrationSuccess />
            <section className=' '>
            <p className=" text-2xl text-center text-gray-300">
                See{" "}
                <span className="text-green-400 font-medium">
                    What Results Clients Are Getting
                </span>{" "}
                From Implementing Our Strategies 👇
            </p>
                <YouTubeEmbed />
            </section>
        </div>
    )
}