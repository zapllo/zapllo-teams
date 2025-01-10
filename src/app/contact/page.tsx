import Footer from '@/components/globals/Footer'
import ContactForm from '@/components/globals/contactform'
import { FloatingNavbar } from '@/components/globals/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LetsTalk } from '@/components/ui/letstalk'
import { SendMessage } from '@/components/ui/sendMessage'
import { Textarea } from '@/components/ui/textarea'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { Icon3dCubeSphereOff } from '@tabler/icons-react'
import { LocateIcon, Map, MapPin } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

export default function Contact() {

    return (
        <>

            <div className='flex justify-center overflow-hidden bg-[#05071E]  w-full h-full'>
                <main className="bg-[#05071E] max-w-6xl   h-full z-10 overflow-hidden">
                    <FloatingNavbar />

                    {/* <Image src='/mask.png' height={600} className=" absolute overflow-hidden -mt-[30%]   w-full 0" width={600} alt="Background mask for zapllo automation" /> */}
                    <div className=' w-full  flex justify-center'>
                        <div className='grid grid-cols-1   mt-32 md:grid-cols-2 '>
                            <div className=''>
                                <div className='bg-gradient-to-r mx-4  from-[#815BF5] via-[#FC8929] w-fit px-4 py-1 to-[#FC8929] rounded-2xl'>
                                    <h1>Let&apos;s Talk</h1>
                                </div>
                                <h1 className='md:text-4xl text-2xl mt-4 font-semibold mx-4'>We are Open To Talk To Good People</h1>
                                <p className='text-[#676B93] mx-4  mt-4'>Ready to transform your business operations and optimize your workflows with Zapllo’s cutting-edge automation solutions?
                                </p>
                                <p className='text-[#676B93] mx-4  mt-4'>Our team is on standby to guide you through the process of automation, digital strategy, and custom solutions that place you among the top 1% of efficient and innovative businesses.</p>
                                <div className='grid grid-cols-1 gap-y-4 mt-8'>
                                    <div className='flex '>
                                        <div className='bg-gradient-to-r mx-4  from-[#815BF5] via-[#FC8929] to-[#FC8929] p-2 h-fit w-fit rounded-full '> <Map /></div>
                                        <h1 className='text-sm md:text-lg text-[#676B93]  md:mt-1 md:mx-0 mx-4'>Automate your workflows and enhance your operational efficiency.</h1>
                                    </div>
                                    <div className='flex '>
                                        <div className='bg-gradient-to-r mx-4  from-[#815BF5] via-[#FC8929] to-[#FC8929] p-2 h-fit w-fit rounded-full '><MapPin /></div>
                                        <h1 className='text-sm md:text-lg text-[#676B93]  md:mt-1 md:mx-0 mx-4'>Gain valuable insights and connections that surpass traditional solutions.
                                        </h1>
                                    </div>
                                    <div className='flex '>
                                        <div className='bg-gradient-to-r mx-4  from-[#815BF5] via-[#FC8929] to-[#FC8929] p-2 h-fit w-fit rounded-full '><Icon3dCubeSphereOff /> </div>
                                        <h1 className='text-sm md:text-lg text-[#676B93]  md:mt-1 md:mx-0 mx-4'>Transform your business processes into profitable opportunities with Zapllo.</h1>
                                    </div>
                                </div>
                            </div>
                            <div className='p-5 mt-12 md:mt-0'>
                                <h1 className='bg-gradient-to-r mx-4  from-[#815BF5] via-[#FC8929] w-fit px-4 py-1 to-[#FC8929] text-transparent bg-clip-text text-3xl  font-semibold'>Get Priority Support</h1>
                                <ContactForm />
                            </div>
                        </div>

                    </div>

                </main>

            </div>
            <div className="flex bg-[#04061E]  pt-12 justify-center">
                <Footer />
            </div>
        </>
    )
}
