import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  return (
    <div className="md:h-[30rem] h-[23rem]  md:flex md:justify-between  relative md:space-x-36 rounded-md p-10">
      <div className="relative flex flex-col items-start px-4">
        <div className="sticky top-10 w-full">
      
            <div className="my-10">
            <h1 className='bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent text- font-bold text-3xl'>Our Top Picks</h1>

              <motion.h2
               
                className="text-3xl mt-4 font-bold w-full text-slate-100"
              >
                
                Automation Made Simple at zapllo.com

              </motion.h2>
              <motion.p
               
                className=" text- max-w-[800px] mt-4 text-sm"
              >
                🔓 Unlock your business potential with our expert team of engineers guiding you to the perfect tech tools tailored just for you.
              </motion.p>
            </div>
        
        </div>
      </div>
      <motion.div
        className={cn(
          "h-full w-[100%] ml-4 overflow-y-auto scrollbar-hide",
          contentClassName
        )}
        ref={ref}
      >
        {content.map((item, index) => (
          <motion.div
            key={item.title + index}
            className="my-10"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: activeCard === index ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          >
            {item.content ?? null}
          </motion.div>
        ))}
        <div className="h-40 " />
      </motion.div>
    </div>
  );
};
