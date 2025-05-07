'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Separator } from "@/components/ui/separator";
import { MoveRight, Smartphone, SmartphoneIcon, Download } from "lucide-react";
import Link from "next/link";

export default function MobileAppPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
            <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
                <div className="space-y-8 text-center">
                    <div className="space-y-4">
                        <div className="inline-block bg-gray-800/60 px-4 py-1 rounded-full">
                            <div className="flex items-center space-x-2">
                                <Smartphone className="h-4 w-4 text-purple-400" />
                                <span className="text-sm font-medium text-gray-300">Mobile Experience</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            Enhance Your Experience
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                            Unlock the full potential of our platform with our dedicated mobile apps, designed for seamless interaction on the go.
                        </p>
                    </div>

                    <Separator className="bg-gray-800" />

                    <div className="grid md:grid-cols-2 gap-8 mt-12">
                        {/* Android Card */}
                        <Card className="bg-gray-900/60 border-gray-800 overflow-hidden backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="h-64 flex items-center justify-center">
                                    <DotLottieReact
                                        src="/lottie/android.lottie"
                                        loop
                                        autoplay
                                        className="h-full w-full"
                                    />
                                </div>
                                <div className="mt-6">
                                    <h2 className="text-2xl font-bold text-white mb-2">Android App</h2>
                                    <p className="text-gray-400 mb-4">Experience our full-featured Android application with enhanced performance and exclusive mobile features.</p>
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
                                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 group"
                                    >
                                        <Download className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-0.5" />
                                        Download on Google Play
                                        <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* iOS Card */}
                        <Card className="bg-gray-900/60 border-gray-800 overflow-hidden backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="h-64 flex items-center justify-center p-6">
                                    <img src='/lottie/ios.png' className='object-contain max-h-full' alt="iOS App" />
                                </div>
                                <div className="mt-6">
                                    <h2 className="text-2xl font-bold text-white mb-2">iOS App</h2>
                                    <p className="text-gray-400 mb-4">Our iOS application is optimized for Apple devices, providing a smooth and intuitive experience.</p>
                                </div>
                            </CardContent>
                            <CardFooter className="pb-6 pt-0 px-6">
                                <Button
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 group opacity-90"
                                    disabled
                                >
                                    <SmartphoneIcon className="mr-2 h-5 w-5" />
                                    Coming Soon to App Store
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="mt-16 max-w-2xl mx-auto bg-gray-900/40 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-xl font-medium mb-3">Continue on Web</h3>
                        <p className="text-gray-400 mb-4">You can continue using our web application, but for the best experience, we recommend downloading our mobile app.</p>
                        <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
                            Return to Web App
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
