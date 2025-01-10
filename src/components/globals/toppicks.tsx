"use client";
import React from "react";
import { StickyScroll } from "../ui/sticky-scroll-reveal";
import Image from "next/image";
import { BookCall } from "../ui/bookcall";


const content = [
    {
        title: "Interactive Dashboards",
        description:
            "Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.",
        content: (
            <div className="h-full w-[100%] object-contain">
                <img src="/picktools.png" className="" />
            </div>
        ),
    },
    {
        title: "",
        description:
            "",
        content: (
            <div className="h-full w-[100%] object-contain">
                <img src="/automationso.png" />
            </div>
        ),
    },
    {
        title: "",
        description:
            "",
        content: (
            <div className="h-full w-[100%] object-contain">
                <img src="/biz.png" />
            </div>
        ),
    },
    // {
    //     title: "",
    //     description:
    //         "",
    //     content: (
    //         <div className="h-full w-[100%] object-contain">
    //             <img src="/automationso.png" />
    //         </div>
    //     ),
    // },
];

export function TopPicks() {
    return (
        <div className="md:p-10  md:max-w-[1300px]">
            <StickyScroll content={content} />
        </div>
    );
}
