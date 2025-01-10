"use client"

import * as React from "react"
import { FloatingNavbar } from '@/components/globals/navbar'
import { Calendar } from "@/components/ui/calendar"
import { InlineWidget } from "react-calendly"
import Buttonswow from "@/components/globals/buttonswow"
import { TestimonialCards } from "@/components/globals/testimonialscards"
import GradientText from "@/components/magicui/gradient"
import Footer from "@/components/globals/Footer"

export default function BookDemo() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
        <>
            <div className='flex justify-center max-w-screen overflow-hidden bg-[#05071E] w-full  w- h-full'>
                <main className="bg-[#05071E]   w-full h-full z-10 overflow-hidden">
                    <FloatingNavbar />

                    {/* <Image src='/mask.png' height={600} className=" absolute overflow-hidden -mt-[30%]   w-full 0" width={600} alt="Background mask for zapllo automation" /> */}
                    <div className=' w-full  flex justify-center'>
                        <div className='mt-28 '>
                            <div className=''>
                                <div className='bg-gradient-to-r mx-4  from-[#815BF5] via-[#FC8929] w- px-4 py-1 to-[#FC8929] text-3xl bg-clip-text font-bold text-transparent text-center'>
                                    <h1>Book Your Personalized Demo</h1>
                                    <p className='text-[#676b93] text-sm font-medium mt-2 text-balance'>Book a demo and watch Zapllo.com transform your business with the most advanced automations</p>
                                </div>
                                {/* <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="rounded-md border w-full shadow"
                                    /> */}
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-evenly mt-6 mb-6 gap-4">
                        {/* <div className=" ">
                            <Buttonswow />

                        </div> */}
                        <div className="w-1/2  bg-[#E2E8F0] rounded-2xl scrollbar-hide">
                            <InlineWidget
                                url="https://calendly.com/shubhodeep-ssxk/30?back=1&month=2024-06"
                                styles={{
                                    height: '900px',
                                    width: '100%',
                                    borderRadius: '2.5rem',
                                    border: '12px solid #e2e8f0',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                }}
                            />
                        </div>
                    </div>
                    <GradientText>
                        <div className='bg-gradient-to-r mx-4 mt-8  from-[#815BF5] via-[#FC8929] w- px-4 py-1 to-[#FC8929] text-3xl bg-clip-text font-bold text-transparent text-center'>
                            <h1>What our Customers Say </h1>
                            <h1 className="text-white text-sm mt-2 font-medium"> Our testimonials speak volumes</h1>
                            {/* <p className="text-white text-sm">Testimonials</p> */}
                        </div>
                    </GradientText>
                    <TestimonialCards />
                </main>
            </div>
            <div className="mt-12">
                <Footer />
            </div>
        </>
    )
}
