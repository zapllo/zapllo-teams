import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Flag from 'react-world-flags';
import { AsYouType, CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { getData as getCountryData } from 'country-list';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type PlanKeys = 'Zapllo Tasks' | 'Zapllo Money Saver Bundle';

interface Country {
    code: CountryCode;
    name: string;
}

const MultiStepForm = ({ selectedPlan }: { selectedPlan: PlanKeys }) => {
    const [step, setStep] = useState(1);
    const [isStep1Valid, setIsStep1Valid] = useState(false); // Add validation state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        industry: '',
        email: '',
        countryCode: 'IN',
        whatsappNo: '',
        selectedPlan,
        subscribedUserCount: 20, // Changed from quantity to subscribedUserCount
        discountCode: 'REPUBLIC',
    });
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);



    const plans: Record<PlanKeys, number> = {
        'Zapllo Tasks': 2000,
        'Zapllo Money Saver Bundle': 3000,
        // 'Zapllo Payroll': 1000,
    };

    // Validation function
    useEffect(() => {
        const isValid =
            formData.firstName.trim() !== '' &&
            formData.lastName.trim() !== '' &&
            formData.companyName.trim() !== '' &&
            formData.industry.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.whatsappNo.trim() !== '';
        setIsStep1Valid(isValid);
    }, [formData]);

    const [payableAmount, setPayableAmount] = useState(plans[formData.selectedPlan] * formData.subscribedUserCount);

    const [totalPrice, setTotalPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [walletBonus, setWalletBonus] = useState(0);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [countries, setCountries] = useState<Country[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();


    // Update Wallet Bonus based on the plan and subscribed user count
    useEffect(() => {
        const calculateWalletBonus = () => {
            const baseUsers = 20;
            const increment = (formData.subscribedUserCount - baseUsers) / 5;

            if (formData.selectedPlan === "Zapllo Tasks") {
                const baseBonus = 4000; // Bonus for 20 users
                const additionalBonus = increment > 0 ? increment * 1000 : 0; // ₹1000 for every 5 users above 20
                setWalletBonus(baseBonus + additionalBonus);
            } else if (formData.selectedPlan === "Zapllo Money Saver Bundle") {
                const baseBonus = 10000; // Bonus for 20 users
                const additionalBonus = increment > 0 ? increment * 2500 : 0; // ₹2500 for every 5 users above 20
                setWalletBonus(baseBonus + additionalBonus);
            } else {
                setWalletBonus(0);
            }
        };

        calculateWalletBonus();
    }, [formData.selectedPlan, formData.subscribedUserCount]);



    useEffect(() => {
        const updatePricing = () => {
            const pricePerUser = plans[formData.selectedPlan] * 2;
            const calculatedTotalPrice = pricePerUser * formData.subscribedUserCount;
            const calculatedDiscount = 0.5 * calculatedTotalPrice;
            const calculatedDiscountedPrice = calculatedTotalPrice - calculatedDiscount;

            setTotalPrice(calculatedTotalPrice);
            setDiscount(calculatedDiscount);
            setDiscountedPrice(calculatedDiscountedPrice);
        };

        updatePricing();
    }, [formData.selectedPlan, formData.subscribedUserCount]);

    useEffect(() => {
        const countryList = getCountryData()
            .map(country => ({
                code: country.code as CountryCode,
                name: country.name,
            }))
            .filter(country => {
                try {
                    return getCountryCallingCode(country.code);
                } catch {
                    return false;
                }
            });
        setCountries(countryList);
    }, []);

    useEffect(() => {
        // Load Razorpay script
        const loadRazorpayScript = () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        };
        loadRazorpayScript();
    }, []);

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            selectedPlan,
        }));
    }, [selectedPlan]);

    const handleCountryChange = (countryCode: string) => {
        setFormData({
            ...formData,
            countryCode,
        });
        setIsDropdownOpen(false);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const phoneNumber = new AsYouType().input(e.target.value);
        setFormData({ ...formData, whatsappNo: phoneNumber });
    };


    const nextStep = () => {
        if (isStep1Valid) {
            setStep(step + 1);
        }
    };

    const prevStep = () => setStep(step - 1);

    const updatePayableAmount = (selectedPlan: PlanKeys, subscribedUserCount: number) => {
        const pricePerUser = plans[selectedPlan];
        setPayableAmount(pricePerUser * subscribedUserCount);
    };

    const handlePlanChange = (plan: PlanKeys) => {
        setFormData({ ...formData, selectedPlan: plan });
        updatePayableAmount(plan, formData.subscribedUserCount);
    };

    const handleSubscribedUserCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const subscribedUserCount = parseInt(e.target.value, 10) || 1;
        setFormData({ ...formData, subscribedUserCount });
        updatePayableAmount(formData.selectedPlan, subscribedUserCount);
    };

    const handlePayment = async () => {
        const payableAmountWithGst = payableAmount * 1.18; // Adding 18% GST to the payable amount
        try {
            setIsPaymentProcessing(true);
            const { data } = await axios.post('/api/create-order', {
                amount: Math.round(payableAmountWithGst * 100), // Razorpay accepts amount in paise
                currency: 'INR',
                planName: formData.selectedPlan,
                subscribedUserCount: formData.subscribedUserCount,
                email: formData.email,
            });
            setIsPaymentProcessing(false);

            const { orderId } = data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: Math.round(payableAmountWithGst * 100),
                currency: 'INR',
                name: `Zapllo`,
                description: `Payment for ${formData.selectedPlan}`,
                image: 'https://res.cloudinary.com/dndzbt8al/image/upload/v1732384145/zapllo_pmxgrw.jpg',
                order_id: orderId,
                handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; }) => {
                    const paymentResult = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        companyName: formData.companyName,
                        industry: formData.industry,
                        email: formData.email,
                        countryCode: formData.countryCode,
                        whatsappNo: formData.whatsappNo,
                        amount: payableAmountWithGst,
                        planName: formData.selectedPlan,
                        subscribedUserCount: formData.subscribedUserCount,
                    };

                    try {
                        setIsPaymentProcessing(true);
                        const verification = await axios.post('/api/onboardingSuccess', paymentResult);
                        if (verification.data.success) {
                            // setIsPaymentProcessing(false);
                            toast(<div className=" w-full mb-6 gap-2 m-auto  ">
                                <div className="w-full flex  justify-center">
                                    <DotLottieReact
                                        src="/lottie/tick.lottie"
                                        loop
                                        autoplay
                                    />
                                </div>
                                <h1 className="text-black text-center font-medium text-lg">Payment successful</h1>
                            </div>);
                            router.replace('/onboardingSuccess');
                            setIsPaymentProcessing(false);

                        } else {
                            setIsPaymentProcessing(false);
                            toast.error('Payment verification failed.');
                        }
                    } catch (error) {
                        setIsPaymentProcessing(false);
                        console.error('Error verifying payment:', error);
                    } finally {
                        setIsPaymentProcessing(false); // Reset the loader
                    }
                },
                prefill: {
                    name: `${formData?.firstName} ${formData?.lastName}`,
                    email: formData?.email,
                    contact: formData?.whatsappNo,
                },
                notes: {
                    address: 'Payment made via the special offer page.',
                },
                theme: {
                    color: "#04061E", // Replace with your brand's primary color
                    backdrop_color: "#0B0D26", // Optional: Set a custom background color for the Razorpay modal
                },
            };

            const rzp1 = new (window as any).Razorpay(options);
            // Attach a handler to reset the loader when the Razorpay modal is closed
            rzp1.on('modal.closed', () => {
                setIsPaymentProcessing(false); // Reset the loader
            });

            rzp1.open();
        } catch (error) {
            console.error('Error initiating payment:', error);
            toast.error('Something went wrong. Please try again.');
            setIsPaymentProcessing(false);
        }
    };

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <>
            {isPaymentProcessing && <div className="payment-overlay ">
                <div className='block'>
                    <DotLottieReact
                        src="/lottie/loader.lottie"
                        loop
                        className='h-32'
                        autoplay
                    />
                    <h1 className='text-center text-xl font-bold'>Processing Your Payment</h1>
                    <p className='text-muted-foreground text-center text-lg'>Please do not refresh or go back</p>

                </div>



            </div>}
            <div className="bg-[#0A0D28]  text-white p-8 rounded-2xl w-full max-w-4xl mx-auto">
                <h1 className="text-2xl font-medium mb-8">Contact Form</h1>

                {/* Step Progress Bar */}
                <div className="flex items-center mb-8">
                    <div className="flex w-1/2 items-center">
                        <div className={`w-4 h-4 rounded-full ${step >= 1 ? 'border-2 border-white' : 'bg-gray-600'}`}></div>
                        <div className={`flex-1 h-[1px]  ${step >= 2 ? 'border  border-gray-600' : 'bg-gray-600'}`}></div>
                        <div className={`w-4 h-4 rounded-full ${step === 2 ? 'border-2 border-white' : 'bg-gray-600'}`}></div>
                    </div>
                </div>
                <div className="flex justify-between w-1/2 mb-1">
                    <p className="text-sm font-semibold text-gray-400">Step 1</p>
                    <p className="text-sm font-semibold text-gray-400">Step 2</p>
                </div>
                <div className='flex justify-between w-[53.9%]'>
                    <h2 className={`text-lg font-semibold mb-4 ${step === 1 ? "text-white" : "text-gray-400"}  `}>Contact Details</h2>
                    <h2 className={`text-lg font-semibold mb-4  ${step === 2 ? "text-white" : "text-gray-400"}  `}>Checkout</h2>
                </div>
                {/* Step 1: Contact Details */}
                {
                    step === 1 && (
                        <div>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {/* Input fields for Contact Details */}
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="p-3 bg-transparent focus:border-[#815bf5] border-[#424882]  border rounded-2xl placeholder:text-[#676B93] text-[#ffffff] focus:outline-none"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="p-3 bg-transparent focus:border-[#815bf5] border-[#424882]  border rounded-2xl placeholder:text-[#676B93] text-[#ffffff] focus:outline-none"
                                />
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Company Name"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="p-3 bg-transparent focus:border-[#815bf5] border-[#424882]  border rounded-2xl placeholder:text-[#676B93] text-[#ffffff] focus:outline-none"
                                />
                                <select
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="p-3 bg-[#0A0D28] border-[#424882]  border rounded-2xl placeholder:text-[#676B93] text-[#ffffff] focus:outline-none"
                                >
                                    <option value="" disabled>Select your Industry</option>
                                    <option value="Retail/E-Commerce">Retail/E-Commerce</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Service Provider">Service Provider</option>
                                    <option value="Healthcare(Doctors/Clinics/Physicians/Hospital)">Healthcare(Doctors/Clinics/Physicians/Hospital)</option>
                                    <option value="Logistics">Logistics</option>
                                    <option value="Financial Consultants">Financial Consultants</option>
                                    <option value="Trading">Trading</option>
                                    <option value="Education">Education</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Real Estate/Construction/Interior/Architects">
                                        Real Estate/Construction/Interior/Architects
                                    </option>
                                    <option value="Other">Other</option>

                                </select>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email ID"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="p-3 bg-transparent focus:border-[#815bf5] border-[#424882]  border rounded-2xl placeholder:text-[#676B93] text-[#ffffff] focus:outline-none"
                                />
                                <div className="flex relative">
                                    <div className="flex w-36  items-center border-[#424882] border border-r-0 rounded-2xl rounded-r-none p-3 relative">
                                        <Flag code={formData.countryCode} className="w-6 h-4 mr-2" />
                                        <div >
                                            {countries.filter((country) => country.code === formData.countryCode).map((country) => (
                                                <button
                                                    key={country.code} // Add a unique key here
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    className="bg-transparent  text-white w-full text-left focus:outline-none"
                                                >
                                                    (+{getCountryCallingCode(country.code)})

                                                </button>
                                            ))}
                                        </div>
                                        {isDropdownOpen && (
                                            <div className="absolute left-0 top-full mt-1 w-64 max-h-60 overflow-y-auto scrollbar-hide bg-black p-2 border border-[#424882] rounded-2xl z-50">
                                                <input
                                                    type="text"
                                                    placeholder="Search Country"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="p-2 focus:border-[#815bf5] mb-2 w-full text-white outline-none border rounded"
                                                />
                                                {filteredCountries.map((country) => (
                                                    <div
                                                        key={country.code}
                                                        className="flex items-center p-2 cursor-pointer hover:bg-[#04061E] text-white"
                                                        onClick={() => handleCountryChange(country.code)}
                                                    >
                                                        <Flag code={country.code} className="w-6 h-4 mr-2" />
                                                        {country.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        name="whatsappNo"
                                        placeholder="Mobile Number"
                                        value={formData.whatsappNo}
                                        onChange={handlePhoneChange}
                                        className="p-3 bg-transparent focus:border-[#815bf5] border-[#424882] border rounded-l-none rounded-2xl placeholder:text-[#676B93] text-white focus:outline-none w-full"
                                    />
                                </div>
                            </div>

                            <div className="w-full flex cursor-pointer  justify-end mt-8">
                                <div
                                    onClick={nextStep}
                                    className={cn(
                                        `group rounded-full border border-black/5 transition-all ease-in text-base w-fit px-24 py-2 text-white cursor-pointer dark:border-white/5 dark:hover:text-white bg-[#815bf5] hover:bg-primary`,
                                        { 'opacity-50 cursor-not-allowed': !isStep1Valid }
                                    )}
                                >
                                    <button disabled={!isStep1Valid}>Next</button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Step 2: Checkout */}
                {
                    step === 2 && (
                        <div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {Object.keys(plans).map((plan) => (
                                    <label
                                        key={plan}
                                        className={`flex flex-col items-start p-4 border border-[#37384B] rounded-2xl cursor-pointer ${formData.selectedPlan === plan ? ' bg-transparent' : 'bg-transparent'
                                            }`}
                                        onClick={() => handlePlanChange(plan as PlanKeys)}
                                    >
                                        <div className='flex gap-2'>
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="selectedPlan"
                                                    value={plan}
                                                    checked={formData.selectedPlan === plan}
                                                    onChange={() => handlePlanChange(plan as PlanKeys)}
                                                    className="hidden" // Hide the default radio input
                                                />
                                                <span
                                                    className={`relative w-4 h-4  rounded-full border-2 flex-shrink-0 mr-2 ${formData.selectedPlan === plan
                                                        ? "bg-[#FC8929]  border-4 border-transparent  p-[2px] "
                                                        : "bg-[#37384b] border-gray-400"
                                                        }`}
                                                >
                                                    {formData.selectedPlan === plan && (
                                                        <span className="absolute inset-0   rounded-full bg-white">

                                                        </span>
                                                    )}
                                                </span>
                                                <span className="text-white font-semibold">{plan}</span>
                                            </label>
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {plan === 'Zapllo Money Saver Bundle' ? (
                                                <>
                                                    <h1 className='px-6 text-balance text-muted-foreground'>
                                                        Includes Task Delegation App, Zapllo Payroll (Leave & Attendance), WhatsApp Marketing & Automation Software
                                                    </h1>
                                                    <div className='px-4 mt-4'>
                                                        <h1 className='text-white  text-lg font-semibold'>
                                                            <p className='relative inline-block'>                                             <span className=' text-gray-200 -500'>₹{plans[plan] * 2 - 1}</span>
                                                                <span className="absolute inset-0 bg-red-500 h-[2px] top-1/2 w-14 -ml-[2px] transform -translate-y-1/2"></span>
                                                            </p>

                                                            <span
                                                                className="ml-2 text-lg"
                                                                style={{
                                                                    fontSize: "16px",
                                                                    fontWeight: "400",
                                                                    lineHeight: "24px",
                                                                    color: "#676B93",
                                                                }}
                                                            >
                                                                /  user / year
                                                            </span>
                                                        </h1>
                                                        <h1 className='text-white mt-2  text-2xl font-semibold'>
                                                            <p className='relative inline-block'>                                             <span className=' text-white -500'>₹{plans[plan] - 1}</span>

                                                            </p>

                                                            <span
                                                                className="ml-2 text-sm"
                                                                style={{


                                                                    color: "#676B93",
                                                                }}
                                                            >
                                                                /  user / year
                                                            </span>
                                                        </h1>
                                                    </div>
                                                    <br />
                                                </>
                                            ) : plan === 'Zapllo Tasks' ? (
                                                <>
                                                    <h1 className='px-6 text-muted-foreground'>
                                                        Includes Task Delegation App
                                                    </h1>
                                                    <div className='px-4 mt-4'>
                                                        <h1 className='text-white  text-lg font-semibold'>
                                                            <p className='relative inline-block'>                                             <span className=' text-gray-200 -500'>₹{plans[plan] * 2 - 1}</span>
                                                                <span className="absolute inset-0 bg-red-500 h-[2px] top-1/2 w-14 -ml-[2px] transform -translate-y-1/2"></span>
                                                            </p>

                                                            <span
                                                                className="ml-2 text-lg"
                                                                style={{
                                                                    fontSize: "16px",
                                                                    fontWeight: "400",
                                                                    lineHeight: "24px",
                                                                    color: "#676B93",
                                                                }}
                                                            >
                                                                /  user / year
                                                            </span>
                                                        </h1>
                                                        <h1 className='text-white mt-2  text-2xl font-semibold'>
                                                            <p className='relative inline-block'>                                             <span className=' text-white -500'>₹{plans[plan] - 1}</span>

                                                            </p>

                                                            <span
                                                                className="ml-2 text-sm"
                                                                style={{


                                                                    color: "#676B93",
                                                                }}
                                                            >
                                                                /  user / year
                                                            </span>
                                                        </h1>
                                                    </div>
                                                    <br />

                                                </>
                                            ) : ""}
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h1 className='mb-2'>Select No. of Users</h1>
                                    <select
                                        name="subscribedUserCount"
                                        value={formData.subscribedUserCount}
                                        onChange={handleSubscribedUserCountChange}
                                        className="p-3 w-full bg-[#0A0D28] border-[#424882]  border rounded-2xl placeholder:text-[#676B93] text-[#ffffff] focus:outline-none"
                                    >
                                        {[...Array(40).keys()].map((num) => (
                                            <option key={(num + 1) * 5} value={(num + 1) * 5}>{(num + 1) * 5}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <h1 className='mb-2'>Discount Code:</h1>
                                    <input
                                        type="text"
                                        name="discountCode"
                                        placeholder="Discount Code"
                                        disabled
                                        value={formData.discountCode}
                                        onChange={handleChange}
                                        className="p-3 bg-transparent focus:border-[#815bf5] w-full border-[#424882]  border rounded-2xl placeholder:text-[#676B93] text-[#ffffff] focus:outline-none"
                                    />
                                </div>
                            </div>
                            {(formData.selectedPlan === 'Zapllo Tasks' && formData.subscribedUserCount >= 20) ||
                                (formData.selectedPlan === 'Zapllo Money Saver Bundle' && formData.subscribedUserCount >= 20) ? (
                                <div className='p-4 border mb-4 rounded-2xl'>
                                    <div className='flex items-center mb-2 gap-2'>
                                        🎉<h1 className='text-xl '>Congratulations, you&apos;ve unlocked the WhatsApp Marketing Software FREE of cost!</h1>
                                    </div>
                                    <h1 className='text-sm text-muted-foreground'>The onboarding team will contact you and set this up for absolutely <span className='text-orange-400'>free of cost</span> with 3 done-for-you custom chatbots!</h1>
                                    {/* <p className='mt-2 text-sm text-start'>Your Wallet Bonus: ₹ 10,000</p> */}
                                </div>
                            ) : null}
                            <div className='border p-3 grid grid-cols-2 w-full gap-2 rounded-2xl'>
                                <div className='p-2 space-y-6'>
                                    <p>Total Price: ₹{(plans[formData.selectedPlan] * 2).toLocaleString()} X {formData.subscribedUserCount} employees = ₹{totalPrice.toLocaleString()}</p>
                                    <p>Discount Applied: 50% OFF - ₹{discount.toLocaleString()}</p>
                                    <p>Total Amount (excl. GST): ₹{discountedPrice.toLocaleString()}</p>
                                    <p className='text-green-500'>Net Amount: ₹{Math.round(payableAmount * 1.18).toLocaleString()}</p>
                                </div>
                                <div className='p-4 border rounded-2xl'>
                                    <div className='flex items-center mb-2 gap-2'>
                                        <Info className='text-gray-400' /> <h1 className='text-xl '>One Time Fast Action Bonus</h1>
                                    </div>
                                    <h1 className='text-sm text-muted-foreground'>Get 10% Additional Bonus when you purchase <span className='text-red-400'>20 or more users</span>. Bonus will be added to your subscription wallet that can be redeemed for purchasing more users, <span className='text-orange-400'>receiving AI Tokens </span>, upcoming apps and renewals.</h1>
                                    <p>Your Wallet Bonus: ₹{formData.subscribedUserCount >= 20 ? walletBonus.toLocaleString() : 0}</p>
                                </div>
                            </div>
                            <div className='flex items-center mt-4'>
                                <div className=''>
                                    <button onClick={prevStep} className="bg-[#121212] hover:border-white border border-primary w-full px-24 py-2  rounded-full text-white font-semibold ">
                                        Back
                                    </button>
                                </div>
                                <div className="w-full flex cursor-pointer  justify-end ">

                                    <div
                                        onClick={handlePayment}
                                        className={cn(
                                            "group rounded-full border border-black/5  transition-all ease-in  text-base w-fit px-24 hover: py-2 text-white  cursor-pointer  dark:border-white/5 dark:hover:text-white hover:bg-primary bg-[#815bf5]",
                                        )}
                                    >

                                        <button
                                        >
                                            Payable Amount ₹{Math.round(payableAmount * 1.18).toLocaleString()}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </>

    );
};

export default MultiStepForm;
