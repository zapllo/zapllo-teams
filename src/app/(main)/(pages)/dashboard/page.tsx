"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import { useTrialStatus } from "@/providers/trial-status-provider";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Calendar, CheckCircleIcon, Clock, Globe, Lock, Megaphone, PlayCircle } from "lucide-react";
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader size="lg" /></div>;
  }

  return (
    <div className="dark:bg-[#04061e] bg-[#ffffff] mb-16 overflow-y-scroll pt-2 scale-95 h-screen relative overflow-x-hidden scrollbar-hide">
      {/* Business Apps Section - First and directly visible */}
      <div className=" mx-auto px-4 mt-12">
        {/* <h2 className="text-xl font-bold mb-6">My Business Apps</h2> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {/* Zapllo Tasks */}
          <Card className="border dark:border-[#E0E0E066] shadow-sm h-full">
            <CardHeader>
              <div className="rounded-full flex items-center justify-center h-12 w-12 border dark:border-[#E0E0E066] mb-2">
                <img src="/icons/atask.png" className="h-6 " alt="Tasks" />
              </div>
              <CardTitle className="text-lg font-medium">Zapllo Tasks</CardTitle>
              <CardDescription>
                Delegate one time and recurring task to your team
              </CardDescription>
            </CardHeader>
            <CardFooter>
              {(isTaskAccess || isTaskPlanEligible) ? (
                <Link href="/dashboard/tasks">
                  <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                    Go To Task Management
                  </Button>
                </Link>
              ) : (
                <Button className="bg-[#815BF5] flex dark:text-white gap-1 py-1 text-xs opacity-80">
                  <Lock className="h-4" />
                  <span>Locked</span>
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Zapllo Intranet */}
          <Card className="border dark:border-[#E0E0E066] shadow-sm h-full">
            <CardHeader>
              <div className="rounded-full flex items-center justify-center h-12 w-12 border dark:border-[#E0E0E066] mb-2">
                <img src="/icons/Zapllo Intranet.png" className="h-6 " alt="Intranet" />
              </div>
              <CardTitle className="text-lg font-medium">Zapllo Intranet</CardTitle>
              <CardDescription>
                Manage all your Important Company Links
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/intranet">
                <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                  Go To Intranet
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Zapllo Leaves */}
          <Card className="border dark:border-[#E0E0E066] shadow-sm h-full">
            <CardHeader>
              <div className="rounded-full flex items-center justify-center h-12 w-12 border dark:border-[#E0E0E066] mb-2">
                <img src="/icons/Zapllo Leaves.png" className="h-6 " alt="Leaves" />
              </div>
              <CardTitle className="text-lg font-medium">Zapllo Leaves</CardTitle>
              <CardDescription>
                Manage your Employee Leaves & Holidays
              </CardDescription>
            </CardHeader>
            <CardFooter>
              {isLeaveAcess ? (
                isPlanEligible ? (
                  <Link href="/attendance/my-leaves">
                    <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                      Go To Leaves
                    </Button>
                  </Link>
                ) : leavesTrialExpires ? (
                  <div className="w-full space-y-2">
                    <p className="text-xs mb-2 text-red-600">
                      Free Trial Expires {leavesRemainingTime}
                    </p>
                    <Link href="/attendance/my-leaves">
                      <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                        Go To Leaves
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    onClick={() => startTrial("leaves")}
                    className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs"
                  >
                    {isFreeTrialLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader /> Starting trial
                      </div>
                    ) : (
                      "Start Trial"
                    )}
                  </Button>
                )
              ) : role !== "orgAdmin" && !leavesTrialExpires || !isLeaveAcess ? (
                <Button className="bg-[#815BF5] flex dark:text-white gap-1 py-1 text-xs opacity-80">
                  <Lock className="h-4" />
                  <span>Locked</span>
                </Button>
              ) : (
                <Link href="/attendance/my-leaves">
                  <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                    Go To Attendance
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>

          {/* Zapllo Attendance */}
          <Card className="border dark:border-[#E0E0E066] shadow-sm h-full">
            <CardHeader>
              <div className="rounded-full flex items-center justify-center h-12 w-12 border dark:border-[#E0E0E066] mb-2">
                <img src="/icons/Zapllo attendance.png" className="h-6 " alt="Attendance" />
              </div>
              <CardTitle className="text-lg font-medium">Zapllo Attendance</CardTitle>
              <CardDescription>
                Track your Team Attendance & Breaks
              </CardDescription>
            </CardHeader>
            <CardFooter>
              {isLeaveAcess ? (
                isPlanEligible ? (
                  <Link href="/attendance/my-attendance">
                    <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                      Go To Attendance
                    </Button>
                  </Link>
                ) : leavesTrialExpires ? (
                  <div className="w-full space-y-2">
                    <p className="text-xs mb-2 text-red-600">
                      Free Trial Expires {leavesRemainingTime}
                    </p>
                    <Link href="/attendance/my-attendance">
                      <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                        Go To Attendance
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    onClick={() => startTrial("attendance")}
                    className="bg-[#815BF5] py-1 hover:bg-[#815BF5] text-xs"
                  >
                    {isFreeTrialLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader /> Starting trial
                      </div>
                    ) : (
                      "Start Trial"
                    )}
                  </Button>
                )
              ) : role !== "orgAdmin" && !leavesTrialExpires || !isLeaveAcess ? (
                <Button className="bg-[#815BF5] flex dark:text-white gap-1 py-1 text-xs opacity-80">
                  <Lock className="h-4" />
                  <span>Locked</span>
                </Button>
              ) : (
                <Link href="/attendance/my-leaves">
                  <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                    Go To Leaves
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>

          {/* Zapllo WABA */}
          <Card className="border dark:border-[#E0E0E066] shadow-sm h-full">
            <CardHeader>
              <div className="rounded-full flex items-center justify-center h-12 w-12 border dark:border-[#E0E0E066] mb-2">
                <img src="/icons/Group.png" className="h-6 " alt="WABA" />
              </div>
              <CardTitle className="text-lg font-medium">Zapllo WABA</CardTitle>
              <CardDescription>
                Get the Official Whatsapp API
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="https://app.zapllo.com/signup" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                  Go To WhatsApp API
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Zapllo CRM */}
          <Card className="border dark:border-[#E0E0E066] shadow-sm h-full">
            <CardHeader>
              <div className="rounded-full flex items-center justify-center h-12 w-12 border dark:border-[#E0E0E066] mb-2">
                <img src="/icons/crm.png" className="h-6 " alt="CRM" />
              </div>
              <CardTitle className="text-lg font-medium">Zapllo CRM</CardTitle>
              <CardDescription>
                Track, Convert & Assign Leads to your Sales Team
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="https://crm.zapllo.com/login" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                  Go To CRM
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Zapllo Events */}
          <Card className="border dark:border-[#E0E0E066] shadow-sm h-full">
            <CardHeader>
              <div className="rounded-full flex items-center justify-center h-12 w-12 border dark:border-[#E0E0E066] mb-2">
                <img src="/icons/events.png" className="h-6 " alt="Events" />
              </div>
              <CardTitle className="text-lg font-medium">Zapllo Events</CardTitle>
              <CardDescription>
                Live Q&A Classes and Weekly Business Growth Sessions
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/help/events">
                <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                  Go To Events
                </Button>
                </Link>
            </CardFooter>
          </Card>

          {/* Zapllo Workflows */}
          <Card className="border dark:border-[#E0E0E066] shadow-sm h-full">
            <CardHeader>
              <div className="rounded-full flex items-center justify-center h-12 w-12 border dark:border-[#E0E0E066] mb-2">
                <img src="/branding/teamsicon.png" className="h-6 " alt="Workflows" />
              </div>
              <CardTitle className="text-lg font-medium">Zapllo Workflows</CardTitle>
              <CardDescription>
                Automate, Integrate & Connect anything effortlessly
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="bg-[#815BF5] py-1 hover:bg-[#815BF5] opacity-50 text-xs">
                Coming Soon
              </Button>
            </CardFooter>
          </Card>

          {/* Zapllo AI Assistant */}
          <Card className="border dark:border-[#E0E0E066] shadow-sm h-full">
            <CardHeader>
              <div className="rounded-full flex items-center justify-center h-12 w-12 border dark:border-[#E0E0E066] mb-2">
                <img src="/branding/AII.png" className="h-6 " alt="AI" />
              </div>
              <CardTitle className="text-lg font-medium">Zapllo AI Agents & Assistants</CardTitle>
              <CardDescription>
                Upgrade your experience by 10X with our proprietory AI Technology
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] opacity-50 text-xs">
                Coming Soon
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Help & Resources Section - Second */}
        <h2 className="text-xl font-bold mb-6 mt-10">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Checklist Card */}
          {calculateProgress() < 100 && (
            <Card className="border dark:border-[#E0E0E066] shadow-sm h-fit">
              <CardHeader>
                <div className="rounded-full flex items-center justify-center h-12 w-12 border dark:border-[#E0E0E066] mb-2">
                  <CheckCircleIcon className="h-6 w-6 text-[#815BF5]" />
                </div>
                <CardTitle className="text-lg font-medium">Checklist</CardTitle>
                <CardDescription>
                  Complete your onboarding steps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full">
                  <Progress value={calculateProgress()} className="h-2" />
                  <p className="text-xs text-muted-foreground -mt-2">
                    Progress: {calculateProgress()}%
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/help/checklist">
                  <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                    Go To Checklist
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}

          {/* Tutorials Card */}
          <Card className="border dark:border-[#E0E0E066] shadow-sm h-[280px]">
            <CardHeader>
              <div className="rounded-full flex items-center justify-center h-12 w-12 border dark:border-[#E0E0E066] mb-2">
                <PlayCircle className="h-6 w-6 text-[#815BF5]" />
              </div>
              <CardTitle className="text-lg font-medium">Tutorials</CardTitle>
              <CardDescription>
                Learn how to get the best out of our business workspace
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Link href="/help/tutorials">
                <Button className="bg-white border hover:bg-gray-300 text-black text-xs">
                  Go To Tutorials
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Events Card - Always visible now */}
          {/* <Card className="border dark:border-[#E0E0E066] shadow-sm h-[280px]">
            <CardHeader>
              <div className="rounded-full flex items-center justify-center h-12 w-12 border dark:border-[#E0E0E066] mb-2">
                <Megaphone className="h-6 w-6 text-[#815BF5]" />
              </div>
              <CardTitle className="text-lg font-medium">Events</CardTitle>
              <CardDescription>
                Live Q&A Classes and Weekly Business Growth Sessions


              </CardDescription>
            </CardHeader>


            <CardFooter>
              <Link href="/help/events">
                <Button className="bg-white  text-black hover:bg-gray-300 text-xs">
                  Go To Events
                </Button>
              </Link>
            </CardFooter>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
