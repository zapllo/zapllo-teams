'use client'

import React, { useState } from 'react'
import PayrollFaq from './Faq'

type Props = {}

export default function PayrollFeatures({ }: Props) {
    const [currentImage, setCurrentImage] = useState('/product/face.png'); // Default image

    const handleAccordionChange = (value: string) => {
        // Map accordion values to corresponding images
        const imageMap: Record<string, string> = {
            'item-1': '/product/face.png',
            'item-2': '/product/face.png',
            'item-3': '/product/applyease.png',
            'item-4': '/product/attendance-reg.png',
            'item-5': '/product/backdated.png',
            'item-6': '/product/notifications2.png',
        };
        setCurrentImage(imageMap[value] || '/product/face.png');
    };
    return (
        <div className='w-full flex justify-center'>
            <div className='mb-16 md:mt-20 '>
                <div className='flex justify-center'>
                    <h1 className='text-center  text-2xl font-bold md:max-w-xl'><span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent '>
                        Core Features
                    </span> </h1>
                </div>
                <h1 className='font-bold text-center mb-4 md:text-3xl  mt-4'>Simplify your Leave & Attendance Management</h1>
                <div className='grid md:grid-cols-2 items-center max-w-5xl gap-4'>
                    <div className=' scale-75  md:scale-100'>
                        <PayrollFaq onAccordionChange={handleAccordionChange} />
                    </div>
                    <div className='hidden md:block  relative rounded-xl'>
                        <img src={currentImage} className="rounded-xl scale-90 " alt="Feature" />
                    </div>
                </div>
            </div>

        </div>
    )
};