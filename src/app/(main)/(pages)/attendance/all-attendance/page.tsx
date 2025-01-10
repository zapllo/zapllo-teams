"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  format,
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
} from "date-fns";
import RegularizationApprovalModal from "@/components/modals/regularizationApprovalModal";
import RegularizationRejectModal from "@/components/modals/rejectRegularizationModal";
import RegularizationDetails from "@/components/sheets/regularizationDetails";
import {
  Accordion2,
  AccordionContent2,
  AccordionItem2,
  AccordionTrigger2,
} from "@/components/ui/simple-accordion";
import {
  Calendar,
  CalendarDays,
  CheckCheck,
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
import Loader from "@/components/ui/loader";
import CustomDatePicker from "@/components/globals/date-picker";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type User = {
  _id: string;
  firstName: string;
};

type Attendance = {
  _id: string;
  userId: User;
  action: "login" | "logout";
  timestamp: string;
  lat?: number;
  lng?: number;
  approvalStatus?: "Pending" | "Approved" | "Rejected";
  approvalRemarks?: string;
};

type Regularization = {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    reportingManager: {
      firstName: string;
      lastName: string;
    };
  };
  action: "regularization";
  timestamp: string;
  loginTime: string;
  logoutTime: string;
  remarks: string;
  approvalStatus: "Pending" | "Approved" | "Rejected";
  approvalRemarks?: string;
  approvedBy?: {
    firstName: string;
    lastName: string;
  };
  approvedAt?: string;
};

function isRegularization(
  entry: Attendance | Regularization
): entry is Regularization {
  return entry.action === "regularization";
}

function isAttendance(entry: Attendance | Regularization): entry is Attendance {
  return entry.action === "login" || entry.action === "logout";
}



