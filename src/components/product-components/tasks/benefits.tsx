'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type BenefitProps = {
    icon: string;
    title: string;
    description: string;
    index: number;
}

const Benefit = ({ icon, title, description, index }: BenefitProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Card className="bg-[#0A0D28]/70 border-[#815BF5]/20 h-full hover:border-[#815BF5]/50 transition-all duration-300">
                <CardContent className="p-6">
                    <div className="mb-4">
                        <img src={icon} className="h-12 w-12" alt={title} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-muted-foreground text-sm">{description}</p>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default function Benefits() {
    const benefits = [
        {
            icon: '/product/icons/calendar.png',
            title: 'Seamless Integration',
            description: 'Save time with seamless integration and automation across your business operations'
        },
        {
            icon: '/product/icons/track.png',
            title: 'Happy Employees',
            description: 'Increase employee satisfaction with clear task assignments and fair workload distribution'
        },
        {
            icon: '/product/icons/wifi.png',
            title: 'Access Anywhere',
            description: 'Access tasks from any internet-enabled device, keeping your team connected wherever they are'
        },
        {
            icon: '/product/icons/records.png',
            title: 'Stay Organized',
            description: 'Stay organized and focused on what matters most with smart task categorization'
        },
        {
            icon: '/product/icons/savetime.png',
            title: '10X Productivity',
            description: 'Increase productivity by 10X with automated reminders and streamlined workflows'
        },
        {
            icon: '/product/icons/savetimedone.png',
            title: 'Reduce Stress',
            description: 'Reduce stress and meet deadlines consistently with real-time progress tracking'
        }
    ];

    return (
        <div className='py-24 px-4 sm:px-6 lg:px-8 bg-[#05071E] relative'>
            {/* Background effects */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#04061E] to-transparent z-0"></div>
            <div className="absolute -top-20 right-20 w-96 h-96 bg-[#815BF5]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#FC8929]/5 rounded-full blur-3xl"></div>

            <div className='max-w-7xl mx-auto relative z-10'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-4 bg-[#0A0D28] text-[#815BF5] border-[#815BF5]/30">
                        WHY CHOOSE ZAPLLO
                    </Badge>

                    <h2 className='text-3xl font-bold mb-4'>
                        <span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent'>
                            India&apos;s No.1 SaaS for MSMEs
                        </span>
                        <span className='text-white ml-1'>🚀</span>
                    </h2>

                    <h3 className='text-2xl md:text-3xl font-bold mb-6'>
                        Benefits Of Using Task Delegation App
                    </h3>

                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Stop wasting 5 hours daily on follow-ups. Join 20,000+ business owners who have revolutionized their task management.
                    </p>
                </motion.div>

                <div className='grid gap-8'>
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mx-auto max-w-3xl relative z-10"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 rounded-xl blur-md"></div>
                            <Card className="overflow-hidden border-[#815BF5]/30 bg-[#0A0D28]/80 backdrop-blur-sm">
                                <CardContent className="p-0">
                                    <img
                                        src='/product/taskapp.png'
                                        className='w-full h-auto rounded-t-xl'
                                        alt="Zapllo Task App Dashboard"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2">Complete Task Management Solution</h3>
                                        <p className="text-muted-foreground">
                                            Manage your entire team with just 10 minutes a day. Assign tasks, track progress, and ensure deadlines are met with minimal effort.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                        {benefits.map((benefit, index) => (
                            <Benefit
                                key={index}
                                icon={benefit.icon}
                                title={benefit.title}
                                description={benefit.description}
                                index={index}
                            />
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-16 text-center"
                >
                    <a href="/signup" className="inline-flex items-center text-[#815BF5] hover:underline">
                        Ready to transform your business? Start your free trial today
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </div>
    )
}