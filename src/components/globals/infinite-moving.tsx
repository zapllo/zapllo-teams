'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export const InfiniteMoving = ({
  direction = 'left',
  speed = 'fast',
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
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929]  max-w-8xl overflow- space-x-6  ',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          ' flex min-w-full shrink-0 space-x-4 -10 py-4 w-max flex-nowrap',
          start && 'animate-scroll ',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >

        {/* <img

            src='/readers.png'
            alt='readers'
            className=" relative w-screen   "
          /> */}
        <div className=' text-3xl font-bold flex gap-2 space-x-6 uppercase'>
          <h1>💰 Reduction in Operational Costs</h1>
          <h1>🚀 Increase in Revenue</h1>
          <h1>👨🏻‍💻 Steamlining Workflow</h1>
          <h1>⚙️ Reliable Automation 24X7</h1>
          <h1>🧠 Generative AI</h1>
          <h1>📊 10X Productivity</h1>
          {/* <img src='deep.png' /> */}
        </div>
      </ul>
    </div>
  )
}