export default function AllAttendance() {
  const [groupedEntries, setGroupedEntries] = useState<{
    [key: string]: { user: User; dates: { [date: string]: Attendance[] } };
  }>({});
  const [regularizations, setRegularizations] = useState<Regularization[]>([]);
  const [filter, setFilter] = useState<"Attendance" | "Regularization">(
    "Attendance"
  );
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
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
  }>({
    start: null,
    end: null,
  });
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false); // For custom date modal
  const [selectedEntry, setSelectedEntry] = useState<
    Attendance | Regularization | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRegularizationDetailsOpen, setIsRegularizationDetailsOpen] =
    useState(false);
  const [remarks, setRemarks] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [regularizationIdToDelete, setRegularizationIdToDelete] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false); // For triggering the start date picker
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false); // For triggering the end date picker

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        if (filter === "Attendance") {
          const response = await axios.get("/api/get-all-attendance");
          if (response.data.success) {
            const groupedByUser = groupEntriesByUserAndDate(
              response.data.entries
            );
            setGroupedEntries(groupedByUser);
            setLoading(false);
          }
        } else if (filter === "Regularization") {
          const response = await axios.get("/api/all-regularization-approvals");
          if (response.data.success) {
            setRegularizations(response.data.regularizations);
            setLoading(false);
          }
        }
      } catch (error: any) {
        console.error(
          `Error fetching ${filter} entries:`,
          error.response?.data || error.message
        );
        alert(
          `Failed to fetch ${filter} entries: ${error.response?.data?.message || error.message
          }`
        );
      }
    };

    fetchEntries();
  }, [filter]);

  // Grouping function: Group attendance entries by user and then by date
  const groupEntriesByUserAndDate = (entries: Attendance[]) => {
    const grouped: {
      [key: string]: { user: User; dates: { [date: string]: Attendance[] } };
    } = {};

    entries.forEach((entry) => {
      const userId = entry.userId._id;
      const date = format(new Date(entry.timestamp), "yyyy-MM-dd");

      if (!grouped[userId]) {
        grouped[userId] = {
          user: entry.userId,
          dates: {},
        };
      }

      if (!grouped[userId].dates[date]) {
        grouped[userId].dates[date] = [];
      }

      grouped[userId].dates[date].push(entry);
    });

    return grouped;
  };

  // Helper function for date filtering logic
  const normalizeDate = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const filterEntriesByDate = (entries: (Attendance | Regularization)[]) => {
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
      const entryDate = new Date(entry.timestamp);

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

  const handleRegularizationClick = (regularization: Regularization) => {
    setSelectedEntry(regularization); // Set selected entry
    setIsRegularizationDetailsOpen(true); // Open details sheet
  };

  const handleModalSubmit = async () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
    // Refetch regularization data after approval
    try {
      const response = await axios.get("/api/all-regularization-approvals");
      setRegularizations(response.data.regularizations);
    } catch (error: any) {
      console.error(
        `Error refetching regularizations:`,
        error.response?.data || error.message
      );
    }
  };

  const handleCustomDateSubmit = (start: Date, end: Date) => {
    setCustomDateRange({ start, end });
    setIsCustomModalOpen(false);
  };

  const handleClose = () => {
    // Reset date range when closing
    setCustomDateRange({ start: null, end: null });
    setIsCustomModalOpen(false);
  };

  const filteredRegularizations = filterEntriesByDate(
    statusFilter === "All"
      ? regularizations
      : regularizations.filter((entry) => entry.approvalStatus === statusFilter)
  ) as Regularization[];

  const filteredAttendance = filterEntriesByDate(
    Object.values(groupedEntries).flatMap((user) =>
      Object.values(user.dates).flat()
    )
  ).filter(isAttendance) as Attendance[];

  const handleApproval = (entry: Regularization, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleReject = (entry: Regularization, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEntry(entry);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!remarks) {
      alert("Please enter remarks for rejection.");
      return;
    }
    try {
      if (!selectedEntry || !isRegularization(selectedEntry)) return;

      const response = await axios.patch(
        `/api/regularization-approvals/${selectedEntry._id}`,
        {
          action: "reject",
          notes: remarks,
        }
      );

      if (response.data.success) {
        const updatedEntries = await axios.get(
          "/api/all-regularization-approvals"
        );
        setRegularizations(updatedEntries.data.regularizations);
        setIsRejectModalOpen(false);
        setSelectedEntry(null);
        setRemarks(""); // Clear remarks
      } else {
        throw new Error(
          response.data.message || "Failed to reject regularization request."
        );
      }
    } catch (error: any) {
      console.error(
        `Error rejecting regularization:`,
        error.response?.data || error.message
      );
      alert(`Failed to reject regularization`);
    }
  };

  const confirmDelete = async () => {
    if (!regularizationIdToDelete) return;

    try {
      const response = await axios.delete(
        `/api/regularization-approvals/${regularizationIdToDelete}`
      );
      if (response.data.success) {
        // Refetch regularization entries after deletion
        const updatedEntries = await axios.get(
          "/api/all-regularization-approvals"
        );
        setRegularizations(updatedEntries.data.regularizations);
        setIsDeleteDialogOpen(false); // Close dialog
        setRegularizationIdToDelete(null); // Reset regularization ID
      } else {
        throw new Error(
          response.data.message || "Failed to delete regularization."
        );
      }
    } catch (error: any) {
      console.error(
        `Error deleting regularization:`,
        error.response?.data || error.message
      );
      alert(`Failed to delete regularization`);
    }
  };

  const openDeleteDialog = (entryId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion toggle
    setRegularizationIdToDelete(entryId); // Store regularization ID
    setIsDeleteDialogOpen(true); // Open confirmation dialog
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsRejectModalOpen(false);
    setSelectedEntry(null);
    setRemarks("");
  };

  if (loading) {
    return (
      <div className="mt-32 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
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

      {/* Tabs for Attendance and Regularization */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilter("Attendance")}
          className={`px-4 text-xs flex py-2 rounded ${filter === "Attendance"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border text-white"
            }`}
        >
          <CalendarDays className="h-4" />
          <h1>All Attendance</h1>
        </button>
        <button
          onClick={() => setFilter("Regularization")}
          className={`px-4 text-xs flex py-2 rounded ${filter === "Regularization"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border text-white"
            }`}
        >
          <Users2 className="h-4" />
          All Regularizations
        </button>
      </div>

      {/* Attendance Section */}
      {filter === "Attendance" && (
        <Accordion2 type="multiple" className="space-y-4">
          {Object.keys(groupedEntries).length === 0 ? (
            <div className="flex w-full justify-center ">
              <div className="mt-8 ml-4">
                <DotLottieReact
                  src="/lottie/empty.lottie"
                  loop
                  className="h-56"
                  autoplay
                />
                <h1 className="text-center font-bold text-md mt-2 ">
                  No Attendance Records Found
                </h1>
                <p className="text-center text-sm ">
                  The list is currently empty for the selected filters
                </p>
              </div>
            </div>
          ) : (
            Object.keys(groupedEntries).map((userId) => (
              <AccordionItem2 className="h-10" key={userId} value={userId}>
                <div className="border h-10  px-4">
                  <AccordionTrigger2 className="-mt-2">
                    <div className="flex items-center gap-4">
                      <div className="h-6 w-6 rounded-full bg-[#815BF5] flex items-center justify-center text-white text-sm">
                        {groupedEntries[userId].user.firstName[0]}
                      </div>
                      {groupedEntries[userId].user.firstName}
                    </div>
                  </AccordionTrigger2>
                </div>
                <AccordionContent2>
                  <div className="px-4 border">
                    {Object.keys(groupedEntries[userId].dates).map((date) => (
                      <Accordion2 key={date} type="single" collapsible>
                        <AccordionItem2 value={date}>
                          <AccordionTrigger2>
                            {format(new Date(date), "MMM d, yyyy")}
                          </AccordionTrigger2>
                          <AccordionContent2>
                            {groupedEntries[userId].dates[date].map((entry) => (
                              <div
                                key={entry._id}
                                className="flex justify-between items-center border-b py-2"
                              >
                                <span className="text-white">
                                  {entry.action === "login"
                                    ? "Login"
                                    : "Logout"}{" "}
                                  at{" "}
                                  {format(new Date(entry.timestamp), "hh:mm a")}
                                </span>
                              </div>
                            ))}
                          </AccordionContent2>
                        </AccordionItem2>
                      </Accordion2>
                    ))}
                  </div>
                </AccordionContent2>
              </AccordionItem2>
            ))
          )}
        </Accordion2>
      )}

      {/* Regularization Section */}
      {filter === "Regularization" && (
        <div className="space-y-4">
          {filteredRegularizations.length === 0 ? (
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
                <p className="text-center text-sm p-2">
                  The list is currently empty for the selected filters
                </p>
              </div>
            </div>
          ) : (
            filteredRegularizations.map((entry) => (
              <div
                className="border hover:border-[#815BF5] cursor-pointer"
                key={entry._id}
              >
                <div
                  onClick={() => handleRegularizationClick(entry)}
                  className="flex items-center justify-between px-4 rounded shadow-sm py-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-6 rounded-full bg-[#815BF5] flex items-center justify-center text-white text-sm">
                      {entry.userId.firstName[0]}
                    </div>
                    <h3 className="text-md text-white">
                      {entry.userId.firstName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Date:{" "}
                      <span className="text-white">
                        {format(new Date(entry.timestamp), "MMM d, yyyy")}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${entry.approvalStatus === "Pending"
                      ? "bg-yellow-800 text-white"
                      : entry.approvalStatus === "Approved"
                        ? "bg-green-800 text-white"
                        : "bg-red-500 text-white"
                      }`}
                  >
                    {entry.approvalStatus}
                  </span>
                </div>
                {entry.approvalStatus === "Pending" && (
                  <div className="flex gap-2 ml-4 w-full mb-4 justify-start">
                    <button
                      className="bg-transparent py-2 flex gap-2 border border-transparent text-xs text-white px-4 rounded hover:border-green-500"
                      onClick={(e) => handleApproval(entry, e)}
                    >
                      <CheckCheck className="w-4 h-4 text-[#017a5b]" />
                      Approve
                    </button>

                    <button
                      className="bg-transparent border border-transparent flex gap-2 text-white px-4 py-2 text-xs rounded hover:border-red-500"
                      onClick={(e) => handleReject(entry, e)}
                    >
                      <X className="w-4 h-4 text-red-500" />
                      Reject
                    </button>

                    <button
                      className="bg-transparent flex gap-2 text-white px-4 py-2 text-xs rounded"
                      onClick={(e) => openDeleteDialog(entry._id, e)} // Trigger confirmation dialog
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    {/* Delete Confirmation Dialog */}
                    <DeleteConfirmationDialog
                      isOpen={isDeleteDialogOpen}
                      onClose={() => setIsDeleteDialogOpen(false)}
                      onConfirm={confirmDelete} // Confirm delete action
                      title="Confirm Delete"
                      description="Are you sure you want to delete this regularization request? This action cannot be undone."
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <Dialog open={isCustomModalOpen} onOpenChange={setIsCustomModalOpen}>
        <DialogContent className="w-96 p-6 ml-12 bg-[#0B0D29] z-[100]">
          <div className="flex justify-between">
            <DialogTitle className="text-md font-medium text-white">
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

      {/* Start Picker Modal */}
      <Dialog open={isStartPickerOpen} onOpenChange={setIsStartPickerOpen}>

        <DialogContent className=" z-[100]  scale-90 flex justify-center ">
          <div className=" z-[20] rounded-lg  scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
            <div className="w-full flex mb-4 justify-between">
              <CustomDatePicker
                selectedDate={customDateRange.start}
                onDateChange={(newDate) => {
                  setCustomDateRange((prev) => ({ ...prev, end: newDate }));
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

      {/* Regularization Details Sheet */}
      {selectedEntry &&
        isRegularizationDetailsOpen &&
        isRegularization(selectedEntry) && (
          <RegularizationDetails
            selectedRegularization={selectedEntry} // This will only work if selectedEntry is Regularization
            onClose={() => setIsRegularizationDetailsOpen(false)} // Close sheet
          />
        )}

      {/* Approval Modal */}
      {selectedEntry && isModalOpen && isRegularization(selectedEntry) && (
        <RegularizationApprovalModal
          regularizationId={selectedEntry._id}
          timestamp={selectedEntry.timestamp}
          loginTime={selectedEntry.loginTime}
          logoutTime={selectedEntry.logoutTime}
          remarks={selectedEntry.remarks}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}

      {/* Reject Modal */}
      {selectedEntry &&
        isRejectModalOpen &&
        isRegularization(selectedEntry) && (
          <RegularizationRejectModal
            regularizationId={selectedEntry._id}
            remarks={remarks}
            setRemarks={setRemarks}
            onClose={handleModalClose}
          />
        )}
    </div>
  );
}
