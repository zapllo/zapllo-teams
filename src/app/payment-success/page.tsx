'use client';

import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const PaymentSuccess = () => {
  const router = useRouter();

  const handleBackToTasks = () => {
    router.replace('/dashboard/billing');
  };

  return (
    <div className="flex items-center justify-center h-screen  bg-[#04061E]">
      <div className="text-center ">
        <div className="flex flex-col items-center mb-8">
        {/* <Image
            src="/logo.png" // Ensure this path points to your illustration
            alt="Payment Success"
            width={200}
            height={200}
            className="mb-4"
          /> */}
          {/* <Image
            src="/animations/money.gif" // Ensure this path points to your illustration
            alt="Payment Success"
            width={200}
            height={200}
            className="mb-4"
          /> */}
          <h1 className="text-3xl font-bold text-white/80">
          🎉Congratulations, Your Subscription is Active!
          </h1>
        </div>
        <Card className="bg-[#2A2A2A] p-8 rounded-lg shadow-lg">
          <CardTitle className="text-2xl font-bold text-white">
            Payment  Successful
          </CardTitle>
          <p className="text-gray-300 mt-4">
            Your payment has been successfully processed and your credits have been updated.
          </p>
          <Button
            className="mt-6 bg-[#007A5A] hover:bg-[#006148] text-white transition-colors duration-200 px-6 py-3 text-lg rounded-md"
            onClick={handleBackToTasks}
          >
            Back to Billing
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
