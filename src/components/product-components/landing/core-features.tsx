import React from 'react'


type Props = {}

export default function CoreFeatures({ }: Props) {
    return (
        <div className='w-full flex justify-center'>
            <div className='mb-16 max-w-5xl w-full  '>
                <div className='flex justify-center'>
                    <h1 className='text-center  text-3xl font-bold md:max-w-xl'><span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent '>
                        Core Features
                    </span> </h1>
                </div>
                <h1 className='font-bold text-center mb-4 text-3xl mt-4'>
                    Powerful Solutions to Simplify your workflow
                </h1>
                <div className='grid md:grid-cols-2 max-w-5xl   gap-4'>
                    <div className=' h-[648px] hidden md:block rounded-xl'>
                        <img src='/landing/mockup4.png' className='rounded-xl h-full scale-90 md:scale-100 object-cover' />
                    </div>
                    <div className='md:mt-32 mt-12 mx-12 md:mx-0 rounded-xl'>
                        <h1 className='text-3xl font-bold'>Streamlined Business Processes</h1>
                        <div className='flex gap-4 mt-4 items-center'>
                            <img src='/product/icons/assigned.png' className='h-12 ' />
                            <h1 className='text-xl font-bold'>
                                Say Goodbye to Manual Tasks and Inefficiencies
                            </h1>
                        </div>
                        <p className='text-[#676B93] mt-4 text-sm'>
                            Eliminate time consuming manual processes, freeing up valuable resources streamlining operations.
                        </p>
                        <div className='flex gap-4 mt-4 items-center'>
                            <img src='/product/icons/time.png' className='h-12 ' />
                            <h1 className='text-xl font-bold'>
                                Automate repetitive processes for seamless operations
                            </h1>
                        </div>
                        <p className='text-[#676B93] mt-4 text-sm'>
                            Ensure smooth operations by optimizing efficiency allowing your team to focus on strategic objectives.
                        </p>

                    </div>
                    <div className=' h-[648px] md:hidden relative rounded-xl'>
                        <img src='/landing/mockup4.png' className='rounded-xl h-full scale-90 md:scale-100 object-cover' />
                    </div>
                </div>
                <div className='grid md:grid-cols-2 max-w-5xl   gap-4'>
                    <div className='mt-20 mx-12 md:mx-0 rounded-xl'>
                        <h1 className='text-3xl font-bold'>Integrated Communication</h1>
                        <div className='flex gap-4 mt-4 items-center'>
                            <img src='/product/icons/assigned.png' className='h-12 ' />
                            <h1 className='text-xl font-bold'>
                                Share Notifications Easily
                            </h1>
                        </div>
                        <p className='text- text-[#676B93] mt-4 text-sm'>
                            Effortlessly share notifications, reminders, and follow-ups from our app to WhatsApp and email.
                        </p>
                        <div className='flex gap-4 mt-4 items-center'>
                            <img src='/product/icons/time.png' className='h-12 ' />
                            <h1 className='text-xl font-bold'>
                                Enhanced Connectivity
                            </h1>
                        </div>
                        <p className='tex text-[#676B93] mt-4 text-sm'>
                            Maximize connectivity with clients and team by synchronizing WhatsApp and email features with our apps.
                        </p>


                    </div>
                    <div className='h-full w-full relative rounded-xl'>
                        <img src='/landing/mockup5.png' className='rounded-xl h-full w-full scale-110 md:scale-125 object-cover' />
                    </div>
                </div>
                <div className='grid md:grid-cols-2 max-w-5xl   gap-4'>
                    <div className='h-full md:h-[648px] -ml-14 hidden md:block rounded-xl'>
                        <img src='/landing/mockup6.png' className='rounded-xl h-full w-full object-cover' />
                    </div>
                    <div className='md:mt-24 mx-12 md:mx-0 rounded-xl'>
                        <h1 className='text-3xl font-bold'>Business Analytics - Real time Dashboards                        </h1>
                        <div className='flex gap-4  mt-4 items-center'>
                            <img src='/product/icons/bell.png' className='h-12 ' />
                            <h1 className='text-xl font-bold'>
                                Make informed Decisions
                            </h1>
                        </div>
                        <p className='te text-[#676B93] mt-4 text-sm'>
                            Real-time dashboards provide immediate access to crucial business metrics, facilitating rapid decision-making
                        </p>
                        <div className='flex gap-4 mt-4 items-center'>
                            <img src='/product/icons/time.png' className='h-12 ' />
                            <h1 className='text-xl font-bold'>
                            Dynamic Data Visualization
                            </h1>
                        </div>
                        <p className='text-[#676B93] mt-4 text-sm'>
                        Real-time dashboards offer dynamic visualization tools for exploring data deeply
                        </p>
                     
                    </div>
                    <div className='h-full md:h-[648px] -ml-14 md:hidden block rounded-xl'>
                        <img src='/landing/mockup6.png' className='rounded-xl h-full w-full object-cover' />
                    </div>

                </div>
            

            </div>

        </div>
    )
};