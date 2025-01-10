"use client";

import React from 'react';
import { motion } from 'framer-motion';

const waveVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i: number) => ({
        scale: [0.8, 1.5],
        opacity: [1, 0],
        transition: {
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1,
            delay: i * 0.5,
        },
    }),
};

export const SignalIcon = ({ imgSrc }: { imgSrc: string }) => {
    const renderWaveCircles = () => {
        return [0, 1, 2].map((i) => (
            <>
                <motion.div
                    key={`wave1-${i}`}
                    className="absolute rounded-full border-[#815BF5] border-2 h-16 w-16"
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={waveVariants}
                />
                <motion.div
                    key={`wave2-${i}`}
                    className="absolute rounded-full border-[#815BF5] border-4 h-20 w-20"
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={waveVariants}
                />
            </>
        ));
    };

    return (
        <div className="relative flex items-center justify-center h-20 w-20">
            {renderWaveCircles()}
            <div className="absolute h-16 w-16 rounded-full flex items-center justify-center">
                <div className="absolute h-16 w-16 border  border-[#815BF5]  rounded-full flex items-center justify-center" />
                <div className="absolute h-[60px] w-[60px] border border-[#815BF5]  rounded-full flex items-center justify-center" />
                <div className="absolute h-14 w-14 border border-[#815BF5]  rounded-full flex items-center justify-center" />
                <div className='absolute h-16 w-16 border bg-[#815BF5]  -[#ffffff] shadow-sm shadow-white rounded-full flex items-center justify-center'>
                    <div className="absolute h-14 w-14 border bg-[#815BF5]  border-[#815BF5] rounded-full flex items-center justify-center" />
                </div>
                <span className="text-white text-2xl z-[10]">
                    <img src={imgSrc} alt="signal" className="h-14 w-14 rounded-full" />
                </span>
            </div>
        </div>
    );
};

export default SignalIcon;
