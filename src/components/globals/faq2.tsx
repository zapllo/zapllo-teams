'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Badge } from '../ui/badge'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'

export default function Faq2() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const faqCategories = [
        { id: 'all', name: 'All Questions' },
        { id: 'attendance', name: 'Attendance Tracking' },
        { id: 'leave', name: 'Leave Management' },
        { id: 'implementation', name: 'Setup & Implementation' }
    ];

    const faqs = [
        {
            question: "What is the Attendance Tracker?",
            answer: "This is a feature that allows employees to clock in and out of their shifts electronically using facial recognition. It can also capture their location for enhanced security and verification.",
            category: "attendance",
            popular: true
        },
        {
            question: "What are the benefits of Attendance Tracking?",
            answer: "It simplifies timekeeping, reduces errors, and provides accurate data for payroll processing. It also eliminates time theft, buddy punching, and manual record-keeping errors.",
            category: "attendance"
        },
        {
            question: "What is Leave Management and how does it work?",
            answer: "This feature streamlines the process of requesting, tracking, and approving employee leave. Employees submit leave requests electronically, specifying the type and duration. Managers can then review and approve or deny the request through the system.",
            category: "leave",
            popular: true
        },
        {
            question: "Do I need both Attendance Tracking and Leave Management?",
            answer: "No, it depends on your needs. However, using both offers a comprehensive solution for managing employee time and leave, providing you with complete workforce visibility.",
            category: "implementation"
        },
        {
            question: "What are the advantages of using both features together?",
            answer: "They provide a centralized platform for all employee time-related data, streamlining processes and improving overall HR efficiency. This integration also ensures your leave records and attendance data are always in sync.",
            category: "implementation"
        },
        {
            question: "Can I track remote employee attendance?",
            answer: "Yes, our Attendance Tracker offers mobile app options with features like geolocation capture and facial recognition to ensure remote employees are clocking in/out from designated locations.",
            category: "attendance"
        },
        {
            question: "What happens if there are attendance discrepancies?",
            answer: "Reporting managers will be able to see such discrepancies including missed punches. Employees can then address these within the platform for approval through our regularization process.",
            category: "attendance"
        },
        {
            question: "What types of leave can be tracked?",
            answer: "The system can be customized to accommodate various leave types like sick leave, vacation time, personal days, maternity/paternity leave, and any other custom categories your organization requires.",
            category: "leave"
        },
        {
            question: "Can employees see their remaining leave balance?",
            answer: "Yes, our Leave Management system provides a self-service portal where employees can view their leave requests, approvals, and remaining leave balances in real-time.",
            category: "leave",
            popular: true
        },
        {
            question: "What happens if employees forgot to mark attendance?",
            answer: "Employees can mark attendance for past dates using our Regularisation form. Once the employee submits this request, the reporting manager shall approve or reject such attendance based on company policy.",
            category: "attendance"
        },
        {
            question: "Is there any training required to use the system?",
            answer: "Most features are user-friendly and require minimal training. However, we offer comprehensive onboarding resources, live training sessions, and 24/7 support to ensure your team gets the most out of the system.",
            category: "implementation"
        },
        {
            question: "How can this package help me improve my business efficiency?",
            answer: "By automating tasks, streamlining workflows, and improving communication, our Leave & Attendance Tracker can significantly boost your overall business efficiency and typically saves businesses 5-10 hours per week in administrative tasks.",
            category: "implementation",
            popular: true
        }
    ];

    // Filter FAQs based on search query and active category
    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="w-full py-16 relative overflow-hidden">
            <div className="absolute top-1/4 -right-64 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
            <div className="absolute bottom-0 -left-64 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <span className="inline-block text-sm font-medium px-4 py-1.5 bg-gradient-to-r from-purple-500/20 to-orange-500/20 rounded-full text-purple-300 mb-4">
                        FREQUENTLY ASKED QUESTIONS
                    </span>
                    <h2 className="text-3xl font-bold mb-4">
                        Got Questions? We&apos;ve Got Answers
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Everything you need to know about our Leave & Attendance Tracker
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-[#0A0D28]/50 border-[#815BF5]/20 focus:border-[#815BF5] w-full py-6 rounded-lg"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 flex flex-wrap justify-center gap-2"
                >
                    {faqCategories.map(category => (
                        <Badge
                            key={category.id}
                            variant={activeCategory === category.id ? "default" : "outline"}
                            className={`cursor-pointer px-4 py-2 rounded-full text-sm ${activeCategory === category.id
                                    ? "bg-gradient-to-r from-[#815BF5] to-[#FC8929] border-none"
                                    : "bg-[#0A0D28]/50 border-[#815BF5]/20 hover:border-[#815BF5]/50"
                                }`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            {category.name}
                        </Badge>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-4"
                >
                    {filteredFaqs.length > 0 ? (
                        <Accordion type="single" collapsible className="space-y-4">
                            {filteredFaqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="bg-[#0A0D28]/50 border border-[#815BF5]/20 rounded-lg overflow-hidden mb-4 shadow-sm"
                                >
                                    <AccordionTrigger className="px-6 py-4 hover:bg-[#141841]/50 transition-all duration-200 group">
                                        <div className="flex items-center text-left">
                                            <span className="mr-3 text-lg text-gray-200 font-medium group-hover:text-white transition-colors">
                                                {faq.question}
                                            </span>
                                            {faq.popular && (
                                                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 ml-2">
                                                    Popular
                                                </Badge>
                                            )}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4 pt-2 text-gray-400 leading-relaxed">
                                        <div className="border-l-2 border-[#815BF5]/50 pl-4">
                                            {faq.answer}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-[#815BF5]/10 flex justify-between items-center">
                                            <Badge
                                                variant="outline"
                                                className="bg-[#141841]/50 text-xs capitalize border-[#815BF5]/20"
                                            >
                                                {faq.category}
                                            </Badge>

                                            <div className="flex space-x-2">
                                                <span className="text-xs text-gray-500">Was this helpful?</span>
                                                <button className="text-xs text-[#815BF5] hover:text-[#FC8929] transition-colors">
                                                    Yes
                                                </button>
                                                <button className="text-xs text-[#815BF5] hover:text-[#FC8929] transition-colors">
                                                    No
                                                </button>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="text-center py-10 bg-[#0A0D28]/50 border border-[#815BF5]/20 rounded-lg">
                            <div className="mb-4">
                                <Search className="h-10 w-10 mx-auto text-gray-500" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No results found</h3>
                            <p className="text-gray-400 text-sm max-w-md mx-auto">
                                We couldn&apos;t find any FAQs matching your search. Try using different keywords or contact our support team.
                            </p>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <div className="bg-[#0A0D28] border border-[#815BF5]/20 rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-2">Still have questions?</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Our support team is ready to help you with any other questions you might have.
                        </p>
                        <a
                            href="mailto:support@zapllo.com"
                            className="inline-block px-6 py-2 bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white rounded-full font-medium hover:shadow-lg hover:shadow-[#815BF5]/20 transition-all duration-300"
                        >
                            Contact Support
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}