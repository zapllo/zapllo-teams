// "use client"


import Link from "next/link";
import ShimmerButton from "../magicui/shimmer-button";
import { BookCall } from "../ui/bookcall";
import ShineBorder from "../magicui/shine-border";
import { useEffect } from "react";
import { Button } from "../ui/button";

export default function Disclaimer() {
    //    useEffect(() => {
    //         if (typeof document !== 'undefined') {
    //             const disableContextMenu = (e: MouseEvent) => e.preventDefault();
    //             const disableSelection = (e: Event) => {
    //                 e.preventDefault();
    //                 const selection = window.getSelection();
    //                 if (selection) {
    //                     selection.removeAllRanges();
    //                 }
    //             };

    //             document.addEventListener('contextmenu', disableContextMenu);
    //             document.addEventListener('selectstart', disableSelection);

    //             return () => {
    //                 document.removeEventListener('contextmenu', disableContextMenu);
    //                 document.removeEventListener('selectstart', disableSelection);
    //             };
    //         }
    //     }, []);
    return (
        <main className="bg- py-16   px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg">
            <div className="max-w-4xl mx-auto">
                <div className="md:flex items-center justify-between mb-8">
                    <Link href='/'>
                        <img alt="Zapllo Technologies" className="h-7 cursor-pointer" src="/logo.png" />
                    </Link>
                    <div className="flex md:mt-0 mt-12 gap-2">

                        <Button className="bg-black hover:border-[#815bf5] border hover:bg-black rounded-full">
                            <Link
                                href="/signup"
                                className="relative m0 text-white font-medium    overflow-hidden rounded-full "
                            >
                                <h1>
                                    Get Started
                                </h1>
                            </Link>

                        </Button>
                        <Link
                            href="/login"
                            className="relative  text-white font-medium  overflow-hidden rounded-full  "
                        >

                            <Button className="rounded-full">
                                Login
                            </Button>
                        </Link>
                    </div>

                </div>
                <div className="space-y-12 mt-12 text-[#676B93]">
                    <section className="text-justify">
                        <h1 className="md:text-3xl text-start  mb-6  text-2xl  text-gray-400 md:mt-0 mt-0 font-bold">Disclaimer</h1>

                        <p className="mb-2 text-justify">
                            This site is not a part of the Facebook™ website or Facebook™ Inc. Additionally, This site is NOT endorsed by Facebook™ in any way. FACEBOOK™ is a trademark of FACEBOOK™, Inc. Zapllo Technologies Private Limited is an independent entity offering software consultancy, development services, automation solutions, and specialized training. We are dedicated to assisting clients in leveraging Artificial Intelligence, facilitating cross-platform integration, and building robust Notion Business Systems.
                        </p>

                        <p className="mb-2 text-justify">
                            Zapllo Technologies Private Limited does not offer a business opportunity, a &quot;get rich quick&quot; scheme, or any money-making system. Our goal is to provide high-quality services and training to enhance the operational efficiency and technological capabilities of businesses and individuals. However, we cannot guarantee specific results or financial gains as part of our services.
                        </p>
                        <p className="mb-2 text-justify">

                            All content, ideas, strategies, and tools shared by Zapllo Technologies Private Limited are for educational purposes only. We aim to offer valuable insights and directions that have benefited our team and clients. Still, every business and individual&quot;s success depends on their dedication, effort, and the applicability of these strategies to their unique circumstances. Therefore, we do not make any promises or guarantees regarding the achievement of specific outcomes or earnings.
                        </p>
                        <p className="mb-2 text-justify">

                            The intellectual property on our website, including but not limited to our methods, strategies, and training material, is protected by copyright laws. Unauthorized reproduction, distribution, or duplication of any content is strictly prohibited.
                        </p>
                        <p className="mb-2 text-justify">
                            Investing in any form of business or technology carries risks, and it is possible to experience partial or total loss of your investment. The advice and strategies provided by Zapllo Technologies Private Limited may not be suitable for everyone or every situation. We do not provide legal, financial, or professional advice tailored to individual circumstances, and we make no claims about the likelihood of success or financial gain from our services.
                        </p>
                        <p className="mb-2 text-justify">
                            Feedback and testimonials from our clients are based on their personal experiences and are not indicative of guaranteed results. Success in any business or technological endeavor is influenced by many factors, including individual effort, market conditions, and external factors beyond our control.
                        </p>
                        <p className="mb-2 text-justify">
                            Zapllo Technologies Private Limited may refer to third-party content or services not affiliated with our company. We are not responsible for such content and do not endorse or approve it. Similarly, while we may recommend third-party services or businesses, some of which may have affiliations with our company, we are not liable for their offerings or performance.
                        </p>
                        We value transparency and integrity and strive to maintain high standards in all our interactions and services. Thank you for considering Zapllo Technologies Private Limited as your partner in technology and business development.
                    </section>
                </div>
            </div>
        </main>
    )
}