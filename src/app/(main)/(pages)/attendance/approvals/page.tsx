"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  subDays,
} from "date-fns";
import LeaveApprovalModal from "@/components/modals/leaveApprovalModal";
import RejectModal from "@/components/modals/rejectModal";
import RegularizationApprovalModal from "@/components/modals/regularizationApprovalModal";
import RegularizationRejectModal from "@/components/modals/rejectRegularizationModal";
import LeaveDetails from "@/components/sheets/leaveDetails";
import RegularizationDetails from "@/components/sheets/regularizationDetails";
import {
  Calendar,
  CheckCheck,
  CheckCircle,
  Circle,
  Trash2,
  Users2,
  X,
} from "lucide-react";
import DeleteConfirmationDialog from "@/components/modals/deleteConfirmationDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Cross1Icon,
  CrossCircledIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import Loader from "@/components/ui/loader";
import CustomDatePicker from "@/components/globals/date-picker";
import { toast, Toaster } from "sonner";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type LeaveType = {
  _id: string;
  leaveType: string;
};

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  reportingManager: {
    firstName: string;
    lastName: string;
    _id: string;
  };
};

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
  status: "Pending" | "Approved" | "Rejected"; // Explicitly define possible statuses
  leaveReason: string;
  appliedDays: number;
  leaveDays: LeaveDay[];
  remarks: string;
  user: User;
  updatedAt: string;
  createdAt: string; // Add createdAt field
}

interface Regularization {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    reportingManager: {
      firstName: string;
      lastName: string;
    };
  };
  timestamp: string;
  loginTime: string;
  logoutTime: string;
  remarks: string;
  approvalStatus?: "Pending" | "Approved" | "Rejected";
}

// Type Guard to check if an entry is Regularization
function isRegularization(
  entry: Leave | Regularization
): entry is Regularization {
  return (entry as Regularization).loginTime !== undefined;
}

// Type Guard to check if an entry is Leave
function isLeave(entry: Leave | Regularization): entry is Leave {
  return (entry as Leave).leaveType !== undefined;
}

