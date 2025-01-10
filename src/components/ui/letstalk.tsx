import { cn } from "@/lib/utils";
import TextShimmer from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon, ChatBubbleIcon } from "@radix-ui/react-icons";
import { MessageSquare } from "lucide-react";

export async function LetsTalk() {
    return (
        <div className="z-10 flex hover:-mt-2 rounded-full dark:bg-gradient-to-r from-[#A587FF]  to-[#5E29FF] transition-all ease-in  items-center justify-center">
            <div
                className={cn(
                    "group rounded-full   border border-black/5 text-base text-white transition-all ease-in hover:cursor-pointer  dark:border-white/5 ",
                )}
            >
                <TextShimmer className="inline-flex text-[18px] items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-900  hover:dark:text-white">
                    <span className="flex mt-auto font-medium gap-3"><img src="chat.gif" className="h-5" /> Lets&apos; Talk</span>
                    {/* <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" /> */}
                </TextShimmer>
            </div>
        </div>
    );
}
