"use client"

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import GradientText from '../magicui/gradient';
import { BookCall } from '../ui/bookcall';

export default function TeamBubble() {
    const containerVariants = {
        hidden: { scale: 0.6 },
        visible: {
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeInOut"
            }
        }
    };

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div className="text-center md:block hidden mb-4" ref={ref}>
            <GradientText>
                <h1 className="gradient-text text-center font-bold -ml-4 text-5xl">
                    ZAPLLONIANS
                </h1>
            </GradientText>
            {/* <div>
                <h1 className="text-5xl font-semibold text-center -ml-4 mt-4">
                    Meet Our Team
                </h1>
            </div> */}
            <div className='flex justify-center max-w-7xl  w-full'>
                <motion.div className='  w-full mt-12 ' >
                    {/* <motion.div className='mt-28' initial="hidden" animate={isInView ? "visible" : "hidden"} variants={containerVariants}>
                        <div className='ml-36'>
                            <img src='/Ketan.png' className='h-44 w-auto' />
                            <h1 className='bg-white px-2 w-fit text-black rounded-full ml-10 mt-2'>🎨 Ketan</h1>
                        </div>
                        <div className='ml-16 mt-12'>
                            <img src='/Jas.png' className='h-44 w-auto' />
                            <h1 className='bg-white px-2 ml-4 w-fit text-black rounded-full mt-2'>⚙️ Jaswinder</h1>
                        </div>
                        <div className='-ml-4 mt-12'>
                            <img src='/avatar.png' className='h-44 w-auto' />
                            <h1 className='bg-white px-2 ml-12 w-fit text-black rounded-full mt-2'>⚙️ Avatar</h1>
                        </div>
                    </motion.div> */}
                    <div className='  r'>
                        {/* <motion.div className='ml-44' initial="hidden" animate={isInView ? "visible" : "hidden"} variants={containerVariants}>
                            <img src='/Deep3.png' className='h-44' />
                            <h1 className='bg-white px-2 w-fit ml-4 text-black rounded-full mt-2'>🧠 Shubhodeep</h1>
                        </motion.div> */}
                        <div className='mt-'>
                            <h1 className=' mb-8 text-3xl font-bold'>We are Human Too.</h1>
                            <p className='mt-4 text-sm text-center w-[700px]'>Automate and Upgrade your Workflow encapsulates the idea of enhancing efficiency by implementing automated processes while simultaneously improving the quality or effectiveness of your workflow.</p>
                            {/* <p className='mt-4 text-sm '>Automate and Upgrade your Workflow encapsulates the idea of enhancing efficiency by implementing automated processes while simultaneously improving the quality or effectiveness of your workflow.</p> */}
                        </div>
                        <div className='grid grid-cols-2 ml-12 mt-12 gap-4'>
                            <div className='bg-white w-64 h-10 text-black rounded-md'>
                                <div className='flex justify- gap-2'>
                                    <h1 className='mt-2 ml-7'>🧠</h1>
                                    <h1 className='text-sm mt-2 font-bold'>AI Automated Newsletter</h1>
                                </div>
                            </div>
                            <div className='bg-white w-64 h-10 text-black rounded-md'>
                                <div className='flex gap-2'>
                                    <h1 className='mt-2 ml-8'>💌</h1>
                                    <h1 className='text-sm mt-2 font-bold'>40-60% Open Rate</h1>
                                </div>
                            </div>
                            <div className='bg-white w-64 h-10 text-black rounded-md'>
                                <div className='flex gap-2'>
                                    <h1 className='mt-2 ml-7'>👍</h1>
                                    <h1 className='text-sm mt-2 font-bold'>Effortless Engagement</h1>
                                </div>
                            </div>
                            <div className='bg-white w-64 h-10 text-black rounded-md'>
                                <div className='flex gap-2'>
                                    <h1 className='mt-1 ml-8'>💵</h1>
                                    <h1 className='text-sm mt-2 font-bold'>Increase Your Revenue</h1>
                                </div>
                            </div>
                        </div>
                        <div className='mt-12 absolute mb-12 ml-32 gap-10 flex'>
                            <BookCall />
                            <h1 className='mt-2 text-[18px] text-center font-bold'> 👈 Upgrade your Workflow </h1>
                        </div>
                    </div>
                    {/* <motion.div className='mt-28' initial="hidden" animate={isInView ? "visible" : "hidden"} variants={containerVariants}>
                        <div className='ml-16'>
                            <img src='/Satish.png' className='h-44' />
                            <h1 className='bg-white px-2 w-fit ml-12 text-black rounded-full mt-2'>🚀 Ranit</h1>
                        </div>
                        <div className='ml-36 mt-12'>
                            <img src='/Jas.png' className='h-44' />
                            <h1 className='bg-white px-2 w-fit ml-6 text-black rounded-full mt-2'>⚙️ Jaswinder</h1>
                        </div>
                        <div className='mt-12 ml-56'>
                            <img src='/Aditya1.png' className='h-44' />
                            <h1 className='bg-white px-2 w-fit ml-6 text-black rounded-full mt-2'>⚙️ Aditya</h1>
                        </div>
                    </motion.div> */}
                </motion.div>
            </div>
        </div>
    );
}
