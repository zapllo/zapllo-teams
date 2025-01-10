import React from 'react'

type Props = {}

export default function Benefits({ }: Props) {
    return (
        <div className='justify-center mx-12 mt-12 flex '>
            <div className='mb-4 mt-20 '>
                <div className='flex justify-center   w-full'>
                    <h1 className='text-center  text-2xl font-bold md:max-w-xl'><span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent '>
                        India&apos;s No.1 SaaS for MSMEs
                        <span className='text-white ml-1'>
                            🚀
                        </span>
                    </span> </h1>
                </div>
                <h1 className='font-bold text-center mb-4 md:text-3xl mt-4'>
                    Benefits Of Using Leave & Attendance Tracker App
                </h1>
                <div className='md:flex gap-2 justify-center mt-12 md:mt-0 items-center md:mx-20   '>
                    <div className='grid grid-cols-1  gap-12 items-center justify-center'>
                        <div className=''>
                            <img src='/product/icons/calendar.png' className='h-12' />
                            <p className='max-w- w-full'>Attendance can be marked from anywhere, any device</p>
                        </div>
                        <div className=''>
                            <img src='/product/icons/track.png' className='h-12' />
                            <p className='max-w- w-full'>Track/enhance employee&apos;s productivity</p>
                        </div>
                        <div className=''>
                            <img src='/product/icons/graph.png' className='h-12' />
                            <p className='max-w- w-full'>Improve company&apos;s productivity by tracking each employee&apos;s performance</p>
                        </div>
                    </div>
                    <div className='w-full h-full scale-150 rounded-xl'>
                        <img src='/product/benefits.png' className='rounded-xl object-cover h-full w-full' />
                    </div>
                    <div className='grid grid-cols-1 gap-12 items-center justify-center'>
                        <div className=''>
                            <img src='/product/icons/records.png' className='h-12' />
                            <p className='max-w- w-full'>Provide team for leave and attendance records.</p>
                        </div>
                        <div className=''>
                            <img src='/product/icons/savetime.png' className='h-12' />
                            <p className='max-w- w-full'>Save time by applying leaves online & get it approved</p>
                        </div>
                        <div className=''>
                            <img src='/product/icons/track2.png' className='h-12' />
                            <p className='max-w- w-full'>Improve company&apos;s productivity
                                by tracking each employee&apos;s
                                performance</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}