'use client';

import ChecklistSidebar from '@/components/sidebar/checklistSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Separator } from '@/components/ui/separator';
import { Download, MoveRight, Smartphone, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function MobileApp() {
    return (
        <div className="flex mt-24">
          

            <div className="flex-1 m pt-4 h-screen overflow-y-auto mb-12 scrollbar-hide">
                <div className="w-full m mx-auto px-4 md:px-6">
                    <div className="space-y-6 max-w-4xl mx-auto">
                        <div className="text-center space-y-4">
                            <div className="inline-block bg-slate-100 dark:bg-slate-800 px-4 py-1 rounded-full">
                                <div className="flex items-center space-x-2">
                                    <Smartphone className="h-4 w-4 text-purple-500" />
                                    <span className="text-sm font-medium">Mobile Applications</span>
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                Take Zapllo with You Everywhere
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Access all features on the go with our dedicated mobile applications,
                                designed for a seamless experience on your smartphone.
                            </p>
                        </div>

                        <Separator className="my-8" />

                        <div className="grid md:grid-cols-2 mb-12 gap-8">
                            {/* Android Card */}
                            <Card className="overflow-hidden mb-36 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="h-64 flex items-center justify-center">
                                        <DotLottieReact
                                            src="/lottie/android.lottie"
                                            loop
                                            autoplay
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <div className="mt-6 space-y-2">
                                        <h2 className="text-2xl font-semibold">Android App</h2>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Our Android app provides a seamless experience with exclusive mobile features.
                                            Download now from the Google Play Store.
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="pb-6 pt-0 px-6">
                                    <Link
                                        href="https://play.google.com/store/apps/details?id=com.zapllo.app&hl=en"
                                        target="_blank"
                                        className="w-full"
                                    >
                                        <Button
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 group"
                                        >
                                            <Download className="mr-2 h-5 w-5" />
                                            Download on Google Play
                                            <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>

                            {/* iOS Card */}
                            <Card className="overflow-hidden mb-36 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="h-64 flex items-center justify-center p-4">
                                        <img
                                            src='/lottie/ios.png'
                                            className='object-contain max-h-full'
                                            alt="iOS App Preview"
                                        />
                                    </div>
                                    <div className="mt-6 space-y-2">
                                        <h2 className="text-2xl font-semibold">iOS App</h2>
                                        <p className="text-slate-600 dark:text-slate-400">
                                            Our iOS application is optimized for Apple devices, providing a smooth and
                                            intuitive experience. Coming soon to the App Store.
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="pb-6 pt-0 px-6">
                                    <Button
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                                        disabled
                                    >
                                        <Smartphone className="mr-2 h-5 w-5" />
                                        Coming Soon to App Store
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}
