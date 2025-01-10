'use client'

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function MobileAppPage() {
    return (
        <div className="flex items-center justify-center md:w-screen md:h-screen pt-24 bg-black m-auto">
            <div className="space-y-4">
                <h1 className="text-3xl  text-center font-bold">You&apos;re using the web app</h1>
                <div className="">
                  <h1 className="text-center"> Download the mobile app for a better experience!</h1>
                        <div className="mt-24 grid md:grid-cols-2 gap-4 w-full">

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
    );
}
