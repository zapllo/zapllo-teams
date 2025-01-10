import Faq from "@/components/globals/faq";
import Faq2 from "@/components/globals/faq2";
import Footer from "@/components/globals/Footer";
import { FloatingNavbar } from "@/components/globals/navbar";
import Benefits from "@/components/product-components/payroll/benefits";
import Business from "@/components/product-components/payroll/Business";
import PayrollFeatures from "@/components/product-components/payroll/Features";
import PayrollHero from "@/components/product-components/payroll/Hero";
import SettingUp4 from "@/components/product-components/payroll/holiday";
import SettingUp3 from "@/components/product-components/payroll/leavetypes";
import SettingUp2 from "@/components/product-components/payroll/registerfaces";
import SaveMore from "@/components/product-components/payroll/save";
import SettingUp from "@/components/product-components/payroll/settingup";
import PayrollTestimonials from "@/components/product-components/payroll/testimonials";
import Image from "next/image";

export default function Home() {
    return (
        // <LoaderLayout>
        <main className="bg-[#] bg-[#05071E] w-  mx-auto h-full z-10 overflow-hidden">
            <FloatingNavbar />
            <Image src='/mask.png' height={1000} className=" absolute overflow-hidden w-full " width={1000} alt="Background mask for zapllo automation" />
            <div className="flex justify-center">
                <PayrollHero />
            </div>
            <Business product="   Leave & Attendance Tracker App" />
            <PayrollFeatures />
            <SettingUp />
            <SettingUp2 />
            <SettingUp3 />
            <SettingUp4 />
            <SaveMore />
            <Benefits />
            <div
                className='scroller mt-20 md:mt-12  relative z-20 bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929]  max-w-8xl py-4 mb-4 overflow- space-x-6'
            >
                <h1 className="text-center text-xs md:text-2xl">
                    We are on a mission to help 10 Million MSMEs automate their business and get freedom from daily firefighting.
                </h1>
            </div>
            <PayrollTestimonials />
            <SaveMore />
            <div className="flex justify-center mt-24">
                <Faq2 />
            </div>
            <div className="flex bg-[#04061E]  md:mt-56 justify-center">
                <Footer />
            </div>
        </main>
    )
};