'use client';

import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, MessageSquareWarning } from 'lucide-react';

const PaymentFailed = () => {
  const router = useRouter();

  const handleRetryPayment = () => {
    router.push('/dashboard/billing'); // Redirect back to the billing page or payment initiation page
  };

  // Function to handle sending email to support
  const handleEmailSupport = () => {
    window.location.href = 'mailto:support@zapllo.com?subject=Payment Failure Assistance&body=Hello Support Team,%0D%0A%0D%0AI encountered a payment failure while attempting to subscribe or recharge. Please assist me in resolving this issue.%0D%0A%0D%0AThank you,%0D%0A[Your Name]';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#04061E]">
      <div className="text-center">
        <div className="flex flex-col items-center mb-8">
          {/* <Image
            src="/images/payment-failed.svg" // Ensure this path points to your illustration
            alt="Payment Failed"
            width={200}
            height={200}
            className="mb-4"
          /> */}
          <h1 className="text-3xl font-bold text-red-500">
             Oops ! Payment Failed
          </h1>
        </div>
        <Card className="bg-[#2A2A2A] p-8 rounded-lg shadow-lg">
          <CardTitle className="text-2xl font-bold text-white">
            Transaction Unsuccessful
          </CardTitle>
          <p className="text-gray-300 mt-4">
            Unfortunately, we could not process your payment. Please try again or contact support if the issue persists.
          </p>
          <Button
            className="mt-6 bg-[#007A5A] hover:bg-[#006148] text-white transition-colors duration-200 px-6 py-3 text-lg rounded-md"
            onClick={handleRetryPayment}
          >
            Retry Payment
          </Button>
          <div className='w-full justify-center flex mt-4'>
            <Button
              className="bg-[#017a5b] text-center  justify-center flex  gap-2 hover:bg-[#6B2F77] text-white transition-colors duration-200 px-6 py-2 mt-1 text-lg rounded-md"
              onClick={handleEmailSupport}
            >
              <Mail className='h-6' />  Contact Support
            </Button>
          </div>
        </Card>

        <div className='w-full  flex justify-center'>
          <p className='bottom-0 py-2 mb-4 -mt-4 text-center absolute'>Reach out to the support team :
            <a className='ml-2 text-blue-400 hover:underline' href="mailto:support@zapllo.com">support@zapllo.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
