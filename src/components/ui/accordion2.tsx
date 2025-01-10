"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { ChevronRightIcon } from "lucide-react"

const Accordion2 = AccordionPrimitive.Root

const AccordionItem2 = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn(" w-[500px]  rounded-2xl  bg-[#0A0D28] px-6 py-2", className)}
        {...props}
    />
))
AccordionItem2.displayName = "AccordionItem"

const AccordionTrigger2 = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { iconSrc?: string }
>(({ className, children, iconSrc, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex flex-1 items-center justify-between  py-4 text-[18px]  md:text-lg md:text- text-start  font-medium transition-all hover: [&[data-state=open]>div>svg]:rotate-90",
                className
            )}
            {...props}
        >
            <div className="flex gap-4 items-center">
                {iconSrc && <img src={iconSrc} className="h-5" alt="icon" />}
                {children}
            </div>
            <div className="ml-4  ">
                <div className="h-[22px] w-[22px]   rounded-full bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[rgb(252,137,41)] bg-clip-   transition-transform duration-100" />
                <ChevronDownIcon className="bg-[#05071E] ml-[1px] rounded-full absolute p-[2px] -mt-[21px] h-5 w-5" />
            </div>

        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
))
AccordionTrigger2.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent2 = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className="overflow-hidden   n text-[#676B93] mt-2 text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        {...props}
    >
        <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
))
AccordionContent2.displayName = AccordionPrimitive.Content.displayName

export { Accordion2, AccordionItem2, AccordionTrigger2, AccordionContent2 }
