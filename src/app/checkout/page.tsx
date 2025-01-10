'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from 'next/navigation';
import { TestimonialCards } from '@/components/globals/testimonialscards';
import Testimonials2 from '@/components/globals/testimonials2';
import TestimonialsCopy from '@/components/globals/testimonialscopy';
import axios from 'axios';
import { Rocket, Wallet } from 'lucide-react';
import { RocketIcon } from '@radix-ui/react-icons';
import CountryDropdown from '@/components/globals/country';


export default function Checkout() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const amount = searchParams.get('amount');
    const plan = searchParams.get('plan');
    const [rechargeAmount, setRechargeAmount] = useState(Number(amount) || 5000);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [organizationName, setOrganizationName] = useState("");
    const [whatsappNo, setWhatsappNo] = useState("");
    const [email, setEmail] = useState("");
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        whatsappNo: '',
        organizationName: "",
        country: '',
        state: '',
        gstin: '',
        paymentMethod: ''
    });
    const [currentUser, setCurrentUser] = useState<any>();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    useEffect(() => {
        if (amount && plan) {
            setRechargeAmount(parseFloat(amount as string));
            setSelectedPlan(decodeURIComponent(plan as string));
        }
    }, [amount, plan]);


    useEffect(() => {
        const getUserDetails = async () => {
            const res = await axios.get('/api/users/me')
            setCurrentUser(res.data.data);
        }
        getUserDetails();
    }, [])


    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const totalAmount = rechargeAmount + (rechargeAmount * 0.18);

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const userRes = await axios.get('/api/users/me');
                const userData = userRes.data.data;

                // Fetch trial status
                const response = await axios.get('/api/organization/getById');
                const organizationName = response.data.data.companyName;
                console.log(organizationName, 'okay?')
                setFormData({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    whatsappNo: userData.whatsappNo,
                    organizationName: organizationName || '',
                    country: '',
                    state: '',
                    gstin: '',
                    paymentMethod: ''
                });
            } catch (error) {
                console.error('Error fetching user details ', error);
            }
        };

        getUserDetails();
    }, []);
    console.log(firstName, lastName, email, whatsappNo);



    const handlePayment = async () => {
        const orderData = {
            amount: totalAmount * 100, // amount in paisa
            currency: 'INR',
            receipt: 'receipt_order_123456',
            notes: {
                email: formData.email,
                whatsappNo: formData.whatsappNo,
                planName: plan // Include the plan name here
            },
        };

        try {
            // Step 1: Create the order on the backend
            const { data } = await axios.post('/api/create-order', orderData);

            if (!data.orderId) {
                throw new Error('Order ID not found in the response');
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
                amount: orderData.amount,
                currency: orderData.currency,
                name: plan,
                description: `Payment for ${plan}`,
                image: '/logo.png',
                order_id: data.orderId, // Use the order ID from the response
                handler: async (response: any) => {
                    const paymentResult = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        planName: plan // Include the plan name here
                    };

                    // Step 2: Verify the payment signature
                    try {
                        const { data: verificationResult } = await axios.post('/api/payment-success', {
                            ...paymentResult,
                            userId: currentUser._id, // Pass the actual user ID here
                            amount: orderData.amount / 100, // Amount in the correct format
                        });

                        if (verificationResult.success) {
                            // Redirect to the success page
                            router.push('/payment-success');
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Error verifying payment: ', error);
                        alert('Error verifying payment. Please try again.');
                    }
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.whatsappNo,
                },
                notes: {
                    address: 'Corporate Office',
                },
                theme: {
                    color: '#007A5A',
                },
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error('Error creating order: ', error);
            alert('Error creating order. Please try again.');
        }
    };

    return (
        <>
            {/* <h1 className='text-center font-bold mt-4 text-xl'>Task Management App</h1> */}
            <div className='w-full flex  px-4 pt-4 bg-[#04061E]  justify-center'>
            </div>
            <div className="px-24 py-8 bg-[#04061E]  ">
                <div className='  rounded rounded-b-none py-2  text-center bg-[#007A5A] '>
                    <div className='flex gap-4 w-full justify-center'>
                        <RocketIcon className='h-7 ' /> <h1 className='font-medium text-xl'>Put your Business on Autopilot - 10X your Growth and Productivity with Zapllo</h1>
                    </div>

                    <div>
                        <p className='text-sm'>Enter Details to Complete Purchase</p>

                    </div>
                </div>
                <div className='grid grid-cols-1 border text-sm md:grid-cols-2 gap-8  '>
                    <div className="grid gap-6">
                        <Card className='bg-transparent  rounded-t-none '>
                            <CardHeader>
                                <CardTitle className='text-lg'>{plan}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='border p-4 rounded'>
                                    <label className="block my-4">
                                        <span className="">Recharge Amount (exclu. GST):</span>
                                        <input
                                            type="number"
                                            value={rechargeAmount}
                                            onChange={(e) => setRechargeAmount(Math.max(5000, Number(e.target.value)))}
                                            className="block bg-[#0A0D28] w-full outline-none mt-2 p-2 border rounded"
                                            min="5000"
                                        />
                                    </label>
                                </div>

                                {/* <Separator /> */}
                                <div className='grid grid-cols-2 gap-4'>
                                    <label className="block my-4">
                                        {/* <span className="">First Name:</span> */}
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder='First Name'
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="block bg-[#0A0D28] w-full mt-1 outline-none p-2 border rounded"
                                        />
                                    </label>
                                    <label className="block my-4">
                                        {/* <span className="">Last Name:</span> */}
                                        <input
                                            type="text"
                                            placeholder='Last Name'
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="block bg-[#0A0D28] w-full outline-none mt-1 p-2 border rounded"
                                        />
                                    </label>
                                </div>

                                <label className="block my-4">

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder='Email'
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="block bg-[#0A0D28] w-full outline-none mt-1 p-2 border rounded"
                                    />
                                </label>
                                <label className="block my-4">
                                    {/* <span className="">Organ:</span> */}
                                    <input
                                        type="organizationName"
                                        name="organizationName"
                                        placeholder='OrganizationName'
                                        value={formData.organizationName}
                                        onChange={handleInputChange}
                                        className="block bg-[#0A0D28] w-full outline-none mt-1 p-2 border rounded"
                                    />
                                </label>
                                <label className="block my-4">
                                    {/* <span className="">Mobile Number:</span> */}
                                    <input
                                        type="text"
                                        name="whatsappNo"
                                        value={formData.whatsappNo}
                                        placeholder='WhatsApp No'
                                        onChange={handleInputChange}
                                        className="block bg-[#0A0D28] w-full outline-none mt-1 p-2 border rounded"
                                    />
                                </label>
                                {/* <Separator /> */}
                                <label className="block my-4">
                                    <CountryDropdown />
                                </label>
                                <label className="block my-4">
                                    <span className="">GSTIN (optional):</span>
                                    <input
                                        type="text"
                                        name="gstin"
                                        value={formData.gstin}
                                        onChange={handleInputChange}
                                        className="block bg-[#0A0D28] w-full outline-none mt-1 p-2 border rounded"
                                    />
                                </label>
                                <Separator />
                                <label className="block my-4">
                                    <span className="">Payment Method:</span>
                                    <select
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleInputChange}
                                        className="block bg-[#0A0D28] w-full outline-none mt-1 p-2 border rounded"
                                    >
                                        <option value="">Select Payment Method</option>
                                        {/* Add payment method options here */}
                                    </select>
                                </label>
                            </CardContent>
                            <CardFooter>
                                <div>
                                    <h1 className='text-lg'>Your Payment Information</h1>
                                    <img src='/brands/razorpay.png' className='mb-2 mt-2' />
                                    <p className='text-xs'>By clicking checkout now, you agree to the {' '}
                                        <a className='text-[#3281F6]' href='/terms'>
                                            Term of Service
                                        </a> and   {' '}
                                        <a className='text-[#3281F6]' href='/privacypolicy'>
                                            Privacy Policy
                                        </a></p>
                                    <Button className="w-full bg-[#007A5A]  hover:bg-[#007A5A] mt-2"
                                        onClick={handlePayment}>
                                        Checkout Now
                                    </Button>
                                    <div className='flex justify-center w-full'>
                                        <img src='/brands/payment.png' className='mt-2 ' />
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="grid gap-6 mt-4">
                        <Card className='bg-transparent rounded-t-none'>
                            <CardHeader>
                                <CardTitle className='text-lg mt-auto flex gap-4'>


                                    <div className='h-12 w-12 border  rounded-full justify-center flex items-center'>
                                        <Wallet />
                                    </div>
                                    <h1 className='mt-2'>
                                        Purchase Details
                                    </h1>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between my-2">
                                    <span className="">Recharge Amount:</span>
                                    <span className="text-xl font-bold">₹ {rechargeAmount}</span>
                                </div>
                                <div className="flex justify-between my-2">
                                    <span className="">GST (18%):</span>
                                    <span className="text-xl font-bold">₹ {(rechargeAmount * 0.18).toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between my-2">
                                    <span className="">Total Amount:</span>
                                    <span className="text-2xl font-bold">₹ {totalAmount.toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className='bg-transparent'>
                            <CardContent>
                                <div className='py-4'>
                                    <h2 className="text-lg font-bold">What All You Get</h2>
                                    <p className="mt-4"> Recharge Business Workspace Wallet to Subscribe to Apps and Add More users.
                                    </p>
                                    <p className='mt-4'>
                                        Note- Amount will be added to the wallet after deducting 18% GST
                                    </p>
                                </div>

                            </CardContent>
                        </Card>
                        <Card className='w-full bg-transparent'>
                            <CardContent>
                                <h1 className='py-4 font-bold text-xl text-start'>5000+ Satisfied Customers!</h1>

                                <div className='grid grid-cols-1 -mt-8 gap-4 p-8'>
                                    <div className="radial-gradient md:flex scale-75 gap-4 border rounded-lg ">
                                        <div className='p-4  w-full'>
                                            <img src='testimonial1.svg' className='rounded-lg' />
                                        </div>
                                        <div className='p-4  w-full'>
                                            <div className='flex justify-center md:block'>
                                                <img src='star.png' className='' />

                                            </div>
                                            <h1 className='mt-4  mx-4 md:mx-0 font-semibold md:font-bold'>Helped TTA with Product Management and Internal Workflow</h1>
                                        </div>

                                    </div>
                                    <div className="radial-gradient md:flex scale-90 border  -mt-16 gap-4 rounded-lg ">
                                        <div className='p-4  w-full'>
                                            <img src='bald.png' className='rounded-lg' />
                                        </div>
                                        <div className='p-4  w-full'>
                                            <div className='flex justify-center md:block'>
                                                <img src='star.png' className='' />

                                            </div>
                                            <h1 className='mt-4  mx-4 md:mx-0 font-semibold md:font-bold'>Helped TTA with Product Management and Internal Workflow</h1>
                                        </div>

                                    </div>
                                    <div className="radial-gradient -mt-16 border rounded-lg z-[100] md:flex gap-4 ">
                                        <div className='p-4  w-full'>
                                            <img src='Ben.png' className='' />
                                        </div>
                                        <div className='p-4  w-full'>
                                            <div className='flex justify-center md:block'>
                                                <img src='star.png' className='' />

                                            </div>
                                            <h1 className='mt-4  mx-4 md:mx-0 font-semibold md:font-bold'>How BeSpokeMedia saved hours daily on Content Creation</h1>

                                        </div>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
