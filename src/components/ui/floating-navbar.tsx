import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./button";
import {
    ChevronDown,
    LayoutDashboard,
    CalendarDays,
    MessageSquare,
    BarChart,
    FileText,
    Rocket
} from "lucide-react";

export const FloatingNav = ({
    navItems,
    className,
}: {
    navItems: {
        name: string;
        link: string;
        icon?: JSX.Element;
    }[];
    className?: string;
}) => {
    const pathname = usePathname();
    const [visible, setVisible] = useState(true);
    const [isProductsHovered, setIsProductsHovered] = useState(false);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl fixed top-0 md:top-5 py-3 inset-x-0 mx-auto border border-gray-800/30 rounded-full bg-[#141841]/80 backdrop-blur-md shadow-lg z-[5000] px-6 flex items-center justify-between"
            >
                <div className="py-3 ml-2">
                    <Link href="/">
                        <img src="/logo.png" height={120} width={120} alt="Zapllo Logo" className="-mt-1" />
                    </Link>
                </div>

                <motion.div
                    className={cn(
                        "flex items-center justify-center space-x-6",
                        className
                    )}
                >
                    {navItems.map((navItem: any, idx: number) => (
                        <div
                            key={`link=${idx}`}
                            onMouseEnter={() => navItem.name === "Business Apps" && setIsProductsHovered(true)}
                            onMouseLeave={() => navItem.name === "Business Apps" && setIsProductsHovered(false)}
                            className="relative"
                        >
                            <Link
                                href={navItem.link}
                                className={cn(
                                    "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-300 hover:text-white transition-colors duration-200",
                                    pathname === navItem.link && "text-white"
                                )}
                            >
                                <span className="block sm:hidden">{navItem.icon}</span>
                                <span className="hidden sm:block text-md font-medium">{navItem.name}</span>
                                {navItem.name === "Business Apps" && (
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProductsHovered ? 'rotate-180' : ''}`} />
                                )}
                                {pathname === navItem.link && (
                                    <motion.span
                                        layoutId="navbar-indicator"
                                        className="absolute bottom-0 left-0 top-8 w-full h-0.5 bg-gradient-to-r from-[#815BF5] to-[#FC8929] rounded-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </Link>

                            {/* Dropdown for Products */}
                            {navItem.name === "Business Apps" && (
                                <AnimatePresence>
                                    {isProductsHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-8 left-0 w-72 mt-2 bg-[#1a1e48] border border-gray-800/50 shadow-xl rounded-lg py-2 px-1 z-10"
                                        >
                                            <Link href="/products/zapllo-teams">
                                                <div className="p-2 hover:bg-[#292e6a] rounded-md transition-colors flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#815bf5]/20 rounded-md flex items-center justify-center">
                                                        <LayoutDashboard className="w-4 h-4 text-[#815bf5]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Task Delegation App</p>
                                                        <p className="text-xs text-gray-400">Boost team productivity</p>
                                                    </div>
                                                </div>
                                            </Link>
                                            <Link href="/products/zapllo-payroll">
                                                <div className="p-2 hover:bg-[#292e6a] rounded-md transition-colors flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#815bf5]/20 rounded-md flex items-center justify-center">
                                                        <CalendarDays className="w-4 h-4 text-[#815bf5]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Zapllo Payroll</p>
                                                        <p className="text-xs text-gray-400">Leave & Attendance tracking</p>
                                                    </div>
                                                </div>
                                            </Link>
                                            <Link href="#">
                                                <div className="p-2 hover:bg-[#292e6a] rounded-md transition-colors flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#815bf5]/20 rounded-md flex items-center justify-center">
                                                        <MessageSquare className="w-4 h-4 text-[#815bf5]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Zapllo AI Assistant</p>
                                                        <p className="text-xs text-gray-400">AI-powered business help</p>
                                                    </div>
                                                </div>
                                            </Link>
                                            <Link href="https://crm.zapllo.com">
                                                <div className="p-2 hover:bg-[#292e6a] rounded-md transition-colors flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#815bf5]/20 rounded-md flex items-center justify-center">
                                                        <BarChart className="w-4 h-4 text-[#815bf5]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Zapllo CRM <span className="ml-1 px-1.5 py-0.5 bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white text-[10px] rounded-full">NEW</span></p>
                                                        <p className="text-xs text-gray-400">Manage customers & leads</p>
                                                    </div>
                                                </div>
                                            </Link>
                                            <Link href="#">
                                                <div className="p-2 hover:bg-[#292e6a] rounded-md transition-colors flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-[#815bf5]/20 rounded-md flex items-center justify-center">
                                                        <FileText className="w-4 h-4 text-[#815bf5]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Zapllo Invoice <span className="ml-1 px-1.5 py-0.5 bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white text-[10px] rounded-full">SOON</span></p>
                                                        <p className="text-xs text-gray-400">Simplify billing & payments</p>
                                                    </div>
                                                </div>
                                            </Link>
                                           
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </motion.div>

                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="ghost" className="text-white hover:text-white/80 hover:bg-white/10 rounded-full">
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-gradient-to-r from-[#815BF5] to-[#FC8929] hover:opacity-90 transition-opacity rounded-full px-5 py-2">
                            <Rocket className="mr-2 h-4 w-4" /> Get Started
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};