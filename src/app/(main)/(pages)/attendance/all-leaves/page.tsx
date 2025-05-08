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
  Filter,
  PencilIcon,
  Search,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from "@/components/ui/tabs3";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type LeaveType = {
  _id: string;
  leaveType: string;
  allotedLeaves: number;
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
  createdAt: string;
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
  const [activeTab, setActiveTab] = useState<"applications" | "balances">("balances");
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

  const handleLeaveModalSubmit = async (
    updatedLeaveBalances: LeaveBalance[]
  ) => {
    if (!selectedUser) return;

    const formattedBalances = updatedLeaveBalances.map((balance) => ({
      leaveType: balance.leaveTypeId,
      balance: balance.userLeaveBalance,
    }));

    try {
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
      toast.error("Failed to update leave balances");
    }
  };

  const fetchAllLeaves = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/leaves/all");
      if (response.data.success) {
        setLeaves(response.data.leaves);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      toast.error("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  const handleApproval = (leave: Leave, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };

  const handleReject = (leave: Leave, e: React.MouseEvent) => {
    e.stopPropagation();
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
        toast.error(response.data.error || "Failed to delete leave request");
      }
    } catch (error) {
      console.error("Error deleting leave:", error);
      toast.error("Failed to delete leave request");
    }
  };

  const confirmDelete = () => {
    if (leaveIdToDelete) {
      handleDelete(leaveIdToDelete);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (leaveId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setLeaveIdToDelete(leaveId);
    setIsDeleteDialogOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!remarks) {
      toast.error("Please provide rejection remarks");
      return;
    }
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
      }
    } catch (error) {
      console.error("Error rejecting leave:", error);
      toast.error("Failed to reject leave request");
    } finally {
      setLoading(false);
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
        setLoading(true);
        const response = await axios.get("/api/leaves/getAllUsersBalances");
        if (response.data.success) {
          setUsers(response.data.data.users);
          setLeaveTypes(response.data.data.leaveTypes);
        }
      } catch (error) {
        console.error("Error fetching leave balances:", error);
        toast.error("Failed to fetch leave balances");
      } finally {
        setLoading(false);
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

  // Get status color for badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Approved': return 'bg-green-500';
      case 'Rejected': return 'bg-red-500';
      case 'Partially Approved': return 'bg-orange-500';
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
            <CardTitle className="text-2xl font-bold">Leave Management</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "applications" | "balances")}>
            <TabsList className="mb-6 justify-center gap-2">
              <TabsTrigger value="balances" className="flex items-center gap-1">
                <WalletCards className="h-4 w-4" />
                Leave Balances
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Leave Applications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applications">
              <div className="space-y-4">
                {/* Date Filter */}
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

                  {/* Status Filter */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
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
                </div>

                <Separator className="mb-6" />

                {/* Leave Applications */}
                {filteredLeaves.length === 0 ? (
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
                    {filteredLeaves.map((leave) => (
                      <Card
                        key={leave._id}
                        className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                        onClick={() => setSelectedLeaveForDetails(leave)}
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
                                  <span>•</span>
                                  <span>{`${leave.leaveDays.filter(day => day.status === "Approved").length} day(s) approved`}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-3 sm:mt-0">
                              {leave.leaveReason === "Penalty" && (
                                <Badge variant="destructive">Penalty</Badge>
                              )}
                              <Badge
                                variant="outline"
                                className={`${getStatusColor(leave.status)} text-white border-none px-2 py-1`}
                              >
                                {leave.status}
                              </Badge>
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
                                      onClick={(e) => openDeleteDialog(leave._id, e)}
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
            </TabsContent>

            <TabsContent value="balances">
              <div className="space-y-4">
                <div className="flex relative w-full max-w-sm items-center mb-4 space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground absolute ml-3 pointer-events-none" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 pl-9"
                  />
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[250px]">User</TableHead>
                          {leaveTypes.map((leaveType) => (
                            <TableHead key={leaveType._id} className="text-left">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="cursor-help">
                                    {leaveType.leaveType.substring(0, 2).toUpperCase()}
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p>{leaveType.leaveType}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableHead>
                          ))}
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={leaveTypes.length + 2} className="text-center py-6">
                              <div className="flex flex-col items-center justify-center py-6">
                                <p className="text-sm text-muted-foreground">No users found</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => (
                            <TableRow key={user.userId} className="hover:bg-muted/50">
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                      {user.firstName[0]}{user.lastName[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{user.firstName} {user.lastName}</span>
                                </div>
                              </TableCell>
                              {leaveTypes.map((leaveType) => {
                                const balance =
                                  user.leaveBalances.find(
                                    (lb) => lb.leaveTypeId === leaveType._id
                                  )?.userLeaveBalance || 0;

                                return (
                                  <TableCell key={leaveType._id} className="text-left">
                                    <Badge className="font-medium text-white bg-primary">
                                      {balance}
                                    </Badge>
                                  </TableCell>
                                );
                              })}
                              <TableCell className="text-right">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEditClick(user)}
                                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                      >
                                        <PencilIcon className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Edit leave balances</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
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

      {/* Leave Details Sheet */}
      {selectedLeaveForDetails && (
        <LeaveDetails
          selectedLeave={selectedLeaveForDetails}
          onClose={() => setSelectedLeaveForDetails(null)}
        />
      )}

      {/* Leave Approval Modal */}
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
          onUpdate={fetchAllLeaves}
        />
      )}

      {/* Reject Modal */}
      {selectedLeave && isRejectModalOpen && (
        <RejectModal
          entryId={selectedLeave._id}
          remarks={remarks}
          setRemarks={setRemarks}
          onClose={handleModalClose}
          onSubmit={handleRejectSubmit}
        />
      )}

      {/* Edit Leave Balance Modal */}
      {isEditModalOpen && selectedUser && (
        <EditLeaveBalanceModal
          user={selectedUser}
          leaveTypes={leaveTypes}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleLeaveModalSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        description="Are you sure you want to delete this leave request? This action cannot be undone."
      />
    </div>
  );
}
