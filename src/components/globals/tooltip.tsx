"use client";
import React from "react";
import { AnimatedTooltip } from "../ui/animated-tooltip";
const people = [
  {
    id: 1,
    name: "Shubhodeep",
    designation: "CEO",
    image:
      "/Deep3.png",
  },
  {
    id: 2,
    name: "Ranit",
    designation: "Sales",
    image:
      "/Satish.png",
  },
];

export function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center  w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}
