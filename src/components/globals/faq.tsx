import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import GradientText from '../magicui/gradient'

export default function Faq() {
    return (
        <div>
            <GradientText>
                <h1 className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent text-center font-bold text-3xl'>FAQ</h1>
            </GradientText>
            <h1 className='text-3xl text-center mx-4 md:mx-0 font-bold mt-2'>You have Questions, We have Answers</h1>
            <div className='mt-4 space-y-4'>
                <Accordion type="single" collapsible className='md:w-[900px] '>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is Notion?</AccordionTrigger>
                        <AccordionContent>
                            Notion is a versatile productivity tool that combines note-taking, task management, databases, and project management into a single integrated application. It allows users to create custom pages consisting of various types of content including text, images, to-do lists, and tables. One of the key features of Notion is its highly flexible and modular setup, where users can build their workspace exactly as they see fit. This can range from simple task lists to complex databases that track entire projects or inventories.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Accordion type="single" collapsible className='md:w-[900px]  '>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className=''>Is this business automation suitable for my business size?</AccordionTrigger>
                        <AccordionContent>
                            Our solutions is scalable and can be adapted to businesses of all sizes.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion> <Accordion type="single" collapsible className='md:w-[900px] '>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Do I need any technical expertise to use your services?</AccordionTrigger>
                        <AccordionContent>
                            These applications are designed to be user-friendly and require minimal technical expertise. We also provide onboarding and support to ensure a smooth transition.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible className='md:w-[900px] '>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Do you offer any support after I purchase your services?</AccordionTrigger>
                        <AccordionContent>
                            Yes, we provide onboarding assistance, ongoing support, and training resources to ensure you get the most out of our package.
                            We believe in customer satisfaction and this is a reson we have been able to put our footprints all around the globe with our services.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible className='md:w-[900px] '>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What kind of ROI can I expect from this automation solution?</AccordionTrigger>
                        <AccordionContent>
                        It is aimed at delivering tangible ROI by reducing operational costs, boosting productivity, and driving revenue growth.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible className='md:w-[900px] '>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Can these automation solutions adapt to the changing needs of my business as it grows?</AccordionTrigger>
                        <AccordionContent>
                        Absolutely! It is designed to scale with your business, accommodating growth and evolving requirements. Whether you are adding new products, expanding into new markets, or increasing your team size, our automation tools can flexibly adjust to meet your needs.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible className='md:w-[900px] '>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Are these solutions easy to implement, and will they disrupt my current operations?</AccordionTrigger>
                        <AccordionContent>
                        You will get a customized automation plan to seamlessly integrate the automation solutions into your existing workflows without causing disruptions. Our goal is to enhance efficiency, not create additional headaches.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible className='md:w-[900px] '>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Is my data secure?</AccordionTrigger>
                        <AccordionContent>
                        Yes! Security is our top priority and we built Zapllo from the ground up to make sure your data is protected and secured.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible className='md:w-[900px] '>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Do you have more questions ?</AccordionTrigger>
                        <AccordionContent>
                        Hit us with an email at contact@zapllo.com or write to us from our Contact Page and we will get back to you in no time.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}
