import Link from "next/link";
import { Button } from "../ui/button";

export default function CancellationPolicy() {
    return (
        <main className="bg- py-16 px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg">
            <div className="max-w-4xl mx-auto">
                <div className="md:flex items-center justify-between mb-8">
                    <Link href="/">
                        <img alt="Zapllo Technologies" className="h-7 cursor-pointer" src="/logo.png" />
                    </Link>
                    <div className="flex mt-12 md:mt-0 gap-2">
                        <Button className="bg-black hover:border-[#815bf5] border hover:bg-black rounded-full">
                            <Link
                                href="/signup"
                                className="relative m0 text-white font-medium overflow-hidden rounded-full"
                            >
                                <h1>Get Started</h1>
                            </Link>
                        </Button>
                        <Link
                            href="/login"
                            className="relative text-white font-medium overflow-hidden rounded-full"
                        >
                            <Button className="rounded-full">Login</Button>
                        </Link>
                    </div>
                </div>
                <div className="space-y-12 mt-12 text-[#676B93]">
                    <section className="space-y-4">
                        <h1 className="md:text-3xl text-start mb-6 text-2xl text-gray-400 font-bold">Cancellation Policy</h1>
                        <p>
                            At <b>Zapllo Technologies Private Limited</b>, we understand that circumstances may change. This Cancellation Policy outlines our procedures for cancellations and refunds.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 font-bold">Cancellation Timeframe</h1>
                        <p>
                            All cancellations must be made within 24 hours of placing an order or booking a service. Cancellations made within this timeframe will be eligible for a full refund of the amount paid.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 font-bold">Cancellation Process</h1>
                        <p>
                            To cancel your order or service, please contact our customer support team through the following methods:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Email: support@zapllo.com</li>
                            <li>Phone: +91 89107 48670</li>
                        </ul>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 font-bold">Late Cancellations</h1>
                        <p>
                            Cancellations made after the 24-hour window may be subject to partial refunds or cancellation fees as follows:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>24-48 hours after order placement: 75% refund</li>
                            <li>48-72 hours after order placement: 50% refund</li>
                            <li>Beyond 72 hours: No refund available</li>
                        </ul>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 font-bold">Exceptions</h1>
                        <p>
                            We understand that exceptional circumstances may arise. The following situations may qualify for a full refund regardless of the cancellation timeframe:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Service unavailability due to technical issues on our end</li>
                            <li>Natural disasters affecting your ability to use our services</li>
                        </ul>
                        <p>
                            Supporting documentation may be required to process exception-based refunds.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 font-bold">Refund Processing</h1>
                        <p>
                            All approved refunds will be processed within 7-10 business days and will be issued to the original payment method used for the transaction.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 font-bold">Policy Updates</h1>
                        <p>
                            This cancellation policy may be updated from time to time. Any changes will be posted on this page with a revised effective date.
                        </p>
                        <p>
                            For any questions regarding our cancellation policy, please contact our support team at <a href="mailto:support@zapllo.com" className="text-blue-500 underline">support@zapllo.com</a>.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
