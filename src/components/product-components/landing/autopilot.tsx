'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight, Clock, BarChart, CalendarDays, MessageSquare } from 'lucide-react'
import { FaInstagram } from 'react-icons/fa'

const FeatureCard = ({
    icon,
    title,
    description,
    link,
    badge = null,
    delay = 0
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    link: string;
    badge?: React.ReactNode;
    delay?: number;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
        >
            <Link href={link}>
                <Card className="bg-[#0A0D28] hover:border-[#815bf5] cursor-pointer border h-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(129,91,245,0.2)]">
                    <CardContent className="p-6">
                        <div className="h-12 w-12 mb-4 mt-2 rounded-lg bg-gradient-to-br from-[#815bf5]/20 to-transparent flex items-center justify-center">
                            {icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold mb-1">{title}</h3>
                                {badge && badge}
                            </div>
                            <p className="text-[#676B93] text-sm">{description}</p>
                            <div className="mt-4 flex items-center text-[#815bf5] text-sm font-medium">
                                Learn more <ChevronRight className="h-4 w-4 ml-1" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    )
}

export default function Autopilot() {
    return (
        <div className='w-full flex justify-center'>
            <div className='mb-16 mt-20 w-full max-w-7xl px-4'>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className='text-center text-3xl font-bold bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent mb-2'>
                        To Run your Business on Autopilot
                    </h2>
                    <h3 className='text-center text-2xl mb-6'>For Your Everyday Business needs</h3>
                </motion.div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
                    <FeatureCard
                        icon={<img src='/landing/tasks.png' className="h-6 w-6 text-[#815bf5]" />}
                        title="Task Delegation App"
                        description="Boost productivity, saving up to 5 hours per day. Prioritize, schedule, and delegate tasks efficiently, ensuring smoother workflows and timely project completion."
                        link="/products/zapllo-teams"
                        delay={0.1}
                    />

                    <FeatureCard
                        icon={<img src='/landing/payroll.png' className="h-6 w-6 text-[#815bf5]" />}
                        title="Zapllo Payroll"
                        description="Streamline your HR operations providing seamless leave requests, real-time attendance monitoring & payroll management with compliance automation."
                        link="/products/zapllo-payroll"
                        delay={0.2}
                    />

                    <FeatureCard
                       icon={<img src='/landing/voice.png' className="h-6 w-6 text-[#815bf5]" />}
                        title="Zapllo Voice AI"
                        description="Deploy intelligent AI voice agents for customer support, sales calls, and automated campaigns. Available 24/7 to handle conversations and drive conversions."
                        link="https://ai.zapllo.com"
                        badge={<Badge variant="outline" className="text-xs bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white border-none">NEW</Badge>}
                        delay={0.3}
                    />

                    <FeatureCard
                        icon={<img src='/icons/Group.png' className="h-6 w-6 text-[#815bf5]" />}
                        title="Zaptick"
                        description="Accelerate your business growth with Official WhatsApp API, doubling your conversion rates & making your business run 24X7 with automated customer support."
                        link="https://zaptick.io"
                        delay={0.4}
                    />

                    <FeatureCard
                        icon={<img src='/icons/crm.png' className="h-6 w-6 text-[#815bf5]" />}
                        title="Zapllo CRM"
                        description="Take control of your finances and save upto 40% expenses by optimizing spending through streamlined tracking, approval workflows, and insightful reporting."
                        link="https://crm.zapllo.com"
                        delay={0.5}
                    />
                     <FeatureCard
                        icon={<FaInstagram className="h-6 w-6 text-[#815bf5]" />}
                        title="Instagram Automation"
                        description="Automate your Instagram marketing with AI-powered content creation, scheduling, engagement, and analytics to grow your social media presence effortlessly."
                        link="#"
                        badge={<Badge variant="outline" className="text-[10px] bg-gradient-to-r from-[#676B93] to-[#676B93] text-white border-none">COMING SOON</Badge>}
                        delay={0.6}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-12 w-full"
                >
                    <div className="mx-auto max-w-3xl p-6 rounded-xl bg-gradient-to-r from-[#0A0D28]/80 to-[#0A0D28] border border-[#815bf5]/30 text-center">
                        <h3 className="text-xl md:text-2xl font-bold mb-4">Businesses using Zapllo save 30+ hours per week</h3>
                        <p className="text-[#676B93] mb-6">Join 20,000+ businesses already automating their workflows</p>
                        <Link href="/signup">
                            <div className="inline-block bg-gradient-to-r from-[#815BF5] to-[#FC8929] hover:opacity-90 transition-all rounded-full px-6 py-3 text-white font-medium">
                                Try Zapllo Free for 7 Days
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}