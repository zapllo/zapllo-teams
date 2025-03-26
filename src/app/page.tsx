'use client'
import React from "react";
import Image from "next/image";
import { FloatingNavbar } from "@/components/globals/navbar";
import { InfiniteMoving2 } from "@/components/globals/infinite-moving2";
import Footer from "@/components/globals/Footer";
import {motion} from 'framer-motion'
// Import enhanced landing components
import HeroLanding from "@/components/product-components/landing/hero";
import Autopilot from "@/components/product-components/landing/autopilot";
import Solutions from "@/components/product-components/landing/solutions";
import Solutions2 from "@/components/product-components/landing/solutions2";
import Solutions3 from "@/components/product-components/landing/solutions3";
import CoreFeatures from "@/components/product-components/landing/core-features";
import WeDifferent from "@/components/product-components/landing/wedifferent";
import PayrollTestimonials from "@/components/product-components/payroll/testimonials";
import SaveLanding from "@/components/product-components/landing/savelanding";

// Import UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, ArrowUpRight, Users, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <main className="bg-[#05071E] mx-auto h-full w-screen z-10 overflow-hidden">
      <FloatingNavbar />
      <Image
        src='/mask.png'
        height={1000}
        className="absolute overflow-hidden w-full"
        width={1000}
        alt="Background mask for zapllo automation"
      />

      {/* Hero Section */}
      <HeroLanding />

      {/* Trust Badges Section */}
      <section className="py-16 bg-[#05071E] relative">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#05071E] to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <Badge variant="outline" className="px-4 py-2 mb-4 border-purple-500/50 bg-purple-500/10 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
              <span className="text-sm">Trusted by 20,000+ companies worldwide</span>
            </Badge>

            <h2 className="text-3xl font-bold mb-4">Trusted By Industry Leaders</h2>
            <p className="text-[#676B93] max-w-2xl mx-auto">
              Businesses of all sizes use Zapllo to automate their operations and boost productivity.
            </p>
          </motion.div>
        </div>

        <div className="bg-gradient-to-br from-[#0a0d28]/90 to-[#0a0d28] backdrop-blur-sm py-2">
          <InfiniteMoving2 />
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-[#1a1e48]/50 to-[#0A0D28] border border-[#815bf5]/10 rounded-xl p-6 flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-[#815BF5]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">20,000+</h3>
                <p className="text-sm text-[#676B93]">Happy customers</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-[#1a1e48]/50 to-[#0A0D28] border border-[#815bf5]/10 rounded-xl p-6 flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-[#815BF5]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">25+</h3>
                <p className="text-sm text-[#676B93]">Industries served</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-[#1a1e48]/50 to-[#0A0D28] border border-[#815bf5]/10 rounded-xl p-6 flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-[#815BF5]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">30+</h3>
                <p className="text-sm text-[#676B93]">Hours saved per week</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-[#1a1e48]/50 to-[#0A0D28] border border-[#815bf5]/10 rounded-xl p-6 flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#815BF5]/20 to-[#FC8929]/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-[#815BF5]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">50%+</h3>
                <p className="text-sm text-[#676B93]">Productivity boost</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="inline-block bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent font-medium">
              Join 20,000+ businesses that trust Zapllo with their automation needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Product Sections */}
      <Autopilot />
      <Solutions />
      <Solutions2 />
      <Solutions3 />



      {/* Features Section */}
      <CoreFeatures />

      {/* Differentiators Section */}
      <WeDifferent />

      {/* Mission Statement Banner */}
      <div className="scroller relative z-20 bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] py-6 mb-4">
        <h1 className="text-center md:text-xl text-sm mx-4 md:mx-0">
          We are on a mission to help 10 Million MSMEs automate their business and get freedom from daily firefighting.
        </h1>
      </div>

      {/* Testimonials Section */}
      <PayrollTestimonials />

      {/* CTA Section */}
      <SaveLanding />

      {/* Newsletter Signup Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#1a1e48]/80 to-[#0A0D28] border border-[#815bf5]/20 rounded-xl p-8 shadow-[0_0_30px_rgba(129,91,245,0.15)]">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Stay Up to Date</h2>
              <p className="text-[#676B93] mb-4">Get the latest updates, news and special offers directly to your inbox.</p>

              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-[#0A0D28] border border-[#815bf5]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#815bf5]"
                />
                <Button className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white rounded-lg hover:opacity-90">
                  Subscribe
                </Button>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-4">
                <a href="/blog" className="block p-4 bg-[#0A0D28]/60 border border-[#815bf5]/10 rounded-lg hover:border-[#815bf5]/30 transition-all">
                  <h3 className="font-medium mb-1 flex items-center">
                    Blog <ArrowUpRight className="h-3 w-3 ml-1" />
                  </h3>
                  <p className="text-xs text-[#676B93]">Latest articles and resources</p>
                </a>

                <a href="/docs" className="block p-4 bg-[#0A0D28]/60 border border-[#815bf5]/10 rounded-lg hover:border-[#815bf5]/30 transition-all">
                  <h3 className="font-medium mb-1 flex items-center">
                    Documentation <ArrowUpRight className="h-3 w-3 ml-1" />
                  </h3>
                  <p className="text-xs text-[#676B93]">Guides and references</p>
                </a>

                <a href="/community" className="block p-4 bg-[#0A0D28]/60 border border-[#815bf5]/10 rounded-lg hover:border-[#815bf5]/30 transition-all">
                  <h3 className="font-medium mb-1 flex items-center">
                    Community <ArrowUpRight className="h-3 w-3 ml-1" />
                  </h3>
                  <p className="text-xs text-[#676B93]">Join discussions with others</p>
                </a>

                <a href="/support" className="block p-4 bg-[#0A0D28]/60 border border-[#815bf5]/10 rounded-lg hover:border-[#815bf5]/30 transition-all">
                  <h3 className="font-medium mb-1 flex items-center">
                    Support <ArrowUpRight className="h-3 w-3 ml-1" />
                  </h3>
                  <p className="text-xs text-[#676B93]">Get help when you need it</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <div className="flex bg-[#04061E] mb-12 md:mb-0 justify-center">
        <Footer />
      </div>
    </main>
  );
}