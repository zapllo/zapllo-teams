"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from "class-variance-authority";

const loaderVariants = cva(
  "relative flex items-center justify-center",
  {
    variants: {
      variant: {
        spinner: "",
        minimal: "",
        pulse: "",
        dots: "",
      },
      size: {
        xs: "w-4 h-4",
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-12 h-12",
      },
      color: {
        primary: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted-foreground",
        white: "text-white",
      }
    },
    defaultVariants: {
      variant: "spinner",
      size: "md",
      color: "primary",
    },
  }
);

export interface LoaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
  VariantProps<typeof loaderVariants> {
  label?: string;
  fullPage?: boolean;
}

const Loader = ({
  className,
  variant,
  size,
  color,
  label,
  fullPage = false,
  ...props
}: LoaderProps) => {
  const LoaderContent = () => {
    switch (variant) {
      case "minimal":
        // A clean, thin border spinner
        return (
          <div className="w-full h-full rounded-full border-2 border-background/30 relative">
            <div className="absolute inset-0 rounded-full border-2 border-t-current border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
        );

      case "pulse":
        // A subtle pulsing circle
        return (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: 'currentColor' }}></div>
            <div className="absolute inset-0 m-auto rounded-full w-2/3 h-2/3" style={{ backgroundColor: 'currentColor' }}></div>
          </div>
        );

      case "dots":
        // Three clean dots with staggered animation
        return (
          <div className="flex space-x-1.5 items-center">
            <div className="w-2 h-2 rounded-full animate-[bounce_1.4s_ease-in-out_-0.32s_infinite]" style={{ backgroundColor: 'currentColor' }}></div>
            <div className="w-2 h-2 rounded-full animate-[bounce_1.4s_ease-in-out_-0.16s_infinite]" style={{ backgroundColor: 'currentColor' }}></div>
            <div className="w-2 h-2 rounded-full animate-[bounce_1.4s_ease-in-out_0s_infinite]" style={{ backgroundColor: 'currentColor' }}></div>
          </div>
        );

      case "spinner":
      default:
        // Default modern spinner
        return (
          <svg className="animate-spin w-full h-full" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V2.5C5.8 2.5 2.5 5.8 2.5 12H4zm2 5.3A7.9 7.9 0 014 12H2.5c0 3.4 1.3 6.5 3.5 8.8l2-2.5z"
            />
          </svg>
        );
    }
  };

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
        <div className={cn(loaderVariants({ variant, size, color }), className)} {...props}>
          <LoaderContent />
        </div>
        {label && (
          <p className="mt-4 text-sm font-medium text-muted-foreground">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={cn(loaderVariants({ variant, size, color }), className)} {...props}>
        <LoaderContent />
      </div>
      {label && (
        <p className="mt-2 text-xs font-medium text-muted-foreground">{label}</p>
      )}
    </div>
  );
};

export { Loader };
export default Loader;
