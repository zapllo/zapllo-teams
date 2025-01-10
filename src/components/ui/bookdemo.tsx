import { cn } from "@/lib/utils";
import TextShimmer from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { AnimatedTooltip } from "./animated-tooltip";
import { AnimatedTooltipPreview } from "../globals/tooltip";

export async function BookCall2() {
    return (
        <div className="z-10 flex dark:bg-gradient-to-r from-[#A587FF]  to-[#5E29FF] items-center justify-center rounded-full">
            <div
                className={cn(
                    "group rounded-full border border-black/5 text-base text-white transition-all ease-in hover:cursor-pointer  dark:border-white/5 dark:hover:text-white ",
                )}
            >
                <TextShimmer className="inline-flex text-2xl items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-900  hover:dark:text-white">
                    <span className="flex mt-auto text-[18px] font-medium  gap-2">
                        <div className="mr-4  ">
                            {/* <div className="bg-gradient-to-r from-[#815BF5] to-[#FC8929]    h-10 w-10 rounded-full ">
                <img src="/avatar.png" className="mt-auto h-10 rounded-full " />
              </div>
              <div className="bg-gradient-to-r from-[#815BF5] to-[#FC8929]    h-10 w-10 rounded-full ">
                <img src="/avatar.png" className="mt-auto h-10 rounded-full " />
              </div> */}
                            <AnimatedTooltipPreview />
                        </div>
                        <h1 className=" mt-1">
                        Book Your Call
                            </h1></span>

                </TextShimmer>
            </div>
        </div>
    );
}
