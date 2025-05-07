"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Edit2, Info, Plus, Repeat, Trash2, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import DeleteConfirmationDialog from "@/components/modals/deleteConfirmationDialog";
import Loader from "@/components/ui/loader";
import { toast, Toaster } from "sonner";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import { Tabs3, TabsList3, TabsTrigger3 } from "@/components/ui/tabs3";

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
  unit: ("Full Day" | "Half Day" | "Short Leave")[]; // Array for multi-selectable units
}

interface LeaveType {
  _id: string;
  leaveType: string;
  allotedLeaves: number;
  description: string;
  type: "Paid" | "Unpaid";
  leaveReset: "Reset" | "CarryForward";
  backdatedLeaveDays: number; // Number of backdated leave days allowed
  advanceLeaveDays: number; // Number of advance leave days allowed
  includeHolidays: boolean; // Whether holidays are included in leave calculation
  includeWeekOffs: boolean; // Whether week-offs are included in leave calculation
  unit: ("Full Day" | "Half Day" | "Short Leave")[]; // Array for multi-selectable units
}

const LeaveTypes: React.FC = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]); // State to store leave types
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
    unit: [], // Initialize as an empty array
  });

  const [isEdit, setIsEdit] = useState(false); // Flag for edit state
  const [deleteId, setDeleteId] = useState<string | null>(null); // Store ID of leave type to delete
  const [editLeaveId, setEditLeaveId] = useState<string | null>(null); // Store ID of leave type to edit
  const router = useRouter();
  const unitOptions = ["Full Day", "Half Day", "Short Leave"] as const; // Define unit options
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Control the modal state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Control the modal state
  const [isLoading, setIsLoading] = useState(false); // Loader for create and edit
  const [isDeleting, setIsDeleting] = useState(false); // Loader for delete
  const [activeTab, setActiveTab] = useState<"All" | "Paid" | "Unpaid">("All"); // State to manage active tab

  const [loading, setLoading] = useState(false);

  const handleUnitToggle = (unit: "Full Day" | "Half Day" | "Short Leave") => {
    setFormData((prevData) => ({
      ...prevData,
      unit: prevData.unit.includes(unit)
        ? prevData.unit.filter((u) => u !== unit) // Remove if already selected
        : [...prevData.unit, unit], // Add if not selected
    }));
  };
  
  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get("/api/leaves/leaveType");
      setLeaveTypes(response.data);
    } catch (error) {
      console.error("Error fetching leave types:", error);
    }
  };

  // Fetch leave types when component mounts
  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const totalAllotedLeaves = leaveTypes.reduce(
    (total, leave) => total + leave.allotedLeaves,
    0
  );

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle checkboxes
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
        // PUT request for editing
        await axios.put(`/api/leaves/leaveType/${editLeaveId}`, formData);
        setLoading(false);
        setIsModalOpen(false);
        toast.success("Leave Type updated successfully!");
        fetchLeaveTypes();
      } else {
        // POST request for creating a new leave type
        await axios.post("/api/leaves/leaveType", formData);
        setLoading(false);
        toast(<div className=" w-full mb-6 gap-2 m-auto  ">
          <div className="w-full flex  justify-center">
            <DotLottieReact
              src="/lottie/tick.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-black text-center font-medium text-lg">Leave type created successfully</h1>
        </div>);
        setIsModalOpen(false);
        fetchLeaveTypes();
      }
      router.refresh(); // Refresh after submit
    } catch (error) {
      console.error("Error submitting leave type:", error);
    }
  };

  // Handle edit leave type
  const openEditModal = (leave: LeaveType) => {
    setIsEdit(true);
    setEditLeaveId(leave._id);
    setFormData({
      leaveType: leave.leaveType,
      description: leave.description || "", // Prefill description
      allotedLeaves: leave.allotedLeaves,
      type: leave.type,
      leaveReset: leave.leaveReset,
      backdatedLeaveDays: leave.backdatedLeaveDays || 0, // Prefill backdatedLeaveDays if available
      advanceLeaveDays: leave.advanceLeaveDays || 0, // Prefill advanceLeaveDays if available
      includeHolidays: leave.includeHolidays || false, // Prefill includeHolidays
      includeWeekOffs: leave.includeWeekOffs || false, // Prefill includeWeekOffs
      unit: leave.unit || [], // Prefill units if available
    });
    setIsModalOpen(true); // Open the modal for editing
  };

  // Handle delete leave type
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/leaves/leaveType/${deleteId}`);
      setIsDeleteDialogOpen(false);
      fetchLeaveTypes(); // Refresh after delete
    } catch (error) {
      console.error("Error deleting leave type:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  // Filter leave types based on the active tab
  const filteredLeaveTypes = leaveTypes.filter((leave) => {
    if (activeTab === "All") return true;
    return leave.type === activeTab;
  });

  const handleCreateRecommendedLeaveTypes = async () => {
    setLoading(true);
    try {
      // Call the API to create recommended leave types
      await axios.post("/api/leaves/recommendedLeaveTypes");
      // Refresh the leave types list
      fetchLeaveTypes();
    } catch (error) {
      console.error("Error creating recommended leave types:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeaveBalance = async () => {
    try {
      setLoading(true);
      // Call the endpoint to update leave balances
      await axios.post("/api/leaves/updateLeaveBalances");
      toast.success("Leave balances updated successfully!");
      fetchLeaveTypes(); // Refresh leave types after update
    } catch (error) {
      console.error("Error updating leave balances:", error);
      toast.error("Failed to update leave balances.");
    } finally {
      setLoading(false);
      setIsUpdateModalOpen(false); // Close the modal
    }
  };




  return (
    <div className="container mx-auto p-6">
      {/* Tabs for filtering */}
      {/* <Toaster /> */}
      {/* Add Leave Type Button */}
      <div className="flex gap-4 justify-center items-center mb-6">
        {/* <h1 className="text-lg font-bold">Leave Types</h1> */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button
              className="bg-[#017A5B] flex  items-center text-white text-xs px-4 py-2 rounded-md"
              onClick={() => {
                setIsEdit(false); // Set to add mode
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
              <Plus className="h-4" />
              <h1>New Leave Type</h1>
            </button>
          </DialogTrigger>
          <div className="flex justify-end space-x-3 ">
            <button
              className={clsx(
                "text-xs px-4  h-8 mt-[2px] rounded-md",
                activeTab === "All"
                  ? "bg-[#815BF5] text-white"
                  : "bg-transparent dark:text-white border-[#505356]  border"
              )}
              onClick={() => setActiveTab("All")}
            >
              All
            </button>
            <button
              className={clsx(
                "text-xs px-4  h-8 mt-[2px] rounded-md",
                activeTab === "Paid"
                  ? "bg-[#815BF5] text-white"
                  : "bg-transparent dark:text-white border-[#505356]  border"
              )}
              onClick={() => setActiveTab("Paid")}
            >
              Paid
            </button>
            <button
              className={clsx(
                "text-xs px-4  h-8 mt-[2px]  rounded-md",
                activeTab === "Unpaid"
                  ? "bg-[#815BF5] text-white"
                  : "bg-transparent dark:text-white border-[#505356]  border"
              )}
              onClick={() => setActiveTab("Unpaid")}
            >
              Unpaid
            </button>
            <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
              <DialogTrigger asChild>
                <button className={clsx(
                  "text-xs px-4 flex items-center  h-8 mt-[2px]  rounded-md",
                  "border-[#815BF5] hover:bg-gradient-to-r from-[#815BF5] to-[#FC8929] dark:text-white hover:text-white",
                  "bg-transparent dark:text-white border-[#505356]  border"
                )}>
                  <Repeat className="h-4" />
                  Update Leave Balance for 2025</button>
              </DialogTrigger>
              <DialogContent className="p-6 ">
                <DialogHeader>
                  Have you updated Leave Reset setting for all Leave Types?
                </DialogHeader>
                <DialogDescription>
                  By default, Leave balance will reset to the number of allotted leaves. If you want to carry forward the previous year&apos;s balance, then please Edit Leave Type and update Leave Reset criteria.
                </DialogDescription>
                <DialogFooter>
                  <DialogClose>
                    <Button className="bg-transparent dark:text-white text-black hover:border-gray-400 hover:bg-transparent border rounded">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button onClick={handleUpdateLeaveBalance} className="bg-red-500 hover:bg-red-700 border rounded">
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
          <DialogContent className=" z-[100] m-auto h-full max-h-screen  flex items-center justify-center">
            <div className="overflow-y-scroll scrollbar-hide h-full m-auto max-w-lg  shadow-lg w-full    rounded-lg">
              <div className="flex border-b py-2  w-full justify-between ">
                <DialogTitle className="text-lg   px-6 py-2 font-medium">
                  {" "}
                  {isEdit ? "Edit Leave Type" : "New Leave Type"}
                </DialogTitle>
                <DialogClose className=" px-6 py-2">
                  <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                </DialogClose>
              </div>
              {loading ? (
                <Loader />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                  <div className="relative">
                    <label className="absolute bg-white dark:bg-[#04061E] ml-2 text-xs text-[#787CA5] -mt-2 px-1">
                      Leave Type
                    </label>
                    <input
                      type="text"
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleInputChange}
                      // placeholder='Leave Type'
                      className="w-full text-xs p-2 dark:bg-[#1A1C20] dark:text-white outline-none border rounded bg-transparent"
                      required
                    />
                  </div>

                  <div className="relative">
                    {/* <label className="block text-sm">Description</label> */}
                    <label className="absolute dark:bg-[#1A1C20] bg-white dark:text-white ml-2 text-xs text-[#787CA5] -mt-2 px-1">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      // placeholder='Description'
                      className="w-full text-xs h-24 pt-3 font-medium p-2 border bg-transparent outline-none rounded"
                      required
                    />
                  </div>

                  <div className="relative">
                    {/* <label className="block text-sm">Allotted Leaves</label> */}
                    <label className="absolute bg-white dark:bg-[#0b0d29] ml-2 text-xs text-[#787CA5] -mt-2 px-1">
                      Alloted Leaves
                    </label>
                    <input
                      type="text"
                      name="allotedLeaves"
                      value={formData.allotedLeaves}
                      onChange={handleInputChange}
                      placeholder="Alloted Leaves"
                      className="w-full text-sm p-2 border outline-none bg-transparent rounded"
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex gap-4 items-center mb-1">
                      <label className="block text-sm  ">Type</label>
                      <Tabs3
                        // Ties the tab value to formData.type => "Paid" or "Unpaid"
                        value={formData.type}
                        onValueChange={(val) => setFormData((prev) => ({
                          ...prev,
                          type: val as "Paid" | "Unpaid",
                        }))}
                      >
                        <TabsList3>
                          <TabsTrigger3 value="Paid">Paid</TabsTrigger3>
                          <TabsTrigger3 value="Unpaid">Unpaid</TabsTrigger3>
                        </TabsList3>

                        {/* Optional: If you want distinct content under each tab, you can use TabsContent3. */}
                        {/* <TabsContent3 value="Paid">
      <p>When the user picks Paid</p>
    </TabsContent3>
    <TabsContent3 value="Unpaid">
      <p>When the user picks Unpaid</p>
    </TabsContent3> */}
                      </Tabs3>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="flex items-center w-full gap-2  dark:bg-gray-800 p-2  rounded">
                      <label className="block text-xs dark:text-white ">
                        Backdated Leave Days
                      </label>
                      <div>
                        <input
                          type="text"
                          name="backdatedLeaveDays"
                          value={formData.backdatedLeaveDays}
                          onChange={handleInputChange}
                          className=" border border-[#505356] px-4 py-2 w-24 outline-none bg-transparent rounded-md"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full dark:bg-gray-800 p-2 rounded">
                      <label className="block text-xs  dark:text-white">
                        Advance Leave Days
                      </label>
                      <div>
                        <input
                          type="text"
                          name="advanceLeaveDays"
                          value={formData.advanceLeaveDays}
                          onChange={handleInputChange}
                          className=" border border-[#505356] px-4 py-2 w-24 outline-none bg-transparent rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between w-full ">
                    <div className="flex gap-2 px-2">
                      <label className="block text-sm mb-2">
                        Include Holidays
                      </label>
                      <Switch
                        checked={formData.includeHolidays}
                        onCheckedChange={(checked) =>
                          handleSwitchChange("includeHolidays", checked)
                        }
                        id="includeHolidays"
                      />
                    </div>

                    <div className="flex gap-2 px-2">
                      <label className="block text-sm mb-2">
                        Include Week Offs
                      </label>
                      <Switch
                        checked={formData.includeWeekOffs}
                        onCheckedChange={(checked) =>
                          handleSwitchChange("includeWeekOffs", checked)
                        }
                        id="includeWeekOffs"
                      />
                    </div>
                  </div>
                  <div className="dark:bg-gray-800 p-2 rounded">
                    <div className="flex gap-2 dark:bg-gray-800  rounded">
                      <div className="flex items-center gap-2">
                        <label className="block text-sm  dark:text-white">
                          Unit
                        </label>
                        <div className="flex items-center space-x-4">
                          {unitOptions.map((unit) => (
                            <button
                              key={unit}
                              type="button"
                              className={clsx(
                                "px-4 py-2 text-xs rounded  dark:text-white bg-[#815BF5]",
                                formData.unit.includes(unit)
                                  ? "bg-[#017A5B] text-white"
                                  : "bg-transparent border border-[#505356]  "
                              )}
                              onClick={() => handleUnitToggle(unit)}
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-1 text-muted-foreground">
                      <Info className="h-5" />
                      <p className=" text-sm ">
                        Deduction (in Days) : Full Day - 1, Half Day - 0.5,
                        Short Leave - 0.25{" "}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex items-center gap-2 mb-1">
                      <label className="block text-sm  ">Leave Reset</label>
                      <Tabs3
                        // The 'value' is the current formData.leaveReset
                        // which can be "Reset" or "CarryForward"
                        value={formData.leaveReset}
                        // onValueChange receives the tab's value ("Reset" or "CarryForward")
                        onValueChange={(val) =>
                          setFormData((prev) => ({ ...prev, leaveReset: val as "Reset" | "CarryForward" }))
                        }
                        // Optional: add a custom className if needed
                        className="max-w-sm"
                      >
                        <TabsList3>
                          <TabsTrigger3 value="Reset">Reset</TabsTrigger3>
                          <TabsTrigger3 value="CarryForward">Carry Forward</TabsTrigger3>
                        </TabsList3>

                        {/* If you want distinct content for each tab, you can include TabsContent3 components here.
        If you just want a toggle, you can omit them. */}
                        {/*
    <TabsContent3 value="Reset">
      <p className="text-sm">When 'Reset' is chosen...</p>
    </TabsContent3>
    <TabsContent3 value="CarryForward">
      <p className="text-sm">When 'Carry Forward' is chosen...</p>
    </TabsContent3>
    */}
                      </Tabs3>
                    </div>

                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#815bf5] hover:bg-[#5f31e9] w-full text-sm text-white px-4  mt-2  py-2 rounded"
                    >
                      {isEdit ? "Update Leave Type" : "Add Leave Type"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {
        leaveTypes.length === 0 ? (
          <div className="text-center">
            <button
              className="mt-2 bg-[#017A5B] text-white text-xs px-4 py-2 rounded-md"
              onClick={handleCreateRecommendedLeaveTypes}
              disabled={loading}
            >
              {loading ? "Creating..." : <div className="flex items-center gap-1"><Plus className="h-5" /> Create Recommended Leave Types</div>}
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-center mb-4">
              Total Leaves Alloted: {totalAllotedLeaves}
            </h1>
          </>
        )
      }
      <div></div>
      {/* Leave Types Grid */}
      {
        leaveTypes.length === 0 ? (
          <div className="">
            <div className="flex w-full mt-12 justify-center">
              <DotLottieReact
                src="/lottie/empty.lottie"
                loop
                className="h-56"
                autoplay
              />
            </div>
            <h1 className="text-center  text-md font-semibold ">No Leave Types Found</h1>
            <p className="text-center text-xs p-2">
              Click on New Leave type to create a leave type
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredLeaveTypes.map((leave) => (
              <div
                key={leave._id}
                className="border shadow-md rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-sm font-semibold">{leave.leaveType}</h2>
                  <span
                    className={clsx(
                      "inline-block px-2 py-1 text-xs font-medium rounded mt-2",
                      leave.type === "Paid"
                        ? "bg-[#017A5B] text-white -800"
                        : "bg-[#202560] text-white"
                    )}
                  >
                    {leave.type}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-sm">
                    Leaves Allotted: <strong>{leave.allotedLeaves}</strong>
                  </p>
                  <div className="mt-2 flex  justify-end gap-2">
                    <button className="text-gray-600 hover:text-gray-800">
                      <Edit2
                        onClick={() => openEditModal(leave)}
                        className="h-5 text-blue-400"
                      />
                    </button>
                    <button className="text-gray-600 hover:text-red-600">
                      <Trash2
                        onClick={() => handleDeleteClick(leave._id)}
                        className="h-5 text-red-500"
                      />
                    </button>
                  </div>
                  {loading ? (
                    <Loader />
                  ) : (
                    <DeleteConfirmationDialog
                      isOpen={isDeleteDialogOpen}
                      onClose={() => setIsDeleteDialogOpen(false)}
                      onConfirm={handleDelete}
                      title="Delete Leave Type"
                      description="Are you sure you want to delete this leave type? This action cannot be undone."
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div >
  );
};

export default LeaveTypes;
