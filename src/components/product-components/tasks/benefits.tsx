import React from 'react'

type Props = {}

export default function Benefits({ }: Props) {
    return (
        <div className='justify-center mx-12 mt-24 flex '>
            <div className='mb-4 0 '>
                <div className='flex justify-center   w-full'>
                    <h1 className='text-center  text-3xl font-bold md:max-w-xl'><span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent '>
                        India&apos;s No.1 SaaS for MSMEs
                        <span className='text-white ml-1'>
                            🚀
                        </span>
                    </span> </h1>
                </div>
                <h1 className=' text-center  md:text-3xl font-bold mt-4'>
                    Benefits Of Using Task Delegation App
                </h1>
                <div className='md:flex gap-2 justify-center items-center md:mx-20 md:-mt-12 mt-12  2xl:-mt-36 '>
                    <div className='grid grid-cols-1  gap-12 items-center justify-center'>
                        <div className=''>
                            <img src='/product/icons/calendar.png' className='h-12' />
                            <p className='max-w- w-full'>Save time with seamless integration and automation</p>
                        </div>
                        <div className=''>
                            <img src='/product/icons/track.png' className='h-12' />
                            <p className='max-w- w-full'>Increase employee
                                satisfaction</p>
                        </div>
                        <div className=''>
                            <img src='/product/icons/wifi.png' className='h-12' />
                            <p className='max-w- w-full'>Access tasks from any internet-enabled device</p>
                        </div>
                    </div>
                    <div className='w-full h-full  2xl:scale-125 scale-150 rounded-xl'>
                        <img src='/product/taskapp.png' className='rounded-xl object-cover h-full w-full' />
                    </div>
                    <div className='grid grid-cols-1 gap-12 items-center justify-center'>
                        <div className=''>
                            <img src='/product/icons/records.png' className='h-12' />
                            <p className='max-w- w-full'>Stay organized and focused on what matters most</p>
                        </div>
                        <div className=''>
                            <img src='/product/icons/savetime.png' className='h-12' />
                            <p className='max-w- w-full'>Increase productivity by IOX</p>
                        </div>
                        <div className=''>
                            <img src='/product/icons/savetimedone.png' className='h-12' />
                            <p className='max-w- w-full'>Reduce stress and meet deadlines consistently</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}