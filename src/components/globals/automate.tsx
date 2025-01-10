import { Golos_Text } from 'next/font/google';
import React from 'react'
import { DockDemo } from './dock';
import { BookCall } from '../ui/bookcall';
import { BookCall2 } from '../ui/bookdemo';

const golos = Golos_Text({ subsets: ["latin"] });

export default function Automate() {
    return (
        <div className="bg-gradient-to-r from-[#815BF5] px-8 py-6 md:rounded-2xl   to-[#FC8929] grid lg:grid-cols-2 grid-cols-1   md:max-w-[1100px] md:mx-4  gap-2">
            <div className='w-full'>
                <h1 className='text-xl font-bold'>Manage your Business working only 1 hour / Day</h1>
                <p className={`${golos.className} text-sm mt-4 w-full text-gray-200`}>We identify areas in your business which is pulling in multiple hours and we help you in those areas by building automations and custom solutions which significantly reduces the bandwidth and also reduced the operational costs.</p>
                <div className='flex a mt-12 md:mt-6 justify-start'>
                    <BookCall2 />
                </div>
            </div>
            <div className=''>
                <DockDemo />
            </div>
        </div>
    )
}
