import { cn } from "@/lib/utils";
import TextShimmer from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { AnimatedTooltipPreview } from "../globals/tooltip";
import Link from "next/link";

export async function ShinyText() {
  return (
    <div className="z-10 flex min-h-[15rem]  items-center justify-center">
      <div
        className={cn(
          "group rounded-full border border-black/5 hover:-mt-2 transition-all ease-in  text-base text-white  hover:cursor-pointer  dark:border-white/5 dark:hover:text-white dark:bg-gradient-to-r from-[#A587FF] to-[#5E29FF] dark:hover:bg-blue-800",
        )}
      >
        <Link href='/bookdemo'>

          <div className="inline-flex text-2xl items-center justify-center px-6 py-2 transition ease-out hover:text-neutral-600 hover:duration-900  hover:dark:text-white">
            <span className="flex mt-auto text-xl  font-medium  gap-2">
              <div className="mr-4 ">
                {/* <div className="bg-gradient-to-r from-[#815BF5] to-[#FC8929]    h-10 w-10 rounded-full ">
                <img src="/avatar.png" className="mt-auto h-10 rounded-full " />
              </div>
              <div className="bg-gradient-to-r from-[#815BF5] to-[#FC8929]    h-10 w-10 rounded-full ">
                <img src="/avatar.png" className="mt-auto h-10 rounded-full " />
              </div> */}
                <AnimatedTooltipPreview />
              </div>

              <h1 className="mt-1 text-2xl">
                Book Your Call
              </h1>
            </span>

          </div>
        </Link>
      </div>
    </div>
  );
}
