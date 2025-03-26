'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Partner logo component with hover effect
const PartnerLogo = ({ name, logo = '' }: { name: string, logo?: string }) => (
    <div className="group flex flex-col items-center justify-center mx-6">
        <div className="h-12 w-auto relative flex items-center justify-center overflow-hidden transition-all duration-300 filter grayscale hover:grayscale-0 hover:scale-110">
            {logo ? (
                <h1
                    className="h-full text-muted-foreground text-lg object-contain"
                >{name}</h1>
            ) : (
                <div className="bg-gradient-to-r from-[#815BF5]/10 to-[#FC8929]/10 px-6 py-3 rounded-lg">
                    <span className="text-lg font-semibold bg-gradient-to-r from-[#815BF5] to-[#FC8929] bg-clip-text text-transparent">
                        {name}
                    </span>
                </div>
            )}
        </div>
    </div>
)

// Sample partner data - replace with actual partner logos
const partners = [
    { name: "CoCreative", logo: "/partners/cocreative.png" },
    { name: "Daily AI", logo: "/partners/dailyai.png" },
    { name: "Collaboration AI", logo: "/partners/collaborationai.png" },
    { name: "Young Indians", logo: "/partners/youngindia.png" },
    { name: "BNI Kolkata", logo: "/partners/bni.png" },
    { name: "BNI Dhanbad", logo: "/partners/bni.png" },
    { name: "Mach Energy Services", logo: "/partners/mach.png" },
    { name: "DPG Media", logo: "/partners/dpg.png" },
    { name: "Nyrah Beauty", logo: "/partners/nyrah.png" },
    { name: "Top Tier Authentics", logo: "/partners/toptier.png" },
    { name: "Lions International", logo: "/partners/lions.png" },
    { name: "Malabar", logo: "/partners/lions.png" },
    { name: "Emeralds", logo: "/partners/lions.png" },
    { name: "Sabhyasachi", logo: "/partners/lions.png" },
    { name: "Walking Tree", logo: "/partners/lions.png" },
    { name: "Birla Braniacs", logo: "/partners/lions.png" },
    { name: "BVC Ventures", logo: "/partners/lions.png" },
    { name: "Green Lab", logo: "/partners/lions.png" },
    { name: "Lineargent", logo: "/partners/lions.png" },
]

export const InfiniteMoving2 = ({
    direction = 'left',
    speed = 'normal',
    pauseOnHover = true,
    className,
}: {
    direction?: 'left' | 'right'
    speed?: 'fast' | 'normal' | 'slow'
    pauseOnHover?: boolean
    className?: string
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const scrollerRef = React.useRef<HTMLUListElement>(null)

    useEffect(() => {
        addAnimation()
    }, [])

    const [start, setStart] = useState(false)

    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children)

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true)
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem)
                }
            })

            getDirection()
            getSpeed()
            setStart(true)
        }
    }

    const getDirection = () => {
        if (containerRef.current) {
            if (direction === 'left') {
                containerRef.current.style.setProperty(
                    '--animation-direction',
                    'forwards'
                )
            } else {
                containerRef.current.style.setProperty(
                    '--animation-direction',
                    'reverse'
                )
            }
        }
    }

    const getSpeed = () => {
        if (containerRef.current) {
            if (speed === 'fast') {
                containerRef.current.style.setProperty('--animation-duration', '20s')
            } else if (speed === 'normal') {
                containerRef.current.style.setProperty('--animation-duration', '40s')
            } else {
                containerRef.current.style.setProperty('--animation-duration', '80s')
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            ref={containerRef}
            className={cn(
                'scroller relative z-20 py-8 max-w-8xl overflow-hidden',
                className
            )}
        >
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0d28] to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0d28] to-transparent z-10"></div>

            <ul
                ref={scrollerRef}
                className={cn(
                    'flex min-w-full shrink-0 gap-8 py-4 w-max flex-nowrap',
                    start && 'animate-scroll',
                    pauseOnHover && 'hover:[animation-play-state:paused]'
                )}
            >
                {partners.map((partner, index) => (
                    <li key={`${partner.name}-${index}`} className="flex items-center justify-center">
                        <PartnerLogo name={partner.name} logo={partner.logo} />
                    </li>
                ))}
            </ul>
        </motion.div>
    )
}