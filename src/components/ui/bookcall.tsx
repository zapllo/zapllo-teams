import { cn } from "@/lib/utils";
import TextShimmer from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export  function BookCall() {
  return (
    <div className="z-10 flex hover:-mt-2 rounded-full dark:bg-gradient-to-r from-[#A587FF]  to-[#5E29FF] transition-all ease-in  items-center justify-center">
      <div
        className={cn(
          "group rounded-full  border border-black/5  text-base text-white transition-all ease-in hover:cursor-pointer  dark:border-white/5 dark:hover:text-white ",
        )}
      >
        <TextShimmer className="inline-flex  text-[18px] items-center justify-center px-6 py-2 transition ease-out hover:text-neutral-600 hover:duration-900  hover:dark:text-white">
          <span className="flex mt-auto  gap-2"><img src="/call.gif" className="mt-auto h-5 animate-bounce" /> Book Your Call </span>
          {/* <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" /> */}
        </TextShimmer>
      </div>
    </div>
  );
}
