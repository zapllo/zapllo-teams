'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, CheckCircle, BellRing } from 'lucide-react'

export default function SettingUp3() {
    return (
        <div className='py-24 px-4 sm:px-6 lg:px-8 bg-[#05071E] relative'>
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#815BF5] to-[#FC8929]/50 hidden md:block"></div>
            
            <div className='max-w-7xl mx-auto'>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className='grid md:grid-cols-2 gap-8 items-center relative'
                >
                    <div className="md:text-right md:pr-12 relative">
                        <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white font-bold text-lg shadow-lg">
                                3
                            </div>
                        </div>
                        
                        <div className="flex md:justify-end">
                            <div className="p-2 bg-[#0A0D28] rounded-lg md:order-2 mb-4">
                                <img src='/product/icons/notifications.png' className='h-16 w-16' alt="Notifications" />
                            </div>
                        </div>
                        
                        <h3 className='md:text-3xl text-2xl font-bold mb-4'>Team will receive Notifications</h3>
                        
                        <p className='text-muted-foreground md:ml-auto max-w-lg mb-6'>
                            Never miss a task again! Our automated notification system sends instant WhatsApp alerts about new tasks, approaching deadlines, and overdue items.
                        </p>
                        
                        <div className="space-y-3">
                            {[
                                'Instant WhatsApp & email notifications',
                                'Daily task reminders',
                                'Deadline alerts',
                                'Task status updates'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center md:justify-end gap-2">
                                    <span className="text-sm">{item}</span>
                                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6 flex md:justify-end">
                            <a href="#" className="text-[#815BF5] inline-flex items-center hover:underline">
                                Learn more about notifications <ArrowRight className="ml-1 h-4 w-4" />
                            </a>
                        </div>
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="md:pl-12 relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#815BF5]/10 to-[#FC8929]/10 rounded-xl blur-md"></div>
                        <Card className="overflow-hidden border-[#815BF5]/20 bg-[#0A0D28]/70 backdrop-blur-sm relative">
                            <div className="absolute top-4 right-4 animate-pulse">
                                <div className="relative">
                                    <BellRing className="h-6 w-6 text-[#FC8929]" />
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FC8929] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FC8929]"></span>
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-0">
                                <img 
                                    src='/product/notifications.png' 
                                    className='w-full h-auto rounded-t-xl object-cover' 
                                    alt="WhatsApp notifications" 
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}