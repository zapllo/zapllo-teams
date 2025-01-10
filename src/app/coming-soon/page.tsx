import { FloatingNavbar } from '@/components/globals/navbar'
import { FloatingNav } from '@/components/ui/floating-navbar'
import Link from 'next/link'

export default function ComingSoon() {
    return (
        <div className=' bg-[#05071E]'>
            <FloatingNavbar />


            <div className='max-w-8xl mt-24 items-center flex justify-center'>
                <img src='404.png' className='h-96 w-auto' />
            </div>
            <div className='text-center   flex justify-center'>
                <h2 className='font-bold'>Coming up Soon!</h2>
            </div>
            <p className='text-center text-sm mt-4 font-thin '>Your Requested Resource is under construction and will be coming up soon,<br /> We are working our best to keep your experience seamless!</p>
          
        </div>
    )
}