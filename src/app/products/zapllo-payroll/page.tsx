'use client'
import Footer from "@/components/globals/Footer";
import Faq2 from "@/components/globals/faq2";
import { FloatingNavbar } from "@/components/globals/navbar";
import Benefits from "@/components/product-components/payroll/benefits";
import Business from "@/components/product-components/payroll/Business";
import PayrollFeatures from "@/components/product-components/payroll/Features";
import PayrollHero from "@/components/product-components/payroll/Hero";
import SaveMore from "@/components/product-components/payroll/save";
import SettingUp from "@/components/product-components/payroll/settingup";
import PayrollTestimonials from "@/components/product-components/payroll/testimonials";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function Home() {
    return (
        <main className="bg-[#05071E] min-h-screen overflow-hidden relative">
            <FloatingNavbar />

            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <Image
                    src='/mask.png'
                    height={1000}
                    width={1000}
                    alt="Background mask for zapllo automation"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
            </div>

            {/* Hero Section */}
            <PayrollHero />

            {/* Trusted By Section */}
            <Business product="Leave & Attendance Tracker App" />

            {/* Features Section */}
            <PayrollFeatures />

            {/* Setup Process Section */}
            <SettingUp />

            {/* Benefits Section */}
            <Benefits />

            {/* Limited Time Offer Section */}
            <SaveMore />

            {/* Trust Bar */}
            <div className='relative z-10 bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] py-4 overflow-hidden'>
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 mr-3 text-white" />
                    <h2 className="text-center text-white text-sm md:text-lg font-medium animate-pulse">
                        We&apos;re on a mission to help 10 Million MSMEs automate their business operations
                    </h2>
                </div>
            </div>

            {/* Testimonials Section */}
            <PayrollTestimonials />

            {/* Final CTA Section */}
            <SaveMore />

            {/* FAQ Section */}
            <div className="relative z-10 py-24 bg-[#04061E]">
                <div className="max-w-6xl mx-auto px-4">
                    <Faq2 />
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 bg-[#04061E]">
                <Footer />
            </div>
        </main>
    )
};