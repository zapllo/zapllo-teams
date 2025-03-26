'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, Users, Clock, FileCheck, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const FeaturePoint = ({ text }: { text: string }) => (
    <div className="flex items-start gap-2 mb-3">
        <div className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5] to-[#FC8929] flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
        </div>
        <p className="text-sm text-[#676B93]">{text}</p>
    </div>
)

export default function Solutions2() {
    return (
        <div className='w-full  bg-[#05071E]'>
            <div className='max-w-6xl mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="grid md:grid-cols-2 gap-16 items-center"
                >
                    <div className="order-2 md:order-1">
                        <div className='flex items-center gap-4 mb-4'>
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#815bf5]/20 to-transparent flex items-center justify-center">
                                <img src='/landing/icons/02.png' className='h-8' />
                            </div>
                            <div>
                                <h2 className='text-3xl font-bold bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent'>
                                    Zapllo Payroll
                                </h2>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Most Popular</Badge>
                            </div>
                        </div>

                        <h3 className='font-bold text-2xl mb-6 text-white'>Leave & Attendance Tracking App</h3>

                        <div className='space-y-6 text-[#676B93] text-sm'>
                            <FeaturePoint text="Streamline your HR operations with a comprehensive leave and attendance management system." />
                            <FeaturePoint text="Real-time attendance monitoring & payroll processing that saves HR teams up to 15 hours weekly." />
                            <FeaturePoint text="Get a seamless leave requests experience with automatic balance calculations and approval workflows." />
                            <FeaturePoint text="Compliance checks and reporting features fostering a more transparent and efficient workforce." />
                        </div>

                        <div className="mt-8">
                            <Link href="/products/zapllo-payroll">
                                <Button className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white rounded-full hover:opacity-90 px-6 py-6">
                                    Try Zapllo Payroll Free <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-[#815BF5]" />
                                <span className="text-sm">Unlimited employees</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-[#815BF5]" />
                                <span className="text-sm">Real-time tracking</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileCheck className="h-5 w-5 text-[#815BF5]" />
                                <span className="text-sm">Compliance ready</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-[#815BF5]" />
                                <span className="text-sm">Data encryption</span>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 md:order-2 relatzive">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FC8929]/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 bg-gradient-to-br from-[#1a1e48]/80 to-[#0A0D28] border border-[#815bf5]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(129,91,245,0.15)]">
                            <img src='/landing/mockup2.png' className='rounded-xl object-cover ' />
                        </div>
                        {/* <div className="absolute top-1/4 right-0 transform translate-x-1/4 bg-gradient-to-br from-[#1a1e48] to-[#0A0D28] border border-[#815bf5]/30 rounded-xl p-4 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-[#676B93]">Average time saved</p>
                                    <p className="text-lg font-bold">15 hrs/week</p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </motion.div>
            </div>
        </div>
    )
};