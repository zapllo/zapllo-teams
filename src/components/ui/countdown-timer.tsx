import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  targetDate: number | Date;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timeUnits = [
    { label: 'Days', value: timeLeft.days || 0 },
    { label: 'Hours', value: timeLeft.hours || 0 },
    { label: 'Minutes', value: timeLeft.minutes || 0 },
    { label: 'Seconds', value: timeLeft.seconds || 0 },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex flex-col items-center">
          <motion.div
            key={`${unit.label}-${unit.value}`}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#0A0D28] w-full py-2 px-1 rounded-md border border-[#815BF5]/30 text-center"
          >
            <span className="text-xl md:text-2xl font-mono font-bold">{unit.value.toString().padStart(2, '0')}</span>
          </motion.div>
          <span className="text-xs text-muted-foreground mt-1">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}