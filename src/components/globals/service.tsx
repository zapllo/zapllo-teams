"use client"

import React from 'react';
import { motion } from 'framer-motion';
import IconCloud from '../magicui/icon-cloud';
import { Eye } from 'lucide-react';
import { FloatingWhatsApp } from 'react-floating-whatsapp'
import GradientText from '../magicui/gradient';
import SignalIcon from '../ui/signal';


const cardVariants = (direction: string, delay: any) => ({
    hidden: { opacity: 0, x: direction === 'left' ? -200 : 200 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            delay
        }
    },
});

const slugs = [
    "whatsapp",
    "javascript",
    "notion",
    "discord",
    "slack",
    "googledrive",
    "android",
    "html5",
    "css3",
    "nodedotjs",
    "express",
    "nextdotjs",
    "prisma",
    "amazonaws",
    "postgresql",
    "firebase",
    "nginx",
    "vercel",
    "testinglibrary",
    "jest",
    "cypress",
    "docker",
    "git",
    "jira",
    "github",
    "gitlab",
    "visualstudiocode",
    "androidstudio",
    "sonarqube",
    "figma",
];


export default function Service() {
    const imgSrc1 = 'ND.svg';
    const imgSrc2 = 'gear.svg';
    const imgSrc3 = 'integrate.svg';
    const imgSrc4 = 'bot.svg';
    const imgSrc5 = 'team.svg';
    const imgSrc6 = 'biz.svg';

    return (
        <div className='text-center pt-12 bg-[#05071E] justify-center min-h-screen'>
            <FloatingWhatsApp phoneNumber="+918910748670" accountName="Ranit" avatar='/Satish.png' darkMode />
            <GradientText>
                <h1 className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent font-bold text-3xl'>Services</h1>
            </GradientText>
            <h1 className='text-4xl mt-2 font-bold text-white'>Services we Provide</h1>
            <div className="flex flex-col md:flex-row justify-center mt-8">
                <div className='flex flex-col'>
                    <motion.div
                        className=" bg-[#0A0D28]  m-4"
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants('left', 0.2)}
                    >
                        <div>
                            <img src='/card/dashboard.png' className='w-full h-40 rounded-lg  object-cover rounded-b-none' />

                            <div className=' flex -mt-10  ml-[80%]'>
                                <div className='flex justify-center'>
                                    <SignalIcon imgSrc={imgSrc1} />


                                </div>
                            </div>
                        </div>
                        <div className='p-8 rounded-lg shadow-lg'>
                            <h2 className="text-xl text-start font-bold">Interactive Notion Dashboards</h2>
                            <p className="mt-2 w-[300px] text-start  md:w-[400px]">At Zapllo, we specialize in crafting powerful Notion dashboards tailored to your unique business needs. Our innovative solutions help you manage everything in one place, so you can focus on what matters most. Experience seamless management with dashboards designed for efficiency. Our expert consultation ensures your business runs smoothly, even when you&apos;re not at the helm.

</p>
                        </div>
                    </motion.div>
                    <motion.div
                        className=" bg-[#0A0D28] mt-32 m-4"
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants('left', 1.2)}
                    >
                        <div>
                            <img src='/card/custom.jpg' className='w-full h-40 rounded-lg  object-cover rounded-b-none' />
                            <div className=' flex -mt-10  ml-[80%]'>
                                <div className='flex justify-center'>
                                    <SignalIcon imgSrc={imgSrc2} />



                                </div>
                            </div>
                        </div>
                        <div className='p-8 rounded-lg shadow-lg'>
                            <h2 className="text-2xl text-start font-bold">Done for you Custom Automations</h2>
                            <p className="mt-2 w-[300px] text-start  md:w-[400px]">We specialize in creating tailored automation solutions that cater to the unique needs of your business. Whether it&apos;s simplifying daily operations or integrating complex systems, our Done-For-You Custom Automations are designed to save you time and increase efficiency. Every business is different. We develop custom automations that perfectly fit your specific requirements. Leave the heavy lifting to us. Our experts handle everything from design to deployment, ensuring a seamless experience.</p>
                        </div>
                    </motion.div>
                    <motion.div
                        className=" bg-[#0A0D28] mt-32 m-4"
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants('left', 2.2)}
                    >
                        <div>
                            <img src='/card/automation.jpg' className='w-full h-40 rounded-lg  object-cover rounded-b-none' />
                            <div className=' flex -mt-10  ml-[80%]'>
                                <div className='flex justify-center'>
                                    <SignalIcon imgSrc={imgSrc3} />


                                </div>
                            </div>
                        </div>
                        <div className='p-8 rounded-lg shadow-lg'>
                            <h2 className="text-2xl text-start font-bold">Cross Platform Integrations</h2>
                            <p className="mt-2 w-[300px] text-start  md:w-[400px]">We make your business operations smoother and more efficient with our Cross Platform Integrations. We specialize in connecting multiple applications like HubSpot, Salesforce, Gmail, Typeform, WhatsApp, Slack, Microsoft Teams, Google Calendar, and more, ensuring a seamless and integrated experience. Integrate all your essential tools and applications for a unified workflow. Streamline processes and improve productivity by connecting your favorite apps.</p>
                        </div>
                    </motion.div>
                </div>
                {/* <div className='flex items-center justify-center m-4'>
                    <IconCloud iconSlugs={slugs}  />
                </div> */}
                <div className='flex flex-col'>
                    <motion.div
                        className=" bg-[#0A0D28] mt-32 m-4"
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants('right', 0.6)}
                    >
                        <div>
                            <img src='/card/genai5.png' className='w-full h-40 rounded-lg  object-cover rounded-b-none' />
                            <div className=' flex -mt-10  ml-[80%]'>
                                <div className='flex justify-center'>
                                    <SignalIcon imgSrc={imgSrc4} />


                                </div>
                            </div>
                        </div>
                        <div className='p-8 rounded-lg shadow-lg'>
                            <h2 className="text-2xl text-start font-bold">Generative AI</h2>
                            <p className="mt-2 w-[300px] text-start  md:w-[400px]">At Zapllo, we harness the power of Generative AI to streamline repetitive tasks and save you valuable time. By identifying areas where your team is bogged down by repetitive processes, we create bespoke automation solutions that boost efficiency and productivity. For Example how we transformed the Onboarding process for one of our customers where we helped them generating onboarding documents and checklists to designing unique onboarding sequences tailored to thier business, to ensure a smooth and efficient start for every customer.

