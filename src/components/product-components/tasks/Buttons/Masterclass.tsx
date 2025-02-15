import { cn } from "@/lib/utils";
import TextShimmer from "@/components/magicui/animated-shiny-text";
import { ArrowRightIcon } from "@radix-ui/react-icons";
// import { AnimatedTooltipPreview } from "../globals/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function MasterClass() {
  return (
    <div className="z-10 flex min-h-[15rem]  items-center justify-center">

      <Link href='https://masterclass.zapllo.com/workshop/'>
        <Button className="mt-8 mb-4 relative py-7 w-72 text-xl font-semibold bg-primary text-white rounded-full shadow-lg flex items-center ">
          <p className="-ml-8">   Join Live Masterclass</p>
          <img src="/icons/rocket.png" className="h-20 absolute right-0" />
        </Button>
      </Link>

    </div>
  );
}
