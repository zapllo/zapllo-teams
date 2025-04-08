'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, Clock, Search, Tag, Wallet } from 'lucide-react';
import { AsYouType, CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { getData as getCountryData } from 'country-list';
import { Country as ICountry, State } from 'country-state-city';
import Flag from "react-world-flags";
import { toast } from "sonner";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


interface Country {
    code: CountryCode;
    name: string;
}

export default function SpecialOfferPage() {
    // Form state
    const [selectedPlan, setSelectedPlan] = useState('pay1Lakh');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [industry, setIndustry] = useState('');
    const [whatsappNo, setWhatsappNo] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [states, setStates] = useState<any[]>([]);
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [gstin, setGstin] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Country selection related states
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>("IN");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [countries, setCountries] = useState<Country[]>([]);
    const [countryCode, setCountryCode] = useState('+91'); // Default country code for India

    const router = useRouter();

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

        // Initialize states for default country (India)
        const indianStates = State.getStatesOfCountry("IN");
        setStates(indianStates);
    }, []);

    // Update states when country changes
    useEffect(() => {
        if (selectedCountry) {
            const countryStates = State.getStatesOfCountry(selectedCountry);
            setStates(countryStates);
        }
    }, [selectedCountry]);

    const handleCountryChange = (code: CountryCode) => {
        const phoneCode = getCountryCallingCode(code);
        setCountryCode(`+${phoneCode}`);
        setSelectedCountry(code);
        setCountry(countries.find(c => c.code === code)?.name || '');
        setIsDropdownOpen(false);

        // Reset state when country changes
        setState('');
        setStateCode('');

        // Update states for the new country
        const countryStates = State.getStatesOfCountry(code);
        setStates(countryStates);
    };

    const handleStateChange = (value: string) => {
        const selectedState = states.find(s => s.isoCode === value);
        if (selectedState) {
            setState(selectedState.name);
            setStateCode(value);
        }

        // Clear state-related errors
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.state;
            return newErrors;
        });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const phoneNumber = new AsYouType().input(e.target.value);
        setWhatsappNo(phoneNumber);
    };

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const plans = [
        {
            id: 'pay50k',
            title: 'Pay 50K+GST',
            get: '₹62.5K in Wallet',
            recommended: false
        },
        {
            id: 'pay1Lakh',
            title: 'Pay 1 Lakh+GST',
            get: '₹1.5 Lakh in Wallet',
            recommended: true
        },
        {
            id: 'pay1.5Lakh',
            title: 'Pay 1.5 Lakh+GST',
            get: '₹2.25 Lakhs in Wallet',
            recommended: false
        },
        {
            id: 'pay2Lakh',
            title: 'Pay 2 Lakh+GST',
            get: '₹3 Lakhs in Wallet',
            recommended: false
        },
    ];

    const selectedPlanDetails = plans.find(plan => plan.id === selectedPlan) || plans[1]; // Default to 1 Lakh plan
    const totalAmount = selectedPlan === 'pay50k' ? 59000 :
        selectedPlan === 'pay1Lakh' ? 118000 :
            selectedPlan === 'pay1.5Lakh' ? 177000 : 236000;

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: string, value: string) => {
        setter(value);
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!firstName.trim()) newErrors.firstName = "First name is required";
        if (!lastName.trim()) newErrors.lastName = "Last name is required";
        if (!email.trim()) newErrors.email = "Email is required";
        if (email && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";
        if (!companyName.trim()) newErrors.companyName = "Company name is required";
        if (!industry.trim()) newErrors.industry = "Industry is required";
        if (!whatsappNo.trim()) newErrors.whatsappNo = "Phone number is required";
        if (!country.trim()) newErrors.country = "Country is required";
        if (!state.trim()) newErrors.state = "State is required";
        if (!city.trim()) newErrors.city = "City is required";
        if (!billingAddress.trim()) newErrors.billingAddress = "Billing address is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckout = async () => {
        if (!validateForm()) {
            toast.error("Please fill all required fields correctly.");
            return;
        }

        setIsLoading(true);

        try {
            // Create order
            const orderResponse = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    planName: selectedPlanDetails.title,
                    firstName,
                    lastName,
                    email,
                    companyName,
                    phoneNumber: whatsappNo,
                    country,
                    state,
                    city,
                    pincode,
                    billingAddress,
                    gstin
                }),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create order');
            }

            const orderData = await orderResponse.json();

            // Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: totalAmount * 100, // amount in smallest currency unit
                currency: "INR",
                name: "Zapllo",
                description: `Special Wallet Deal - ${selectedPlanDetails.title}`,
                order_id: orderData.id,
                handler: async function (response: any) {
                    try {
                        // Call onboardingSuccess instead of payment-success
                        const verifyResponse = await fetch('/api/onboardingSuccess', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                firstName: firstName,
                                lastName: lastName,
                                companyName: companyName,
                                industry: industry,
                                email: email,
                                countryCode: selectedCountry,
                                whatsappNo: whatsappNo,
                                amount: totalAmount,
                                planName: `Wallet Deal - ${selectedPlanDetails.title}`,
                                subscribedUserCount: "Wallet Package",
                            }),
                        });

                        if (!verifyResponse.ok) {
                            throw new Error('Payment verification failed');
                        }

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

                        router.push('/dashboard');
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        toast.error("Payment Verification Failed. There was an issue verifying your payment. Please contact support.");
                    }
                },
                prefill: {
                    name: `${firstName} ${lastName}`,
                    email: email,
                    contact: whatsappNo,
                },
                theme: {
                    color: "#7451F8",
                },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error("Checkout Failed. There was an error processing your checkout. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Add Razorpay script when component mounts
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="bg-gradient-to-br from-slate-50 p-6 to-blue-50 min-h-screen">
            <div className="container mx-auto py-8 px-4 md:px-0">
                {/* Header */}
                <div className="text-center mb-8">
                    <img
                        src="https://res.cloudinary.com/dndzbt8al/image/upload/v1743846882/logo-01_1_a2qvzt.png"
                        alt="Zapllo Logo"
                        className="mx-auto h-12 mb-4"
                    />
                    <h1 className="text-3xl font-bold text-slate-900">Put Your Business On Autopilot with Zapllo</h1>
                    <p className="text-slate-600 mt-2">Save more than 50% with our Special Wallet Deal</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Plans */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg border-0">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-bold text-black flex items-center">
                                    <Tag className="mr-2 text-primary" size={20} />
                                    Select a Plan - Save More than 50%
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                {/* Product Boxes */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                                >
                                    <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-center">
                                        <Image
                                            src="/mockups/task.png"
                                            alt="Automate Tasks"
                                            width={250}
                                            height={250}
                                        />
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg flex items-center justify-center">
                                        <Image
                                            src="/mockups/attendance.png"
                                            alt="Automate CRM"
                                            width={200}
                                            height={200}
                                        />
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg flex items-center justify-center">
                                        <Image
                                            src="/mockups/leave.png"
                                            alt="Automation Bundle"
                                            width={130}
                                            height={130}
                                        />
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg flex items-center justify-center">
                                        <Image
                                            src="/mockups/payslip.jpg"
                                            alt="Automate Payslip"
                                            width={250}
                                            height={250}
                                        />
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg flex items-center justify-center">
                                        <Image
                                            src="/mockups/whatsapp.png"
                                            alt="Automate Attendance"
                                            width={250}
                                            height={250}
                                        />
                                    </div>
                                </motion.div>

                                {/* Plan Selection */}
                                <div className="space-y-4 my-6">
                                    {plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={`relative flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedPlan === plan.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            onClick={() => setSelectedPlan(plan.id)}
                                        >
                                            <div className="flex-shrink-0 h-5 w-5 mr-4">
                                                <div className={`h-full w-full rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'border-primary' : 'border-gray-300'
                                                    }`}>
                                                    {selectedPlan === plan.id && (
                                                        <div className="h-3 w-3 rounded-full bg-primary" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{plan.title}</h3>
                                                <p className="text-gray-600">{plan.get}</p>
                                            </div>

                                            {plan.recommended && (
                                                <Badge variant="default" className="ml-auto">
                                                    Recommended
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* User Information */}
                                <div className="mt-8 text-black">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <div className="bg-primary/10 flex p-2 h-12 w-12 items-center rounded-full mr-2">
                                            <div className="text-primary flex items-center m-auto">1</div>
                                        </div>
                                        Your Basic Information
                                    </h3>

                                    <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="flex items-center text-black">
                                                First Name <span className="text-destructive ml-1">*</span>
                                            </Label>
                                            <Input
                                                id="firstName"
                                                value={firstName}
                                                onChange={(e) => handleInputChange(setFirstName, 'firstName', e.target.value)}
                                                placeholder="First Name"
                                                className={errors.firstName ? "border-destructive text-black" : "text-black"}
                                            />
                                            {errors.firstName && (
                                                <p className="text-destructive text-xs mt-1">{errors.firstName}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="flex items-center">
                                                Last Name <span className="text-destructive ml-1">*</span>
                                            </Label>
                                            <Input
                                                id="lastName"
                                                value={lastName}
                                                onChange={(e) => handleInputChange(setLastName, 'lastName', e.target.value)}
                                                placeholder="Last Name"
                                                className={errors.lastName ? "border-destructive text-black" : "text-black"}
                                            />
                                            {errors.lastName && (
                                                <p className="text-destructive text-xs mt-1">{errors.lastName}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="flex items-center">
                                                Email Address <span className="text-destructive ml-1">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => handleInputChange(setEmail, 'email', e.target.value)}
                                                placeholder="Email Address"
                                                className={errors.email ? "border-destructive text-black" : " text-black"}
                                            />
                                            {errors.email && (
                                                <p className="text-destructive text-xs mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="companyName" className="flex items-center">
                                                Company Name <span className="text-destructive ml-1">*</span>
                                            </Label>
                                            <Input
                                                id="companyName"
                                                value={companyName}
                                                onChange={(e) => handleInputChange(setCompanyName, 'companyName', e.target.value)}
                                                placeholder="Company Name"
                                                className={errors.companyName ? "border-destructive text-black" : " text-black"}
                                            />
                                            {errors.companyName && (
                                                <p className="text-destructive text-xs mt-1">{errors.companyName}</p>
                                            )}
                                        </div>

                                        {/* Industry Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="industry" className="flex items-center">
                                                Industry <span className="text-destructive ml-1">*</span>
                                            </Label>
                                            <Select
                                                value={industry}
                                                onValueChange={(value) => handleInputChange(setIndustry, 'industry', value)}
                                            >
                                                <SelectTrigger className={errors.industry ? "border-destructive text-black" : " text-black"}>
                                                    <SelectValue placeholder="Select an industry" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Retail/E-Commerce">Retail/E-Commerce</SelectItem>
                                                    <SelectItem value="Technology">Technology</SelectItem>
                                                    <SelectItem value="Service Provider">Service Provider</SelectItem>
                                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                                    <SelectItem value="Logistics">Logistics</SelectItem>
                                                    <SelectItem value="Financial Consultants">Financial Consultants</SelectItem>
                                                    <SelectItem value="Trading">Trading</SelectItem>
                                                    <SelectItem value="Education">Education</SelectItem>
                                                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                                    <SelectItem value="Real Estate/Construction">Real Estate/Construction</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.industry && (
                                                <p className="text-destructive text-xs mt-1">{errors.industry}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="whatsappNo" className="flex items-center">
                                                WhatsApp Number <span className="text-destructive ml-1">*</span>
                                            </Label>
                                            <div className="flex">
                                                <div className="w-24">
                                                    <div
                                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                        className="flex w-full h-full items-center cursor-pointer border rounded-l-md p-2 relative"
                                                    >
                                                        {selectedCountry && (
                                                            <Flag code={selectedCountry} className="w-6 h-4 mr-1" />
                                                        )}
                                                        <span className="text-xs ">+{getCountryCallingCode(selectedCountry)}</span>
                                                    </div>

                                                    {isDropdownOpen && (
                                                        <div className="absolute left-0 top-full mt-1 w-64 max-h-60 overflow-y-auto bg-white p-2 border rounded z-50 shadow-md">
                                                            <div className="flex items-center p-2 border rounded mb-2 bg-white">
                                                                <Search className="h-4 w-4 mr-2 text-gray-400" />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search Country"
                                                                    value={searchQuery}
                                                                    onChange={e => setSearchQuery(e.target.value)}
                                                                    className="w-full text-xs focus:outline-none bg-transparent"
                                                                />
                                                            </div>
                                                            {filteredCountries.map(country => (
                                                                <div
                                                                    key={country.code}
                                                                    className="flex  items-center p-2  text-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900 rounded"
                                                                    onClick={() => handleCountryChange(country.code)}
                                                                >
                                                                    <Flag code={country.code} className="w-6 h-4 mr-2" />
                                                                    {country.name} (+{getCountryCallingCode(country.code)})
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <Input
                                                    id="whatsappNo"
                                                    value={whatsappNo}
                                                    onChange={handlePhoneChange}
                                                    placeholder="WhatsApp Number"
                                                    className={`flex-1 rounded-l-none h-10 text-black ${errors.whatsappNo ? "border-destructive text-black" : ""}`}
                                                />
                                            </div>
                                            {errors.whatsappNo && (
                                                <p className="text-destructive text-xs mt-1">{errors.whatsappNo}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Billing Address */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <div className="bg-primary/10 flex p-2 h-12 w-12 items-center rounded-full mr-2">
                                            <div className="text-primary flex items-center m-auto">2</div>
                                        </div>
                                        Billing Address
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Country Dropdown - Modified to match signup page style */}
                                        <div className="space-y-2">
                                            <Label htmlFor="country" className="flex items-center">
                                                Country <span className="text-destructive ml-1">*</span>
                                            </Label>
                                            <div className="relative">
                                                <div
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    className="flex w-full items-center cursor-pointer border rounded p-3 relative"
                                                >
                                                    {selectedCountry && (
                                                        <Flag code={selectedCountry} className="w-6 h-4 mr-2" />
                                                    )}
                                                    <button className="w-full text-left text-sm focus:outline-none">
                                                        {countries.find(country => country.code === selectedCountry)?.name || "Select Country"}
                                                    </button>
                                                </div>

                                                {isDropdownOpen && (
                                                    <div className="absolute left-0 top-full w-full max-h-60 overflow-y-auto bg-background p-2 border rounded z-50 shadow-md">
                                                        <div className="flex items-center p-2 border rounded mb-2 bg-background">
                                                            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                                                            <input
                                                                type="text"
                                                                placeholder="Search Country"
                                                                value={searchQuery}
                                                                onChange={e => setSearchQuery(e.target.value)}
                                                                className="w-full text-xs focus:outline-none bg-transparent"
                                                            />
                                                        </div>
                                                        {filteredCountries.map(country => (
                                                            <div
                                                                key={country.code}
                                                                className="flex items-center p-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                                                                onClick={() => handleCountryChange(country.code)}
                                                            >
                                                                <Flag code={country.code} className="w-6 h-4 mr-2" />
                                                                {country.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {errors.country && (
                                                <p className="text-destructive text-xs mt-1">{errors.country}</p>
                                            )}
                                        </div>


                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="state" className="flex items-center">
                                                    State <span className="text-destructive ml-1">*</span>
                                                </Label>
                                                <Select
                                                    value={stateCode}
                                                    onValueChange={handleStateChange}
                                                >
                                                    <SelectTrigger className={errors.state ? "border-destructive text-black" : "text-black"}>
                                                        <SelectValue placeholder="Select a state" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {states.length > 0 ? (
                                                            states.map((state) => (
                                                                <SelectItem key={state.isoCode} value={state.isoCode}>
                                                                    {state.name}
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem value="no-states" disabled>
                                                                No states available for this country
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.state && (
                                                    <p className="text-destructive text-xs mt-1">{errors.state}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city" className="flex items-center">
                                                    City <span className="text-destructive ml-1">*</span>
                                                </Label>
                                                <Input
                                                    id="city"
                                                    value={city}
                                                    onChange={(e) => handleInputChange(setCity, 'city', e.target.value)}
                                                    placeholder="City"
                                                    className={errors.city ? "border-destructive text-black" : " text-black"}
                                                />
                                                {errors.city && (
                                                    <p className="text-destructive text-xs mt-1">{errors.city}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pincode">Pincode</Label>
                                            <Input
                                                id="pincode"
                                                value={pincode}
                                                className='text-black'
                                                onChange={(e) => handleInputChange(setPincode, 'pincode', e.target.value)}
                                                placeholder="Pincode"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="billingAddress" className="flex items-center">
                                                Billing Address <span className="text-destructive ml-1">*</span>
                                            </Label>
                                            <Input
                                                id="billingAddress"
                                                value={billingAddress}
                                                onChange={(e) => handleInputChange(setBillingAddress, 'billingAddress', e.target.value)}
                                                placeholder="Billing address"
                                                className={errors.billingAddress ? "border-destructive text-black" : " text-black"}
                                            />
                                            {errors.billingAddress && (
                                                <p className="text-destructive text-xs mt-1">{errors.billingAddress}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="gstin">GSTIN (optional)</Label>
                                            <Input
                                                id="gstin"
                                                value={gstin}
                                                className='text-black'
                                                onChange={(e) => handleInputChange(setGstin, 'gstin', e.target.value)}
                                                placeholder="GSTIN (optional)"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="mt-8">
                                    <div className="border rounded-lg p-4">
                                        <div className="flex items-center">
                                            <img src="/brands/razorpay.png" alt="Razorpay" className="h-8 mr-2" />
                                            <span className="font-medium">Secure payment via Razorpay</span>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <img src="/brands/payment.png" alt="Net Banking" className="h-6" />
                                        </div>
                                    </div>

                                    <div className="mt-4 text-sm text-gray-500">
                                        By clicking Checkout Now, you agree to the <a href="/terms" className="text-primary underline">Terms of Service</a> and <a href="/privacy" className="text-primary underline">Privacy Policy</a>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-0">
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handleCheckout}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Processing..." : "Checkout Now"} {!isLoading && "→"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <Card className="shadow-lg border-0 ">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl flex text-black items-center gap-2">
                                        <Wallet className="text-primary" size={20} />
                                        Purchase Details
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-900">Business Workspace</h3>
                                        <div className="flex justify-between items-center mt-2 text-gray-700">
                                            <span>{selectedPlanDetails?.title}</span>
                                            <span>₹{totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center font-semibold text-lg">
                                        <span>Total</span>
                                        <span>₹{totalAmount.toLocaleString()}</span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <h3 className="font-medium text-lg text-gray-900 mb-3">What All You Get?</h3>

                                        <div className="space-y-3">
                                            <div className="bg-white p-3 rounded-lg flex items-start space-x-3">
                                                <Wallet className="text-primary flex-shrink-0 mt-0.5" size={18} />
                                                <div>
                                                    <p className="font-medium">Wallet Bonus:</p>
                                                    <p>₹{selectedPlan === 'pay50k' ? '62,500' :
                                                        selectedPlan === 'pay1Lakh' ? '1,50,000' :
                                                            selectedPlan === 'pay1.5Lakh' ? '2,25,000' : '3,00,000'} in your wallet</p>
                                                </div>
                                            </div>

                                            <div className="bg-white p-3 rounded-lg flex items-start space-x-3">
                                                <Tag className="text-primary flex-shrink-0 mt-0.5" size={18} />
                                                <div>
                                                    <p className="font-medium">AND</p>
                                                    <p>1 Business Automation Summit Ticket worth INR 25k</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <h3 className="font-medium text-lg text-gray-900 mb-2">How to Use Wallet Balance:</h3>

                                        {[
                                            "Subscribe to any of our apps and modules at 50% price",
                                            "Add more users to your subscriptions at 50% price",
                                            "Renew your apps for future years at 50% price",
                                            "Subscribe to new & upcoming apps at 50% price"
                                        ].map((item, index) => (
                                            <div key={index} className="flex items-start space-x-2">
                                                <div className="bg-primary/10 rounded-full p-1 flex-shrink-0 mt-0.5">
                                                    <Check className="text-primary" size={14} />
                                                </div>
                                                <p className="text-sm">{item}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <h3 className="font-medium text-gray-900">Wallet Perks:</h3>

                                        <div className="flex items-start space-x-2">
                                            <div className="bg-primary/10 rounded-full p-1 flex-shrink-0 mt-0.5">
                                                <Check className="text-primary" size={14} />
                                            </div>
                                            <p className="text-sm">Your wallet balance lasts forever, No Expiry</p>
                                        </div>

                                        <div className="flex items-start space-x-2">
                                            <div className="bg-primary/10 rounded-full p-1 flex-shrink-0 mt-0.5">
                                                <Clock className="text-primary" size={14} />
                                            </div>
                                            <p className="text-sm font-medium text-amber-600">This is a very special, limited-time offer!</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading overlay */}
            {isLoading && (
                <div className="fixed inset-0  backdrop-blur-md flex items-center justify-center z-50">
                    <Card className="max-w-md w-full p-8 border-0 shadow-2xl">
                        <DotLottieReact
                            src="/lottie/loader.lottie"
                            loop
                            className="h-32 mx-auto"
                            autoplay
                        />
                        <h1 className="text-center text-2xl font-bold mt-4 text-black -100">Processing Your Payment</h1>
                        <p className="text-black -200 text-center mt-2">Please wait while we confirm your transaction</p>
                    </Card>
                </div>
            )}
        </div>
    );
}
