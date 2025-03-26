'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Rocket, ArrowRight, CheckCircle2 } from 'lucide-react'
import { 
    Card, 
    CardContent,
    CardFooter,
    CardHeader 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const FeatureItem = ({ text }: { text: string }) => (
    <div className="flex items-center gap-2 mb-3">
        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center">
            <CheckCircle2 className="h-3 w-3 text-[#815BF5]" />
        </div>
        <p className="text-sm text-[#676B93]">{text}</p>
    </div>
)

export default function SaveLanding() {
    return (
        <div className='w-full py-24 bg-[#04061E] relative'>
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#05071E] to-transparent"></div>
            
            <div className='max-w-6xl mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="grid md:grid-cols-2 gap-16 items-center"
                >
                    <div className="relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#815BF5]/10 rounded-full blur-3xl"></div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                        >
                            <img 
                                src="/product/update.png" 
                                className='w-full rounded-xl border border-[#815bf5]/20 shadow-[0_0_30px_rgba(129,91,245,0.15)]' 
                                alt="Zapllo Updates"
                            />
                            
                            <div className="absolute top-4 right-4 bg-gradient-to-br from-[#1a1e48] to-[#0A0D28] border border-[#815bf5]/30 rounded-xl p-3 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                        Limited Time
                                    </Badge>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold mb-6">
                            Start saving money and start investing in growth
                        </h2>
                        
                        <p className="text-lg mb-8 text-[#676B93]">
                            Unlock the Power of ZAPLLO with WhatsApp Reminders & 10X Team Productivity
                        </p>
                        
                        <div className="grid gap-6 mb-8">
                            <FeatureItem text="Save up to 20 hours per week with automated workflows" />
                            <FeatureItem text="Reduce operational costs by up to 30% with streamlined processes" />
                            <FeatureItem text="Increase team productivity by 10x with better task management" />
                            <FeatureItem text="24/7 customer support ensures you're never left hanging" />
                        </div>
                        
                        <div className="space-y-4">
                            <Link href='https://masterclass.zapllo.com/workshop/'>
                                <Button className="w-full relative py-6 text-lg font-semibold bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white rounded-full shadow-lg hover:shadow-[0_0_30px_rgba(129,91,245,0.3)] transition-all duration-300">
                                    <div className="flex items-center justify-center w-full">
                                        <p>Join Live Masterclass</p>
                                        <Rocket className="ml-2 h-5 w-5 animate-pulse" />
                                    </div>
                                </Button>
                            </Link>

                            <Link href='/signup'>
                                <Button variant="outline" className="w-full py-6 mt-4 text-lg bg-transparent border border-[#815BF5] text-[#815BF5] rounded-full hover:bg-[#815BF5]/10 transition-all duration-300">
                                    Create Your Free Account <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="mt-8 p-4 bg-[#0A0D28]/60 border border-[#815bf5]/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="h-5 w-5 text-[#FC8929]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Special Launch Offer</p>
                                    <p className="text-xs text-[#676B93]">Get 30% off your first 3 months when you sign up today.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}