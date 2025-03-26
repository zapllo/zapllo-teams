'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { Golos_Text } from 'next/font/google';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { ShinyText } from '@/components/ui/shinytext';
import VideoComponent from '@/components/globals/video';
import { MasterClass } from './Buttons/Masterclass';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const golos = Golos_Text({ subsets: ["latin"] });

export default function TasksHero() {
    return (
        <div className='bg-[#05071E] mt-14 relative overflow-hidden pt-12 pb-24'>
            {/* Background elements */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#815BF5]/10 rounded-full blur-3xl"></div>
            <div className="absolute top-60 -left-40 w-96 h-96 bg-[#FC8929]/10 rounded-full blur-3xl"></div>

            {/* Limited time offer badge */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="z-20 flex items-center justify-center mb-6"
            >
                <Badge variant="outline" className="py-2 px-4 border-[#815BF5] bg-[#0A0D28]/70 backdrop-blur-sm">
                    <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">  India&apos;s No.1 SaaS for MSMEs 🚀</span>
                    {/* <span className="ml-2">Get 60% Off Your First 3 Months!</span> */}
                </Badge>
            </motion.div>

            <div className="z-10 flex items-center justify-center">

                <span className={cn(`inline text-sm text-center md:text-lg text-muted-foreground`, golos.className)}>
                    Are you a Chief Followup Officer wasting 4 hours per day in delegating work & frustrated with delayed work?
                </span>

            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className='flex justify-center'
            >
                <h1 className='text-center text-4xl bg-clip-text md:text-6xl mt-4 mx-4 max-w-5xl'>
                    <span className='bg-gradient-to-r from-[#815BF5] bg-clip-text text-transparent font-bold to-[#FC8929]'>
                        Task Delegation App
                    </span>
                </h1>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className='flex justify-center'
            >
                <span className='mt-4 text-center md:text-5xl text-xl font-bold'>
                    Manage your Team in just 10 mins a day
                </span>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className='flex justify-center'
            >
                <p className={`max-w-[700px] text-center mx-4 text-sm md:mx-0 mt-6 md:text-md leading-relaxed text-muted-foreground ${golos.className}`}>
                    Effortless Task Delegation, Automated WhatsApp reminders & Realtime Department & Employee Performance Reports
                </p>
            </motion.div>

            {/* Key benefits */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className='flex justify-center mt-8 mb-10'
            >
                <div className="flex flex-wrap justify-center gap-4 mx-4">
                    {[
                        { icon: <CheckCircle2 className="h-4 w-4 text-green-400" />, text: "Save 4 hrs daily" },
                        { icon: <CheckCircle2 className="h-4 w-4 text-green-400" />, text: "10X Team Productivity" },
                        { icon: <CheckCircle2 className="h-4 w-4 text-green-400" />, text: "No More Follow-ups" }
                    ].map((item, i) => (
                        <Badge key={i} variant="secondary" className="py-2 px-3 bg-[#1A1E48]/50 border-[#815BF5]/30">
                            {item.icon}
                            <span className="ml-1">{item.text}</span>
                        </Badge>
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className='flex justify-center'
            >
                <div className="flex flex-col sm:flex-row gap-4 z-20">
                    {/* <MasterClass /> */}
                    <Link href='/signup'>
                        <Button variant="outline" size="lg" className="text-[#815BF5] border-[#815BF5] hover:bg-[#815BF5]/10 rounded-full">
                            Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className='relative flex mt-8 justify-center'
            >
                <div className="relative w-full max-w-5xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 rounded-xl blur-md"></div>
                    <Card className="border  border-[#815BF5]/20 bg-[#0A0D28]/50 backdrop-blur-sm overflow-hidden rounded-xl shadow-2xl">
                        <VideoComponent />
                    </Card>

                    {/* Live users indicator */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-[#1A1E48] border border-[#815BF5]/30 px-4 py-2 rounded-full shadow-lg">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-nowrap text-xs md:text-sm font-medium">247 business owners using it right now</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className='flex justify-center mt-16'
            >
                <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">TRUSTED BY 20,000+ GROWING BUSINESSES</p>
                    <img src='/ratings.png' className='md:h-10 h-6 mx-auto' alt="Customer ratings" />
                </div>
            </motion.div>
        </div>
    )
}