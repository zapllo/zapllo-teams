'use client'

import { InfiniteMoving2 } from '@/components/globals/infinite-moving2';
import React from 'react'
import {motion} from 'framer-motion'

type Props = {
    product: string;
}

export default function Business({ product }: Props) {
    return (
        <div className='w-full  flex justify-center'>
            <div className='mb-16 mt-20 '>
                <div className='flex justify-center'>
                    <h1 className='text-center  md:text-3xl text-xl font-bold  md:max-w-xl'>Smart Business Owners using<br /> <span className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] text-2xl md:text-3xl bg-clip-text text-transparent '>
                        {product}
                    </span> </h1>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative mb- mt-12"
                >
                    <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-24 bg-gradient-to-r from-[#815BF5]/10 via-[#FC8929]/10 to-[#815BF5]/10 blur-xl"></div>
                    <div className="bg-[#0A0D28]/70 backdrop-blur-sm border border-[#815BF5]/20 rounded-xl py-8">
                        <div className='w-full text-center justify-center flex gap-2'>
                            <InfiniteMoving2 />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}