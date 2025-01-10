"use client";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import React, { forwardRef, useRef } from "react";
import { User } from "lucide-react";

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  function CircleComponent({ className, children }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
          className,
        )}
      >
        {children}
      </div>
    );
  }
);

export function AnimatedFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex h-full   items-center justify-center overflow-hidden rounded-3xl   p-10 md:shadow-xl"
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref} className="h-full w-16 ">
            {/* <Icons.googleDrive className=" h-full w-full" /> */}
            <img src="/brands/shopify.webp" />

          </Circle>
          <Circle ref={div2Ref} className="h-full w-16">
            {/* <Icons.discord className="h-full w-full" /> */}
            <img src="/brands/gorgias.png" />
          </Circle>
          <Circle ref={div3Ref} className="h-full w-16">
            <Icons.whatsapp className="h-full w-full" />
          </Circle>
          <Circle ref={div4Ref} className="h-full w-16">
            <Icons.notion className="h-full w-full" />
          </Circle>
          <Circle ref={div5Ref} className="h-full w-16">
            <Icons.slack className="h-full w-full" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className=" bg-[#12173E] f shadow-[0_3px_10px_rgb(0,0,0,0.2)] shadow-black w-16">
            <Icons.zapllo className=" w-full" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <User className="text-black" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
      />
    </div>
  );
}
