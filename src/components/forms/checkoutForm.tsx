import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Flag from 'react-world-flags';
import { AsYouType, CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { getData as getCountryData } from 'country-list';
import { cn } from '@/lib/utils';
import { Check, Info, Plus, Minus, ChevronsRight, ArrowLeft, BadgeCheck, Shield, Star, BadgeDollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button } from '../ui/button';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import { Switch } from '@/components/ui/switch';
// import { Label } from '@/components/ui/label';
import { Tabs3, TabsList3, TabsTrigger3 } from '../ui/tabs3';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type PlanKeys = 'Zapllo Tasks' | 'Zapllo Payroll' | 'Zapllo CRM';

interface Country {
    code: CountryCode;
    name: string;
}

interface PlanSelection {
    selected: boolean;
    userCount: number;
}

const MultiStepForm = ({ selectedPlan }: { selectedPlan: PlanKeys; }) => {
    const [step, setStep] = useState(1);
    const [isStep1Valid, setIsStep1Valid] = useState(false);
    // Change to use local state for term that can be updated
    const [subscriptionTerm, setSubscriptionTerm] = useState<1 | 3 | 5>(1);

    // Add this at the top-level with your other imports and state declarations
    const getCurrentDatePromo = () => {
        const now = new Date();
        const month = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
        const day = now.getDate();
        return `${month}${day}`;
    };

    // Then, in your component:
    const [promoCode, setPromoCode] = useState(getCurrentDatePromo());

    // Define original prices
    const planPrices = {
        'Zapllo Tasks': 3999,
        'Zapllo Payroll': 1999,
        'Zapllo CRM': 5999,
    };

    // Add this handler to update the subscription term
    const handleTermChange = (value: string) => {
        setSubscriptionTerm(parseInt(value) as 1 | 3 | 5);
    };

    // Track selected plans and their user counts
    const [selectedPlans, setSelectedPlans] = useState<Record<PlanKeys, PlanSelection>>({
        'Zapllo Tasks': { selected: selectedPlan === 'Zapllo Tasks', userCount: 1 },
        'Zapllo Payroll': { selected: selectedPlan === 'Zapllo Payroll', userCount: 1 },
        'Zapllo CRM': { selected: selectedPlan === 'Zapllo CRM', userCount: 1 },
    });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        industry: '',
        email: '',
        countryCode: 'IN',

        whatsappNo: '',
        selectedPlan,
        discountCode: 'REPUBLIC',
    });

    // Get total user count across all plans
    const getTotalUserCount = () => {
        return Object.values(selectedPlans)
            .filter(plan => plan.selected)
            .reduce((total, plan) => total + plan.userCount, 0);
    };

    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [payableAmount, setPayableAmount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [walletBonus, setWalletBonus] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [countries, setCountries] = useState<Country[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

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

    // Get the effective years to pay for based on term
    const getEffectiveYearsToPay = (term: number) => {
        if (term === 3) return 2;
        if (term === 5) return 3;
        return term;
    };

    // Calculate if discount is applicable (5+ users across all plans)
    const isDiscountApplicable = getTotalUserCount() >= 5;

    // Calculate pricing based on selected plans and their user counts
    useEffect(() => {
        const updatePricing = () => {
            let originalTotalPrice = 0;

            // Calculate the original price for all years without any discount
            Object.entries(selectedPlans).forEach(([plan, selection]) => {
                if (selection.selected) {
                    const planPrice = planPrices[plan as PlanKeys];
                    originalTotalPrice += planPrice * selection.userCount * subscriptionTerm;
                }
            });

            // Step 1: Apply the free years discount (for multi-year plans)
            const effectiveYears = getEffectiveYearsToPay(subscriptionTerm);
            const priceAfterFreeYears = originalTotalPrice * effectiveYears / subscriptionTerm;
            const freeYearsDiscount = originalTotalPrice - priceAfterFreeYears;

            // Step 2: Apply the 50% promo code discount if applicable
            let finalPrice = priceAfterFreeYears;
            let promoDiscount = 0;

            if (isDiscountApplicable) {
                promoDiscount = priceAfterFreeYears * 0.5;
                finalPrice = priceAfterFreeYears * 0.5; // Apply 50% discount
            }

            // Total discount is the sum of free years discount and promo discount
            const totalDiscount = freeYearsDiscount + promoDiscount;

            setTotalPrice(originalTotalPrice);
            setDiscount(totalDiscount);
            setDiscountedPrice(finalPrice);
            setPayableAmount(finalPrice);
        };

        updatePricing();
    }, [selectedPlans, subscriptionTerm, isDiscountApplicable]);

    // Update Wallet Bonus based on selected plans and user count
    useEffect(() => {
        const calculateWalletBonus = () => {
            const baseUsers = 20;
            let totalBonus = 0;

            Object.entries(selectedPlans).forEach(([plan, selection]) => {
                if (selection.selected && selection.userCount >= baseUsers) {
                    const increment = (selection.userCount - baseUsers) / 5;

                    if (plan === 'Zapllo Tasks') {
                        const baseBonus = 4000; // Bonus for 20 users
                        const additionalBonus = increment > 0 ? increment * 1000 : 0; // ₹1000 for every 5 users above 20
                        totalBonus += baseBonus + additionalBonus;
                    } else if (plan === 'Zapllo Payroll') {
                        const baseBonus = 2000; // Bonus for 20 users
                        const additionalBonus = increment > 0 ? increment * 500 : 0; // ₹500 for every 5 users above 20
                        totalBonus += baseBonus + additionalBonus;
                    } else if (plan === 'Zapllo CRM') {
                        const baseBonus = 6000; // Bonus for 20 users 
                        const additionalBonus = increment > 0 ? increment * 1500 : 0; // ₹1500 for every 5 users above 20
                        totalBonus += baseBonus + additionalBonus;
                    }
                }
            });

            // Adjust based on subscription term
            totalBonus = totalBonus * getEffectiveYearsToPay(subscriptionTerm);

            setWalletBonus(totalBonus);
        };

        calculateWalletBonus();
    }, [selectedPlans, subscriptionTerm]);

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

        // Initialize selected plans with the provided selectedPlan
        setSelectedPlans((prev) => ({
            ...prev,
            [selectedPlan]: { ...prev[selectedPlan], selected: true }
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

    const handlePlanSelection = (plan: PlanKeys) => {
        setSelectedPlans(prev => ({
            ...prev,
            [plan]: { ...prev[plan], selected: !prev[plan].selected }
        }));
    };

    const handleUserCountChange = (plan: PlanKeys, increment: boolean) => {
        setSelectedPlans(prev => {
            const currentCount = prev[plan].userCount;
            const newCount = increment
                ? currentCount + 1
                : Math.max(1, currentCount - 1);

            return {
                ...prev,
                [plan]: { ...prev[plan], userCount: newCount }
            };
        });
    };

    const handlePayment = async () => {
        // Check if at least one plan is selected
        const atLeastOnePlanSelected = Object.values(selectedPlans).some(plan => plan.selected);
        if (!atLeastOnePlanSelected) {
            toast.error('Please select at least one plan to continue');
            return;
        }

        const payableAmountWithGst = payableAmount * 1.18; // Adding 18% GST
        try {
            setIsPaymentProcessing(true);

            // Create a structured format of selected plans with their user counts
            const selectedPlanDetails = Object.entries(selectedPlans)
                .filter(([_, plan]) => plan.selected)
                .map(([planName, plan]) => ({
                    name: planName,
                    userCount: plan.userCount
                }));

            const { data } = await axios.post('/api/create-order', {
                amount: Math.round(payableAmountWithGst * 100), // Razorpay accepts amount in paise
                currency: 'INR',
                planDetails: selectedPlanDetails,
                subscriptionTerm,
                email: formData.email,
            });
            setIsPaymentProcessing(false);

            const { orderId } = data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: Math.round(payableAmountWithGst * 100),
                currency: 'INR',
                name: `Zapllo`,
                description: `Payment for Zapllo Products - ${subscriptionTerm} year(s)`,
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
                        planDetails: selectedPlanDetails,
                        subscriptionTerm,
                    };

                    try {
                        setIsPaymentProcessing(true);
                        const verification = await axios.post('/api/onboardingSuccess', paymentResult);
                        if (verification.data.success) {
                            toast(
                                <div className="w-full mb-6 gap-2 m-auto">
                                    <div className="w-full flex justify-center">
                                        <DotLottieReact
                                            src="/lottie/tick.lottie"
                                            loop
                                            autoplay
                                        />
                                    </div>
                                    <h1 className="text-black text-center font-medium text-lg">Payment successful</h1>
                                </div>
                            );
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
                        setIsPaymentProcessing(false);
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
                    color: "#04061E",
                    backdrop_color: "#0B0D26",
                },
            }
            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('modal.closed', () => {
                setIsPaymentProcessing(false);
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

    // Check if any plan is selected
    const anyPlanSelected = Object.values(selectedPlans).some(plan => plan.selected);
    // Get discount text based on subscription term
    const getDiscountText = () => {
        if (subscriptionTerm === 1) return "50% OFF (5+ users)";
        if (subscriptionTerm === 3) return "50% OFF + 1 Year Free";
        return "50% OFF + 2 Years Free";
    };

    // Format price with comma separators
    const formatPrice = (price: number) => {
        return Math.floor(price).toLocaleString('en-IN');
    };

    return (
        <>
            {isPaymentProcessing &&
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
                    <Card className="max-w-md w-full p-8 border-0 shadow-2xl">
                        <DotLottieReact
                            src="/lottie/loader.lottie"
                            loop
                            className="h-32 mx-auto"
                            autoplay
                        />
                        <h1 className="text-center text-2xl font-bold mt-4 text-gray-100">Processing Your Payment</h1>
                        <p className="text-gray-200 text-center mt-2">Please wait while we confirm your transaction</p>
                    </Card>
                </div>
            }

            <Card className="bg-white shadow-xl rounded-3xl overflow-hidden w-full mx-auto border-0">
                {/* Progress header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">
                    <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>

                    <div className="space-y-3">
                        {/* <Progress value={step === 1 ? 50 : 100} className="h-2 bg-white/20" /> */}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-white text-purple-600' : 'bg-white/30 text-white'
                                    } font-medium text-sm`}>1</div>
                                <span className={`text-sm font-medium ${step === 1 ? 'text-white' : 'text-white/80'}`}>
                                    Account Details
                                </span>
                            </div>

                            <div className="flex-1 mx-4">
                                <div className="border-t-2 border-dashed border-white/30"></div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-white text-purple-600' : 'bg-white/30 text-white'
                                    } font-medium text-sm`}>2</div>
                                <span className={`text-sm font-medium ${step === 2 ? 'text-white' : 'text-white/80'}`}>
                                    Select Products
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <CardContent className="p-8">
                    {/* Step 1: Contact Details */}
                    {step === 1 && (
                        <div className="w-full animate-in fade-in duration-300">
                            <div className="flex items-center gap-2 mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Tell Us About You</h2>
                                <Badge variant="outline" className="ml-auto border-purple-200 text-purple-700 font-normal">
                                    Step 1 of 2
                                </Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Enter your first name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="p-3 bg-transparent w-full focus:border-purple-500 border-gray-300 border rounded-xl placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Enter your last name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="p-3 bg-transparent w-full focus:border-purple-500 border-gray-300 border rounded-xl placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        placeholder="Enter your company name"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="p-3 bg-transparent w-full focus:border-purple-500 border-gray-300 border rounded-xl placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Industry</label>
                                    <select
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleChange}
                                        className="p-3 bg-white w-full border-gray-300 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
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
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email ID</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="p-3 bg-transparent w-full focus:border-purple-500 border-gray-300 border rounded-xl placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                                    <div className="flex relative">
                                        <div className="flex w-36 items-center border-gray-300 border border-r-0 rounded-l-xl p-3 relative">
                                            <Flag code={formData.countryCode} className="w-6 h-4 mr-2" />
                                            <div>
                                                {countries.filter((country) => country.code === formData.countryCode).map((country) => (
                                                    <button
                                                        key={country.code}
                                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                        className="bg-transparent text-gray-800 w-full text-left focus:outline-none"
                                                    >
                                                        (+{getCountryCallingCode(country.code)})
                                                    </button>
                                                ))}
                                            </div>
                                            {isDropdownOpen && (
                                                <Card className="absolute left-0 top-full mt-1 w-64 max-h-60 overflow-y-auto z-50 border-0 shadow-lg">
                                                    <CardContent className="p-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Search Country"
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="p-2 focus:border-purple-500 mb-2 w-full text-gray-900 outline-none border rounded-lg"
                                                        />
                                                        {filteredCountries.map((country) => (
                                                            <div
                                                                key={country.code}
                                                                className="flex items-center p-2 cursor-pointer hover:bg-gray-100 text-gray-800 rounded-lg"
                                                                onClick={() => handleCountryChange(country.code)}
                                                            >
                                                                <Flag code={country.code} className="w-6 h-4 mr-2" />
                                                                {country.name}
                                                            </div>
                                                        ))}
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            name="whatsappNo"
                                            placeholder="Enter your mobile number"
                                            value={formData.whatsappNo}
                                            onChange={handlePhoneChange}
                                            className="p-3 bg-transparent focus:border-purple-500 border-gray-300 border rounded-r-xl rounded-l-none placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={nextStep}
                                    disabled={!isStep1Valid}
                                    className={`px-8 py-6 rounded-xl font-medium text-base ${isStep1Valid
                                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Continue <ChevronsRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Product Selection and Checkout */}
                    {step === 2 && (
                        <div className="animate-in fade-in duration-300">
                            <div className="flex items-center gap-2 mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Select Your Products</h2>
                                <Badge variant="outline" className="ml-auto border-purple-200 text-purple-700 font-normal">
                                    Step 2 of 2
                                </Badge>
                            </div>

                            <p className="text-gray-600 mb-6">
                                Choose the products you need and customize the number of users
                            </p>

                            {/* Subscription Term Tabs - with enhanced styling */}
                            <Card className="mb-8 border bg-transparent border-purple-100">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify- w-full mb-6">

                                        <div className="flex flex-col space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Choose Your Subscription</h3>

                                            {/* Subscription Option Buttons */}
                                            <div className="md:flex grid grid-cols-1 w-full gap-4">
                                                {/* 1 Year Option */}
                                                <button
                                                    onClick={() => handleTermChange("1")}
                                                    className={`relative overflow-hidden w- rounded-xl border-2 transition-all duration-300 ${subscriptionTerm === 1
                                                        ? 'border-purple-500 bg-purple-50 shadow-md'
                                                        : 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/50'
                                                        }`}
                                                >
                                                    <div className="p-5 w-full">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h4 className="text-lg font-bold text-gray-900">1 Year</h4>
                                                            {subscriptionTerm === 1 && (
                                                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-purple-100">
                                                                    <Check className="h-4 w-4 text-purple-600" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <p className="text-sm text-gray-600 mb-3">Pay for Standard Plan </p>

                                                        <div className="mt-auto">
                                                            <Badge className={`${subscriptionTerm === 1 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                                                                Basic Option
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {subscriptionTerm === 1 && (
                                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                                                    )}
                                                </button>

                                                {/* 3 Year Option */}
                                                <button
                                                    onClick={() => handleTermChange("3")}
                                                    className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${subscriptionTerm === 3
                                                        ? 'border-green-500 bg-green-50 shadow-md'
                                                        : 'border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/50'
                                                        }`}
                                                >
                                                    <div className={`absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 h-16 w-16 rounded-full ${subscriptionTerm === 3 ? 'bg-green-500/10' : 'bg-gray-100'
                                                        }`}></div>

                                                    <div className="p-5 relative">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h4 className="text-lg font-bold text-gray-900">3 Years</h4>
                                                            {subscriptionTerm === 3 && (
                                                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100">
                                                                    <Check className="h-4 w-4 text-green-600" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <p className="text-sm text-gray-600 mb-3">Pay for 2, get 1 free</p>

                                                        <div className="flex items-center mt-auto">
                                                            <Badge className={`${subscriptionTerm === 3 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                                33% Savings
                                                            </Badge>
                                                            <div className="ml-2 p-1 bg-yellow-100 rounded-full">
                                                                <BadgeDollarSign className="h-3 w-3 text-yellow-600" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {subscriptionTerm === 3 && (
                                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                                                    )}
                                                </button>

                                                {/* 5 Year Option */}
                                                <button
                                                    onClick={() => handleTermChange("5")}
                                                    className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${subscriptionTerm === 5
                                                        ? 'border-amber-500 bg-amber-50 shadow-md'
                                                        : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/50'
                                                        }`}
                                                >
                                                    <div className="absolute top-1 right-1 z-10">
                                                        {subscriptionTerm === 5 ? (
                                                            <div className="animate-pulse">
                                                                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                                                            </div>
                                                        ) : (
                                                            <Star className="h-4 w-4 text-gray-300" />
                                                        )}
                                                    </div>

                                                    <div className="p-5">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h4 className="text-lg font-bold text-gray-900">5 Years</h4>
                                                            {subscriptionTerm === 5 && (
                                                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-amber-100">
                                                                    <Check className="h-4 w-4 text-amber-600" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <p className="text-sm text-gray-600 mb-3">Pay for 3, get 2 free</p>

                                                        <div className="flex items-center justify-between mt-auto">
                                                            <Badge className={`${subscriptionTerm === 5 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                                                                Best Value
                                                            </Badge>
                                                            <div className="flex -space-x-1">
                                                                <div className="p-1 bg-yellow-100 rounded-full">
                                                                    <BadgeDollarSign className="h-3 w-3 text-yellow-600" />
                                                                </div>
                                                                <div className="p-1 bg-yellow-100 rounded-full">
                                                                    <BadgeDollarSign className="h-3 w-3 text-yellow-600" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {subscriptionTerm === 5 && (
                                                        <>
                                                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
                                                            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-500/10 rounded-full"></div>
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Term Benefits Information */}
                                            <div className={`mt-4 p-4 rounded-xl transition-all duration-300 ${subscriptionTerm === 1
                                                ? 'bg-purple-50 border border-purple-100'
                                                : subscriptionTerm === 3
                                                    ? 'bg-green-50 border border-green-100'
                                                    : 'bg-amber-50 border border-amber-100'
                                                }`}>
                                                <div className="flex gap-3 items-start">
                                                    {subscriptionTerm === 1 ? (
                                                        <div className="p-2 rounded-full bg-purple-100">
                                                            <Info className="h-5 w-5 text-purple-600" />
                                                        </div>
                                                    ) : subscriptionTerm === 3 ? (
                                                        <div className="p-2 rounded-full bg-green-100">
                                                            <BadgeDollarSign className="h-5 w-5 text-green-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="p-2 rounded-full bg-amber-100">
                                                            <Star className="h-5 w-5 text-amber-600" />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h4 className={`font-semibold ${subscriptionTerm === 1
                                                            ? 'text-purple-700'
                                                            : subscriptionTerm === 3
                                                                ? 'text-green-700'
                                                                : 'text-amber-700'
                                                            }`}>
                                                            {subscriptionTerm === 1
                                                                ? 'Standard Annual Plan'
                                                                : subscriptionTerm === 3
                                                                    ? 'Smart 3-Year Savings Plan'
                                                                    : 'Maximum 5-Year Value Plan'}
                                                        </h4>

                                                        <p className={`text-sm mt-1 ${subscriptionTerm === 1
                                                            ? 'text-purple-600'
                                                            : subscriptionTerm === 3
                                                                ? 'text-green-600'
                                                                : 'text-amber-600'
                                                            }`}>
                                                            {subscriptionTerm === 1
                                                                ? 'Basic annual subscription with standard pricing.'
                                                                : subscriptionTerm === 3
                                                                    ? 'Pay for just 2 years and get the 3rd year absolutely FREE! Save 33% compared to annual billing.'
                                                                    : 'Our best value option! Pay for only 3 years and get 2 additional years FREE. That is 40% savings!'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        {/* Products section */}
                                        <div className="grid md:grid-cols-1 gap-4 mb-8">
                                            {Object.entries(selectedPlans).map(([planName, planDetails]) => {
                                                const plan = planName as PlanKeys;
                                                return (
                                                    <Card
                                                        key={plan}
                                                        className={`border bg-transparent transition-all overflow-hidden ${planDetails.selected
                                                            ? 'border-purple-400 shadow-lg'
                                                            : 'border-gray-200 hover:border-purple-200'
                                                            }`}
                                                    >
                                                        <div
                                                            className={`h-2 w-full ${planDetails.selected ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' : 'bg-gray-100'
                                                                }`}
                                                        />
                                                        <CardContent className="p-5">
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="pt-0.5">
                                                                        <Checkbox
                                                                            checked={planDetails.selected}
                                                                            onCheckedChange={() => handlePlanSelection(plan)}
                                                                            className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-bold text-gray-900">{plan}</h3>
                                                                        <p className="text-sm text-gray-500 mt-1">
                                                                            {plan === 'Zapllo Tasks' && "Task delegation and team management"}
                                                                            {plan === 'Zapllo Payroll' && "HR, attendance, leave and payroll"}
                                                                            {plan === 'Zapllo CRM' && "Customer management and marketing"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-baseline gap-2 mb-4">
                                                                <span className="text-sm text-gray-400 line-through">₹{formatPrice(planPrices[plan])}</span>
                                                                <span className="text-lg font-bold text-gray-900">
                                                                    ₹{formatPrice(isDiscountApplicable ? planPrices[plan] * 0.5 : planPrices[plan])}
                                                                    {subscriptionTerm > 1 && <> X {subscriptionTerm} years</>}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {subscriptionTerm === 1 ? "per user per year" : `per user (${subscriptionTerm} years)`}
                                                                </span>

                                                                {isDiscountApplicable && (
                                                                    <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                                                                        50% OFF
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            {planDetails.selected ? (
                                                                <div className="mt-4 space-y-4">
                                                                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                                        <div className="md:flex items-center justify-between">
                                                                            <div>
                                                                                <label className="text-sm font-medium text-gray-700">Number of Users</label>
                                                                                <p className="text-xs text-gray-500 mt-1">Who needs access?</p>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="icon"
                                                                                    onClick={() => handleUserCountChange(plan, false)}
                                                                                    disabled={planDetails.userCount <= 1}
                                                                                    className={`h-8 w-8 rounded-full ${planDetails.userCount <= 1
                                                                                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                                                        : 'border-purple-200 text-white -600 hover:bg-purple-50'
                                                                                        }`}
                                                                                >
                                                                                    <Minus size={14} />
                                                                                </Button>
                                                                                <span className="w-10 text-center font-medium text-gray-900">
                                                                                    {planDetails.userCount}
                                                                                </span>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="icon"
                                                                                    onClick={() => handleUserCountChange(plan, true)}
                                                                                    className="h-8 w-8 rounded-full border-purple-200 text-white-600 hover:bg-purple-50"
                                                                                >
                                                                                    <Plus size={14} />
                                                                                </Button>
                                                                            </div>
                                                                        </div>

                                                                        {planDetails.userCount < 5 && (
                                                                            <div className="mt-2 text-xs text-amber-600 flex items-center gap-1.5">
                                                                                <Info size={12} />
                                                                                <span>Add {5 - planDetails.userCount} more user(s) to get 50% OFF</span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                                                        <div className="flex justify-between text-sm">
                                                                            <span className="text-gray-600">Subtotal:</span>
                                                                            <span className="font-medium text-gray-900">
                                                                                ₹{formatPrice(planPrices[plan] * planDetails.userCount * subscriptionTerm)}
                                                                            </span>
                                                                        </div>

                                                                        {(isDiscountApplicable || subscriptionTerm > 1) && (
                                                                            <div className="flex justify-between text-sm mt-1 text-green-600">
                                                                                <span>Discount ({getDiscountText()}):</span>
                                                                                <span>-₹{formatPrice(
                                                                                    planPrices[plan] * planDetails.userCount * subscriptionTerm -
                                                                                    (isDiscountApplicable ? planPrices[plan] * 0.5 : planPrices[plan]) *
                                                                                    planDetails.userCount * getEffectiveYearsToPay(subscriptionTerm)
                                                                                )}</span>
                                                                            </div>
                                                                        )}
                                                                    </div> */}
                                                                </div>
                                                            ) : (
                                                                <Button
                                                                    onClick={() => handlePlanSelection(plan)}
                                                                    variant="outline"
                                                                    className="w-full mt-4 text-white border-purple-200 text--700 hover:bg-primary"
                                                                >
                                                                    Select {plan}
                                                                </Button>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                        {/* Order Summary */}
                                        <div className="grid grid-cols-1 md:grid-cols-1 ">


                                            {/* Order Summary Column */}
                                            <div className="">
                                                <Card className="sticky top-4 bg-transparent border-purple-100">
                                                    <CardContent className="p-5">
                                                        <h3 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h3>

                                                        <div className="space-y-3">
                                                            {/* Selected plans summary */}
                                                            {/* {Object.entries(selectedPlans).map(([planName, planDetails]) => {
                                                                if (!planDetails.selected) return null;
                                                                const plan = planName as PlanKeys;
                                                                const effectiveYears = getEffectiveYearsToPay(subscriptionTerm);
                                                                const planPrice = planPrices[plan];

                                                                // Calculate the original price for all years
                                                                const originalTotalPrice = planPrice * planDetails.userCount * subscriptionTerm;

                                                                // Calculate the price for effective years
                                                                const effectiveYearsPrice = planPrice * planDetails.userCount * effectiveYears;

                                                                // Apply 50% discount if applicable
                                                                const finalPrice = isDiscountApplicable ? effectiveYearsPrice * 0.5 : effectiveYearsPrice;

                                                                return (
                                                                    <div key={plan} className="flex justify-between text-sm">
                                                                        <span className="text-gray-600">
                                                                            {plan} ({planDetails.userCount} user{planDetails.userCount > 1 ? 's' : ''} x {subscriptionTerm} years)
                                                                        </span>
                                                                        <span className="font-medium text-gray-900">
                                                                            ₹{formatPrice(finalPrice)}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })} */}

                                                            {!anyPlanSelected && (
                                                                <div className="py-3 text-center text-amber-600 bg-amber-50 rounded-lg text-sm">
                                                                    Please select at least one product
                                                                </div>
                                                            )}

                                                            {/* <Separator className="my-3 bg-gray-300 " /> */}


                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">
                                                                    Original total for {subscriptionTerm} years:
                                                                </span>
                                                                <span className="font-medium text-gray-900">
                                                                    ₹{formatPrice(totalPrice)}
                                                                </span>
                                                            </div>

                                                            {subscriptionTerm > 1 && (
                                                                <div className="flex justify-between text-sm text-green-600">
                                                                    <span>
                                                                        Free years ({subscriptionTerm - getEffectiveYearsToPay(subscriptionTerm)} of {subscriptionTerm}):
                                                                    </span>
                                                                    <span>
                                                                        -₹{formatPrice(totalPrice - (totalPrice * getEffectiveYearsToPay(subscriptionTerm) / subscriptionTerm))}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {isDiscountApplicable && (
                                                                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex justify-between items-center">
                                                                    <div className="flex items-center">
                                                                        <BadgeDollarSign className="h-5 w-5 text-amber-600 mr-2" />
                                                                        <div>
                                                                            <span className="text-amber-800 font-medium">Promo Code Applied:</span>
                                                                            <span className="ml-2 bg-white text-amber-600 font-bold px-2 py-0.5 rounded">{promoCode}</span>
                                                                        </div>
                                                                    </div>
                                                                    <Badge className="bg-amber-100 text-amber-700">50% OFF</Badge>
                                                                </div>
                                                            )}
                                                            {isDiscountApplicable && (

                                                                <div className="flex justify-between text-sm text-green-600">

                                                                    <span>
                                                                        Promo code ({promoCode}) discount:
                                                                    </span>
                                                                    <span>
                                                                        -₹{formatPrice((totalPrice * getEffectiveYearsToPay(subscriptionTerm) / subscriptionTerm) * 0.5)}
                                                                    </span>
                                                                </div>

                                                            )}

                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">Subtotal:</span>
                                                                <span className="font-medium text-gray-900">₹{formatPrice(discountedPrice)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">GST (18%):</span>
                                                                <span className="font-medium text-gray-900">₹{formatPrice(discountedPrice * 0.18)}</span>
                                                            </div>

                                                            <div className="flex justify-between text-base font-bold">
                                                                <span className="text-gray-900">Total:</span>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <span className="text-purple-700 text-lg">₹{formatPrice(discountedPrice * 1.18)}</span>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="bg-gray-800 text-white">
                                                                            <p>Final amount including GST</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>

                                                            {/* Subscription Term Info */}
                                                            <div className="text-xs text-gray-500 mt-2">
                                                                {subscriptionTerm === 1 ? (
                                                                    <p>One-time payment for 1 year access</p>
                                                                ) : subscriptionTerm === 3 ? (
                                                                    <p>One-time payment for 3 years access (pay for 2)</p>
                                                                ) : (
                                                                    <p>One-time payment for 5 years access (pay for 3)</p>
                                                                )}
                                                            </div>

                                                            {/* Payment buttons */}
                                                            <div className="mt-4 pt-4 space-y-3">
                                                                <Button
                                                                    onClick={handlePayment}
                                                                    disabled={!anyPlanSelected}
                                                                    className={`w-full py-5 rounded-xl font-medium text-base ${anyPlanSelected
                                                                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white'
                                                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                                        }`}
                                                                >
                                                                    Secure Checkout • ₹{formatPrice(discountedPrice * 1.18)}
                                                                </Button>

                                                                <Button
                                                                    onClick={prevStep}
                                                                    variant="outline"
                                                                    className="w-full border-gray-300 rounded-xl py-5"
                                                                >
                                                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Details
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                                <div className="md:col-span-2 space-y-6">
                                                    {/* Volume Discount Info */}
                                                    <Card className="border bg-transparent border-indigo-100">
                                                        <CardContent className="p-5">
                                                            <div className="flex items-start gap-4">
                                                                <div className="bg-indigo-50 p-2 rounded-lg">
                                                                    <Info className="h-5 w-5 text-indigo-600" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900">Special Discount Information</h4>
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        {getTotalUserCount() >= 5
                                                                            ? "You're eligible for 50% discount with 5+ total users across all products!"
                                                                            : "Add " + (5 - getTotalUserCount()) + " more user(s) to unlock a 50% discount!"}
                                                                    </p>

                                                                    {subscriptionTerm > 1 && (
                                                                        <p className="text-sm text-gray-600 mt-2">
                                                                            {subscriptionTerm === 3
                                                                                ? "With 3-year plan, you pay for 2 years and get 1 year FREE!"
                                                                                : "With 5-year plan, you pay for 3 years and get 2 years FREE!"}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>

                                                    {/* Wallet Bonus Card - only show if eligible */}
                                                    {getTotalUserCount() >= 20 && (
                                                        <Card className="border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
                                                            <CardContent className="p-5">
                                                                <div className="flex gap-4">
                                                                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg h-fit text-white">
                                                                        <Star className="h-5 w-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-semibold text-gray-900">Wallet Bonus: ₹{formatPrice(walletBonus)}</h4>
                                                                        <p className="text-sm text-gray-600 mt-1">
                                                                            For purchasing 20+ users, we&apos;ll credit your account with a wallet bonus that can be used for future purchases or upgrades.
                                                                        </p>
                                                                        <Badge className="mt-2 bg-green-100 text-green-800 hover:bg-green-100">Premium Benefit</Badge>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    )}

                                                    {/* Trust Badges */}
                                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                                        <h4 className="font-medium text-gray-700 mb-4 text-center">Trusted by businesses like yours</h4>
                                                        <div className="flex flex-wrap items-center justify-center gap-6">
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <Shield className="h-5 w-5 text-purple-600" />
                                                                <span className="text-sm font-medium">Secure Payment</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <BadgeCheck className="h-5 w-5 text-green-600" />
                                                                <span className="text-sm font-medium">24/7 Support</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-700">
                                                                <BadgeDollarSign className="h-5 w-5 text-amber-600" />
                                                                <span className="text-sm font-medium">Free Onboarding</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>



                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default MultiStepForm;