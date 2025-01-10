'use client';

import ChecklistSidebar from '@/components/sidebar/checklistSidebar';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';

export default function Events() {
    return (
        <div className="flex mt-24">
            <ChecklistSidebar />
            <div className="flex-1 p-4">
                <div className="w-full  min-h-screen  -mt-32 max-w-4xl mx-auto">
                    <div className="gap-2 flex mb-6 w-full">
                        <div className="-mt-2 w-full">
                            <div className='flex justify-center ml-12 mt-24 p-4'>
                                <div className='space-y-2 '>
                                    <DotLottieReact
                                        src="/lottie/empty.lottie"
                                        loop
                                        className="h-56 ml-8"
                                        autoplay
                                    />

                                    <h1 className='text-2xl text-center ml-12 font-bold'>Coming Soon</h1>
                                    <p className='ml-12'>We are bringing Live Classes to help you grow your business</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
