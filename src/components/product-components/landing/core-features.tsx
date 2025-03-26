'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
    ArrowRight,
    MessageSquare,
    BarChart,
    ClipboardList,
    Bell,
    Clock,
    Shield
} from 'lucide-react'

const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => {
    return (
        <Card className="bg-gradient-to-br from-[#1a1e48]/80 to-[#0A0D28] border-[#815bf5]/20 hover:border-[#815bf5]/50 transition-all duration-300">
            <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center mb-4">
                    {icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-[#676B93]">{description}</p>
            </CardContent>
        </Card>
    )
}

export default function CoreFeatures() {
    return (
        <div className='w-full py-24 bg-[#05071E] relative'>
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#0A0D28] to-transparent"></div>

            <div className='max-w-6xl mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className='text-3xl font-bold bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent mb-4'>
                        Core Features
                    </h2>
                    <h3 className='font-bold text-3xl mb-4'>
                        Powerful Solutions to Simplify your workflow
                    </h3>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-16 mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="relative">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#815BF5]/10 rounded-full blur-3xl"></div>
                            <div className="relative bg-gradient-to-br from-[#1a1e48]/80 to-[#0A0D28] border border-[#815bf5]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(129,91,245,0.15)]">
                                <img src='/landing/mockup4.png' className='rounded-xl w-full object-cover' />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="flex flex-col justify-center"
                    >
                        <h3 className='text-3xl font-bold mb-6'>Streamlined Business Processes</h3>

                        <div className="grid gap-6">
                            <div className='flex gap-4 items-start'>
                                <div className="h-10 w-10 mt-1 rounded-lg bg-gradient-to-br from-[#815bf5]/20 to-transparent flex items-center justify-center flex-shrink-0">
                                    <ClipboardList className="h-5 w-5 text-[#815bf5]" />
                                </div>
                                <div>
                                    <h4 className='text-xl font-bold mb-2'>
                                        Say Goodbye to Manual Tasks and Inefficiencies
                                    </h4>
                                    <p className='text-[#676B93] text-sm'>
                                        Eliminate time consuming manual processes, freeing up valuable resources streamlining operations and reducing errors by up to 90%.
                                    </p>
                                </div>
                            </div>

                            <div className='flex gap-4 items-start'>
                                <div className="h-10 w-10 mt-1 rounded-lg bg-gradient-to-br from-[#815bf5]/20 to-transparent flex items-center justify-center flex-shrink-0">
                                    <Clock className="h-5 w-5 text-[#815bf5]" />
                                </div>
                                <div>
                                    <h4 className='text-xl font-bold mb-2'>
                                        Automate repetitive processes for seamless operations
                                    </h4>
                                    <p className='text-[#676B93] text-sm'>
                                        Ensure smooth operations by optimizing efficiency allowing your team to focus on strategic objectives rather than mundane tasks.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-gradient-to-r from-[#0A0D28] to-[#141841] rounded-lg p-4 border border-[#815bf5]/20">
                            <div className="flex gap-2 items-center">
                                <div className="p-2 rounded-full bg-gradient-to-r from-[#815BF5] to-[#FC8929]">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm">Average time saved with Zapllo</p>
                                    <p className="text-2xl font-bold">30+ hours per week</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-16 mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="flex flex-col justify-center md:order-2"
                    >
                        <h3 className='text-3xl font-bold mb-6'>Integrated Communication</h3>

                        <div className="grid gap-6">
                            <div className='flex gap-4 items-start'>
                                <div className="h-10 w-10 mt-1 rounded-lg bg-gradient-to-br from-[#815bf5]/20 to-transparent flex items-center justify-center flex-shrink-0">
                                    <Bell className="h-5 w-5 text-[#815bf5]" />
                                </div>
                                <div>
                                    <h4 className='text-xl font-bold mb-2'>
                                        Share Notifications Easily
                                    </h4>
                                    <p className='text-[#676B93] text-sm'>
                                        Effortlessly share notifications, reminders, and follow-ups from our app to WhatsApp and email, ensuring 98% open rates.
                                    </p>
                                </div>
                            </div>

                            <div className='flex gap-4 items-start'>
                                <div className="h-10 w-10 mt-1 rounded-lg bg-gradient-to-br from-[#815bf5]/20 to-transparent flex items-center justify-center flex-shrink-0">
                                    <MessageSquare className="h-5 w-5 text-[#815bf5]" />
                                </div>
                                <div>
                                    <h4 className='text-xl font-bold mb-2'>
                                        Enhanced Connectivity
                                    </h4>
                                    <p className='text-[#676B93] text-sm'>
                                        Maximize connectivity with clients and team by synchronizing WhatsApp and email features with our apps for a unified communication experience.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="bg-[#0A0D28]/60 rounded-lg p-4 border border-[#815bf5]/20">
                                <p className="text-3xl font-bold text-white mb-1">98%</p>
                                <p className="text-xs text-[#676B93]">WhatsApp open rate</p>
                            </div>
                            <div className="bg-[#0A0D28]/60 rounded-lg p-4 border border-[#815bf5]/20">
                                <p className="text-3xl font-bold text-white mb-1">2x</p>
                                <p className="text-xs text-[#676B93]">Customer engagement</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="md:order-1"
                    >
                        <div className="relative">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FC8929]/10 rounded-full blur-3xl"></div>
                            <div className="relative bg-gradient-to-br from-[#1a1e48]/80 to-[#0A0D28] border border-[#815bf5]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(129,91,245,0.15)]">
                                <img src='/landing/mockup5.png' className='rounded-xl w-full object-cover' />
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="relative">
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#815BF5]/10 rounded-full blur-3xl"></div>
                            <div className="relative bg-gradient-to-br from-[#1a1e48]/80 to-[#0A0D28] border border-[#815bf5]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(129,91,245,0.15)]">
                                <img src='/landing/mockup6.png' className='rounded-xl w-full object-cover' />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="flex flex-col justify-center"
                    >
                        <h3 className='text-3xl font-bold mb-6'>Business Analytics - Real time Dashboards</h3>

                        <div className="grid gap-6">
                            <div className='flex gap-4 items-start'>
                                <div className="h-10 w-10 mt-1 rounded-lg bg-gradient-to-br from-[#815bf5]/20 to-transparent flex items-center justify-center flex-shrink-0">
                                    <BarChart className="h-5 w-5 text-[#815bf5]" />
                                </div>
                                <div>
                                    <h4 className='text-xl font-bold mb-2'>
                                        Make informed Decisions
                                    </h4>
                                    <p className='text-[#676B93] text-sm'>
                                        Real-time dashboards provide immediate access to crucial business metrics, facilitating rapid decision-making and strategic planning.
                                    </p>
                                </div>
                            </div>

                            <div className='flex gap-4 items-start'>
                                <div className="h-10 w-10 mt-1 rounded-lg bg-gradient-to-br from-[#815bf5]/20 to-transparent flex items-center justify-center flex-shrink-0">
                                    <Shield className="h-5 w-5 text-[#815bf5]" />
                                </div>
                                <div>
                                    <h4 className='text-xl font-bold mb-2'>
                                        Dynamic Data Visualization
                                    </h4>
                                    <p className='text-[#676B93] text-sm'>
                                        Real-time dashboards offer dynamic visualization tools for exploring data deeply, uncovering insights that drive business growth.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-gradient-to-br from-[#1a1e48] to-[#0A0D28] rounded-lg border border-[#815bf5]/20">
                            <h4 className="text-lg font-bold mb-2">Enterprise-Ready Analytics</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-[#0A0D28]/60 rounded-lg p-3 text-center">
                                    <p className="text-xs text-[#676B93]">Real-time</p>
                                    <p className="text-sm font-bold text-white">Updates</p>
                                </div>
                                <div className="bg-[#0A0D28]/60 rounded-lg p-3 text-center">
                                    <p className="text-xs text-[#676B93]">Custom</p>
                                    <p className="text-sm font-bold text-white">Reports</p>
                                </div>
                                <div className="bg-[#0A0D28]/60 rounded-lg p-3 text-center">
                                    <p className="text-xs text-[#676B93]">Data</p>
                                    <p className="text-sm font-bold text-white">Export</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-24 text-center"
                >
                    <div className="bg-gradient-to-br from-[#1a1e48]/80 to-[#0A0D28] border border-[#815bf5]/20 rounded-xl p-8 max-w-4xl mx-auto shadow-[0_0_30px_rgba(129,91,245,0.15)]">
                        <h3 className="text-2xl font-bold mb-4">Ready to Experience the Zapllo Difference?</h3>
                        <p className="text-[#676B93] mb-8 max-w-2xl mx-auto">Join thousands of business owners who&apos;ve transformed their operations with our AI-powered business solutions.</p>
                        <div className="inline-block bg-gradient-to-r from-[#815BF5] to-[#FC8929] p-[2px] rounded-full">
                            <div className="bg-[#0A0D28] rounded-full p-1">
                                <button className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white rounded-full px-8 py-3 font-medium flex items-center">
                                    Start Your Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
};