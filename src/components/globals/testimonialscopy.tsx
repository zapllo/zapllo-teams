import React from 'react'
import { LetsTalk } from '../ui/letstalk'

export default function TestimonialsCopy() {
    return (
        <>
            <div className="radial-gradient md:flex gap-4 max-w-[1300px]">
                <div className='p-4 max-w-[400px] w-full'>
                    <img src='Ben.png' className='' />

                </div>
                <div className='p-4 max-w-[650px] w-full'>
                    <div className='flex justify-center md:block'>
                        <img src='star.png' className='' />

                    </div>
                    <h1 className='mt-4 md:text-3xl  text-3xl mx-4 md:mx-0 font-semibold md:font-bold'>How BeSpokeMedia saved hours daily on Content Creation</h1>
                    <p className='text-sm mt-4 max-w-[300px] mx-4 md:mx-0 md:max-w-[700px]  w-full'>Zapllo has been one of the best companies we have partnered with so far. Their level of commitment and delivery is 10 on 10. Highly recommended. Deep and is team has built some crazy systems which is really cool and helping us a lot more than we have ever imagined.</p>
                    <div className='mt-8 md:justify-start  md:absolute md:flex'>
                        <LetsTalk />

                    </div>

                </div>

            </div>

        </>

    )
}
