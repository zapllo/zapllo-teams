import Effortless from "@/components/effortlessIntegration";
import Footer from "@/components/globals/Footer";
import Arrow from "@/components/globals/arrow";
import Automate from "@/components/globals/automate";
import Faq from "@/components/globals/faq";
import Features from "@/components/globals/features";
import Grow from "@/components/globals/grow";
import GrowSubs from "@/components/globals/growsubs";
import Hero from "@/components/globals/hero";
import { InfiniteMoving } from "@/components/globals/infinite-moving";
import { InfiniteMoving2 } from "@/components/globals/infinite-moving2";
import LoaderLayout from "@/components/globals/multi-step-loader";
import { FloatingNavbar } from "@/components/globals/navbar";
import OfficialPartners from "@/components/globals/officialpartners";
import OurTeam from "@/components/globals/ourteam";
import Partners from "@/components/globals/partners";
import Service from "@/components/globals/service";
import TeamBubble from "@/components/globals/teambubble";
import Testimonials from "@/components/globals/testimonials";
import Testimonials2 from "@/components/globals/testimonials2";
import TestimonialsCopy from "@/components/globals/testimonialscopy";
import Tools from "@/components/globals/tools";
import Autopilot from "@/components/product-components/landing/autopilot";
import CoreFeatures from "@/components/product-components/landing/core-features";
import HeroLanding from "@/components/product-components/landing/hero";
import SaveLanding from "@/components/product-components/landing/savelanding";
import Solutions from "@/components/product-components/landing/solutions";
import Solutions2 from "@/components/product-components/landing/solutions2";
import Solutions3 from "@/components/product-components/landing/solutions3";
import WeDifferent from "@/components/product-components/landing/wedifferent";
import SaveMore from "@/components/product-components/payroll/save";
import PayrollTestimonials from "@/components/product-components/payroll/testimonials";
import Image from "next/image";

export default function Home() {
  return (
    // <LoaderLayout>
    <main className="bg-[#] bg-[#05071E]  mx-auto h-full z-10 overflow-hidden">
      <FloatingNavbar />
      <Image src='/mask.png' height={1000} className=" absolute overflow-hidden w-full " width={1000} alt="Background mask for zapllo automation" />
      {/* <Hero /> */}
      <HeroLanding />
      <section className="text-center p-4  font-bold mt-12">
        <h1 className="text-3xl mb-4" >Trusted By</h1>
        {/* <Partners /> */}
        <InfiniteMoving2 />
      </section>
      <section className="justify-center bg-[#05071E]  flex">
        {/* <Features /> */}
        <Autopilot />
      </section>
      <div className=" bg-[#05071E]">
        {/* <Service /> */}
        <Solutions />
      </div>
      <div className="md:mt-12 mt-36  flex justify-center  bg-[#05071E]">
        {/* <Automate /> */}
        <Solutions2 />
      </div>
      <div className="justify-center  flex bg-[#05071E]">
        {/* <Tools /> */}
        {/* <Effortless /> */}
        <Solutions3 />

      </div>
      <img src="light.png" className="-mt-72 h-96 w-[50%]" />
      {/* 
      <div className="mt-2 justify-center flex bg-[#0A0D28] ">
        <div className="max-w-[1100px] w-full bg-[#0A0D28]">
          <h1 className="mx-4 md:mx-0 font-bold pt-12 text-center text-4xl">
            The Power of <span className="bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent">AI & Automation</span>. The <span className="bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent"> Care of Humans</span>.
          </h1>
          <p className="text-sm text-center mt-8 mx-4 md:mx-0 text-gray-200">Empowering businesses with AI precision and Robust Automations, enhanced by human insight, ensuring seamless worflows and 10X productivity.</p>
        </div>
      </div> */}
      {/* <div className="justify-center pb-24  pt-12  md:flex bg-[#0A0D28]">
        <Arrow />
      </div> */}
      <CoreFeatures />
      <div className="justify-center  md:mt-0 flex bg-[#04061E]">
        {/* <Grow /> */}
        <WeDifferent />
      </div>
      <div
        className='scroller mt-12 relative z-20 bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929]  max-w-8xl py-4 mb-4 overflow- space-x-6'
      >
        <h1 className="text-center md:text-2xl text-sm mx-4 md:mx-0">
          We are on a mission to help 10 Million MSMEs automate their business and get freedom from daily firefighting.
        </h1>
      </div>
      <div className="justify-center mt-12  flex bg-[#04061E]">
        <PayrollTestimonials />
      </div>
      <div className="justify-center mt-16  flex bg-[#04061E]">
        <SaveLanding />
      </div>

      <div className="flex bg-[#04061E] mb-12 md:mb-0   md:mt-56 justify-center">
        <Footer />
      </div>
    </main>
    // </LoaderLayout>
  );
}


{/*
  
  <div className="mt-12 mb-12">
        <InfiniteMoving
          direction="right"
          speed="slow"
        />
      </div>
      <div className="justify-center mt-32  flex b  ">
        <Testimonials />
      </div>
      <div className="justify-center mt-32  flex bg-[#04061E]  ">
        <Testimonials2 />
      </div>
      <div className="justify-center  mt-4  flex bg-[#04061E]  ">
        <Faq />
      </div>

      <div className="justify-center mt-32   flex b  ">
        <TestimonialsCopy />
      </div>
      <div className="justify-center mt-20  flex bg-[#04061E]  ">
        {/* <OurTeam /> */}
// <TeamBubble />
// </div>


