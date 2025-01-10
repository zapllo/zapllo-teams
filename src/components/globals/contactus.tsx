import Link from "next/link";
// import ShimmerButton from "../magicui/shimmer-button";
import { BookCall } from "../ui/bookcall";
import ShineBorder from "../magicui/shine-border";
import { Button } from "../ui/button";

export default function ContactUs() {
    return (
        <main className="bg- py-16   px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg">
            <div className="max-w-4xl mx-auto">
                <div className="md:flex items-center justify-between mb-8">
                    <Link href='/'>
                        <img alt="Zapllo Technologies" className="h-7 cursor-pointer" src="/logo.png" />
                    </Link>
                    <div className="flex gap-2">

                        <Button className="bg-black hover:border-[#815bf5] border hover:bg-black rounded-full">
                            <Link
                                href="/signup"
                                className="relative m0 text-white font-medium    overflow-hidden rounded-full "
                            >
                                <h1>
                                    Get Started
                                </h1>
                            </Link>

                        </Button>
                        <Link
                            href="/login"
                            className="relative  text-white font-medium  overflow-hidden rounded-full  "
                        >

                            <Button className="rounded-full">
                                Login
                            </Button>
                        </Link>
                    </div>

                </div>
                <div className="space-y-12 mt-12 text-[#676B93]">
                    <section>
                        <h1 className="md:text-3xl text-start  mb-6  text-2xl  text-gray-400 md:mt-0 mt-0 font-bold">Contact Us</h1>

                        <p className="mb-2">
                            For contacting Zapllo Technologies Private Limited, you can reach out through the following methods for support, inquiries, or any assistance you might need regarding their services:
                        </p>

                        <p className="mb-2">
                            Email: support@zapllo.com
                        </p>
                        <p className="mb-2">

                            Address: 166A Dum Dum Park, PO - Bangur Avenue, Kolkata - 700055, India
                        </p>
                      
                    </section>
                </div>
            </div>
        </main>
    )
}