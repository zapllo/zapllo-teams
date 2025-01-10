"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import LeaveApprovalModal from "@/components/modals/leaveApprovalModal";
import RejectModal from "@/components/modals/rejectModal";
import EditLeaveBalanceModal from "@/components/modals/editBalanceModal";
import {
  Calendar,
  CheckCheck,
  CheckCircle,
  Circle,
  PencilIcon,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";
import LeaveDetails from "@/components/sheets/leaveDetails";
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
import { toast } from "sonner";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type LeaveType = {
  _id: string;
  leaveType: string;
  allotedLeaves: number; // Allotted leave balance for each leave type
};

type LeaveBalance = {
  leaveType: LeaveType;
  leaveTypeId: string;
  balance: number;
  userLeaveBalance: number;
};

type User = {
  userId: string;
  firstName: string;
  lastName: string;
  leaveBalances: LeaveBalance[];
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
  status: string;
  leaveReason: string;
  appliedDays: number;
  leaveDays: LeaveDay[];
  remarks: string;
  attachment?: string[];
  audioUrl?: string;
  user: {
    firstName: string;
    lastName: string;
    _id: string;
    reportingManager: {
      firstName: string;
      lastName: string;
      _id: string;
    };
  };
  approvedBy?: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  rejectedBy?: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  createdAt: string; // Add createdAt field
  updatedAt: string;
}

const normalizeDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export default function AllLeaves() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [filter, setFilter] = useState<
    "Pending" | "Approved" | "Rejected" | "All"
  >("All");
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [remarks, setRemarks] = useState<string>("");
  const [tab, setTab] = useState<"applications" | "balances">("balances");
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeaveForDetails, setSelectedLeaveForDetails] =
    useState<Leave | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [leaveIdToDelete, setLeaveIdToDelete] = useState<string | null>(null);
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
  }>({
    start: null,
    end: null,
  });
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/api/users/me");
        if (response.data && response.data.data.role) {
          setCurrentUserRole(response.data.data.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  console.log(selectedUser, "selectedUser");
  const handleLeaveModalSubmit = async (
    updatedLeaveBalances: LeaveBalance[]
  ) => {
    if (!selectedUser) return;

    const formattedBalances = updatedLeaveBalances.map((balance) => ({
      leaveType: balance.leaveTypeId,
      balance: balance.userLeaveBalance,
    }));

    try {
      console.log(
        selectedUser.userId,
        formattedBalances,
        "Sending data to the backend"
      );
      await axios.post("/api/leaveBalances/update", {
        userIdToUpdate: selectedUser.userId,
        leaveBalances: formattedBalances,
      });

      const response = await axios.get("/api/leaves/getAllUsersBalances");
      if (response.data.success) {
        toast.success("Balance updated successfully!");
        setUsers(response.data.data.users);
      }

      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating leave balances:", error);
    }
  };

  useEffect(() => {
    const fetchAllLeaves = async () => {
      try {
        // setLoading(true);
        const response = await axios.get("/api/leaves/all");
        if (response.data.success) {
          setLeaves(response.data.leaves);
          // setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };

    fetchAllLeaves();
  }, []);

  const handleApproval = (leave: Leave, e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Stop event from triggering parent handlers
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };

  const handleReject = (leave: Leave, e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Stop event from triggering parent handlers
    setSelectedLeave(leave);
    setIsRejectModalOpen(true);
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async (leaveId: string) => {
    try {
      const response = await axios.delete(`/api/leaveApprovals/${leaveId}`);
      if (response.data.success) {
        toast.success("Leave Request deleted successfully!");
        const updatedLeaves = await axios.get("/api/leaves/all");
        setLeaves(updatedLeaves.data.leaves);
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  };

  const confirmDelete = () => {
    if (leaveIdToDelete) {
      handleDelete(leaveIdToDelete);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (leaveId: string) => {
    setLeaveIdToDelete(leaveId);
    setIsDeleteDialogOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!remarks) return;
    try {
      setLoading(true);
      if (!selectedLeave) return;
      const response = await axios.post(
        `/api/leaveApprovals/${selectedLeave._id}`,
        {
          leaveDays: selectedLeave.leaveDays.map((day) => ({
            ...day,
            status: "Rejected",
          })),
          remarks,
          action: "reject",
        }
      );
      if (response.data.success) {
        toast.success("Leave Request rejected successfully");
        const updatedLeaves = await axios.get("/api/leaves/all");
        setLeaves(updatedLeaves.data.leaves);
        setIsRejectModalOpen(false);
        setSelectedLeave(null);
        setRemarks("");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsRejectModalOpen(false);
    setSelectedLeave(null);
  };

  const handleModalSubmit = async () => {
    setIsModalOpen(false);
    setSelectedLeave(null);

    const response = await axios.get("/api/leaves/all");
    if (response.data.success) {
      setLeaves(response.data.leaves);
    }
  };

  const filterEntriesByDate = (entries: Leave[]) => {
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

    return entries.filter((entry) => {
      const entryDate = new Date(entry.createdAt);

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

  const handleCustomDateSubmit = (start: Date, end: Date) => {
    setCustomDateRange({ start, end });
    setDateFilter("Custom");
    setIsCustomModalOpen(false);
  };

  const handleClose = () => {
    // Reset date range when closing
    setCustomDateRange({ start: null, end: null });
    setIsCustomModalOpen(false);
  };

  const filteredLeaves = filterEntriesByDate(
    filter === "All"
      ? leaves
      : leaves.filter((leave) => leave.status === filter)
  );

  useEffect(() => {
    const fetchLeaveBalances = async () => {
      try {
        // setLoading(true);
        const response = await axios.get("/api/leaves/getAllUsersBalances");
        if (response.data.success) {
          setUsers(response.data.data.users);
          setLeaveTypes(response.data.data.leaveTypes);
          // setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching leave balances:", error);
      }
    };

    fetchLeaveBalances();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = users.filter((user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(lowerCaseQuery)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  if (loading) {
    return (
      <div className="mt-32 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container h-screen overflow-y-scroll scrollbar-hide  mx-auto p-6">
      {/* Date Filter Buttons */}
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
      {/* Tab Navigation with Counts */}
      <div className="flex justify-center gap-4 mb-6">

        <button
          onClick={() => setTab("balances")}
          className={`px-4 text-xs py-2 flex  rounded ${tab === "balances"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border text-white"
            }`}
        >
          <WalletCards className="h-4" />
          Leave Balances
        </button>
        <button
          onClick={() => setTab("applications")}
          className={`px-4 text-xs py-2 flex  rounded ${tab === "applications"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border text-white"
            }`}
        >
          <Calendar className="h-4" />
          <h1 className="mt-[1px]">Leave Applications </h1>
        </button>
      </div>
      {tab === "balances" && (
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs outline-none border rounded px-4 py-2"
          />
        </div>
      )}
      {/* Tab Content */}
      {tab === "applications" ? (
        <>
          {/* Filter Buttons */}
          {/* <div className="flex justify-center gap-4 mb-6">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() =>
                  setFilter(
                    status as "Pending" | "Approved" | "Rejected" | "All"
                  )
                }
                className={`px-4 text-xs h-8 flex items-center gap-2 rounded ${filter === status
                    ? "bg-[#7c3987] text-white"
                    : "bg-[#28152e] text-white"
                  }`}
              >
                {status === "All" && <HamburgerMenuIcon className="h-4" />}
                {status === "Pending" && (
                  <Circle className="h-4 text-red-500" />
                )}
                {status === "Approved" && (
                  <CheckCircle className="h-4 text-green-500" />
                )}
                {status === "Rejected" && (
                  <Cross1Icon className="h-4 text-red-500" />
                )}
                {status} (
                {
                  leaves.filter(
                    (leave) => status === "All" || leave.status === status
                  ).length
                }
                )
              </button>
            ))}
          </div> */}
          <div className="flex justify-center gap-4 mb-6">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() =>
                  setFilter(
                    status as "Pending" | "Approved" | "Rejected" | "All"
                  )
                }
                className={`px-4 text-xs h-8 flex items-center  gap-2 rounded border ${filter === status
                  ? "bg-[#815BF5] text-white"
                  : "bg-[#] border text-white"
                  } ${status === "Approved" && filter !== status
                    ? "hover:border-green-500 border"
                    : ""
                  } ${status === "Rejected" && filter !== status
                    ? "hover:border-red-500 border"
                    : status === "Pending" && filter !== status
                      ? "hover:border-orange-500"
                      : ""
                  }`}
              >
                {status === "All" && <HamburgerMenuIcon className="h-4" />}
                {status === "Pending" && (
                  <Circle
                    className={`h-4 text-red-500 ${status === "Pending" ? "text-" : "text-red-500"
                      } `}
                  />
                )}
                {status === "Approved" && (
                  <CheckCircle
                    className={`h-4 text-green-500 ${status === "Approved" ? "text-green-500" : ""
                      } `}
                  />
                )}
                {status === "Rejected" && (
                  <Cross1Icon className="h-4 text-red-500" />
                )}
                {status} (
                {
                  filteredLeaves.filter(
                    (leave) => status === "All" || leave.status === status
                  ).length
                }
                )
              </button>
            ))}
          </div>

          {/* Leave Cards */}
          {filteredLeaves.length === 0 ? (
            <div className="flex w-full justify-center ">
              <div className="mt-8 ml-4">
              <DotLottieReact
                                        src="/lottie/empty.lottie"
                                        loop
                                        className="h-56"
                                        autoplay
                                      />
                <h1 className="text-center font-bold text-md  ">
                  No Leaves Found
                </h1>
                <p className="text-center text-sm p-2 ">
                  The list is currently empty for the selected filters
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mb-12">
              {filteredLeaves.map((leave) => (
                <div
                  key={leave._id}
                  className="border hover:border-[#815BF5] cursor-pointer"
                  onClick={() => setSelectedLeaveForDetails(leave)}
                >
                  <div className="flex items-center justify-between  px-4 rounded shadow-sm py-2 ">
                    <div className="flex items-center gap-4">
                      {/* User Profile Icon */}
                      <div className="h-6 w-6 rounded-full bg-[#7c3987] flex items-center justify-center text-white text-sm">
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
                            : leave.status === "Partially Approved"
                              ? "bg-red-900 text-white"
                              : "bg-gray-500 text-white"
                        }`}
                    >
                      {leave.status}
                    </span>
                  </div>

                  {/* Approve/Reject/Delete Buttons */}
                  <div className="flex justify-start ml-4 w-full mb-4">
                    {currentUserRole === "orgAdmin" &&
                      leave.status === "Pending" && (
                        <div className="flex gap-2">
                          <button
                            className="bg-transparent py-2 flex gap-2 border  text-xs text-white px-4 rounded hover:border-green-500"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering sheet
                              handleApproval(leave, e)
                            }}
                          >
                            <CheckCheck className="w-4 h-4 text-[#017a5b]" />
                            Approve
                          </button>

                          <button
                            className="bg-transparent border  flex gap-2 text-white px-4 py-2 text-xs rounded hover:border-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(leave, e)
                            }}
                          >
                            <X className="w-4 h-4 text-red-500" />
                            Reject
                          </button>

                          <button
                            className="text-red-500  px-4 py-1 ml-auto text-xs rounded"
                            onClick={() => openDeleteDialog(leave._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
            title="Confirm Delete"
            description="Are you sure you want to delete this leave request? This action cannot be undone."
          />

          {selectedLeaveForDetails && (
            <LeaveDetails
              selectedLeave={selectedLeaveForDetails}
              onClose={() => setSelectedLeaveForDetails(null)}
            />
          )}

          {/* Render the approval modal */}
          {selectedLeave && isModalOpen && (
            <LeaveApprovalModal
              leaveId={selectedLeave._id}
              leaveDays={selectedLeave.leaveDays}
              appliedDays={selectedLeave.appliedDays}
              leaveReason={selectedLeave.leaveReason}
              leaveType={selectedLeave.leaveType.leaveType}
              fromDate={selectedLeave.fromDate}
              toDate={selectedLeave.toDate}
              user={selectedLeave.user}
              manager={selectedLeave.user.reportingManager}
              onClose={handleModalClose}
            />
          )}

          {/* Render the reject modal */}
          {selectedLeave && isRejectModalOpen && (
            <RejectModal
              entryId={selectedLeave._id}
              remarks={remarks}
              setRemarks={setRemarks}
              onClose={handleModalClose}
              onSubmit={handleRejectSubmit}
            />
          )}

          <Dialog open={isCustomModalOpen} onOpenChange={setIsCustomModalOpen}>
            <DialogContent className="w-96 p-6 ml-12 bg-[#0B0D29] z-[100]">
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
                        </div>
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
                      setIsStartPickerOpen(false);
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
                      setIsEndPickerOpen(false);
                    }}
                    onCloseDialog={() => setIsEndPickerOpen(false)}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border  border-collapse table-auto">
            <thead className="bg-[#0A0D28] text-left text-xs">
              <tr>
                <th className="px-4  py-2">User</th>
                {leaveTypes.map((leaveType) => (
                  <th key={leaveType._id} className="px-4 py-2">
                    {leaveType.leaveType.substring(0, 2).toUpperCase()}
                  </th>
                ))}
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr className="text-xs" key={user.userId}>
                  <td className="border-t px-4 py-2">
                    {user.firstName} {user.lastName}
                  </td>
                  {leaveTypes.map((leaveType) => {
                    const balance =
                      user.leaveBalances.find(
                        (lb) => lb.leaveTypeId === leaveType._id
                      )?.userLeaveBalance || 0;

                    return (
                      <td key={leaveType._id} className="border-t px-4 py-2">
                        {balance}
                      </td>
                    );
                  })}
                  <td className="border-t px-4 py-2">
                    <button
                      className="text-blue-400 px-4 py-2 rounded"
                      onClick={() => handleEditClick(user)}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Render Edit Leave Balance Modal */}
          {isEditModalOpen && selectedUser && (
            <EditLeaveBalanceModal
              user={selectedUser}
              leaveTypes={leaveTypes}
              onClose={() => setIsEditModalOpen(false)}
              onSubmit={handleLeaveModalSubmit}
            />
          )}
        </div>
      )}
    </div>
  );
}
