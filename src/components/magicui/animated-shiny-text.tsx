import { cn } from "@/lib/utils";
import { CSSProperties, FC, ReactNode } from "react";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}

const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
}) => {
  return (
    <p
      style={
        {
          "--shimmer-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "mx-auto max-w-md  text-neutral-600/50 dark:text-white -400/50 ",

        // Shimmer effect
        "animate-shimmer rounded-full    bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
        " ",
        // Shimmer gradient
        "bg-gradient-to-r from-transparent    via-black/80 via-50% to-transparent  dark:via-white/50",

        className,
      )}
    >
      <div className="">
        {children}

      </div>
    </p>
  );
};

export default AnimatedShinyText;
