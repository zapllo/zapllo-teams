'use client'

import BillingSidebar from '@/components/sidebar/billingSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { LucideTrendingDown, TrendingUpIcon, Wallet, WalletCards } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

type Props = {}

interface OrderLog {
  orderId: string;
  paymentId: string;
  amount: number;
  planName: string;
  creditedAmount: number;
  subscribedUserCount: number;
  additionalUserCount: number;
  deduction: number;
  createdAt: string;
}

export default function WalletLogs({ }: Props) {

  const [orderLogs, setOrderLogs] = useState<OrderLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>();
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(5000);
  const [userCount, setUserCount] = useState(5);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [rechargeGstNumber, setRechargeGstNumber] = useState('');
  const [rechargeModalStep, setRechargeModalStep] = useState(1);
  const [orgCredits, setOrgCredits] = useState<number>(0); // State for subscribed user  

  const router = useRouter();

  const getUserDetails = async () => {
    const res = await axios.get('/api/users/me');
    setCurrentUser(res.data.data);

    const response = await axios.get('/api/organization/getById');
    console.log(response.data.data); // Log the organization data
    const organization = response.data.data;
    console.log(organization, 'organization')
    if (organization) {

      setOrgCredits(organization.credits);

    }


  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const handleRechargeClick = () => {
    setIsRechargeDialogOpen(true);
  };

  const handleRechargeDialogClose = () => {
    setIsRechargeDialogOpen(false);
    setRechargeAmount(5000);
    setRechargeModalStep(1);
    setRechargeGstNumber('');
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
        const { data } = await axios.post('/api/create-order', orderData);
        if (!data.orderId) {
          throw new Error('Order ID not found in the response');
        }
        setIsRechargeDialogOpen(false);
        setIsPaymentProcessing(true);


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
              const { data: verificationResult } = await axios.post('/api/payment-success', {
                ...paymentResult,
                userId: currentUser?._id,
                amount: orderData.amount / 100,
                gstNumber: rechargeGstNumber,
                subscribedUserCount: userCount,
              });
              if (verificationResult.success) {
                toast.success('Recharge successful!');
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

  useEffect(() => {
    const getUserDetails = async () => {
      const res = await axios.get('/api/users/me')
      setCurrentUser(res.data.data);
    }
    getUserDetails();
  }, [])

  useEffect(() => {
    async function fetchOrderLogs() {
      setLoading(true);
      try {
        const response = await fetch('/api/wallet-logs/get');
        const data = await response.json();
        setOrderLogs(data.orders);
      } catch (error) {
        console.error('Error fetching order logs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderLogs();
  }, []);

  // Function to calculate the total deposit (sum of all displayed amounts)
  const calculateTotalDeposit = () => {
    return orderLogs.reduce((total, order) => total + order.amount / 1.18, 0).toFixed(2);
  };

  // Function to calculate the total deduction (sum of credits for non-recharge orders)
  const calculateTotalDeduction = () => {
    return orderLogs.reduce((total, order) => total + order.deduction, 0).toFixed(2);
  };


  if (loading) {
    return <div className='text-center mt-12 p-10'>Loading...</div>;
  }

  if (!orderLogs.length) {
    return (
      <>
        <div className="flex   mt-12">
          <BillingSidebar />
          <div className='flex  justify-center w-full'>
            <div className=' w-full mt-12  justify-center '>
              <div className='flex justify-center'>
                <DotLottieReact
                  src="/lottie/empty.lottie"
                  loop
                  className="h-56"
                  autoplay
                />
              </div>
              <div className='text-center w-full'>
                <h1 className=' text-lg font-semibold text-  '>No Wallet Logs Found</h1>
                <p className='text-sm p-2 '>It seems like you do not have any active plans yet</p>
              </div>
            </div>

          </div>

        </div>

      </>
    )
  }



  return (
    <div className="flex mt-12">
      <BillingSidebar />
      {currentUser?.role === "orgAdmin" ? (
        <div className="flex-1 p-4 overflow-y-scroll h-[620px] scrollbar-hide">
          <div className="w-full ml-2 max-w-8xl mx-auto">
            <div className="gap-2 flex items-center justify-center mb-4 w-full">
              <div className='flex justify-center w-full max-w-3xl ml-4 gap-4'>
                <Card className='p-4 h-fit   border border-[#E0E0E066]  w-full'>

                  <div className='flex items-center justify-between '>
                    <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                    <WalletCards />
                  </div>
                  <h1 className='text-xl'>₹{orgCredits}</h1>
                  <div className="flex mt-4 items-center gap-2">
                    <Button
                      size="sm"
                      className="w-full hover:bg-[#815BF5] border-[#A58DE8] border bg-transparent  rounded-2xl px-6"
                      onClick={handleRechargeClick}
                    >
                      Recharge Now
                    </Button>
                  </div>
                </Card>
                <Card className='p-4 border border-[#E0E0E066]  w-full'>

                  <div className='flex items-center justify-between '>
                    <CardTitle className="text-lg font-medium">Total Deposit</CardTitle>
                    <LucideTrendingDown className='text-[#017a5b]' />
                  </div>
                  <h1 className='text-2xl mt-4'>₹{calculateTotalDeposit()}</h1>

                </Card>
                <Card className='p-4 border border-[#E0E0E066]  w-full'>

                  <div className='flex items-center justify-between '>
                    <CardTitle className="text-lg font-medium">Total Deduction</CardTitle>
                    <TrendingUpIcon className='text-orange-500' />
                  </div>
                  <h1 className='text-2xl mt-4'>₹{calculateTotalDeduction()}</h1>


                </Card>
              </div>
            </div>
            <div className="gap-2 flex  mb-6 w-full">
              <div className="-mt-2 w-full">
                <div className="p-4 w-full">
                  <div className="overflow-x-auto w-full rounded-2xl    ">
                    {/* <h2 className="text-lg font-semibold mb-4">Billing Logs</h2> */}
                    <div className='rounded-2xl border'>
                      <table className="min-w-full bg-[#0B0D29] rounded-2xl  ">
                        <thead className='border-b'>
                          <tr className="bg-[#] rounded-2xl   -100">
                            {/* <th className="px-6 py-3   text-left text-sm font-medium text-gray-400 -700">Order ID</th> */}
                            {/* <th className="px-6 py-3  text-left text-sm font-medium text-gray-400 -700">Payment ID</th> */}
                            <th className="px-6 py-3  text-left text-sm font-medium text-gray-400 -700">Date</th>
                            <th className="px-6 py-3  text-left text-sm font-medium text-gray-400 -700">Type</th>
                            <th className="px-6 py-3  text-left text-sm font-medium text-gray-400 -700">Amount</th>
                            <th className="px-6 py-3  text-left text-sm font-medium text-gray-400 -700">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderLogs.map((order, index) => (
                            <tr key={index} className="border-b">
                              {/* <td className="px-6 py-4 text-sm text-white">{order.orderId}</td> */}
                              {/* <td className="px-6 py-4 text-sm text-white">{order.paymentId}</td> */}
                              <td className="px-6 py-4 text-sm text-white">{new Date(order.createdAt).toLocaleString()}</td>
                              <td className="px-6 py-4 text-sm text-white">{order.planName}</td>
                              <td className="px-6 py-4 text-sm text-white">₹{(order.amount / 1.18).toFixed(2)}</td>
                              <td className="px-6 py-4 text-sm text-white">
                                {order.planName === 'Recharge' ? (
                                  "Wallet Recharge"
                                ) : (
                                  `Added ${order.additionalUserCount && order.additionalUserCount > 0
                                    ? order.additionalUserCount
                                    : order.subscribedUserCount
                                  } users to ${order.planName}`
                                )}
                              </td>



                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                          className="border p-2 rounded outline-none w-full"
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
    </div>

  );
}
