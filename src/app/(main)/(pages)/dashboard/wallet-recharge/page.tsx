"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, CreditCard, Check, MessageSquare, Bell, Shield, ShoppingBag, HelpCircle, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BillingSidebar from "@/components/sidebar/billingSidebar";

export default function WalletRechargePage() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(500);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingOrg, setLoadingOrg] = useState<boolean>(true);
  const [organization, setOrganization] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Preset amounts for quick selection
  const presetAmounts = [500, 1000, 2000, 5000, 10000];

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const response = await fetch('/api/users/me');
        const userData = await response.json();
        setUser(userData.data);

        if (userData.data && userData.data.organization) {
          const orgId = userData.data.organization;
          const orgResponse = await fetch(`/api/organization/getById`);
          const orgData = await orgResponse.json();

          if (orgData.data) {
            setOrganization(orgData.data);

            // Initialize whatsAppWallet if it doesn't exist in the organization data
            if (!orgData.data.whatsAppWallet) {
              setOrganization({
                ...orgData.data,
                whatsAppWallet: {
                  balance: 0,
                  lastRecharge: null,
                  rechargeHistory: []
                }
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
        toast.error("Failed to load organization data. Please try again later.");
      } finally {
        setLoadingOrg(false);
      }
    };

    fetchOrganizationData();
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAmount(value);
    } else {
      setAmount(0);
    }
  };

  const selectPresetAmount = (preset: number) => {
    setAmount(preset);
  };

  const handleRecharge = async () => {
    if (amount < 100) {
      toast("Please enter a valid amount (minimum ₹100)")
      return;
    }

    setLoading(true);

    try {
      // Create a Razorpay order
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Amount in paise
          currency: 'INR',
          receipt: `whatsapp-recharge-${Date.now()}`,
          notes: {
            type: 'WhatsApp API Wallet Recharge',
          },
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.orderId) {
        throw new Error('Failed to create order');
      }

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: amount * 100,
          currency: 'INR',
          name: 'Zapllo',
          description: 'WhatsApp API Wallet Recharge',
          order_id: orderData.orderId,
          handler: async (response: any) => {
            // Process the successful payment
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: organization.users[0], // Assuming the first user is the admin
              amount: amount,
              planName: 'WhatsAppRecharge', // Changed from 'Recharge' to 'WhatsAppRecharge' to differentiate
              subscribedUserCount: organization.subscribedUserCount || 0,
            };

            const result = await fetch('/api/payment-success', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(paymentData),
            });

            const paymentResult = await result.json();

            if (paymentResult.success) {
              toast("Payment Successful! Your WhatsApp wallet has been recharged.");

              // Refresh organization data
              const orgResponse = await fetch(`/api/organization/getById`);
              const orgData = await orgResponse.json();
              if (orgData.data) {
                setOrganization(orgData.data);
              }
            } else {
              toast("Payment Failed! Please try again.");
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: {
            color: '#25D366', // WhatsApp green color
          },
        };

        const razorpayInstance = (window as any).Razorpay(options);
        razorpayInstance.open();
      };

    } catch (error) {
      console.error('Payment error:', error);
      toast("An error occurred while processing the payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingOrg) {
    return (
      <div className="flex h-screen">
        <BillingSidebar />
        <div className="flex flex-col items-center justify-center flex-1">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">Loading WhatsApp wallet information...</p>
        </div>
      </div>
    );
  }

  // Get the WhatsApp wallet balance safely
  const whatsAppBalance = organization?.whatsAppWallet?.balance || 0;

  // WhatsApp message rates by category
  const messageRates = [
    {
      type: "Utility",
      icon: <Bell className="h-4 w-4 text-blue-500" />,
      rate: "₹0.25",
      description: "Transactional notifications, account updates, and service alerts",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      type: "Authentication",
      icon: <Shield className="h-4 w-4 text-indigo-500" />,
      rate: "₹0.12",
      description: "OTPs, verification codes, and security alerts",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      type: "Marketing",
      icon: <ShoppingBag className="h-4 w-4 text-orange-500" />,
      rate: "₹0.80",
      description: "Promotional messages, offers, and marketing campaigns",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      type: "Service",
      icon: <HelpCircle className="h-4 w-4 text-green-500" />,
      rate: "₹0.60",
      description: "Customer support, service updates, and feedback",
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  return (
    <div className="flex h-screen mt-12 overflow-hidden">
      <BillingSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <MessageSquare className="mr-2 h-8 w-8 text-green-600" />
            WhatsApp API Wallet
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Current Balance */}
            <Card className="shadow-md bg-transparent dark:text-white border-green-100 dark:border-border">
              <CardHeader className="dark:bg-transparent bg-green-50">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  WhatsApp Balance
                </CardTitle>
                <CardDescription>Your current WhatsApp API messaging credit balance</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center p-6">
                  <div className="text-4xl font-bold text-green-600">₹{whatsAppBalance}</div>
                  <Progress
                    value={whatsAppBalance > 0 ? Math.min(100, (whatsAppBalance / 1000) * 100) : 0}
                    className="w-full mt-4 0"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {whatsAppBalance > 200
                      ? "Your balance is sufficient for WhatsApp messaging"
                      : "Your WhatsApp balance is low, consider recharging"}
                  </p>
                </div>

                <div className="mt-4 p-4 bg-green-50 dark:bg-transparent rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" /> WhatsApp Usage Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Last Recharge:</div>
                    <div className="font-medium">
                      {organization?.whatsAppWallet?.lastRecharge
                        ? new Date(organization.whatsAppWallet.lastRecharge).toLocaleDateString()
                        : 'Never'}
                    </div>
                  </div>

                  {/* Message Rates Section */}
                  <div className="mt-4">
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <Info className="h-4 w-4 text-green-600" />
                      Message Rates
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60">Rates vary by message type. GST is additional.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h4>
                    <div className="space-y-2">
                      {messageRates.map((rate, index) => (
                        <div
                          key={index}
                          className={`flex justify-between dark:bg-transparent dark:border items-center p-2 rounded-md ${rate.bgColor}`}
                        >
                          <div className="flex items-center gap-2">
                            {rate.icon}
                            <span className={`${rate.color} font-medium`}>{rate.type}</span>
                          </div>
                          <div className="font-medium">{rate.rate}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Recharge Form */}
            <Card className="shadow-md dark:border-border dark:bg-transparent border-green-100">
              <CardHeader className="bg-green-50 dark:bg-transparent">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Recharge WhatsApp Wallet
                </CardTitle>
                <CardDescription>Add credits to your WhatsApp API messaging wallet</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="100"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="Enter amount"
                      className="mt-1 text-black dark:text-white"
                    />
                  </div>

                  <div>
                    <Label>Quick Select</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {presetAmounts.map((preset) => (
                        <Button
                          key={preset}
                          variant={amount === preset ? "default" : "outline"}
                          className={amount === preset ? "bg-green-600 hover:bg-green-700" : ""}
                          onClick={() => selectPresetAmount(preset)}
                        >
                          ₹{preset}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="dark:bg-transparent bg-green-50 p-4 rounded-lg mt-6">
                    <h3 className="font-medium mb-2">Payment Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Recharge Amount</span>
                        <span>₹{amount}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>GST (18%)</span>
                        <span>₹{(amount * 0.18).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t border-green-200">
                        <span>Total</span>
                        <span>₹{(amount * 1.18).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  onClick={handleRecharge}
                  disabled={loading || amount < 100}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Recharge Now
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Transaction History */}
          <Card className="mt-8 shadow-md dark:bg-transparent dark:border-border border-green-100">
            <CardHeader className="dark:bg-transparent bg-green-50">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                WhatsApp Transaction History
              </CardTitle>
              <CardDescription>Recent WhatsApp wallet transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {organization?.whatsAppWallet?.rechargeHistory &&
               organization.whatsAppWallet.rechargeHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-green-100">
                        <th className="text-left py-3 font-medium">Date</th>
                        <th className="text-left py-3 font-medium">Transaction ID</th>
                        <th className="text-right py-3 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organization.whatsAppWallet.rechargeHistory.map((transaction: any, index: number) => (
                        <tr key={index} className="border-b border-green-50">
                          <td className="py-3">{new Date(transaction.date).toLocaleDateString()}</td>
                          <td className="py-3">{transaction.transactionId}</td>
                          <td className="py-3 text-right">₹{transaction.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No transaction history available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
