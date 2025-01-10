import React from 'react'
import CrossedText from './cross'

export default function Grow() {
    return (
        <div className='md:mt-24'>
            <div className='mb-16 '>
                <h1 className='text-center texta-white text-2xl font-bold md:text-5xl'>Millions run on Notion every day</h1>
                <p className='text-gray-300  text-center mt-2 text-md'>Powering the world’s best teams, from next-generation startups to established enterprises.</p>
            </div>
            <div className='flex justify-center '>
                <div className='grid md:grid-cols-6  gap-8 grid-cols-2'>
                    <img src='/brands/01.png' className='h-auto w-40' />
                    <img src='/brands/02.png' className='h-auto w-40' />
                    <img src='/brands/03.png' className='h-auto w-40' />
                    <img src='/brands/04.png' className='h-auto w-40' />
                    <img src='/brands/05.png' className='h-auto w-40' />
                    <img src='/brands/06.png' className='h-auto w-40' />
                </div>
            </div>
            <div className='flex justify-center gap-8 mt-12 '>
                <div className='grid md:grid-cols-5 gap-8 grid-cols-2'>
                    <img src='/brands/13.png' className='h-auto w-40' />
                    <img src='/brands/08.png' className='h-auto w-40' />
                    <img src='/brands/09.png' className='h-auto w-40' />
                    <img src='/brands/10.png' className='h-auto w-40' />
                    <img src='/brands/11.png' className='h-auto w-40' />
                    <img src='/brands/11.png' className='h-auto block md:hidden w-40' />
                </div>
            </div>
            <div className='flex justify-center gap-8 mt-12 '>
                <div className='grid md:grid-cols-3 gap-8 grid-cols-2'>
                    <img src='/brands/12.png' className='h-auto w-40' />
                    <img src='/brands/13.png' className='h-auto w-40' />
                    <img src='/brands/07.png' className='h-auto w-40 invert-[100]' />
                    <img src='/brands/07.png' className='h-auto block md:hidden w-40 invert-[100]' />
                </div>

            </div>
            <h1 className='mt-12 md:text-5xl font-bold text-center'>Consolidate Tools</h1>
            <h2 className='md:text-3xl font-bold text-center'>Cut Costs.</h2>
            <div className='md:flex hidden md:justify-center gap-8 mt-12 '>
                {/* <img src='line.png' className='absolute w-10/12 mt-4' /> */}
                <CrossedText />

            </div>
        </div>
    )
}
