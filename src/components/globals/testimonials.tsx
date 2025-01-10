import React from 'react'
import { LetsTalk } from '../ui/letstalk'

export default function Testimonials() {
    return (
        <>
            <div className="radial-gradient md:flex gap-4 max-w-[1300px]">
                <div className='p-4 max-w-[400px] w-full'>
                    <img src='testimonial1.svg' className='' />

                </div>
                <div className='p-4 max-w-[650px] w-full'>
                    <div className='flex justify-center md:block'>
                        <img src='star.png' className='' />

                    </div>
                    <h1 className='mt-4 md:text-3xl  text-3xl mx-4 md:mx-0 font-semibold md:font-bold'>Helped TTA with Product Management and Internal Workflow</h1>
                    <p className='text-sm mt-4 max-w-[300px] mx-4 md:mx-0 md:max-w-[700px]  w-full'>Our experience with Zapllo has been amazing so far. I highly recommend them to anyone who is facing issues in thier daily workflow and wants to automate or streamline it by any level. These guys are crazy when it comes to automating and integrating applications. I love how now my entire business and teamspace is organized and automated inside Notion</p>
                    <div className='mt-8 md:justify-start  md:absolute md:flex'>
                        <LetsTalk />

                    </div>z

                </div>

            </div>

        </>

    )
}
