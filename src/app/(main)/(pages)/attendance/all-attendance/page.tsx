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
  Calendar,
  CalendarDays,
  CheckCheck,
  Filter,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from "@/components/ui/tabs3";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion3";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

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
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
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
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);

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
          }
        } else if (filter === "Regularization") {
          const response = await axios.get("/api/all-regularization-approvals");
          if (response.data.success) {
            setRegularizations(response.data.regularizations);
          }
        }
      } catch (error: any) {
        console.error(
          `Error fetching ${filter} entries:`,
          error.response?.data || error.message
        );
        toast.error(
          `Failed to fetch ${filter} entries: ${error.response?.data?.message || error.message}`
        );
      } finally {
        setLoading(false);
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
    setSelectedEntry(regularization);
    setIsRegularizationDetailsOpen(true);
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
    setDateFilter("Custom");
    setIsCustomModalOpen(false);
  };

  const handleClose = () => {
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
      toast.error("Please enter remarks for rejection.");
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
        toast.success("Regularization request rejected successfully");
        const updatedEntries = await axios.get(
          "/api/all-regularization-approvals"
        );
        setRegularizations(updatedEntries.data.regularizations);
        setIsRejectModalOpen(false);
        setSelectedEntry(null);
        setRemarks("");
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
      toast.error("Failed to reject regularization request");
    }
  };

  const confirmDelete = async () => {
    if (!regularizationIdToDelete) return;

    try {
      const response = await axios.delete(
        `/api/regularization-approvals/${regularizationIdToDelete}`
      );
      if (response.data.success) {
        toast.success("Regularization request deleted successfully");
        // Refetch regularization entries after deletion
        const updatedEntries = await axios.get(
          "/api/all-regularization-approvals"
        );
        setRegularizations(updatedEntries.data.regularizations);
        setIsDeleteDialogOpen(false);
        setRegularizationIdToDelete(null);
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
      toast.error("Failed to delete regularization request");
    }
  };

  const openDeleteDialog = (entryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRegularizationIdToDelete(entryId);
    setIsDeleteDialogOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsRejectModalOpen(false);
    setSelectedEntry(null);
    setRemarks("");
  };

  // Get status color for badge
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Approved': return 'bg-green-500';
      case 'Rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Attendance Management</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as "Attendance" | "Regularization")}>
            <TabsList className="mb-6 justify-center">
              <TabsTrigger value="Attendance" className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                All Attendance
              </TabsTrigger>
              <TabsTrigger value="Regularization" className="flex items-center gap-1">
                <Users2 className="h-4 w-4" />
                All Regularizations
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row justify-between gap-3 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as any)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Today">Today</SelectItem>
                    <SelectItem value="Yesterday">Yesterday</SelectItem>
                    <SelectItem value="ThisWeek">This Week</SelectItem>
                    <SelectItem value="ThisMonth">This Month</SelectItem>
                    <SelectItem value="LastMonth">Last Month</SelectItem>
                    <SelectItem value="AllTime">All Time</SelectItem>
                    <SelectItem value="Custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>

                {dateFilter === "Custom" && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsCustomModalOpen(true)}
                      className="flex items-center gap-1"
                    >
                      <Calendar className="h-4 w-4" />
                      {customDateRange.start && customDateRange.end
                        ? `${format(customDateRange.start, 'dd/MM/yy')} - ${format(customDateRange.end, 'dd/MM/yy')}`
                        : "Select Dates"}
                    </Button>
                  </div>
                )}
              </div>

              {filter === "Regularization" && (
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator className="mb-6" />

            <TabsContent value="Attendance" className="mt-0">
              {Object.keys(groupedEntries).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <DotLottieReact
                    src="/lottie/empty.lottie"
                    loop
                    className="h-40"
                    autoplay
                  />
                  <h2 className="text-lg font-semibold mt-4">No Attendance Records Found</h2>
                  <p className="text-sm text-muted-foreground">
                    The list is currently empty for the selected filters
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.keys(groupedEntries).map((userId) => (
                    <Accordion type="single" collapsible key={userId}>
                      <AccordionItem value={userId} className="border-b-0">
                        <Card>
                          <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {groupedEntries[userId].user.firstName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {groupedEntries[userId].user.firstName}
                              </span>
                            </div>
                          </AccordionTrigger>

                          <AccordionContent className="pt-0 pb-0">
                            <div className="border-t p-0">
                              {Object.keys(groupedEntries[userId].dates).map((date) => (
                                <Accordion type="single" collapsible key={date}>
                                  <AccordionItem value={date} className="border-b-0">
                                    <AccordionTrigger className="px-4 py-2 font-medium text-sm hover:no-underline">
                                      {format(new Date(date), "MMM d, yyyy")}
                                    </AccordionTrigger>
                                    <AccordionContent className="border-t border-muted pb-0">
                                      <div className="divide-y">
                                        {groupedEntries[userId].dates[date].map((entry) => (
                                          <div
                                            key={entry._id}
                                            className="flex justify-between items-center py-3 px-6"
                                          >
                                            <div className="flex items-center gap-3">
                                              <Badge variant={"outline"}>
                                                {entry.action === "login" ? "Login" : "Logout"}
                                              </Badge>
                                              <span className="text-sm text-muted-foreground">
                                                {format(new Date(entry.timestamp), "hh:mm a")}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              ))}
                            </div>
                          </AccordionContent>
                        </Card>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="Regularization" className="mt-0">
              {filteredRegularizations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <DotLottieReact
                    src="/lottie/empty.lottie"
                    loop
                    className="h-40"
                    autoplay
                  />
                  <h2 className="text-lg font-semibold mt-4">No Regularization Requests Found</h2>
                  <p className="text-sm text-muted-foreground">
                    The list is currently empty for the selected filters
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredRegularizations.map((entry) => (
                    <Card
                      key={entry._id}
                      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                      onClick={() => handleRegularizationClick(entry)}
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {entry.userId.firstName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{`${entry.userId.firstName} ${entry.userId.lastName || ""}`}</p>
                              <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                                <span>{format(new Date(entry.timestamp), "MMM d, yyyy")}</span>
                                <span>•</span>
                                <span>{`Login: ${entry.loginTime?.substring(0, 5) || "N/A"}`}</span>
                                <span>•</span>
                                <span>{`Logout: ${entry.logoutTime?.substring(0, 5) || "N/A"}`}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-3 sm:mt-0">
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(entry.approvalStatus)} text-white border-none px-2 py-1`}
                            >
                              {entry.approvalStatus}
                            </Badge>
                          </div>
                        </div>

                        {entry.approvalStatus === "Pending" && (
                          <div className="bg-muted/50 p-2 flex justify-end gap-2 border-t">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={(e) => handleApproval(entry, e)}
                                  >
                                    <CheckCheck className="h-4 w-4" />
                                    Approve
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Approve this regularization request</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={(e) => handleReject(entry, e)}
                                  >
                                    <X className="h-4 w-4" />
                                    Reject
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Reject this regularization request</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600"
                                    onClick={(e) => openDeleteDialog(entry._id, e)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete this regularization request</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Custom Date Range Modal */}
      <Dialog open={isCustomModalOpen} onOpenChange={setIsCustomModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-lg font-semibold">
            Select Custom Date Range
          </DialogTitle>

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
            className="space-y-4 pt-2"
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
                    ? format(customDateRange.start, "PPP")
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
                    ? format(customDateRange.end, "PPP")
                    : "Select date"}
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!customDateRange.start || !customDateRange.end}
              >
                Apply Range
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Date Picker Modals */}
      <Dialog open={isStartPickerOpen} onOpenChange={setIsStartPickerOpen}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none">
          <div className="rounded-lg bg-background shadow-lg p-4">
            <CustomDatePicker
              selectedDate={customDateRange.start}
              onDateChange={(newDate) => {
                setCustomDateRange((prev) => ({ ...prev, start: newDate }));
                setIsStartPickerOpen(false);
              }}
              onCloseDialog={() => setIsStartPickerOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEndPickerOpen} onOpenChange={setIsEndPickerOpen}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none">
          <div className="rounded-lg bg-background shadow-lg p-4">
            <CustomDatePicker
              selectedDate={customDateRange.end}
              onDateChange={(newDate) => {
                setCustomDateRange((prev) => ({ ...prev, end: newDate }));
                setIsEndPickerOpen(false);
              }}
              onCloseDialog={() => setIsEndPickerOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Regularization Details Sheet */}
      {selectedEntry &&
        isRegularizationDetailsOpen &&
        isRegularization(selectedEntry) && (
          <RegularizationDetails
            selectedRegularization={selectedEntry}
            onClose={() => setIsRegularizationDetailsOpen(false)}
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

   {/* Delete Confirmation Dialog */}
   <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        description="Are you sure you want to delete this regularization request? This action cannot be undone."
      />
    </div>
  );
}