export default function Approvals() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [regularizations, setRegularizations] = useState<Regularization[]>([]);
  const [filter, setFilter] = useState<"Leave" | "Regularization">("Leave"); // New filter state
  const [statusFilter, setStatusFilter] = useState<
    "Pending" | "Approved" | "Rejected" | "All"
  >("All");
  const [dateFilter, setDateFilter] = useState<
    | "Today"
    | "Yesterday"
    | "ThisWeek"
    | "ThisMonth"
    | "LastMonth"
    | "Custom"
    | "AllTime"
  >("ThisMonth");
  const [customDateRange, setCustomDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false); // Custom Date Modal state
  const [selectedEntry, setSelectedEntry] = useState<
    Leave | Regularization | null
  >(null); // For triggering the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false); // For triggering the reject modal
  const [remarks, setRemarks] = useState<string>(""); // For storing the rejection remarks
  const [isLeaveDetailsOpen, setIsLeaveDetailsOpen] = useState(false); // Leave Detail sheet state
  const [isRegularizationDetailsOpen, setIsRegularizationDetailsOpen] =
    useState(false); // Regularization Detail sheet state
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State to control the modal
  const [loading, setLoading] = useState(false); // State to control the modal
  const [leaveIdToDelete, setLeaveIdToDelete] = useState<string | null>(null);
  const [regularizationIdToDelete, setRegularizationIdToDelete] = useState<
    string | null
  >(null); // Store regularization ID
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false); // For triggering the start date picker
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false); // For triggering the end date picker

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/api/users/me"); // Adjust this endpoint to fetch user data
        if (response.data && response.data.data.role) {
          setCurrentUserRole(response.data.data.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchUserLeaves = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/leaves");
        if (response.data.success) {
          setLeaves(response.data.leaves);
        } else {
          console.error("Error fetching user leaves");
        }
      } catch (error) {
        console.error("Error fetching user leaves:", error);
      } finally {
        setLoading(false);
      }
    };


    const fetchOrganizationLeaves = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/leaves/all");
        if (response.data.success) {
          setLeaves(response.data.leaves);
        } else {
          console.error("Error fetching organization leaves");
          // toast.error(response.data.error || "Failed to fetch organization leaves.");
        }
      } catch (error: any) {
        console.error("Error fetching organization leaves:", error);
        // toast.error(error.response?.data?.error || "Failed to fetch organization leaves.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUserRole === "member") {
      fetchUserLeaves();
    } else if (currentUserRole === "orgAdmin") {
      fetchOrganizationLeaves();
    }
  }, [currentUserRole]);

  const openDeleteDialog = (leaveId: string) => {
    setLeaveIdToDelete(leaveId); // Store the leave._id before opening the dialog
    setRegularizationIdToDelete(null); // Ensure regularization ID is null
    setIsDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  const openRegularizationDeleteDialog = (regularizationId: string) => {
    setRegularizationIdToDelete(regularizationId); // Store the regularization._id
    setLeaveIdToDelete(null); // Ensure leave ID is null
    setIsDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  const handleDeleteLeave = async (leaveId: string) => {
    try {
      const response = await axios.delete(`/api/leaveApprovals/${leaveId}`);
      if (response.data.success) {
        // Refetch leaves or update the UI to remove the deleted leave
        const updatedLeaves = await axios.get("/api/leaves/all");
        setLeaves(updatedLeaves.data.leaves);
      } else {
        console.error(response.data.error);
        toast.error(response.data.error || "Failed to delete leave.");
      }
    } catch (error: any) {
      console.error("Error deleting leave:", error);
      toast.error(
        `Error deleting leave: ${error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDeleteRegularization = async (regularizationId: string) => {
    try {
      const response = await axios.delete(
        `/api/regularization-approvals/${regularizationId}`
      );
      if (response.data.success) {
        // Refetch regularizations or update the UI to remove the deleted regularization
        const updatedRegularizations = await axios.get(
          "/api/regularization-approvals"
        );
        setRegularizations(updatedRegularizations.data.regularizations);
      } else {
        console.error(response.data.error);
        toast.error(response.data.error || "Failed to delete regularization.");
      }
    } catch (error: any) {
      console.error("Error deleting regularization:", error);
      toast.error(
        `Error deleting regularization: ${error.response?.data?.message || error.message
        }`
      );
    }
  };

  const confirmDelete = async () => {
    try {
      if (leaveIdToDelete) {
        await handleDeleteLeave(leaveIdToDelete); // Handle leave deletion
      } else if (regularizationIdToDelete) {
        await handleDeleteRegularization(regularizationIdToDelete); // Handle regularization deletion
      }
      setIsDeleteDialogOpen(false); // Close the dialog after deletion
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  useEffect(() => {
    const fetchLoginEntriesAndStatus = async () => {
      try {
        // Fetch login entries
        const resEntries = await fetch("/api/loginEntries");
        const dataEntries = await resEntries.json();
        setRegularizations(dataEntries.entries);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (currentUserRole === "member") {
      fetchLoginEntriesAndStatus();
    }
  }, []);



  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        setLoading(true);
        if (filter === "Leave") {
          const response = await axios.get("/api/leaveApprovals/get");
          if (response.data.success) {
            setLeaves(response.data.leaves);
          } else {
            console.error(response.data.error);
            // toast.error(
            //   response.data.error || "Failed to fetch leave approvals."
            // );
          }
        } else if (filter === "Regularization") {
          const response = await axios.get("/api/regularization-approvals");
          if (response.data.success) {
            setRegularizations(response.data.regularizations);
          } else {
            console.error(response.data.error);
            // toast.error(
            //   response.data.error || "Failed to fetch regularization approvals."
            // );
          }
        }
      } catch (error: any) {
        console.error(
          `Error fetching ${filter} approvals:`,
          error.response?.data || error.message
        );
        // toast.error(
        //   `Failed to fetch ${filter} approvals: ${error.response?.data?.message || error.message
        //   }`
        // );
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, [filter, selectedEntry]);

  // Separate filter functions for Leave and Regularization to maintain type integrity
  const filterLeavesByDate = (leaves: Leave[]): Leave[] => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const todayStart = startOfDay(today);
    const weekStart = startOfWeek(today);
    const thisMonthStart = startOfMonth(today);
    const lastMonthStart = startOfMonth(
      new Date(today.getFullYear(), today.getMonth() - 1, 1)
    );
    const lastMonthEnd = endOfMonth(
      new Date(today.getFullYear(), today.getMonth() - 1, 1)
    );

    return leaves.filter((leave) => {
      const entryDate = new Date(leave.createdAt); // Filter based on createdAt

      switch (dateFilter) {
        case "Today":
          return normalizeDate(entryDate).getTime() === todayStart.getTime();
        case "Yesterday":
          return (
            normalizeDate(entryDate).getTime() ===
            normalizeDate(yesterday).getTime()
          );
        case "ThisWeek":
          return entryDate >= weekStart && entryDate <= today;
        case "ThisMonth":
          return entryDate >= thisMonthStart && entryDate <= today;
        case "LastMonth":
          return entryDate >= lastMonthStart && entryDate <= lastMonthEnd;
        case "Custom":
          if (customDateRange.start && customDateRange.end) {
            return (
              entryDate >= customDateRange.start &&
              entryDate <= customDateRange.end
            );
          }
          return true;
        case "AllTime":
          return true;
        default:
          return true;
      }
    });
  };

  const filterRegularizationsByDate = (
    regularizations: Regularization[]
  ): Regularization[] => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const todayStart = startOfDay(today);
    const weekStart = startOfWeek(today);
    const thisMonthStart = startOfMonth(today);
    const lastMonthStart = startOfMonth(
      new Date(today.getFullYear(), today.getMonth() - 1, 1)
    );
    const lastMonthEnd = endOfMonth(
      new Date(today.getFullYear(), today.getMonth() - 1, 1)
    );

    return regularizations.filter((reg) => {
      const entryDate = new Date(reg.timestamp);

      switch (dateFilter) {
        case "Today":
          return normalizeDate(entryDate).getTime() === todayStart.getTime();
        case "Yesterday":
          return (
            normalizeDate(entryDate).getTime() ===
            normalizeDate(yesterday).getTime()
          );
        case "ThisWeek":
          return entryDate >= weekStart && entryDate <= today;
        case "ThisMonth":
          return entryDate >= thisMonthStart && entryDate <= today;
        case "LastMonth":
          return entryDate >= lastMonthStart && entryDate <= lastMonthEnd;
        case "Custom":
          if (customDateRange.start && customDateRange.end) {
            return (
              entryDate >= customDateRange.start &&
              entryDate <= customDateRange.end
            );
          }
          return true;
        case "AllTime":
          return true;
        default:
          return true;
      }
    });
  };

  // Helper to normalize dates for filtering
  const normalizeDate = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const handleCustomDateSubmit = (start: Date, end: Date) => {
    setCustomDateRange({ start, end });
    setIsCustomModalOpen(false); // Close the modal after date selection
    setDateFilter("Custom");
  };

  const handleClose = () => {
    // Reset date range when closing
    setCustomDateRange({ start: null, end: null });
    setIsCustomModalOpen(false);
  };

  const handleApproval = async (
    entry: Leave | Regularization,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Stop event from triggering parent handlers
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleReject = (entry: Leave | Regularization, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event from triggering parent handlers
    setSelectedEntry(entry);
    setIsRejectModalOpen(true); // Open the reject modal
  };

  // const handleRejectSubmit = async () => {
  //     if (!remarks) {
  //         toast.error('Please enter remarks for rejection.');
  //         return;
  //     }
  //     try {
  //         // setLoading(true);
  //         if (!selectedEntry) return;

  //         if (isLeave(selectedEntry)) {
  //             // Handle rejection for Leave
  //             const response = await axios.post(`/api/leaveApprovals/${selectedEntry._id}`, {
  //                 action: 'reject',
  //                 notes: remarks,
  //             });

  //             if (response.data.success) {
  //                 setLoading(false);
  //                 const updatedLeaves = await axios.get('/api/leaves/all');
  //                 setLeaves(updatedLeaves.data.leaves);
  //                 toast.success("Leave Rejected successfully!");
  //                 setIsRejectModalOpen(false);
  //                 setSelectedEntry(null);
  //                 setRemarks('');  // Clear remarks
  //             } else {
  //                 throw new Error(response.data.message || 'Failed to reject leave request.');
  //             }
  //         } else if (isRegularization(selectedEntry)) {
  //             // Handle rejection for Regularization
  //             const response = await axios.post(`/api/regularization-approvals/${selectedEntry._id}`, {
  //                 action: 'reject',
  //                 notes: remarks,
  //             });

  //             if (response.data.success) {
  //                 const updatedRegularizations = await axios.get('/api/regularization-approvals');
  //                 setRegularizations(updatedRegularizations.data.regularizations);
  //                 setIsRejectModalOpen(false);
  //                 setSelectedEntry(null);
  //                 setRemarks('');  // Clear remarks
  //             } else {
  //                 throw new Error(response.data.message || 'Failed to reject regularization request.');
  //             }
  //         }
  //     } catch (error: any) {
  //         console.error(`Error rejecting entry:`, error.response?.data || error.message);
  //         toast.error(`Failed to reject entry: ${error.response?.data?.message || error.message}`);
  //     }
  // };

  // const handleApproveSubmit = async () => {
  //   if (!selectedEntry || !isLeave(selectedEntry)) return;

  //   const leaveDays = selectedEntry.leaveDays.map((day) => ({
  //     date: day.date,
  //     unit: day.unit,
  //     status: "Approved",
  //   }));

  //   try {
  //     const response = await axios.post(
  //       `/api/leaveApprovals/${selectedEntry._id}`,
  //       {
  //         action: "approve",
  //         leaveDays,
  //       }
  //     );

  //     if (response.data.success) {
  //       toast.success("Leave approved successfully!");
  //       setIsModalOpen(false);
  //       setSelectedEntry(null);
  //       handleModalSubmit(); // Refresh data
  //     } else {
  //       throw new Error(
  //         response.data.message || "Failed to approve leave request."
  //       );
  //     }
  //   } catch (error: any) {
  //     console.error(
  //       `Error approving entry:`,
  //       error.response?.data || error.message
  //     );
  //     toast.error(
  //       `Failed to approve entry: ${error.response?.data?.message || error.message
  //       }`
  //     );
  //   }
  // };

  const handleRejectSubmit = async () => {
    if (!selectedEntry || !isLeave(selectedEntry)) return;

    const leaveDays = selectedEntry.leaveDays.map((day) => ({
      date: day.date,
      unit: day.unit,
      status: "Rejected",
    }));

    try {
      const response = await axios.post(
        `/api/leaveApprovals/${selectedEntry._id}`,
        {
          action: "reject",
          leaveDays,
          remarks,
        }
      );

      if (response.data.success) {
        toast(<div className=" w-full mb-6 gap-2 m-auto  ">
          <div className="w-full flex  justify-center">
            <DotLottieReact
              src="/lottie/tick.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-black text-center font-medium text-lg">Leave Rejected successfully</h1>
        </div>);
        setIsRejectModalOpen(false);
        setSelectedEntry(null);
        setRemarks("");
        handleModalSubmit(); // Refresh data
      } else {
        throw new Error(
          response.data.message || "Failed to reject leave request."
        );
      }
    } catch (error: any) {
      console.error(
        `Error rejecting entry:`,
        error.response?.data || error.message
      );
      toast.error(
        `Failed to reject entry: ${error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleLeaveClick = (leave: Leave) => {
    setSelectedEntry(leave); // Set the clicked leave in state
    setIsLeaveDetailsOpen(true); // Open the Leave Details sheet
  };

  const handleRegularizationClick = (regularization: Regularization) => {
    setSelectedEntry(regularization); // Set the clicked regularization in state
    setIsRegularizationDetailsOpen(true); // Open the Regularization Details sheet
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsRejectModalOpen(false); // Close reject modal as well
    setSelectedEntry(null);
    setIsLeaveDetailsOpen(false); // Close the Leave Details sheet
    setIsRegularizationDetailsOpen(false); // Close the Regularization Details sheet
    setRemarks("");
  };

  const handleModalSubmit = async () => {
    // This function can be used to refresh data after approval/rejection
    try {
      setLoading(true);
      if (filter === "Leave") {
        const response = await axios.get("/api/leaveApprovals/get");
        if (response.data.success) {
          setLeaves(response.data.leaves);
        }
      } else if (filter === "Regularization") {
        const response = await axios.get("/api/regularization-approvals");
        if (response.data.success) {
          setRegularizations(response.data.regularizations);
        }
      }
    } catch (error: any) {
      console.error(
        `Error refetching ${filter} approvals:`,
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Separate filtered arrays to maintain type integrity
  const filteredLeaves =
    statusFilter === "All"
      ? leaves
      : leaves.filter((leave) => leave.status === statusFilter);
  const filteredRegularizations =
    statusFilter === "All"
      ? regularizations
      : regularizations.filter((reg) => reg.approvalStatus === statusFilter);

  // Apply date filters
  const finalFilteredLeaves = filterLeavesByDate(filteredLeaves);
  const finalFilteredRegularizations = filterRegularizationsByDate(
    filteredRegularizations
  );

  if (loading) {
    return (
      <div className="mt-28 h-full w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  console.log(regularizations, 'regularizations');
  console.log(finalFilteredRegularizations, 'filtered');

  return (
    <div className="container mx-auto p-6">
      {/* Date Filter Buttons */}
      {/* <Toaster /> */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setDateFilter("Today")}
          className={`px-4 text-xs h-8 rounded ${dateFilter === "Today"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border text-white"
            }`}
        >
          Today
        </button>
        <button
          onClick={() => setDateFilter("Yesterday")}
          className={`px-4 text-xs h-8 rounded ${dateFilter === "Yesterday"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border text-white"
            }`}
        >
          Yesterday
        </button>
        <button
          onClick={() => setDateFilter("ThisWeek")}
          className={`px-4 text-xs h-8 rounded ${dateFilter === "ThisWeek"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border text-white"
            }`}
        >
          This Week
        </button>
        <button
          onClick={() => setDateFilter("ThisMonth")}
          className={`px-4 text-xs h-8 rounded ${dateFilter === "ThisMonth"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border text-white"
            }`}
        >
          This Month
        </button>
        <button
          onClick={() => setDateFilter("LastMonth")}
          className={`px-4 text-xs h-8 rounded ${dateFilter === "LastMonth"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border text-white"
            }`}
        >
          Last Month
        </button>
        <button
          onClick={() => setDateFilter("AllTime")}
          className={`px-4 text-xs h-8 rounded ${dateFilter === "AllTime"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border text-white"
            }`}
        >
          All Time
        </button>
        <button
          onClick={() => setIsCustomModalOpen(true)}
          className={`px-4 text-xs h-8 rounded ${dateFilter === "Custom"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border text-white"
            }`}
        >
          Custom
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilter("Leave")}
          className={`px-4 text-xs py-2 rounded flex ${filter === "Leave"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border text-white"
            }`}
        >
          <Calendar className="h-4" />
          <h1 className="mt-[1px] ml-1">Leave</h1>
        </button>
        <button
          onClick={() => setFilter("Regularization")}
          className={`px-4 text-xs py-2 rounded flex ${filter === "Regularization"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border text-white"
            }`}
        >
          <Users2 className="h-4" />
          <h1 className="mt-[1px] ml-1">Regularization</h1>
        </button>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        {filter === "Leave" ? (
          <>
            <button
              onClick={() => setStatusFilter("All")}
              className={`px-4 py-2 flex gap-2 rounded text-xs ${statusFilter === "All"
                ? "bg-[#815BF5] text-white"
                : "bg-[#] border text-white"
                }`}
            >
              <HamburgerMenuIcon />
              All
            </button>
            <button
              onClick={() => setStatusFilter("Pending")}
              className={`px-4 py-2 flex gap-2 rounded text-xs ${statusFilter === "Pending"
                ? "bg-[#815BF5] text-white"
                : "bg-[#] border hover:border-orange-400 text-white"
                }`}
            >
              <Circle
                className={`h-4 text-red-500 ${statusFilter === "Pending" ? "text-white" : ""
                  } `}
              />
              Pending

            </button>
            {/* <button
              onClick={() => setStatusFilter("Approved")}
              className={`px-4 py-2 flex gap-2 rounded text-xs ${
                statusFilter === "Approved"
              className={`px-4 py-2 flex gap-2 rounded text-xs ${
                statusFilter === "Approved"
                  ? "bg-[#7c3987] text-white"
                  : "bg-[#28152e] text-white"
              }`}
              }`}
            >
              <CheckCircle className="h-4 text-green-500" />
              Approved (
              {
                finalFilteredLeaves.filter(
                  (leave) => leave.status === "Approved"
                ).length
              }
              )
            </button> */}

            <div className="flex">
              <button
                onClick={() => setStatusFilter("Approved")}
                className={`px-4 py-2 flex gap-2 rounded text-xs border ${statusFilter === "Approved"
                  ? "bg-[#815BF5] text-white border-transparent hover:border-green-500"
                  : "bg-[#] border text-white  hover:border-green-500"
                  }`}
              >
                <CheckCircle
                  className={`h-4 text-green-500 ${statusFilter === "Approved" ? "text-white" : ""
                    } `}
                />
                Approved
              </button>
              <button
                onClick={() => setStatusFilter("Rejected")}
                className={`px-4 py-2 flex gap-2 ml-4 rounded text-xs border ${statusFilter === "Rejected"
                  ? "bg-[#815BF5] text-white border-transparent hover:border-red-500"
                  : "bg-[#] text-white border hover:border-red-500"
                  }`}
              >
                <Cross1Icon
                  className={`h-4 text-red-500 ${statusFilter === "Rejected" ? "text-white" : ""
                    } `}
                />
                Rejected
              </button>
            </div>

          </>
        ) : (
          <>
            <button
              onClick={() => setStatusFilter("All")}
              className={`px-4 py-2 flex gap-2 rounded text-xs ${statusFilter === "All"
                ? "bg-[#815BF5] text-white"
                : "bg-[#] border text-white"
                }`}
            >
              <HamburgerMenuIcon />
              All
            </button>
            <button
              onClick={() => setStatusFilter("Pending")}
              className={`px-4 py-2 flex gap-2 rounded text-xs ${statusFilter === "Pending"
                ? "bg-[#815BF5] text-white"
                : "bg-[#] border hover:border-orange-400 text-white"
                }`}
            >
              <Circle
                className={`h-4 text-red-500  ${statusFilter === "Pending" ? "text-white" : ""
                  } `}
              />
              Pending
            </button>
            {/* <button
              onClick={() => setStatusFilter("Approved")}
              className={`px-4 py-2 flex gap-2 rounded text-xs ${
                statusFilter === "Approved"
              className={`px-4 py-2 flex gap-2 rounded text-xs ${
                statusFilter === "Approved"
                  ? "bg-[#7c3987] text-white"
                  : "bg-[#28152e] text-white"
              }`}
              }`}
            >
              <CheckCircle className="h-4 text-green-500" />
              Approved (
              {
                filteredRegularizations.filter(
                  (reg) => reg.approvalStatus === "Approved"
                ).length
              }
              )
            </button> */}
            <button
              onClick={() => setStatusFilter("Approved")}
              className={`px-4 py-2 flex gap-2 rounded text-xs border ${statusFilter === "Approved"
                ? "bg-[#815BF5] text-white border"
                : "bg-[#] border text-white "
                } hover:border-green-500`}
            >
              <CheckCircle
                className={`h-4 text-green-500 ${statusFilter === "Approved" ? "text-white" : ""
                  } `}
              />
              Approved
            </button>

            {/* <button
              onClick={() => setStatusFilter("Rejected")}
              className={`px-4 py-2 flex gap-2 rounded text-xs ${
                statusFilter === "Rejected"
              className={`px-4 py-2 flex gap-2 rounded text-xs ${
                statusFilter === "Rejected"
                  ? "bg-[#7c3987] text-white"
                  : "bg-[#28152e] text-white"
              }`}
            >
              <Cross1Icon className="h-4 text-red-500" />
              Rejected (
              {
                filteredRegularizations.filter(
                  (reg) => reg.approvalStatus === "Rejected"
                ).length
              }
              )
            </button> */}
            <button
              onClick={() => setStatusFilter("Rejected")}
              className={`px-4 py-2 flex gap-2 rounded text-xs border ${statusFilter === "Rejected"
                ? "bg-[#815BF5] text-white border-transparent"
                : "bg-[#] border text-white border-"
                } hover:border-red-500`}
            >
              <Cross1Icon
                className={`h-4 text-red-500 ${statusFilter === "Rejected" ? "text-white" : ""
                  } `}
              />
              Rejected
            </button>
          </>
        )}
      </div>

      {/* Entries Display */}
      {filter === "Leave" ? (
        <div className="space-y-4 mb-12">
          {finalFilteredLeaves.length === 0 ? (
            <div className="flex w-full justify-center ">
              <div className="mt-8 ml-4">
                <DotLottieReact
                  src="/lottie/empty.lottie"
                  loop
                  className="h-56"
                  autoplay
                />
                <h1 className="text-center font-bold text-md m ">
                  No Leaves Found
                </h1>
                <p className="text-center text-sm p-2">
                  The list is currently empty for the selected filters
                </p>
              </div>
            </div>
          ) : (
            finalFilteredLeaves.map((leave) => (
              <div
                className="border hover:border-[#815BF5] cursor-pointer"
                key={leave._id}
                onClick={() => handleLeaveClick(leave)}
              >
                <div className="flex items-center justify-between   px-4 rounded shadow-sm py-3">
                  <div className="flex items-center gap-4">
                    {/* User Profile Icon */}
                    <div className="h-6 w-6 rounded-full bg-[#815BF5] flex items-center justify-center text-white text-sm">
                      {leave.user.firstName[0]}
                    </div>
                    <h3 className="text-md text-white">
                      {leave.user.firstName}
                    </h3>
                    <div className="flex gap-4">
                      <p className="text-sm text-gray-400">
                        From:{" "}
                        <span className="text-white">
                          {format(new Date(leave.fromDate), "MMM d, yyyy")}
                        </span>
                      </p>
                      <p className="text-sm text-gray-400 ml-4">
                        To:{" "}
                        <span className="text-white">
                          {format(new Date(leave.toDate), "MMM d, yyyy")}
                        </span>
                      </p>
                      <p className="text-sm text-gray-400 ml-4">
                        Applied:{" "}
                        <span className="text-white">
                          {leave.appliedDays} Day(s)
                        </span>
                      </p>
                      <p className="text-sm text-gray-400 ml-4">
                        Approved:{" "}
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
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${leave.status === "Pending"
                      ? "bg-yellow-800 text-white"
                      : leave.status === "Approved"
                        ? "bg-green-800 text-white"
                        : leave.status === "Rejected"
                          ? "bg-red-800 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                  >
                    {leave.status}
                  </span>
                </div>
                {/* Approve/Reject/Delete Buttons (shown only for orgAdmin and Pending leave status) */}
                {currentUserRole === "orgAdmin" &&
                  leave.status === "Pending" && (
                    <div className="flex gap-2 ml-4 w-full mb-4 justify-start">
                      <button
                        className="bg-transparent py-2 flex gap-2 border text-xs text-white hover:border-green-500 px-4 rounded"
                        onClick={(e) => handleApproval(leave, e)}
                      >
                        <CheckCheck className="w-4 h-4 text-[#017a5b]" />
                        Approve
                      </button>
                      <button
                        className="bg-transparent border flex gap-2  hover:border-red-500 text-white px-4 py-2 text-xs rounded"
                        onClick={(e) => handleReject(leave, e)}
                      >
                        <X className="w-4 h-4 text-red-500" />
                        Reject
                      </button>
                      <button
                        className="text-red-500 px-4 py-1 text-xs rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(leave._id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {finalFilteredRegularizations.length === 0 ? (
            <div className="flex w-full justify-center ">
              <div className="mt-8 ml-4">
              <DotLottieReact
                  src="/lottie/empty.lottie"
                  loop
                  className="h-56"
                  autoplay
                />
                <h1 className="text-center font-bold text-md  ">
                  No Entries Found
                </h1>
                <p className="text-center text-sm p-2 ">
                  The list is currently empty for the selected filters
                </p>
              </div>
            </div>
          ) : (
            finalFilteredRegularizations.map((reg) => (
              <div
                key={reg._id}
                className="border cursor-pointer hover:border-[#815BF5]"
                onClick={() => handleRegularizationClick(reg)}
              >
                <div className="flex items-center justify-between px-4 rounded shadow-sm py-2">
                  <div className="flex items-center gap-4">
                    {/* User Profile Icon */}
                    <div className="h-6 w-6 rounded-full bg-[#7c3987] flex items-center justify-center text-white text-sm">
                      {reg?.userId?.firstName[0]}
                    </div>
                    <h3 className="text-md text-white">
                      {reg?.userId?.firstName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Date:{" "}
                      <span className="text-white">
                        {format(new Date(reg?.timestamp), "MMM d, yyyy")}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${reg.approvalStatus === "Pending"
                      ? "bg-yellow-800 text-white"
                      : reg.approvalStatus === "Approved"
                        ? "bg-green-800 text-white"
                        : reg.approvalStatus === "Rejected"
                          ? "bg-red-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                  >
                    {reg?.approvalStatus}
                  </span>
                </div>
                {currentUserRole === "orgAdmin" && (
                  <div>
                    {
                      reg.approvalStatus === "Pending" && (
                        <div className="flex gap-2 ml-4 w-full mb-4 justify-start">
                          <button
                            className="bg-transparent py-2 flex gap-2 hover:border-green-600 border text-xs text-white px-4 rounded"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering sheet
                              handleApproval(reg, e);
                            }}
                          >
                            <CheckCheck className="w-4 h-4 text-[#017a5b]" />
                            Approve
                          </button>
                          <button
                            className="bg-transparent border flex gap-2 hover:border-red-600 text-white px-4 py-2 text-xs rounded"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering sheet
                              handleReject(reg, e);
                            }}
                          >
                            <X className="w-4 h-4 text-red-500" />
                            Reject
                          </button>
                          <button
                            className="bg-transparent flex gap-2 text-white px-4 py-2 text-xs rounded"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering sheet
                              openRegularizationDeleteDialog(reg._id); // Open delete confirmation for Regularization
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )
                    }
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Render the approval modal */}
      {selectedEntry && isModalOpen && (
        <>
          {!isRegularization(selectedEntry) ? (
            <LeaveApprovalModal
              leaveId={selectedEntry._id}
              leaveDays={selectedEntry.leaveDays}
              appliedDays={selectedEntry.appliedDays}
              fromDate={selectedEntry.fromDate}
              toDate={selectedEntry.toDate}
              leaveReason={selectedEntry.leaveReason}
              leaveType={selectedEntry?.leaveType?.leaveType}
              user={selectedEntry.user}
              manager={selectedEntry.user.reportingManager}
              onClose={handleModalClose}
            />
          ) : (
            <RegularizationApprovalModal
              regularizationId={selectedEntry._id}
              timestamp={selectedEntry.timestamp}
              loginTime={selectedEntry.loginTime}
              logoutTime={selectedEntry.logoutTime}
              remarks={selectedEntry.remarks}
              onClose={handleModalClose}
              onSubmit={() => {
                setIsModalOpen(false);
                setSelectedEntry(null);
                handleModalSubmit(); // Refresh data
              }}
            />
          )}
        </>
      )}

      {/* Reject Modal */}
      {selectedEntry && isRejectModalOpen && (
        <>
          {!isRegularization(selectedEntry) ? (
            <RejectModal
              entryId={selectedEntry._id}
              remarks={remarks}
              setRemarks={setRemarks}
              onClose={handleModalClose}
              onSubmit={handleRejectSubmit}
            />
          ) : (
            <RegularizationRejectModal
              regularizationId={selectedEntry._id}
              remarks={remarks}
              setRemarks={setRemarks}
              onClose={handleModalClose}
            />
          )}
        </>
      )}

      {/* Leave Details Sheet */}
      {selectedEntry && isLeave(selectedEntry) && isLeaveDetailsOpen && (
        <LeaveDetails
          selectedLeave={selectedEntry}
          onClose={handleModalClose}
        />
      )}

      {/* Regularization Details Sheet */}
      {selectedEntry &&
        isRegularization(selectedEntry) &&
        isRegularizationDetailsOpen && (
          <RegularizationDetails
            selectedRegularization={selectedEntry}
            onClose={handleModalClose}
          />
        )}

      {/* Custom Date Range Modal */}
      <Dialog open={isCustomModalOpen} onOpenChange={setIsCustomModalOpen}>
        <DialogContent className="w-96 z-[100] p-6 ml-12 bg-[#0B0D29]">
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
                    </div> // Format date as dd/mm/yyyy
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete} // Confirm delete action
        title="Confirm Delete"
        description={
          leaveIdToDelete
            ? "Are you sure you want to delete this leave request? This action cannot be undone."
            : regularizationIdToDelete
              ? "Are you sure you want to delete this regularization request? This action cannot be undone."
              : "Are you sure you want to delete this request? This action cannot be undone."
        }
      />
    </div>
  );
}
