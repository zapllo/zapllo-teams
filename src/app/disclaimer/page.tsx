import Disclaimer from '@/components/globals/disclaimer'
import { FloatingNavbar } from '@/components/globals/navbar'
import Image from 'next/image'
import React from 'react'

export default function DisclaimerPage() {
    return (
        <main className="bg-[#] bg-[#05071E] mx-auto h-full z-10 overflow-hidden">
            {/* <FloatingNavbar /> */}
            {/* <Image src='/mask.png' height={100} className=" absolute overflow-hidden -mt-[5%]   w-full 0" width={100} alt="Background mask for zapllo automation" /> */}
            <Disclaimer />

        </main>
    )
}
