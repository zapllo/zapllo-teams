import React from 'react'
import GradientText from '../magicui/gradient'

export default function GrowSubs() {
    return (
        <div className='text-center mx-4 md:mx-0 max-w-[1050px]'>
            <div>

            </div>
            <div className=' flex justify-center'>
                <div className='bg-[#2C325E] md:px-4 md:py-2 px-2 py-1 flex w-fit rounded-full'>
                    <GradientText>
                        <h1 className='text-center md:text-3xl text-xs font-bold bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent '>No Jargons. Just one KPI -

                        </h1>
                    </GradientText>
                    <div className='bg-[#12173E] rounded-full md:px-4 px-2 py-1 md:py-2'>
                        <span className='md:text-3xl text-xs font-bold bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent  '>
                            10X Productivity
                        </span>
                    </div>

                </div>
            </div>
            <h1 className='text-2xl mt-4 font-semibold text-white'>Automate and Upgrade your Worklfow</h1>
            <p className='text-sm mt-4'>On a mission to transform 1 million businesses and SME&apos;s around the globe with the power of Automaiton, Gen AI and Business Workflows</p>
            <div className='flex justify-center'>
                <img src='zapllo.png' className='md:h-48' />
            </div>
            {/* <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className=''>
                    <img src='rect.png' />
                    <h1 className='mt-4 text-3xl font-semibold '>Convert</h1>
                    <h2 className='mt-2'>Industries</h2>
                    <p className='text-xs mt-2'>Our custom opt-in pages captivate and convert audiences into engaged subscribers. Designed for optimal conversion, these visually engaging pages capture attention and inspire action, all while maintaining your brand unique identity for a cohesive user experience.</p>
                </div>
                <div className=''>
                    <img src='rect.png' />
                    <h1 className='mt-4 text-3xl font-semibold'>Capture</h1>
                    <h2 className='mt-2'>Subscriber Preferences</h2>
                    <p className='text-xs mt-2'>Effortlessly capture audience preferences during opt-in. Our AI intelligently curates content, enhancing subscriber relationships. Tailored content not only satisfies but also fortifies loyalty, ensuring heightened brand retention and allegiance.</p>
                </div>
                <div className=''>
                    <img src='rect.png' />
                    <h1 className='mt-4 text-3xl font-semibold '>Scale</h1>
                    <h2 className='mt-2'>Active Subscribers</h2>
                    <p className='text-xs mt-2'>Transform new subscribers into brand ambassadors with our referral incentives. Reward sharing, fueling organic growth and rapid newsletter expansion. Harness the conversion power of trusted, friend-referred subscribers.</p>
                </div>
            </div> */}
        </div>
    )
}
