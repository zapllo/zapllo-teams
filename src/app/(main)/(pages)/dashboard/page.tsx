"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import { useTrialStatus } from "@/providers/trial-status-provider";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Calendar, CheckCircleIcon, Clock, Globe, Lock, Megaphone, PlayCircle, Users, TrendingUp, HeadphonesIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaAndroid, FaApple } from "react-icons/fa";

// Define types for ChecklistItem and Progress
interface ChecklistItem {
  _id: string;
  text: string;
  tutorialLink?: string;
}

interface ProductCardProps {
  icon: string;
  title: string;
  description: string;
  href?: string;
  external?: boolean;
  isLocked?: boolean;
  isComingSoon?: boolean;
  hasAccess?: boolean;
  isPlanEligible?: boolean;
  trialExpires?: string;
  remainingTime?: string;
  onStartTrial?: () => void;
  isTrialLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  icon,
  title,
  description,
  href,
  external = false,
  isLocked = false,
  isComingSoon = false,
  hasAccess = true,
  isPlanEligible = false,
  trialExpires,
  remainingTime,
  onStartTrial,
  isTrialLoading = false,
}) => {
  const renderButton = () => {
    if (isComingSoon) {
      return (
        <Button className="bg-[#815BF5] py-2 px-4 hover:bg-[#815BF5] opacity-50 text-sm">
          Coming Soon
        </Button>
      );
    }

    if (isLocked || !hasAccess) {
      return (
        <Button className="bg-[#815BF5] flex dark:text-white gap-2 py-2 px-4 text-sm opacity-80">
          <Lock className="h-4 w-4" />
          <span>Locked</span>
        </Button>
      );
    }

    if (hasAccess) {
      if (isPlanEligible) {
        return (
          <Link href={href!} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
            <Button className="bg-[#815BF5] py-2 px-4 hover:bg-[#5f31e9] text-sm">
              Open {title.split(' ')[1]}
            </Button>
          </Link>
        );
      } else if (trialExpires) {
        return (
          <div className="w-full space-y-2">
            <p className="text-xs mb-2 text-red-600">
              Free Trial Expires {remainingTime}
            </p>
            <Link href={href!}>
              <Button className="bg-[#815BF5] py-2 px-4 hover:bg-[#5f31e9] text-sm w-full">
                Open {title.split(' ')[1]}
              </Button>
            </Link>
          </div>
        );
      } else if (onStartTrial) {
        return (
          <Button
            onClick={onStartTrial}
            className="bg-[#815BF5] py-2 px-4 hover:bg-[#5f31e9] text-sm"
          >
            {isTrialLoading ? (
              <div className="flex items-center gap-2">
                <Loader /> Starting trial
              </div>
            ) : (
              "Start Free Trial"
            )}
          </Button>
        );
      }
    }

    return (
      <Link href={href!} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        <Button className="bg-[#815BF5] py-2 px-4 hover:bg-[#5f31e9] text-sm">
          Open {title.split(' ')[1]}
        </Button>
      </Link>
    );
  };

  return (
    <Card className="border dark:border-[#E0E0E066] shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
      <CardHeader className="pb-4">
        <div className="rounded-full flex items-center justify-center h-14 w-14 border dark:border-[#E0E0E066] mb-3 bg-gradient-to-br from-[#815BF5]/10 to-[#815BF5]/5">
          <img src={icon} className="h-7 w-7" alt={title} />
        </div>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-0">
        {renderButton()}
      </CardFooter>
    </Card>
  );
};

