import React from 'react'
import NumberTicker from '../magicui/number-ticker'
import AnimatedShinyDiv from '../magicui/animated-shiny-div'

export default function OfficialPartners() {
    return (
        <div className=''>
            <div>
                <AnimatedShinyDiv className='bg-gradient-to-r from-[#815BF5] px-12 py-6 md:rounded-2xl  to-[#FC8929] grid lg:grid-cols-2 grid-cols-1 z-10 max-w-[1200px] gap-4  '>
                    <h1 className='text-4xl font-semibold mt-4'>Official Business Partners</h1>
                    <div className='grid grid-cols-3 gap-2 md:ml-auto'>
                        <div>
                            <img src='blackrec.png' className='h-20 md:ml-auto' />
                            <img src='notionsvg.png' className='absolute h-12 -mt-16 ml-4' />
                        </div>
                        <div>
                            <img src='blackrec.png' className='h-20 md:ml-auto' />
                            <img src='slacksvg.png' className='absolute h-12 -mt-16 ml-4' />
                        </div>
                        <div>
                            <img src='blackrec.png' className='h-20 md:ml-auto' />
                            <img src='zapier.png' className='absolute h-5 -mt-12 ml-1' />
                        </div>
                    </div>

                </AnimatedShinyDiv>
            </div>
            <div className='flex justify-center'>
                <div className='text-6xl max-w-[1100px] mt-16 grid grid-cols-1  gap-6 md:grid-cols-3'>
                    <div className=''>
                        <NumberTicker value={50} />
                        <h1 className='text-2xl font-semibold '>Industries</h1>
                        <p className='text-[#676B93] mt-4 font-normal text-sm'>We have experience of working <br />with multiple businesses which puts us<br /> in the position to guide you the best.</p>
                    </div>
                    <div>
                        <NumberTicker value={120} />
                        <h1 className='text-2xl font-semibold '>Countries</h1>
                        <p className='text-[#676B93] mt-4 font-normal text-sm'>We have worked with clients all <br />all over the world with footprints<br /> in almost every kind of business.</p>
                    </div>  <div>
                        {/* <NumberTicker value={1500000} /> */}
                        <NumberTicker value={1.50} />

                        <h1 className='inline-block tabular-nums text-transparent bg-gradient-to-r font-bold from-[#815BF5]  py-6 rounded-2xl  to-[#FC8929] bg-clip-text '>M+</h1>
                        <h1 className='text-2xl font-semibold '>Operations Monthly</h1>
                        <p className='text-[#676B93] mt-4 font-normal text-sm'>We are proud to state that we handle <br />more than 1.5 million operations for our clients<br />globally.</p>
                    </div>

                </div>
            </div>
        </div>
    )
}
