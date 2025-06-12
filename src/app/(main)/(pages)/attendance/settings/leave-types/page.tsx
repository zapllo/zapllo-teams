"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Edit2,
  Info,
  Plus,
  Repeat,
  Trash2,
  MoreHorizontal,
  Check,
  CalendarDays,
  Banknote,
  Calendar,
  Clock,
  ToggleLeft,
  HelpCircle,
  ArrowDownUp,
  ArrowLeft,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sunrise,
  Sunset
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import DeleteConfirmationDialog from "@/components/modals/deleteConfirmationDialog";
import Loader from "@/components/ui/loader";
import { toast } from "sonner";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from "@/components/ui/tabs3";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CrossCircledIcon } from "@radix-ui/react-icons";

interface LeaveFormData {
  leaveType: string;
  description: string;
  allotedLeaves: number;
  type: "Paid" | "Unpaid";
  leaveReset: "Reset" | "CarryForward";
  backdatedLeaveDays: number;
  advanceLeaveDays: number;
  includeHolidays: boolean;
  includeWeekOffs: boolean;
  unit: ("Full Day" | "Half Day" | "Short Leave")[];
}

interface LeaveType {
  _id: string;
  leaveType: string;
  allotedLeaves: number;
  description: string;
  type: "Paid" | "Unpaid";
  leaveReset: "Reset" | "CarryForward";
  backdatedLeaveDays: number;
  advanceLeaveDays: number;
  includeHolidays: boolean;
  includeWeekOffs: boolean;
  unit: ("Full Day" | "Half Day" | "Short Leave")[];
}

