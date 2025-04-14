'use client'
import Footer from '@/components/globals/Footer'
import ContactForm from '@/components/globals/contactform'
import { FloatingNavbar } from '@/components/globals/navbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowRight, CheckCircle, Globe, MailIcon, MapPin, MessageSquare, PhoneCall, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function Contact() {
    return (
        <>
            <div className='relative w-full mt-6 bg-[#05071E] overflow-hidden'>
                {/* Background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
                    <div className="absolute -bottom-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px]" />
                    <Image
                        src="/grid-pattern.png"
                        alt="Background grid"
                        fill
                        className="object-cover opacity-5"
                    />
                </div>

                <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <FloatingNavbar />

                    {/* Hero section */}
                    <div className="pt-24 pb-16 text-center">
                        <Badge
                            className="inline-flex items-center rounded-full border-0 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-400 mb-4"
                        >
                            <Sparkles className="mr-1 h-3.5 w-3.5" />
                            Let&apos;s Connect
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-slate-300 text-transparent bg-clip-text max-w-3xl mx-auto">
                            Unlock Your Business Potential With <span className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-transparent bg-clip-text">Zapllo</span>
                        </h1>
                        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
                            Join forward-thinking businesses that are revolutionizing their workflows with automation that actually works
                        </p>
                    </div>

                    {/* Main content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                        {/* Left column - Benefits */}
                        <div className="space-y-8">
                            <div className="p-1.5 rounded-xl bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20">
                                <Card className="bg-slate-900/60 backdrop-blur-sm border-0 overflow-hidden">
                                    <CardContent className="p-6">
                                        <h2 className="text-2xl font-semibold mb-6 text-white">Why Choose Zapllo?</h2>

                                        <div className="space-y-6">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-[#815BF5] to-[#FC8929] flex items-center justify-center mr-4">
                                                    <Zap className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-medium text-white">Increase Efficiency by 40%</h3>
                                                    <p className="mt-1 text-slate-400">Automate repetitive tasks and workflows to free your team for strategic work</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-[#815BF5] to-[#FC8929] flex items-center justify-center mr-4">
                                                    <Globe className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-medium text-white">Seamless Integrations</h3>
                                                    <p className="mt-1 text-slate-400">Connect with 200+ tools and platforms you already use in your business</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-[#815BF5] to-[#FC8929] flex items-center justify-center mr-4">
                                                    <CheckCircle className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-medium text-white">Enterprise-Grade Security</h3>
                                                    <p className="mt-1 text-slate-400">Your data is safe with our SOC 2 compliant infrastructure and encryption</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800 p-6">
                                <h3 className="text-xl font-semibold mb-4 text-white">Our Clients Achieve</h3>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                        <p className="text-2xl font-bold text-[#FC8929]">35%</p>
                                        <p className="text-sm text-slate-400">Cost reduction</p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                        <p className="text-2xl font-bold text-[#815BF5]">60%</p>
                                        <p className="text-sm text-slate-400">Faster processing</p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                        <p className="text-2xl font-bold text-emerald-500">3x</p>
                                        <p className="text-sm text-slate-400">Team productivity</p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                        <p className="text-2xl font-bold text-sky-500">90%</p>
                                        <p className="text-sm text-slate-400">Error reduction</p>
                                    </div>
                                </div>

                            </div>

                            <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800 p-6">
                                <h3 className="text-xl font-semibold mb-4 text-white">Direct Contact</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <a
                                        href="mailto:hello@zapllo.com"
                                        className="flex items-center p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors group"
                                    >
                                        <div className="p-2.5 rounded-full bg-blue-500/10 text-blue-400 mr-3 group-hover:bg-blue-500/20 transition-colors">
                                            <MailIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Email Us</p>
                                            <p className="text-xs text-slate-400">hello@zapllo.com</p>
                                        </div>
                                    </a>

                                    <a
                                        href="tel:+918910748670"
                                        className="flex items-center p-4 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors group"
                                    >
                                        <div className="p-2.5 rounded-full bg-green-500/10 text-green-400 mr-3 group-hover:bg-green-500/20 transition-colors">
                                            <PhoneCall className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Call Sales</p>
                                            <p className="text-xs text-slate-400">+91 89107 48670</p>
                                        </div>
                                    </a>
                                </div>

                                {/* <div className="mt-6 flex items-center p-4 bg-gradient-to-r from-purple-900/20 to-orange-900/20 rounded-lg border border-slate-800">
                                    <div className="p-2.5 rounded-full bg-orange-500/10 text-orange-400 mr-3">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">Live Chat</p>
                                        <p className="text-xs text-slate-400">Available 24/7 for urgent queries</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        {/* Right column - Contact Form */}
                        <div className="relative">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-28 h-28 bg-[#815BF5]/10 rounded-full blur-xl pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-28 h-28 bg-[#FC8929]/10 rounded-full blur-xl pointer-events-none"></div>

                            <ContactForm />

                            <div className="mt-8 px-6 py-4 bg-slate-900/40 backdrop-blur-sm rounded-lg border border-slate-800 flex items-center">
                                <Badge variant="outline" className="mr-3 bg-green-500/10 text-green-400 border-green-800">New</Badge>
                                <p className="text-sm text-slate-300">
                                    Schedule a <span className="font-semibold">free demo</span> when you submit the form!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="border-t border-slate-800 pt-16 pb-20">
                        <div className="text-center mb-12">
                            <Badge variant="outline" className="mb-4">Frequently Asked Questions</Badge>
                            <h2 className="text-3xl font-bold text-white">Common Questions</h2>
                            <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
                                Everything you need to know about Zapllo&apos;s automation solutions
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <div className="bg-slate-900/60 backdrop-blur-sm p-6 rounded-lg border border-slate-800">
                                <h3 className="text-lg font-medium mb-2 text-white">How quickly can we implement Zapllo?</h3>
                                <p className="text-slate-400 text-sm">Most clients are up and running within 2 weeks. Our implementation team works with your schedule to ensure minimal disruption.</p>
                            </div>
                            <div className="bg-slate-900/60 backdrop-blur-sm p-6 rounded-lg border border-slate-800">
                                <h3 className="text-lg font-medium mb-2 text-white">Is Zapllo suitable for small businesses?</h3>
                                <p className="text-slate-400 text-sm">Absolutely! We have tailored plans for businesses of all sizes, with scalable solutions that grow with you.</p>
                            </div>
                            <div className="bg-slate-900/60 backdrop-blur-sm p-6 rounded-lg border border-slate-800">
                                <h3 className="text-lg font-medium mb-2 text-white">How secure is my data with Zapllo?</h3>
                                <p className="text-slate-400 text-sm">Your data security is our priority. We use enterprise-grade encryption and comply with industry standards like SOC 2 and GDPR.</p>
                            </div>
                            <div className="bg-slate-900/60 backdrop-blur-sm p-6 rounded-lg border border-slate-800">
                                <h3 className="text-lg font-medium mb-2 text-white">What kind of support do you provide?</h3>
                                <p className="text-slate-400 text-sm">All clients receive priority technical support, regular check-ins, and access to our knowledge base. Premium plans include dedicated account managers.</p>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <Button
                                className="bg-white text-[#05071E] hover:bg-slate-100 px-8 py-6 text-lg"
                            >
                                View All FAQs <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* CTA section */}
                    <div className="mb-20">
                        <div className="relative bg-gradient-to-r from-[#0A0D2E] to-[#111541] rounded-xl p-8 md:p-12 border border-slate-800 overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/particles-bg.png')] opacity-10"></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-6 md:mb-0">
                                    <Badge className="bg-white text-[#05071E] mb-4">Limited Time Offer</Badge>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to Transform Your Business?</h2>
                                    <p className="text-slate-300 max-w-xl">
                                        The most successful businesses are already using Zapllo to automate their operations.
                                        Don&apos;zt get left behind – join the automation revolution now.
                                    </p>
                                </div>

                                <div className="flex-shrink-0">
                                    <Button
                                        className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white px-6 py-6 hover:opacity-90"
                                    >
                                        Schedule a Demo <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <div className="bg-[#04061E] pt-12">
                <Footer />
            </div>
        </>
    )
}
