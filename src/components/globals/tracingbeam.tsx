"use client";
import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { TracingBeam } from "../ui/tracing-beam";

export function TracingBeamDemo() {
    return (
        <>
            <div className="max-w-[1100px] w-full  ">
                <h1 className=" font-bold mt-12 text-start text-4xl">
                    The Power of <span className="bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent">AI</span>. The <span className="bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent"> Care of Humans</span>.
                </h1>
                <p className="text-sm mt-8 text-gray-200">Empowering brands with AI precision, enhanced by human insight, ensuring exceptional quality in every newsletter.</p>
               
                <TracingBeam className="px-6 mt-12">
                <h1 className="  bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] rounded-xl mb-12 px-4 py-2 bg-clip-text text-transparent font-bold w-fit text-start text-2xl">
                    Expert Oversight
                </h1>
                    <div className="max-w-2xl mx-auto antialiased pt-4 relative">
                        {dummyContent.map((item, index) => (
                            <div key={`content-${index}`} className="mb-10">
                                <h2 className="bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] text-white rounded-full text-sm w-fit px-4 py-1 mb-4">
                                    {item.badge}
                                </h2>

                                <p className={twMerge("text-xl mb-4")}>
                                    {item.title}
                                </p>

                                <div className="text-sm  prose prose-sm dark:prose-invert">
                                    {item?.image && (
                                        <Image
                                            src={item.image}
                                            alt="blog thumbnail"
                                            height="1000"
                                            width="1000"
                                            className="rounded-lg mb-10 object-cover"
                                        />
                                    )}
                                    {item.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </TracingBeam>
            </div>
        </>
    );
}

const dummyContent = [
    {
        title: "",
        description: (
            <>
                <p>
                We use good old fashioned human oversight to ensure your newsletters are world-class. Your content always maintains a human touch to ensure a personal connection with your audience.
                </p>
               
            </>
        ),
        badge: "Your tools",
        image:
            "/picktools.png",
    },
    {
        title: "",
        description: (
            <>
                <p>
                We use good old fashioned human oversight to ensure your newsletters are world-class. Your content always maintains a human touch to ensure a personal connection with your audience.
                </p>
            </>
        ),
        badge: "Automation Software",
        image:
            "/automationso.png",
    },
    {
        title: "",
        description: (
            <>
                <p>
                We use good old fashioned human oversight to ensure your newsletters are world-class. Your content always maintains a human touch to ensure a personal connection with your audience.
                </p>
            </>
        ),
        badge: "Launch Automation",
        image:
            "/picktools.png",
    },
];
