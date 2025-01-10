import Footer from '@/components/globals/Footer'
import { FloatingNavbar } from '@/components/globals/navbar'
import { SuccessGrid } from '@/components/globals/successstories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LetsTalk } from '@/components/ui/letstalk'
import { Textarea } from '@/components/ui/textarea'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { Globe, LocateIcon, Map, MapPin } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import TextShimmer from "@/components/magicui/animated-shiny-text";
import { cn } from '@/lib/utils'
import { VisitWebsite } from '@/components/ui/visitwebsite'
import { AnimatedFeatures } from '@/components/globals/features-animated'
import { AnimatedFeatures2 } from '@/components/globals/features-animated2'
import { AnimatedFeatures3 } from '@/components/globals/features-animated3'
import { AnimatedFeatures4 } from '@/components/globals/features-animated4'
import GradientText from '@/components/magicui/gradient'

export default function SuccessStories() {
    return (
        <main className=" bg-[#05071E] mx-auto  h-full z-10 overflow-hidden">
            <FloatingNavbar />
            <Image src='/mask.png' height={1000} className=" absolute overflow-hidden -mt-56  z-10  w-full 0" width={1000} alt="Background mask for zapllo automation" />
            <div className='flex justify-center ] w-full'>
                <div className=' w-full  lg:justify-center md:mx-4 mt-32'>
                    <GradientText>
                        <h1 className='md:text-center text-start   bg-clip-text text-transparent font-semibold text-3xl lg:text-3xl   md:mx-0 bg-gradient-to-r mx-6  from-[#815BF5] via-[#FC8929]  to-[#FC8929]'> Success Stories</h1>
                    </GradientText>
                    <h1 className='md:text-center text-start mx-6 md:mx-0 mt-4 md:text-4xl text-4xl font-medium'>Real Success Stories with<span className='bg-gradient-to-r mx-4  from-[#815BF5] via-[#FC8929]  to-[#FC8929] bg-clip-text text-transparent'>
                        Zapllo </span> </h1>
                    <div className=' flex justify-center'>
                        <p className='mt-4 text-[#676B93] max-w-5xl text-sm mx-6 md:mx-0  text-start md:text-center'>From industry leaders to innovative entrepreneurs, our clients have unlocked exponential growth with Zapllo’s bespoke workflows, automation solutions, and advanced Business systems. No matter your field, our expert engineers craft tools that not only save you thousands of dollars but also reclaim the precious time lost to manual tasks or unnecessary staffing. Elevate your business efficiency today with Zapllo!</p>
                    </div>
                </div>
            </div>
            <div className='p-8 flex justify-center'>
                <div className='md:grid md:grid-cols-2 gap-4  text-center  md:max-w-5xl md:mx-4'>
                    <div className='bg-[#0A0D28] w-screen md:w-full   p-8    md:p-8 rounded-2xl'>
                        <img src='/clients/b.png' className='w-full h-auto' />
                        <div className='flex justify-center mt-4'>
                            <img src='star.png' className='h-5' />
                        </div>
                        <h1 className='font-bold mt-4'>Bill Bachand</h1>
                        <h2>Founder & CEO RENU Therapy</h2>
                        <p className='text-start text-[18px] md:text-xs  mt-4 text-[#676B93]'>I found Shubhodeep when we were struggling to streamline and simplify our order processing on Shopify. I am amazed how he delivered and also increased our conversion rates building amazing Shopify Automation. Grateful to Zapllo !</p>
                        <div className='mt-4 md:flex md:justify-between'>
                            <div className=''>
                                <h1 className='md:text-sm text-md  text-start '>Automation Achieved</h1>
                                <h1 className=' bg-gradient-to-r mt-2  md:mx-0 from-[#815BF5] via-[#FC8929]  to-[#FC8929] bg-clip-text text-transparent font-semibold text-5xl text-start'>75%</h1>
                            </div>
                            <div className=''>
                                <h1 className='text-sm text-start'>⬇ Operational Cost</h1>
                                <h1 className=' bg-gradient-to-r  md:mx-0 from-[#815BF5] via-[#FC8929]  to-[#FC8929] bg-clip-text text-start text-transparent mt-2 font-semibold text-5xl'>62%</h1>
                            </div>
                        </div>
                        <VisitWebsite />
                    </div>
                    <div> {/***2nd div */}
                        <div className='grid grid-cols-1 gap-4'>
                            <div className='bg-[#0A0D28] h-[500px]  p-4 md:p-8 rounded-2xl'>
                                {/* <img src='emptyrec.png' className='opacity-0' /> */}

                                <AnimatedFeatures />

                                {/* <img src='bald.png' className='w-full opacity-0' /> */}

                            </div>
                            <div className='bg-[#0A0D28] p-8 md:p-8 rounded-xl'>
                                <h1 className='text-md text-start'>Learn About</h1>
                                <h1 className='text-2xl text-start  font-semibold'>Founder RENU Therapy</h1>
                                <p className='text-start md:text-sm  mt-4 text-[#676B93]'>I found Shubhodeep when we were struggling to streamline and simplify our order processing on Shopify. </p>
                                <div className='mt-6 md:flex gap-2  md:gap-6 '>
                                    <h1 className=' bg-gradient-to-r  from-[#815BF5] via-[#FC8929]  to-[#FC8929] -text text-white w-fit  rounded-2xl font-semibold text-sm px-4 md:px-4 py-1'>Entrepreneurial Wisdom</h1>
                                    <h1 className=' bg-gradient-to-r w-fit md:mt-0 mt-4 from-[#815BF5] via-[#FC8929]  to-[#FC8929] -text text-white rounded-2xl font-semibold text-sm px-4 py-1'>10x Growth</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='p-8 flex justify-center'>
                <div className='md:grid md:grid-cols-2 gap-4 md:max-w-5xl  text-center mx-4'>
                    <div> {/***2nd div */}
                        <div className='grid grid-cols-1 gap-4'>
                            <div className='bg-[#0A0D28] h-[500px]  p-4 md:p-8 rounded-2xl'>
                                {/* <img src='emptyrec.png' className='opacity-0' /> */}
                         
                                    <AnimatedFeatures2 />
                             

                                {/* <img src='bald.png' className='w-full opacity-0' /> */}

                            </div>
                            <div className='bg-[#0A0D28] p-8 md:p-8 rounded-xl'>
                                <h1 className='text-md text-start'>Learn About</h1>
                                <h1 className='text-2xl text-start  font-semibold'>The Spark of Dan Sullivan</h1>
                                <p className='text-start md:text-sm  mt-4 text-[#676B93]'>I found Shubhodeep when we were struggling to streamline and simplify our order processing on Shopify. </p>
                                <div className='mt-6 md:flex gap-2  md:gap-6 '>
                                    <h1 className=' bg-gradient-to-r  from-[#815BF5] via-[#FC8929]  to-[#FC8929] -text text-white w-fit  rounded-2xl font-semibold text-sm px-4 md:px-4 py-1'>Entrepreneurial Wisdom</h1>
                                    <h1 className=' bg-gradient-to-r w-fit md:mt-0 mt-4 from-[#815BF5] via-[#FC8929]  to-[#FC8929] -text text-white rounded-2xl font-semibold text-sm px-4 py-1'>10x Growth</h1>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='md:grid md:grid-cols-1 gap-4  text-center  md:max-w-5xl md:mx-4'>
                        <div className='bg-[#0A0D28] w-screen md:w-full   p-8    md:p-8 rounded-2xl'>
                            <img src='/clients/a.png' className='w-full' />
                            <div className='flex justify-center mt-4'>
                                <img src='star.png' className='h-5' />
                            </div>
                            <h1 className='font-bold mt-4'>Bill Bachand 2</h1>
                            <h2>Founder & CEO RENU Therapy</h2>
                            <p className='text-start text-[18px] md:text-xs  mt-4 text-[#676B93]'>I found Shubhodeep when we were struggling to streamline and simplify our order processing on Shopify. I am amazed how he delivered and also increased our conversion rates building amazing Shopify Automation. Grateful to Zapllo !</p>
                            <div className='mt-4 md:flex md:justify-between'>
                                <div className=''>
                                    <h1 className='md:text-sm text-md  text-start '>Weekly Open Rates</h1>
                                    <h1 className=' bg-gradient-to-r mt-2  md:mx-0 from-[#815BF5] via-[#FC8929]  to-[#FC8929] bg-clip-text text-transparent font-semibold text-5xl text-start'>91%</h1>
                                </div>
                                <div className=''>
                                    <h1 className='text-sm text-start'>Subscription Rate</h1>
                                    <h1 className=' bg-gradient-to-r  md:mx-0 from-[#815BF5] via-[#FC8929]  to-[#FC8929] bg-clip-text text-start text-transparent mt-2 font-semibold text-5xl'>62%</h1>
                                </div>
                            </div>
                            <VisitWebsite />
                        </div>
                        {/* <div> 
                            <div className='grid grid-cols-1 gap-4'>
                                <div className='bg-[#0A0D28] p-4 md:p-8 rounded-2xl'>
                                    <img src='emptyrec.png' className='opacity-0' />
                                    

                                </div>
                                <div className='bg-[#0A0D28] p-8 md:p-8 rounded-xl'>
                                    <h1 className='text-md text-start'>Learn About</h1>
                                    <h1 className='text-2xl text-start  font-semibold'>The Spark of Dan Sullivan</h1>
                                    <p className='text-start md:text-sm  mt-4 text-[#676B93]'>I found Shubhodeep when we were struggling to streamline and simplify our order processing on Shopify. </p>
                                    <div className='mt-6 md:flex gap-2  md:gap-6 '>
                                        <h1 className=' bg-gradient-to-r  from-[#815BF5] via-[#FC8929]  to-[#FC8929] -text text-white w-fit  rounded-2xl font-semibold text-sm px-4 md:px-4 py-1'>Entrepreneurial Wisdom</h1>
                                        <h1 className=' bg-gradient-to-r w-fit md:mt-0 mt-4 from-[#815BF5] via-[#FC8929]  to-[#FC8929] -text text-white rounded-2xl font-semibold text-sm px-4 py-1'>10x Growth</h1>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>


                </div>
            </div>
            <div className='p-8 flex justify-center'>
                <div className='md:grid md:grid-cols-2 gap-4  text-center  md:max-w-5xl md:mx-4'>
                    <div className='bg-[#0A0D28] w-screen md:w-full   p-8    md:p-8 rounded-2xl'>
                        <img src='/clients/c.png' className='w-full' />
                        <div className='flex justify-center mt-4'>
                            <img src='star.png' className='h-5' />
                        </div>
                        <h1 className='font-bold mt-4'>Bill Bachand 3</h1>
                        <h2>Founder & CEO RENU Therapy</h2>
                        <p className='text-start text-[18px] md:text-xs  mt-4 text-[#676B93]'>I found Shubhodeep when we were struggling to streamline and simplify our order processing on Shopify. I am amazed how he delivered and also increased our conversion rates building amazing Shopify Automation. Grateful to Zapllo !</p>
                        <div className='mt-4 md:flex md:justify-between'>
                            <div className=''>
                                <h1 className='md:text-sm text-md  text-start '>Weekly Open Rates</h1>
                                <h1 className=' bg-gradient-to-r mt-2  md:mx-0 from-[#815BF5] via-[#FC8929]  to-[#FC8929] bg-clip-text text-transparent font-semibold text-5xl text-start'>91%</h1>
                            </div>
                            <div className=''>
                                <h1 className='text-sm text-start'>Subscription Rate</h1>
                                <h1 className=' bg-gradient-to-r  md:mx-0 from-[#815BF5] via-[#FC8929]  to-[#FC8929] bg-clip-text text-start text-transparent mt-2 font-semibold text-5xl'>62%</h1>
                            </div>
                        </div>
                        <VisitWebsite />
                    </div>
                    <div> {/***2nd div */}
                        <div className='grid grid-cols-1 gap-4'>
                            <div className='bg-[#0A0D28] h-[500px] p-4 md:p-8 rounded-2xl'>
                                {/* <img src='emptyrec.png' className='opacity-0' /> */}
                                
                                    <AnimatedFeatures3 />
                               


                                {/* <img src='bald.png' className='w-full opacity-0' /> */}

                            </div>
                            <div className='bg-[#0A0D28] p-8 md:p-8 rounded-xl'>
                                <h1 className='text-md text-start'>Learn About</h1>
                                <h1 className='text-2xl text-start  font-semibold'>The Spark of Dan Sullivan</h1>
                                <p className='text-start md:text-sm  mt-4 text-[#676B93]'>I found Shubhodeep when we were struggling to streamline and simplify our order processing on Shopify. </p>
                                <div className='mt-6 md:flex gap-2  md:gap-6 '>
                                    <h1 className=' bg-gradient-to-r  from-[#815BF5] via-[#FC8929]  to-[#FC8929] -text text-white w-fit  rounded-2xl font-semibold text-sm px-4 md:px-4 py-1'>Entrepreneurial Wisdom</h1>
                                    <h1 className=' bg-gradient-to-r w-fit md:mt-0 mt-4 from-[#815BF5] via-[#FC8929]  to-[#FC8929] -text text-white rounded-2xl font-semibold text-sm px-4 py-1'>10x Growth</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='p-8 flex justify-center'>
                <div className='md:grid md:grid-cols-2 gap-4 md:max-w-5xl  text-center mx-4'>
                    <div> {/***2nd div */}
                        <div className='grid grid-cols-1 gap-4'>
                            <div className='bg-[#0A0D28] p-4 h-[500px] md:p-8 rounded-2xl'>
                                {/* <img src='emptyrec.png' className='opacity-0' /> */}
                                <div>
                                    <AnimatedFeatures4 />

                                </div>
                                {/* <img src='bald.png' className='w-full opacity-0' /> */}

                            </div>
                            <div className='bg-[#0A0D28] p-8 md:p-8 rounded-xl'>
                                <h1 className='text-md text-start'>Learn About</h1>
                                <h1 className='text-2xl text-start  font-semibold'>The Spark of Dan Sullivan</h1>
                                <p className='text-start md:text-sm  mt-4 text-[#676B93]'>I found Shubhodeep when we were struggling to streamline and simplify our order processing on Shopify. </p>
                                <div className='mt-6 md:flex gap-2  md:gap-6 '>
                                    <h1 className=' bg-gradient-to-r  from-[#815BF5] via-[#FC8929]  to-[#FC8929] -text text-white w-fit  rounded-2xl font-semibold text-sm px-4 md:px-4 py-1'>Entrepreneurial Wisdom</h1>
                                    <h1 className=' bg-gradient-to-r w-fit md:mt-0 mt-4 from-[#815BF5] via-[#FC8929]  to-[#FC8929] -text text-white rounded-2xl font-semibold text-sm px-4 py-1'>10x Growth</h1>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='md:grid md:grid-cols-1 gap-4  text-center  md:max-w-5xl md:mx-4'>
                        <div className='bg-[#0A0D28] w-screen md:w-full   p-8    md:p-8 rounded-2xl'>
                            <img src='bald.png' className='w-full' />
                            <div className='flex justify-center mt-4'>
                                <img src='star.png' className='h-5' />
                            </div>
                            <h1 className='font-bold mt-4'>Bill Bachand 2</h1>
                            <h2>Founder & CEO RENU Therapy</h2>
                            <p className='text-start text-[18px] md:text-xs  mt-4 text-[#676B93]'>I found Shubhodeep when we were struggling to streamline and simplify our order processing on Shopify. I am amazed how he delivered and also increased our conversion rates building amazing Shopify Automation. Grateful to Zapllo !</p>
                            <div className='mt-4 md:flex md:justify-between'>
                                <div className=''>
                                    <h1 className='md:text-sm text-md  text-start '>Weekly Open Rates</h1>
                                    <h1 className=' bg-gradient-to-r mt-2  md:mx-0 from-[#815BF5] via-[#FC8929]  to-[#FC8929] bg-clip-text text-transparent font-semibold text-5xl text-start'>91%</h1>
                                </div>
                                <div className=''>
                                    <h1 className='text-sm text-start'>Subscription Rate</h1>
                                    <h1 className=' bg-gradient-to-r  md:mx-0 from-[#815BF5] via-[#FC8929]  to-[#FC8929] bg-clip-text text-start text-transparent mt-2 font-semibold text-5xl'>62%</h1>
                                </div>
                            </div>
                            <VisitWebsite />
                        </div>
                        {/* <div> 
                            <div className='grid grid-cols-1 gap-4'>
                                <div className='bg-[#0A0D28] p-4 md:p-8 rounded-2xl'>
                                    <img src='emptyrec.png' className='opacity-0' />
                                    

                                </div>
                                <div className='bg-[#0A0D28] p-8 md:p-8 rounded-xl'>
                                    <h1 className='text-md text-start'>Learn About</h1>
                                    <h1 className='text-2xl text-start  font-semibold'>The Spark of Dan Sullivan</h1>
                                    <p className='text-start md:text-sm  mt-4 text-[#676B93]'>I found Shubhodeep when we were struggling to streamline and simplify our order processing on Shopify. </p>
                                    <div className='mt-6 md:flex gap-2  md:gap-6 '>
                                        <h1 className=' bg-gradient-to-r  from-[#815BF5] via-[#FC8929]  to-[#FC8929] -text text-white w-fit  rounded-2xl font-semibold text-sm px-4 md:px-4 py-1'>Entrepreneurial Wisdom</h1>
                                        <h1 className=' bg-gradient-to-r w-fit md:mt-0 mt-4 from-[#815BF5] via-[#FC8929]  to-[#FC8929] -text text-white rounded-2xl font-semibold text-sm px-4 py-1'>10x Growth</h1>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>


                </div>
            </div>
            {/* <SuccessGrid /> */}
            <div className="flex bg-[#04061E]  mt-12 justify-center">
                <Footer />
            </div>
        </main>
    )
}
