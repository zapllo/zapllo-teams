import Link from "next/link";
import { Button } from "../ui/button";

export default function TermsAndConditions() {
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
                        <h1 className="md:text-3xl text-start mb-6 text-2xl text-gray-400 font-bold">Terms and Conditions</h1>
                        <p>
                            The terms <b>&quot;We&quot;</b>, <b>&quot;Us&quot;</b>, and <b>&quot;Our&quot;</b> individually and collectively refer to <b>Zapllo Technologies Private Limited</b>, and the terms <b>&quot;Visitor&quot;</b> and <b>&quot;User&quot;</b> refer to users of our website.
                        </p>
                        <p>
                            This page states the Terms and Conditions under which you (Visitor) may visit this website (&quot;Website&quot;). Please read this page carefully. If you do not accept the Terms and Conditions stated here, we request you to exit this site. The business, its business divisions, subsidiaries, associate companies, or subsidiaries to subsidiaries reserve their rights to revise these Terms and Conditions at any time by updating this posting. You should visit this page periodically to re-appraise yourself of the Terms and Conditions, as they are binding on all users of this Website.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 font-bold">Use of Content</h1>
                        <p>
                            All logos, brands, marks, headings, labels, names, signatures, numerals, shapes, or any combinations thereof, appearing on this site, except as otherwise noted, are properties either owned or used under license by the business and/or its associate entities featured on this Website. The use of these properties or any other content on this site, except as provided in these Terms and Conditions or in the site content, is strictly prohibited.
                        </p>
                        <p>
                            You may not sell or modify the content of this Website or reproduce, display, publicly perform, distribute, or otherwise use the materials in any way for any public or commercial purpose without the respective organization&apos;s or entity&apos;s written permission.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 font-bold">Refund Policy</h1>
                        <p>
                            <b>Zapllo Technologies Private Limited</b> is committed to your satisfaction. We provide regular support to help clients grow their business. Once access to the apps or services is provided to the client, fees paid are non-refundable. We focus on the success of our clients by providing handholding support and mentorship sessions to help implement learnings and improve their business.
                        </p>
                        <p>
                            <b>Note:</b> The same applies to deposits for part payments.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 font-bold">Acceptable Website Use</h1>
                        <h2 className="text-lg font-semibold">Security Rules</h2>
                        <p>
                            Visitors are prohibited from violating or attempting to violate the security of the Website, including, without limitation:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Accessing data not intended for the user or logging into an unauthorized account.</li>
                            <li>Attempting to probe, scan, or test the vulnerability of a system or network without proper authorization.</li>
                            <li>Interfering with service to any user, host, or network, including but not limited to, submitting viruses or overloading the Website.</li>
                            <li>Sending unsolicited electronic mail, including promotions and advertising.</li>
                        </ul>
                        <p>
                            Violations of system or network security may result in civil or criminal liability. The business and its associate entities will investigate any such occurrences and cooperate with law enforcement authorities in prosecuting violators.
                        </p>
                        <h2 className="text-lg font-semibold">General Rules</h2>
                        <p>
                            Visitors may not use the Website to transmit, distribute, store, or destroy material:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>That constitutes or encourages conduct that is a criminal offense or violates applicable laws.</li>
                            <li>That infringes the intellectual property rights of others or violates their privacy or publicity rights.</li>
                            <li>That is defamatory, obscene, threatening, or abusive.</li>
                        </ul>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 font-bold">Indemnity</h1>
                        <p>
                            The User unilaterally agrees to indemnify and hold harmless, without objection, the Company, its officers, directors, employees, and agents from and against any claims, actions, demands, liabilities, or damages arising from or resulting from their use of <Link href="https://www.zapllo.com" className="text-blue-500 underline">www.zapllo.com</Link> or their breach of the terms.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 font-bold">Liability</h1>
                        <p>
                            The User agrees that neither the Company nor its affiliates shall be liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising from the use or inability to use the service, or resulting from unauthorized access to or alteration of the User&apos;s transmissions or data. The Company&apos;s total liability shall not exceed the amount paid by the User to the Company.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 font-bold">Disclaimer of Consequential Damages</h1>
                        <p>
                            In no event shall the Company or any associated entities be liable for any damages, including but not limited to, incidental or consequential damages, lost profits, or business interruptions, resulting from the use or inability to use the Website and its materials.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
