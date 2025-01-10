import React from 'react'

export default function Buttonswow() {
    return (
        <div className="flex buttons here">
            <div className='grid grid-cols-1 mt-12 gap-4'>
                <div className='bg-white w-64 h-10 text-black rounded-md'>
                    <div className='flex justify- gap-2'>
                        <h1 className='mt-2 ml-7'>🧠</h1>
                        <h1 className='text-sm mt-2 font-bold'>AI Automated Newsletter</h1>
                    </div>
                </div>
                <div className='bg-white w-64 h-10 text-black rounded-md'>
                    <div className='flex gap-2'>
                        <h1 className='mt-2 ml-8'>💌</h1>
                        <h1 className='text-sm mt-2 font-bold'>40-60% Open Rate</h1>
                    </div>
                </div>
                <div className='bg-white w-64 h-10 text-black rounded-md'>
                    <div className='flex gap-2'>
                        <h1 className='mt-2 ml-7'>👍</h1>
                        <h1 className='text-sm mt-2 font-bold'>Effortless Engagement</h1>
                    </div>
                </div>
                <div className='bg-white w-64 h-10 text-black rounded-md'>
                    <div className='flex gap-2'>
                        <h1 className='mt-1 ml-8'>💵</h1>
                        <h1 className='text-sm mt-2 font-bold'>Increase Your Revenue</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
