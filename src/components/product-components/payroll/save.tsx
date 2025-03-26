'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Check, Clock, ArrowRight } from 'lucide-react'

export default function SaveMore() {
    const countdown = {
        days: 1,
        hours: 14,
        minutes: 32,
        seconds: 51
    };

    const limitedTimeFeatures = [
        "Unlimited integration accounts",
        "Face recognition attendance",
        "WhatsApp notifications",
        "Unlimited premium support",
        "Free data migration"
    ];

    return (
        <div className='w-full py-24 bg-[#04061E] relative'>
            <div className="absolute top-1/3 left-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full filter blur-3xl"></div>

            <div className='max-w-6xl mx-auto px-4 relative z-10'>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#815BF5] to-[#FC8929] blur-xl opacity-20 transform scale-95"></div>
                        <div className="relative">
                            <img src="/product/update.png" className="w-full rounded-xl shadow-2xl" />

                            <div className="absolute -bottom-6 -left-6 bg-[#0A0D28] rounded-lg p-4 border border-[#815BF5]/20 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                                        <Check className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Used by</p>
                                        <p className="font-bold">20,000+ MSMEs</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-block px-4 py-1.5 mb-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full">
                            <span className="text-sm font-medium text-red-400 flex items-center">
                                <Clock className="h-4 w-4 mr-1.5" />
                                LIMITED TIME OFFER
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Stop losing money on <span className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent">attendance fraud</span>
                        </h2>

                        <p className="text-gray-400 mb-8 text-lg">
                            Every day you wait, you&apos;re losing money to time theft, buddy punching, and inaccurate attendance records. Join thousands of businesses that have already taken control.
                        </p>

                        <Card className="bg-[#0A0D28]/60 border-[#815BF5]/20 mb-8">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4">Special launch offer ends in:</h3>

                                <div className="flex gap-4 mb-6">
                                    {Object.entries(countdown).map(([unit, value]) => (
                                        <div key={unit} className="text-center">
                                            <div className="bg-[#141841] border border-[#815BF5]/20 rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold">
                                                {value}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1 capitalize">{unit}</div>
                                        </div>
                                    ))}
                                </div>

                                <ul className="space-y-3 mb-6">
                                    {limitedTimeFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                                                <Check className="h-3 w-3 text-green-500" />
                                            </div>
                                            <span className="text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href='https://masterclass.zapllo.com/workshop/' className="flex-1">
                                        <Button className="w-full py-6 bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(129,91,245,0.5)]">
                                            Join Free Masterclass
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>

                                    <Link href='/signup' className="flex-1">
                                        <Button variant="outline" className="w-full py-6 rounded-full border-2 border-[#815BF5]/30 hover:border-[#815BF5] bg-[#05071E]/80 text-lg font-medium transition-all duration-300">
                                            Start 7-Day Free Trial
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                <span className="text-gray-400">✓</span> No credit card required.
                                <span className="text-gray-400"> ✓</span> Cancel anytime.
                                <span className="text-gray-400"> ✓</span> 24/7 support.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}