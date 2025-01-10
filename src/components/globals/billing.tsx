// pages/billing.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogOverlay, DialogContent, DialogClose } from "@/components/ui/dialog";
import BillingSidebar from '../sidebar/billingSidebar';
import { Clock, UserPlus2, Users2, Wallet } from "lucide-react";
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';
import { DialogTitle } from '@radix-ui/react-dialog';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type PlanKeys = 'Zapllo Tasks' | 'Money Saver Bundle';

export default function Billing() {
    const [activeTab, setActiveTab] = useState('Active');
    const [planTab, setPlanTab] = useState('Zapllo Teams');
    const [planCard, setPlanCard] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanKeys | null>(null);
    const [userCount, setUserCount] = useState(5);
    const [rechargeAmount, setRechargeAmount] = useState(5000);
    const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>();
    const [displayedPlan, setDisplayedPlan] = useState('');
    const [modalStep, setModalStep] = useState(1);
    const [rechargeModalStep, setRechargeModalStep] = useState(1);
    const [gstNumber, setGstNumber] = useState('');
    const [rechargeGstNumber, setRechargeGstNumber] = useState('');
    const [subscribedUserCount, setSubscribedUserCount] = useState<number>(0); // State for subscribed user  
    const [orgCredits, setOrgCredits] = useState<number>(0); // State for subscribed user  
    const [additionalUserCount, setAdditionalUserCount] = useState<number | null>(null);
    const [totalUserCount, setTotalUserCount] = useState<number>(0); // Total after adding
    const [renewsOn, setRenewsOn] = useState<any>();
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    const router = useRouter();




    const getUserDetails = async () => {
        const res = await axios.get('/api/users/me');
        setCurrentUser(res.data.data);

        const response = await axios.get('/api/organization/getById');
        console.log(response.data.data); // Log the organization data
        const organization = response.data.data;
        console.log(organization, 'organization')
        if (organization) {
            setDisplayedPlan(organization.subscribedPlan);
            setOrgCredits(organization.credits);
            setSubscribedUserCount(organization.subscribedUserCount);
            setTotalUserCount(organization.subscribedUserCount);
        }
        // Check if the trial has expired
        setRenewsOn(organization.subscriptionExpires);
        // Fetch the order information including subscribed user count

    };

    useEffect(() => {
        getUserDetails();
    }, []);

    console.log(subscribedUserCount, 'subscribed user count for the latest order')
    console.log(displayedPlan, 'displayed plan')

    const calculatePaymentDetails = (planCost: number, count: number) => {
        const subtotal = planCost * count;
        const discount = Math.min(orgCredits || 0, subtotal);
        const payableExclGST = Math.max(0, subtotal - discount);
        const gst = payableExclGST * 0.18;
        const total = payableExclGST + gst;

        return { subtotal, discount, payableExclGST, gst, total };
    };

    const plans = {
        'Zapllo Tasks': 1999,
        'Money Saver Bundle': 2999,
    };

    const handleOpenDialog = () => {
        setIsAddUserOpen(true);
        setTotalUserCount(subscribedUserCount + 5); // Update total users with the default
    };


    const handleUserSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCount = e.target.value ? parseInt(e.target.value, 10) : null; // Handle "Select Number of Users"
        setAdditionalUserCount(selectedCount);
        setTotalUserCount(subscribedUserCount + (selectedCount || 0)); // Update total count only if valid
    };



    useEffect(() => {
        setTotalUserCount(subscribedUserCount + (additionalUserCount ?? 0));
    }, [subscribedUserCount, additionalUserCount]);


    console.log(currentUser?._id, 'id')

    const handleConfirmUsers = async () => {
        const plan = selectedPlan as PlanKeys;
        const { subtotal, discount, payableExclGST, gst, total } = calculatePaymentDetails(plans[plan], userCount);
        try {
            // Deduct applied credits from the wallet first
            setIsAddUserOpen(false);
            setIsPaymentProcessing(true);


            const walletDeductionResponse = await axios.post('/api/wallet/deduct', {
                userId: currentUser?._id,
                amount: discount, // Deduct only the applied discount amount
            });

            if (!walletDeductionResponse.data.success) {
                toast.error('Failed to deduct credits. Please try again.');
                return;
            }

            // Show success message for credit deduction
            // toast.success(`Discount of ₹${discount} applied using wallet credits.`);

            // If the total payable amount is zero, complete the payment here
            if (total === 0) {
                // Handle user count update
                const updateUserCountResponse = await axios.post('/api/organization/update-user-count', {
                    organizationId: currentUser?.organization,
                    subscribedUserCount: totalUserCount, // Updated total user count
                    additionalUserCount: additionalUserCount || 0, // Newly added users
                });

                if (!updateUserCountResponse.data.success) {
                    toast.error('Failed to update user count. Please try again.');
                    return;
                }

                // Create an order for record-keeping
                const orderData = {
                    userId: currentUser._id, // Ensure this is passed
                    amount: 0, // No payment required
                    planName: plan,
                    creditedAmount: 0, // No credits for this type of plan
                    subscribedUserCount: totalUserCount,
                    additionalUserCount: additionalUserCount || 0,
                    deduction: plans[plan] * userCount, // Cost of the plan multiplied by user count
                };

                await axios.post('/api/create-wallet-order', orderData);

                // Show success message and redirect
                toast(<div className=" w-full mb-6 gap-2 m-auto  ">
                    <div className="w-full flex   justify-center">
                        <DotLottieReact
                            src="/lottie/tick.lottie"
                            loop
                            autoplay
                        />
                    </div>
                    <h1 className="text-black text-center font-medium text-lg">Payment Successful, No Additional Amount Charged.</h1>
                </div>);
                router.replace('/payment-success');
                setIsPaymentProcessing(false);
                setIsDialogOpen(false);
                setModalStep(1);
                setGstNumber('');
                return;
            }

            const orderData = {
                amount: total * 100, // Amount in paise
                currency: 'INR',
                subscribedUserCount: totalUserCount, // Pass the updated user count
                planName: plan, // Pass the selected plan
                additionalUserCount: additionalUserCount || 0, // Newly added users
            };

            // Create order on server and get order ID
            const { data } = await axios.post('/api/create-order', orderData);
            if (!data.orderId) {
                throw new Error('Order ID not found in the response');
            }
            setIsPaymentProcessing(false);

            // Close the modal

            // Razorpay payment options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
                amount: orderData.amount,
                currency: orderData.currency,
                name: `Zapllo`,
                description: `Payment for ${plan}`,
                image: 'https://res.cloudinary.com/dndzbt8al/image/upload/v1732384145/zapllo_pmxgrw.jpg',
                order_id: data.orderId,
                handler: async (response: any) => {
                    const paymentResult = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        planName: plan,
                        deduction: discount, // Include the applied discount here
                        additionalUserCount: additionalUserCount || 0, // Include the newly added users
                    };

                    try {
                        // Verify the payment on the server
                        const { data: verificationResult } = await axios.post('/api/payment-success', {
                            ...paymentResult,
                            userId: currentUser?._id,
                            amount: orderData.amount / 100,
                            gstNumber: gstNumber,
                            subscribedUserCount: totalUserCount, // Update subscribed users
                            additionalUserCount: additionalUserCount || 0, // Ensure it's passed
                        });

                        if (verificationResult.success) {
                            toast(<div className=" w-full mb-6 gap-2 m-auto  ">
                                <div className="w-full flex   justify-center">
                                    <DotLottieReact
                                        src="/lottie/tick.lottie"
                                        loop
                                        autoplay
                                    />
                                </div>
                                <h1 className="text-black text-center font-medium text-lg">Payment Successful, Users Added.</h1>
                            </div>);
                            router.replace('/payment-success');
                            setIsPaymentProcessing(false);

                            setSubscribedUserCount(totalUserCount); // Update the subscribed count locally
                            setIsAddUserOpen(false);
                        } else {
                            router.replace('/payment-failed'); // Redirect to payment failed page
                        }
                    } catch (error) {
                        console.error('Error verifying payment: ', error);
                        router.replace('/payment-failed'); // Redirect to payment failed page
                    }
                },
                prefill: {
                    name: `${currentUser?.firstName} ${currentUser?.lastName}`,
                    email: currentUser?.email,
                    contact: currentUser?.whatsappNo,
                },
                notes: {
                    address: 'Corporate Office',
                },
                theme: {
                    color: "#04061E", // Replace with your brand's primary color
                    backdrop_color: "#0B0D26", // Optional: Set a custom background color for the Razorpay modal
                },
            };

            // Open the Razorpay payment modal
            const rzp1 = new (window as any).Razorpay(options);
            // Ensure the loader is reset when the Razorpay modal is closed
            rzp1.on('modal.closed', () => {
                setIsPaymentProcessing(false); // Reset the loader
            });
            rzp1.open();
        } catch (error) {
            toast.error("Error adding users. Please try again.");
            console.error('Error creating order: ', error);
        }
    };




    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setUserCount(5);
        setModalStep(1);
        setGstNumber('');
    };


    const handleCloseAddDialog = () => {
        setIsAddUserOpen(false);
        setUserCount(5);
        setModalStep(1);
        setGstNumber('');
    };

    const handleRechargeClick = () => {
        setIsRechargeDialogOpen(true);
    };

    const handleRechargeDialogClose = () => {
        setIsRechargeDialogOpen(false);
        setRechargeAmount(5000);
        setRechargeModalStep(1);
        setRechargeGstNumber('');
    };

    const handleSubscribeClick = (plan: any) => {
        setSelectedPlan(plan);
        setIsDialogOpen(true);
    };

    const isValidPlan = (plan: string | null): plan is keyof typeof plans => {
        return plan !== null && Object.keys(plans).includes(plan);
    };

    console.log(renewsOn, 'renews on');

    useEffect(() => {
        const loadRazorpayScript = () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        };
        loadRazorpayScript();
    }, []);

    const handlePayment = async () => {
        if (!selectedPlan || !(selectedPlan in plans)) {
            console.error("Selected plan is invalid.");
            return;
        }
        const plan = selectedPlan as PlanKeys;
        const { subtotal, discount, payableExclGST, gst, total } = calculatePaymentDetails(plans[plan], userCount);
        try {
            setIsDialogOpen(false);
            setIsPaymentProcessing(true);
            // Deduct applied credits from the wallet first
            const walletDeductionResponse = await axios.post('/api/wallet/deduct', {
                userId: currentUser?._id,
                amount: discount, // Deduct only the applied discount amount
            });

            if (!walletDeductionResponse.data.success) {
                toast.error('Failed to deduct credits. Please try again.');
                return;
            }

            // Show success message for credit deduction
            // toast.success(`Discount of ₹${discount} applied using wallet credits.`);

            // If the total payable amount is zero, complete the payment here
            if (total === 0) {
                // Handle user count update
                const updateUserCountResponse = await axios.post('/api/organization/update-user-count', {
                    organizationId: currentUser?.organization,
                    subscribedUserCount: userCount, // Updated total user count
                    additionalUserCount: 0, // Newly added users
                });

                if (!updateUserCountResponse.data.success) {
                    toast.error('Failed to update user count. Please try again.');
                    return;
                }

                // Create an order for record-keeping
                const orderData = {
                    userId: currentUser._id, // Ensure this is passed
                    amount: 0, // No payment required
                    planName: plan,
                    creditedAmount: 0, // No credits for this type of plan
                    subscribedUserCount: userCount,
                    additionalUserCount: additionalUserCount || 0,
                    deduction: plans[plan] * userCount, // Cost of the plan multiplied by user count
                };

                await axios.post('/api/create-wallet-order', orderData);

                // Show success message and redirect
                toast(<div className=" w-full mb-6 gap-2 m-auto  ">
                    <div className="w-full flex   justify-center">
                        <DotLottieReact
                            src="/lottie/tick.lottie"
                            loop
                            autoplay
                        />
                    </div>
                    <h1 className="text-black text-center font-medium text-lg">Payment Successful, No Additional Amount Charged.</h1>
                </div>);
                router.replace('/payment-success');
                setIsPaymentProcessing(false);
                setIsDialogOpen(false);
                setModalStep(1);
                setGstNumber('');
                return;
            }
            console.log(total, 'total');
            // Proceed with Razorpay checkout for non-zero payable amounts
            const orderData = {
                amount: Math.round(total * 100), // Convert to paise and ensure it's an integer
                currency: 'INR',
                receipt: 'receipt_order_123456',
                notes: {
                    email: currentUser?.email,
                    whatsappNo: currentUser?.whatsappNo,
                    planName: plan,
                    gstNumber: gstNumber,
                },
                subscribedUserCount: userCount, // Store the selected number of users

            };
            console.log(orderData, 'order data');
            const { data } = await axios.post('/api/create-order', orderData);
            console.log(data, 'from razorpay')
            if (!data.orderId) {
                throw new Error('Order ID not found in the response');
            }
            setIsPaymentProcessing(false);


            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
                amount: orderData.amount,
                currency: orderData.currency,
                name: `Zapllo`,
                description: `Payment for ${plan}`,
                image: 'https://res.cloudinary.com/dndzbt8al/image/upload/v1732384145/zapllo_pmxgrw.jpg',
                order_id: data.orderId,
                handler: async (response: any) => {
                    const paymentResult = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        planName: plan,
                        deduction: discount, // Include the applied discount here
                    };
                    try {
                        const { data: verificationResult } = await axios.post('/api/payment-success', {
                            ...paymentResult,
                            userId: currentUser?._id,
                            amount: orderData.amount / 100,
                            gstNumber: gstNumber,
                            subscribedUserCount: userCount,
                        });

                        if (verificationResult.success) {
                            setIsPaymentProcessing(false);
                            toast(<div className=" w-full mb-6 gap-2 m-auto  ">
                                <div className="w-full flex   justify-center">
                                    <DotLottieReact
                                        src="/lottie/tick.lottie"
                                        loop
                                        autoplay
                                    />
                                </div>
                                <h1 className="text-black text-center font-medium text-lg">Payment Successful</h1>
                            </div>);
                            router.replace('/payment-success');
                            setIsPaymentProcessing(false);
                            setIsDialogOpen(false);
                            setModalStep(1);
                            setGstNumber('');
                        } else {
                            router.replace('/payment-failed'); // Redirect to payment failed page
                        }
                    } catch (error) {
                        console.error('Error verifying payment: ', error);
                        router.replace('/payment-failed'); // Redirect to payment failed page
                    }
                },
                prefill: {
                    name: `${currentUser?.firstName} ${currentUser?.lastName}`,
                    email: currentUser?.email,
                    contact: currentUser?.whatsappNo,
                },
                notes: {
                    address: 'Corporate Office',
                },
                theme: {
                    color: "#04061E", // Replace with your brand's primary color
                    backdrop_color: "#0B0D26", // Optional: Set a custom background color for the Razorpay modal

                },

            };

            const rzp1 = new (window as any).Razorpay(options);

            // Open Razorpay in a new window
            rzp1.on('payment.failed', function (response: any) {
                console.error('Payment Failed:', response.error);
            });

            // Ensure the loader is reset when the Razorpay modal is closed
            rzp1.on('modal.closed', () => {
                setIsPaymentProcessing(false); // Reset the loader
            });
            rzp1.open({
                target: '_blank', // Open in a new window
            });
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Error processing payment. Please try again.');
        }
    };

    const handleRechargePayment = async () => {
        if (rechargeAmount >= 5000) {
            const amountExclGST = rechargeAmount;
            const gstAmount = amountExclGST * 0.18;
            const totalAmount = amountExclGST + gstAmount;
            const orderData = {
                amount: totalAmount * 100,
                currency: 'INR',
                receipt: 'receipt_order_123456',
                notes: {
                    email: currentUser?.email,
                    whatsappNo: currentUser?.whatsappNo,
                    planName: 'Recharge',
                    gstNumber: rechargeGstNumber,
                },
            };
            try {
                setIsPaymentProcessing(true);
                const { data } = await axios.post('/api/create-order', orderData);
                if (!data.orderId) {
                    throw new Error('Order ID not found in the response');
                }
                setIsRechargeDialogOpen(false);
                setIsPaymentProcessing(false);


                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: 'Zapllo',
                    description: `Payment for Wallet Recharge`,
                    image: 'https://res.cloudinary.com/dndzbt8al/image/upload/v1732384145/zapllo_pmxgrw.jpg',
                    order_id: data.orderId,
                    handler: async (response: any) => {
                        const paymentResult = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            planName: 'Recharge'
                        };
                        try {
                            setIsPaymentProcessing(true);

                            const { data: verificationResult } = await axios.post('/api/payment-success', {
                                ...paymentResult,
                                userId: currentUser?._id,
                                amount: orderData.amount / 100,
                                gstNumber: rechargeGstNumber,
                                subscribedUserCount: userCount,
                            });
                            if (verificationResult.success) {
                                setIsPaymentProcessing(false);
                                toast(<div className=" w-full mb-6 gap-2 m-auto  ">
                                    <div className="w-full flex   justify-center">
                                        <DotLottieReact
                                            src="/lottie/tick.lottie"
                                            loop
                                            autoplay
                                        />
                                    </div>
                                    <h1 className="text-black text-center font-medium text-lg">Recharge Successful</h1>
                                </div>);
                                router.replace('/payment-success');
                                setIsPaymentProcessing(false);
                                setIsRechargeDialogOpen(false);
                                setRechargeModalStep(1);
                                setRechargeGstNumber('');
                            } else {
                                router.replace('/payment-failed'); // Redirect to payment failed page
                            }
                        } catch (error) {
                            console.error('Error verifying payment: ', error);
                            router.replace('/payment-failed'); // Redirect to payment failed page
                        }
                    },
                    prefill: {
                        name: `${currentUser?.firstName} ${currentUser?.lastName}`,
                        email: currentUser?.email,
                        contact: currentUser?.whatsappNo,
                    },
                    notes: {
                        address: 'Corporate Office',
                    },
                    theme: {
                        color: "#04061E", // Replace with your brand's primary color
                        backdrop_color: "#0B0D26", // Optional: Set a custom background color for the Razorpay modal
                    },
                };

                const rzp1 = new (window as any).Razorpay(options);
                rzp1.open();
            } catch (error) {
                console.error('Error creating order: ', error);
                router.replace('/payment-failed'); // Redirect to payment failed page
            }
        } else {
            toast.error('Recharge amount must be at least ₹5000.');
        }
    };

    // Function to format the date as "14th October 24"
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }

        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear().toString().slice(0);

        // Get ordinal suffix
        const getOrdinalSuffix = (n: number) => {
            const s = ['th', 'st', 'nd', 'rd'];
            const v = n % 100;
            return s[(v - 20) % 10] || s[v] || s[0];
        };

        return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
    };

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
                </div>



            </div>}
            <div className="flex w-full ">


                {/* <Toaster /> */}
                <BillingSidebar />
                {currentUser?.role === "orgAdmin" ? (
                    <div className="flex-1 overflow-y-scroll h-screen  p-4">
                        <div className="w-full flex justify-center   max-w-5xl mx-auto">
                            <div className="gap-2 flex  mb-6 w-full">
                                <div className="-mt-2">
                                    <div className="p-4">
                                        <div className='p-[1px] rounded-3xl bg-gradient-to-r from-[#815BF5] to-[#FC8929]'>
                                            <Card className="gap-6 border   rounded-3xl py-4  w-full">
                                                <CardHeader>
                                                    <div className="flex justify-between w-[420px]">
                                                        <div className="flex gap-2">
                                                            <div className="h-12 bg-gradient-to-r from-[#815BF5] to-[#FC8929] w-12 rounded-full border items-center justify-center flex ">
                                                                <Wallet />
                                                            </div>
                                                            <div>
                                                                <CardTitle className="text-xl font-medium">                                                                <h1>₹{orgCredits}</h1>
                                                                </CardTitle>
                                                                <h1 className='text-[#676B93]'>Current Balance</h1>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                className="w-full hover:bg-gradient-to-r from-[#815BF5] to-[#FC8929] hover:border-none border-[#A58DE8] border bg-transparent  rounded-2xl px-6"
                                                                onClick={handleRechargeClick}
                                                            >
                                                                Recharge Now
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                                <div className="-mt-2">
                                    <div className="p-4">
                                        <div className='p-[1px] rounded-3xl bg-gradient-to-r from-[#815BF5] to-[#FC8929]'>
                                            <Card className="gap-6  rounded-3xl border py-4 border-[#E0E0E066] w-full">
                                                <CardHeader>
                                                    <div className="flex justify-between w-[380px]">
                                                        <div className="flex gap-2">
                                                            <div className="h-12 w-12 rounded-full border items-center justify-center flex border-white">
                                                                <img src='/icons/whatsapp.png' className='h-6' />
                                                            </div>
                                                            <div>
                                                                <CardTitle className="text-lg">Sales</CardTitle>
                                                                <CardDescription>Connect with team</CardDescription>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                className="w-full hover:bg-gradient-to-r from-[#815BF5] to-[#FC8929] hover:border-none border-[#A58DE8] border bg-transparent  rounded-2xl px-6"
                                                                onClick={() => window.open('https://wa.me/+918910748670?text=Hello, I would like to connect.', '_blank')}
                                                            >
                                                                Connect Now
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isDialogOpen && isValidPlan(selectedPlan) && (
                                <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                                    <DialogContent className='z-[100]  p-6'>
                                        {modalStep === 1 && (
                                            <>
                                                <div className='flex justify-between w-full'>
                                                    <h2 className="text-xl font-bold">{selectedPlan} Plan</h2>
                                                    <DialogClose>
                                                        <CrossCircledIcon
                                                            className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
                                                        />
                                                    </DialogClose>
                                                </div>
                                                <p className="mt-2">This plan costs ₹{plans[selectedPlan]} per user per year.</p>
                                                <div className="mt-4 flex gap-4">

                                                    <select
                                                        id="userCount"
                                                        className="border outline-none w-full bg-[#0b0d29] px-2 py-1 -mt-1 rounded "
                                                        value={userCount}
                                                        onChange={(e) => setUserCount(parseInt(e.target.value))}
                                                    >
                                                        <option>Select Number of Users To Add</option>
                                                        {[...Array(20)].map((_, i) => {
                                                            const count = (i + 1) * 5;
                                                            return (
                                                                <option key={count} value={count}>
                                                                    {count}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <div className='flex gap-4'>
                                                    <h1>Total Subscribed Users = </h1>
                                                    {userCount} (Adding {userCount} users)
                                                </div>
                                                <div className="mt-4">
                                                    <Button className="bg-[#007A5A] hover:bg-[#007A5A] w-full" onClick={() => setModalStep(2)}>
                                                        Next
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                        {modalStep === 2 && (
                                            <>
                                                <h2 className="text-xl font-bold">Payment Details</h2>
                                                <div className='flex gap-4 mt-4'>
                                                    <h1>Amount (excluding GST) = </h1>
                                                    INR {userCount * plans[selectedPlan]}
                                                </div>
                                                <div>
                                                    <h1>Total Discount Applicable = ₹{Math.min(orgCredits || 0, plans[selectedPlan] * userCount)}</h1></div>
                                                <div>
                                                    Payable (excluding GST): ₹{Math.max(0, plans[selectedPlan] * userCount - (orgCredits))}
                                                </div>
                                                <div>GST (18%): ₹{((Math.max(0, plans[selectedPlan] * userCount - (orgCredits || 0))) * 0.18).toFixed(2)}</div>
                                                <div>Total Payable: ₹{(Math.max(0, plans[selectedPlan] * userCount - (orgCredits || 0)) * 1.18).toFixed(2)}</div>
                                                <div className="mt-4">
                                                    <label htmlFor="gstNumber" className="block mb-2">Enter GST Number (Optional):</label>
                                                    <input
                                                        id="gstNumber"
                                                        type="text"
                                                        className="border focus:ring-1 ring-[#815bf5]  p-2 bg-transparent rounded outline-none w-full"
                                                        value={gstNumber}
                                                        onChange={(e) => setGstNumber(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mt-4 flex gap-2">
                                                    <Button className="bg-gray-500 hover:bg-gray-600 w-full" onClick={() => setModalStep(1)}>
                                                        Back
                                                    </Button>
                                                    <Button className="bg-[#007A5A] hover:bg-[#007A5A] w-full" onClick={handlePayment}>
                                                        Proceed to Payment
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            )}


                            {isAddUserOpen && isValidPlan(selectedPlan) && (
                                <Dialog open={isAddUserOpen} onOpenChange={handleCloseAddDialog}>
                                    <DialogTitle>
                                        <UserPlus2 className='h-4' />  Add Users</DialogTitle>
                                    <DialogContent className='z-[100] p-6'>
                                        {modalStep === 1 && (
                                            <>
                                                <div className='flex justify-between'>
                                                    <h2 className="text-xl font-bold">{selectedPlan} Plan</h2>
                                                    <DialogClose>
                                                        <CrossCircledIcon
                                                            className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
                                                        />
                                                    </DialogClose>
                                                </div>
                                                <div className="flex gap-4 mt-4">
                                                    <div>Subscribed Users: {subscribedUserCount}</div>
                                                    <div>Valid Till: <span className="text-blue-500">{formatDate(renewsOn)}</span></div>
                                                </div>

                                                <div className="mt-4">

                                                    <select
                                                        id="userCount"
                                                        className="border p-2 w-full mt-2 outline-none bg-[#0b0d29] rounded"
                                                        value={additionalUserCount || ""}
                                                        onChange={handleUserSelection}
                                                    >
                                                        <option>Select Number of Users To Add</option>
                                                        {[...Array(20)].map((_, i) => {
                                                            const count = (i + 1) * 5;
                                                            return (
                                                                <option key={count} value={count}>{count}</option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="mt-4">
                                                    <h3>Total Users: {subscribedUserCount + (additionalUserCount || 0)}</h3>
                                                </div>

                                                <div className="mt-4">
                                                    <Button className="bg-[#007A5A] hover:bg-[#007A5A] w-full" onClick={() => setModalStep(2)}>
                                                        Next
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                        {modalStep === 2 && (
                                            <>
                                                <h2 className="text-xl font-bold">Payment Details</h2>
                                                <div className='flex gap-4 mt-4'>
                                                    <h1>Amount (excluding GST) = </h1>
                                                    ₹ {(additionalUserCount ?? 0) * plans[selectedPlan]}
                                                </div>
                                                <div>
                                                    <h1>Total Discount Applicable = ₹{Math.min(orgCredits)}</h1></div>
                                                <div>
                                                    Payable (excluding GST): ₹{Math.max(0, plans[selectedPlan] * (additionalUserCount ?? 0) - (orgCredits || 0))}
                                                </div>
                                                <div>GST (18%): ₹{((Math.max(0, plans[selectedPlan] * (additionalUserCount ?? 0) - (orgCredits || 0))) * 0.18).toFixed(2)}</div>
                                                <div> Total Payable: ₹{(Math.max(0, plans[selectedPlan] * (additionalUserCount ?? 0) - (orgCredits || 0)) * 1.18).toFixed(2)}</div>

                                                <div className="mt-4">
                                                    <label htmlFor="gstNumber" className="block mb-2">Enter GST Number (Optional):</label>
                                                    <input
                                                        id="gstNumber"
                                                        type="text"
                                                        className="border focus:ring-1 ring-[#815bf5] p-2 bg-transparent rounded outline-none w-full"
                                                        value={gstNumber}
                                                        onChange={(e) => setGstNumber(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mt-4 flex gap-2">
                                                    <Button className="bg-gray-500 hover:bg-gray-600 w-full" onClick={() => setModalStep(1)}>
                                                        Back
                                                    </Button>
                                                    <Button className="bg-[#007A5A] hover:bg-[#007A5A] w-full" onClick={handleConfirmUsers}>
                                                        Proceed to Payment
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            )}
                            {isRechargeDialogOpen && (
                                <Dialog open={isRechargeDialogOpen} onOpenChange={handleRechargeDialogClose}>
                                    <DialogContent className='z-[100] p-6'>
                                        {rechargeModalStep === 1 && (
                                            <>
                                                <div className='flex justify-between'>
                                                    <h2 className="text-md font-bold">Recharge Wallet</h2>
                                                    <DialogClose>
                                                        <CrossCircledIcon
                                                            className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
                                                        />
                                                    </DialogClose>
                                                </div>
                                                <div className="mt-4">
                                                    <label htmlFor="rechargeAmount" className="block mb-2">Recharge Amount (minimum ₹5000):</label>
                                                    <input
                                                        id="rechargeAmount"
                                                        type="number"
                                                        className="border p-2 rounded focus-within:border-[#815BF5] outline-none w-full"
                                                        value={rechargeAmount}
                                                        onChange={(e) => setRechargeAmount(parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div className="mt-4">
                                                    <Button className="bg-[#017a5b] hover:bg-[#017a5b] w-full" onClick={() => setRechargeModalStep(2)}>
                                                        Next
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                        {rechargeModalStep === 2 && (
                                            <>
                                                <h2 className="text-xl font-bold">Payment Details</h2>
                                                <div className='flex gap-4 mt-4'>
                                                    <h1>Amount (excluding GST) = </h1>
                                                    INR {rechargeAmount}
                                                </div>
                                                <div className='flex gap-4'>
                                                    <h1>GST (18%) = </h1>
                                                    INR {(rechargeAmount * 0.18).toFixed(2)}
                                                </div>
                                                <div className='flex gap-4'>
                                                    <h1>Total Amount (including GST) = </h1>
                                                    INR {(rechargeAmount * 1.18).toFixed(2)}
                                                </div>
                                                <div className="mt-4">
                                                    <label htmlFor="rechargeGstNumber" className="block mb-2">Enter GST Number (Optional):</label>
                                                    <input
                                                        id="rechargeGstNumber"
                                                        type="text"
                                                        className="border focus:ring-1 ring-[#815bf5]bg-transparent p-2 rounded outline-none w-full"
                                                        value={rechargeGstNumber}
                                                        onChange={(e) => setRechargeGstNumber(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mt-4 flex gap-2">
                                                    <Button className="bg-gray-500 hover:bg-gray-600 w-full" onClick={() => setRechargeModalStep(1)}>
                                                        Back
                                                    </Button>
                                                    <Button className="bg-[#017a5b] hover:bg-[#017a5b] w-full" onClick={handleRechargePayment}>
                                                        Proceed to Payment
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>


                        <div className="flex justify-center mb-8">
                            {/* Sliding Tabs */}
                            <div className="relative border h-10 flex bg-[#0A0D28] rounded-full w-80">
                                {/* Active Tab Indicator */}
                                <div
                                    className={`absolute  scale-[85%]  top-0 bottom-0 left-0 w-1/2 transform rounded-full transition-all duration-300 ${planTab === "Zapllo Sales" ? "translate-x-full" : "translate-x-0"
                                        }`}
                                    style={{
                                        background: "linear-gradient(90deg, #815BF5, #FC7A57)",
                                    }}
                                ></div>

                                {/* Tabs */}
                                <button
                                    onClick={() => setPlanTab("Zapllo Teams")}
                                    className={`relative w-1/2 text-center z-10 -mt-1 font-medium py-2 transition-colors duration-300 ${planTab === "Zapllo Teams" ? "text-white" : "text-gray-400"
                                        }`}
                                >
                                    Zapllo Teams
                                </button>
                                <button
                                    onClick={() => setPlanTab("Zapllo Sales")}
                                    className={`relative w-1/2 text-center z-10 -mt-1 font-medium py-2 transition-colors duration-300 ${planTab === "Zapllo Sales" ? "text-white" : "text-gray-400"
                                        }`}
                                >
                                    Zapllo Sales
                                </button>
                            </div>
                        </div>

                        {/* Plan Cards */}
                        <div className="w-full flex justify-center">
                            <div className="max-w-5xl mx-auto">

                                {planTab === "Zapllo Sales" ? (
                                    <div className='grid grid-cols-3 gap-4'>
                                        <Card className="w-full  border-none bg-[#0B0D26] h-fit px-4  rounded-3xl">
                                            <CardHeader className=" rounded border-b text-">
                                                <CardTitle className="text-md font-thin">Zapllo CRM</CardTitle>
                                                <CardDescription className="text- w-64 relative flex items-center gap-1 text-white text-sm ">
                                                    <h1 className='text-5xl font-extrabold'>  ₹ 2999</h1>
                                                    <h1 className="text-md absolute right-0 bottom-0 text-[#646783] italic">/Per User Per Year</h1>
                                                </CardDescription>
                                                {displayedPlan === 'Zapllo CRM' && (
                                                    <div>
                                                        <p className="mt-2 text-sm justify-start flex gap-1">
                                                            <Clock className="h-5" />
                                                            Renews on:{" "}
                                                            <span className="text-[#3281F6]">{formatDate(renewsOn)}</span>
                                                        </p>
                                                        {subscribedUserCount && (
                                                            <p className="mt-1 flex justify-start gap-1 text-sm">
                                                                <Users2 className="h-5" />
                                                                Subscribed Users:{" "}
                                                                <span className="text-[#3281F6]">{subscribedUserCount}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                                <div className=''>
                                                    {/* <h1 className='mt-4 text-[#9296bf]'>Manage your Tasks like a pro</h1> */}
                                                </div>
                                                <div className="flex justify-center py-2 w-full">

                                                    {displayedPlan === 'Zapllo Tasks' ? (
                                                        <Button
                                                            className="w-full hover:bg-[#815BF5] border-[#A58DE8] border bg-transparent opacity-70  rounded-2xl px-6"
                                                        // onClick={() => {
                                                        //     setSelectedPlan(planTab); // Set the selected 
                                                        //     setIsAddUserOpen(true); // Open the dialog to add more users
                                                        // }}
                                                        >
                                                            Coming Soon
                                                        </Button>
                                                    ) : (
                                                        <Button className="w-full h-10 mt-2 hover:bg-[#815BF5] border-[#A58DE8] border bg-transparent  rounded-2xl " >Coming Soon</Button>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <div className="mt-4 ">
                                                <CardContent className="bg-transparent">
                                                    <ul className="list-disc space-y-2 w-full items-center text-sm">
                                                        {[


                                                        ].map((item, index) => (
                                                            <li key={index} className="flex gap-2 items-center">
                                                                <img src="/icons/tick.png" />
                                                                <span
                                                                    className="text-sm font-medium"
                                                                >
                                                                    {item}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </div>
                                            <CardFooter />
                                        </Card>
                                        <Card className="w-full  border-none bg-[#0B0D26] h-fit px-4  rounded-3xl">
                                            <CardHeader className=" rounded border-b text-">
                                                <CardTitle className="text-md font-thin">Zapllo Invoice</CardTitle>
                                                <CardDescription className="text- w-64 relative flex items-center gap-1 text-white text-sm ">
                                                    <h1 className='text-5xl font-extrabold'>  ₹ 1999</h1>
                                                    <h1 className="text-md absolute right-0 bottom-0 text-[#646783] italic">/Per User Per Year</h1>
                                                </CardDescription>
                                                {displayedPlan === 'Zapllo CRM' && (
                                                    <div>
                                                        <p className="mt-2 text-sm justify-start flex gap-1">
                                                            <Clock className="h-5" />
                                                            Renews on:{" "}
                                                            <span className="text-[#3281F6]">{formatDate(renewsOn)}</span>
                                                        </p>
                                                        {subscribedUserCount && (
                                                            <p className="mt-1 flex justify-start gap-1 text-sm">
                                                                <Users2 className="h-5" />
                                                                Subscribed Users:{" "}
                                                                <span className="text-[#3281F6]">{subscribedUserCount}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                                <div className=''>
                                                    {/* <h1 className='mt-4 text-[#9296bf]'>Manage your Tasks like a pro</h1> */}
                                                </div>
                                                <div className="flex justify-center py-2 w-full">

                                                    {displayedPlan === 'Zapllo Tasks' ? (
                                                        <Button
                                                            className="w-full border-[#A58DE8] border bg-transparent opacity-70 hover:bg-[#815BF5] rounded-2xl px-6"
                                                        // onClick={() => {
                                                        //     setSelectedPlan(planTab); // Set the selected 
                                                        //     setIsAddUserOpen(true); // Open the dialog to add more users
                                                        // }}
                                                        >
                                                            Coming Soon
                                                        </Button>
                                                    ) : (
                                                        <Button className="w-full h-10 mt-2 hover:bg-[#815BF5] border-[#A58DE8] border bg-transparent  rounded-2xl " >Coming Soon</Button>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <div className="mt-4 ">
                                                <CardContent className="bg-transparent">
                                                    <ul className="list-disc space-y-2 w-full items-center text-sm">
                                                        {[


                                                        ].map((item, index) => (
                                                            <li key={index} className="flex gap-2 items-center">
                                                                <img src="/icons/tick.png" />
                                                                <span
                                                                    className="text-sm font-medium"
                                                                >
                                                                    {item}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </div>
                                            <CardFooter />
                                        </Card>
                                        <Card className="w-full border-none bg-[#0B0D26] h-fit px-4  rounded-3xl">
                                            <CardHeader className=" rounded border-b text-">
                                                <CardTitle className="text-md font-thin">Zapllo Quotation</CardTitle>
                                                <CardDescription className="text- w-64 relative flex items-center gap-1 text-white text-sm ">
                                                    <h1 className='text-5xl font-extrabold'>  ₹ 1999</h1>
                                                    <h1 className="text-md absolute right-0 bottom-0 text-[#646783] italic">/Per User Per Year</h1>
                                                </CardDescription>
                                                {displayedPlan === 'Zapllo CRM' && (
                                                    <div>
                                                        <p className="mt-2 text-sm justify-start flex gap-1">
                                                            <Clock className="h-5" />
                                                            Renews on:{" "}
                                                            <span className="text-[#3281F6]">{formatDate(renewsOn)}</span>
                                                        </p>
                                                        {subscribedUserCount && (
                                                            <p className="mt-1 flex justify-start gap-1 text-sm">
                                                                <Users2 className="h-5" />
                                                                Subscribed Users:{" "}
                                                                <span className="text-[#3281F6]">{subscribedUserCount}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                                <div className=''>
                                                    {/* <h1 className='mt-4 text-[#9296bf]'>Manage your Tasks like a pro</h1> */}
                                                </div>
                                                <div className="flex justify-center py-2 w-full">

                                                    {displayedPlan === 'Zapllo Tasks' ? (
                                                        <Button
                                                            className="w-full border-[#A58DE8] border bg-transparent opacity-70 hover:bg-[#815BF5] rounded-2xl px-6"
                                                        // onClick={() => {
                                                        //     setSelectedPlan(planTab); // Set the selected 
                                                        //     setIsAddUserOpen(true); // Open the dialog to add more users
                                                        // }}
                                                        >
                                                            Coming Soon
                                                        </Button>
                                                    ) : (
                                                        <Button className="w-full h-10 mt-2 hover:bg-[#815BF5] border-[#A58DE8] border bg-transparent  rounded-2xl " >Coming Soon</Button>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <div className="mt-4 ">
                                                <CardContent className="bg-transparent">
                                                    <ul className="list-disc space-y-2 w-full items-center text-sm">
                                                        {[


                                                        ].map((item, index) => (
                                                            <li key={index} className="flex gap-2 items-center">
                                                                <img src="/icons/tick.png" />
                                                                <span
                                                                    className="text-sm font-medium"
                                                                >
                                                                    {item}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </div>
                                            <CardFooter />
                                        </Card>
                                    </div>
                                ) : (
                                    <div className='grid grid-cols-2 mb-24 gap-4'>

                                        <div className={` p-[1px]  h-fit   rounded-3xl ${displayedPlan === 'Zapllo Tasks' ? "bg-gradient-to-r from-[#815BF5] to-[#FC8929]" : "bg-[#]"}`}>
                                            <Card className={`w-[400px] border-none h-fit px-4  rounded-3xl ${displayedPlan === 'Zapllo Tasks' ? "" : "bg-[#0B0D26]"}`}>
                                                <CardHeader className=" rounded border-b text-">
                                                    <CardTitle className="text-md font-thin">Zapllo Tasks</CardTitle>
                                                    <CardDescription className="text- w-64 relative flex items-center gap-1 text-white text-sm ">
                                                        <h1 className='text-5xl font-extrabold'>  ₹ {plans["Zapllo Tasks"]}</h1>
                                                        <h1 className="text-md absolute right-0 bottom-0 text-[#646783] italic">/Per User Per Year</h1>
                                                    </CardDescription>
                                                    {displayedPlan === 'Zapllo Tasks' && (
                                                        <div>
                                                            <p className="mt-2 text-sm justify-start flex gap-1">
                                                                <Clock className="h-5" />
                                                                Renews on:{" "}
                                                                <span className="text-[#3281F6]">{formatDate(renewsOn)}</span>
                                                            </p>
                                                            {subscribedUserCount && (
                                                                <p className="mt-1 flex justify-start gap-1 text-sm">
                                                                    <Users2 className="h-5" />
                                                                    Subscribed Users:{" "}
                                                                    <span className="text-[#3281F6]">{subscribedUserCount}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className=''>
                                                        <h1 className='mt-4 text-[#9296bf]'>Manage your Tasks like a pro</h1>
                                                    </div>
                                                    <div className="flex justify-center py-2 w-full">

                                                        {displayedPlan === 'Zapllo Tasks' ? (
                                                            <Button
                                                                className="w-full border-[#A58DE8] border bg-transparent hover:bg-[#815BF5] rounded-2xl px-6"
                                                                onClick={() => {
                                                                    setSelectedPlan("Zapllo Tasks"); // Set the selected 
                                                                    setIsAddUserOpen(true); // Open the dialog to add more users
                                                                }}
                                                            >
                                                                <UserPlus2 className='h-4' />  Add Users
                                                            </Button>
                                                        ) : (
                                                            <Button className="w-full h-10 mt-2 hover:bg-[#815BF5] border-[#A58DE8] border bg-transparent  rounded-2xl " onClick={() => handleSubscribeClick("Zapllo Tasks")}>Subscribe</Button>
                                                        )}
                                                    </div>
                                                </CardHeader>
                                                <div className="mt-4 ">
                                                    <CardContent className="bg-transparent">
                                                        <h1 className='p-4 text-blue-400 text-lg'>Task Delegation App</h1>
                                                        <ul className="list-disc space-y-2 w-full items-center text-sm">
                                                            {[
                                                                "Delegate Unlimited Tasks",
                                                                "Team Performance Report",
                                                                "Links Management for your Team",
                                                                "Email Notifications",
                                                                "WhatsApp Notifications",
                                                                "Automatic WhatsApp Reminders",
                                                                "Automatic Email Reminders",
                                                                "Repeated Tasks",
                                                                "Zapllo AI -Proprietory AI Technology",
                                                                "File Uploads",
                                                                "Delegate Tasks with Voice Notes",
                                                                "Task Wise Reminders",
                                                                "Daily Task & Team Reports",
                                                                "Save more than 4 hours per day",

                                                            ].map((item, index) => (
                                                                <li key={index} className="flex gap-2 items-center">
                                                                    <img src="/icons/tick.png" />
                                                                    <span
                                                                        className="text-sm font-medium"
                                                                    >
                                                                        {item}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </CardContent>
                                                </div>
                                                <CardFooter />
                                            </Card>
                                        </div>
                                        <div className={` p-[1px]  h-fit   rounded-3xl ${displayedPlan === 'Money Saver Bundle' ? "bg-gradient-to-r from-[#815BF5] to-[#FC8929]" : "bg-[#]"}`}>
                                            <Card className={`w-[400px] border-none   ] h-fit px-4  rounded-3xl ${displayedPlan === 'Money Saver Bundle' ? "" : "bg-[#0B0D26]"}`}>
                                                <CardHeader className=" rounded border-b text-">
                                                    <CardTitle className="text-md font-thin">Money Saver Bundle</CardTitle>
                                                    <CardDescription className="text- w-64 relative flex items-center gap-1 text-white text-sm ">
                                                        <h1 className='text-5xl font-extrabold'>  ₹ {plans["Money Saver Bundle"]}</h1>
                                                        <h1 className="text-md absolute right-0 bottom-0 text-[#646783] italic">/ Per User Per Year</h1>
                                                    </CardDescription>
                                                    <div>
                                                        <h1 className='mt-4 text-[#9296bf]'>10X Your Team&apos;s Productivity</h1>
                                                    </div>
                                                    {displayedPlan === 'Money Saver Bundle' && (
                                                        <div>

                                                            <p className="mt-2 text-sm justify-start flex gap-1">
                                                                <Clock className="h-5" />
                                                                Renews on:{" "}
                                                                <span className="text-[#A58DE8] font-bold ">{formatDate(renewsOn)}</span>
                                                            </p>
                                                            {subscribedUserCount && (
                                                                <p className="mt-1 flex justify-start gap-1 text-sm">
                                                                    <Users2 className="h-5" />
                                                                    Subscribed Users:{" "}
                                                                    <span className="text-[#A58DE8] font-bold ">{subscribedUserCount}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="flex justify-center py-2 w-full">
                                                        {displayedPlan === 'Money Saver Bundle' ? (
                                                            <Button
                                                                className="border-[#A58DE8] hover:bg-[#815BF5] bg-transparent border  w-full rounded-2xl h-10 px-6"
                                                                onClick={() => {
                                                                    setSelectedPlan("Money Saver Bundle"); // Set the selected 
                                                                    setIsAddUserOpen(true); // Open the dialog to add more users
                                                                }}
                                                            >
                                                                <UserPlus2 className='h-4' />     Add Users
                                                            </Button>
                                                        ) : (
                                                            <Button className="w-full h-10 mt-2 hover:bg-[#815BF5] border-[#A58DE8] border bg-transparent  rounded-2xl " onClick={() => handleSubscribeClick("Money Saver Bundle")}>Subscribe</Button>
                                                        )}
                                                    </div>
                                                </CardHeader>
                                                <div className=" mt-4">
                                                    <CardContent className="bg-transparent">
                                                        <h1 className='p-4 text-blue-400 text-lg whitespace-nowrap'>Zapllo Payroll (Leave & Attendance App)</h1>
                                                        <ul className="list-disc space-y-2  w-full items-center text-sm">
                                                            {[
                                                                "Easy Attendance Marking using Geo location & Face recognition feature",
                                                                "Easy Leave application",
                                                                "Attendance & Leave Tracking",
                                                                "Reports / Dashboards",
                                                                "WhatsApp & Email Notifications",
                                                                "Automatic WhatsApp Reminders",
                                                                "Automatic Email Reminders",
                                                                "Zapllo AI -Proprietory AI Technology",
                                                                "Approval Process",
                                                                "Regularization Process (Apply for past date attendance)",
                                                                "Multiple login & Logouts",
                                                                "Customer Leave Types",


                                                            ].map((item, index) => (
                                                                <li key={index} className="flex gap-2 items-center">
                                                                    <img src="/icons/tick.png" />
                                                                    <span
                                                                        className="text-sm font-medium"
                                                                    >
                                                                        {item}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <h1 className='p-4 text-blue-400 text-lg whitespace-nowrap'>Task Delegation App</h1>
                                                        <ul className="list-disc space-y-2  w-full items-center text-sm">
                                                            {[
                                                                "Delegate Unlimited Tasks",
                                                                "Team Performance Report",
                                                                "Links Management for your Team",
                                                                "Email Notifications",
                                                                "WhatsApp Notifications",
                                                                "Automatic WhatsApp Reminders",
                                                                "Automatic Email Reminders",
                                                                "Repeated Tasks",
                                                                "Zapllo AI -Proprietory AI Technology",
                                                                "File Uploads",
                                                                "Delegate Tasks with Voice Notes",
                                                                "Task Wise Reminders",
                                                                "Daily Task & Team Reports",
                                                                "Save more than 4 hours per day",


                                                            ].map((item, index) => (
                                                                <li key={index} className="flex gap-2 items-center">
                                                                    <img src="/icons/tick.png" />
                                                                    <span
                                                                        className="text-sm font-medium"
                                                                    >
                                                                        {item}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </CardContent>
                                                </div>
                                                <CardFooter />
                                            </Card>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                ) :
                    <div className='flex w-full justify-center mt-24'>
                        <div>
                            <div className='w-full flex justify-center'>
                                <img src='/icons/danger.png' className='h-8' />
                            </div>
                            <h1 className='text-center m'>You are not authorized to view this page!</h1>
                        </div>
                    </div>
                }
            </div >
        </>

    );
}
