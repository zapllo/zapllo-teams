import { FloatingNavbar } from '@/components/globals/navbar'
import PrivacyPolicy from '@/components/globals/privacyPolicy'
import Image from 'next/image'
import React, { useEffect } from 'react'

export default function Privacy() {
    // useEffect(() => {
    //     const handleContextMenu = (e: any) => e.preventDefault();

    //     document.addEventListener('contextmenu', handleContextMenu);

    //     return () => {
    //         document.removeEventListener('contextmenu', handleContextMenu);
    //     };
    // }, []);

    // useEffect(() => {
    //     const handleCopy = (e:any) => e.preventDefault();
    //     const handleCut = (e:any) => e.preventDefault();
    //     const handlePaste = (e:any) => e.preventDefault();

    //     document.addEventListener('copy', handleCopy);
    //     document.addEventListener('cut', handleCut);
    //     document.addEventListener('paste', handlePaste);

    //     return () => {
    //         document.removeEventListener('copy', handleCopy);
    //         document.removeEventListener('cut', handleCut);
    //         document.removeEventListener('paste', handlePaste);
    //     };
    // }, []);

    return (
        <main className="bg-[#] bg-[#05071E] mx-auto h-full z-10 overflow-hidden">
            {/* <FloatingNavbar />
            <Image src='/mask.png' height={1000} className=" absolute overflow-hidden -mt-80   w-full 0" width={1000} alt="Background mask for zapllo automation" /> */}
            <PrivacyPolicy />

        </main>
    )
}
