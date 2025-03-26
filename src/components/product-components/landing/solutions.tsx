'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'

const FeaturePoint = ({ text }: { text: string }) => (
    <div className="flex items-start gap-2 mb-3">
        <div className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5] to-[#FC8929] flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
        </div>
        <p className="text-sm text-[#676B93]">{text}</p>
    </div>
)

export default function Solutions() {
    return (
        <div className='w-full mt-12 bg-[#05071E]'>
            <div className='max-w-6xl mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className='text-3xl font-bold bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent mb-4'>
                        Our Solutions
                    </h2>
                    <h3 className='font-bold text-4xl mb-4'>
                        Apps that help you Grow your Business
                    </h3>
                    <p className='text-lg text-[#676B93] max-w-3xl mx-auto font-medium'>
                        Zapllo is dedicated to help Business Owners get freedom from day to day firefighting
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="grid md:grid-cols-2 gap-16 items-center mb-32"
                >
                    <div className="relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#815BF5]/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 bg-gradient-to-br from-[#1a1e48]/80 to-[#0A0D28] border border-[#815bf5]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(129,91,245,0.15)]">
                            <img src='/landing/mockup1.png' className='rounded-xl object-cover w-full' />
                        </div>
                    </div>

                    <div>
                        <div className='flex items-center gap-4 mb-4'>
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#815bf5]/20 to-transparent flex items-center justify-center">
                                <img src='/landing/icons/01.png' className='h-8' />
                            </div>
                            <h2 className='text-3xl font-bold bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent'>
                                Zapllo Tasks
                            </h2>
                        </div>

                        <h3 className='font-bold text-2xl mb-6 text-white'>Task Delegation App</h3>

                        <div className='space-y-6 text-[#676B93] text-sm'>
                            <FeaturePoint text="Organize, prioritize, and track tasks efficiently for enhanced productivity, saving up to 5 hours daily." />
                            <FeaturePoint text="Assign tasks with deadlines and priorities, with their frequency to ensure efficient completion and management." />
                            <FeaturePoint text="Receive real-time task updates, while analyzing employee performance with MIS scores for accountability." />
                            <FeaturePoint text="Send Automated notifications & follow up reminders on WhatsApp & Email, reducing follow-up time by 80%." />
                        </div>

                        <div className="mt-8">
                            <Link href="/products/zapllo-teams">
                                <Button className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white rounded-full hover:opacity-90 px-6 py-6">
                                    Try Zapllo Tasks Free <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-8 flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center">
                                    <svg className="h-5 w-5 text-[#815BF5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Setup in minutes</p>
                                    <p className="text-xs text-[#676B93]">No technical skills needed</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center">
                                    <svg className="h-5 w-5 text-[#FC8929]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">100% Secure</p>
                                    <p className="text-xs text-[#676B93]">Enterprise-grade security</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
};