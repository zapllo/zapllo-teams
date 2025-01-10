import Footer from '@/components/globals/Footer';
import { FloatingNavbar } from '@/components/globals/navbar';
import Link from 'next/link';
import React from 'react';

type Props = {};

export default function PressRelease({ }: Props) {
    return (
        <>
            <div className="flex justify-center overflow-hidden bg-[#05071E] w-full h-full">
                <main className="bg-[#05071E] max-w-6xl h-full z-10 overflow-hidden">
                    <FloatingNavbar />

                    <h1 className="text-center font-bold mt-32 text-4xl text-white">Press Release</h1>

                    {/* Press Release Links */}
                    <div className="mt-12 space-y-8 grid grid-cols-1 gap-4 ">
                        <Link href="https://www.aninews.in/news/business/zapllo-technologies-launches-task-delegation-app20240813125646/#:~:text=At%20Zapllo%20we%20believe%20on,the%20company's%20Founder%2C%20Shubhodeep%20Banerjee"
                        >
                            <div className="text-white cursor-pointer bg-[#0A0D28] border scale-90 rounded-xl">
                                <img src='/press.jpg' className='w-full h-auto object-cover rounded-b-none rounded-xl' />
                                <div className='p-4'>
                                    <h1

                                        className="text-3xl mt-4 font-semibold  "
                                    >
                                        Zapllo Technologies launches Task Delegation App
                                    </h1>
                                    <p className='text-[#676B93] text-xl mt-4'>
                                        Zapllo Technologies Private Limited, an automation solutions company, is thrilled to announce the launch of its Task Delegation app, providing business automation solutions for businesses on a budget.
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <Link href="https://startupnews.fyi/2024/08/13/zapllo-technologies-launches-task-delegation-app/"
                        >
                            <div className="text-white cursor-pointer bg-[#0A0D28] border scale-90 rounded-xl">
                                <img src='/press2.jpg' className='w-full h-auto object-cover rounded-b-none rounded-xl' />
                                <div className='p-4'>
                                    <h1
                                        className="text-3xl mt-4 font-semibold  "
                                    >
                                      How AI & Automation is going to leverage Indian MSMEs ? (Startup India)
                                    </h1>
                                    <p className='text-[#676B93] text-xl mt-4'>
                                        &quot;We want to save time and even reduce manual effort of MSME’s through our app that utilizes Whatsapp, Gmail and custom automations also MSMEs play a vital role in driving economic growth and innovation, and their adaptation to automation is crucial for their growth and success in the era of Industry 4.0&quot; adds the Co-Founder.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </main>
            </div>

            <div className="pt-12 bg-[#05071E]">
                <Footer />
            </div>
        </>
    );
}
