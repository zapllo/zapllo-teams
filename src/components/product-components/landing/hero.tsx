'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { Golos_Text } from 'next/font/google';
import Link from 'next/link';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import VideoComponent from '@/components/globals/video';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronRight, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { motion } from 'framer-motion';

const golos = Golos_Text({ subsets: ["latin"] });

export default function HeroLanding() {
    return (
        <div className='bg-[#05071E] relative mt-12 overflow-hidden'>
            {/* Background glow effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>

            <div className="z-10 flex items-center justify-center mt-20">
                <Badge variant="outline" className="px-4 py-2 border-purple-500/50 bg-purple-500/10 backdrop-blur-sm">
                    <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                    <span className={cn(`inline text-sm md:text-lg text-muted-foreground`)}>
                        India&apos;s No.1 SaaS for MSMEs 🚀
                    </span>
                </Badge>
            </div>

            <div className='flex flex-col items-center justify-center mt-8'>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='text-center text-3xl font-bold md:text-6xl mx-4 max-w-5xl leading-tight'
                >
                    Transform Your Business with Zapllo — Your
                    <span className='bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent font-extrabold'> AI Co‑Manager</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='flex justify-center text-center mt-6'
                >
                    <h2 className='bg-gradient-to-r from-[#815BF5] bg-clip-text text-transparent font-semibold text-xl md:text-3xl to-[#FC8929]'>
                        Put Your Business on Autopilot & Focus on Scaling
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className={`md:max-w-[800px] max-w-[400px] text-center mx-4 text-sm md:text-lg mt-6 leading-relaxed text-muted-foreground ${golos.className}`}
                >
                    Join thousands of MSME owners who&apos;ve boosted productivity by 10x and saved 5+ hours daily using Zapllo&apos;s AI‑Powered Business Apps
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className='flex flex-col sm:flex-row gap-4 mt-10 mb-4'
                >
                    <HoverCard>
                        <Link href='/signup'>
                            <HoverCardTrigger>
                                <Button size="lg" className="relative group py-6 px-8 bg-gradient-to-r from-[#815BF5] to-[#FC8929] rounded-full text-white font-bold text-lg shadow-[0_0_30px_rgba(129,91,245,0.5)] hover:shadow-[0_0_50px_rgba(129,91,245,0.8)] transition-all duration-300">
                                    <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                                    Start Your Free Trial
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                        60% OFF
                                    </span>
                                </Button>
                            </HoverCardTrigger>
                        </Link>
                        <HoverCardContent className="w-80 bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
                            <div className="space-y-2">
                                <h4 className="text-lg font-semibold text-white">Limited Time Offer!</h4>
                                <p className="text-sm text-gray-300">
                                    Start with all premium features free for 7 days. No credit card required.
                                </p>
                            </div>
                        </HoverCardContent>
                    </HoverCard>

                    <Button variant="outline" size="lg" className="py-6 px-8 bg-transparent border border-[#815BF5] text-[#815BF5] rounded-full font-bold text-lg hover:bg-[#815BF5]/10">
                        Book a Demo <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className='md:flex justify-center gap-6 mt-4 mb-6'
                >
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden">
                                <img
                                    src={`/people/man${i}.jpg`}
                                    alt="User avatar"
                                    onError={(e) => { e.currentTarget.src = 'https://ui.shadcn.com/avatars/01.png' }}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#815BF5] to-[#FC8929] flex items-center justify-center text-xs font-bold text-white">
                            +20K
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                            ))}
                        </div>
                        <span className="ml-2 text-white font-medium">4.9/5 from 5,000+ reviews</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className='relative flex w-full justify-center mt-6'
                >
                    <div className="relative w-11/12 md:w-3/4 lg:w-2/3 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(129,91,245,0.3)]">
                        <VideoComponent />
                        <div className="absolute inset-0 rounded-xl border border-purple-500/20"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}