import Link from "next/link";
import { Button } from "../ui/button";

export default function PrivacyPolicy() {
    return (
        <main className="bg- py-16 px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg">
            <div className="max-w-4xl mx-auto">
                <div className="md:flex items-center justify-between mb-8">
                    <Link href="/">
                        <img alt="Zapllo Technologies" className="h-7 cursor-pointer" src="/logo.png" />
                    </Link>
                    <div className="flex gap-2">
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
                        <h1 className="md:text-3xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Privacy Policy</h1>
                        <p>Last Modified: 19/01/2024</p>
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Introduction</h1>
                        <p>
                            Welcome to the privacy policy of <b>Zapllo Technologies Private Limited</b> (&quot;Zapllo&quot;), governing your use of the website{" "}
                            <Link href="https://www.zapllo.com" className="text-blue-500 underline">https://www.zapllo.com</Link> (&quot;Website&quot;). Safeguarding your privacy is paramount to us, and this policy outlines our commitment to protecting the information you entrust to us.
                        </p>
                        <p>
                            This document constitutes a legally binding agreement between you and Zapllo, established under the provisions of the Information Technology Act, 2000, and its associated regulations. It meticulously details how we collect, utilize, safeguard, and disclose the information gathered from visitors to our Website.
                        </p>
                        <p>
                            Your access to and utilization of our Website signifies your unequivocal acceptance of the terms laid out in this privacy policy. Should you disagree with any aspect of these terms, we kindly request that you refrain from using our Website.
                        </p>
                        <p>
                            We urge you to thoroughly review this policy to fully comprehend our practices regarding your information. Should you have any inquiries or require clarifications regarding our privacy practices, please do not hesitate to contact us at{" "}
                            <a href="mailto:support@zapllo.com" className="text-blue-500 underline">support@zapllo.com</a> or call us at +91-9836630366. Your privacy and trust are of utmost importance to us.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Information We Collect</h1>

                        We collect various types of information on our Website, particularly when users register for certain services. This may include:
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Personally identifiable information such as your name, email address, gender, age, postal code, credit card or debit card details, medical records, sexual orientation, biometric information, and passwords.
                            </li>
                        </ul>
                        <li>
                            Information about your occupation, interests, and other related details voluntarily provided by you.
                        </li>

                        <li>
                            This information enables us to enhance our services, tailor user experiences, and develop new offerings.
                        </li>
                        <p>

                            All required information is necessary for specific services and may be used to maintain, protect, and improve our services, including advertising services, as well as for innovation in new services. Information is not considered sensitive if it is publicly accessible or disclosed under applicable laws such as the Right to Information Act, 2005.</p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Sources of Information Collection</h1>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <b>User Profile Creation:</b> When users register, we collect fields like name, email, phone number, industry, and number of employees.
                            </li>
                            <li>
                                <b>Task Delegation:</b> Users input tasks and activities assigned to others, which are stored in our software.
                            </li>
                            <li>
                                <b>Leave & Attendance:</b> Users upload three photos for attendance purposes, and when marking attendance, geo-location data is captured.
                            </li>
                            <li>
                                <b>CRM:</b> Users input customer inquiries, customer data, and product information into our Customer Relationship Management (CRM) system.
                            </li>
                            <li>
                                <b>Data Storage:</b> All data is securely stored on our cloud servers with full protection measures in place.
                            </li>
                            <li>
                                <b>Business Dashboards/Reports:</b> Customers can access various business dashboards and reports based on the data they enter.
                            </li>
                            <li>
                                <b>Data Sharing:</b> We do not share any data with external third parties, vendors, or customers.
                            </li>
                            <li>
                                <b>User Activities:</b> User activities such as task delegation, leave applications, approval processes, attendance marking, and link management may involve access to features like audio recording for task delegation and camera access for attendance purposes.
                            </li>
                            <li>
                                <b>External Data Usage:</b> Data created within our software is not shared externally with any third parties, vendors, or customers.
                            </li>
                            <li>
                                <b>Secure Data Hosting:</b> Data is hosted on secure servers with robust protective measures to ensure confidentiality and integrity.
                            </li>
                        </ul>
                        <p>
                            It does not apply to information collected by:


                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Us offline or through any other means, including on any other Website operated by Company or any third party (including our affiliates and subsidiaries);
                            </li>

                            <li>
                                Any third party (including our affiliates and subsidiaries), including through any application or content (including advertising) that may link to or be accessible from or through the Website.
                            </li>
                        </ul>
                        <p>
                            Please read this policy carefully to understand our policies and practices regarding your information and how we will treat it. If you do not agree with our policies and practices, your choice is not to use our Website. By accessing or using this Website, you agree to this privacy policy. This policy may change from time to time (see Changes to Our Privacy Policy). Your continued use of this Website after we make changes is deemed to be acceptance of those changes, so please check the policy periodically for updates.


                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Information We Collect About You and How We Collect It  </h1>
                        <p>
                            In our operation of the website and provision of services, we gather various categories of information from users, which include:

                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <b> Personally Identifiable Information:</b> This may include your name, postal address, email address, telephone number, and any other identifier through which you can be contacted online or offline.
                            </li>
                            <li>
                                <b> Non-Identifying Information:</b> Details that are about you but do not individually identify you, such as usage patterns or demographic information.
                            </li>
                            <li>
                                <b> Technical Information:</b> This encompasses data about your internet connection, the devices you use to access our Website, and specifics regarding your usage of the Website.
                                We collect this information through the following means:
                                <ul className="list-disc pl-6 space-y-2 mt-2">

                                    <li>
                                        <b> Direct User Input:</b> Information provided directly by you when you fill out forms on our Website, register for services, subscribe to newsletters, participate in contests or promotions, or engage in transactions.
                                    </li>
                                    <li>
                                        <b> Automated Collection:</b> Information gathered automatically as you navigate through our Website, including usage statistics, IP addresses, and data collected via cookies and other tracking technologies.
                                    </li>
                                    <li>
                                        <b>Third-Party Sources:</b> Information obtained from our business partners or other third parties, if applicable.

                                    </li>
                                    <li>
                                        <b> User Provided Information:</b> Specifically, the information we collect through our Website includes:
                                        <ul className="list-disc pl-6 space-y-2 mt-2">
                                            <li>
                                                Details submitted via online forms, whether for registration, subscription, posting content, or requesting additional services.
                                            </li>
                                            <li>
                                                Records and copies of correspondence, including email communications.
                                            </li>
                                            <li>
                                                Responses to surveys conducted for research purposes.
                                            </li>
                                            <li>
                                                Transactional information, including details of purchases made through our Website and associated financial data required for order processing.
                                            </li>
                                            <li>
                                                Search queries conducted on our Website.
                                            </li>
                                            <li>
                                                <b>User Contributions:</b> You may also choose to provide information for publication on public areas of our Website or for transmission to other users or third parties (collectively, &quot;User Contributions&quot;). While we offer certain privacy settings and access controls for such information through account profiles, we cannot guarantee absolute security. We advise exercising caution when sharing User Contributions, as we cannot control how other users or unauthorized parties may access or use this information.
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <p>
                            This policy governs the comprehensive collection, use, and protection of information on our Website. Your use of our services signifies your consent to the practices outlined herein. For inquiries regarding our privacy practices or management of your personal data.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Information Collection Through User Input                        </h1>
                        <p>
                            In the course of our operations and the provision of services via website, users furnish diverse information by completing forms and inputting data into our secure software platform. This platform is hosted on a meticulously secured cloud server infrastructure, ensuring the confidentiality and integrity of the collected data.
                        </p>
                        <p>
                            We place utmost importance on the security of all data collected and stored within our cloud servers, underpinned by robust measures to safeguard against unauthorized access and maintain data integrity.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Information We Collect Through Automatic Data Collection Technologies  </h1>
                        <p>
                            As you navigate through and interact with our website, we may use automatic data collection technologies to collect certain information about your equipment, browsing actions, and patterns, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                Logs, and other communication data, along with the resources accessed and utilized on the Website.
                            </li>
                            <li>
                                <b>Device and Connection Information:</b> Details about your computer and internet connection, encompassing your IP address, operating system, and browser type.
                            </li>

                        </ul>
                        <p>
                            Additionally, we may employ these technologies to track your online activities across time and across third-party websites or other online services (behavioral tracking). The information collected automatically may be used to enhance our understanding and improve the functionality of our website. This includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <b>Statistical Data:</b> Analysis of website usage patterns to estimate audience size and usage trends.
                            </li>
                            <li>
                                <b>Personalization:</b> Storing preferences to tailor our Website to individual interests.
                            </li>
                            <li>
                                <b>Enhanced User Experience:</b> Facilitating quicker searches and recognizing you upon return visits.
                            </li>

                        </ul>
                        <p>
                            The technologies utilized for automatic data collection may involve:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <b>Cookies:</b> Small files stored on your computer&apos;s hard drive by your web browser. You can configure your browser to reject cookies; however, this may restrict access to certain parts of our website unless otherwise adjusted. By default, our system issues cookies when you direct your browser to our Website.
                            </li>
                            <li>
                                <b>Integration with Google Analytics:</b> We have integrated Google Analytics to track and analyze user activity on our Website. This enables us to gather insights into website traffic, user interactions, and overall engagement to improve our services continually.
                                We are committed to protecting the privacy and security of your information collected through these technologies.
                            </li>
                        </ul>
                        <p>
                            We do not collect personal information automatically, but we may tie this information to personal information about you that we collect from other sources or you provide to us.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Third-Party Use of Cookies [and Other Tracking Technologies]
                        </h1>
                        <p>
                            Some content or applications, including advertisements, on the Website are served by third-parties, including advertisers, ad networks and servers, content providers, and application providers. These third parties may use cookies [alone or in conjunction with web beacons or other tracking technologies]to collect information about you when you use our Website. The information they collect may be associated with your personal information or they may collect information, including personal information, about your online activities over time and across different Websites and other online services. They may use this information to provide you with interest-based (behavioral) advertising or other targeted content.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">How We Use Your Information
                        </h1>
                        <p>
                            We use information that we collect about you or that you provide to us, including any personal information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>   To present our Website and its contents to you.</li>
                            <li>
                                To provide you with information, products, or services that you request from us.
                            </li>
                            <li>
                                To fulfill any other purpose for which you provide it.
                            </li>
                            <li>
                                To provide you with notices about your account/subscription, including expiration and renewal notices.
                            </li>
                            <li>
                                To carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection.
                            </li>
                            <li>
                                To notify you about changes to our Website or any products or services we offer or provide though it.
                            </li>
                            <li>
                                To allow you to participate in interactive features on our Website.
                            </li>
                            <li>
                                In any other way we may describe when you provide the information.
                            </li>
                            <li>
                                For any other purpose with your consent.
                            </li>
                        </ul>
                        <p>
                            We may also use your information to contact you about [our own and third-parties&apos;] goods and services that may be of interest to you. If you do not want us to use your information in this way, please [check the relevant box located on the form on which we collect your data (the [order form/registration form])/adjust your user preferences in your account profile.
                        </p>
                        <p>
                            We may use the information we have collected from you to enable us to display advertisements to our advertisers&apos; target audiences. Even though we do not disclose your personal information for these purposes without your consent, if you click on or otherwise interact with an advertisement, the advertiser may assume that you meet its target criteria.
                        </p>
                    </section>


                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Disclosure of Your Information
                        </h1>
                        <p>
                            We may disclose aggregated information about our users and information that does not identify any individual without restriction.

                            We may disclose personal information that we collect, or you provide as described in this privacy policy:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                To our subsidiaries and affiliates.
                            </li>
                            <li>
                                To contractors, service providers, and other third parties we use to support our business.
                            </li>
                            <li>
                                To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Zapllo&apos;s assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which personal information held by Zapllo about our Website users is among the assets transferred.
                            </li>
                            <li>
                                To third parties to market their products or services to you if you have consented to/not opted out of these disclosures. We contractually require these third parties to keep personal information confidential and use it only for the purposes for which we disclose it to them.
                            </li>
                            <li>
                                To fulfill the purpose for which you provide it. For example, if you give us an email address to use the &quot;email a friend&quot; feature of our Website, we will transmit the contents of that email and your email address to the recipients.
                            </li>
                            <li>
                                For any other purpose disclosed by us when you provide the information.
                            </li>


                        </ul>
                        <p>
                            With your consent We may also disclose your personal information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                To comply with any court order, law, or legal process, including to respond to any government or regulatory request.
                            </li>
                            <li>
                                To enforce or apply our terms of use Terms of Use and other agreements, including for billing and collection purposes.
                            </li>
                            <li>
                                If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of Zapllo, our customers, or others. This includes exchanging information with other companies and organizations for the purposes of fraud protection and credit risk reduction.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Choices About How We Use and Disclose Your Information
                        </h1>
                        <p>
                            We strive to provide you with control over the personal information you provide to us. We offer the following mechanisms to manage your information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <b> Tracking Technologies and Advertising:</b>
                                You can adjust your browser settings to refuse all or some browser cookies, or to alert you when cookies are being sent. Please note that disabling or refusing cookies may result in some parts of our site being inaccessible or not functioning properly.
                            </li>
                            <li>
                                <b> Disclosure of Your Information for Third-Party Advertising:</b>
                                If you prefer not to have your personal information shared with unaffiliated or non-agent third parties for promotional purposes, you can opt-out by adjusting your preferences on the form where your data is collected or by logging into your account profile on our Website and adjusting settings.
                            </li>
                            <li>
                                <b>   Promotional Offers from the Company:</b>
                                If you do not wish to receive promotional communications from us regarding our own or third parties&apos; products or services, you can opt-out by adjusting your preferences on the form where your data is collected or by logging into your account profile on our Website and adjusting settings. If you have received a promotional email from us, you can also opt-out by replying to the email and requesting to be omitted from future distributions.
                            </li>
                            <li>
                                <b>  Targeted Advertising:</b>
                                If you prefer not to have information collected or used by us for delivering advertisements based on our advertisers&apos; target-audience preferences, you can opt-out. Please ensure your browser is set to accept all browser cookies for this opt-out to function effectively.
                            </li>
                        </ul>
                        <p>
                            Please note that while we provide these opt-out mechanisms, we do not control third parties&apos; collection or use of your information for interest-based advertising. However, these third parties may offer their own opt-out mechanisms.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">       Accessing and Correcting Your Information
                        </h1>
                        <p>
                            You can review and change your personal information by logging into the Website and visiting your account profile page.
                        </p>
                        <p>
                            You may also send us an email at support@zapllo.com to request access to, correct, or delete any personal information that you have provided to us. We cannot delete your personal information except by also deleting your user account. We may not accommodate a request to change information if we believe the change would violate any law or legal requirement or cause the information to be incorrect.
                        </p>
                        <p>
                            If you delete your User Contributions from the Website, copies of your User Contributions may remain viewable in cached and archived pages or might have been copied or stored by other Website users. Proper access and use of information provided on the Website, including User Contributions, is governed by our terms of use.
                        </p>
                        <p>
                            For further assistance, please contact us at support@zapllo.com.
                        </p>
                    </section>


                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Your State Privacy Rights
                        </h1>
                        <p>
                            As an Indian consumer, you are entitled to certain privacy rights under applicable laws. These rights are enshrined in the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, under the Information Technology Act, 2000. These rights include:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <b>Access and Correction:</b> You have the right to access your personal information held by us and to request corrections if it is inaccurate or incomplete.
                            </li>
                            <li><b>Data Portability:</b> You may request a copy of your personal information in a structured, commonly used, and machine-readable format.</li>
                            <li><b>Withdraw Consent:
                            </b>
                                You have the right to withdraw consent to the processing of your personal information where we rely on your consent as the legal basis.
                            </li>
                            <li><b> Objection to Processing:
                            </b>
                                You can object to the processing of your personal information in certain circumstances, including for direct marketing purposes.
                            </li>



                            <li><b> Restriction of Processing:
                            </b>
                                You have the right to request that we restrict the processing of your personal information in certain situations, such as when you contest the accuracy of your personal information.
                            </li>

                            <li><b>  Erasure:
                            </b>
                                You may request that we delete your personal information, subject to applicable legal requirements
                            </li>



                        </ul>
                    </section>


                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Children&apos;s Privacy
                        </h1>
                        <p>
                            Safeguarding children&apos;s online privacy is paramount to us, and we encourage parents to educate their children about safe information practices. Our services are not intended for children under the age defined by Indian regulations (typically under 18 years). We adhere to the provisions outlined in the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, which stipulate guidelines for online platforms regarding the collection and handling of personal information of minors. We do not knowingly collect personal information from children under this age. If we discover that we have inadvertently collected such information, we promptly delete it. Parents concerned about their child&apos;s information.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Data Security
                        </h1>

                        <p>
                            We have implemented rigorous measures to secure your personal information from accidental loss and unauthorized access, use, alteration, and disclosure. All data provided to us is stored on secure servers protected by firewalls, and any payment transactions and sensitive information are encrypted to maintain confidentiality and integrity.
                        </p>
                        <p>
                            The security of your information also relies on your actions. If provided with a password to access specific parts of our website, it is your responsibility to keep it confidential and not share it with others. Exercise caution when sharing information in public areas of the Website, as such disclosures may be viewed by other users.
                        </p>
                        <p>
                            While we strive to protect your personal information, please be aware that transmitting data over the internet is not entirely secure. Therefore, any transmission of personal information is done at your own risk. We cannot guarantee the security of information transmitted to our Website and are not liable for breaches of privacy settings or security measures on the Website.
                        </p>
                        <p>
                            Our data security practices comply with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, under the Information Technology Act, 2000, which mandates specific requirements for protecting sensitive personal data or information collected and processed in India.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Data Security
                        </h1>
                        <p>
                            We have implemented rigorous measures to secure your personal information from accidental loss and unauthorized access, use, alteration, and disclosure. All data provided to us is stored on secure servers protected by firewalls, and any payment transactions and sensitive information are encrypted to maintain confidentiality and integrity.
                        </p>
                        <p>
                            The security of your information also relies on your actions. If provided with a password to access specific parts of our website, it is your responsibility to keep it confidential and not share it with others. Exercise caution when sharing information in public areas of the Website, as such disclosures may be viewed by other users.
                        </p>
                        <p>
                            While we strive to protect your personal information, please be aware that transmitting data over the internet is not entirely secure. Therefore, any transmission of personal information is done at your own risk. We cannot guarantee the security of information transmitted to our Website and are not liable for breaches of privacy settings or security measures on the Website.
                        </p>
                        <p>
                            Our data security practices comply with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, under the Information Technology Act, 2000, which mandates specific requirements for protecting sensitive personal data or information collected and processed in India.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Changes to Our Privacy Policy</h1>
                        <p>
                            It is our policy to post any changes we make to our privacy policy on this page with a notice that the privacy policy has been updated on the Website home page. The date the privacy policy was last revised is identified at the top of the page. You are responsible for ensuring we have an up-to-date active and deliverable email address for you, and for periodically visiting our Website and this privacy policy to check for any changes.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Automated Decision Making and Profiling
                        </h1>
                        <p>
                            Zapllo may use automated decision-making processes, including profiling, to analyze user preferences, behaviors, and trends to improve our services and user experience. Such automated processes may impact the content, resources, or advertisements presented to you.
                        </p>
                        <p>
                            We implement measures to ensure that these automated processes do not result in decisions that significantly affect your legal rights without your consent or another legal basis. You have the right to request human intervention, express your point of view, and contest the decision.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Links to Other Websites
                        </h1>
                        <p>
                            Our Website may contain links to third-party websites, plugins, or applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our Website, we encourage you to read the privacy policy of every website you visit.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h1 className="md:text-2xl text-start mb-6 text-2xl text-gray-400 md:mt-0 mt-0 font-bold">Contact Information
                        </h1>
                        <p>
                            To ask questions or comment about this privacy policy and our privacy practices, contact us at:
                        </p>
                        <div>
                            <h1> <b> Zapllo Technologies Private Limited</b></h1>
                            <div className="flex">
                                <b> Registered Address :</b>
                                <div className="ml-1">
                                    <address>
                                        Dum Dum Park, PO - Bangur Avenue, Kolkata - 700055
                                    </address>
                                </div>
                            </div>
                            <h1><b>Email:</b> support@zapllo.com
                            </h1>
                            <h1><b> Phone:</b> +91-9836630366</h1>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
