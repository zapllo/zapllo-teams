'use client'
import { InfiniteMoving2 } from '@/components/globals/infinite-moving2';
import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge';

type Props = {
    product: string;
}

export default function Business({ product }: Props) {
    return (
        <div className='py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#05071E] via-[#04061a] to-[#05071E] relative'>
            {/* Background effects */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#04061E] to-transparent z-0"></div>
            <div className="absolute -top-20 left-20 w-96 h-96 bg-[#815BF5]/5 rounded-full blur-3xl"></div>

            <div className='max-w-7xl mx-auto relative z-10'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <Badge className="mb-4 bg-[#0A0D28] text-[#815BF5] border-[#815BF5]/30">
                        TRUSTED BY BUSINESSES
                    </Badge>

                    <h2 className='text-3xl font-bold mb-4'>
                        Smart Business Owners using
                    </h2>

                    <h3 className='text-3xl font-bold mb-6'>
                        <span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent'>
                            {product}
                        </span>
                    </h3>

                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of forward-thinking businesses that are transforming their task management with Zapllo.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative mb-16"
                >
                    <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-24 bg-gradient-to-r from-[#815BF5]/10 via-[#FC8929]/10 to-[#815BF5]/10 blur-xl"></div>
                    <div className="bg-[#0A0D28]/70 backdrop-blur-sm border border-[#815BF5]/20 rounded-xl py-8">
                        <div className='w-full text-center justify-center flex gap-2'>
                            <InfiniteMoving2 />
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            stat: '20,000+',
                            label: 'Businesses',
                            description: 'Trust Zapllo for their task management'
                        },
                        {
                            stat: '245,900+',
                            label: 'Tasks',
                            description: 'Successfully completed every month'
                        },
                        {
                            stat: '5+ hrs',
                            label: 'Saved Daily',
                            description: 'Per employee on average'
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * i }}
                        >
                            <div className="bg-[#0A0D28]/70 backdrop-blur-sm border border-[#815BF5]/20 rounded-xl p-6 text-center hover:border-[#815BF5]/50 transition-all duration-300">
                                <h3 className="text-4xl font-bold mb-2">
                                    <span className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent">
                                        {item.stat}
                                    </span>
                                </h3>
                                <h4 className="text-xl font-medium mb-2">{item.label}</h4>
                                <p className="text-muted-foreground text-sm">{item.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}