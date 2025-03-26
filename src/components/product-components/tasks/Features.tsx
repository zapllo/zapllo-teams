'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Tabs2, TabsList2, TabsTrigger2 } from '@/components/ui/tabs2'
import { Tabs3, TabsList3, TabsTrigger3 } from '@/components/ui/tabs3'

type FeatureProps = {
    title: string;
    description: string;
    icon: string;
    delay?: number;
}

const Feature = ({ title, description, icon, delay = 0 }: FeatureProps) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className='flex gap-4 mt-6 items-start'
        >
            <div className="bg-[#0A0D28] p-2 rounded-lg border border-[#815BF5]/20">
                <img src={icon} className='w-12' alt={title} />
            </div>
            <div>
                <h3 className='text-xl font-medium'>{title}</h3>
                <p className='text-muted-foreground mt-2 text-sm'>{description}</p>
            </div>
        </motion.div>
    )
}

export default function TaskFeatures() {
    return (
        <div className='w-full py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#05071E] to-[#04061E] relative'>
            {/* Decorative elements */}
            <div className="absolute top-40 right-0 w-96 h-96 bg-[#815BF5]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 left-0 w-96 h-96 bg-[#FC8929]/5 rounded-full blur-3xl"></div>
            
            <div className='max-w-7xl mx-auto'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-4 bg-[#0A0D28] text-[#815BF5] border-[#815BF5]/30">
                        FEATURES
                    </Badge>
                    
                    <h2 className='text-3xl font-bold mb-4'>
                        <span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent'>
                            Zapllo Tasks App Features
                        </span>
                    </h2>
                    
                    <h3 className='font-bold text-center mb-6 text-xl md:text-3xl'>
                        How Zapllo Tasks App saves 5 hours of each Employee?
                    </h3>
                    
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Our powerful features streamline task management, automate reminders, and provide real-time insights into team performance.
                    </p>
                </motion.div>

                <Tabs3 defaultValue="delegation" className="w-full">
                    <div className="flex justify-center mb-8">
                        <TabsList3 className="bg-[#0A0D28] p-1 h-12 md:scale-100 scale-75 border border-[#815BF5]/20 rounded-full">
                            <TabsTrigger3
                                value="delegation" 
                                className="rounded-full px-4 py-2 data-[state=active]:bg-[#815BF5] data-[state=active]:text-white transition-all"
                            >
                                Task Delegation
                            </TabsTrigger3>
                            <TabsTrigger3
                                value="tracking" 
                                className="rounded-full px-4 py-2 data-[state=active]:bg-[#815BF5] data-[state=active]:text-white transition-all"
                            >
                                Tracking & Reports
                            </TabsTrigger3>
                            <TabsTrigger3 
                                value="notifications" 
                                className="rounded-full px-4 py-2 data-[state=active]:bg-[#815BF5] data-[state=active]:text-white transition-all"
                            >
                                Notifications
                            </TabsTrigger3>
                        </TabsList3>
                    </div>
                    
                    <TabsContent value="delegation" className="mt-0">
                        <div className='grid md:grid-cols-2 gap-8'>
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className='relative'
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#815BF5]/10 to-[#FC8929]/10 rounded-xl blur-md"></div>
                                <Card className="h-full bg-[#0A0D28]/80 backdrop-blur-sm border-[#815BF5]/20 overflow-hidden">
                                    <CardContent className="p-0">
                                        <img 
                                            src='/product/tasks.png' 
                                            className='w-full h-full object-cover rounded-t-xl' 
                                            alt="Task delegation interface" 
                                        />
                                    </CardContent>
                                </Card>
                            </motion.div>
                            
                            <div>
                                <motion.h3 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className='text-2xl md:text-3xl font-bold'
                                >
                                    Effortless Task Delegation
                                </motion.h3>
                                
                                <Feature 
                                    icon='/product/icons/assigned.png'
                                    title='Task Assignment'
                                    description='Assign tasks with deadlines and priorities, allow assigners to choose frequency, and ensure efficient completion and management.'
                                    delay={0.1}
                                />
                                
                                <Feature 
                                    icon='/product/icons/time.png'
                                    title='Recurring Tasks-Daily, Weekly & Monthly'
                                    description='Set up recurring tasks that need to be done on a periodic basis.'
                                    delay={0.2}
                                />
                                
                                <Feature 
                                    icon='/product/icons/progress.png'
                                    title='Task Progress Updation'
                                    description='Teammates stay updated on tasks and report progress to ensure assigners are kept informed.'
                                    delay={0.3}
                                />
                                
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="mt-8"
                                >
                                    <Link href="/signup" className="text-[#815BF5] inline-flex items-center hover:underline">
                                        Try task delegation feature <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="tracking" className="mt-0">
                        <div className='grid md:grid-cols-2 gap-8'>
                            <div>
                                <motion.h3 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className='text-2xl md:text-3xl font-bold'
                                >
                                    Task Tracking & MIS Reports
                                </motion.h3>
                                
                                <Feature 
                                    icon='/product/icons/assigned.png'
                                    title='Department wise Dashboard'
                                    description='Get real-time updates on tasks, including completion notifications and milestone achievements.'
                                    delay={0.1}
                                />
                                
                                <Feature 
                                    icon='/product/icons/time.png'
                                    title='Employee Performance'
                                    description='Analyze employee performance with MIS scores, fostering responsibility and accountability.'
                                    delay={0.2}
                                />
                                
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="mt-8"
                                >
                                    <Link href="/signup" className="text-[#815BF5] inline-flex items-center hover:underline">
                                        Explore performance analytics <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </motion.div>
                            </div>
                            
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className='relative'
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#815BF5]/10 to-[#FC8929]/10 rounded-xl blur-md"></div>
                                <Card className="h-full bg-[#0A0D28]/80 backdrop-blur-sm border-[#815BF5]/20 overflow-hidden">
                                    <CardContent className="p-0">
                                        <img 
                                            src='/product/performance.png' 
                                            className='w-full h-full object-cover rounded-t-xl' 
                                            alt="Performance dashboard" 
                                        />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="notifications" className="mt-0">
                        <div className='grid md:grid-cols-2 gap-8'>
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className='relative'
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#815BF5]/10 to-[#FC8929]/10 rounded-xl blur-md"></div>
                                <Card className="h-full bg-[#0A0D28]/80 backdrop-blur-sm border-[#815BF5]/20 overflow-hidden">
                                    <CardContent className="p-0">
                                        <img 
                                            src='/product/reminders.png' 
                                            className='w-full h-full object-cover rounded-t-xl' 
                                            alt="WhatsApp notifications" 
                                        />
                                    </CardContent>
                                </Card>
                            </motion.div>
                            
                            <div>
                                <motion.h3 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className='text-2xl md:text-3xl font-bold'
                                >
                                    Notifications & Reminders
                                </motion.h3>
                                
                                <Feature 
                                    icon='/product/icons/bell.png'
                                    title='Instant WhatsApp & Email Reminders'
                                    description='Automated reminders and notifications about tasks and deliverables.'
                                    delay={0.1}
                                />
                                
                                <Feature 
                                    icon='/product/icons/time.png'
                                    title='Daily Reminders on WhatsApp'
                                    description='Employees get Daily Reminder for pending Tasks which pushes them to complete on time.'
                                    delay={0.2}
                                />
                                
                                <Feature 
                                    icon='/product/icons/time.png'
                                    title='Notification Subscriptions'
                                    description='Admin and manager can subscribe to any task and get notifications about that tasks.'
                                    delay={0.3}
                                />
                                
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="mt-8"
                                >
                                    <Link href="/signup" className="text-[#815BF5] inline-flex items-center hover:underline">
                                        Try automated reminders <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs3>
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-24 bg-gradient-to-r from-[#0A0D28] to-[#151E4A] border border-[#815BF5]/20 rounded-2xl overflow-hidden"
                >
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Say Goodbye to Miscommunications</h3>
                            <p className="text-muted-foreground mb-6">
                                Clear communication is key for successful task management. Our app eliminates confusion with these powerful features:
                            </p>
                            
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    {
                                        icon: '/product/icons/audio.png',
                                        title: 'Audio Notes',
                                        description: 'Add voice instructions to explain tasks in detail'
                                    },
                                    {
                                        icon: '/product/icons/attachments.png',
                                        title: 'KRAs',
                                        description: 'Assign and track key result areas for each team member'
                                    },
                                    {
                                        icon: '/product/icons/reminders.png',
                                        title: 'Templates',
                                        description: 'Use predefined department-wise task templates'
                                    },
                                    {
                                        icon: '/product/icons/export.png',
                                        title: 'File Uploads',
                                        description: 'Attach any kind of files related to tasks'
                                    }
                                ].map((item, i) => (
                                    <Card key={i} className="bg-[#0A0D28]/50 border-[#815BF5]/20">
                                        <CardContent className="p-4">
                                            <img src={item.icon} className="h-10 w-10 mb-3" alt={item.title} />
                                            <h4 className="font-medium mb-1">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#815BF5]/10 to-[#FC8929]/10 rounded-xl blur-md"></div>
                            <img 
                                src='/product/tasks.png' 
                                className='relative z-10 w-full max-w-md rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-500' 
                                alt="Communication features" 
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}