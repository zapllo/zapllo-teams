"use client";

import React, { useEffect, useState } from "react";
import { MovingCards } from './movingcards'

export function TestimonialCards() {
    return (
        <div className="h-[25rem] rounded-md flex flex-col antialiased  dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
            <MovingCards
                items={testimonials}
                direction="right"
                speed="slow"
            />
        </div>
    );
}

const testimonials = [
    {
        quote:
            "Using Task Delegation App has made managing my team stress-free. Tasks are completed on time, and the app’s features ensure nothing is ever missed.",
        name: "Komal Jain",
        title: "Chemical Manufacturing",
        image: '/people/female1.jpg',
    },
    {
        quote:
            "Zapllo has transformed the way we manage tasks. Everyone stays accountable, and the streamlined system has made performance reviews so much easier.",
        name: "Tarun Bhatia",
        title: "Real Estate",
        image: '/people/man1.jpg',
    },
    {
        quote:
            "Since adopting Zapllo, my team’s productivity has skyrocketed. The visual dashboard and notifications make staying on top of tasks effortless.",
        name: "Harsh Pandey",
        title: "Digital Marketing Agency",
        image: '/people/man2.jpg',
    },
    {
        quote:
            "Zapllo is an incredible tool for managing projects. Assigning tasks is effortless, and the voice commands save a ton of time. A must-have for any business.",
        name: "Suresh Shetty",
        title: "IT Services",
        image: '/people/man3.jpg',
    },
    {
        quote:
            "Task delegation has never been easier. With audio notes and detailed dashboards, I always know the progress of my team’s tasks. Zapllo is a fantastic tool!",
        name: "Kavita Menon",
        title: "Pharma Manufacturer",
        image: '/people/female2.jpg',
    },
    {
        quote:
            "Zapllo feels like mission control for our operations. Communication is seamless, and the automation features make it an essential tool for our team.",
        name: "Yash Goyal",
        title: "Garments Manufacturing",
        image: '/people/man4.jpg',
    },
    {
        quote:
            "The app has significantly improved accountability in my team. Tasks are executed on time, and I no longer need to follow up constantly. Highly recommended!",
        name: "Karan Oberoi",
        title: "Jewellery Manufacturer",
        image: '/people/man5.jpg',
    },
    {
        quote:
            "Zapllo has streamlined our workflow like never before. From task tracking to automation, it has made our operations smooth and efficient.",
        name: "Rohan Mehta",
        title: "Garments Manufacturing",
        image: '/people/man6.jpg',
    },
];