const LeaveTypes: React.FC = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [formData, setFormData] = useState<LeaveFormData>({
    leaveType: "",
    description: "",
    allotedLeaves: 0,
    type: "Paid",
    leaveReset: "Reset",
    backdatedLeaveDays: 0,
    advanceLeaveDays: 0,
    includeHolidays: false,
    includeWeekOffs: false,
    unit: [],
  });

  const [isEdit, setIsEdit] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editLeaveId, setEditLeaveId] = useState<string | null>(null);
  const router = useRouter();
  const unitOptions = ["Full Day", "Half Day", "Short Leave"] as const;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"All" | "Paid" | "Unpaid">("All");

  const handleUnitToggle = (unit: "Full Day" | "Half Day" | "Short Leave") => {
    setFormData((prevData) => ({
      ...prevData,
      unit: prevData.unit.includes(unit)
        ? prevData.unit.filter((u) => u !== unit)
        : [...prevData.unit, unit],
    }));
  };

  const fetchLeaveTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/leaves/leaveType");
      setLeaveTypes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leave types:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const totalAllotedLeaves = leaveTypes.reduce(
    (total, leave) => total + leave.allotedLeaves,
    0
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit && editLeaveId) {
        await axios.put(`/api/leaves/leaveType/${editLeaveId}`, formData);
        toast.success("Leave Type updated successfully!");
      } else {
        await axios.post("/api/leaves/leaveType", formData);
        toast.success("Leave type created successfully!");
      }
      setIsModalOpen(false);
      fetchLeaveTypes();
      router.refresh();
    } catch (error) {
      console.error("Error submitting leave type:", error);
      toast.error("Failed to save leave type");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (leave: LeaveType) => {
    setIsEdit(true);
    setEditLeaveId(leave._id);
    setFormData({
      leaveType: leave.leaveType,
      description: leave.description || "",
      allotedLeaves: leave.allotedLeaves,
      type: leave.type,
      leaveReset: leave.leaveReset,
      backdatedLeaveDays: leave.backdatedLeaveDays || 0,
      advanceLeaveDays: leave.advanceLeaveDays || 0,
      includeHolidays: leave.includeHolidays || false,
      includeWeekOffs: leave.includeWeekOffs || false,
      unit: leave.unit || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/leaves/leaveType/${deleteId}`);
      setIsDeleteDialogOpen(false);
      toast.success("Leave type deleted successfully");
      fetchLeaveTypes();
    } catch (error) {
      console.error("Error deleting leave type:", error);
      toast.error("Failed to delete leave type");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const filteredLeaveTypes = leaveTypes.filter((leave) => {
    if (activeTab === "All") return true;
    return leave.type === activeTab;
  });

  const handleCreateRecommendedLeaveTypes = async () => {
    try {
      setLoading(true);
      await axios.post("/api/leaves/recommendedLeaveTypes");
      toast.success("Recommended leave types created successfully!");
      fetchLeaveTypes();
    } catch (error) {
      console.error("Error creating recommended leave types:", error);
      toast.error("Failed to create recommended leave types");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeaveBalance = async () => {
    try {
      setLoading(true);
      await axios.post("/api/leaves/updateLeaveBalances");
      toast.success("Leave balances updated successfully!");
      fetchLeaveTypes();
    } catch (error) {
      console.error("Error updating leave balances:", error);
      toast.error("Failed to update leave balances");
    } finally {
      setLoading(false);
      setIsUpdateModalOpen(false);
    }
  };

  // Get the icon based on leave type
  const getLeaveTypeIcon = (leaveType: string) => {
    const normalizedType = leaveType.toLowerCase();
    if (normalizedType.includes("sick") || normalizedType.includes("medical")) return <Badge variant="outline" className="bg-red-100 text-red-600 border-red-200">Medical</Badge>;
    if (normalizedType.includes("casual")) return <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200">Casual</Badge>;
    if (normalizedType.includes("earned") || normalizedType.includes("privilege")) return <Badge variant="outline" className="bg-purple-100 text-purple-600 border-purple-200">Earned</Badge>;
    if (normalizedType.includes("maternity")) return <Badge variant="outline" className="bg-pink-100 text-pink-600 border-pink-200">Maternity</Badge>;
    if (normalizedType.includes("paternity")) return <Badge variant="outline" className="bg-indigo-100 text-indigo-600 border-indigo-200">Paternity</Badge>;
    if (normalizedType.includes("comp") || normalizedType.includes("off")) return <Badge variant="outline" className="bg-amber-100 text-amber-600 border-amber-200">Comp-Off</Badge>;
    return <Badge variant="outline" className="bg-emerald-100 text-emerald-600 border-emerald-200">Leave</Badge>;
  };

  return (
    <div className="h-screen overflow-y-scroll scrollbar-hide mx-auto p-6">
      <Card className="shadow-sm border-muted">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Leave Types</CardTitle>
              <CardDescription className="mt-1">
                Manage your organization&apos;s leave policies and categories
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="gap-1 bg-primary"
                    onClick={() => {
                      setIsEdit(false);
                      setFormData({
                        leaveType: "",
                        description: "",
                        allotedLeaves: 0,
                        type: "Paid",
                        leaveReset: "Reset",
                        backdatedLeaveDays: 0,
                        advanceLeaveDays: 0,
                        includeHolidays: false,
                        includeWeekOffs: false,
                        unit: [],
                      });
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Leave Type
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-6 m-auto h-fit max-h-screen">
                  <DialogHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <DialogTitle>{isEdit ? "Edit Leave Type" : "Create New Leave Type"}</DialogTitle>
                        <DialogDescription>
                          {isEdit ? "Update the details of this leave type." : "Configure a new leave type for your organization."}
                        </DialogDescription>
                      </div>
                      <DialogClose asChild>
                        <CrossCircledIcon className="scale-150 cursor-pointer -mt-6  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                      </DialogClose>
                    </div>
                  </DialogHeader>

                  {loading ? (
                    <div className="flex justify-center p-6">
                      <Loader />
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 ">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="leaveType">Leave Type Name</Label>
                          <Input
                            id="leaveType"
                            name="leaveType"
                            value={formData.leaveType}
                            onChange={handleInputChange}
                            placeholder="e.g., Sick Leave"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="allotedLeaves">Allotted Days</Label>
                          <Input
                            id="allotedLeaves"
                            name="allotedLeaves"
                            type="number"
                            value={formData.allotedLeaves}
                            onChange={handleInputChange}
                            placeholder="Number of days"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Provide details about this leave type"
                          className="h-20"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Leave Type</Label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={formData.type === "Paid" ? "default" : "outline"}
                                size="sm"
                                className={`gap-1 flex-1 ${formData.type === "Paid" ? "bg-green-600 hover:bg-green-700" : ""}`}
                                onClick={() => setFormData(prev => ({ ...prev, type: "Paid" }))}
                              >
                                <Banknote className="h-4 w-4" />
                                Paid
                              </Button>
                              <Button
                                type="button"
                                variant={formData.type === "Unpaid" ? "default" : "outline"}
                                size="sm"
                                className={`gap-1 flex-1 ${formData.type === "Unpaid" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                                onClick={() => setFormData(prev => ({ ...prev, type: "Unpaid" }))}
                              >
                                <Calendar className="h-4 w-4" />
                                Unpaid
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Leave Reset Policy</Label>
                            <div className=" gap-2">
                              <Button
                                type="button"
                                variant={formData.leaveReset === "Reset" ? "default" : "outline"}
                                size="sm"
                                className={`gap-1 flex-1 ${formData.leaveReset === "Reset" ? "bg-primary" : ""}`}
                                onClick={() => setFormData(prev => ({ ...prev, leaveReset: "Reset" }))}
                              >
                                <RefreshCw className="h-4 w-4" />
                                Reset Yearly
                              </Button>
                              <Button
                                type="button"
                                variant={formData.leaveReset === "CarryForward" ? "default" : "outline"}
                                size="sm"
                                className={`gap-1 mt-4 flex-1 ${formData.leaveReset === "CarryForward" ? "bg-primary" : ""}`}
                                onClick={() => setFormData(prev => ({ ...prev, leaveReset: "CarryForward" }))}
                              >
                                <ArrowDownUp className="h-4 w-4" />
                                Carry Forward
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Leave Units</Label>
                            <div className="flex flex-wrap gap-2">
                              {unitOptions.map((unit) => (
                                <Button
                                  key={unit}
                                  type="button"
                                  variant={formData.unit.includes(unit) ? "default" : "outline"}
                                  size="sm"
                                  className={formData.unit.includes(unit) ? "bg-primary" : ""}
                                  onClick={() => handleUnitToggle(unit)}
                                >
                                  {unit === "Full Day" && <Maximize2 className="h-3 w-3 mr-1" />}
                                  {unit === "Half Day" && <Minimize2 className="h-3 w-3 mr-1" />}
                                  {unit === "Short Leave" && <Clock className="h-3 w-3 mr-1" />}
                                  {unit}
                                </Button>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Info className="h-3 w-3" />
                              Deduction: Full Day (1), Half Day (0.5), Short Leave (0.25)
                            </p>
                          </div>

                          <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <Label htmlFor="includeHolidays" className="flex items-center gap-1">
                                <Sunrise className="h-4 w-4" />
                                Include Holidays
                              </Label>
                              <Switch
                                id="includeHolidays"
                                checked={formData.includeHolidays}
                                onCheckedChange={(checked) => handleSwitchChange("includeHolidays", checked)}
                              />
                            </div>

                            <div className="flex justify-between items-center">
                              <Label htmlFor="includeWeekOffs" className="flex items-center gap-1">
                                <Sunset className="h-4 w-4" />
                                Include Weekends
                              </Label>
                              <Switch
                                id="includeWeekOffs"
                                checked={formData.includeWeekOffs}
                                onCheckedChange={(checked) => handleSwitchChange("includeWeekOffs", checked)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="backdatedLeaveDays" className="flex items-center gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            Backdated Days Allowed
                          </Label>
                          <Input
                            id="backdatedLeaveDays"
                            name="backdatedLeaveDays"
                            type="number"
                            value={formData.backdatedLeaveDays}
                            onChange={handleInputChange}
                            placeholder="0"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="advanceLeaveDays" className="flex items-center gap-1">
                            <ArrowLeft className="h-4 w-4 rotate-180" />
                            Advance Days Allowed
                          </Label>
                          <Input
                            id="advanceLeaveDays"
                            name="advanceLeaveDays"
                            type="number"
                            value={formData.advanceLeaveDays}
                            onChange={handleInputChange}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="gap-1">
                          <Check className="h-4 w-4" />
                          {isEdit ? "Update Leave Type" : "Create Leave Type"}
                        </Button>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>

              <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Repeat className="h-4 w-4" />
                    Update Leave Balances
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-6">
                  <DialogHeader>
                    <DialogTitle>Update Leave Balances</DialogTitle>
                    <DialogDescription>
                      By default, leave balances will reset to the number of allotted leaves. If you want to carry forward
                      the previous year&apos;s balance, please edit each leave type and update the Leave Reset criteria.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateLeaveBalance}
                      className="bg-primary"
                      disabled={loading}
                    >
                      {loading ? <Loader className="w-4 h-4 mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      Confirm Update
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {leaveTypes.length > 0 && (
            <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
              <Badge variant="outline" className="px-3 py-1 flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Total Allotted: <strong>{totalAllotedLeaves} days</strong></span>
              </Badge>

              <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "All" | "Paid" | "Unpaid")}>
                <TabsList>
                  <TabsTrigger value="All">All</TabsTrigger>
                  <TabsTrigger value="Paid">Paid</TabsTrigger>
                  <TabsTrigger value="Unpaid">Unpaid</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          ) : leaveTypes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <DotLottieReact
                src="/lottie/empty.lottie"
                loop
                className="h-40"
                autoplay
              />
              <h3 className="text-lg font-medium mt-4">No Leave Types Configured</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-md text-center">
                Get started by creating leave types for your organization
              </p>
              <Button
                onClick={handleCreateRecommendedLeaveTypes}
                className="mt-6"
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Recommended Leave Types
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {filteredLeaveTypes.map((leave) => (
                <Card key={leave._id} className="overflow-hidden border">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium">{leave.leaveType}</CardTitle>
                        <Badge
                          variant="secondary"
                          className="mt-1.5"
                        >
                          {leave.type}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditModal(leave)} className="cursor-pointer">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(leave._id)}
                            className="text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Allotted</p>
                        <p className="text-2xl font-semibold">{leave.allotedLeaves}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Reset Policy</p>
                        <p className="text-sm font-medium">{leave.leaveReset === "Reset" ? "Yearly Reset" : "Carry Forward"}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Units</p>
                      <div className="flex flex-wrap gap-1.5">
                        {leave.unit.map((unit) => (
                          <Badge key={unit} variant="outline">
                            {unit}
                          </Badge>
                        ))}
                        {leave.unit.length === 0 && (
                          <span className="text-sm text-muted-foreground">None specified</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Leave Type"
        description="Are you sure you want to delete this leave type? This action cannot be undone."
      />
    </div>
  );
};

export default LeaveTypes;
