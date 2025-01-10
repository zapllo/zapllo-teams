"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./infinite-moving-cards";


export const clients = [...new Array(8)].map((client, index) => ({
  href: `/clients/${(index + 1).toString().padStart(2, '0')}.png`,
}))

export function InfiniteMovingCardsDemo() {
  return (
    <div className=" rounded-md flex flex-col antialiased  dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={clients}
        direction="left"
        speed="slow"
      />
    </div>
  );
}

