'use client';

import Footer from "@/components/globals/Footer";
import { FloatingNavbar } from "@/components/globals/navbar";
import MultiStepForm from "@/components/forms/checkoutForm";
import { useSearchParams } from 'next/navigation';
import TaskDelegationCard from "@/components/cards/checkoutCards";
import Testimonials2 from "@/components/globals/testimonials2";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Golos_Text } from "next/font/google";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
const golos = Golos_Text({ subsets: ["latin"] });


type PlanKeys = 'Zapllo Tasks' | 'Zapllo Money Saver Bundle';


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



export default function SpecialOfferCheckout() {
    const searchParams = useSearchParams();
    const selectedPlan = searchParams.get('selectedPlan') || 'Zapllo Money Saver Bundle';
    const [timeLeft, setTimeLeft] = useState(45 * 60); // 15 minutes in seconds
    // Countdown timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime: any) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        // Clear interval on component unmount
        return () => clearInterval(timer);
    }, []);


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



    // Format the time as MM:SS
    const formatTime = (time: any) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <main className="bg-[#05071E] w-full  mx-auto h-full overflow-hidden">
            <FloatingNavbar />
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
                <div className="absolute 2xl:right-36 mt-4 right-16 ">
                    <img src="/icons/offer.png" />
                    <h1 className="text-white text-xl -mt-28 ml-20 ">Use Code</h1>
                    <span className="font-bold text-white text-3xl -mt-28 ml-14">&quot;NY2025&quot;</span>
                    {/* <Clock className="h-4" /> */}
                    <h1 className="text-white text-2xl  ml-[90px] ">
                        {formatTime(timeLeft)}
                    </h1>

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
                            Run your Business on Autopilot <span className="text-white">🚀</span>
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
                        className={`max-w-[1000px] text-center mx-4 text-balance md:mx-0 mt-4 md:text-lg leading-relaxed text-[#676B93] ${golos.className}`}
                    >
                        Single Application to Manage Entire Team&apos;s Tasks, Leads,
                        Leaves, and Attendance with WhatsApp Integration!
                    </p>
                </div>
            </div>
            <div className="w-full mt-12 flex justify-center ">
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
            <div className="container mx-auto mt-12 py-16">
                <MultiStepForm selectedPlan={selectedPlan as PlanKeys} />
            </div>
            <div className="flex justify-center mb-24 w-full">
                <div className="grid grid-cols-3 mx-12 gap-8">
                    <TaskDelegationCard
                        title="Zapllo Tasks"
                        features={[
                            "Delegate Unlimited Tasks",
                            "Team Performance Report",
                            "Links Management for your Team",
                            "Email Notifications",
                            "WhatsApp Notifications",
                            "Automatic WhatsApp Reminders",
                            "Automatic Email Reminders",
                            "Repeated Tasks",
                            "Zapllo AI -Proprietory AI Technology",
                            "File Uploads",
                            "Delegate Tasks with Voice Notes",
                            "Task Wise Reminders",
                            "Daily Task & Team Reports",
                            "Save more than 4 hours per day",
                        ]}
                    />
                    <TaskDelegationCard
                        title="Zapllo Payroll"
                        features={[
                            "Easy Attendance Marking using Geo location & Face recognition feature",
                            "Easy Leave application",
                            "Attendance & Leave Tracking",
                            "Reports / Dashboards",
                            "WhatsApp & Email Notifications",
                            "Automatic WhatsApp Reminders",
                            "Automatic Email Reminders",
                            "Zapllo AI -Proprietory AI Technology",
                            "Approval Process",
                            "Regularization Process (Apply for past date attendance)",
                            "Multiple login & Logouts",
                            "Customer Leave Types",
                        ]}
                    />
                    <TaskDelegationCard
                        title="WhatsApp Marketing & Automation Software"
                        features={[
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
                        ]}
                    />
                </div>
            </div>
            <Testimonials2 />
            <Footer />
        </main>
    );
}
