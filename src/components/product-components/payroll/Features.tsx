'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, UserCheck, Calendar, BarChart4, Bell, Zap } from 'lucide-react'
import { Tabs2, TabsList2, TabsTrigger2 } from '@/components/ui/tabs2'
import { Tabs3, TabsList3, TabsTrigger3 } from '@/components/ui/tabs3'

const features = [
    {
        id: "facial-recognition",
        icon: <UserCheck className="h-5 w-5" />,
        title: "AI Face Recognition Attendance",
        description: "Employees clock in/out with a simple selfie. No more buddy punching or time theft. Our advanced facial recognition system ensures 100% accurate attendance tracking.",
        image: "/product/face.png",
        color: "from-purple-500 to-blue-600",
        badge: "POPULAR"
    },
    {
        id: "easy-leave",
        icon: <Calendar className="h-5 w-5" />,
        title: "Easy Leave Application",
        description: "Simplified leave requests with instant manager notifications. Track balances and history with ease. Our intuitive interface makes leave management a breeze.",
        image: "/product/applyease.png",
        color: "from-blue-500 to-cyan-600"
    },
    {
        id: "attendance-reports",
        icon: <BarChart4 className="h-5 w-5" />,
        title: "Comprehensive Reports",
        description: "Get detailed insights into attendance patterns, leave trends, and productivity metrics. Make data-driven decisions to optimize your workforce.",
        image: "/product/attendance-reg.png",
        color: "from-orange-500 to-pink-600"
    },
    {
        id: "backdated",
        icon: <Clock className="h-5 w-5" />,
        title: "Regularization Requests",
        description: "Allow employees to submit attendance corrections for missed check-ins. Managers can approve or reject these requests with complete audit trail.",
        image: "/product/backdated.png",
        color: "from-green-500 to-emerald-600"
    },
    {
        id: "notifications",
        icon: <Bell className="h-5 w-5" />,
        title: "Automated Notifications",
        description: "WhatsApp & email alerts for leave approvals, rejections, and attendance reminders. Keep everyone in the loop automatically.",
        image: "/product/notifications2.png",
        color: "from-red-500 to-rose-600"
    },
    {
        id: "integration",
        icon: <Zap className="h-5 w-5" />,
        title: "Seamless Integration",
        description: "Works perfectly with payroll, HRMS, and other business systems. Eliminate duplicate data entry and streamline your operations.",
        image: "/product/face.png",
        color: "from-purple-500 to-indigo-600"
    }
]

export default function PayrollFeatures() {
    const [activeTab, setActiveTab] = useState(features[0].id);

    return (
        <div className='w-full py-24 bg-[#05071E] relative'>
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#04061E] to-transparent"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>

            <div className='max-w-6xl mx-auto px-4 relative z-10'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className='inline-block text-sm font-medium px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-orange-500/20 rounded-full text-purple-300 mb-4'>
                        POWERFUL FEATURES
                    </h2>
                    <h3 className='font-bold text-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300'>
                        Everything You Need, Nothing You Don&apos;t
                    </h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Our Leave & Attendance Tracker is packed with features that streamline your workforce management
                    </p>
                </motion.div>

                <Tabs3 defaultValue={features[0].id} value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="md:w-1/2 order-2 md:order-1">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="relative aspect-video rounded-xl overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0D28] to-[#1a1e48]/80 backdrop-blur-sm"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {features.find(f => f.id === activeTab)?.image && (
                                        <img
                                            src={features.find(f => f.id === activeTab)?.image}
                                            alt={features.find(f => f.id === activeTab)?.title}
                                            className="object-contain max-h-full max-w-full p-4"
                                        />
                                    )}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#05071E] to-transparent h-1/4"></div>
                            </motion.div>
                        </div>

                        <div className="md:w-1/2 order-1 md:order-2">
                            <TabsList3 className="grid grid-cols-2 md:grid-cols-3 gap-4 border-none  bg-transparent">
                                {features.map((feature) => (
                                    <TabsTrigger3
                                        key={feature.id}
                                        value={feature.id}
                                        className={`bg-[#0A0D28]/50 border rounded border-[#815BF5]/20 data-[state=active]:border-[#815BF5] data-[state=active]:bg-gradient-to-br data-[state=active]:${feature.color} data-[state=active]:text-white flex items-center justify-center`}
                                    >
                                        <div className="flex items-center">
                                            {feature.icon}
                                            <span className="ml-2 hidden md:inline">{feature.title.split(' ')[0]}</span>
                                        </div>
                                    </TabsTrigger3>
                                ))}
                            </TabsList3>

                            {features.map((feature) => (
                                <TabsContent key={feature.id} value={feature.id} className="pt-6 mt-10">
                                    <Card className="bg-[#0A0D28]/50 border-[#815BF5]/20">
                                        <CardContent className="p-6">
                                            <div className="flex items-center mb-4">
                                                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mr-3`}>
                                                    {feature.icon}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold flex items-center">
                                                        {feature.title}
                                                        {feature.badge && (
                                                            <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
                                                                {feature.badge}
                                                            </Badge>
                                                        )}
                                                    </h4>
                                                </div>
                                            </div>

                                            <p className="text-gray-300 leading-relaxed mt-2">
                                                {feature.description}
                                            </p>

                                            <ul className="mt-4 space-y-2">
                                                {[
                                                    "Highly accurate and secure",
                                                    "Works on any device with a camera",
                                                    "No additional hardware required"
                                                ].map((point, idx) => (
                                                    <li key={idx} className="flex items-start">
                                                        <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2 mt-0.5">
                                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 3L4.5 8.5L2 6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-sm text-gray-400">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}
                        </div>
                    </div>
                </Tabs3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    {[
                        {
                            title: "Time Saved",
                            value: "20hrs",
                            description: "Weekly for your HR team",
                            icon: <Clock className="h-6 w-6 text-purple-400" />
                        },
                        {
                            title: "Accuracy Increase",
                            value: "99.8%",
                            description: "In attendance records",
                            icon: <UserCheck className="h-6 w-6 text-blue-400" />
                        },
                        {
                            title: "ROI",
                            value: "365%",
                            description: "Average return on investment",
                            icon: <BarChart4 className="h-6 w-6 text-orange-400" />
                        }
                    ].map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <Card className="bg-[#0A0D28]/50 border-[#815BF5]/20 overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-gray-400 text-sm font-medium">{stat.title}</h4>
                                            <div className="mt-2 flex items-baseline">
                                                <p className="text-4xl font-bold bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent">{stat.value}</p>
                                                <p className="ml-2 text-sm text-gray-500">{stat.description}</p>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-full bg-[#1a1e48]">
                                            {stat.icon}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
};