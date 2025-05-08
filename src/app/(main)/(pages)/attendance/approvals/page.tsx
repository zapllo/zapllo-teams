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
  Filter,
  MoreHorizontal,
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
import { toast } from "sonner";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from "@/components/ui/tabs3";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Types remain the same
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
  status: "Pending" | "Approved" | "Rejected";
  leaveReason: string;
  appliedDays: number;
  leaveDays: LeaveDay[];
  remarks: string;
  user: User;
  updatedAt: string;
  createdAt: string;
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

// Type Guards remain the same
function isRegularization(
  entry: Leave | Regularization
): entry is Regularization {
  return (entry as Regularization).loginTime !== undefined;
}

function isLeave(entry: Leave | Regularization): entry is Leave {
  return (entry as Leave).leaveType !== undefined;
}

export default function Approvals() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [regularizations, setRegularizations] = useState<Regularization[]>([]);
  const [filter, setFilter] = useState<"Leave" | "Regularization">("Leave");
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
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<
    Leave | Regularization | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [remarks, setRemarks] = useState<string>("");
  const [isLeaveDetailsOpen, setIsLeaveDetailsOpen] = useState(false);
  const [isRegularizationDetailsOpen, setIsRegularizationDetailsOpen] =
    useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaveIdToDelete, setLeaveIdToDelete] = useState<string | null>(null);
  const [regularizationIdToDelete, setRegularizationIdToDelete] = useState<
    string | null
  >(null);
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

  // Fetch both data types on initial render
  useEffect(() => {
    if (!currentUserRole) return;

    fetchLeaveData();
    fetchRegularizationData();
  }, [currentUserRole]);

  // Separate data fetching functions
  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      let response;

      if (currentUserRole === "member") {
        response = await axios.get("/api/leaves");
      } else if (currentUserRole === "orgAdmin" || currentUserRole === "manager") {
        response = await axios.get("/api/leaves/all");
      } else {
        response = await axios.get("/api/leaveApprovals/get");
      }

      if (response.data.success) {
        setLeaves(response.data.leaves);
      } else {
        console.error("Error fetching leaves:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegularizationData = async () => {
    try {
      setLoading(true);
      if (currentUserRole === "member") {
        const resEntries = await fetch("/api/loginEntries");
        const dataEntries = await resEntries.json();
        setRegularizations(dataEntries.entries);
      } else {
        const response = await axios.get("/api/regularization-approvals");
        if (response.data.success) {
          setRegularizations(response.data.regularizations);
        } else {
          console.error("Error fetching regularizations:", response.data.error);
        }
      }
    } catch (error) {
      console.error("Error fetching regularizations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab changes
  const handleFilterChange = (value: "Leave" | "Regularization") => {
    setFilter(value);

    // Refresh data when tab changes
    if (value === "Leave") {
      fetchLeaveData();
    } else {
      fetchRegularizationData();
    }
  };

  const openDeleteDialog = (leaveId: string) => {
    setLeaveIdToDelete(leaveId);
    setRegularizationIdToDelete(null);
    setIsDeleteDialogOpen(true);
  };

  const openRegularizationDeleteDialog = (regularizationId: string) => {
    setRegularizationIdToDelete(regularizationId);
    setLeaveIdToDelete(null);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteLeave = async (leaveId: string) => {
    try {
      const response = await axios.delete(`/api/leaveApprovals/${leaveId}`);
      if (response.data.success) {
        const updatedLeaves = await axios.get("/api/leaves/all");
        setLeaves(updatedLeaves.data.leaves);
        toast.success("Leave request deleted successfully");
      } else {
        console.error(response.data.error);
        toast.error(response.data.error || "Failed to delete leave.");
      }
    } catch (error: any) {
      console.error("Error deleting leave:", error);
      toast.error(
        `Error deleting leave: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleDeleteRegularization = async (regularizationId: string) => {
    try {
      const response = await axios.delete(
        `/api/regularization-approvals/${regularizationId}`
      );
      if (response.data.success) {
        const updatedRegularizations = await axios.get(
          "/api/regularization-approvals"
        );
        setRegularizations(updatedRegularizations.data.regularizations);
        toast.success("Regularization request deleted successfully");
      } else {
        console.error(response.data.error);
        toast.error(response.data.error || "Failed to delete regularization.");
      }
    } catch (error: any) {
      console.error("Error deleting regularization:", error);
      toast.error(
        `Error deleting regularization: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const confirmDelete = async () => {
    try {
      if (leaveIdToDelete) {
        await handleDeleteLeave(leaveIdToDelete);
      } else if (regularizationIdToDelete) {
        await handleDeleteRegularization(regularizationIdToDelete);
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const refetchApprovals = async () => {
    if (filter === "Leave") {
      await fetchLeaveData();
    } else if (filter === "Regularization") {
      await fetchRegularizationData();
    }
  };

  // Filter functions
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
      const entryDate = new Date(leave.createdAt);

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

    const normalizeDate = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const handleCustomDateSubmit = (start: Date, end: Date) => {
      setCustomDateRange({ start, end });
      setIsCustomModalOpen(false);
      setDateFilter("Custom");
    };

    const handleClose = () => {
      setCustomDateRange({ start: null, end: null });
      setIsCustomModalOpen(false);
    };

    const handleApproval = async (
      entry: Leave | Regularization,
      e: React.MouseEvent
    ) => {
      e.stopPropagation();
      setSelectedEntry(entry);
      setIsModalOpen(true);
    };

    const handleReject = (entry: Leave | Regularization, e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedEntry(entry);
      setIsRejectModalOpen(true);
    };

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
          toast(<div className="w-full mb-6 gap-2 m-auto">
            <div className="w-full flex justify-center">
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
          refetchApprovals();
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
          `Failed to reject entry: ${error.response?.data?.message || error.message}`
        );
      }
    };

    const handleLeaveClick = (leave: Leave) => {
      setSelectedEntry(leave);
      setIsLeaveDetailsOpen(true);
    };

    const handleRegularizationClick = (regularization: Regularization) => {
      setSelectedEntry(regularization);
      setIsRegularizationDetailsOpen(true);
    };

    const handleModalClose = () => {
      setIsModalOpen(false);
      setIsRejectModalOpen(false);
      setSelectedEntry(null);
      setIsLeaveDetailsOpen(false);
      setIsRegularizationDetailsOpen(false);
      setRemarks("");
    };

    const handleModalSubmit = async () => {
      await refetchApprovals();
    };

    // Filtered arrays
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
        <div className="flex h-[80vh] w-full items-center justify-center">
          <Loader />
        </div>
      );
    }

    // Status color mapping helper
    const getStatusColor = (status: string) => {
      switch(status) {
        case 'Pending': return 'bg-yellow-500';
        case 'Approved': return 'bg-green-500';
        case 'Rejected': return 'bg-red-500';
        default: return 'bg-gray-500';
      }
    };

    // Status badge component for better reusability
    const StatusBadge = ({ status }: { status: string }) => (
      <Badge
        variant="outline"
        className={`${getStatusColor(status)} text-white border-none px-2 py-1`}
      >
        {status}
      </Badge>
    );

    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Approval Requests</CardTitle>
              <div className="flex gap-2">
                <Tabs
                  value={filter}
                  onValueChange={(value) => handleFilterChange(value as "Leave" | "Regularization")}
                  className="mr-2"
                >
                  <TabsList className="gap-2">
                    <TabsTrigger value="Leave" className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Leave
                    </TabsTrigger>
                    <TabsTrigger value="Regularization" className="flex items-center gap-1">
                      <Users2 className="h-4 w-4" />
                      Regularization
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-3 mb-6">
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
            </div>

            <Separator className="mb-6" />

            {filter === "Leave" ? (
              <div className="space-y-4">
                {finalFilteredLeaves.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <DotLottieReact
                      src="/lottie/empty.lottie"
                      loop
                      className="h-40"
                      autoplay
                    />
                    <h2 className="text-lg font-semibold mt-4">No Leaves Found</h2>
                    <p className="text-sm text-muted-foreground">
                      The list is currently empty for the selected filters
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {finalFilteredLeaves.map((leave) => (
                      <Card
                        key={leave._id}
                        className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                        onClick={() => handleLeaveClick(leave)}
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 bg-primary">
                                <AvatarFallback>{leave.user.firstName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{`${leave.user.firstName} ${leave.user.lastName}`}</p>
                                <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                                  <span>{leave.leaveType?.leaveType}</span>
                                  <span>•</span>
                                  <span>{`${format(new Date(leave.fromDate), "MMM d")} - ${format(new Date(leave.toDate), "MMM d, yyyy")}`}</span>
                                  <span>•</span>
                                  <span>{`${leave.appliedDays} day${leave.appliedDays > 1 ? 's' : ''}`}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-3 sm:mt-0">
                              {leave.leaveReason === "Penalty" && (
                                <Badge variant="destructive">Penalty</Badge>
                              )}
                              <StatusBadge status={leave.status} />
                            </div>
                          </div>

                          {currentUserRole === "orgAdmin" && leave.status === "Pending" && (
                            <div className="bg-muted/50 p-2 flex justify-end gap-2 border-t">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                                      onClick={(e) => handleApproval(leave, e)}
                                    >
                                      <CheckCheck className="h-4 w-4" />
                                      Approve
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Approve this leave request</p>
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
                                      onClick={(e) => handleReject(leave, e)}
                                    >
                                      <X className="h-4 w-4" />
                                      Reject
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Reject this leave request</p>
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteDialog(leave._id);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete this leave request</p>
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
              </div>
            ) : (
              <div className="space-y-4">
                {finalFilteredRegularizations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <DotLottieReact
                      src="/lottie/empty.lottie"
                      loop
                      className="h-40"
                      autoplay
                    />
                    <h2 className="text-lg font-semibold mt-4">No Entries Found</h2>
                    <p className="text-sm text-muted-foreground">
                      The list is currently empty for the selected filters
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {finalFilteredRegularizations.map((reg) => (
                      <Card
                        key={reg._id}
                        className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                        onClick={() => handleRegularizationClick(reg)}
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 bg-primary">
                                <AvatarFallback>{reg?.userId?.firstName?.[0] || "U"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{`${reg?.userId?.firstName || ""} ${reg?.userId?.lastName || ""}`}</p>
                                <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                                  <span>{format(new Date(reg?.timestamp), "MMM d, yyyy")}</span>
                                  <span>•</span>
                                  <span>{`Login: ${reg.loginTime?.substring(0, 5) || "N/A"}`}</span>
                                  <span>•</span>
                                  <span>{`Logout: ${reg.logoutTime?.substring(0, 5) || "N/A"}`}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-3 sm:mt-0">
                              <StatusBadge status={reg.approvalStatus || "Pending"} />
                            </div>
                          </div>

                          {currentUserRole === "orgAdmin" && reg.approvalStatus === "Pending" && (
                            <div className="bg-muted/50 p-2 flex justify-end gap-2 border-t">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleApproval(reg, e);
                                      }}
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReject(reg, e);
                                      }}
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openRegularizationDeleteDialog(reg._id);
                                      }}
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
              </div>
            )}
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

        {/* Start & End Date Picker Modals */}
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

        {/* Modals and Sheets */}
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
                onUpdate={refetchApprovals}
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
                  refetchApprovals();
                }}
              />
            )}
          </>
        )}

        {/* Reject Modals */}
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

        {/* Detail Sheets */}
        {selectedEntry && isLeave(selectedEntry) && isLeaveDetailsOpen && (
          <LeaveDetails
            selectedLeave={selectedEntry}
            onClose={handleModalClose}
          />
        )}

        {selectedEntry &&
          isRegularization(selectedEntry) &&
          isRegularizationDetailsOpen && (
            <RegularizationDetails
              selectedRegularization={selectedEntry}
              onClose={handleModalClose}
            />
          )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
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
