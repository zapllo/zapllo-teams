import React from 'react'
import { BookCall } from '../ui/bookcall'

export default function OurTeam() {
    return (
        <>
            <div className='text-center md:block hidden mb-40'>
                <h1 className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent text-center font-bold -ml-4 text-2xl'>ZAPLLONIANS</h1>
                <h1 className='text-5xl font-semibold text-center -ml-4 mt-4'>Meet Our Team</h1>
                <div className='justify-center mt-6 flex'>
                    <div className='rounded-full bg-[#0A0D28] mt-4   -ml-12 h-32 w-32'>
                        <img src='/Aditya1.png' className='' />
                        <h1>👨🏻‍💻 Aditya</h1>
                        <h1 className='mt-12 font-bold -ml-24 absolute text-4xl'>We are Human Too.</h1>
                        <p className='absolute mt-24 -ml-48 text-sm w-[500px]'>Zapllo is a dedicated team of hands-on builders, specializing in empowering visionary business owners, leading brands, and SMEs to leverage automation, seamless workflows, and generative AI. Our solutions drive 10X productivity, allowing you to focus on strategic tasks rather than repetitive ones. Let us help you achieve unparalleled efficiency and growth.</p>
                        <p className='absolute mt-56 -ml-48 text-sm w-[500px]'>We are on a mission to transform and automate 1 million busineeses with our tools, techniques and  strategies. We believe the best outcomes are created through both human, artificial intelligence & automation, unlocking the precision of Zapllo for care of real humans</p>
                        <div className='grid absolute mt-72 -ml-48 grid-cols-2 gap-4'>
                            {/* <div className='bg-white rounded-lg text-black px-4 py-2'>🧠 AI Automated Newsletter </div>
                            <div className='bg-white rounded-lg text-black px-4 py-2'> </div>
                            <div className='bg-white rounded-lg text-black px-4 py-2'> Effortless Engagement </div>
                            <div className='bg-white rounded-lg text-black px-4 py-2'>💵 Increase your Revenue </div> */}
                            <img src='cta1.png' className='h-10' />
                            <img src='cta2.png' className='h-10' />
                            <img src='cta3.png' className='h-10' />
                            <img src='cta4.png' className='h-10' />

                        </div>
                        <div className='absolute mt-[32%]  -ml-[14%] gap- grid grid-cols-2  '>
                            <BookCall />
                            <h1 className='mt-3 text-sm'>👈 Upgrade your Workflow</h1>
                        </div>
                    </div>

                </div>
                <div className='flex justify-between w-[900px] '>
                    <div className='rounded-full bg-[#0A0D28] mt-4  h-32 w-32'>
                        <img src='/Jas.png' className='' />
                        <h1>⚙️ Jaswinder</h1>
                    </div>
                    <div>
                        <img src='/Deep3.png' className='h-36' />
                        <h1>🧠 Shubhodeep</h1>

                    </div>
                    {/* <h1>We're Human Too</h1> */}
                </div>
                <div className='flex justify-between mt-8 ml-12 w-[900px] '>    
                    <div className='rounded-full bg-[#0A0D28] mt-4 -ml-28  h-32 w-32'>
                        <img src='/Ketan.png' className='' />
                        <h1>🎨 Ketan</h1>
                    </div>
                    <div className=''>
                        <img src='Satish.png' className='h-36' />
                        <h1>🚀 Ranit</h1>


                    </div>
                    {/* <h1>We're Human Too</h1> */}
                </div>
                <div className='flex justify-between -ml-96 gap-12'>
                    {/* <h1>We're Human Too</h1> */}
                </div>
            </div>
            <div className='block md:hidden '>
                <h1 className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent text-center font-bold text-3xl'>Our Staff</h1>
                <h1 className='text-4xl font-semibold text-center mt-4'>Meet Our Team</h1>
                <div className='flex justify-center mt-4'>
                    <div className='grid grid-cols-1 gap-12 text-center'>
                        <div className='rounded-full bg-[#0A0D28] mt-4 ml-8  h-32 w-32'>
                            <img src='/Deep.png' className='' />
                            <h1>💎 Shubhodeep</h1>
                        </div>
                        <div className=''>
                            <img src='/Deep.png' className='h-36 mt-4' />
                            <h1>💎 Shubhodeep</h1>
                        </div>
                        <div>
                            <img src='/Deep.png' className='h-36' />
                            <h1 className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] rounded-2xl text-white w-fit px-4 ml-6 text-center font-bold text-lg'>💎 Deep</h1>
                        </div>
                    </div>

                </div>
                <h1 className='mt-12 font-bold text-center text-4xl'>We are Human Too.</h1>
                <p className=' text-center mt-6  text-sm mx-4'>Automate and Upgrade your Workflow encapsulates the idea of enhancing efficiency by implementing automated processes while simultaneously improving the quality or effectiveness of your workflow.</p>
                <p className=' mt-4 text-sm text-center mx-4'>Automate and Upgrade your Workflow encapsulates the idea of enhancing efficiency by implementing automated processes while simultaneously improving the quality or effectiveness of your workflow.</p>
                <div className='flex justify-center'>

                    <div className='grid  mt-6 grid-cols-1 gap-4'>
                        <div className='bg-white flex justify-between  rounded-md font-bold text-black px-12 py-3'>
                            🧠 AI Automated Newsletter
                        </div>
                        <div className='bg-white flex justify-between  rounded-md font-bold text-black px-12 py-3'>💌 40-60% Open Rate </div>
                        <div className='bg-white flex justify-between  rounded-md font-bold text-black px-12 py-3'>👍 Effortless Engagement </div>
                        <div className='bg-white flex justify-between  rounded-md font-bold text-black px-12 py-3'>💵 Increase your Revenue </div>
                        <div className='mt-4'>
                            <BookCall />
                            <h1 className='mt-8 text-center font-bold '> 👈 Upgrade your Workflow </h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
