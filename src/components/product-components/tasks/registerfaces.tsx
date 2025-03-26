'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function SettingUp2() {
    return (
        <div className='py-24 px-4 sm:px-6 lg:px-8 bg-[#05071E] relative'>
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FC8929]/50 to-[#815BF5] hidden md:block"></div>
            
            <div className='max-w-7xl mx-auto'>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className='grid md:grid-cols-2 gap-8 items-center relative'
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="md:pr-12 relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FC8929]/10 to-[#815BF5]/10 rounded-xl blur-md"></div>
                        <Card className="overflow-hidden border-[#815BF5]/20 bg-[#0A0D28]/70 backdrop-blur-sm">
                            <CardContent className="p-0">
                                <img 
                                    src='/product/assign.png' 
                                    className='w-full h-auto rounded-t-xl object-cover' 
                                    alt="Task assignment interface" 
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                    
                    <div className="md:pl-12 relative">
                        <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-[#FC8929] to-[#815BF5] text-white font-bold text-lg shadow-lg">
                                2
                            </div>
                        </div>
                        
                        <div className="flex">
                            <div className="p-2 bg-[#0A0D28] rounded-lg mb-4">
                                <img src='/product/icons/delegate.png' className='h-16 w-16' alt="Delegate" />
                            </div>
                        </div>
                        
                        <h3 className='md:text-3xl text-2xl font-bold mb-4'>Delegate Tasks to your team</h3>
                        
                        <p className='text-muted-foreground max-w-lg mb-6'>
                            Create clear, actionable tasks with deadlines and priorities. Assign team members and watch productivity soar as everyone knows exactly what they need to do.
                        </p>
                        
                        <div className="space-y-3">
                            {[
                                'Create detailed task descriptions',
                                'Set deadlines and priorities',
                                'Add audio notes for clear instructions',
                                'Attach relevant files and resources'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6">
                            <a href="#" className="text-[#815BF5] inline-flex items-center hover:underline">
                                See how task delegation works <ArrowRight className="ml-1 h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}