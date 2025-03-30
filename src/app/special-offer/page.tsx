'use client'

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Golos_Text, Space_Grotesk } from "next/font/google";
import { FloatingNavbar } from "@/components/globals/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    CheckCircle2, Clock, Star, TrendingUp, Zap, Users, Gift,
    ArrowRight, Sparkles, CalendarDays, CreditCard, Bell,
    Coffee
} from "lucide-react";
import { cn } from "@/lib/utils";
import Testimonials2 from "@/components/globals/testimonials2";
import OtherFooter from "@/components/globals/other-footer";
import Confetti from 'react-canvas-confetti';

const golos = Golos_Text({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

type PlanKeys = 'Zapllo Tasks' | 'Zapllo Money Saver Bundle' | 'Zapllo Payroll' | 'Zapllo CRM';

const testimonials = [
    {
        name: "Vikram Singh",
        role: "Small Business Owner",
        avatar: "/avatars/avatar-1.png",
        company: "VikTech Solutions",
        content: "Zapllo has completely transformed how we manage tasks. We've reduced our operational overhead by 30% in just two months!",
        rating: 5
    },
    {
        name: "Priya Mehta",
        role: "HR Director",
        avatar: "/avatars/avatar-2.png",
        company: "Creative Minds Inc",
        content: "The payroll system is a game-changer. No more manual calculations or paperwork. My team now focuses on recruiting instead of administration.",
        rating: 5
    },
    {
        name: "Rahul Verma",
        role: "CTO",
        avatar: "/avatars/avatar-3.png",
        company: "NextGen Software",
        content: "The Money Saver Bundle gives us enterprise-level tools at a fraction of the cost. Best investment decision we've made this year.",
        rating: 5
    },
    {
        name: "Aisha Kapoor",
        role: "Operations Manager",
        avatar: "/avatars/avatar-4.png",
        company: "Global Retail Chain",
        content: "Zapllo CRM helped us increase customer retention by 25%. The WhatsApp integration is brilliant - our response time is now under 2 minutes.",
        rating: 5
    }
];

export default function Home() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
    const [countdown, setCountdown] = useState(15);
    const [progress, setProgress] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [activeFeature, setActiveFeature] = useState("tasks");

    const productRefs = {
        tasks: useRef(null),
        attendance: useRef(null),
        leave: useRef(null),
        payslip: useRef(null),
        crm: useRef(null)
    };

    const tasksInView = useInView(productRefs.tasks, { once: false, amount: 0.3 });
    const attendanceInView = useInView(productRefs.attendance, { once: false, amount: 0.3 });
    const leaveInView = useInView(productRefs.leave, { once: false, amount: 0.3 });
    const payslipInView = useInView(productRefs.payslip, { once: false, amount: 0.3 });
    const crmInView = useInView(productRefs.crm, { once: false, amount: 0.3 });

    // Add this at the top-level with your other imports and state declarations
    const getCurrentDatePromo = () => {
        const now = new Date();
        const month = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
        const day = now.getDate();
        return `${month}${day}`;
    };
    const getCurrentDateSale = () => {
        const now = new Date();
        const month = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
        const day = now.getDate();
        return `${month}`;
    };

    // Then, in your component:
    const [promoCode, setPromoCode] = useState(getCurrentDatePromo());
    const [sale, setSale] = useState(getCurrentDateSale());

    // Format the time as HH:MM:SS
    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    useEffect(() => {
        // Trigger confetti on page load
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);

        // Countdown timer
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        // Seats countdown
        const seatInterval = setInterval(() => {
            setCountdown((prev) => (prev > 5 ? prev - 1 : 5));
            setProgress(prev => Math.min(prev + 10, 100));
        }, 30000);

        return () => {
            clearInterval(timer);
            clearInterval(seatInterval);
        };
    }, []);

    const openCheckoutWithPlan = (plan: PlanKeys) => {
        setShowConfetti(true);
        setTimeout(() => {
            setShowConfetti(false);
            router.push(`/special-offer-checkout?selectedPlan=${plan}`);
        }, 1500);
    };

    const scrollToProduct = (product: keyof typeof productRefs) => {
        const ref = productRefs[product].current as HTMLElement | null;
        ref?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveFeature(product);
    };

    return (
        <main className={`bg-white w-full mx-auto min-h-screen overflow-x-hidden ${golos.className}`}>
            <FloatingNavbar />

            {showConfetti && <Confetti className="w-full h-full fixed top-0 left-0 z-50" />}

            {/* Hero Section */}
            <section className="relative pt-20 overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-full h-full bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 opacity-70">
                    {/* Adding a subtle pattern overlay */}
                    <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" /></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-200 text-sm py-1.5 px-4 rounded-full">
                            🎉 Flash Sale • Limited Time Offer
                        </Badge>

                        <h1 className={`text-4xl md:text-6xl font-bold text-gray-900 mb-6 ${spaceGrotesk.className}`}>
                            {sale} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500">Productivity</span> Sale
                        </h1>

                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Transform your business operations with our all-in-one workspace suite.
                            Save up to <span className="font-bold text-purple-600">60% off</span> for your entire team!
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

                        <Progress value={progress} className="w-full max-w-md text-black mx-auto h-2 mb-8" />

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block"
                        >
                            <Button
                                size="lg"
                                onClick={() => scrollToProduct('tasks')}
                                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 hover:from-indigo-600 hover:via-purple-600 hover:to-orange-600 text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg"
                            >
                                View Special Offers Now
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Floating images */}
                <div className="absolute top-40 -left-16 md:left-10 opacity-40 md:opacity-70 rotate-6 w-40 h-40 md:w-56 md:h-56">
                    <Image
                        src="/mockups/task.png"
                        alt="Zapllo Tasks Preview"
                        width={200}
                        height={400}
                        className="rounded-xl shadow-xl"
                    />
                </div>

                <div className="absolute top-60 -right-16 md:right-10 opacity-40 md:opacity-70 -rotate-6 w-40 h-40 md:w-56 md:h-56">
                    <Image
                        src="/mockups/attendance.png"
                        alt="Zapllo Payroll Preview"
                        width={200}
                        height={400}
                        className="rounded-xl shadow-xl"
                    />
                </div>
            </section>

            {/* Value Props Section */}
            <section className="py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                            Why Businesses Love Zapllo
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our all-in-one platform streamlines your operations so you can focus on growth
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <TrendingUp className="h-10 w-10 text-purple-500" />,
                                title: "10x Productivity",
                                description: "Automate repetitive tasks and free up your team's valuable time"
                            },
                            {
                                icon: <Zap className="h-10 w-10 text-amber-500" />,
                                title: "Save 4+ Hours Daily",
                                description: "Reduce time spent on administration, coordination, and follow-ups"
                            },
                            {
                                icon: <CheckCircle2 className="h-10 w-10 text-green-500" />,
                                title: "99.9% Accuracy",
                                description: "Eliminate human error in attendance, payroll, and task management"
                            },
                            {
                                icon: <Coffee className="h-10 w-10 text-red-500" />,
                                title: "Costs Less Than Coffee",
                                description: "Just ₹170/month - less than your daily caffeine fix"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                                    <CardHeader>
                                        <div className="rounded-full bg-gray-50 w-16 h-16 flex items-center justify-center mb-4">
                                            {item.icon}
                                        </div>
                                        <CardTitle className="text-xl text-black font-bold">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600">{item.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            // ... existing code ...

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <Badge className="mb-4 bg-purple-100 text-purple-600 hover:bg-purple-200 text-sm py-1.5 px-4 rounded-full">
                            <Sparkles className="w-4 h-4 mr-1" /> Limited Time Sale
                        </Badge>
                        <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                            Unlock Premium Features at Unbeatable Prices
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to streamline operations, save time, and grow your business
                        </p>
                    </motion.div>

                    {/* Replace the previous pricing cards with 3 separate cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Zapllo Tasks Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden h-full transform hover:scale-[1.01] transition-all duration-300">
                                <CardHeader className="pt-8 pb-4">
                                    <CardTitle className="text-2xl text-black font-bold flex items-center">
                                        Zapllo Tasks
                                        <Badge className="ml-2 bg-amber-100 text-amber-600 hover:bg-amber-200">50% OFF</Badge>
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Streamline task delegation and boost productivity
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-6">
                                    <div className="flex items-baseline mb-6">
                                        <span className="text-lg text-gray-500 line-through mr-2">₹4,000</span>
                                        <span className="text-5xl font-bold text-gray-900">₹1,999</span>
                                        <span className="text-gray-600 ml-2">/user/year</span>
                                    </div>

                                    <p className="text-amber-600 font-medium mb-6">
                                        Save ₹2,000 per user annually
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        {[
                                            "Zapllo Tasks - Task Delegation App",
                                            "Zapllo Intranet",
                                            "Zapllo AI - Proprietary AI Technology",
                                            "WhatsApp Integration",
                                            "Voice Notes"
                                        ].map((feature, index) => (
                                            <div key={index} className="flex items-start">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg mb-6">
                                        <p className="text-purple-800 text-sm">
                                            <span className="font-semibold">BONUS:</span> Sign up today and get
                                            complimentary onboarding and training worth ₹10,000 absolutely FREE + Getaway to the Business Automation Summit!
                                        </p>
                                    </div>
                                </CardContent>

                                <CardFooter className="bg-gray-50 p-6">
                                    <Button
                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-6 rounded-xl font-bold text-lg transition-colors duration-200"
                                        onClick={() => openCheckoutWithPlan('Zapllo Tasks')}
                                    >
                                        Get Zapllo Tasks
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>

                        {/* Zapllo Payroll Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="relative"
                        >

                            <Card className="bg-white border-2 border-purple-200 shadow-xl rounded-2xl overflow-hidden h-full transform hover:scale-[1.01] transition-all duration-300">
                                <div className=" p-1">
                                    <CardHeader className="bg-white pt-8 pb-4">
                                        <CardTitle className="text-2xl text-black font-bold flex items-center">
                                            Zapllo Payroll
                                            <Badge className="ml-2 bg-red-100 text-red-600 hover:bg-red-200">50% OFF</Badge>
                                        </CardTitle>
                                        <CardDescription className="text-gray-600">
                                            Complete HR solution for attendance, leave and payroll
                                        </CardDescription>
                                    </CardHeader>
                                </div>

                                <CardContent className="pt-6">
                                    <div className="flex items-baseline mb-6">
                                        <span className="text-lg text-gray-500 line-through mr-2">₹1,999</span>
                                        <span className="text-5xl font-bold text-gray-900">₹999</span>
                                        <span className="text-gray-600 ml-2">/user/year</span>
                                    </div>

                                    <p className="text-purple-600 font-medium mb-6">
                                        Save ₹1000 per user annually
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        {[
                                            "Zapllo Payroll - Attendance Tracking App",
                                            "Zapllo Payroll - Leave Management App",
                                            "Zapllo Payroll - Payslip & Salary App",
                                            "WhatsApp Integration",
                                            "Email Integration",
                                            "Real-time Analytics & Reports"
                                        ].map((feature, index) => (
                                            <div key={index} className="flex items-start">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-purple-50 p-4 rounded-lg mb-6">
                                        <p className="text-purple-800 text-sm">
                                            <span className="font-semibold">BONUS:</span> Sign up today and get
                                            complimentary onboarding and training worth ₹10,000 absolutely FREE + Getaway to the Business Automation Summit!
                                        </p>
                                    </div>
                                </CardContent>

                                <CardFooter className="bg-gray-50 p-6">
                                    <Button
                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-6 rounded-xl font-bold text-lg transition-colors duration-200"
                                        onClick={() => openCheckoutWithPlan('Zapllo Payroll')}
                                    >
                                        Get Zapllo Payroll
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>

                        {/* Zapllo CRM Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden h-full transform hover:scale-[1.01] transition-all duration-300">
                                <CardHeader className="pt-8 pb-4">
                                    <CardTitle className="text-2xl text-black font-bold flex items-center">
                                        Zapllo CRM
                                        <Badge className="ml-2 bg-green-100 text-green-600 hover:bg-green-200">50% OFF</Badge>
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Manage customer relationships and grow your business
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-6">
                                    <div className="flex items-baseline mb-6">
                                        <span className="text-lg text-gray-500 line-through mr-2">₹5,999</span>
                                        <span className="text-5xl font-bold text-gray-900">₹2,999</span>
                                        <span className="text-gray-600 ml-2">/user/year</span>
                                    </div>

                                    <p className="text-green-600 font-medium mb-6">
                                        Save ₹3,000 per user annually
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        {[
                                            "Zapllo CRM - Customer Management App",
                                            "Lead Management",
                                            "WhatsApp Integration",
                                            "Voice Notes & Email Integration",
                                            "Sales Pipeline Visualization",
                                            "Customer Insights & Analytics"
                                        ].map((feature, index) => (
                                            <div key={index} className="flex items-start">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg mb-6">
                                        <p className="text-purple-800 text-sm">
                                            <span className="font-semibold">BONUS:</span> Sign up today and get
                                            complimentary onboarding and training worth ₹10,000 absolutely FREE + Getaway to the Business Automation Summit!
                                        </p>
                                    </div>
                                </CardContent>

                                <CardFooter className="bg-gray-50 p-6">
                                    <Button
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-6 rounded-xl font-bold text-lg transition-colors duration-200"
                                        onClick={() => openCheckoutWithPlan('Zapllo CRM')}
                                    >
                                        Get Zapllo CRM
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <Badge className="bg-green-100 text-green-700 px-4 py-2 text-base font-medium rounded-lg flex items-center">
                            <Zap className="w-5 h-5 mr-2" />
                            Use Code &quot;{promoCode}&quot; for 50% OFF at checkout!
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                            Explore Our Suite of Products
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Each product is designed to solve specific business challenges while working seamlessly together
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-6 mb-12">
                        <Button
                            onClick={() => scrollToProduct('tasks')}
                            variant={activeFeature === 'tasks' ? 'default' : 'outline'}
                            className={`rounded-full text-white px-6 py-2 ${activeFeature === 'tasks' ? 'bg-purple-600 text-white' : 'text-white -700'}`}
                        >
                            Tasks
                        </Button>
                        <Button
                            onClick={() => scrollToProduct('attendance')}
                            variant={activeFeature === 'attendance' ? 'default' : 'outline'}
                            className={`rounded-full text-white px-6 py-2 ${activeFeature === 'attendance' ? 'bg-purple-600 text-white' : 'text-white'}`}
                        >
                            Attendance
                        </Button>
                        <Button
                            onClick={() => scrollToProduct('leave')}
                            variant={activeFeature === 'leave' ? 'default' : 'outline'}
                            className={`rounded-full px-6 py-2 ${activeFeature === 'leave' ? 'bg-purple-600 text-white' : 'text-white -700'}`}
                        >
                            Leave
                        </Button>
                        <Button
                            onClick={() => scrollToProduct('payslip')}
                            variant={activeFeature === 'payslip' ? 'default' : 'outline'}
                            className={`rounded-full px-6 py-2 ${activeFeature === 'payslip' ? 'bg-purple-600 text-white' : 'text-white -700'}`}
                        >
                            Payslip
                        </Button>
                        <Button
                            onClick={() => scrollToProduct('crm')}
                            variant={activeFeature === 'crm' ? 'default' : 'outline'}
                            className={`rounded-full px-6 py-2 ${activeFeature === 'crm' ? 'bg-purple-600 text-white' : 'text-white -700'}`}
                        >
                            CRM
                        </Button>
                    </div>

                    {/* Product Sections */}
                    <div className="space-y-24">
                        {/* Tasks */}
                        <div ref={productRefs.tasks}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={tasksInView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col lg:flex-row items-center gap-12"
                            >
                                <div className="w-full lg:w-2/5">
                                    <Badge className="mb-4 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 py-1 px-3 rounded-full">
                                        Zapllo Tasks
                                    </Badge>
                                    <h3 className={`text-3xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                                        Task Delegation Made Simple
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-6">
                                        Save 4+ hours per day for each team member by streamlining task management,
                                        delegation, and tracking.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {[
                                            {
                                                title: "Delegate Tasks",
                                                description: "Assign tasks with deadlines, priority, and categories"
                                            },
                                            {
                                                title: "WhatsApp Notifications",
                                                description: "Real-time updates via WhatsApp & Email"
                                            },
                                            {
                                                title: "Task Reminders",
                                                description: "Custom notifications before tasks are due"
                                            },
                                            {
                                                title: "Repeated Tasks",
                                                description: "Set daily, weekly, monthly recurring tasks"
                                            }
                                        ].map((feature, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                                                <p className="text-gray-600 text-sm">{feature.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                                        onClick={() => openCheckoutWithPlan('Zapllo Tasks')}
                                    >
                                        Get Zapllo Tasks
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="w-full lg:w-3/5">
                                    <div className="relative h-[500px]">
                                        <Image
                                            src="/mockups/task.png"
                                            alt="Zapllo Tasks App"
                                            fill
                                            className="object-contain rounded-lg"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Attendance */}
                        <div ref={productRefs.attendance}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={attendanceInView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col lg:flex-row-reverse items-center gap-12"
                            >
                                <div className="w-full lg:w-2/5">
                                    <Badge className="mb-4 bg-purple-100 text-purple-600 hover:bg-purple-200 py-1 px-3 rounded-full">
                                        Zapllo Payroll
                                    </Badge>
                                    <h3 className={`text-3xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                                        Attendance Tracking App
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-6">
                                        Automate attendance tracking with advanced features that ensure accuracy and save time.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {[
                                            {
                                                title: "Facial Recognition",
                                                description: "Secure verification for remote punch-in/out"
                                            },
                                            {
                                                title: "Geo Location",
                                                description: "Track location during login/logout"
                                            },
                                            {
                                                title: "Attendance Regularization",
                                                description: "Request and approve past attendance entries"
                                            },
                                            {
                                                title: "Monthly Report",
                                                description: "Detailed attendance analytics and insights"
                                            }
                                        ].map((feature, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                                                <p className="text-gray-600 text-sm">{feature.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                                        onClick={() => openCheckoutWithPlan('Zapllo Money Saver Bundle')}
                                    >
                                        Get in the Bundle
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="w-full lg:w-3/5">
                                    <div className="relative h-[500px]">
                                        <Image
                                            src="/mockups/attendance.png"
                                            alt="Zapllo Attendance App"
                                            fill
                                            className="object-contain rounded-lg"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Leave Management */}
                        <div ref={productRefs.leave}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={leaveInView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col lg:flex-row items-center gap-12"
                            >
                                <div className="w-full lg:w-2/5">
                                    <Badge className="mb-4 bg-blue-100 text-blue-600 hover:bg-blue-200 py-1 px-3 rounded-full">
                                        Zapllo Payroll
                                    </Badge>
                                    <h3 className={`text-3xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                                        Leave Management App
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-6">
                                        Simplify leave requests, approvals, and tracking with our intuitive leave management system.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {[
                                            {
                                                title: "Custom Leave Types",
                                                description: "Create leave policies tailored to your company"
                                            },
                                            {
                                                title: "Leave Approvals",
                                                description: "Streamlined request and approval process"
                                            },
                                            {
                                                title: "Partial Approval",
                                                description: "Flexible approval options for managers"
                                            },
                                            {
                                                title: "Leave Balance",
                                                description: "Automatic tracking of available leave days"
                                            }
                                        ].map((feature, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                                                <p className="text-gray-600 text-sm">{feature.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                                        onClick={() => openCheckoutWithPlan('Zapllo Money Saver Bundle')}
                                    >
                                        Get in the Bundle
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="w-full lg:w-3/5">
                                    <div className="relative h-[500px]">
                                        <Image
                                            src="/mockups/leave.png"
                                            alt="Zapllo Leave Management App"
                                            fill
                                            className="object-contain rounded-lg"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Payslip */}
                        <div ref={productRefs.payslip}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={payslipInView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col lg:flex-row-reverse items-center gap-12"
                            >
                                <div className="w-full lg:w-2/5">
                                    <Badge className="mb-4 bg-green-100 text-green-600 hover:bg-green-200 py-1 px-3 rounded-full">
                                        Zapllo Payroll
                                    </Badge>
                                    <h3 className={`text-3xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                                        Payslip & Salary Tracking App
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-6">
                                        Automate salary processing and deliver professional payslips with ease.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {[
                                            {
                                                title: "Dynamic Payslip Generation",
                                                description: "Create payslips for any month instantly"
                                            },
                                            {
                                                title: "Custom Letterhead",
                                                description: "Personalize with your company branding"
                                            },
                                            {
                                                title: "Digital Distribution",
                                                description: "Send payslips via email and WhatsApp"
                                            },
                                            {
                                                title: "Salary Management",
                                                description: "Track and update employee compensation"
                                            }
                                        ].map((feature, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                                                <p className="text-gray-600 text-sm">{feature.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                                        onClick={() => openCheckoutWithPlan('Zapllo Money Saver Bundle')}
                                    >
                                        Get in the Bundle
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="w-full lg:w-3/5">
                                    <div className="relative h-[500px]">
                                        <Image
                                            src="/mockups/payslip.jpg"
                                            alt="Zapllo Payslip App"
                                            fill
                                            className="object-contain rounded-lg"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* CRM */}
                        <div ref={productRefs.crm}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={crmInView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col lg:flex-row items-center gap-12"
                            >
                                <div className="w-full lg:w-2/5">
                                    <Badge className="mb-4 bg-amber-100 text-amber-600 hover:bg-amber-200 py-1 px-3 rounded-full">
                                        NEW
                                    </Badge>
                                    <h3 className={`text-3xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                                        Zapllo CRM
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-6">
                                        Manage your customer relationships, leads, and sales pipeline in one place.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {[
                                            {
                                                title: "Lead Management",
                                                description: "Track and nurture leads through sales funnel"
                                            },
                                            {
                                                title: "WhatsApp Integration",
                                                description: "Chat with customers directly from CRM"
                                            },
                                            {
                                                title: "Sales Pipeline",
                                                description: "Visualize and manage your sales process"
                                            },
                                            {
                                                title: "Customer Insights",
                                                description: "Analyze customer behavior and preferences"
                                            }
                                        ].map((feature, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                                                <p className="text-gray-600 text-sm">{feature.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                                        onClick={() => openCheckoutWithPlan('Zapllo Money Saver Bundle')}
                                    >
                                        Get in the Bundle
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="w-full lg:w-3/5 bg-gray-100 rounded-xl p-6">
                                    <div className="relative h-[500px]">
                                        <Image
                                            src="/mockups/crm.png"
                                            alt="Zapllo CRM App"
                                            fill
                                            className="object-contain rounded-lg"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                            The Value You&apos;re Getting
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our solutions typically save businesses over ₹98,000 per employee annually
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {[
                            {
                                title: "Task Management",
                                value: "₹50,000",
                                description: "Save 4 hours daily per employee by streamlining task delegation and tracking"
                            },
                            {
                                title: "Attendance Tracking",
                                value: "₹12,000",
                                description: "Eliminate manual attendance systems and reduce time theft"
                            },
                            {
                                title: "Leave Management",
                                value: "₹25,000",
                                description: "Automate leave requests, approvals, and balance tracking"
                            },
                            {
                                title: "Payroll Processing",
                                value: "₹12,000",
                                description: "Eliminate errors and save hours of administrative work monthly"
                            },
                            {
                                title: "CRM & Customer Management",
                                value: "₹24,000",
                                description: "Improve customer retention and optimize sales processes"
                            },
                            {
                                title: "WhatsApp Integration",
                                value: "Priceless",
                                description: "Instant communication and notifications across all systems"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <span>{item.title}</span>
                                            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                                                {item.value}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-500">{item.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-none shadow-xl p-8 max-w-3xl">
                            <CardContent className="text-center space-y-6">
                                <div className="font-bold text-2xl text-gray-900">
                                    Total Value: <span className="text-purple-600">₹98,000+ per employee annually</span>
                                </div>
                                <p className="text-gray-700">
                                    Investing in Zapllo today can deliver over 40x return on investment through increased productivity
                                    and operational efficiency.
                                </p>
                                <Button
                                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 hover:from-indigo-600 hover:via-purple-600 hover:to-orange-600 text-white py-6 px-8 rounded-full font-bold text-lg shadow-md"
                                    onClick={() => scrollToProduct('tasks')}
                                >
                                    View Special Offers Again
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <Badge className="mb-4 bg-amber-100 text-amber-600 hover:bg-amber-200 text-sm py-1.5 px-4 rounded-full">
                            <Star className="w-4 h-4 mr-1" /> Customer Success Stories
                        </Badge>
                        <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                            Hear From Our Happy Customers
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Businesses across industries are transforming their operations with Zapllo
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                                    <CardContent className="pt-6">
                                        <div className="flex space-x-1 mb-2">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
                                            ))}
                                        </div>
                                        <p className="text-gray-200 italic mb-6">&quot;{testimonial.content}&quot;</p>
                                        <div className="flex items-center">
                                            <Avatar className="h-12 w-12 mr-4">
                                                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold text-gray-100">{testimonial.name}</h4>
                                                <p className="text-sm text-gray-200">{testimonial.role}, {testimonial.company}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                            <div className="w-full lg:w-1/2">
                                <h3 className={`text-2xl md:text-3xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                                    Join 20,000+ growing businesses
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    From startups to established enterprises, businesses of all sizes trust Zapllo to streamline their operations and boost productivity.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {['Tech', 'Manufacturing', 'Healthcare', 'Retail', 'Education', 'Services'].map((industry, index) => (
                                        <div key={index} className="flex items-center">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                                            <span className="text-gray-700">{industry}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 grid grid-cols-3 gap-4">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="bg-gray-100 rounded-lg p-4 h-20 flex items-center justify-center">
                                        <Image
                                            src={`/logos/client-${index + 1}.svg`}
                                            alt={`Client ${index + 1}`}
                                            width={80}
                                            height={40}
                                            className="opacity-70 hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to know about our special offer
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                question: "How long will this offer last?",
                                answer: `This special ${sale} Productivity Sale is available for a limited time only. The countdown on the page shows the exact time remaining before prices return to normal.`
                            },
                            {
                                question: "Is this a one-time payment or subscription?",
                                answer: "This is a one-time payment for a full year of access. After 12 months, you can renew at the then-current regular price or at special renewal rates offered to existing customers."
                            },
                            {
                                question: "Can I add more users later?",
                                answer: "Yes! You can add more users anytime. Additional users added during your subscription period will be prorated for the remaining time."
                            },
                            {
                                question: "Is there a free trial available?",
                                answer: "While we don't offer a free trial during this special sale, we do provide a 30-day money-back guarantee if you're not completely satisfied."
                            },
                            {
                                question: "What happens after I purchase?",
                                answer: "You'll receive immediate access to your Zapllo account. Our onboarding team will contact you within 24 hours to help set up your workspace and train your team."
                            },
                            {
                                question: "Are there any hidden fees?",
                                answer: "No hidden fees at all. The price you see is the price you pay for the full functionality of the selected plan for one year."
                            },
                            {
                                question: "Can I use these apps on mobile devices?",
                                answer: "Yes! All Zapllo applications are fully responsive and work on desktop, tablet, and mobile devices, giving you flexibility to manage your business from anywhere."
                            },
                            {
                                question: "Do you offer support during implementation?",
                                answer: "Absolutely! With this special offer, you'll receive complimentary onboarding and training worth ₹10,000 to ensure your team gets the most out of Zapllo."
                            }
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold text-gray-100">{faq.question}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-400">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <Badge className="mb-4 bg-purple-100 text-purple-600 hover:bg-purple-200 text-sm py-1.5 px-4 rounded-full">
                            <Clock className="w-4 h-4 mr-1" /> Limited Time Offer
                        </Badge>
                        <h2 className={`text-3xl md:text-5xl font-bold text-gray-900 mb-4 ${spaceGrotesk.className}`}>
                            Ready to Transform Your Business?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Join thousands of businesses that are saving time, reducing costs, and boosting productivity with Zapllo.
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

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    size="lg"
                                    onClick={() => openCheckoutWithPlan('Zapllo Money Saver Bundle')}
                                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 hover:from-indigo-600 hover:via-purple-600 hover:to-orange-600 text-white font-bold px-8 py-6 rounded-full text-lg shadow-xl"
                                >
                                    Get the Money Saver Bundle
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    size="lg"
                                    onClick={() => openCheckoutWithPlan('Zapllo Tasks')}
                                    className="bg-white border-2 border-purple-500 text-purple-700 hover:bg-purple-50 font-bold px-8 py-6 rounded-full text-lg"
                                >
                                    Get Zapllo Tasks Only
                                </Button>
                            </motion.div>
                        </div>

                        <p className="mt-6 text-gray-500">
                            Use code <span className="font-semibold text-purple-600">{promoCode}</span> for 50% off at checkout
                        </p>
                    </motion.div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className={`text-xl font-bold text-gray-900 ${spaceGrotesk.className}`}>
                                Our Customer Promise
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "30-Day Money-Back Guarantee",
                                    description: "Risk-free purchase with our full refund policy"
                                },
                                {
                                    title: "Premium Support Included",
                                    description: "Dedicated team to help you every step of the way"
                                },
                                {
                                    title: "Free Onboarding & Training",
                                    description: "Get your team up and running quickly and efficiently"
                                }
                            ].map((promise, index) => (
                                <div key={index} className="flex flex-col">
                                    <h4 className="font-semibold text-gray-900 mb-2">{promise.title}</h4>
                                    <p className="text-gray-600 text-sm">{promise.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <OtherFooter />
        </main>
    );
}