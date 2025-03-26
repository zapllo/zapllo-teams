'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Users, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CountdownTimer } from '@/components/ui/countdown-timer' // You'll need to create this component

export default function SaveMore3() {
    return (
        <div className='py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#05071E] to-transparent z-10"></div>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#815BF5]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#FC8929]/10 rounded-full blur-3xl"></div>

            <div className='max-w-7xl mx-auto relative z-20'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className='grid lg:grid-cols-2 gap-8 lg:gap-16 items-center'
                >
                    <div className='order-2 lg:order-1'>
                        <img
                            src="/product/noexcuse.png"
                            className='w-full max-w-lg mx-auto lg:mx-0 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500'
                            alt="Task Delegation Dashboard"
                        />
                    </div>

                    <div className="order-1 lg:order-2">
                        <Badge variant="outline" className="mb-6 bg-[#0A0D28] border-[#815BF5]/30 py-1.5 px-4">
                            <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                            <span className="text-yellow-400">SPECIAL OFFER</span>
                        </Badge>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Start saving money and start investing in growth
                        </h2>

                        <p className="text-lg text-muted-foreground mb-6">
                            Unlock the Power of TASK DELEGATION APP with WhatsApp Reminders & 10X your Team&apos;s Productivity 🚀
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <Card className="bg-[#0A0D28]/70 border-[#815BF5]/20">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-[#815BF5]/10">
                                        <Clock className="h-5 w-5 text-[#815BF5]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Save up to</p>
                                        <p className="font-bold">5 hours daily</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#0A0D28]/70 border-[#815BF5]/20">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-[#815BF5]/10">
                                        <Users className="h-5 w-5 text-[#815BF5]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Join over</p>
                                        <p className="font-bold">20,000+ businesses</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mb-8">
                            <div className="bg-[#1A1E48]/50 border border-[#815BF5]/30 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium">Limited Time Offer Ends In:</h4>
                                    <Badge variant="secondary" className="bg-[#815BF5]/20 text-[#815BF5]">60% OFF</Badge>
                                </div>
                                <CountdownTimer targetDate={new Date().setDate(new Date().getDate() + 3)} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Link href='https://masterclass.zapllo.com/workshop/'>
                                <Button className="w-full py-7 text-xl font-semibold bg-gradient-to-r from-[#815BF5] to-[#FC8929] hover:opacity-90 text-white rounded-full shadow-lg flex items-center justify-center group transition-all duration-300">
                                    <span>Join Live Masterclass</span>
                                    <div className="ml-2 bg-white/20 p-1 rounded-full transform group-hover:rotate-12 transition-transform">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                </Button>
                            </Link>

                            <Link href='/signup' >
                                <Button variant="outline" className="w-full py-6 mt-4 text-xl border-[#815BF5] text-[#815BF5] hover:bg-[#815BF5]/10 rounded-full flex items-center justify-center">
                                    Create Your Free Account <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-6 flex items-center justify-center lg:justify-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-muted-foreground">No credit card required</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}