const DashboardPage = () => {
  const [progress, setProgress] = useState<String[]>([]);
  const { fetchTrialIconStatus } = useTrialStatus(); // Get fetchTrialStatus from context
  const [userId, setUserId] = useState("");
  const [leavesTrialExpires, setLeavesTrialExpires] = useState(Date());
  const [attendanceTrialExpires, setAttendanceTrialExpires] = useState(Date());
  const [role, setRole] = useState<string | null>(null); // Track the user's role
  const [isLeaveAcess, setIsLeaveAccess] = useState<boolean | null>(null); // Track the user's role
  const [isPlanEligible, setIsPlanEligible] = useState<boolean | null>(null); // Track the user's role
  const [isTaskPlanEligible, setIsTaskPlanEligible] = useState<boolean | null>(null); // Track the user's role
  const [isTaskAccess, setIsTaskAccess] = useState<boolean | null>(null); // Track the user's role
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(false); // Track the user's role
  const router = useRouter();
  const [leavesRemainingTime, setLeavesRemainingTime] = useState("");
  const [attendanceRemainingTime, setAttendanceRemainingTime] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Global loading state
  const [isFreeTrialLoading, setFreeTrialLoading] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]); // Array of ChecklistItem

  useEffect(() => {
    if (leavesTrialExpires) {
      const calculateLeavesRemainingTime = () => {
        const now = new Date();
        const distance = formatDistanceToNow(new Date(leavesTrialExpires), {
          addSuffix: true,
        });
        setLeavesRemainingTime(distance);
      };
      calculateLeavesRemainingTime();
      const leavesInterval = setInterval(
        calculateLeavesRemainingTime,
        1000 * 60
      ); // Update every minute
      return () => clearInterval(leavesInterval);
    }
  }, [leavesTrialExpires]);

  useEffect(() => {
    if (attendanceTrialExpires) {
      const calculateAttendanceRemainingTime = () => {
        const now = new Date();
        const distance = formatDistanceToNow(new Date(attendanceTrialExpires), {
          addSuffix: true,
        });
        setAttendanceRemainingTime(distance);
      };
      calculateAttendanceRemainingTime();
      const attendanceInterval = setInterval(
        calculateAttendanceRemainingTime,
        1000 * 60
      ); // Update every minute
      return () => clearInterval(attendanceInterval);
    }
  }, [attendanceTrialExpires]);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const userRes = await axios.get("/api/users/me");
        setUserId(userRes.data.data._id);
        setRole(userRes.data.data.role); // Set role from the response
        setIsLeaveAccess(userRes.data.data.isLeaveAccess);
        setIsTaskAccess(userRes.data.data.isTaskAccess);
        // Redirect if the role is Admin
        if (userRes.data.data.role === "Admin") {
          router.replace("/admin/dashboard"); // Redirect to admin dashboard
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    getUserDetails();
  }, [router]);

  useEffect(() => {
    const fetchChecklistItems = async () => {
      try {
        const res = await axios.get("/api/checklist/get");
        setChecklistItems(res.data.checklistItems);
        // Fetch user progress
        const progressRes = await axios.get('/api/get-checklist-progress');
        setProgress(progressRes.data.progress || []);
      } catch (error) {
        console.error("Error fetching checklist items:", error);
      }
    };

    fetchChecklistItems();
  }, []);

  const calculateProgress = () => {
    if (!checklistItems.length) return 0;
    const completedCount = checklistItems.filter((item) => progress.includes(item._id)).length;
    const progressPercentage = (completedCount / checklistItems.length) * 100;
    return Math.round(progressPercentage);
  };

  const fetchTrialStatus = async () => {
    try {
      const response = await axios.get("/api/organization/getById");
      const {
        leavesTrialExpires,
        attendanceTrialExpires,
        isPro,
        subscribedPlan,
      } = response.data.data;

      const eligiblePlans = ["Money Saver Bundle", "Zapllo Payroll"];
      const taskEligiblePlans = ["Zapllo Tasks", "Money Saver Bundle"]; // Define task-eligible plans
      const isPlanEligible = eligiblePlans.includes(subscribedPlan);
      const isTaskPlanEligible = taskEligiblePlans.includes(subscribedPlan);

      setLeavesTrialExpires(
        isPlanEligible || (leavesTrialExpires && new Date(leavesTrialExpires) > new Date())
          ? leavesTrialExpires
          : null
      );
      setAttendanceTrialExpires(
        isPlanEligible || (attendanceTrialExpires && new Date(attendanceTrialExpires) > new Date())
          ? attendanceTrialExpires
          : null
      );
      setIsSubscribed(isPro);
      setIsPlanEligible(isPlanEligible);
      setIsTaskPlanEligible(isTaskPlanEligible); // Track task plan eligibility
    } catch (error) {
      console.error("Error fetching trial status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrialStatus();
  }, []);

  const startTrial = async (product: string) => {
    setFreeTrialLoading(true);
    try {
      const trialDate = new Date();
      trialDate.setDate(trialDate.getDate() + 7); // Set trial for 7 days
      await axios.post("/api/organization/start-trial", {
        product,
        trialExpires: trialDate,
      });
      await fetchTrialIconStatus(); // Refresh the trial status in the context
      await fetchTrialStatus(); // Refresh the trial status after starting the trial
    } catch (error) {
      console.error("Error starting trial:", error);
    } finally {
      setFreeTrialLoading(false);
    }
  };

  // Replace the simple loader implementation with a more engaging one
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-white to-gray-50 dark:from-[#04061e] dark:to-[#080a29]">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-4 border-[#815BF5] border-t-transparent animate-spin"></div>
          {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img src="/logo.png" alt="Zapllo" className="h-full w-full" />
          </div> */}
        </div>
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold text-[#815BF5] animate-pulse">Loading your workspace</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Preparing your business tools...</p>
        </div>
      </div>
    );
  }

  return (

  <div className="dark:bg-[#04061e] bg-[#ffffff] mb-16 overflow-y-scroll pt-2 scale-95 h-screen relative overflow-x-hidden scrollbar-hide">
    <div className="mx-auto px-6 mt-12">
      {/* Welcome Section - Enhanced */}
      <div className="relative mb-12 overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#815BF5]/5 via-blue-500/5 to-purple-600/5 rounded-2xl"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-[#815BF5]/10 to-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-[#815BF5]/10 rounded-full blur-xl"></div>
        {/* Content */}
        <div className="relative z-10 p-8  md:p-12">
          <div className="max-w-4xl">
            {/* Greeting with time-based message */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#815BF5] to-purple-600 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[#815BF5] bg-[#815BF5]/10 px-3 py-1 rounded-full">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent mb-4 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-[#815BF5] to-purple-600 bg-clip-text text-transparent">
                Zapllo Workspace
              </span>
            </h1>

            {/* Subtitle with enhanced styling */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-2xl">
              Your all-in-one business management platform designed to{' '}
              <span className="font-semibold text-gray-800 dark:text-gray-100">streamline operations</span>,{' '}
              <span className="font-semibold text-gray-800 dark:text-gray-100">boost productivity</span>, and{' '}
              <span className="font-semibold text-gray-800 dark:text-gray-100">drive growth</span>.
            </p>

            {/* Quick stats or features */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200/50 dark:border-gray-700/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">All Systems Online</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200/50 dark:border-gray-700/50">
                <Users className="w-4 h-4 text-[#815BF5]" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Management</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200/50 dark:border-gray-700/50">
                <TrendingUp className="w-4 h-4 text-[#815BF5]" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Growth Tools</span>
              </div>
            </div>

            {/* Call to action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-[#815BF5] to-purple-600 hover:from-[#5f31e9] hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                Get Started
              </Button>
              
              <Button variant="outline" className="border-2 border-[#815BF5]/20 hover:border-[#815BF5]/40 text-gray-700 dark:text-gray-300 hover:text-[#815BF5] dark:hover:text-[#815BF5] font-medium px-6 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
                Watch Tutorials
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom border with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#815BF5]/30 to-transparent"></div>
      </div>


        {/* Team Management Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your team, tasks, and workplace efficiency</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCard
              icon="/icons/atask.png"
              title="Zapllo Tasks"
              description="Delegate one time and recurring tasks to your team members efficiently"
              href="/dashboard/tasks"
              hasAccess={isTaskAccess || isTaskPlanEligible}
              isLocked={!(isTaskAccess || isTaskPlanEligible)}
            />
            
            <ProductCard
              icon="/icons/Zapllo Leaves.png"
              title="Zapllo Leaves"
              description="Manage employee leave requests and holiday schedules seamlessly"
              href="/attendance/my-leaves"
              hasAccess={isLeaveAcess}
              isPlanEligible={isPlanEligible}
              trialExpires={leavesTrialExpires}
              remainingTime={leavesRemainingTime}
              onStartTrial={() => startTrial("leaves")}
              isTrialLoading={isFreeTrialLoading}
              isLocked={role !== "orgAdmin" && !leavesTrialExpires && !isLeaveAcess}
            />
            
            <ProductCard
              icon="/icons/Zapllo attendance.png"
              title="Zapllo Attendance"
              description="Track team attendance, breaks, and working hours accurately"
              href="/attendance/my-attendance"
              hasAccess={isLeaveAcess}
              isPlanEligible={isPlanEligible}
              trialExpires={leavesTrialExpires}
              remainingTime={leavesRemainingTime}
              onStartTrial={() => startTrial("attendance")}
              isTrialLoading={isFreeTrialLoading}
              isLocked={role !== "orgAdmin" && !leavesTrialExpires && !isLeaveAcess}
            />
            
            <ProductCard
              icon="/icons/Zapllo Intranet.png"
              title="Zapllo Intranet"
              description="Centralized hub for all your important company links and resources"
              href="/intranet"
            />
          </div>
        </section>

        {/* Sales & Marketing Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-2">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sales & Marketing</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tools to grow your business and manage customer relationships</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCard
              icon="/icons/Group.png"
              title="Zapllo WABA"
              description="Official WhatsApp Business API for professional communication"
              href="https://zaptick.io"
              external={true}
            />
            
            <ProductCard
              icon="/icons/crm.png"
              title="Zapllo CRM"
              description="Track, convert and assign leads to your sales team effectively"
              href="https://crm.zapllo.com/login"
              external={true}
            />
            
           
            <ProductCard
              icon="/branding/AII.png"
              title="Zapllo AI Agents"
              description="Upgrade your experience 10X with proprietary AI technology"
              href="https://ai.zapllo.com"
              isComingSoon={false}
            />
             <ProductCard
              icon="/branding/teamsicon.png"
              title="Instagram Automations"
              description="Automate your Instagram marketing with AI to grow your social media presence effortlessly."
              isComingSoon={true}
            />
            
          </div>
        </section>

        {/* App Support Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-2">
              <HeadphonesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Support & Resources</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get help, learn new features, and stay updated</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* {calculateProgress() < 100 && (
              <Card className="border dark:border-[#E0E0E066] shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="rounded-full flex items-center justify-center h-14 w-14 border dark:border-[#E0E0E066] mb-3 bg-gradient-to-br from-[#815BF5]/10 to-[#815BF5]/5">
                    <CheckCircleIcon className="h-7 w-7 text-[#815BF5]" />
                  </div>
                  <CardTitle className="text-lg font-semibold">Getting Started Checklist</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    Complete your onboarding steps to unlock the full potential
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="space-y-2">
                    <Progress value={calculateProgress()} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {calculateProgress()}% Complete
                      </span>
                      <span className="text-xs font-medium text-[#815BF5]">
                        {checklistItems.filter((item) => progress.includes(item._id)).length} / {checklistItems.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Link href="/help/checklist">
                    <Button className="bg-[#815BF5] py-2 px-4 hover:bg-[#5f31e9] text-sm">
                      Continue Setup
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )} */}

            <Card className="border dark:border-[#E0E0E066] shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="rounded-full flex items-center justify-center h-14 w-14 border dark:border-[#E0E0E066] mb-3 bg-gradient-to-br from-[#815BF5]/10 to-[#815BF5]/5">
                  <PlayCircle className="h-7 w-7 text-[#815BF5]" />
                </div>
                <CardTitle className="text-lg font-semibold">Video Tutorials</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Learn how to get the best out of your business workspace
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Link href="/help/tutorials">
                  <Button className="bg-white border hover:bg-gray-50 text-black text-sm py-2 px-4">
                    Watch Tutorials
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border dark:border-[#E0E0E066] shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="rounded-full flex items-center justify-center h-14 w-14 border dark:border-[#E0E0E066] mb-3 bg-gradient-to-br from-[#815BF5]/10 to-[#815BF5]/5">
                  <img src="/icons/events.png" className="h-7 w-7" alt="Events" />
                </div>
                <CardTitle className="text-lg font-semibold">Live Events</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Live Q&A sessions and weekly business growth workshops
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Link href="/help/events">
                  <Button className="bg-white border hover:bg-gray-50 text-black text-sm py-2 px-4">
                    Join Events
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;