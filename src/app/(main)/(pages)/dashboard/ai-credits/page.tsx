'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from "@/components/ui/tabs3";
import { AreaChart, BadgeDelta, Title, Subtitle, Text } from "@tremor/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, AlertCircle, AreaChart as AreaChartIcon, Wallet, TrendingUp, RotateCcw, Receipt } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import BillingSidebar from '@/components/sidebar/billingSidebar';

interface UsageData {
  date: string;
  usage: number;
}

interface UsageDetails {
  taskId: string;
  taskName: string;
  date: string;
  credits: number;
}

export default function AiCreditsPage() {
  const [aiCredits, setAiCredits] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [usageHistory, setUsageHistory] = useState<UsageData[]>([]);
  const [usageDetails, setUsageDetails] = useState<UsageDetails[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [gstNumber, setGstNumber] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Fetch current user
        const userRes = await axios.get('/api/users/me');
        setCurrentUser(userRes.data.data);
        setIsAdmin(userRes.data.data.role === 'orgAdmin');

        // Fetch AI credits
        const creditsRes = await axios.get('/api/organization/ai-credits');
        if (creditsRes.data.success) {
          setAiCredits(creditsRes.data.aiCredits);
        }

        // Fetch usage history (past 30 days)
        const usageRes = await axios.get('/api/ai-credits/history?type=usage');
        if (usageRes.data.success) {
          processUsageData(usageRes.data.data);
        }

        // Fetch transaction history
        const transactionsRes = await axios.get('/api/ai-credits/history?type=recharge');
        if (transactionsRes.data.success) {
          setRecentTransactions(transactionsRes.data.data.map((tx: any) => ({
            id: tx.transactionId,
            amount: tx.credits,
            date: tx.date,
            status: 'completed' // All transactions in history are completed
          })));
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
        setIsLoading(false);
      }
    };

    // Process usage data to format it for the chart and details view
    const processUsageData = (data: any[]) => {
      // Create a map to aggregate usage by date
      const usageByDate = new Map();

      // Initialize the last 30 days in the map
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        usageByDate.set(dateString, 0);
      }

      // Aggregate usage by date
      data.forEach(item => {
        const dateString = new Date(item.date).toISOString().split('T')[0];
        if (usageByDate.has(dateString)) {
          usageByDate.set(dateString, usageByDate.get(dateString) + item.credits);
        }
      });

      // Convert map to array for chart
      const chartData = Array.from(usageByDate.entries()).map(([date, usage]) => ({
        date,
        usage
      }));

      setUsageHistory(chartData);

      // Process detailed usage records
      setUsageDetails(data.map(item => ({
        taskId: item.taskId || 'N/A',
        taskName: item.task || 'AI Task',
        date: item.date,
        credits: item.credits
      })));
    };

    fetchUserData();

    // Load Razorpay script
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  const handleRecharge = async () => {
    // Get the final amount to charge
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;

    if (amount < 100) {
      toast.error('Minimum recharge amount is 100 credits');
      return;
    }

    try {
      setIsProcessing(true);

      // Amount calculation for payment
      const amountInRupees = amount; // 1 credit = ₹1
      const gstAmount = amountInRupees * 0.18;
      const totalAmount = amountInRupees + gstAmount;

      // Create order
      const orderData = {
        amount: totalAmount * 100, // in paise
        currency: 'INR',
        receipt: `ai-credits-${Date.now()}`,
        notes: {
          type: 'AI Credits',
          credits: amount,
          email: currentUser?.email,
          gstNumber: gstNumber || 'N/A'
        }
      };

      const { data } = await axios.post('/api/create-order', orderData);
      if (!data.orderId) {
        throw new Error('Order ID not found in the response');
      }

      // Close dialog temporarily during payment
      setIsDialogOpen(false);

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Zapllo',
        description: `Recharge ${amount} AI Credits`,
        image: 'https://res.cloudinary.com/dndzbt8al/image/upload/v1732384145/zapllo_pmxgrw.jpg',
        order_id: data.orderId,
        handler: async (response: any) => {
          const paymentResult = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            type: 'AI Credits',
            credits: amount
          };

          try {
            // Verify payment and update AI credits
            const verificationResult = await axios.post('/api/ai-credits/recharge', {
              ...paymentResult,
              userId: currentUser?._id,
              amount: totalAmount,
              credits: amount,
              gstNumber
            });

            if (verificationResult.data.success) {
              setAiCredits(prev => prev + amount);
              toast.success(`Successfully added ${amount} AI credits!`);

              // Add the transaction to the list
              setRecentTransactions(prev => [{
                id: response.razorpay_payment_id,
                amount: amount,
                date: new Date().toISOString(),
                status: 'completed'
              }, ...prev]);
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: `${currentUser?.firstName} ${currentUser?.lastName}`,
          email: currentUser?.email,
          contact: currentUser?.whatsappNo,
        },
        theme: {
          color: "#0B0D26",
        },
      };

      // Open Razorpay payment modal
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error('Payment failed. Please try again.');
      });
      rzp.open();

    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <DotLottieReact
          src="/lottie/loading.lottie"
          loop
          autoplay
          className="h-36 w-36"
        />
      </div>
    );
  }

  // Calculate usage statistics
  const totalUsage = usageHistory.reduce((sum, item) => sum + item.usage, 0);
  const averageUsage = totalUsage / (usageHistory.length || 1);
  const lastWeekUsage = usageHistory.slice(-7).reduce((sum, item) => sum + item.usage, 0);
  const previousWeekUsage = usageHistory.slice(-14, -7).reduce((sum, item) => sum + item.usage, 0);
  const percentChange = previousWeekUsage === 0
    ? 100
    : ((lastWeekUsage - previousWeekUsage) / previousWeekUsage) * 100;

  return (
    <div className="flex h-screen mt-10 overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 border-r">
        <BillingSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">AI Credits Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your organization's AI credits and track usage
            </p>
          </div>

          {/* Credit Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-none shadow-md bg-gradient-to-br from-indigo-950 to-indigo-900 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-300" />
                  <span>Available Credits</span>
                </CardTitle>
                <CardDescription className="text-indigo-200">Current balance of AI credits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <div className="text-4xl font-bold">{aiCredits}</div>
                  <div className="text-indigo-300 mb-1">credits</div>
                </div>
              </CardContent>
              <CardFooter className="">
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="w-full bg-white mt-20 hover:bg-gray-100 text-indigo-900 font-medium"
                >
                  Recharge Credits
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  <span>Usage Statistics</span>
                </CardTitle>
                <CardDescription>Your AI credit consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-semibold">{lastWeekUsage}</div>
                    <div className="text-sm text-muted-foreground">Last 7 days</div>
                  </div>

                </div>
                <BadgeDelta
                  className="gap-1"
                  deltaType={percentChange >= 0 ? "increase" : "decrease"}
                >
                  {`${Math.abs(percentChange).toFixed(0)}% vs previous week`}
                </BadgeDelta>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                Average daily usage: {averageUsage.toFixed(1)} credits
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-indigo-600" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Latest transactions and usage</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="space-y-2">
                  {usageDetails.slice(0, 3).map((detail, i) => (
                    <div key={i} className="flex justify-between items-center p-2 text-sm rounded hover:bg-muted">
                      <div className="truncate max-w-[180px]">{detail.taskName}</div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{detail.credits}</span>
                        <Sparkles className="h-3 w-3 text-indigo-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => document.getElementById('usage-details')?.scrollIntoView({ behavior: 'smooth' })}>
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* AI Credits Usage Chart - Fixed y-axis labels */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <AreaChartIcon className="h-5 w-5 text-indigo-600" />
                    <span>AI Credits Usage Trend</span>
                  </CardTitle>
                  <CardDescription>Daily consumption over time</CardDescription>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last 30 days
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-80   ">
              <div className="h-full w-full text-xs">
                <AreaChart
                  className="h-full"
                  data={usageHistory}
                  index="date"
                  categories={["usage"]}
                  colors={["indigo"]}
                  valueFormatter={(value) => `${value} credits`}
                  showAnimation={true}
                  showLegend={false}
                  yAxisWidth={48} // Increased width for y-axis labels
                  showGridLines={true}
                  autoMinValue={true}
                  minValue={0}
                  maxValue={Math.max(...usageHistory.map(item => item.usage)) + 1}
                  connectNulls={true} // Connect data points even if there are gaps
                  customTooltip={({ payload }) => {
                    if (payload && payload.length > 0) {
                      const dataPoint = payload[0].payload;
                      return (
                        <div className="p-2 bg-white/95 dark:bg-gray-800/95 shadow-lg border rounded-lg">
                          <div className="text-sm font-medium">{new Date(dataPoint.date).toLocaleDateString()}</div>
                          <div className="text-sm text-indigo-600 dark:text-indigo-400 font-bold">{dataPoint.usage} credits</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <div className="flex items-center justify-between w-full">
                <span>Total usage in period: {totalUsage} credits</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span>Credits used</span>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Tabs for Usage Details and Transactions */}
          <Tabs defaultValue="usage" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="usage">Usage Details</TabsTrigger>
              <TabsTrigger value="transactions">Purchase History</TabsTrigger>
            </TabsList>

            <TabsContent value="usage" id="usage-details">
              <Card>
                <CardHeader>
                  <CardTitle>AI Credits Usage Details</CardTitle>
                  <CardDescription>Track where your AI credits are being spent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 bg-muted p-3 font-medium">
                      <div>Task</div>
                      <div>Date</div>
                      <div className="text-center">Credits Used</div>
                      <div className="text-right">Task ID</div>
                    </div>
                    <div className="divide-y">
                      {usageDetails.length > 0 ? (
                        usageDetails.map((detail, i) => (
                          <div key={i} className="grid grid-cols-4 p-3 items-center">
                            <div className="font-medium truncate">{detail.taskName}</div>
                            <div className="text-muted-foreground">{formatDate(detail.date)}</div>
                            <div className="text-center font-semibold">{detail.credits}</div>
                            <div className="text-right text-muted-foreground text-sm truncate">{detail.taskId}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No usage history found
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                  <CardDescription>Records of your AI credits purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 bg-muted p-3 font-medium">
                      <div>Transaction ID</div>
                      <div>Date</div>
                      <div className="text-center">Amount</div>
                      <div className="text-right">Status</div>
                    </div>
                    <div className="divide-y">
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction, i) => (
                          <div key={i} className="grid grid-cols-4 p-3 items-center">
                            <div className="font-medium truncate">{transaction.id}</div>
                            <div className="text-muted-foreground">{formatDate(transaction.date)}</div>
                            <div className="text-center font-semibold">{transaction.amount} credits</div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.status === 'completed'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                }`}>
                                {transaction.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No transaction history found
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Info Card for Admins */}
          {/* {isAdmin && (
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <AlertTitle>Organization Admin Tools</AlertTitle>
              <AlertDescription>
                As an organization admin, you can allocate AI credits to your team members and monitor their usage.
                <Button variant="link" className="p-0 h-auto ml-1" onClick={() => router.push('/dashboard/settings')}>
                  Manage team settings
                </Button>
              </AlertDescription>
            </Alert>
          )} */}

          {/* Recharge Dialog - Revamped */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="m-auto h-fit max-h-screen overflow-y-auto p-0  rounded-xl border-none">
              {/* Dialog Header with Gradient Background */}
              <div className="bg-gradient-to-r from-indigo-700 to-purple-700 p-6 text-white">
                <DialogTitle className="text-2xl text-white font-bold flex items-center gap-3 mb-2">
                  <div className="rounded-full  bg-white/20 p-2">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  Recharge AI Credits
                </DialogTitle>
                <DialogDescription className="text-white/80 text-base">
                  Power up your AI capabilities with additional credits
                </DialogDescription>
              </div>

              <div className="p-6 space-y-6">
                {/* Plan Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Select a Recharge Package</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { amount: 100, label: 'Basic', description: 'Get started with basic AI tasks' },
                      { amount: 200, label: 'Standard', description: 'For regular AI usage' },
                      { amount: 500, label: 'Pro', description: 'For power users and teams' },
                      { amount: 1000, label: 'Enterprise', description: 'Full-scale AI automation' },
                    ].map((plan) => (
                      <div
                        key={plan.amount}
                        onClick={() => {
                          setCustomAmount('');
                          setSelectedAmount(plan.amount);
                        }}
                        className={`relative cursor-pointer rounded-xl transition-all duration-200 ${!customAmount && selectedAmount === plan.amount
                          ? 'ring-2 ring-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                          : 'border border-border hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20'
                          } p-4`}
                      >
                        {!customAmount && selectedAmount === plan.amount && (
                          <div className="absolute top-3 right-3 h-4 w-4 rounded-full bg-indigo-600"></div>
                        )}
                        <div className="flex flex-col h-full">
                          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{plan.amount}</div>
                          <div className="font-medium">{plan.label}</div>
                          <div className="text-sm text-muted-foreground mt-1">{plan.description}</div>
                          <div className="mt-auto pt-2 text-sm font-medium">
                            ₹{(plan.amount * 1.18).toFixed(0)} <span className="text-muted-foreground font-normal">(incl. GST)</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Section */}
                <div className="pt-2">
                  <div
                    onClick={() => {
                      if (!customAmount) {
                        setCustomAmount('100');
                        setSelectedAmount(0);
                      }
                    }}
                    className={`
            relative cursor-pointer rounded-xl transition-all duration-200 ${customAmount
                        ? 'ring-2 ring-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                        : 'border border-border hover:border-indigo-400'
                      } p-4`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Custom Amount</h3>
                      {customAmount && (
                        <div className="h-4 w-4 rounded-full bg-indigo-600"></div>
                      )}
                    </div>

                    <div className="relative">
                      <Input
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(0);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`pl-8 text-lg font-medium h-12 ${customAmount ? 'border-indigo-300 focus-visible:ring-indigo-500' : 'border-dashed'}`}
                        placeholder="Enter custom amount"
                        type="number"
                        min="100"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">₹</span>

                      {customAmount && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Total: ₹{((parseInt(customAmount) || 0) * 1.18).toFixed(2)} (incl. 18% GST)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* GST Number Input */}
                <div className="space-y-2">
                  <Label htmlFor="gst-number" className="text-sm font-medium">GST Number (Optional)</Label>
                  <div className="relative">
                    <Input
                      id="gst-number"
                      placeholder="Enter GST number for invoice"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      className="pl-10"
                    />
                    <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Providing GST number helps us generate proper tax invoices</p>
                </div>

                {/* Order Summary */}
                <div className="rounded-xl bg-muted p-4 space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    Order Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Credits</span>
                      <span className="font-medium">{customAmount ? parseInt(customAmount) || 0 : selectedAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{customAmount ? parseInt(customAmount) || 0 : selectedAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%)</span>
                      <span>₹{((customAmount ? parseInt(customAmount) || 0 : selectedAmount) * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium text-base">
                      <span>Total</span>
                      <span className="text-indigo-600 dark:text-indigo-400">₹{((customAmount ? parseInt(customAmount) || 0 : selectedAmount) * 1.18).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dialog Footer with Actions */}
              <div className="flex items-center justify-between border-t p-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isProcessing}
                  className="text-muted-foreground"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRecharge}
                  disabled={isProcessing || (!customAmount && selectedAmount === 0)}
                  className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <DotLottieReact
                        src="/lottie/loading.lottie"
                        loop
                        autoplay
                        className="h-5 w-5"
                      />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      <span>Proceed to Payment</span>
                    </div>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
