'use client'

import React, { useEffect } from "react";
import Footer from "@/components/globals/Footer";
import { FloatingNavbar } from "@/components/globals/navbar";
import Benefits from "@/components/product-components/tasks/benefits";
import Business from "@/components/product-components/tasks/Business";
import TaskFeatures from "@/components/product-components/tasks/Features";
import TasksHero from "@/components/product-components/tasks/Hero";
import SettingUp4 from "@/components/product-components/tasks/holiday";
import SettingUp3 from "@/components/product-components/tasks/leavetypes";
import SettingUp2 from "@/components/product-components/tasks/registerfaces";
import SaveMore2 from "@/components/product-components/tasks/save2";
import SettingUp from "@/components/product-components/tasks/settingup";
import PayrollTestimonials from "@/components/product-components/payroll/testimonials";
import SaveMore3 from "@/components/product-components/tasks/save3";
import Faq3 from "@/components/globals/faq3";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
    // Scroll restoration
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="bg-[#05071E] h-full w-screen mx-auto overflow-hidden">
            <FloatingNavbar />
            
            {/* Background effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Image 
                    src='/mask.png' 
                    height={1000} 
                    className="absolute overflow-hidden w-full opacity-40" 
                    width={1000} 
                    alt="Background mask for zapllo automation" 
                />
                <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-[#05071E] via-[#05071E] to-transparent"></div>
            </div>
            
            <div className="relative z-10">
                <TasksHero />
                <Business product="Task Delegation App" />
                <TaskFeatures />
                
                <div id="how-it-works">
                    <SettingUp />
                    <SettingUp2 />
                    <SettingUp3 />
                    <SettingUp4 />
                </div>
                
                <SaveMore2 />
                <Benefits />
                
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] py-6 mt-12 mb-4 relative z-20'
                >
                    <h2 className="text-center text-white font-medium mx-4 md:mx-0 md:text-xl">
                        We are on a mission to help 10 Million MSMEs automate their business and get freedom from daily firefighting.
                    </h2>
                </motion.div>
                
                <PayrollTestimonials />
                
                <div id="pricing">
                    <SaveMore3 />
                </div>
                
                <div id="faq" className="relative z-20">
                    <Faq3 />
                </div>
                
                <div className="bg-[#04061E] w-full mt-56 relative z-20">
                    <Footer />
                </div>
            </div>
        </main>
    )
}