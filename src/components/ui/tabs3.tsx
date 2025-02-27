"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs3 = TabsPrimitive.Root

const TabsList3 = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 p-1 text-black dark:text-gray-300",
      className
    )}
    {...props}
  />
))
TabsList3.displayName = TabsPrimitive.List.displayName

const TabsTrigger3 = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      // Default background and text for light mode with dark mode overrides on hover
      "bg-transparent text-black dark:text-gray-300  dark:hover:bg-gray-700",
      // Active state styling (assuming global classes for bg-primary/text-foreground)
      "data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger3.displayName = TabsPrimitive.Trigger.displayName

const TabsContent3 = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "text-black dark:text-gray-300",
      className
    )}
    {...props}
  />
))
TabsContent3.displayName = TabsPrimitive.Content.displayName

export { Tabs3, TabsList3, TabsTrigger3, TabsContent3 }
