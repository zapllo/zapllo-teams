import React from 'react'

type Props = {}

export default function Effortless({ }: Props) {
    return (
        <div className='mb-16 mt-20 '>
            <h1 className='text-center bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent  text-2xl font-bold md:text-5xl'>Effortlessly Automate all your favorite Apps</h1>
            <div className='   md:ml-24 mt-20'>
                <div className='grid grid-cols-2 md:grid-cols-5 gap-x-md:mx-0 mx-4 gap-10'>
                    <img src='brands/highlevel.png' className='md:h-12' />
                    <img src='brands/hubspot.png' className='md:h-12 md:ml-5' />
                    <img src='brands/salesforce.png' className='md:h-16 hidden md:block md:ml-10' />
                    <img src='brands/mailchimp.jpg' className='md:h-16 h-20 ml-8 rounded-full' />
                    <img src='brands/keap.png' className=' md:h-16 hidden md:block -full ml-4 md:-ml-10' />
                    <img src='brands/shopify.webp' className=' h-16 ml-8 md:hidden block -full' />


                </div>

                <div className='grid grid-cols-3 md:grid-cols-4 md:ml-28 mx-8 md:mx-0 mt-12 gap-y-8  '>
                    <img src='brands/shopify.webp' className=' h-16 hidden md:block -full' />
                    <img src='brands/zoom.png' className='h-16  -full' />
                    <img src='brands/gmail.webp' className=' h-12 md:ml-4 ml-28 -full' />
                    <img src='brands/jira.png' className=' h-12 ml-4 hidden md:block -full' />



                </div>
                <div className='grid md:grid-cols-4 grid-cols-3 mx-8 md:mx-0  gap-y-8 md:ml-64  mt-12'>
                    <img src='/whatsapp.png' className=' h-16 -full' />
                    <img src='brands/openai.png' className='invert-[100] h-16 -full' />
                    <img src='brands/stripe.png' className=' h-16 -full' />
                </div>
            </div>
        </div>
    )
}