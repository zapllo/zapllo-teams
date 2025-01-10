import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ShimmerButton from "../magicui/shimmer-button";
import ShineBorder from "../magicui/shine-border";
import { Calendar, File } from "lucide-react";
import { Button } from "./button";

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

    // Initialize visible state as true
    const [visible, setVisible] = useState(true);

    // Handle hover state for "Products" dropdown
    const [isProductsHovered, setIsProductsHovered] = useState(false);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className=" gap-2 max-w-6xl fixed top-0 md:top-5 py-3 inset-x-0 mx-auto border-transparent rounded-full bg-[#141841] shadow-md z-[5000] px-6 flex items-center justify-between"
            >
                <motion.div
                    className={cn(
                        "flex max-w-fit   fixed top-5 md:top-8 inset-x-0 mx-auto border dark:border-[#2C2E44] rounded-full bg-[#141841] shadow-lg z-[5000] px-4 py-2 justify-center space-x-6",
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
                                    "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500",
                                    pathname === navItem.link && " "
                                )}
                                style={{ position: "relative" }}
                            >
                                <span className="block sm:hidden">{navItem.icon}</span>
                                <span className="hidden sm:block text-md">{navItem.name}</span>
                                {pathname === navItem.link && (
                                    <span className="absolute bottom-0 left-0 top-8 w-full h-0.5 bg-purple-400 rounded-sm shadow-purple-400 shadow-[4px_-2px_8px_rgba(0,0,0,0.38)]" />
                                )}
                            </Link>

                            {/* Dropdown for Products */}
                            {navItem.name === "Business Apps" && (
                                <AnimatePresence>
                                    {isProductsHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute space-y-12 gap-y-6 top-8 left-0  h-fit w-64 mt-2 bg-background shadow-lg rounded-lg py-2 px-4 z-10"
                                        >
                                            <Link href="/products/zapllo-teams">
                                                <p className="p-2 mt-2 text-sm flex gap-1  hover:bg-[#815bf5] rounded-md">
                                                    {/* <img src="/branding/teams.png" className="w-36" /> */}
                                                    Task Delegation App
                                                </p>
                                            </Link>
                                            <Link href="/products/zapllo-payroll">
                                                <p className="p-2 mt-2  text-sm flex gap-1  hover:bg-[#815bf5]   rounded-md">
                                                    {/* <img src="/branding/attendance.png" className="w-40" /> */}
                                                    Zapllo Payroll
                                                </p>
                                            </Link>
                                            <Link href="#">
                                                <p className="p-2 text-sm mt-2 flex gap-1  hover:bg-[#815bf5]   rounded-md">
                                                    {/* <img src="/branding/ai.png" className="w-28" />   */}
                                                    Zapllo AI Assistant
                                                </p>
                                            </Link>
                                            <Link href="#">
                                                <p className="p-2 mt-2  text-sm flex gap-1  hover:bg-[#815bf5]   rounded-md">
                                                    {/* <img src="/branding/crm.png" className="w-28" />   */}
                                                    Zapllo CRM (Coming Soon)
                                                </p>
                                            </Link>
                                            <Link href="#">
                                                <p className="p-2 mt-2  text-sm flex gap-1 hover:bg-[#815bf5] rounded-md">
                                                    {/* <img src="/branding/invoice.png" className="w-32" />   */}
                                                    Zapllo Invoice (Coming Soon)
                                                </p>
                                            </Link>

                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </motion.div>

                <div className="py-3 ml-6">
                    <Link href="/">
                        <img src="/logo.png" height={120} width={120} alt="Zapllo Logo" className="-mt-1" />
                    </Link>
                </div>
                <div className="flex items-center gap-2">

                    <Button className="bg-gradient-to-t h-10 from-[#1C1F3E] to-[#010313] hover:border-[#815bf5] border hover:bg-black rounded-full">
                        <Link
                            href="/signup"
                            className="relative m0 text-white font-medium    overflow-hidden rounded-full "
                        >
                            <h1 className="text-md">
                                Get Started
                            </h1>
                        </Link>

                    </Button>
                    <Link
                        href="/login"
                        className="relative h-10 text-white font-medium  overflow-hidden rounded-full  "
                    >

                        <Button className="rounded-full border bg-[#815bf5]">
                            <h1 className="text-md">
                                Login
                                </h1>
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
