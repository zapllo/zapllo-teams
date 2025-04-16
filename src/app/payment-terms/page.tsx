import ShineBorder from "@/components/magicui/shine-border";
import { BookCall } from "@/components/ui/bookcall";
import Link from "next/link";

export default function PaymentTerms() {
    return (
        <main className="bg- py-16 px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg">
            <div className="max-w-4xl mx-auto">
                <div className="md:flex items-center justify-between mb-8">
                    <Link href='/'>
                        <img alt="Zapllo Technologies" className="h-7 cursor-pointer" src="/logo.png" />
                    </Link>
                    <div className="md:flex justify-start mt-6 md:mt-0 gap-2">
                        <div className="scale-90 justify-start flex">
                            <BookCall />
                        </div>
                        <Link
                            href="/dashboard"
                            className="relative inline-fl ex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                        >
                            <ShineBorder borderRadius={50}
                                className="text-center text-xl font-bold capitalize"
                                color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                            >
                                <h1>
                                    Get Started
                                </h1>
                            </ShineBorder>
                        </Link>
                    </div>
                </div>

                <div className="space-y-12 mt-12 text-[#676B93]">
                    <section>
                        <h1 className="md:text-3xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Payment Terms</h1>
                        <h2 className="text-lg font-medium mb-2">
                            Zapllo Technologies Private Limited utilizes Razorpay for secure payment processing. By using our services, you agree to the following payment terms and conditions.
                        </h2>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">Products and Pricing</h2>
                        <div className="space-y-6">
                            <div className=" p-4 rounded-lg">
                                <h3 className="text-lg font-bold mb-2">Zapllo Tasks</h3>
                                <p className="mb-2">Standard Price: ₹4,000 per user/year</p>
                                <p className="text-sm">Task delegation, Zapllo Intranet, AI Technology, WhatsApp Integration, Voice Notes</p>
                            </div>

                            <div className="  p-4 rounded-lg">
                                <h3 className="text-lg font-bold mb-2">Zapllo Payroll</h3>
                                <p className="mb-2">Standard Price: ₹1,999 per user/year</p>
                                <p className="text-sm">Attendance Tracking, Leave Management, Payslip & Salary Processing, WhatsApp & Email Integration</p>
                            </div>

                            <div className=" p-4 rounded-lg">
                                <h3 className="text-lg font-bold mb-2">Zapllo CRM</h3>
                                <p className="mb-2">Standard Price: ₹5,999 per user/year</p>
                                <p className="text-sm">Customer Management, Lead Management, WhatsApp Integration, Sales Pipeline, Customer Insights</p>
                            </div>
                        </div>
                    </section>

                    <section className="">
                        <h2 className="text-xl font-bold mb-4">Payment Process:</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="">
                                <h3 className="text-lg font-bold mb-2">Payment Gateway:</h3>
                                <p>All payments are securely processed through Razorpay, a certified payment gateway that complies with PCI DSS standards.</p>
                            </div>
                            <div className="">
                                <h3 className="text-lg font-bold mb-2">Payment Methods:</h3>
                                <p>We accept credit cards, debit cards, UPI, net banking, and wallet payments as supported by Razorpay.</p>
                            </div>
                            <div className="">
                                <h3 className="text-lg font-bold mb-2">Billing Cycle:</h3>
                                <p>All subscriptions are billed annually. The subscription period begins from the date of successful payment.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">Transaction Security:</h2>
                        <p className="mb-4">
                            All payment information is encrypted and securely handled by Razorpay. Zapllo Technologies does not store your credit card or other payment details.
                        </p>
                        <p>
                            Your payment information is protected using industry-standard SSL (Secure Socket Layer) technology. Razorpay is fully compliant with PCI DSS 3.2.1 standards.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">Taxes and Fees:</h2>
                        <p>
                            All prices listed are exclusive of applicable taxes. GST and any other government-imposed taxes will be added to the final invoice as per current tax regulations in India.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">Subscription Terms:</h2>
                        <p className="mb-4">
                            All subscriptions are for a period of one year from the date of purchase. After the initial subscription period, you may renew at the then-current rate.
                        </p>
                        <p>
                            Special offer prices are valid only for the period specified during the promotion. Standard rates will apply for renewals unless otherwise stated.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">Auto-Renewal:</h2>
                        <p>
                            Subscriptions do not auto-renew by default. You will receive renewal notifications before your subscription expires. You can opt-in for auto-renewal from your account settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">Refund Policy:</h2>
                        <p>
                            Please refer to our <Link href="/refundpolicy" className="text-purple-600 underline">Refund Policy</Link> for information regarding refunds. All refund requests must be submitted within 7 days of purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">Invoice and Receipt:</h2>
                        <p>
                            An electronic invoice will be generated and sent to your registered email address upon successful payment. This invoice serves as your official payment receipt for accounting purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">Changes to Pricing:</h2>
                        <p>
                            Zapllo Technologies reserves the right to modify pricing at any time. Any changes in pricing will not affect existing subscriptions until their renewal date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-2">Questions or Concerns:</h2>
                        <p>
                            For any payment-related inquiries or further assistance, please contact our support team at payments@zapllo.com or call us at +91 89107 48670.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
