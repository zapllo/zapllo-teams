'use client'

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value: number;
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    // Clamp the value between 0 and 100
    const clampedValue = Math.max(0, Math.min(value, 100));

    return (
      <div className={cn("relative w-full", className)}>
        <h1 className="text-xs text-right mb-1">{clampedValue}%</h1>
        <ProgressPrimitive.Root
          ref={ref}
          className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20"
          {...props}
        >
          <ProgressPrimitive.Indicator
            className="h-full w-full flex-1  bg-gradient-to-l from-[#815BF5] via-[#FC8929] to-[#FC8929] z-[0]  transition-all"
            style={{ transform: `translateX(-${100 - clampedValue}%)` }}
          />
        </ProgressPrimitive.Root>
      </div>
    );
  }
);

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
