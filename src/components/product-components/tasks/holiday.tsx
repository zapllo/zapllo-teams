'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, CheckCircle, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SettingUp4() {
    return (
        <div className='py-24 px-4 sm:px-6 lg:px-8 bg-[#05071E] relative'>
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#04061E] to-transparent z-0"></div>

            <div className='max-w-7xl mx-auto relative z-10'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className='grid md:grid-cols-2 gap-8 items-center'
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FC8929]/10 to-[#815BF5]/10 rounded-xl blur-md"></div>
                        <Card className="overflow-hidden border-[#815BF5]/20 bg-[#0A0D28]/70 backdrop-blur-sm relative">
                            <div className="absolute top-4 right-4">
                                <BarChart3 className="h-6 w-6 text-[#815BF5]" />
                            </div>
                            <CardContent className="p-0">
                                <img
                                    src='/product/mis.png'
                                    className='w-full h-auto rounded-t-xl object-cover'
                                    alt="MIS Score dashboard"
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <div className="md:pl-12 relative">
                        <div className="absolute -1/2 top-0 -left-4 bottom-0 w-0.5 bg-gradient-to-b from-[#815BF5] to-[#FC8929]/50 hidden md:block"></div>
                        <div className="hidden md:block absolute -left-6 top-1/2 transform -translate-y-1/2 z-10">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#FC8929] to-[#815BF5] text-white font-bold text-lg shadow-lg">
                                4
                            </div>
                        </div>

                        <div className="flex">
                            <div className="p-2 bg-[#0A0D28] rounded-lg mb-4">
                                <img src='/product/icons/notifications.png' className='h-16 w-16' alt="Analytics" />
                            </div>
                        </div>

                        <h3 className='md:text-3xl text-2xl font-bold mb-4'>Check Progress using MIS Score</h3>

                        <p className='text-muted-foreground max-w-lg mb-6'>
                            Get real-time insights into your team&apos;s performance. Our powerful MIS dashboard shows you exactly who&apos;s excelling and where improvements are needed.
                        </p>

                        <div className="space-y-3 mb-8">
                            {[
                                'Department-wise performance tracking',
                                'Individual employee MIS scores',
                                'Task completion rates',
                                'Deadline adherence metrics'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {/* <Button className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] hover:opacity-90 text-white rounded-full">
                                Start tracking performance
                            </Button> */}
                            {/* <div>
                                <a href="#" className="text-[#815BF5] inline-flex items-center hover:underline">
                                    See analytics demo <ArrowRight className="ml-1 h-4 w-4" />
                                </a>
                            </div> */}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-24 text-center"
                >
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold mb-6">
                            Ready to revolutionize your task management?
                        </h3>
                        <p className="text-muted-foreground mb-8">
                            Join 20,000+ businesses already saving 5+ hours per day with Zapllo Task Delegation App.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] hover:opacity-90 text-white rounded-full px-8 py-6 text-lg">
                                Get Started Now
                            </Button>
                            <Button variant="outline" className="border-[#815BF5] text-[#815BF5] hover:bg-[#815BF5]/10 rounded-full px-8 py-6 text-lg">
                                Schedule a Demo
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}