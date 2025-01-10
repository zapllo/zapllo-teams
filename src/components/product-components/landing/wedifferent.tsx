import React from 'react'

type Props = {}

export default function WeDifferent({ }: Props) {
    return (
        <div className='justify-center mx-12 mt-4 flex '>
            <div className='mb-4 0 '>
                <div className='flex justify-center   w-full'>
                    <h1 className='text-center  text-3xl font-bold md:max-w-xl'><span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent '>
                        India&apos;s No.1 SaaS for MSMEs
                        <span className='text-white ml-1'>
                            🚀
                        </span>
                    </span> </h1>
                </div>
                <h1 className=' text-center  text-3xl font-bold mt-4'>
                    Why are we Different ?
                </h1>
                <div className='md:flex  gap-2 justify-center items-center md:mx-20 md:-mt-12 mt-12 md:max-w-5xl  max-w-7xl w-full sm:w-full  2xl:-mt-20 '>
                    <div className='grid grid-cols-1  gap-12 items-center justify-center'>
                        <div className=''>
                            <img src='/product/icons/leavetype.png' className='h-12' />
                            <p className='max-w- font-bold mt-2 text-lg w-full'>Login to All Apps</p>
                            <p className='text-sm max-w-lg mt-2 text-[#676B93]'>
                                Control all applications from a single, user-friendly interface, eliminating the need to switch between multiple tools
                            </p>
                        </div>
                        <div className=''>
                        <img src='/product/icons/setup.png' className='h-12' />
                            <p className='max-w- font-bold mt-2 text-lg w-full'>No Technical Skills Required</p>
                            <p className='text-sm max-w-lg mt-2 text-[#676B93]'>
                                You can manage all your business processes and automations with easy drags and clicks. No tech expertise required.
                            </p>
                        </div>
                      
                    </div>
                    <div className='w-full h-full  2xl:scale-125 scale-150 rounded-xl'>
                        <img src='/product/benefits.png' className='rounded-xl object-cover h-full w-full' />
                    </div>
                    <div className='grid grid-cols-1 gap-12 items-center justify-center'>
                    <div className=''>
                    <img src='/product/icons/wifi.png' className='h-12' />
                            <p className='max-w- font-bold mt-2 text-lg w-full'>24*7 Support</p>
                            <p className='text-sm max-w-lg mt-2 text-[#676B93]'>
                            Get assistance in real time 24x7 whether related to app usage, billiing or guidance.
                            </p>
                        </div>
                        <div className=''>
                        <img src='/product/icons/records.png' className='h-12' />
                            <p className='max-w- font-bold mt-2 text-lg w-full'>Access To Business Owners Community</p>
                            <p className='text-sm max-w-lg mt-2 text-[#676B93]'>
                            Connect with thousands of like-minded business owners who are also on a journey towards growth. Learn together and grow together.
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

    )
}