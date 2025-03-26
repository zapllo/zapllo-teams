'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, MessageSquare, Zap, BarChart3, Users } from 'lucide-react'

const FeaturePoint = ({ text }: { text: string }) => (
    <div className="flex items-start gap-2 mb-3">
        <div className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5] to-[#FC8929] flex items-center justify-center">
            <Check className="h-3 w-3 text-white" />
        </div>
        <p className="text-sm text-[#676B93]">{text}</p>
    </div>
)

export default function Solutions3() {
    return (
        <div className='w-full  bg-[#05071E] mt-24 relative'>
            {/* <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#0A0D28] to-transparent"></div> */}

            <div className='max-w-6xl mx-auto px-4 relative z-10'>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="grid md:grid-cols-2 gap-16 items-center"
                >
                    <div className="relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#815BF5]/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 bg-gradient-to-br from-[#1a1e48]/80 to-[#0A0D28] border border-[#815bf5]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(129,91,245,0.15)]">
                            <img src='/purple-whatsapp.png' className='rounded-xl object-cover w-full scale-90' />
                        </div>

                        <div className="absolute bottom-8 z-[100] right-8 transform translate-x-1/4 bg-gradient-to-br from-[#1a1e48] to-[#0A0D28] border border-[#815bf5]/30 rounded-xl p-4 shadow-lg">
                            <div className="flex flex-col items-center">
                                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                                    <BarChart3 className="h-5 w-5 text-blue-500" />
                                </div>
                                <p className="text-sm font-bold text-center">2x Conversion Rate</p>
                                <p className="text-xs text-[#676B93] text-center">with WhatsApp API</p>
                            </div>
                        </div>

                        <div className="absolute -top-4 -right-4 z-[100] bg-gradient-to-br from-[#1a1e48] to-[#0A0D28] border border-[#815bf5]/30 rounded-xl p-3 shadow-lg">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-green-400" />
                                <p className="text-sm font-bold">Official Partner</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className='flex items-center gap-4 mb-4'>
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#815bf5]/20 to-transparent flex items-center justify-center">
                                <img src='/landing/icons/01.png' className='h-8' />
                            </div>
                            <h2 className='text-3xl font-bold bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent'>
                                Zapllo WABA
                            </h2>
                        </div>

                        <h3 className='font-bold text-2xl mb-6 text-white'>Official WhatsApp API</h3>

                        <div className='space-y-6 text-[#676B93] text-sm'>
                            <FeaturePoint text="Automate & Grow Your Business 24/7 on WhatsApp with conversational AI chatbots that never sleep." />
                            <FeaturePoint text="Accelerate your business growth with Official WhatsApp API, doubling your conversion rates through enhanced lead management." />
                            <FeaturePoint text="Personalized customer interactions, and data-driven insights to improve customer satisfaction and loyalty." />
                            <FeaturePoint text="Chatbots & Automated Support Systems for your Business, reducing response time from hours to seconds." />
                        </div>

                        <div className="mt-8">
                            <Link href="/products/zapllo-waba">
                                <Button className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white rounded-full hover:opacity-90 px-6 py-6">
                                    Get WhatsApp for Business <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-8 grid grid-cols-3 z- gap-6">
                            <div className="flex flex-col items-center justify-center bg-[#0A0D28]/80 rounded-lg p-4 border border-[#815bf5]/10">
                                <Zap className="h-6 w-6 text-yellow-400 mb-2" />
                                <p className="text-xl font-bold">24/7</p>
                                <p className="text-xs text-[#676B93] text-center">Always online</p>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-[#0A0D28]/80 rounded-lg p-4 border border-[#815bf5]/10">
                                <MessageSquare className="h-6 w-6 text-green-400 mb-2" />
                                <p className="text-xl font-bold">2x</p>
                                <p className="text-xs text-[#676B93] text-center">Engagement rate</p>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-[#0A0D28]/80 rounded-lg p-4 border border-[#815bf5]/10">
                                <Users className="h-6 w-6 text-blue-400 mb-2" />
                                <p className="text-xl font-bold">98%</p>
                                <p className="text-xs text-[#676B93] text-center">Open rate</p>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-[#0A0D28]/60 border border-[#815bf5]/20 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="h-5 w-5 text-[#FC8929]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Exclusive Launch Offer</p>
                                    <p className="text-xs text-[#676B93]">Get 30% off your first 3 months when you sign up today.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
};