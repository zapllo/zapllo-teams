'use client';

import ChecklistSidebar from '@/components/sidebar/checklistSidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';

export default function MobileApp() {
    return (
        <div className="flex mt-24">
            <ChecklistSidebar />
            <div className="flex-1 p-4">
                <div className="w-full  min-h-screen  -mt-32 max-w-6xl mx-auto">
                    <div className="gap-2 flex mb-6 w-full">
                        <div className="mt-24 grid grid-cols-2 ml-56 gap-4 w-full">

                            <Card className='p-6  bg-transparent scale-75'>
                                <DotLottieReact
                                    src="/lottie/android.lottie"
                                    loop
                                    className="h-[80%]"
                                    autoplay
                                />
                                <div className='flex  justify-center'>
                                    <Button
                                        size="lg"
                                        className='scale-125 bg-[#815afb]'

                                    >Coming Soon</Button>
                                </div>
                            </Card>
                            <Card className='p-6 bg-transparent scale-75'>
                                <div className='h-56 flex items-center'>
                                    <img src='/lottie/ios.png' className='' />
                                </div>
                                <div className='flex   justify-center'>
                                    <div className='flex mb-4 justify-center'>
                                        <Button
                                            size="lg"
                                            className='scale-125 bg-[#815afb]'

                                        >Coming Soon</Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
