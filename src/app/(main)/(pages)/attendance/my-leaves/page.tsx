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
  DialogOverlay,
} from "@/components/ui/dialog";
import MyLeaveForm from "@/components/forms/MyLeavesForm"; // Your form component
import LeaveDetails from "@/components/sheets/leaveDetails";
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Circle, Info, X } from "lucide-react";
import {
  Cross1Icon,
  CrossCircledIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import Loader from "@/components/ui/loader";
import CustomDatePicker from "@/components/globals/date-picker";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LeaveType {
  allotedLeaves: number;
  _id: string;
  leaveType: string;
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
  }; // Add user field to match your MongoDB model
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
  createdAt: string; // Add createdAt field
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
  const [activeTab, setActiveTab] = useState("thisMonth"); // Set default to 'thisMonth'
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false); // For triggering the start date picker
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false); // For triggering the end date picker
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Type the ref as HTMLDivElement

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
        console.log(response.data, "response.data");
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
      // setLoading(true)
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

  if (loading) {
    return (
      <div className="mt-32 flex justify-center items-center">
        <Loader />
      </div>
    );
  }



  return (
    <div className="container h-screen  overflow-y-scroll scrollbar-hide t mx-auto p-6">
      <div className="flex items-center justify-center gap-4 mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className=" border bg-[#04061E] rounded px-3 border-[#] outline-none text-xs py-2"
        >
          {[2022, 2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border bg-[#04061E] rounded px-3 outline-none text-xs py-2"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button
              className="bg-[#017a5b] text-white text-xs px-4 py-2 rounded"
              onClick={() => setIsModalOpen(true)}
            >
              Apply Leave
            </button>
          </DialogTrigger>

          <DialogContent className=" z-[100] hidden">
            <DialogDescription>

            </DialogDescription>
            <MyLeaveForm leaveTypes={leaveTypes} onClose={handleModalClose} />
          </DialogContent>
        </Dialog>
      </div>
      {/* Date Tabs */}
      <div className="tabs mb-6 flex flex-wrap justify-center space-x-2">
        <button
          onClick={() => setActiveTab("today")}
          className={`px-4 h-fit py-2 text-xs rounded ${activeTab === "today" ? "bg-[#815BF5]" : "bg-[#] border"
            }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab("thisWeek")}
          className={`px-4 py-2 h-fit text-xs rounded ${activeTab === "thisWeek" ? "bg-[#815BF5]" : "bg-[#] border"
            }`}
        >
          This Week
        </button>
        <button
          onClick={() => setActiveTab("thisMonth")}
          className={`px-4 py-2 text-xs h-fit rounded ${activeTab === "thisMonth" ? "bg-[#815BF5]" : "bg-[#] border"
            }`}
        >
          This Month
        </button>
        <button
          onClick={() => setActiveTab("lastMonth")}
          className={`px-4 py-2 text-xs h-fit rounded ${activeTab === "lastMonth" ? "bg-[#815BF5]" : "bg-[#] border"
            }`}
        >
          Last Month
        </button>
        <button
          onClick={openCustomModal}
          className={`px-4 py-2 text-xs h-fit rounded ${activeTab === "custom" ? "bg-[#815BF5]" : "bg-[#] border"
            }`}
        >
          Custom
        </button>
      </div>

      {/* Leave Balance and Type Filter */}
      {leaveTypes.length > 0 && (
        <div className="relative items-center space-x-4 mb-4">


          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 z-20 p-2 mt-8 bg-[#fc8929] hover:opacity-100 opacity-70 rounded-full"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-scroll max-w-6xl w-full scrollbar-hide gap-4 px-2"
          >
            {leaveTypes.map((leaveType) => (
              <div
                key={leaveType._id}
                className="w-64 flex-shrink-0 border px-4 py-3"
              >
                <div className="flex justify-between">
                  <h1 className="text-sm">{leaveType.leaveType}</h1>
                  <Info
                    className="h-4 mt-1 text-blue-200 cursor-pointer"
                    onClick={() => handleInfoClick(leaveType.leaveType)}
                  />
                </div>
                <div className="mt-2">
                  <p className="text-xs">Allotted: {leaveType.allotedLeaves}</p>
                  {leaveDetails[leaveType._id] ? (
                    <p className="text-xs">
                      Balance:{" "}
                      {leaveDetails[leaveType._id]?.userLeaveBalance ?? "N/A"}
                    </p>
                  ) : (
                    <p className="text-xs">Loading...</p>
                  )}
                </div>
              </div>
            ))}
            {/* Right Arrow */}
            <button
              onClick={scrollRight}
              className="absolute right-0 z-20 p-2   mt-8 bg-[#fc8929] hover:opacity-100 opacity-70 rounded-full"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>




        </div>
      )}

      {infoModalContent && (
        <Dialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
          <DialogContent className="w-96 p-6 z-[100] bg-[#0b0d29]">
            <div className="flex w-full justify-between">
              <div className="flex gap-2">
                <Info className="h-5 mt-1 " />
                <DialogTitle className="text-center text-lg flex gap-2 font-semibold">
                  {infoModalContent.title}
                </DialogTitle>
              </div>
              <DialogClose>
                <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
              </DialogClose>
            </div>
            <DialogDescription className="mt-2 text-sm">
              {infoModalContent.description}
            </DialogDescription>
            <div className="mt-4 text-xs">
              {infoModalContent.details.split("\n").map((line, index) => (
                <p key={index} className="leading-5 text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
            {/* <button
                            className="mt-6 bg-[#017a5b] text-white px-4 py-2 rounded w-full"
                            onClick={handleModalClose}
                        >
                            Close
                        </button> */}
          </DialogContent>
        </Dialog>
      )}

      {/* Display Filtered Leaves */}
      <div className="grid grid-cols-1 w-full mb-12 ">
        {filteredLeaves?.length > 0 ? (
          finalFilteredLeaves?.map((leave) => (
            <div
              key={leave._id}
              className="flex hover:border-[#815BF5] items-center  cursor-pointer justify-between border p-4 rounded shadow-sm mb-4"
              onClick={() => handleLeaveClick(leave)}
            >
              {/* User Profile Icon */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 rounded-full bg-[#7c3987] flex items-center justify-center text-white text-sm">
                    {leave.user.firstName?.[0]}
                  </div>
                </div>
                <h1 className="text-s">{leave.user.firstName}</h1>

                {/* Leave Details */}
                <div className=" flex gap-4">
                  <h3 className=" text-sm mt-[5px]">
                    {leave?.leaveType?.leaveType}
                  </h3>
                  <p className="text-sm flex gap-1 mt-1 text-gray-400">
                    From:{" "}
                    <span className="text-white">
                      {new Date(leave?.fromDate).toLocaleDateString()}
                    </span>
                    <h1 className="gap-1 ml-4 flex">
                      To:
                      <span className="text-white">
                        {new Date(leave?.toDate).toLocaleDateString()}
                      </span>
                    </h1>
                  </p>
                  <p className="text-sm flex gap-1 mt-1 text-gray-400">
                    Applied For:
                    <span className="text-white">
                      {leave.appliedDays} Day(s)
                    </span>
                    |<span className="ml-1">Approved For:</span>
                    <span className="text-white">
                      {
                        leave.leaveDays.filter(
                          (day) => day.status === "Approved"
                        ).length
                      }{" "}
                      Day(s)
                    </span>
                  </p>
                </div>
              </div>
              {/* Status and Approval */}
              <div className="flex items-center">
                <span
                  className={`px-3  py-1 rounded-full text-[10px] ${leave.status === "Approved"
                    ? "bg-green-700  text-white"
                    : leave.status === "Partially Approved"
                      ? "bg-orange-900 text-white -800"
                      : leave.status === "Rejected"
                        ? "bg-orange-200 text-red-800"
                        : "bg-orange-700 text-white -800"
                    }`}
                >
                  {leave.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex w-full justify-center ">
            <div className="mt-8 ml-4">
              <DotLottieReact
                src="/lottie/empty.lottie"
                loop
                className="h-56"
                autoplay
              />
              <h1 className="text-center font-bold text-md mt-2 ">
                No Leaves Found
              </h1>
              <p className="text-center text-sm ">
                The list is currently empty for the selected filters
              </p>
            </div>
          </div>
        )}
      </div>
      {selectedLeave && (
        <LeaveDetails
          selectedLeave={selectedLeave}
          onClose={handleSheetClose}
        />
      )}

      {/* Custom Date Range Modal */}
      <Dialog open={isCustomModalOpen} onOpenChange={setIsCustomModalOpen}>
        <DialogContent className="w-96 p-6 ml-12 z-[100] bg-[#0B0D29]">
          <div className="flex justify-between">
            <DialogTitle className="text-md  font-medium text-white">
              Select Custom Date Range
            </DialogTitle>
            <DialogClose className="" onClick={handleClose}>
              {" "}
              <CrossCircledIcon className="scale-150  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
              {/* <X className="cursor-pointer border -mt-4 rounded-full border-white h-6 hover:bg-white hover:text-black w-6" /> */}
            </DialogClose>
          </div>

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
            <div className="flex justify-between gap-2">
              {/* Start Date Button */}
              <div className="w-full">
                {/* <h1 className="absolute bg-[#0B0D29] ml-2 text-xs font-medium text-white">
                  Start Date
                </h1> */}
                <button
                  type="button"
                  className="text-start text-xs text-gray-400 mt-2 w-full border p-2 rounded"
                  onClick={() => setIsStartPickerOpen(true)} // Open end date picker
                >
                  {customDateRange.start ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4" />

                      {new Date(customDateRange.start).toLocaleDateString(
                        "en-GB"
                      )}
                    </div> // Format date as dd/mm/yyyy
                  ) : (
                    <div className="flex gap-1">
                      <Calendar className="h-4" />
                      <h1 className="text-xs">Start Date</h1>
                    </div>
                  )}
                </button>
              </div>

              {/* End Date Button */}
              <div className="w-full">
                {/* <h1 className="absolute bg-[#0B0D29] ml-2 text-xs font-medium text-white">
                  End Date
                </h1> */}
                <button
                  type="button"
                  className="text-start text-xs text-gray-400 mt-2 w-full border p-2 rounded"
                  onClick={() => setIsEndPickerOpen(true)} // Open end date picker
                >
                  {customDateRange.end ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4" />

                      {new Date(customDateRange.end).toLocaleDateString(
                        "en-GB"
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <Calendar className="h-4" />
                      <h1 className="text-xs">End date</h1>
                    </div>
                  )}
                </button>
              </div>
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="bg-[#815BF5] text-white py-2 px-4 rounded w-full text-xs"
              >
                Apply
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Start Date Picker Modal */}
      <Dialog open={isStartPickerOpen} onOpenChange={setIsStartPickerOpen}>

        <DialogContent className=" z-[100]  scale-90 flex justify-center ">
          <div className=" z-[20] rounded-lg  scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
            <div className="w-full flex mb-4 justify-between">
              <CustomDatePicker
                selectedDate={customDateRange.start}
                onDateChange={(newDate) => {
                  setCustomDateRange((prev) => ({ ...prev, start: newDate }));
                  setIsStartPickerOpen(false); // Close picker after selecting the date
                }}
                onCloseDialog={() => setIsStartPickerOpen(false)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* End Date Picker Modal */}
      <Dialog open={isEndPickerOpen} onOpenChange={setIsEndPickerOpen}>

        <DialogContent className=" z-[100]  scale-90 flex justify-center ">
          <div className=" z-[20] rounded-lg  scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
            <div className="w-full flex mb-4 justify-between">
              <CustomDatePicker
                selectedDate={customDateRange.end}
                onDateChange={(newDate) => {
                  setCustomDateRange((prev) => ({ ...prev, end: newDate }));
                  setIsEndPickerOpen(false); // Close picker after selecting the date
                }}
                onCloseDialog={() => setIsEndPickerOpen(false)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyLeaves;
