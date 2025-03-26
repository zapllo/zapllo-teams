'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock, BarChart3 as ChartBar, Users, CheckCircle, Award } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

type BenefitProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
}

const Benefit = ({ icon, title, description, delay }: BenefitProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5 }}
        >
            <Card className="bg-[#0A0D28]/60 border-[#815BF5]/20 h-full hover:border-[#815BF5]/50 transition-all duration-300">
                <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#815BF5] to-[#FC8929] flex items-center justify-center mb-4">
                        {icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm">{description}</p>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default function Benefits() {
    // State for the ROI calculator
    const [employees, setEmployees] = useState(25);
    const [annualSavings, setAnnualSavings] = useState(625000); // Initial value: 25 * 25000

    // Calculate savings when employee count changes
    useEffect(() => {
        const savingsPerEmployee = 25000; // ₹25,000 per employee per year
        setAnnualSavings(employees * savingsPerEmployee);
    }, [employees]);

    // Format number with commas
    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('en-IN').format(num);
    };

    const benefits = [
        {
            icon: <MapPin className="h-6 w-6 text-white" />,
            title: "Anywhere Access",
            description: "Mark attendance from any location, using any device with a camera. Perfect for remote or hybrid teams."
        },
        {
            icon: <Clock className="h-6 w-6 text-white" />,
            title: "Save Time Daily",
            description: "Automate tedious tasks like attendance tracking and leave management to save hours every week."
        },
        {
            icon: <ChartBar className="h-6 w-6 text-white" />,
            title: "Enhance Productivity",
            description: "Track and improve employee productivity with comprehensive performance analytics."
        },
        {
            icon: <Users className="h-6 w-6 text-white" />,
            title: "Streamlined Workflows",
            description: "Provide your team with instant access to attendance and leave records with just a few clicks."
        },
        {
            icon: <CheckCircle className="h-6 w-6 text-white" />,
            title: "Easy Approval System",
            description: "Save time by applying for leaves online and get them approved quickly through the automated system."
        },
        {
            icon: <Award className="h-6 w-6 text-white" />,
            title: "Performance Tracking",
            description: "Improve company results by tracking each employee's attendance patterns and performance metrics."
        }
    ];

    return (
        <div className='w-full py-24 bg-[#05071E] relative'>
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#04061E] to-transparent"></div>
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full filter blur-3xl"></div>
            
            <div className='max-w-6xl mx-auto px-4 relative z-10'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className='inline-block text-sm font-medium px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-orange-500/20 rounded-full text-purple-300 mb-4'>
                        WHY BUSINESSES CHOOSE US
                    </h2>
                    <h3 className='font-bold text-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300'>
                        Transform Your Workforce Management
                    </h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Join thousands of Indian businesses that are revolutionizing how they manage attendance and leave
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {benefits.map((benefit, index) => (
                        <Benefit 
                            key={index}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                            delay={index * 0.1}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-16 bg-[#0A0D28] border border-[#815BF5]/20 rounded-xl overflow-hidden"
                >
                    <div className="grid md:grid-cols-2">
                        <div className="p-8 flex flex-col justify-center">
                            <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 rounded-full">
                                <span className="text-sm font-medium bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent">
                                    ROI CALCULATOR
                                </span>
                            </div>
                            
                            <h3 className="text-2xl font-bold mb-4">
                                Calculate Your Savings
                            </h3>
                            
                            <p className="text-gray-400 mb-6">
                                On average, businesses save <span className="font-bold text-white">₹25,000 per employee per year</span> by implementing our Leave & Attendance Tracker. See how much your business could save:
                            </p>
                            
                            <div className="p-4 bg-[#0D102E] rounded-lg border border-[#815BF5]/20 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-400">Number of Employees:</span>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="font-bold text-white bg-[#1a1e48] px-3 py-1 rounded-md">
                                                    {employees}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                <p className="text-xs">Drag the slider to adjust</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                
                                <Slider
                                    defaultValue={[25]}
                                    value={[employees]}
                                    onValueChange={(values) => setEmployees(values[0])}
                                    max={500}
                                    min={5}
                                    step={1}
                                    className="w-full my-4"
                                />
                                
                                <div className="flex justify-between text-xs text-gray-500 mb-6">
                                    <span>5</span>
                                    <span>100</span>
                                    <span>250</span>
                                    <span>500</span>
                                </div>
                                
                                <div className="mt-6 p-4 bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Estimated Annual Savings:</span>
                                        <motion.span 
                                            key={annualSavings}
                                            initial={{ scale: 1 }}
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 0.3 }}
                                            className="text-2xl font-bold bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent"
                                        >
                                            ₹{formatNumber(annualSavings)}
                                        </motion.span>
                                    </div>
                                </div>
                                
                                <div className="mt-4 text-xs text-gray-500 text-center">
                                    *Based on average time savings and productivity improvements reported by our customers
                                </div>
                            </div>
                            
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-green-400 font-medium">Additional benefits:</p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Reduced paperwork, increased compliance, improved employee satisfaction, and better decision-making with accurate data.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-[#141841] to-[#0A0D28] flex items-center justify-center p-8 relative">
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500 rounded-full filter blur-3xl"></div>
                            </div>
                            <img 
                                src="/product/benefits.png" 
                                alt="Benefits" 
                                className="relative z-10 max-h-80 object-contain" 
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}