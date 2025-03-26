import React from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs2, TabsList2, TabsTrigger2 } from '@/components/ui/tabs2'
import { Tabs3, TabsList3, TabsTrigger3 } from '@/components/ui/tabs3'

type SetupStep = {
    id: string;
    title: string;
    icon: string;
    description: string;
    image: string;
    badge?: string;
}

const setupSteps: SetupStep[] = [
    {
        id: "add-team",
        title: "Add Your Team",
        icon: "/product/icons/addteam.png",
        description: "Start by adding your teammates & assigning their reporting managers. All leave and attendance requests go straight to the right people for quick approval or rejection. Smooth, organized, and hassle-free!",
        image: "/product/addteam.png",
        badge: "Step 1"
    },
    {
        id: "register-faces",
        title: "Register Faces for Attendance",
        icon: "/product/icons/faceicon.png",
        description: "Have your team register their faces on the app. Our cutting-edge facial recognition feature uses your camera to handle logins and logouts. No more fuss with manual check-ins, just smile for the camera!",
        image: "/product/register.png",
        badge: "Step 2"
    },
    {
        id: "leave-types",
        title: "Define Leave Types",
        icon: "/product/icons/leavetype.png",
        description: "Customize your leave policies effortlessly. Define leave types such as casual, sick, or maternity leave. Set the total number of allotted leaves, whether they are paid or unpaid, and set durations.",
        image: "/product/leavetypes.png",
        badge: "Step 3"
    },
    {
        id: "holiday-calendar",
        title: "Setup Holiday Calendar",
        icon: "/product/icons/calendar.png",
        description: "Configure your company's holiday calendar to automatically mark holidays in the attendance system. Employees will see upcoming holidays in their dashboard.",
        image: "/product/holiday.png",
        badge: "Step 4"
    }
]

export default function SettingUp() {
    return (
        <div className='w-full py-24 bg-[#04061E] relative'>
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#05071E] to-transparent"></div>
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full filter blur-3xl"></div>

            <div className='max-w-6xl mx-auto px-4 relative z-10'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className='inline-block text-sm font-medium px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-orange-500/20 rounded-full text-purple-300 mb-4'>
                        QUICK IMPLEMENTATION
                    </h2>
                    <h3 className='font-bold text-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300'>
                        Up and Running in Minutes
                    </h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Setting up Zapllo&apos;s Leave & Attendance Tracker is a breeze with just 4 simple steps
                    </p>
                </motion.div>

                <Tabs3 defaultValue={setupSteps[0].id} className="w-full">
                    <TabsList3 className="w-full bg-transparent border-none mb-8 flex flex- justify-center gap-2">
                        {setupSteps.map((step) => (
                            <TabsTrigger3
                                key={step.id}
                                value={step.id}
                                className="bg-[#0A0D28]/50 border border-[#815BF5]/20 data-[state=active]:border-[#815BF5] data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#815BF5] data-[state=active]:to-[#FC8929] data-[state=active]:text-white rounded-full px-4 py-2"
                            >
                                <span className="hidden md:inline mr-2">{step.badge}</span>
                                {step.title}
                            </TabsTrigger3>
                        ))}
                    </TabsList3>

                    {setupSteps.map((step) => (
                        <TabsContent key={step.id} value={step.id} className="mt-6">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Card className="bg-[#0A0D28]/50 border-[#815BF5]/20 overflow-hidden">
                                        <CardContent className="p-6">
                                            <div className="flex items-start mb-4">
                                                <div className="mr-4">
                                                    <img src={step.icon} alt={step.title} className="h-16 w-16" />
                                                </div>
                                                <div>
                                                    <Badge className="mb-2 bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white border-none">
                                                        {step.badge}
                                                    </Badge>
                                                    <h3 className="text-xl font-bold">{step.title}</h3>
                                                </div>
                                            </div>

                                            <p className="text-gray-300 leading-relaxed">
                                                {step.description}
                                            </p>

                                            <div className="mt-6 border-t border-[#815BF5]/10 pt-6">
                                                <h4 className="text-sm font-medium text-[#815BF5] mb-3">
                                                    Benefits:
                                                </h4>
                                                <ul className="space-y-2">
                                                    {[
                                                        "Super easy to set up – takes just minutes",
                                                        "No technical knowledge required",
                                                        "Zapllo support team is always ready to help"
                                                    ].map((point, idx) => (
                                                        <li key={idx} className="flex items-start text-sm text-gray-400">
                                                            <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2 mt-0.5">
                                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 3L4.5 8.5L2 6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </div>
                                                            {point}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#815BF5] to-[#FC8929] blur-lg opacity-30 transform scale-95"></div>
                                    <div className="relative rounded-lg overflow-hidden border border-[#815BF5]/20">
                                        <img src={step.image} alt={step.title} className="w-full object-cover" />
                                    </div>

                                    <div className="absolute -bottom-4 -right-4 bg-[#0A0D28] rounded-full p-4 border border-[#815BF5]/20">
                                        <div className="text-2xl font-bold bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent">
                                            {setupSteps.findIndex(s => s.id === step.id) + 1}/{setupSteps.length}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs3>
            </div>
        </div>
    )
};