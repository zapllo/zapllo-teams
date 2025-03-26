'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Sample testimonial data - replace with actual data
const testimonials = [
    {
        name: "Rahul Sharma",
        role: "CEO, TechSolutions India",
        avatar: "/testimonials/avatar1.png",
        content: "Zapllo has completely transformed how we manage our business operations. The task delegation app alone has saved our team over 20 hours per week!",
        rating: 5,
        company: "TechSolutions",
        highlight: "20 hours saved weekly"
    },
    {
        name: "Priya Patel",
        role: "Founder, StyleHub",
        avatar: "/testimonials/avatar2.png",
        content: "The WhatsApp Business integration has doubled our customer engagement. We're now able to respond to inquiries 24/7 with the automated system.",
        rating: 5,
        company: "StyleHub",
        highlight: "2x customer engagement"
    },
    {
        name: "Vikram Singh",
        role: "Operations Manager, LogiTech",
        avatar: "/testimonials/avatar3.png",
        content: "The payroll system has eliminated all the manual work we used to do. Attendance tracking is seamless and our HR team can now focus on more strategic tasks.",
        rating: 5,
        company: "LogiTech",
        highlight: "Zero manual work"
    }
]

interface Testimonial {
    name: string;
    role: string;
    avatar: string;
    content: string;
    rating: number;
    company: string;
    highlight: string;
}

const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
        >
            <Card className="bg-gradient-to-br from-[#1a1e48]/80 to-[#0A0D28] border-[#815bf5]/20 hover:border-[#815bf5]/50 h-full transition-all duration-300 overflow-hidden group relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#815BF5] to-[#FC8929] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                <CardContent className="p-6 relative z-10">
                    <Badge variant="outline" className="absolute top-3 right-3 bg-[#0A0D28]/80 border-[#815bf5]/30 text-[#FC8929] font-semibold">
                        {testimonial.highlight}
                    </Badge>

                    <div className="flex items-start mb-4">
                        <Avatar className="h-12 w-12 border-2 border-[#815bf5]/30 mr-3">
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white">
                                {testimonial.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="font-bold">{testimonial.name}</h4>
                            <p className="text-xs text-[#676B93]">{testimonial.role}</p>

                            <div className="flex mt-1">
                                {Array(5).fill(0).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <Quote className="h-5 w-5 absolute -top-2 -left-2 text-[#815bf5]/30" />
                        <p className="text-sm text-[#A7ABCD] leading-relaxed pt-2">{testimonial.content}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#815bf5]/10">
                        <div className="flex justify-between items-center">
                            <Badge variant="outline" className="bg-[#0A0D28] border-[#815bf5]/30">
                                {testimonial.company}
                            </Badge>
                            <span className="text-xs text-[#676B93]">Verified Customer</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default function PayrollTestimonials() {
    return (
        <div className='w-full py-24 bg-[#04061E] relative'>
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#05071E] to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-orange-500/10 rounded-full filter blur-3xl"></div>

            <div className='max-w-6xl mx-auto px-4 relative z-10'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className='inline-block text-sm font-medium px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-orange-500/20 rounded-full text-purple-300 mb-4'>
                        TRUSTED BY LEADING BUSINESSES
                    </h2>
                    <h3 className='font-bold text-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300'>
                        Success Stories From Our Customers
                    </h3>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        See how businesses like yours are achieving remarkable results with our Leave & Attendance Tracker
                    </p>
                </motion.div>

                {/* Featured testimonial */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-16"
                >
                    <Card className="bg-gradient-to-br from-[#1a1e48]/80 to-[#0A0D28] border-[#815bf5]/20 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#815BF5] to-[#FC8929]"></div>
                        <CardContent className="p-0">
                            <div className="grid md:grid-cols-2">
                                <div className="p-8 flex flex-col justify-center relative">
                                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white border-none">
                                        Featured Story
                                    </Badge>

                                    <div className="inline-block mb-6">
                                        <img src="/icons/quote.svg" alt="Quote" className="h-12 w-12" onError={(e) => { e.currentTarget.src = 'https://api.iconify.design/mdi:comment-quote.svg?color=%23815BF5' }} />
                                    </div>

                                    <p className="text-lg mb-6 leading-relaxed text-gray-200">
                                        &quot;Since implementing Zapllo across our business, we&apos;ve seen a <span className="text-white font-bold bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent">30% increase in productivity</span> and saved countless hours on manual tasks. The facial recognition attendance system eliminated our time theft issues completely.&quot;
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-14 w-14 border-2 border-[#815bf5]/30">
                                            <AvatarImage src="/testimonials/featured-avatar.png" alt="Featured testimonial" />
                                            <AvatarFallback className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white">JS</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-bold text-lg">Jaidev Singh</h4>
                                            <p className="text-sm text-[#676B93]">Founder & CEO, InnovateX</p>
                                            <div className="flex mt-1">
                                                {Array(5).fill(0).map((_, i) => (
                                                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-[#141841] to-[#0A0D28] flex items-center justify-center p-8 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-20">
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl"></div>
                                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500 rounded-full filter blur-3xl"></div>
                                    </div>
                                    <div className="relative z-10">
                                        <img
                                            src="/testimonials/featured-company.png"
                                            alt="InnovateX"
                                            className="max-h-80 object-contain"
                                            onError={(e) => { e.currentTarget.src = '/product/benefits.png' }}
                                        />
                                        <div className="mt-6 bg-[#0A0D28]/70 rounded-lg p-4 border border-[#815bf5]/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex">
                                                    {Array(3).fill(0).map((_, i) => (
                                                        <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-r from-[#815BF5] to-[#FC8929] flex items-center justify-center text-white text-xs font-bold border-2 border-[#0A0D28] -ml-2 first:ml-0">
                                                            {String.fromCharCode(65 + i)}
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-400">+17 team members using Zapllo</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-white font-medium">Results:</div>
                                                <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30">
                                                    30% Productivity Increase
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Testimonial grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} index={index} />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-16 text-center"
                >
                    <Link href="/customer-stories">
                        <Button size="lg" variant="outline" className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent border-[#815BF5]/30 hover:border-[#815BF5] rounded-full px-8 py-6 text-lg font-medium transition-all max-w-xl w-full  duration-300 hover:shadow-[0_0_20px_rgba(129,91,245,0.3)]">
                            <span>View All Customer Success Stories</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}