</p>
                        </div>
                    </motion.div>
                    <motion.div
                        className=" bg-[#0A0D28] mt-32 m-4"
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants('right', 1.8)}
                    >
                        <div>
                            <img src='/card/team.png' className='w-full h-40 rounded-lg  object-cover rounded-b-none' />
                            <div className=' flex -mt-10  ml-[80%]'>
                                <div className='flex justify-center'>
                                    <SignalIcon imgSrc={imgSrc5} />


                                </div>
                            </div>
                        </div>
                        <div className='p-8 rounded-lg shadow-lg'>
                            <h2 className="text-2xl text-start font-bold">Powerful Notion Teamspaces</h2>
                            <p className="mt-2 w-[300px] text-start  md:w-[400px]">Transform the way your team works with Zapllo&apos;s expertly crafted Notion Teamspaces. We help you build comprehensive systems within the Notion application, tailored for various functions including Operations, Customer Support, Management, Admin, HR, Marketing, Content Creation, and more. Streamline your business operations with systems designed for every department. Our team creates tailored solutions that fit your unique business needs, ensuring maximum efficiency.</p>
                        </div>
                    </motion.div>
                    <motion.div
                        className=" bg-[#0A0D28] mt-32 m-4"
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants('right', 2.8)}
                    >
                        <div>
                            <img src='/card/automation2.png' className='w-full h-40 rounded-lg  object-cover rounded-b-none' />
                            <div className=' flex -mt-10  ml-[80%]'>
                                <div className='flex justify-center'>
                                    <SignalIcon imgSrc={imgSrc6} />


                                </div>
                            </div>
                        </div>
                        <div className='p-8 rounded-lg shadow-lg'>
                            <h2 className="text-2xl text-start font-bold">Business Operations</h2>
                            <p className="mt-2 w-[300px] text-start  md:w-[400px]">At Zapllo, we empower you to streamline and enhance every aspect of your business operations. From Operations, Customer Support, Management, Admin, HR, Marketing, to Content Creation, our expertise helps you build robust systems that run on autopilot. Our bespoke automation solutions are tailored to fit your unique requirements, ensuring optimal efficiency. Focus on growth and innovation while our systems handle the day-to-day operations seamlessly.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

const items = [
    {
        image: 'deep.png',
    },

];