"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import {
    FacebookIcon,
    TwitterIcon,
    InstagramIcon,
    LinkedinIcon,
    SendIcon,
    ArrowRight,
    RocketIcon,
    GithubIcon
} from 'lucide-react'
import { FaAppStore, FaGooglePlay } from 'react-icons/fa'

export default function Footer() {
    const [email, setEmail] = useState('')
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (email) {
            try {
                const response = fetch('/api/subscribers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });



                // setSubscribed(true);
                setEmail('');
            } catch (err) {
                // setError('Something went wrong');
            }
            setIsSubscribed(true)
            setTimeout(() => setIsSubscribed(false), 3000)
        }
    }

    const navigationLinks = [
        {
            name: 'Products', links: [
                { name: 'Task Delegation App', href: '/products/zapllo-teams' },
                { name: 'Zapllo Payroll', href: '/products/zapllo-payroll' },
                { name: 'WhatsApp API', href: '#' },
                { name: 'Zapllo CRM', href: 'https://crm.zapllo.com' },
            ]
        },
        {
            name: 'Company', links: [
                { name: 'About Us', href: '/about' },
                { name: 'Careers', href: 'https://zapllo.notion.site/Work-at-Zapllo-9c970622e3d142919bdca4c42ee38aab?pvs=4' },
                { name: 'Press', href: '/pressRelease' },
                { name: 'Blog', href: '/blog' },
            ]
        },
        {
            name: 'Resources', links: [
                { name: 'Documentation', href: '/docs' },
                { name: 'Support', href: '/support' },
                { name: 'Contact', href: '/contact' },
                { name: 'Community', href: '/community' },
            ]
        },
    ]

    return (
        <footer className='w-full pt-20 pb-8 bg-[#04061e] overflow-hidden'>
            {/* Top CTA section */}
            <div className="max-w-7xl mx-auto px-4 mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-[#1a1e48]/80 to-[#0A0D28] border border-[#815bf5]/20 rounded-xl p-8 shadow-[0_0_30px_rgba(129,91,245,0.15)] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-1/3 h-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#815BF5]/30 z-0"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.img
                                src="/icons/rocket.png"
                                alt="Get started"
                                className="h-40 opacity-60 transform -rotate-12"
                                animate={{ y: [0, -10, 0], rotate: [-12, -6, -12] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            />
                        </div>
                    </div>

                    <div className="relative z-10 max-w-3xl">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform your business operations?</h2>
                        <p className="text-[#676B93] mb-8">Join 20,000+ businesses that are saving time, boosting productivity, and growing faster with Zapllo&apos;s automation platform.</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/signup">
                                <Button className="py-6 bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white rounded-full hover:opacity-90 transition-all text-lg">
                                    Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>

                            <Link href='https://masterclass.zapllo.com/workshop/'>
                                <Button variant="outline" className="py-6 bg-transparent border border-[#815BF5] text-[#815BF5] rounded-full hover:bg-[#815BF5]/10 transition-all text-lg">
                                    Join Live Masterclass <RocketIcon className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className='max-w-7xl mx-auto px-4'>
                <Separator className='w-full mb-12 opacity-30' />

                {/* Main footer content */}
                <div className='grid grid-cols-1 md:grid-cols-12 gap-8 mb-12'>
                    {/* Logo and social links */}
                    <div className='col-span-1 md:col-span-4'>
                        <img src='/logo.png' className='h-8 mb-6' alt="Zapllo Logo" />
                        <p className="text-[#676B93] mb-6 max-w-sm">Helping businesses automate their operations and get freedom from daily firefighting.</p>

                        <div className='flex gap-4 mb-8'>
                            <a href="https://twitter.com/zapllohq" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-[#141841] flex items-center justify-center hover:bg-[#815BF5]/20 transition-colors">
                                <TwitterIcon size={18} />
                            </a>
                            <a href="https://www.facebook.com/zapllohq" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-[#141841] flex items-center justify-center hover:bg-[#815BF5]/20 transition-colors">
                                <FacebookIcon size={18} />
                            </a>
                            <a href="https://www.instagram.com/zapllohq" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-[#141841] flex items-center justify-center hover:bg-[#815BF5]/20 transition-colors">
                                <InstagramIcon size={18} />
                            </a>
                            <a href="https://www.linkedin.com/company/zapllo" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-[#141841] flex items-center justify-center hover:bg-[#815BF5]/20 transition-colors">
                                <LinkedinIcon size={18} />
                            </a>
                            {/* <a href="https://github.com/zapllo" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-[#141841] flex items-center justify-center hover:bg-[#815BF5]/20 transition-colors">
                                <GithubIcon size={18} />
                            </a> */}
                        </div>
                    </div>

                    {/* Navigation links */}
                    {navigationLinks.map((section, i) => (
                        <div key={i} className='col-span-1 md:col-span-2'>
                            <h3 className="font-bold mb-4 text-lg">{section.name}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link, j) => (
                                    <li key={j}>
                                        <Link href={link.href} className="text-[#676B93] hover:text-white transition-colors">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter subscription */}
                    <div className='col-span-1 md:col-span-4'>
                        <div className="bg-gradient-to-br from-[#1a1e48]/50 to-[#0A0D28] border border-[#815bf5]/10 rounded-xl p-4">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="h-12 w-12 bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <SendIcon className="h-5 w-5 text-[#815BF5]" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Subscribe to Zapllo Insider</h3>
                                    <p className="text-[#676B93] text-sm">Get the latest updates on how technology is transforming businesses</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubscribe} className="space-y-3">
                                <div className="flex gap-2">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="bg-[#0A0D28] border-[#815bf5]/20 focus:border-[#815bf5] rounded-lg"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isSubscribed}
                                        className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white hover:opacity-90"
                                    >
                                        {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                                    </Button>
                                </div>
                                <p className="text-xs text-[#676B93]">
                                    We respect your privacy. Unsubscribe at any time.
                                </p>
                            </form>
                        </div>

                        {/* Mobile app badges */}
                        <div className="mt-6">
                            <p className="text-sm text-[#676B93] mb-3">Download our mobile app:</p>
                            <div className="flex gap-3">
                                <a href="#" className="bg-[#141841] rounded-lg p-2 hover:bg-[#1a1e48] transition-colors">
                                 <FaAppStore className="h-8 w-16" />
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.zapllo.app&hl=en" className="bg-[#141841] rounded-lg p-2 hover:bg-[#1a1e48] transition-colors">
                                       <FaGooglePlay className="h-8 w-16" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className='w-full mb-8 opacity-30' />

                {/* Footer bottom section */}
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                    <div>
                        <p className='text-[#676B93] text-sm'>
                            Copyright © {new Date().getFullYear()} Zapllo Technologies Private Limited. All rights reserved.
                        </p>
                        <p className='text-[#676B93] text-xs mt-1 max-w-2xl'>
                            This site is not a part of the Facebook website or Facebook Inc. Additionally, This site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.
                        </p>
                    </div>

                    <div className='flex text-xs text-nowrap gap-4 items-center'>
                        <Link href='/privacypolicy' className='text-[#676B93] text-xs hover:text-white transition-colors'>
                            Privacy Policy
                        </Link>
                        <span className='text-[#676B93]'>•</span>
                        <Link href='/terms' className='text-[#676B93] text-xs hover:text-white transition-colors'>
                            Terms of Service
                        </Link>
                        <span className='text-[#676B93]'>•</span>
                        <Link href='/disclaimer' className='text-[#676B93] text-xs hover:text-white transition-colors'>
                            Disclaimer
                        </Link>
                        <span className='text-[#676B93]'>•</span>
                        <Link href='/refundpolicy' className='text-[#676B93] text-xs hover:text-white transition-colors'>
                            Refund Policy
                        </Link>
                        <span className='text-[#676B93]'>•</span>
                        <Link href='/cancellation-policy' className='text-[#676B93] text-xs hover:text-white transition-colors'>
                           Cancellation Policy
                        </Link>  <span className='text-[#676B93]'>•</span>
                        <Link href='/payment-terms' className='text-[#676B93] text-xs hover:text-white transition-colors'>
                            Payment Terms
                        </Link>
                    </div>
                </div>

                {/* Security badge */}
                <div className="flex justify-center mt-8">
                    <div className="bg-[#141841] rounded-full px-4 py-2 flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="#815BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 12L11 14L15 10" stroke="#815BF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-xs text-[#676B93]">🔒 Secure payments powered by Razorpay</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
