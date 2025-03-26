'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { Golos_Text } from 'next/font/google';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// import { SparklesCore } from '@/components/ui/sparkles';
import VideoComponent from '@/components/globals/video';

const golos = Golos_Text({ subsets: ["latin"] });

export default function PayrollHero() {
    return (
        <div className='relative w-full mt-14 overflow-hidden bg-[#05071E] pt-16 pb-24'>
            {/* Background effects */}
            {/* <div className="absolute inset-0 w-full h-full">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={70}
                    className="w-full h-full"
                    particleColor="#815BF5"
                />
            </div> */}
            
            <div className="absolute top-20 -left-64 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
            <div className="absolute bottom-20 -right-64 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
            
            <div className='max-w-7xl mx-auto px-4 sm:px-6 relative z-10'>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-6"
                >
                    <span className="inline-flex items-center rounded-full bg-purple-100/10 px-4 py-1.5 text-sm font-medium text-purple-300 ring-1 ring-inset ring-purple-400/20 mb-6">
                        <span className="animate-pulse mr-2">🔥</span>
                        Are you frustrated with employees taking random leaves and showing up late?
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-center mb-8"
                >
                    <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight mb-4'>
                        <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#815BF5] to-[#FC8929]'>
                            Leave & Attendance Tracker
                        </span>
                        <br />
                        <span className="text-white">That Actually Works</span>
                    </h1>
                    
                    <p className={`max-w-2xl mx-auto text-xl text-gray-400 ${golos.className}`}>
                        Seamless attendance with facial recognition, automated notifications, and effortless leave management — all in one powerful app.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                >
                    <Link href='https://masterclass.zapllo.com/workshop/'>
                        <Button size="lg" className="relative group px-8 py-6 bg-gradient-to-r from-[#815BF5] to-[#FC8929] rounded-full text-lg font-medium transition-all duration-300 hover:shadow-[0_0_40px_rgba(129,91,245,0.5)]">
                            <span className="mr-2">Join Free Masterclass</span>
                            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">LIVE</span>
                        </Button>
                    </Link>
                    
                    <Link href='/signup'>
                        <Button variant="outline" size="lg" className="px-8 py-6 rounded-full border-2 border-[#815BF5]/30 hover:border-[#815BF5] bg-[#05071E]/80 text-lg font-medium transition-all duration-300">
                            Start Free Trial
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="relative mx-auto max-w-5xl"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#815BF5] to-[#FC8929] rounded-xl blur opacity-30"></div>
                    <div className="relative bg-[#0A0D28] rounded-xl overflow-hidden shadow-2xl">
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        </div>
                        <VideoComponent />
                        
                        <div className="absolute -bottom-1 -left-1 transform rotate-12 bg-purple-500/20 blur-2xl w-20 h-20 rounded-full"></div>
                        <div className="absolute -bottom-1 -right-1 transform -rotate-12 bg-orange-500/20 blur-2xl w-20 h-20 rounded-full"></div>
                    </div>
                    
                    <div className="flex justify-center mt-6">
                        <div className="flex items-center bg-[#0A0D28]/80 rounded-full px-4 py-2 border border-purple-500/20">
                            <div className="flex -space-x-2 mr-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold border-2 border-[#0A0D28]">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-gray-300">
                                <span className="font-bold text-white">237+ businesses</span> switched to Zapllo this month
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}