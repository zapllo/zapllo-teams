'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { 
    Clock, 
    Settings, 
    Wifi, 
    Users, 
    CheckCircle2 
} from 'lucide-react'

const FeatureCard = ({ icon, image, title, description, delay = 0 }: { icon?: React.ReactNode; image?: string; title: string; description: string; delay?: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="bg-[#0A0D28]/80 border border-[#815bf5]/10 rounded-xl p-6 hover:border-[#815bf5]/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(129,91,245,0.1)]"
        >
            <div className="mb-4">
                {image ? (
                    <img src={image} className="h-12" alt={title} />
                ) : (
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#815bf5]/20 to-transparent flex items-center justify-center">
                        {icon}
                    </div>
                )}
            </div>
            <h3 className="font-bold mt-2 text-lg mb-2">{title}</h3>
            <p className="text-sm text-[#676B93]">{description}</p>
        </motion.div>
    )
}

export default function WeDifferent() {
    return (
        <div className='w-full py-24 bg-[#04061E] relative'>
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#05071E] to-transparent"></div>
            
            <div className='max-w-6xl mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <Badge variant="outline" className="px-4 py-2 border-purple-500/50 bg-purple-500/10 mb-6">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-400" />
                        Trusted by 20,000+ businesses
                    </Badge>
                    
                    <h2 className='text-center text-3xl font-bold mb-2'>
                        <span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent'>
                            India&apos;s No.1 SaaS for MSMEs
                            <span className='text-white ml-1'>
                                🚀
                            </span>
                        </span>
                    </h2>
                    <h3 className='text-center text-3xl font-bold mt-2 mb-6'>
                        Why are we Different?
                    </h3>
                </motion.div>

                <div className='grid md:grid-cols-3 gap-8 items-start'>
                    <div className='grid grid-cols-1 gap-8'>
                        <FeatureCard 
                            image='/product/icons/leavetype.png'
                            title="Login to All Apps"
                            description="Control all applications from a single, user-friendly interface, eliminating the need to switch between multiple tools"
                            delay={0.1}
                        />
                        
                        <FeatureCard 
                            image='/product/icons/setup.png'
                            title="No Technical Skills Required"
                            description="You can manage all your business processes and automations with easy drags and clicks. No tech expertise required."
                            delay={0.2}
                        />
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 blur-3xl rounded-full"></div>
                        <div className="relative z-10">
                            <img 
                                src='/product/benefits.png' 
                                className='rounded-xl object-cover shadow-[0_0_30px_rgba(129,91,245,0.3)] border border-[#815bf5]/30' 
                                alt="Zapllo Benefits"
                            />
                            
                            <div className="absolute top-4 left-12 transform -translate-x-1/2 bg-gradient-to-br from-[#1a1e48] to-[#0A0D28] border border-[#815bf5]/30 rounded-xl p-3 shadow-lg">
                                <div className="flex flex-col items-center">
                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-1">Verified</Badge>
                                    <p className="text-sm font-bold">4.9/5 Rating</p>
                                </div>
                            </div>
                            
                            <div className="absolute bottom-4 right-12 transform translate-x-1/2 bg-gradient-to-br from-[#1a1e48] to-[#0A0D28] border border-[#815bf5]/30 rounded-xl p-3 shadow-lg">
                                <div className="flex flex-col items-center">
                                    <Users className="h-5 w-5 text-[#815bf5] mb-1" />
                                    <p className="text-sm font-bold">20,000+ Users</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <div className='grid grid-cols-1 gap-8'>
                        <FeatureCard 
                            image='/product/icons/wifi.png'
                            title="24*7 Support"
                            description="Get assistance in real time 24x7 whether related to app usage, billing or guidance. Our team is always there to help."
                            delay={0.3}
                        />
                        
                        <FeatureCard 
                            image='/product/icons/records.png'
                            title="Access To Business Owners Community"
                            description="Connect with thousands of like-minded business owners who are also on a journey towards growth. Learn together and grow together."
                            delay={0.4}
                        />
                    </div>
                </div>
                
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-block mx-auto bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] rounded-full p-[1px]">
                        <div className="bg-[#04061E] rounded-full px-6 py-3">
                            <p className="text-lg font-medium text-white">
                                Join 20,000+ business owners revolutionizing their operations
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}