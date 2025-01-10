"use client";

import { ShiningButton } from "@/components/globals/shiningbutton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { CalendarMinus, Globe, Home, Lock, Megaphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


// Define types for ChecklistItem and Progress
interface ChecklistItem {
  _id: string;
  text: string;
  tutorialLink?: string;
}


const DashboardPage = () => {
  const [progress, setProgress] = useState<String[]>([]);
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
  const [isFreeTrialLoading, setFreeTrialLoading] = useState(true);
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
    setIsLoading(false); // Data fetched, stop showing the global loader
  };
console.log(progress, 'progress')

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
      await fetchTrialStatus(); // Refresh the trial status after starting the trial
    } catch (error) {
      console.error("Error starting trial:", error);
    } finally {
      setFreeTrialLoading(false);
    }
  };

  console.log('progresss calculated', calculateProgress())

  return (

    <div className=' dark:bg-[#04061e] mb-16 overflow-y-scroll
     pt-2 scale-95 h-screen gap- relative overflow-x-hidden scrollbar-hide'>

      {/* <h1 className='text-xl gap-2 sticky top-0 z-[10] -mt-12   dark:bg-[#04071F] backdrop-blur-lg flex items-center border-b'>   <Home className='h-5' />  Dashboard
      </h1> */}
      <div className="w-full mb-2 mt-12 flex">
        {calculateProgress() < 100 && (
          <div className=' w-[50.33%] flex justify-start gap-4'>
            <div className='p-4  w-full mx-4 rounded-xl  border border-[#E0E0E066]'>
              <div className='w-full'>
                <h1>Checklist </h1>
                <Progress value={calculateProgress()} className="" />
              </div>
              <div className='flex justify-start mt-3'>
                <Link href='/dashboard/checklist' >
                  <Button className='bg-[#815BF5] mt-12 hover:bg-[#5f31e9]'>
                    Checklist
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className=' w-full h-48 flex justify-start gap-4'>
          <div className='p-4  w-full mx-4 rounded-xl  border border-[#E0E0E066]'>
            <div className='w-full p'>
              <h1 className='px-4 text-lg font-medium'>Tutorials </h1>
              <h1 className='px-4 py-4 text-sm text-muted-foreground'>Learn how to to get best out of our business workspace </h1>
              <Link href='/help/tutorials'>
                <Button className='bg-white hover:bg-gray-300 text-black ml-4   mt-6' >Go To Tutorials</Button></Link>
              <img src='/animations/tutorials.png' className='absolute h-48 ml-[45%] -mt-[150px]' />
            </div>
          </div>
        </div>
        {calculateProgress() == 100 && (
          <div className=' w-[50.33%] flex justify-start h-48 gap-4'>
            <div className='p-4  w-full mx-4 rounded-xl  border border-[#E0E0E066]'>
              <div className='w-full m'>
                <h1 className='text-lg font-medium flex gap-2'><Megaphone /> Events </h1>
                <p className='text-sm py-2 text-muted-foreground'>We are bringing Live Classes to help you grow your business. Check out all our events to get the best out of our business workspace. </p>
                <div className="flex justify-start ">
                  <Link href="/help/events">
                    <Button className="bg-white text-black mt-4 text-sm hover:bg-gray-300 ">
                      Go To Events
                    </Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
      <div className='grid grid-cols-3  '>
        <div className='flex items-center  gap-4 '>
          <div className='p-4 w-full border border-[#E0E0E066] bg-[#]   m-4  text-white items-center flex justify-start rounded-xl '>
            <div className=' font-bold text-xl space-y-1'>
              <div className='rounded-full flex items-center justify-items-center h-12 border-[#E0E0E066] border w-12'>
                <img src='/icons/atask.png' className=' h-6  ml-[10px]   object-cover' />
              </div>
              <h1 className='text-lg font-medium'>Zapllo Tasks</h1>
              <p className='text-xs font-medium'>Delegate one time and recurring task to your team</p>
              <div className="pt-2">
                {(isTaskAccess || isTaskPlanEligible) ? (
                  <Link href="/dashboard/tasks">
                    <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                      Go To Task Management
                    </Button>
                  </Link>
                ) : (
                  <Button className="bg-[#815BF5] flex text-white gap-1 py-1 text-xs opacity-80">
                    <Lock className="h-4" />
                    <h1>Locked</h1>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='flex items-center w-full  gap-4 '>
          <div className='p-4 w-full border border-[#E0E0E066] bg-[#]  m-4  text-white items-center flex justify-start rounded-xl '>
            <div className=' font-bold text-xl space-y-1'>
              <div className='rounded-full h-12 flex items-center border-[#E0E0E066] border w-12'>
                <img src='/icons/Zapllo Intranet.png' className=' h-6  ml-[10px]   object-cover' />
              </div>
              <h1 className='text-lg font-medium'>Zapllo Intranet</h1>
              <p className='text-xs font-medium'>Manage all your Important Company Links</p>
              <div className='pt-2'>
                <Link href='/intranet'>
                  <Button className='bg-[#815BF5] py-1 hover:bg-[#5f31e9]  text-xs' >Go To Intranet</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  gap-4 ">
          <div className="p-4 w-full border border-[#E0E0E066] bg-[#] m-4  text-white items-center relative flex justify-start rounded-xl ">
            <div className=" font-bold text-xl space-y-1">
              <div className="rounded-full flex items-center h-12 border-[#E0E0E066] border w-12">
                <img src='/icons/Zapllo Leaves.png' className=' h-6  ml-[10px]   object-cover' />
              </div>
              <h1 className="text-lg font-medium">Zapllo Leaves</h1>
              <p className="text-xs font-medium">
                Manage your Employee Leaves & Holidays
              </p>
              <div className="">
                {isLeaveAcess ? (
                  isPlanEligible ? (
                    <Link href="/attendance/my-leaves">
                      <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                        Go To Leaves
                      </Button>
                    </Link>
                  ) : leavesTrialExpires ? (
                    <>
                      <p className="text-xs text-red-600 py-2">
                        Free Trial Expires {leavesRemainingTime}
                      </p>
                      <Link href="/attendance/my-leaves">
                        <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                          Go To Leaves
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Button
                      onClick={() => startTrial("leaves")}
                      className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs"
                    >
                      {isFreeTrialLoading ? (
                        <span>Start trial</span>
                      ) : (
                        <>
                          <Loader /> <span>Starting trial </span>
                        </>
                      )}
                    </Button>
                  )
                ) : role !== "orgAdmin" && !leavesTrialExpires || !isLeaveAcess ? (
                  <Button className="bg-[#815BF5] flex text-white gap-1 py-1 text-xs opacity-80" >
                    <Lock className='h-4' />
                    <h1>
                      Locked
                    </h1>
                  </Button>
                ) : (
                  <Link href="/attendance/my-leaves">
                    <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                      Go To Attendance
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            {/* <div className="absolute top-2 right-2">
              <img src="/branding/payroll.png" className="h-6 mt-2" />
            </div> */}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-3 mb-12 '>
        <div className='flex  gap-4 '>
          <div className='p-4 w-full border border-[#E0E0E066] bg-[#]  m-4  text-white items-center flex justify-start rounded-xl '>
            <div className=' font-bold text-xl space-y-1'>
              <div className='rounded-full flex items-center h-12 border-[#E0E0E066] border w-12'>
                <img src='/icons/Zapllo attendance.png' className=' h-6  ml-[10px]   object-cover' />

              </div>
              <h1 className="text-lg font-medium">Zapllo Attendance</h1>
              <p className="text-xs font-medium">
                Track your Team Attendance & Breaks
              </p>
              <div className="">
                {isLeaveAcess ? (
                  isPlanEligible ? (
                    <Link href="/attendance/my-attendance">
                      <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                        Go To Attendance
                      </Button>
                    </Link>
                  ) : leavesTrialExpires ? (
                    <>
                      <p className="text-xs text-red-600 py-2">
                        Free Trial Expires {leavesRemainingTime}
                      </p>
                      <Link href="/attendance/my-attendance">
                        <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                          Go To Attendance
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Button
                      onClick={() => startTrial("attendance")}
                      className="bg-[#815BF5] py-1 hover:bg-[#815BF5] text-xs"
                    >
                      {isFreeTrialLoading ? (
                        <span>Start trial</span>
                      ) : (
                        <>
                          <Loader /> <span>Starting trial </span>
                        </>
                      )}
                    </Button>
                  )
                ) : role !== "orgAdmin" && !leavesTrialExpires || !isLeaveAcess ? (
                  <Button className="bg-[#815BF5] flex text-white gap-1 py-1 text-xs opacity-80" >
                    <Lock className='h-4' />
                    <h1>
                      Locked
                    </h1>
                  </Button>
                ) : (
                  <Link href="/attendance/my-leaves">
                    <Button className="bg-[#815BF5] py-1 hover:bg-[#5f31e9] text-xs">
                      Go To Leaves
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='flex  gap-4 '>
          <div className='p-4 w-full border border-[#E0E0E066] bg-[]  m-4  text-white items-center flex justify-start rounded-xl '>
            <div className=' font-bold text-xl space-y-1'>
              <div className='rounded-full flex items-center h-12 border-[#E0E0E066] border w-12'>
                <img src='/icons/Group.png' className=' h-6  ml-[10px]   object-cover' />

              </div>
              <h1 className='text-lg font-medium'>Zapllo WABA</h1>
              <p className='text-xs font-medium'>Get the Official Whatsapp API</p>
              <div className='pt-2'>
                <Link href='https://waba.zapllo.com/signup'>
                  <Button className='bg-[#815BF5] py-1 hover:bg-[#5f31e9]  text-xs' >Go To WhatsApp API</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='flex  gap-4 '>
          <div className='p-4 w-full border border-[#E0E0E066] bg-[]  m-4  text-white items-center flex justify-start rounded-xl '>
            <div className=' font-bold text-xl space-y-1'>
              <div className='rounded-full flex items-center h-12 border-[#E0E0E066] border w-12'>
                <img src='/icons/crm.png' className=' h-6  ml-[10px]   object-cover' />

              </div>
              <h1 className='text-lg font-medium'>Zapllo CRM</h1>
              <p className='text-xs font-medium'>Track, Convert & Assign Leads to your Sales Team</p>
              <div className='pt-2'>

                <Button className='bg-[#815BF5] py-1 hover:bg-[#5f31e9] opacity-50 text-xs' >Coming Soon</Button>
              </div>
            </div>
          </div>
        </div>
        <div className='flex  gap-4 '>
          <div className='p-4 w-full border border-[#E0E0E066] bg-[]  m-4  text-white items-center flex justify-start rounded-xl '>
            <div className=' font-bold text-xl space-y-1'>
              <div className='rounded-full flex items-center h-12 border-[#E0E0E066] border w-12'>
                <img src='/icons/events.png' className=' h-6  ml-[12px]   object-cover' />

              </div>
              <h1 className='text-lg font-medium'>Zapllo Events</h1>
              <p className='text-xs font-medium'>Live Q&A Classes and Weekly Business Growth Sessions</p>
              <div className='pt-2'>

                <Button className='bg-[#815BF5] py-1 hover:bg-[#5f31e9] opacity-50 text-xs' >Coming Soon</Button>
              </div>
            </div>
          </div>
        </div>
        <div className='flex  gap-4 '>
          <div className='p-4 w-full border border-[#E0E0E066] bg-[]  m-4  text-white items-center flex justify-start rounded-xl '>
            <div className=' font-bold text-xl space-y-1'>
              <div className='rounded-full flex items-center h-12 border-[#E0E0E066] border w-12'>
                <img src='/branding/teamsicon.png' className=' h-6  ml-[10px]   object-cover' />

              </div>
              <h1 className='text-lg font-medium'>Zapllo Workflows</h1>
              <p className='text-xs font-medium'>Automate, Integrate & Connect anything effortlessly</p>
              <div className='pt-2'>

                <Button className='bg-[#815BF5] py-1 hover:bg-[#815BF5] opacity-50 text-xs' >Coming Soon</Button>
              </div>
            </div>
          </div>
        </div>
        <div className='flex  gap-4 '>
          <div className='p-4 w-full border border-[#E0E0E066] bg-[]  m-4  text-white items-center flex justify-start rounded-xl '>
            <div className=' font-bold text-xl space-y-1'>
              <div className='rounded-full flex items-center h-12 border-[#E0E0E066] border w-12'>
                <img src='/branding/AII.png' className=' h-6  ml-[10px]   object-cover' />

              </div>
              <h1 className='text-lg font-medium'>Zapllo AI Assistant</h1>
              <p className='text-xs font-medium'>Upgrade your experience by 10X with our proprietory AI Technology</p>
              <div className='pt-2'>

                <Button className='bg-[#815BF5] py-1 hover:bg-[#5f31e9] opacity-50 text-xs' >Coming Soon</Button>
              </div>
            </div>
          </div>
        </div>
      </div >

    </div >
  );
};

export default DashboardPage;
