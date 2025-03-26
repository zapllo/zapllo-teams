'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'

export default function SettingUp() {
    return (
        <div className='py-24 px-4 sm:px-6 lg:px-8 bg-[#05071E] relative'>
            {/* Background elements */}
            <div className="absolute -top-40 right-0 w-96 h-96 bg-[#FC8929]/5 rounded-full blur-3xl"></div>
            
            <div className='max-w-7xl mx-auto'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-4 bg-[#0A0D28] text-[#815BF5] border-[#815BF5]/30">
                        HOW IT WORKS
                    </Badge>
                    
                    <h2 className='text-3xl font-bold mb-4'>
                        <span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent'>
                            Task Delegation App
                        </span>
                    </h2>
                    
                    <h3 className='font-bold text-center mb-6 text-xl md:text-3xl'>
                        How Zapllo Tasks Work?
                    </h3>
                    
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Get started in minutes with our simple 4-step process. No technical skills required!
                    </p>
                </motion.div>

                <div className="relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#815BF5] to-[#FC8929]/50 hidden md:block"></div>
                    
                    <div className="space-y-24 relative">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className='grid md:grid-cols-2 gap-8 items-center relative'
                        >
                            <div className="md:text-right md:pr-12">
                                <div className="hidden md:block absolute -left-8 w-[100%] top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white font-bold text-lg shadow-lg">
                                        1
                                    </div>
                                </div>
                                
                                <div className="flex md:justify-end">
                                    <div className="p-2 bg-[#0A0D28] rounded-lg md:order-2 mb-4">
                                        <img src='/product/icons/setup.png' className='h-16 w-16' alt="Setup" />
                                    </div>
                                </div>
                                
                                <h3 className='md:text-3xl text-2xl font-bold mb-4'>Setup your Account</h3>
                                
                                <p className='text-muted-foreground max-w-lg'>
                                    Add your teammates, assign roles to each member and ensure everyone knows their daily, weekly and monthly tasks.
                                </p>
                                
                                <div className="mt-6 space-y-3">
                                    {['Add team members', 'Create departments', 'Assign roles & permissions'].map((item, i) => (
                                        <div key={i} className="flex items-center md:justify-end gap-2">
                                            <span className="text-sm">{item}</span>
                                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                                        </div>
                                    ))}
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
                                <Card className="overflow-hidden border-[#815BF5]/20 bg-[#0A0D28]/70 backdrop-blur-sm">
                                    <CardContent className="p-0">
                                        <img 
                                            src='/product/addmember.png' 
                                            className='w-full h-auto rounded-t-xl object-cover' 
                                            alt="Add team members interface" 
                                        />
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}