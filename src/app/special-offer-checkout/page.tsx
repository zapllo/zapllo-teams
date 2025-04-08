'use client';

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Golos_Text, Space_Grotesk } from "next/font/google";
import { FloatingNavbar } from "@/components/globals/navbar";
import MultiStepForm from "@/components/forms/checkoutForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    CheckCircle2, Clock, ArrowRight, Shield, Gift,
    CreditCard, Zap, Users, CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import Testimonials2 from "@/components/globals/testimonials2";
import OtherFooter from "@/components/globals/other-footer";
import Confetti from 'react-canvas-confetti';
import Footer from "@/components/globals/Footer";

const golos = Golos_Text({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

type PlanKeys = 'Zapllo Tasks' | 'Zapllo Payroll' | 'Zapllo CRM';

// Convert existing mockData to the features format
const featuresData = {
    "Zapllo Tasks": [
        "Delegate Unlimited Tasks",
        "Team Performance Report",
        "Links Management for your Team",
        "Email Notifications",
        "WhatsApp Notifications",
        "Automatic WhatsApp Reminders",
        "Automatic Email Reminders",
        "Repeated Tasks",
        "Zapllo AI - Proprietary AI Technology",
        "File Uploads",
        "Delegate Tasks with Voice Notes",
        "Task Wise Reminders",
        "Daily Task & Team Reports",
        "Save more than 4 hours per day",
    ],
    "Zapllo Payroll": [
        "Easy Attendance Marking using Geo location & Face recognition feature",
        "Easy Leave application",
        "Attendance & Leave Tracking",
        "Reports / Dashboards",
        "WhatsApp & Email Notifications",
        "Automatic WhatsApp Reminders",
        "Automatic Email Reminders",
        "Zapllo AI - Proprietary AI Technology",
        "Approval Process",
        "Regularization Process (Apply for past date attendance)",
        "Multiple login & Logouts",
        "Customer Leave Types",
    ],
    "WhatsApp Marketing": [
        "Official WhatsApp API (₹20K)",
        "WhatsApp Live Chat (₹20K)",
        "WhatsApp CRM (₹20K)",
        "1 Year Subscription",
        "Up to 10 Lakh Contacts In CRM",
        "WhatsApp Marketing Checklist (₹10K)",
        "WA Chat Support (₹10K)",
        "Weekly Live Classes (₹20K)",
        "No-Markup on Conversation (Priceless)",
        "Total Value worth NR 1 Lakh",
    ]
};

export default function SpecialOfferCheckout() {
    const searchParams = useSearchParams();
    const selectedPlan = searchParams.get('selectedPlan') || 'Zapllo Tasks';
    const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
    const [countdown, setCountdown] = useState(20);
    const [progress, setProgress] = useState(95);
    const [showConfetti, setShowConfetti] = useState(true);

    // Add this at the top-level with your other imports and state declarations
    const getCurrentDatePromo = () => {
        const now = new Date();
        const month = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
        const day = now.getDate();
        return `${month}${day}`;
    };

    // Then, in your component:
    const [promoCode, setPromoCode] = useState(getCurrentDatePromo());

    const featureRef = useRef(null);
    const formRef = useRef(null);

    const featuresInView = useInView(featureRef, { once: false, amount: 0.3 });
    const formInView = useInView(formRef, { once: false, amount: 0.3 });

    // Format the time as MM:SS
const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Countdown timer effect
    useEffect(() => {
        // Hide confetti after a few seconds
        setTimeout(() => setShowConfetti(false), 3000);

        // Time countdown
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        // Seats countdown (slower interval)
        const intervalDuration = (45 * 60) / (20 - 3); // Interval duration in seconds
        const seatsInterval = setInterval(() => {
            setCountdown((prev) => {
                const newCount = prev > 3 ? prev - 1 : 3;
                // Update progress based on countdown and ensure it's a whole number
                setProgress(Math.round(((20 - newCount) / (20 - 3)) * 100));
                return newCount;
            });
        }, intervalDuration * 1000);

        return () => {
            clearInterval(timer);
            clearInterval(seatsInterval);
        };
    }, []);

    return (
        <main className={`bg-white w-full mx-auto min-h-screen overflow-x-hidden ${golos.className}`}>
            {/* <FloatingNavbar /> */}

            {showConfetti && <Confetti className="w-full h-full fixed top-0 left-0 z-50" />}
            <div className='flex items-center py-8 justify-center'>
                <img className="h-12" src='https://res.cloudinary.com/dndzbt8al/image/upload/v1743846882/logo-01_1_a2qvzt.png' />
            </div>
            {/* Hero Section with Offer Banner */}
            <section className="relative pt-4">
                <div className="absolute top-0 right-0 -z-10 w-full h-full bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 opacity-50">
                    <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
                </div>

                {/* Offer Banner */}
                <div className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 flex flex-col sm:flex-row items-center justify-center gap-4 px-4 ">
                    <p className="text-white font-medium">
                        Limited Time Offer! Complete Your Purchase
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="bg-white text-indigo-600 px-4 py-1.5 rounded-full font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {formatTime(timeLeft)}
                        </div>
                        <div className="bg-white text-indigo-600 px-4 py-1.5 rounded-full font-medium flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {countdown} Seats Left
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <Badge className="mb-4 bg-purple-100 text-purple-600 hover:bg-purple-200 text-sm py-1.5 px-4 rounded-full">
                            🎁 Special Checkout Offer
                        </Badge>

                        <h1 className={`text-3xl md:text-5xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                            Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500">Purchase</span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                            You&apos;re just one step away from transforming your business operations
                        </p>

                        <div className="flex justify-center  mb-8">

                            <div className="max-w-md space-y-6 w-full">
                                <p className="text-sm text-gray-500 text-center absolute ">Almost gone! Only {countdown} slots available at this price.</p>
                                <Progress value={progress} className="h-2 mt-6 text-black" />

                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center mt-4 gap-3 mb-8">
                            {[
                                { title: "Multi User Login", icon: <Users className="h-4 w-4" /> },
                                { title: "WhatsApp Integration", icon: <Zap className="h-4 w-4" /> },
                                { title: "Voice Notes", icon: <Zap className="h-4 w-4" /> },
                                { title: "Email Integration", icon: <Zap className="h-4 w-4" /> },
                                { title: "Whatsapp Reminders", icon: <CalendarDays className="h-4 w-4" /> },
                                { title: "Realtime Reports", icon: <Zap className="h-4 w-4" /> },
                            ].map((feature, index) => (
                                <Badge
                                    key={index}
                                    className="bg-gradient-to-r mt-6 from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 py-2 px-4 rounded-full flex items-center gap-1.5"
                                >
                                    {feature.icon}
                                    {feature.title}
                                </Badge>
                            ))}
                        </div>

                        <div className="inline-flex items-center bg-amber-50 text-amber-700 px-4 py-2 rounded-lg mb-6">
                            <Gift className="h-5 w-5 mr-2" />
                            <p className="font-medium">Use code <span className="font-bold">{promoCode}</span> for 50% off!</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Content - Plan Details and Checkout Form */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
                        {/* Checkout Form */}
                        <motion.div
                            ref={formRef}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="order-2 lg:order-1"
                        >
                            <div className="sticky top-24">
                                <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 mb-6 ${spaceGrotesk.className}`}>
                                    Complete Your Order
                                </h2>

                                <MultiStepForm selectedPlan={selectedPlan as PlanKeys} />

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center bg-green-50 p-4 rounded-lg">
                                        <Shield className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                                        <p className="text-green-700 text-sm">
                                            <span className="font-medium">Secure Checkout:</span> Your payment information is encrypted and secure.
                                        </p>
                                    </div>

                                    <div className="flex items-center bg-blue-50 p-4 rounded-lg">
                                        <Gift className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                                        <p className="text-blue-700 text-sm">
                                            <span className="font-medium">Special Bonus:</span> Complete your purchase now and get free onboarding and training worth ₹10,000!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Plan Details */}
                        {/* <motion.div
                            ref={featureRef}
                            initial={{ opacity: 0, x: 20 }}
                            animate={featuresInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5 }}
                            className="order-1 lg:order-2"
                        >
                            <Card className="border-2 bg-transparent border-purple-100 shadow-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 p-1">
                                    <CardHeader className="bg-white pt-6">
                                        <CardTitle className="text-2xl font-bold text-black flex items-center justify-between">
                                            {selectedPlan}
                                            <Badge className="bg-red-100 text-red-600 hover:bg-red-200">60% OFF</Badge>
                                        </CardTitle>
                                        <CardDescription className="text-gray-600">
                                            Your selected plan includes these premium features:
                                        </CardDescription>
                                    </CardHeader>
                                </div>

                                <CardContent className="pt-6">
                                    <div className="flex items-baseline mb-6">
                                        <span className="text-lg text-gray-500 line-through mr-2">₹6,000</span>
                                        <span className="text-4xl font-bold text-gray-900">₹2,399</span>
                                        <span className="text-gray-600 ml-2">/user/year</span>
                                    </div>

                                    <div className="bg-purple-50 p-4 rounded-lg mb-6">
                                        <p className="text-purple-800 text-sm">
                                            <span className="font-semibold">LIMITED TIME OFFER:</span> Complete
                                            your order in the next {formatTime(timeLeft)} to lock in this special price!
                                        </p>
                                    </div>

                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                        <h3 className="font-semibold text-gray-900 mb-2">What's Included:</h3>

                                        {selectedPlan === 'Zapllo Money Saver Bundle' ? (
                                            <>
                                                <div className="mb-4">
                                                <h4 className="font-medium text-purple-700 mb-2">
                                                        Zapllo Tasks:
                                                    </h4>
                                                    {featuresData["Zapllo Tasks"].map((feature, index) => (
                                                        <div key={index} className="flex items-start mb-2">
                                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                                            <span className="text-gray-700 text-sm">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mb-4">
                                                    <h4 className="font-medium text-purple-700 mb-2">
                                                        Zapllo Payroll:
                                                    </h4>
                                                    {featuresData["Zapllo Payroll"].map((feature, index) => (
                                                        <div key={index} className="flex items-start mb-2">
                                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                                            <span className="text-gray-700 text-sm">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div>
                                                    <h4 className="font-medium text-purple-700 mb-2">
                                                        WhatsApp Marketing & Automation:
                                                    </h4>
                                                    {featuresData["WhatsApp Marketing"].map((feature, index) => (
                                                        <div key={index} className="flex items-start mb-2">
                                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                                            <span className="text-gray-700 text-sm">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div>
                                                {featuresData["Zapllo Tasks"].map((feature, index) => (
                                                    <div key={index} className="flex items-start mb-2">
                                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                                        <span className="text-gray-700 text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="bg-gray-50 p-6 flex flex-col">
                                    <Button
                                        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 hover:from-indigo-600 hover:via-purple-600 hover:to-orange-600 text-white font-medium py-5 rounded-xl shadow-md"
                                        onClick={() => document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>

                                    <p className="text-center text-gray-500 text-sm mt-4">
                                        By proceeding, you agree to our Terms of Service and Privacy Policy
                                    </p>
                                </CardFooter>
                            </Card>

                            <div className="mt-8 space-y-4">
                                <Card className="border border-gray-200">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-medium flex items-center">
                                            <CreditCard className="mr-2 h-5 w-5 text-purple-500" />
                                            Payment Options
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-3">
                                            {['visa.svg', 'mastercard.svg', 'amex.svg', 'rupay.svg', 'upi.svg'].map((card, index) => (
                                                <div key={index} className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center p-1">
                                                    <Image
                                                        src={`/payment/${card}`}
                                                        alt={card.split('.')[0]}
                                                        width={32}
                                                        height={20}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-gray-200">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-medium">
                                            Customer Testimonials
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[
                                                {
                                                    name: "Vikram S.",
                                                    comment: "The Zapllo suite has completely transformed how we manage tasks. Our entire team loves it!",
                                                    role: "CEO"
                                                },
                                                {
                                                    name: "Priya M.",
                                                    comment: "We've reduced administrative overhead by 40% since implementing Zapllo. Best business decision we made this year.",
                                                    role: "Operations Head"
                                                }
                                            ].map((testimonial, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <Avatar className="h-8 w-8 bg-purple-100 text-purple-600">
                                                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-gray-700 text-sm">"{testimonial.comment}"</p>
                                                        <p className="text-gray-500 text-xs mt-1">{testimonial.name}, {testimonial.role}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div> */}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className={`text-3xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                            Why Choose Zapllo?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Our comprehensive platform helps businesses of all sizes streamline operations and boost productivity
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Save 5+ Hours Daily",
                                description: "Automate repetitive tasks and free up your team's valuable time",
                                icon: <Clock className="h-10 w-10 text-purple-500" />
                            },
                            {
                                title: "Free Onboarding",
                                description: "Get personalized setup assistance to ensure you hit the ground running",
                                icon: <Shield className="h-10 w-10 text-green-500" />
                            },
                            {
                                title: "Premium Support",
                                description: "Get access to our dedicated support team and comprehensive resources",
                                icon: <Users className="h-10 w-10 text-blue-500" />
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                            >
                                <div className="rounded-full bg-gray-50 w-16 h-16 flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Testimonials2 />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className={`text-3xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Have questions? We&apos;ve got answers
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            {
                                question: "When will I get access after purchase?",
                                answer: "You'll receive immediate access to your Zapllo workspace. Our team will reach out within 24 hours to help with setup and onboarding."
                            },
                            {
                                question: "Can I add more users later?",
                                answer: "Yes! You can add more users at any time. Additional users will be billed at the current rate prorated for the remainder of your subscription period."
                            },
                            {
                                question: "Is this a one-time payment or subscription?",
                                answer: "This is a one-time payment for a full year of access. After 12 months, you can renew at our regular rates or at special renewal discounts."
                            },
                            {
                                question: "What support do you provide?",
                                answer: "We offer comprehensive onboarding and premium support throughout your subscription. Our dedicated team is available to help you maximize the value of Zapllo."
                            }
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                            >
                                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                                <p className="text-gray-600 text-sm">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h2 className={`text-3xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                            Ready to Transform Your Business?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                            Complete your purchase now to lock in our special pricing and start streamlining your operations today!
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <div className="bg-blue-50 text-blue-600 rounded-full px-6 py-3 flex items-center gap-2 font-medium">
                                <Clock className="h-5 w-5" />
                                <span>Offer Ends In: {formatTime(timeLeft)}</span>
                            </div>

                            <div className="bg-amber-50 text-amber-600 rounded-full px-6 py-3 flex items-center gap-2 font-medium">
                                <Users className="h-5 w-5" />
                                <span>Only {countdown} Seats Left</span>
                            </div>
                        </div>

                        <Button
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 hover:from-indigo-600 hover:via-purple-600 hover:to-orange-600 text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg"
                            onClick={() => document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Complete Your Purchase Now
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>

                        <p className="mt-6 text-gray-500">
                            Use code <span className="font-semibold text-purple-600">{promoCode}</span> to avail the 50% off Offer!
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </main>
    );
}
