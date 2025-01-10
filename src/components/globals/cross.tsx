"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const CrossedText = () => {
    const [isCrossed, setIsCrossed] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsCrossed(true);
                }
            },
            {
                threshold: 0.1,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div className="relative  flex justify-center" ref={ref}>
            {/* <p className="text-2xl font-bold">Text to be crossed</p> */}
            <img src='/brands/fi.png' className='w-[80%]' />

            <svg
                className="absolute top-10/11 -left-20 w-full scale-150 -rotate-3 h-full pointer-events-none"
                viewBox="0 0 300 50"
            >
                <defs>
                    <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: "#815BF5", stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: "#FC8929", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#FC8929", stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <motion.path
                    d="M0,25 C50,10 150,40 200,25 C225,15 250,35 275,25 Q285,20 800,25"
                    fill="transparent"
                    stroke="url(#gradientStroke)"
                    className=' '
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isCrossed ? 1 : 0 }}
                    transition={{ duration: 4.5, ease: "easeInOut" }}
                />
            </svg>
        </div>
    );
};

export default CrossedText;
