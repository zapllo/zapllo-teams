'use client'

import Footer from "@/components/globals/Footer";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { FloatingNavbar } from "@/components/globals/navbar";
import { cn } from "@/lib/utils";
import { Golos_Text, Space_Grotesk } from "next/font/google";
import { TestimonialCards2 } from "@/components/globals/TestimonialCards";
import Image from "next/image";
import Testimonials2 from "@/components/globals/testimonials2";
import { useEffect, useState } from "react";
import MultiStepForm from "@/components/forms/checkoutForm";
import { BellRingIcon, Clock } from "lucide-react";
import TaskDelegationCard from "@/components/cards/checkoutCards";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const golos = Golos_Text({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

type PlanKeys = 'Zapllo Tasks' | 'Zapllo Money Saver Bundle' | 'Zapllo Payroll';


const mockData = [
    { name: 'Neha Sharma', plan: 'Money Saver Bundle', timeAgo: '1 hour ago' },
    { name: 'Rohan Mehta', plan: 'Zapllo Payroll', timeAgo: '30 minutes ago' },
    { name: 'Priya Verma', plan: 'Zapllo Tasks', timeAgo: '10 minutes ago' },
    { name: 'Amitabh Chatterjee', plan: 'Money Saver Bundle', timeAgo: '5 minutes ago' },
    { name: 'Sneha Kapoor', plan: 'Zapllo Payroll', timeAgo: '3 hours ago' },
    { name: 'Kunal Joshi', plan: 'Zapllo Tasks', timeAgo: '6 hours ago' },
    { name: 'Anjali Singh', plan: 'Money Saver Bundle', timeAgo: '15 minutes ago' },
    { name: 'Rahul Gupta', plan: 'Zapllo Tasks', timeAgo: '7 hours ago' },
    { name: 'Pooja Mishra', plan: 'Zapllo Payroll', timeAgo: '1 day ago' },
    { name: 'Siddharth Desai', plan: 'Zapllo Tasks', timeAgo: '20 minutes ago' },
    { name: 'Nisha Patel', plan: 'Money Saver Bundle', timeAgo: '2 days ago' },
    { name: 'Arjun Iyer', plan: 'Zapllo Payroll', timeAgo: '3 hours ago' },
    { name: 'Meera Rao', plan: 'Zapllo Tasks', timeAgo: '50 minutes ago' },
    { name: 'Vikram Nair', plan: 'Money Saver Bundle', timeAgo: '30 seconds ago' },
    { name: 'Aarti Kulkarni', plan: 'Zapllo Tasks', timeAgo: '4 hours ago' },
    { name: 'Gaurav Dixit', plan: 'Zapllo Payroll', timeAgo: '1 week ago' },
    { name: 'Swati Bhattacharya', plan: 'Money Saver Bundle', timeAgo: '10 days ago' },
    { name: 'Deepak Kumar', plan: 'Zapllo Tasks', timeAgo: '5 hours ago' },
    { name: 'Komal Jain', plan: 'Zapllo Payroll', timeAgo: '3 days ago' },
    { name: 'Rajesh Khanna', plan: 'Zapllo Tasks', timeAgo: '1 month ago' },
    { name: 'Asha Reddy', plan: 'Money Saver Bundle', timeAgo: '2 weeks ago' },
    { name: 'Ishita Roy', plan: 'Zapllo Payroll', timeAgo: '3 months ago' },
    { name: 'Prateek Agarwal', plan: 'Zapllo Tasks', timeAgo: '8 minutes ago' },
    { name: 'Shweta Malhotra', plan: 'Money Saver Bundle', timeAgo: '12 minutes ago' },
    { name: 'Tarun Bhatia', plan: 'Zapllo Payroll', timeAgo: '1 year ago' },
    { name: 'Nidhi Tripathi', plan: 'Zapllo Tasks', timeAgo: '40 minutes ago' },
    { name: 'Harsh Pandey', plan: 'Money Saver Bundle', timeAgo: '1 second ago' },
    { name: 'Kriti Tiwari', plan: 'Zapllo Payroll', timeAgo: '16 minutes ago' },
    { name: 'Ravi Chauhan', plan: 'Zapllo Tasks', timeAgo: '2 hours ago' },
    { name: 'Ankita Bose', plan: 'Money Saver Bundle', timeAgo: '10 hours ago' },
    { name: 'Suresh Shetty', plan: 'Zapllo Payroll', timeAgo: '1 hour ago' },
    { name: 'Neeraj Mathur', plan: 'Zapllo Tasks', timeAgo: '2 days ago' },
    { name: 'Kavita Menon', plan: 'Money Saver Bundle', timeAgo: '6 hours ago' },
    { name: 'Manoj Jadhav', plan: 'Zapllo Payroll', timeAgo: '7 days ago' },
    { name: 'Divya Nambiar', plan: 'Zapllo Tasks', timeAgo: '5 minutes ago' },
    { name: 'Ashok Thakur', plan: 'Money Saver Bundle', timeAgo: '2 months ago' },
    { name: 'Piyush Arora', plan: 'Zapllo Payroll', timeAgo: '4 minutes ago' },
    { name: 'Simran Gill', plan: 'Zapllo Tasks', timeAgo: '2 weeks ago' },
    { name: 'Mohit Bansal', plan: 'Money Saver Bundle', timeAgo: '30 minutes ago' },
    { name: 'Alok Banerjee', plan: 'Zapllo Payroll', timeAgo: '10 seconds ago' },
    { name: 'Jyoti Sinha', plan: 'Zapllo Tasks', timeAgo: '3 hours ago' },
    { name: 'Ritika Dutta', plan: 'Money Saver Bundle', timeAgo: '1 week ago' },
    { name: 'Sanjay Kaur', plan: 'Zapllo Payroll', timeAgo: '15 minutes ago' },
    { name: 'Tanvi Luthra', plan: 'Zapllo Tasks', timeAgo: '12 hours ago' },
    { name: 'Abhishek Joshi', plan: 'Money Saver Bundle', timeAgo: '45 minutes ago' },
    { name: 'Rekha Mahajan', plan: 'Zapllo Payroll', timeAgo: '30 minutes ago' },
    { name: 'Yash Goel', plan: 'Zapllo Tasks', timeAgo: '1 hour ago' },
    { name: 'Karan Oberoi', plan: 'Money Saver Bundle', timeAgo: '2 hours ago' },
];



export default function Home() {
    const [timeLeft, setTimeLeft] = useState(45 * 60); // 15 minutes in seconds
    const [checkoutData, setCheckoutData] = useState<{
        showCheckout: boolean;
        selectedPlan: PlanKeys;
    }>({ showCheckout: false, selectedPlan: 'Zapllo Money Saver Bundle' });

    const router = useRouter();

    const [countdown, setCountdown] = useState(20);

    useEffect(() => {
        const intervalDuration = (45 * 60) / (20 - 3); // Interval duration in seconds
        const interval = setInterval(() => {
            setCountdown((prev) => (prev > 3 ? prev - 1 : 3)); // Decrease countdown until it reaches 3
        }, intervalDuration * 1000); // Convert to milliseconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            const data = mockData[index];
            toast(
                <div className="">
                    <div className="flex gap-2 items-center">
                        <div className="flex m-auto items-center">
                            <Avatar className="h-6 w-6 rounded-full flex  bg-[#815BF5] items-center">
                                {/* <AvatarImage className='h-6 w-6 ml-1 ' src={`/icons/${category.name.toLowerCase()}.png`} /> */}
                                <AvatarFallback className="bg-[#815BF5]">
                                    <h1 className="text-sm text-white">
                                        {`${data.name}`.slice(0, 1)}
                                        {/* {`${user.lastName}`.slice(0, 1)} */}
                                    </h1>
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="text-white text-sm">
                            <strong>{data.name}</strong> just purchased {' '}
                        </div>
                    </div>
                    <div>
                        <strong className="text-white text-md ml-8 ">{`${data.plan}`}</strong>
                    </div>
                    <div className="flex items-center gap-2  ml-8 ">
                        <span className="text-[#787CA5] text-sm">{data.timeAgo}</span>

                    </div>
                </div>
                ,
                {
                    position: 'bottom-left', // Specify the position
                    duration: 10000, // Optional: Longer duration if needed
                    style: {
                        background: '#0B0D26',
                        borderColor: 'gray',

                    }
                },
            );
            index = (index + 1) % mockData.length; // Loop through the mock data
        }, 5000); // Show toast every 10 seconds

        return () => clearInterval(interval); // Clear interval on unmount
    }, []);

    const openCheckoutWithPlan = (plan: PlanKeys) => {
        router.push(`/special-offer-checkout?selectedPlan=${plan}`);
    };
    // Countdown timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime: any) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        // Clear interval on component unmount
        return () => clearInterval(timer);
    }, []);

    // Format the time as MM:SS
    const formatTime = (time: any) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        // <LoaderLayout>
        <main className="bg-[#] bg-[#05071E] w-full  mx-auto h-full z-10 overflow-hidden">
            <FloatingNavbar />
            <Image
                src="/mask.png"
                height={1000}
                className=" absolute overflow-hidden -mt-96  w-full "
                width={1000}
                alt="Background mask for zapllo automation"
            />

            {/* Freedom Code */}

            <div className="w-full py-2 bg-gradient-to-r from-[#815BF5] via-[#9D5DF0] to-[#FC8929] flex items-center justify-center mt-32 ">
                <p className="text-white text-lg font-medium mr-4">
                    Limited Time Offer Just For Today. Grab the Deal!
                </p>
                <div className="bg-white items-center text-[#05071E] flex gap-1 font-semibold px-4 py-1 rounded-md">
                    {countdown} Seats Left
                </div>
            </div>

            {/* Run Your Business */}

            <div className="  bg-[#05071E]">
                <div className="mb-4 mt-12 ">
                    <h1 className="text-center  text-4xl font-semibold text-green-500">Zapllo New Year Sale</h1>
                    <div
                        className={cn(
                            "group mt-6  relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl  px-4 py-1.5 md:text-3xl font-medium   ",
                        )}
                    >
                        <span
                            className={cn(
                                `inline animate- text-8xl text-centera  font-bold bg-gradient-to-r from-[#815BF5] via-[#AD64D0] to-[#FC8929]  bg-clip-text text-transparent`
                            )}
                        >
                            Up To 60% Off For 1 year
                        </span>
                    </div>
                    <div className="absolute 2xl:right-72 mt-2 right-56 ">
                        <img src="/icons/arrow.png" className="h-16" />
                    </div>
                    <div className="absolute 2xl:right-36 mt-16 right-16 ">
                        <img src="/icons/offer.png" />
                        <h1 className="text-white text-xl -mt-28 ml-20 ">Use Code</h1>
                        <span className="font-bold text-white text-3xl -mt-28 ml-14">&quot;NY2025&quot;</span>
                        {/* <Clock className="h-4" /> */}
                        <h1 className="text-white text-2xl  ml-[90px] ">
                            {formatTime(timeLeft)}
                        </h1>

                    </div>
                    <div className="w-full flex justify-center mt-6 p-2 ">
                        <p className="text-center w-1/2 text-muted-foreground ">Lock in our best-ever price and get access to every new feature, For an year. This
                            one-time Offer ends soon. Act now before it&apos;s gone for good!</p>
                    </div>

                    <div className="w-full flex cursor-pointer  justify-center mt-8">
                        <a href="#cards">
                            <div
                                className={cn(
                                    "group rounded-full border border-black/5  transition-all ease-in  text-base w-fit px-4 py-2 text-white  cursor-pointer  dark:border-white/5 dark:hover:text-white dark:bg-gradient-to-r from-[#815BF5] to-[#5E29FF] dark:hover:bg-blue-800",
                                )}
                            >
                                Yes, Tell me More!
                            </div></a>

                    </div>

                </div>

                <div className="z-10 flex items-center justify-center">
                    <div
                        className={cn(
                            "group mt-24 relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl  px-4 py-1.5 md:text-3xl font-medium   ",

                        )}
                    >
                        <span
                            className={cn(
                                `inline animate-  text-center md:text-3xl  font-bold bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929]  bg-clip-text text-transparent`
                            )}
                        >
                            Run your Business on Autopilot <span className='text-white'>🚀</span>
                        </span>
                    </div>
                </div>


                <div className="flex justify-center">
                    <h1 className="text-center   bg-clip-text  font-extrabold  md:text-5xl mt-4   mx-4 md:max-w-[1000px]">
                        Business Workspace for MSMEs
                    </h1>
                </div>

                <div id="cards" className="flex justify-center ">
                    <p
                        className={`max-w-[1000px] text-center mx-4 text-balance md:mx-0 mt-4 md:text-lg leading-relaxed text-muted-foreground ${golos.className}`}
                    >
                        Single Application to Manage Entire Team&apos;s Tasks, Leads,
                        Leaves, and Attendance with WhatsApp Integration!
                    </p>
                </div>
                <div id="cards" className="flex gap-4 items-center mt-8  justify-center ">
                    <div>
                        <img src="/coffee.png" className="h-20" />
                    </div>
                    <div>
                        <h1 className="text-3xl mt-6">
                            <span className="bg-gradient-to-r font-bold from-[#815BF5] via-[#FC8929] to-[#FC8929]  bg-clip-text text-transparent ">₹ 170/month</span>  which is less than a cup of Coffee
                        </h1>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="mt-20 bg-[#05071E]  mx-4 flex flex-col items-center gap-8">
                <div className="grid grid-cols-3 w-full max-w-7xl   justify-center gap-12 relative">
                    {/* Left Card */}
                    <div className="bg-[#0A0D28] mt-8 border rounded-[50px_50px_50px_50px] w-full   p-6 text-white relative z-10 shadow-lg">
                        <div className="absolute -top-0 right-0 w-32 bg-gradient-to-r from-[#815BF5] to-[#FC8929] px-4 py-1 rounded-[0_50px_0_20px] text-sm font-thin text-white">
                            Get Flat 50% OFF
                        </div>

                        <h2
                            className="font-golosText text-lg mt-4"

                        >
                            Zapllo Tasks
                        </h2>
                        <p className="text- mt-2 line-through text-[#F13535]" style={{ fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>
                            ₹4000
                        </p>

                        <div className="flex items-end mt-4">
                            <p
                                className="text-5xl font-semibold"
                            >
                                ₹1999
                            </p>
                            <span
                                className="ml-2 text-lg"
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "400",
                                    lineHeight: "24px",
                                    color: "#676B93",
                                }}
                            >
                                / per user per year
                            </span>
                        </div>

                        <p
                            className="mt-2"
                            style={{
                                fontSize: "16px",
                                fontWeight: "400",
                                lineHeight: "24px",
                            }}
                        >
                            Save 4 hours per day for each employee
                        </p>
                        <div
                            className="mt-4"
                            style={{
                                borderTop: "1px solid #424882",
                                width: "100%",
                            }}
                        ></div>

                        <ul className="mt-4 space-y-3">
                            {[
                                "Zapllo Tasks - Task Delegation App",
                                "Zapllo Intranet",
                                "Zapllo AI - Proprietory AI Technology"


                            ].map((item, index) => (
                                <li key={index} className="flex gap-2 items-center">
                                    <img src="/icons/tick.png" />
                                    <span
                                        className="text-sm font-medium"
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                            {[
                                "Zapllo WABA - Official WhatsApp API & Marketing Software",
                                "Zapllo Payroll - Attendance Tracking App",
                                "Zapllo Payroll - Leave Management App",

                            ].map((item, index) => (
                                <li key={index} className="flex gap-2 items-center">
                                    <img src='/icons/crosss.png' />
                                    <span
                                        className="text-sm font-medium"
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div
                            className="mt-4"
                            style={{
                                borderTop: "1px solid #424882",
                                width: "100%",
                            }}
                        ></div>
                        {/* Original Price */}
                        <p className="text-center text-sm mt-2 line-through text-[#F13535]" style={{}}>
                            ₹4000 per user per year
                        </p>
                        <p className="text-center mt-2   text-green-400" style={{ fontSize: "15px", fontWeight: "400", lineHeight: "24px" }}>
                            Today&apos;s Offer - ₹1999 per user per year
                        </p>
                        <button onClick={() => openCheckoutWithPlan('Zapllo Tasks')} className="mt-6 hover:shadow hover:shadow-white w-full py-2 border-2 border-primary rounded-full font-semibold   transition-colors">
                            Get Task Delegation App
                        </button>
                    </div>
                    {/* Middle Card */}
                    <div className="p-[2px]  bg-gradient-to-r from-[#815BF5] to-[#FC8929] rounded-[50px]">
                        <div
                            className="bg-white mb-8 rounded-[50px] h-full  w-full p-8 text-[#05071E] relative z-20 shadow-lg"
                        >
                            {/* Discount Tag */}
                            <div className="absolute  -top-0 right-0 bg-gradient-to-r from-[#815BF5] to-[#FC8929] px-4 py-1 w-32 rounded-[0_50px_0_20px] text-sm  font-thin text-white">
                                Get Flat 50% OFF
                            </div>

                            {/* Title */}
                            <h2 className="font-golosText text-lg mt-4">
                                Zapllo Money Saver Bundle
                            </h2>
                            <p className="text- mt-2 line-through text-[#F13535]" style={{ fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>
                                ₹6000
                            </p>
                            {/* Price */}
                            <div className="flex items-end mt-4">
                                <p className="text-5xl font-bold">₹2999</p>
                                <span className="ml-2 text-lg text-[#676B93]" style={{ fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>
                                    / per user per year
                                </span>
                            </div>

                            {/* Description */}
                            <p className="mt-2 text-[#05071E]" style={{ fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>
                                10X Your Team&apos;s Productivity
                            </p>

                            {/* Divider Line */}
                            <div className="mt-4 border-t border-[#424882]"></div>

                            {/* Feature List */}
                            <ul className="mt-4 space-y-3">
                                {[
                                    "Zapllo Tasks - Task Delegation App",
                                    "Zapllo Payroll - Attendance Tracking App",
                                    "Zapllo Payroll - Leave Management App",
                                    "Zapllo Intranet",
                                    "Zapllo AI - Proprietory AI Technology",
                                    "Zapllo WABA - Official WhatsApp API & Marketing Software",


                                ].map((item, index) => (
                                    <li key={index} className="flex gap-2 items-center">
                                        <img src="/icons/tick.png" />
                                        <span className="text-sm font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Divider Line */}
                            <div className="mt-4 border-t border-[#424882]"></div>

                            {/* Original Price */}
                            <p className="text-center text-sm mt-2 line-through text-[#F13535]" style={{}}>
                                ₹12000 per user per year
                            </p>
                            <p className="text-center text-sm mt-2 line-through text-[#F13535]" style={{}}>
                                Today&apos;s Offer - ₹5999 per user per year
                            </p>
                            <p className="text-center mt-2   text-green-600" style={{ fontSize: "15px", fontWeight: "400", lineHeight: "24px" }}>
                                Zapllo New Year Offer - ₹2999 per user per year
                            </p>


                            {/* CTA Button */}
                            <button
                                className="mt-8 w-full py-3 hover:shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] rounded-full font-semibold text-white"
                                onClick={() => openCheckoutWithPlan('Zapllo Money Saver Bundle')}
                                style={{
                                    background: "radial-gradient(51.84% 97.12% at 50% 100%, #A587FF 0%, #5E29FF 100%)",
                                    borderTop: "1px solid #A485FF",
                                }}
                            >
                                Get Money Saver Bundle
                            </button>
                        </div>
                    </div>

                    {/* Right Card */}
                    <div className="bg-[#0A0D28] border rounded-[50px_50px_50px_50px] w-full mt-8  p-6 text-white relative z-10 shadow-lg">
                        <div className="absolute -top-0 right-0 w-32 bg-gradient-to-r from-[#815BF5] to-[#FC8929] px-4 py-1 rounded-[0_50px_0_20px] text-sm font-thin text-white">
                            Get Flat 50% OFF
                        </div>
                        {/* <h2 className="text-2xl font-bold mt-4">Zapllo Payroll</h2> */}

                        <h2
                            className=" text-lg mt-4"

                        >
                            Zapllo Double Dhamaka
                        </h2>
                        <p className="text- mt-2 line-through text-[#F13535]" style={{ fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>
                            ₹2000
                        </p>
                        <div className="flex items-end mt-4">
                            <p
                                className="text-5xl font-semibold"

                            >
                                ₹999
                            </p>
                            <span
                                className="ml-2 text-lg"
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "400",
                                    lineHeight: "24px",
                                    color: "#676B93",
                                }}
                            >
                                / per user per year
                            </span>
                        </div>

                        <p
                            className="mt-2"
                            style={{
                                fontSize: "16px",
                                fontWeight: "400",
                                lineHeight: "24px",
                            }}
                        >
                            Leave & Attendance + Intranet
                        </p>

                        <div
                            className="mt-4"
                            style={{
                                borderTop: "1px solid #424882",
                                width: "100%",
                            }}
                        ></div>

                        <ul className="mt-4 space-y-3">
                            {[
                                "Zapllo Payroll - Attendance Tracking App",
                                "Zapllo Payroll - Leave Management App",
                                "Zapllo Intranet",
                                "Zapllo AI - Proprietory AI Technology",
                            ].map((item, index) => (
                                <li key={index} className="flex gap-2 items-center">
                                    <img src="/icons/tick.png" />
                                    <span
                                        className="text-sm font-medium"
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                            {[
                                "Zapllo Tasks - Task Delegation App",
                                "Zapllo WABA - Official WhatsApp API & Marketing Software",
                            ].map((item, index) => (
                                <li key={index} className="flex gap-2 items-center">
                                    <img src="/icons/crosss.png" />
                                    <span
                                        className="text-sm font-medium"
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div
                            className="mt-4"
                            style={{
                                borderTop: "1px solid #424882",
                                width: "100%",
                            }}
                        ></div>

                        <p
                            className="text-center mt-2 line-through"
                            style={{
                                fontSize: "16px",
                                fontWeight: "400",
                                lineHeight: "24px",
                                color: "#F13535",
                            }}
                        >
                            ₹2000 per user per year
                        </p>
                        <p className="text-center mt-2   text-green-400" style={{ fontSize: "15px", fontWeight: "400", lineHeight: "24px" }}>
                            Today&apos;s Offer - ₹999 per user per year
                        </p>

                        <button onClick={() => openCheckoutWithPlan('Zapllo Payroll')} className="mt-6 hover:shadow hover:shadow-white w-full py-2 border-2 border-primary rounded-full font-semibold transition-colors">
                            Get Payroll App
                        </button>
                    </div>
                </div>
            </div>


            <div className="flex justify-center mt-12 w-full">
                <img src='/branding/container.png' className="w-[70%]" />
            </div>



            {/* <img src="light.png" className="-mt-72 h-96 w-[50%]" /> */}

            {/* Testimonial Cards */}

            <div className="justify-center mt-12  flex">
                <Testimonials2 />
            </div>

            {/* Buttons */}

            <div className="w-full flex justify-center ">
                <div className=" flex  gap-4">
                    {[
                        { title: "Multi User Login" },
                        { title: "WhatsApp Integration" },
                        { title: "Voice Notes" },
                        { title: "Email Integration" },
                        { title: "Whatsapp Reminders" },
                        { title: "Realtime Reports" },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-center px-4  text-sm w-fit  gap-4  py-3 rounded-[20px_20px_20px_20px] text-white font-golosText"
                            style={{
                                width:
                                    feature.title === "WhatsApp Integration" ? "" : "", // Increase width for "WhatsApp Integration"
                                background: "linear-gradient(90deg, #815BF5 0%, #FC8929 100%)",
                            }}
                        >
                            <span className="flex-shrink-0 bg-white pb-1   rounded-full w-6 h-6 flex items-center justify-center text-[#815BF5]">
                                ✔️
                            </span>
                            <span
                                className="text-sm font-normal whitespace-nowrap"
                            >
                                {feature.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Zapllo Task Div */}
            <div>
                <div className="flex flex-col items-center justify-center mt-20">
                    {/* ZaplloTask Gradient Text */}
                    <h2
                        className="font-spaceGrotesk font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#815BF5] to-[#FC8929]"
                    >
                        Zapllo Tasks
                    </h2>

                    {/* Task Delegation App Title */}
                    <h1
                        className="font-spaceGrotesk font-extrabold text-white mt-2 text-center"
                        style={{
                            fontSize: "46px",
                            lineHeight: "58.7px",
                            width: "451px",
                            height: "59px",
                        }}
                    >
                        Task Delegation App
                    </h1>

                    {/* Subtitle Text */}
                    <p
                        className="font-golosText text-white text-center mt-2"
                        style={{
                            fontSize: "17px",
                            lineHeight: "30px",
                            width: "1004px",
                        }}
                    >
                        Save 5 hours per day for each team member
                    </p>
                </div>
                <div>
                    <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 py-16">
                        {/* Left Side Image */}
                        <div className="p-8 rounded-lg w-full md:w-1/3 flex items-center justify-center">
                            <img
                                // src="/path-to-image.png" // Replace with actual path
                                src="/mockups/task.png"
                                alt="Book Cover Placeholder"
                                className="w-full h-full scale-[180%]"
                            />
                        </div>

                        {/* Right Side Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-2/3">
                            {[
                                {
                                    title: "Delegate Tasks",
                                    description:
                                        "Track all your tasks to never miss out on any tasks. Assign tasks to your teammates with deadlines, category, and priority.",
                                },
                                {
                                    title: "WhatsApp Notifications",
                                    description:
                                        "Automated task assign notification to task owner and task status update notifications to task delegator on WhatsApp & Email.",
                                },
                                {
                                    title: "Task Reminders",
                                    description:
                                        "Add task-specific reminders to get reminded a certain amount of time before the task is due, for example, 5 minutes before, 1 hour before, etc.",
                                },
                                {
                                    title: "Repeated Tasks",
                                    description:
                                        "Set up Daily, Weekly, Monthly repeating tasks that need to be done on a periodic basis.",
                                },
                                {
                                    title: "Team Performance Report",
                                    description:
                                        "Get real-time updates on tasks, including completion notifications. Analyze employee performance with MIS scores, fostering responsibility and accountability.",
                                },
                                {
                                    title: "Voice Notes",
                                    description:
                                        "While assigning tasks, you can add an audio note to explain in detail about how to perform a specific task or what to avoid.",
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-[#0B0C24] p-6 rounded-lg border border-[#37384B] flex items-start space-x-4"
                                >
                                    {/* <span className="text-[#FC8929] text-2xl">✔️</span> */}
                                    <img
                                        src="/tick.png" // Replace with actual path
                                        alt="Tick Icon"
                                        className="flex-shrink-0"
                                        style={{
                                            width: "20.4px",
                                            height: "20.4px",
                                            marginTop: "5px", // Adjust as needed to move downward
                                            marginLeft: "5px", // Adjust as needed to move to the right
                                        }}
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="text-[#676B93] mt-2">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="container mx-auto flex flex-col items-center gap-6 ">
                    {/* Total Value Text */}
                    <p
                        className="text-center text-white font-golosText"
                        style={{
                            fontSize: "24px",
                            fontWeight: "400",
                            lineHeight: "28.8px",
                        }}
                    >
                        Total Value - <span style={{ fontWeight: "700" }}>₹50,000</span> per
                        employee
                    </p>

                    {/* Get Freedom Offer Button */}
                    <a href="#cards">
                        <button
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white font-semibold transition-all"
                            style={{
                                width: "328px",
                                height: "56px",
                                background:
                                    "radial-gradient(51.84% 97.12% at 50% 100%, #A587FF 0%, #5E29FF 100%)",
                                borderBottom: "1px solid #A485FF",
                            }}
                        >
                            Get New Year Offer Now
                        </button>
                    </a>
                </div>
            </div>

            <div>
                <div className="flex flex-col items-center justify-center mt-20">
                    {/* ZaplloTask Gradient Text */}
                    <h2
                        className="font-spaceGrotesk font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#815BF5] to-[#FC8929]"
                        style={{

                            height: "41px",
                            lineHeight: "40.83px",
                            textAlign: "left",
                        }}
                    >
                        Zapllo Payroll
                    </h2>

                    {/* Task Delegation App Title */}
                    <h1
                        className="font-spaceGrotesk font-extrabold text-white mt-2 text-center"
                        style={{
                            fontSize: "46px",
                            lineHeight: "58.7px",

                        }}
                    >
                        Attendance Tracking App
                    </h1>

                    {/* Subtitle Text */}
                    <p
                        className="font-golosText text-white text-center mt-2"
                        style={{
                            fontSize: "17px",
                            lineHeight: "30px",
                            width: "1004px",
                        }}
                    >
                        Save 5 hours per day for each team member
                    </p>
                </div>
                <div>
                    <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 py-16">
                        {/* Left Side Image */}
                        <div className=" p-8 rounded-lg w-full md:w-1/3 flex items-center justify-center">
                            <img
                                // src="/path-to-image.png" // Replace with actual path
                                src="/mockups/attendance.png"
                                alt="Book Cover Placeholder"
                                className="w-full h-full scale-[180%]"
                            />
                        </div>

                        {/* Right Side Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-2/3">
                            {[
                                {
                                    title: "Facial Recognition",
                                    description:
                                        "Employees can effortlessly punch in and out through their mobile phones, enhancing security and efficiency. With real-time face detection, offsite employees can easily manage attendance.",
                                },
                                {
                                    title: "Geo Location",
                                    description:
                                        "Auto Geo-location tagging ensures authenticity by capturing staff locations during logins and logouts, preventing fraud.",
                                },
                                {
                                    title: "Attendance Regularization",
                                    description:
                                        "Use Regularisation to mark the attendance of past dates, in which case reporting managers will get a notification from where they can approve/reject such requests.",
                                },
                                {
                                    title: "Monthly Report",
                                    description:
                                        "Get a detailed report of each employee’s present, absent, and leave counts for each month.",
                                },
                                {
                                    title: "WhatsApp Notification",
                                    description:
                                        "Reporting Managers get notified whenever there is a regularization request, and employees are notified when managers approve/reject the requests.",
                                },
                                {
                                    title: "Voice Notes",
                                    description:
                                        "Track all your tasks to never miss out on any tasks. Assign tasks to your teammates with deadlines, category, and priority.",
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-[#0B0C24] p-6 rounded-lg border border-[#37384B] flex items-start space-x-4"
                                >
                                    {/* <span className="text-[#FC8929] text-2xl">✔️</span> */}
                                    <img
                                        src="/tick.png" // Replace with actual path
                                        alt="Tick Icon"
                                        className="flex-shrink-0"
                                        style={{
                                            width: "20.4px",
                                            height: "20.4px",
                                            marginTop: "5px", // Adjust as needed to move downward
                                            marginLeft: "5px", // Adjust as needed to move to the right
                                        }}
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="text-[#676B93] mt-2">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="container mx-auto flex flex-col items-center gap-6 ">
                    {/* Total Value Text */}
                    <p
                        className="text-center text-white font-golosText"
                        style={{
                            fontSize: "24px",
                            fontWeight: "400",
                            lineHeight: "28.8px",
                        }}
                    >
                        Total Value - <span style={{ fontWeight: "700" }}>₹12,000</span> per
                        employee
                    </p>

                    {/* Get Freedom Offer Button */}
                    <a href="#cards">
                        <button
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white font-semibold transition-all"
                            style={{
                                width: "328px",
                                height: "56px",
                                background:
                                    "radial-gradient(51.84% 97.12% at 50% 100%, #A587FF 0%, #5E29FF 100%)",
                                borderBottom: "1px solid #A485FF",
                            }}
                        >
                            {/* Uncomment and replace with the actual icon path if needed */}
                            {/* <Image
    src="/path-to-phone-icon.png" // Replace with the actual path to the phone icon
    alt="Phone Icon"
    width={24}
    height={24}
  /> */}
                            Get New Year Offer Now
                        </button>
                    </a>
                </div>
            </div>

            <div>
                <div className="flex flex-col items-center justify-center mt-20">
                    {/* ZaplloTask Gradient Text */}
                    <h2
                        className="font-spaceGrotesk font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#815BF5] to-[#FC8929]"
                        style={{

                            height: "41px",
                            lineHeight: "40.83px",
                            textAlign: "left",
                        }}
                    >
                        Zapllo Payroll
                    </h2>

                    {/* Task Delegation App Title */}
                    <h1
                        className="font-spaceGrotesk font-extrabold text-white mt-2 text-center"
                        style={{
                            fontSize: "46px",
                            lineHeight: "58.7px",

                        }}
                    >
                        Leave Management App
                    </h1>

                    {/* Subtitle Text */}
                    <p
                        className="font-golosText text-white text-center mt-2"
                        style={{
                            fontSize: "17px",
                            lineHeight: "30px",
                            width: "1004px",
                        }}
                    >
                        Save 5 hours per day for each team member
                    </p>
                </div>
                <div>
                    <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 py-16">
                        {/* Left Side Image */}
                        <div className=" p-8 rounded-lg w-full md:w-1/3 flex items-center justify-center">
                            <img
                                // src="/path-to-image.png" // Replace with actual path
                                src="/mockups/leave.png"
                                alt="Book Cover Placeholder"
                                className="w-full h-full scale-[125%]"
                            />
                        </div>

                        {/* Right Side Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-2/3">
                            {[
                                {
                                    title: "Custom Leave Types",
                                    description:
                                        "Create your own leave policy by customizing leave types as per your company policy.",
                                },
                                {
                                    title: "Leave Approvals",
                                    description:
                                        "Employees can apply for leaves, and their respective reporting managers can approve/reject leave requests."
                                },
                                {
                                    title: "Partial Approval",
                                    description:
                                        "Managers have the flexibility to approve partial leave requests; managers can reject leave requests for individual dates.",
                                },
                                {
                                    title: "WhatsApp Notifications",
                                    description:
                                        "Reporting Managers get notified whenever there is a leave request, and employees are notified when managers approve/reject the requests.",
                                },
                                {
                                    title: "Leave Balance",
                                    description:
                                        "The current leave balance of each employee can be accessed by the reporting managers and Admins.",
                                },
                                {
                                    title: "Holidays & Week Offs",
                                    description:
                                        "Define the company’s weekly offs and holidays for easy access to yearly company holidays for festivals and other occasions.",
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-[#0B0C24] p-6 rounded-lg border border-[#37384B] flex items-start space-x-4"
                                >
                                    {/* <span className="text-[#FC8929] text-2xl">✔️</span> */}
                                    <img
                                        src="/tick.png" // Replace with actual path
                                        alt="Tick Icon"
                                        className="flex-shrink-0"
                                        style={{
                                            width: "20.4px",
                                            height: "20.4px",
                                            marginTop: "5px", // Adjust as needed to move downward
                                            marginLeft: "5px", // Adjust as needed to move to the right
                                        }}
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="text-[#676B93] mt-2">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="container mx-auto flex flex-col items-center gap-6 ">
                    {/* Total Value Text */}
                    <p
                        className="text-center text-white font-golosText"
                        style={{
                            fontSize: "24px",
                            fontWeight: "400",
                            lineHeight: "28.8px",
                        }}
                    >
                        Total Value - <span style={{ fontWeight: "700" }}>₹25,000</span> per
                        employee
                    </p>

                    {/* Get Freedom Offer Button */}
                    <a href="#cards2">
                        <button
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white font-semibold transition-all"
                            style={{
                                width: "328px",
                                height: "56px",
                                background:
                                    "radial-gradient(51.84% 97.12% at 50% 100%, #A587FF 0%, #5E29FF 100%)",
                                borderBottom: "1px solid #A485FF",
                            }}
                        >
                            {/* Uncomment and replace with the actual icon path if needed */}
                            {/* <Image
    src="/path-to-phone-icon.png" // Replace with the actual path to the phone icon
    alt="Phone Icon"
    width={24}
    height={24}
  /> */}
                            Get New Year Offer Now
                        </button>
                    </a>
                </div>
            </div>

            <div>
                <div className="flex flex-col items-center justify-center mt-20">
                    {/* ZaplloTask Gradient Text */}
                    <h2
                        className="font-spaceGrotesk font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#815BF5] to-[#FC8929]"
                        style={{

                            height: "41px",
                            lineHeight: "40.83px",
                            textAlign: "left",
                        }}
                    >
                        Zapllo WABA
                    </h2>

                    {/* Task Delegation App Title */}
                    <h1
                        className="font-spaceGrotesk font-extrabold text-white mt-2 text-center"
                        style={{
                            fontSize: "46px",
                            lineHeight: "58.7px",

                            height: "59px",
                        }}
                    >
                        Get Official WhatsApp API
                    </h1>

                    {/* Subtitle Text */}
                    <p
                        className="font-golosText text-white text-center mt-2"
                        style={{
                            fontSize: "17px",
                            lineHeight: "30px",
                            width: "1004px",
                        }}
                    >
                        Save 5 hours per day for each team member
                    </p>
                </div>
                <div>
                    <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 py-16">
                        {/* Left Side Image */}
                        <div className=" p-8 rounded-lg w-full md:w-1/3 flex items-center justify-center">
                            <img
                                // src="/path-to-image.png" // Replace with actual path
                                src="/mockups/whatsapp.png"
                                alt="Book Cover Placeholder"
                                className="w-full h-full scale-[200%]"
                            />
                        </div>

                        {/* Right Side Feature Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-2/3">
                            {[
                                {
                                    title: "Live Agent Support",
                                    description:
                                        "Seamlessly transition from automated responses to live agent support for personalized customer interaction, ensuring quick resolutions.",
                                },
                                {
                                    title: "Send Messages Without Getting Banned",
                                    description:
                                        "Use the official WhatsApp Business API to send bulk or individual messages securely and in compliance with WhatsApp’s policies.",
                                },
                                {
                                    title: "Multi-Agent Support",
                                    description:
                                        "Allow multiple agents to manage conversations simultaneously using one WhatsApp Business number.",
                                },
                                {
                                    title: "Real-Time Notifications",
                                    description:
                                        "Send instant alerts, updates, and confirmations directly to your customers via WhatsApp.",
                                },
                                {
                                    title: "Message Analytics",
                                    description:
                                        "Monitor message delivery, open rates, and customer responses with detailed analytics to optimize communication strategies.",
                                },
                                {
                                    title: "Quick Replies",
                                    description:
                                        "Use customizable quick reply options to respond faster and provide consistent customer support.",
                                },
                                {
                                    title: "24/7 Automated Chatbots",
                                    description:
                                        "Use AI-driven chatbots to provide 24/7 customer support, answer FAQs, and improve efficiency.",
                                },
                                {
                                    title: "Broadcast Messaging",
                                    description:
                                        "Send promotional or informational messages to a large audience without spamming or violating WhatsApp policies.",
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-[#0B0C24] p-6 rounded-lg border border-[#37384B] flex items-start space-x-4"
                                >
                                    {/* <span className="text-[#FC8929] text-2xl">✔️</span> */}
                                    <img
                                        src="/tick.png" // Replace with actual path
                                        alt="Tick Icon"
                                        className="flex-shrink-0"
                                        style={{
                                            width: "20.4px",
                                            height: "20.4px",
                                            marginTop: "5px", // Adjust as needed to move downward
                                            marginLeft: "5px", // Adjust as needed to move to the right
                                        }}
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            {feature.title}
                                        </h3>
                                        <p className="text-[#676B93] mt-2">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="container mx-auto flex flex-col items-center gap-6 ">
                    {/* Total Value Text */}
                    <p
                        className="text-center text-white font-golosText"
                        style={{
                            fontSize: "24px",
                            fontWeight: "400",
                            lineHeight: "28.8px",
                        }}
                    >
                        Total Value - <span style={{ fontWeight: "700" }}>₹35,000</span> per
                        employee
                    </p>

                    {/* Get Freedom Offer Button */}
                    <a href="#cards2">
                        <button
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white font-semibold transition-all"
                            style={{
                                width: "328px",
                                height: "56px",
                                background:
                                    "radial-gradient(51.84% 97.12% at 50% 100%, #A587FF 0%, #5E29FF 100%)",
                                borderBottom: "1px solid #A485FF",
                            }}
                        >
                            {/* Uncomment and replace with the actual icon path if needed */}
                            {/* <Image
    src="/path-to-phone-icon.png" // Replace with the actual path to the phone icon
    alt="Phone Icon"
    width={24}
    height={24}
  /> */}
                            Get New Year Offer Now
                        </button>
                    </a>
                </div>

            </div>
            {/* Run Your Business */}

            <div className="  bg-[#05071E]">

                <div className="z-10 flex items-center justify-center">
                    <div
                        className={cn(
                            "group mt-24 relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl  px-4 py-1.5 md:text-3xl font-medium   ",

                        )}
                    >
                        <span
                            className={cn(
                                `inline animate-  text-center md:text-3xl  font-bold bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929]  bg-clip-text text-transparent`
                            )}
                        >
                            Run your Business on Autopilot
                        </span>
                    </div>
                </div>


                <div className="flex justify-center">
                    <h1 className="text-center   bg-clip-text  font-extrabold  md:text-5xl mt-4   mx-4 md:max-w-[1000px]">
                        Business Workspace for MSMEs
                    </h1>
                </div>

                <div id="cards" className="flex justify-center ">
                    <p
                        className={`max-w-[1000px] text-center mx-4 text-balance md:mx-0 mt-4 md:text-lg leading-relaxed text-muted-foreground ${golos.className}`}
                    >
                        Single Application to Manage Entire Team&apos;s Tasks, Leads,
                        Leaves, and Attendance with WhatsApp Integration!
                    </p>
                </div>
                <div id="cards" className="flex gap-4 items-center mt-8  justify-center ">
                    <div>
                        <img src="/coffee.png" className="h-20" />
                    </div>
                    <div>
                        <h1 className="text-3xl mt-6">
                            <span className="bg-gradient-to-r font-bold from-[#815BF5] via-[#FC8929] to-[#FC8929]  bg-clip-text text-transparent ">₹ 170/month</span>  which is less than a cup of Coffee
                        </h1>
                    </div>
                </div>
            </div>


            {/* Pricing Cards */}
            <div className="mt-12 bg-[#05071E]  mx-4 flex flex-col items-center gap-8">
                <div className="grid grid-cols-3 w-full max-w-7xl   justify-center gap-12 relative">
                    {/* Left Card */}
                    <div className="bg-[#0A0D28] mt-8 border rounded-[50px_50px_50px_50px] w-full   p-6 text-white relative z-10 shadow-lg">
                        <div className="absolute -top-0 right-0 w-32 bg-gradient-to-r from-[#815BF5] to-[#FC8929] px-4 py-1 rounded-[0_50px_0_20px] text-sm font-thin text-white">
                            Get Flat 50% OFF
                        </div>

                        <h2
                            className="font-golosText text-lg mt-4"

                        >
                            Zapllo Tasks
                        </h2>
                        <p className="text- mt-2 line-through text-[#F13535]" style={{ fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>
                            ₹4000
                        </p>

                        <div className="flex items-end mt-4">
                            <p
                                className="text-5xl font-semibold"
                            >
                                ₹1999
                            </p>
                            <span
                                className="ml-2 text-lg"
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "400",
                                    lineHeight: "24px",
                                    color: "#676B93",
                                }}
                            >
                                / per user per year
                            </span>
                        </div>

                        <p
                            className="mt-2"
                            style={{
                                fontSize: "16px",
                                fontWeight: "400",
                                lineHeight: "24px",
                            }}
                        >
                            Save 4 hours per day for each employee
                        </p>
                        <div
                            className="mt-4"
                            style={{
                                borderTop: "1px solid #424882",
                                width: "100%",
                            }}
                        ></div>

                        <ul className="mt-4 space-y-3">
                            {[
                                "Zapllo Tasks - Task Delegation App",
                                "Zapllo Intranet",
                                "Zapllo AI - Proprietory AI Technology"


                            ].map((item, index) => (
                                <li key={index} className="flex gap-2 items-center">
                                    <img src="/icons/tick.png" />
                                    <span
                                        className="text-sm font-medium"
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                            {[
                                "Zapllo WABA - Official WhatsApp API & Marketing Software",
                                "Zapllo Payroll - Attendance Tracking App",
                                "Zapllo Payroll - Leave Management App",

                            ].map((item, index) => (
                                <li key={index} className="flex gap-2 items-center">
                                    <img src='/icons/crosss.png' />
                                    <span
                                        className="text-sm font-medium"
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div
                            className="mt-4"
                            style={{
                                borderTop: "1px solid #424882",
                                width: "100%",
                            }}
                        ></div>
                        {/* Original Price */}
                        <p className="text-center text-sm mt-2 line-through text-[#F13535]" style={{}}>
                            ₹4000 per user per year
                        </p>
                        <p className="text-center mt-2   text-green-400" style={{ fontSize: "15px", fontWeight: "400", lineHeight: "24px" }}>
                            Today&apos;s Offer - ₹1999 per user per year
                        </p>
                        <button onClick={() => openCheckoutWithPlan('Zapllo Tasks')} className="mt-6 hover:shadow hover:shadow-white w-full py-2 border-2 border-primary rounded-full font-semibold   transition-colors">
                            Get Task Delegation App
                        </button>
                    </div>
                    {/* Middle Card */}
                    <div className="p-[2px]  bg-gradient-to-r from-[#815BF5] to-[#FC8929] rounded-[50px]">
                        <div
                            className="bg-white mb-8 rounded-[50px] h-full  w-full p-8 text-[#05071E] relative z-20 shadow-lg"
                        >
                            {/* Discount Tag */}
                            <div className="absolute  -top-0 right-0 bg-gradient-to-r from-[#815BF5] to-[#FC8929] px-4 py-1 w-32 rounded-[0_50px_0_20px] text-sm  font-thin text-white">
                                Get Flat 50% OFF
                            </div>

                            {/* Title */}
                            <h2 className="font-golosText text-lg mt-4">
                                Zapllo Money Saver Bundle
                            </h2>
                            <p className="text- mt-2 line-through text-[#F13535]" style={{ fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>
                                ₹6000
                            </p>
                            {/* Price */}
                            <div className="flex items-end mt-4">
                                <p className="text-5xl font-bold">₹2999</p>
                                <span className="ml-2 text-lg text-[#676B93]" style={{ fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>
                                    / per user per year
                                </span>
                            </div>

                            {/* Description */}
                            <p className="mt-2 text-[#05071E]" style={{ fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>
                                10X Your Team&apos;s Productivity
                            </p>

                            {/* Divider Line */}
                            <div className="mt-4 border-t border-[#424882]"></div>

                            {/* Feature List */}
                            <ul className="mt-4 space-y-3">
                                {[
                                    "Zapllo Tasks - Task Delegation App",
                                    "Zapllo Payroll - Attendance Tracking App",
                                    "Zapllo Payroll - Leave Management App",
                                    "Zapllo Intranet",
                                    "Zapllo AI - Proprietory AI Technology",
                                    "Zapllo WABA - Official WhatsApp API & Marketing Software",


                                ].map((item, index) => (
                                    <li key={index} className="flex gap-2 items-center">
                                        <img src="/icons/tick.png" />
                                        <span className="text-sm font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Divider Line */}
                            <div className="mt-4 border-t border-[#424882]"></div>

                            {/* Original Price */}
                            <p className="text-center text-sm mt-2 line-through text-[#F13535]" style={{}}>
                                ₹12000 per user per year
                            </p>
                            <p className="text-center text-sm mt-2 line-through text-[#F13535]" style={{}}>
                                Today&apos;s Offer - ₹5999 per user per year
                            </p>
                            <p className="text-center mt-2   text-green-600" style={{ fontSize: "15px", fontWeight: "400", lineHeight: "24px" }}>
                                Zapllo New Year Offer - ₹2999 per user per year
                            </p>


                            {/* CTA Button */}
                            <button
                                className="mt-8 w-full py-3 hover:shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] rounded-full font-semibold text-white"
                                onClick={() => openCheckoutWithPlan('Zapllo Money Saver Bundle')}
                                style={{
                                    background: "radial-gradient(51.84% 97.12% at 50% 100%, #A587FF 0%, #5E29FF 100%)",
                                    borderTop: "1px solid #A485FF",
                                }}
                            >
                                Get Money Saver Bundle
                            </button>
                        </div>
                    </div>

                    {/* Right Card */}
                    <div className="bg-[#0A0D28] border rounded-[50px_50px_50px_50px] w-full mt-8  p-6 text-white relative z-10 shadow-lg">
                        <div className="absolute -top-0 right-0 w-32 bg-gradient-to-r from-[#815BF5] to-[#FC8929] px-4 py-1 rounded-[0_50px_0_20px] text-sm font-thin text-white">
                            Get Flat 50% OFF
                        </div>
                        {/* <h2 className="text-2xl font-bold mt-4">Zapllo Payroll</h2> */}

                        <h2
                            className=" text-lg mt-4"

                        >
                            Zapllo Double Dhamaka
                        </h2>
                        <p className="text- mt-2 line-through text-[#F13535]" style={{ fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>
                            ₹2000
                        </p>
                        <div className="flex items-end mt-4">
                            <p
                                className="text-5xl font-semibold"

                            >
                                ₹999
                            </p>
                            <span
                                className="ml-2 text-lg"
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "400",
                                    lineHeight: "24px",
                                    color: "#676B93",
                                }}
                            >
                                / per user per year
                            </span>
                        </div>

                        <p
                            className="mt-2"
                            style={{
                                fontSize: "16px",
                                fontWeight: "400",
                                lineHeight: "24px",
                            }}
                        >
                            Leave & Attendance + Intranet
                        </p>

                        <div
                            className="mt-4"
                            style={{
                                borderTop: "1px solid #424882",
                                width: "100%",
                            }}
                        ></div>

                        <ul className="mt-4 space-y-3">
                            {[
                                "Zapllo Payroll - Attendance Tracking App",
                                "Zapllo Payroll - Leave Management App",
                                "Zapllo Intranet",
                                "Zapllo AI - Proprietory AI Technology",
                            ].map((item, index) => (
                                <li key={index} className="flex gap-2 items-center">
                                    <img src="/icons/tick.png" />
                                    <span
                                        className="text-sm font-medium"
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                            {[
                                "Zapllo Tasks - Task Delegation App",
                                "Zapllo WABA - Official WhatsApp API & Marketing Software",
                            ].map((item, index) => (
                                <li key={index} className="flex gap-2 items-center">
                                    <img src="/icons/crosss.png" />
                                    <span
                                        className="text-sm font-medium"
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div
                            className="mt-4"
                            style={{
                                borderTop: "1px solid #424882",
                                width: "100%",
                            }}
                        ></div>

                        <p
                            className="text-center mt-2 line-through"
                            style={{
                                fontSize: "16px",
                                fontWeight: "400",
                                lineHeight: "24px",
                                color: "#F13535",
                            }}
                        >
                            ₹2000 per user per year
                        </p>
                        <p className="text-center mt-2   text-green-400" style={{ fontSize: "15px", fontWeight: "400", lineHeight: "24px" }}>
                            Today&apos;s Offer - ₹999 per user per year
                        </p>

                        <button onClick={() => openCheckoutWithPlan('Zapllo Payroll')} className="mt-6 hover:shadow hover:shadow-white w-full py-2 border-2 border-primary rounded-full font-semibold transition-colors">
                            Get Payroll App
                        </button>
                    </div>
                </div>
            </div>



            <div className="flex bg-[#04061E]  mt-56 justify-center">
                <Footer />
            </div>
        </main >
        // </LoaderLayout>
    );
}
