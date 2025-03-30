"use client"

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CountDownProps {
  className?: string
  targetDate: Date
  onComplete?: () => void
}

export function CountDown({ className, targetDate, onComplete }: CountDownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now
      
      if (distance <= 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        onComplete?.()
        return
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ]

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {timeUnits.map((unit, index) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center">
            <div className="bg-background text-foreground px-3 py-2 rounded-md text-2xl font-bold min-w-[60px] text-center">
              {String(unit.value).padStart(2, '0')}
            </div>
            <span className="text-xs text-muted-foreground mt-1">{unit.label}</span>
          </div>
          {index < timeUnits.length - 1 && (
            <span className="text-2xl font-bold text-muted-foreground mb-4">:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}