import { cn } from "@/lib/utils";
import TextShimmer from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon, ChatBubbleIcon } from "@radix-ui/react-icons";
import { Globe, MessageSquare } from "lucide-react";

export async function VisitWebsite() {
    return (
        <div className="z-10 flex  items-center justify-center">
            <div
                className={cn(
                    "group rounded-full border w-full h-full   md:w-full mt-5 border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:hover:text-white dark:bg-gradient-to-r from-[#A587FF]  to-[#5E29FF] dark:hover:bg-blue-800",
                )}
            >
                <TextShimmer className="inline-flex  w-full text-[18px] items-center justify-center px-4  py-2 transition ease-out hover:text-neutral-600 hover:duration-900  hover:dark:text-white">
                    <span className="flex mt-auto font-medium gap-3 "><Globe className="h-5" /> Visit Website</span>
                    {/* <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" /> */}
                </TextShimmer>
            </div>
        </div>
    );
}
