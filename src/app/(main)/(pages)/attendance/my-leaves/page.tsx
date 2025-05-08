"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MyLeaveForm from "@/components/forms/MyLeavesForm";
import LeaveDetails from "@/components/sheets/leaveDetails";
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Info, Plus, CalendarDays } from "lucide-react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import Loader from "@/components/ui/loader";
import CustomDatePicker from "@/components/globals/date-picker";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useTheme } from "next-themes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs3, TabsList3, TabsTrigger3 } from "@/components/ui/tabs3";
import { Skeleton } from "@/components/ui/skeleton";

interface LeaveType {
  allotedLeaves: number;
  _id: string;
  leaveType: string;
  userLeaveBalance: number;
}

interface LeaveDay {
  date: string;
  unit:
  | "Full Day"
  | "1st Half"
  | "2nd Half"
  | "1st Quarter"
  | "2nd Quarter"
  | "3rd Quarter"
  | "4th Quarter";
  status: "Pending" | "Approved" | "Rejected";
}

interface Leave {
  _id: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  status: string;
  appliedDays: number;
  leaveDays: LeaveDay[];
  user: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  remarks: string;
  approvedBy: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  rejectedBy: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  leaveReason: string;
  createdAt: string;
  updatedAt: string;
}

interface LeaveDetails {
  totalAllotedLeaves: number;
  userLeaveBalance: number;
}

const leaveTypeInfo: Record<
  string,
  { title: string; description: string; details: string }
> = {
  "Casual Leave": {
    title: "Casual Leave",
    description:
      "Casual Leave is intended for short-term personal needs such as attending to personal matters, family emergencies, or other unforeseen events.",
    details:
      "Allotted: 12 days | Type: Paid\nBackdated Leave Days: 60 | Advance Leave Days: 90\nInclude Holidays: false | Include Weekends: false\nUnit: Full Day, Half Day, Short Leave\nDeduction(in Days): Full day - 1, Half Day - 0.5, Short Leave - 0.25",
  },
  "Sick Leave": {
    title: "Sick Leave",
    description:
      "Sick Leave can be availed by employees when they are ill or need medical attention. This type of leave is intended for health-related absences.",
    details:
      "Allotted: 12 days | Type: Paid\nBackdated Leave Days: 60 | Advance Leave Days: 90\nInclude Holidays: false | Include Weekends: false\nUnit: Full Day, Half Day, Short Leave\nDeduction(in Days): Full day - 1, Half Day - 0.5, Short Leave - 0.25",
  },
  "Earned Leave": {
    title: "Earned Leave",
    description:
      "Earned Leave, also known as Annual Leave or Privilege Leave, is accrued based on the length of service and can be used for planned vacations or personal time off.",
    details:
      "Allotted: 15 days | Type: Paid\nBackdated Leave Days: 60 | Advance Leave Days: 90\nInclude Holidays: false | Include Weekends: false\nUnit: Full Day, Half Day, Short Leave\nDeduction(in Days): Full day - 1, Half Day - 0.5, Short Leave - 0.25",
  },
  "Leave Without Pay": {
    title: "Leave Without Pay",
    description:
      "Leave Without Pay is granted when an employee has exhausted all other leave types and still needs time off. This leave is unpaid.",
    details:
      "Allotted: 6 days | Type: Unpaid\nBackdated Leave Days: 60 | Advance Leave Days: 90\nInclude Holidays: false | Include Weekends: false\nUnit: Full Day, Half Day, Short Leave\nDeduction(in Days): Full day - 1, Half Day - 0.5, Short Leave - 0.25",
  },
};

const months = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];

const statusColors = {
  "Approved": "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 hover:bg-green-200",
  "Partially Approved": "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100 hover:bg-amber-200",
  "Rejected": "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 hover:bg-red-200",
  "Pending": "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 hover:bg-blue-200",
};

const MyLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState<{
    [key: string]: LeaveDetails;
  }>({});
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState<{
    title: string;
    description: string;
    details: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("thisMonth");
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#ffffff" : "#000000";

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const normalizeDate = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const isWithinDateRange = (date: Date, startDate: Date, endDate: Date) =>
    date >= startDate && date <= endDate;

  // Filter leaves by both date range (active tab) and others
  const filterEntriesByDateAndMeta = () => {
    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    const todayNormalized = normalizeDate(today);

    let dateFilteredLeaves = leaves;

    switch (activeTab) {
      case "today":
        dateFilteredLeaves = leaves.filter(
          (leave) =>
            normalizeDate(new Date(leave.createdAt)).getTime() ===
            todayNormalized.getTime()
        );
        break;
      case "thisWeek":
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        dateFilteredLeaves = leaves.filter((leave) => {
          const leaveDate = normalizeDate(new Date(leave.createdAt));
          return (
            leaveDate >= normalizeDate(thisWeekStart) &&
            leaveDate <= todayNormalized
          );
        });
        break;
      case "thisMonth":
        dateFilteredLeaves = leaves.filter((leave) => {
          const leaveDate = normalizeDate(new Date(leave.createdAt));
          return leaveDate >= thisMonthStart && leaveDate <= thisMonthEnd;
        });
        break;
      case "lastMonth":
        dateFilteredLeaves = leaves.filter((leave) => {
          const leaveDate = normalizeDate(new Date(leave.createdAt));
          return leaveDate >= lastMonthStart && leaveDate <= lastMonthEnd;
        });
        break;
      case "custom":
        if (customDateRange.start && customDateRange.end) {
          const startNormalized = normalizeDate(customDateRange.start);
          const endNormalized = normalizeDate(customDateRange.end);
          dateFilteredLeaves = leaves.filter((leave) => {
            const leaveDate = normalizeDate(new Date(leave.createdAt));
            return leaveDate >= startNormalized && leaveDate <= endNormalized;
          });
        }
        break;
      default:
        break;
    }

    // Further filter by leave type, year, and month
    return dateFilteredLeaves
      .filter((leave) =>
        selectedLeaveType
          ? leave.leaveType.leaveType === selectedLeaveType
          : true
      )
      .filter((leave) => {
        const leaveDate = new Date(leave.fromDate);
        return (
          leaveDate.getFullYear() === selectedYear &&
          leaveDate.getMonth() === selectedMonth
        );
      });
  };

  //This function takes input from dateFiltered leaves and filters on the basis of status
  const filterEntriesByStatus = (dateFilteredLeaves: Leave[]): Leave[] => {
    return dateFilteredLeaves.filter((leave) =>
      selectedStatus === "All" ? true : leave.status === selectedStatus
    );
  };

  const handleLeaveClick = (leave: Leave) => {
    setSelectedLeave(leave);
  };

  const handleSheetClose = () => {
    setSelectedLeave(null);
  };

  // Handle Custom Date Range Modal
  const openCustomModal = () => {
    setIsCustomModalOpen(true);
  };

  const handleCustomDateSubmit = (start: Date, end: Date) => {
    setCustomDateRange({ start, end });
    setIsCustomModalOpen(false);
    setActiveTab("custom");
  };

  const handleClose = () => {
    // Reset date range when closing
    setCustomDateRange({ start: null, end: null });
    setIsCustomModalOpen(false);
  };

  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get("/api/leaves/leaveType");
      setLeaveTypes(response.data);
    } catch (error) {
      console.error("Error fetching leave types:", error);
    }
  };

  const fetchLeaveDetails = async (leaveTypes: LeaveType[]) => {
    try {
      setLoading(true);
      const leaveDetailsMap: { [key: string]: LeaveDetails } = {};

      for (const leaveType of leaveTypes) {
        const response = await axios.get(`/api/leaves/${leaveType._id}`);
        if (response.data.success) {
          leaveDetailsMap[leaveType._id] = {
            totalAllotedLeaves: response.data.data.allotedLeaves,
            userLeaveBalance: response.data.data.userLeaveBalance,
          };
          setLoading(false);
        } else {
          leaveDetailsMap[leaveType._id] = {
            totalAllotedLeaves: 0,
            userLeaveBalance: 0,
          };
        }
      }

      setLeaveDetails(leaveDetailsMap);
    } catch (error) {
      console.error("Error fetching leave details:", error);
    }
  };

  const fetchUserLeaves = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/leaves");
      if (response.data.success) {
        setLeaves(response.data.leaves);
        setLoading(false);
      } else {
        console.error("Error: No leaves found");
      }
    } catch (error) {
      console.error("Error fetching user leaves:", error);
    }
  };

  useEffect(() => {
    fetchUserLeaves();
    fetchLeaveTypes();
  }, []);

  useEffect(() => {
    if (leaveTypes.length > 0) {
      fetchLeaveDetails(leaveTypes);
    }
  }, [leaveTypes]);

  const handleInfoClick = (leaveType: string) => {
    if (leaveTypeInfo[leaveType]) {
      setInfoModalContent(leaveTypeInfo[leaveType]);
      setIsInfoModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchUserLeaves();
    setIsInfoModalOpen(false);
    setInfoModalContent(null);
  };

  const filteredLeaves = filterEntriesByDateAndMeta(); // Filters by date, leave type, year, and month
  const finalFilteredLeaves = filterEntriesByStatus(filteredLeaves); // Filters by status

  // Calculate counts based on status
  const allLeavesCount = filteredLeaves.length;
  const pendingCount = filteredLeaves.filter(
    (leave) => leave.status === "Pending"
  ).length;
  const approvedCount = filteredLeaves.filter(
    (leave) => leave.status === "Approved"
  ).length;
  const rejectedCount = filteredLeaves.filter(
    (leave) => leave.status === "Rejected"
  ).length;


// Replace the loader return statement
if (loading) {
  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-1 items-center space-x-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Tabs skeleton */}
      <div className="w-full">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Status filters skeleton */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      {/* Leave balance cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 s gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex flex-col items-center space-y-3 pt-0">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-1 w-full">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-2/3 mx-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leave applications skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              <div className="my-3">
                <Skeleton className="h-px w-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ... rest of the existing code ...
  const LeaveCard = ({ leaveType }: { leaveType: LeaveType }) => {
    // Calculate consumed leaves and percentage
    const consumedLeaves = leaveType.allotedLeaves - leaveDetails[leaveType._id]?.userLeaveBalance;
    const percentage = consumedLeaves ? (consumedLeaves / leaveType.allotedLeaves) * 100 : 0;

    return (
      <Card key={leaveType._id} className="w-60 relative flex-shrink-0">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">{leaveType.leaveType}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleInfoClick(leaveType.leaveType)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View {leaveType.leaveType} details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-3 pt-0">
          <div className="w-20 h-20">
            <CircularProgressbar
              value={percentage}
              text={`${consumedLeaves}`}
              styles={buildStyles({
                pathColor: '#815BF5',
                textColor: textColor,
                trailColor: theme === 'dark' ? '#2a2a2a' : '#e9e9e9',
                textSize: '26px',
              })}
            />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">Consumed leaves</p>
            {leaveDetails[leaveType._id] ? (
              <p className="text-sm font-medium">
                Balance: {leaveDetails[leaveType._id]?.userLeaveBalance ?? "N/A"} days
              </p>
            ) : (
              <p className="text-xs">Loading...</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-1 items-center space-x-4">
          <CalendarDays className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Leave History</h1>
            <p className="text-sm text-muted-foreground">Manage and track your leave applications</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Apply Leave
              </Button>
            </DialogTrigger>

            <DialogContent className="z-[100] h-fit max-h-screen overflow-y-scroll max-w-lg">

              <MyLeaveForm leaveTypes={leaveTypes} onClose={handleModalClose} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Date Range Tabs */}
      <Tabs3 defaultValue={activeTab} value={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList3 className="w-full  mx-auto gap-3 grid grid-cols-5">
          <TabsTrigger3 value="today">Today</TabsTrigger3>
          <TabsTrigger3 value="thisWeek">This Week</TabsTrigger3>
          <TabsTrigger3 value="thisMonth">This Month</TabsTrigger3>
          <TabsTrigger3 value="lastMonth">Last Month</TabsTrigger3>
          <TabsTrigger3 value="custom" onClick={openCustomModal}>Custom</TabsTrigger3>
        </TabsList3>
      </Tabs3>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge
          variant="outline"
          className={`cursor-pointer py-1 px-3 ${selectedStatus === 'All' ? 'bg-primary text-primary-foreground' : ''}`}
          onClick={() => setSelectedStatus('All')}
        >
          All ({allLeavesCount})
        </Badge>
        <Badge
          variant="outline"
          className={`cursor-pointer py-1 px-3 ${selectedStatus === 'Pending' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => setSelectedStatus('Pending')}
        >
          Pending ({pendingCount})
        </Badge>
        <Badge
          variant="outline"
          className={`cursor-pointer py-1 px-3 ${selectedStatus === 'Approved' ? 'bg-green-600 text-white' : ''}`}
          onClick={() => setSelectedStatus('Approved')}
        >
          Approved ({approvedCount})
        </Badge>
        <Badge
          variant="outline"
          className={`cursor-pointer py-1 px-3 ${selectedStatus === 'Rejected' ? 'bg-red-500 text-white' : ''}`}
          onClick={() => setSelectedStatus('Rejected')}
        >
          Rejected ({rejectedCount})
        </Badge>
      </div>

      {/* Leave Balance Cards */}
      {leaveTypes.length > 0 && (
        <div className="relative ">
          <ScrollArea className=" whitespace-nowrap">
            <div className="grid grid-cols-3 gap-4">
              {leaveTypes.map((leaveType) => (
                <LeaveCard key={leaveType._id} leaveType={leaveType} />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Leave List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Leave Applications</h2>
        {finalFilteredLeaves.length > 0 ? (
          <div className="space-y-3">
            {finalFilteredLeaves.map((leave) => (
              <Card
                key={leave._id}
                className="hover:border-primary transition-all duration-200 cursor-pointer"
                onClick={() => handleLeaveClick(leave)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-primary">
                        <AvatarFallback>{leave.user.firstName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="font-medium leading-none">{leave.user.firstName} {leave.user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{leave.leaveType.leaveType}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[leave.status as keyof typeof statusColors] || ""}>
                        {leave.status}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">From:</span>
                      <span>{new Date(leave.fromDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">To:</span>
                      <span>{new Date(leave.toDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Applied:</span>
                      <span className="text-nowrap">{leave.appliedDays} day(s)</span>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-muted-foreground">Approved:</span>
                      <span className="text-nowrap">
                        {leave.leaveDays.filter((day) => day.status === "Approved").length} day(s)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-8">
            <CardContent className="flex flex-col items-center justify-center">
              <DotLottieReact
                src="/lottie/empty.lottie"
                loop
                className="h-56"
                autoplay
              />
              <h3 className="mt-4 text-lg font-semibold">No Leaves Found</h3>
              <p className="text-muted-foreground text-sm text-center max-w-md mt-1">
                The list is currently empty for the selected filters. Try changing your filter criteria or apply for a new leave.
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => setIsModalOpen(true)}
              >
                Apply for Leave
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Leave Type Information Modal */}
      {infoModalContent && (
        <Dialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
          <DialogContent className="sm:max-w-md p-6">
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              {infoModalContent.title}
            </DialogTitle>
            <DialogDescription>
              {infoModalContent.description}
            </DialogDescription>
            <div className="mt-4 space-y-2">
              {infoModalContent.details.split("\n").map((line, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
            <DialogClose asChild>
              <Button className="w-full">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}

      {/* Custom Date Range Modal */}
      <Dialog open={isCustomModalOpen} onOpenChange={setIsCustomModalOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Custom Date Range
          </DialogTitle>
          <DialogDescription>
            Select a start and end date to filter your leave applications
          </DialogDescription>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customDateRange.start && customDateRange.end) {
                handleCustomDateSubmit(
                  customDateRange.start,
                  customDateRange.end
                );
              }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setIsStartPickerOpen(true)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {customDateRange.start
                    ? new Date(customDateRange.start).toLocaleDateString()
                    : "Select date"}
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setIsEndPickerOpen(true)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {customDateRange.end
                    ? new Date(customDateRange.end).toLocaleDateString()
                    : "Select date"}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!customDateRange.start || !customDateRange.end}
              >
                Apply Filter
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Start Date Picker Modal */}
      <Dialog open={isStartPickerOpen} onOpenChange={setIsStartPickerOpen}>
        <DialogContent className="p-0 scale-90 bg-transparent border-none shadow-none max-w-full">

          <CustomDatePicker
            selectedDate={customDateRange.start}
            onDateChange={(newDate) => {
              setCustomDateRange((prev) => ({ ...prev, start: newDate }));
              setIsStartPickerOpen(false);
            }}
            onCloseDialog={() => setIsStartPickerOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* End Date Picker Modal */}
      <Dialog open={isEndPickerOpen} onOpenChange={setIsEndPickerOpen}>
        <DialogContent className="p-0 scale-90 bg-transparent border-none shadow-none max-w-full">
          <CustomDatePicker
            selectedDate={customDateRange.end}
            onDateChange={(newDate) => {
              setCustomDateRange((prev) => ({ ...prev, end: newDate }));
              setIsEndPickerOpen(false);
            }}
            onCloseDialog={() => setIsEndPickerOpen(false)}
          />

        </DialogContent>
      </Dialog>

      {/* Leave Details Sheet */}
      {selectedLeave && (
        <LeaveDetails
          selectedLeave={selectedLeave}
          onClose={handleSheetClose}
        />
      )}
    </div>
  );
};

export default MyLeaves;
