import React from 'react'
import { TestimonialCards } from './testimonialscards'
import GradientText from '../magicui/gradient'

export default function Testimonials2() {
    return (

        <div>
            <GradientText>
                <h1 className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent text-center font-bold text-3xl'>What our Customers Say</h1>
            </GradientText>
            <h1 className='text-4xl font-semibold mt-4 text-center'>Client Testimonials</h1>
            <TestimonialCards />
        </div>
    )
}
