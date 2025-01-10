'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type Props = { children: React.ReactNode }

const Layout = ({ children }: Props) => {

    return (
        <div className=' bg-[#04061e]  scrollbar-hide h-screen w-full  border-muted-foreground/30  overflow-hidden '>
            <div className='w-full h-screen overflow-hidden'>
                {children}
            </div>
        </div>
    )
}

export default Layout







