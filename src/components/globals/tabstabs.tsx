"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Edit, Edit3, FileEdit, Mail, MessageCircle, MessageCircleDashedIcon, Pencil, Phone, Plane, Plus, PlusCircleIcon, Trash, Trash2, User, UserCheck, UserCircle, Users, Users2Icon } from "lucide-react";
import axios from "axios";
import { Tabs2, TabsList2, TabsTrigger2 } from "../ui/tabs2";
import { Tabs3, TabsList3, TabsTrigger3 } from "../ui/tabs3";
import Loader from "../ui/loader";
import { toast, Toaster } from "sonner";
import DeleteConfirmationDialog from "../modals/deleteConfirmationDialog";
import { getData } from "country-list";
import CountryDrop from "./countrydropdown";
import { getCountryCallingCode } from 'libphonenumber-js';
import UserCountry from "./userCountry";
import { Switch } from "../ui/switch";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FaSearch, FaTelegram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { validateEmail } from "@/helper/emailValidation";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface User {
  _id: string;
  email: string;
  role: string;
  password: string;
  firstName: string;
  lastName: string;
  whatsappNo: string;
  reportingManager: string;
  profilePic: string;
  country: string;
  isLeaveAccess: boolean;
  isTaskAccess: boolean;
}

interface APIResponse<T> {
  success: boolean;
  user: T;
  error?: string;
}

export default function TeamTabs() {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('IN'); // Default country as India
  const [countryCode, setCountryCode] = useState('+91'); // Default country code for India
  const [newMember, setNewMember] = useState({
    email: "",
    role: "member",
    password: "",
    firstName: "",
    lastName: "",
    whatsappNo: "",
    reportingManager: "",
    country: 'IN', // Add country to the newMember state
    isLeaveAccess: false, // new field
    isTaskAccess: false,  // new field
  });
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loggedInUserRole, setLoggedInUserRole] = useState("");
  const [editedUser, setEditedUser] = useState<User>({
    _id: "",
    email: "",
    role: "",
    password: "",
    firstName: "",
    lastName: "",
    whatsappNo: "",
    reportingManager: "",
    profilePic: "",
    country: "IN",
    isLeaveAccess: false, // new field
    isTaskAccess: false,  // new field
  });
  const [selectedManager, setSelectedManager] = useState("");
  const [reportingManagerName, setReportingManagerName] = useState("");
  const [reportingManagerNames, setReportingManagerNames] = useState<{
    [key: string]: string;
  }>({});
  const [selectedReportingManager, setSelectedReportingManager] = useState("");
  const [updateModalReportingManager, setUpdateModalReportingManager] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    whatsappNo: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleUserClick = (userId: string) => {
    router.push(`/dashboard/teams/${userId}`);
  };

  const validateInputs = () => {
    const emailError = validateEmail(newMember.email);

    const newErrors = {
      email: emailError,
      firstName: !newMember.firstName.trim() ? "First Name is required" : "",
      lastName: !newMember.lastName.trim() ? "Last Name is required" : "",
      whatsappNo: !newMember.whatsappNo.trim() ? "WhatsApp Number is required" : "",
      password: newMember.password.length < 6 ? "Password must be at least 6 characters long" : "",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleCountrySelect = (countryCode: any) => {
    const phoneCode = getCountryCallingCode(countryCode);
    setCountryCode(`+${phoneCode}`);
    setSelectedCountry(countryCode);
    setNewMember({ ...newMember, country: countryCode }); // Update country in the newMember object
  };

  useEffect(() => {
    // Update newMember's reportingManagerId when selectedManager changes
    setNewMember((prevState) => ({
      ...prevState,
      reportingManagerId: selectedManager,
    }));
  }, [selectedManager]);

  const fetchReportingManagerNames = async (
    users: User[]
  ): Promise<{ [key: string]: string }> => {
    const managerNames: { [key: string]: string } = {};

    for (const user of users) {
      if (user.reportingManager) {
        try {
          const response = await axios.get(`/api/users/${user.reportingManager}`);
          const { data } = response.data;
          managerNames[user._id] = `${data.firstName}`;
        } catch (error: any) {
          console.error(`Error fetching reporting manager for user ${user._id}:`, error);
        }
      }
    }

    return managerNames;
  };

  const isFormValid =
    newMember.firstName.trim() &&
    newMember.lastName.trim() &&
    newMember.email.trim() &&
    newMember.password.trim() &&
    newMember.role &&
    (newMember.role === "orgAdmin" || selectedManager);

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/users/organization");
      const result = await response.json();

      if (response.ok) {
        setUsers(result.data);
        const managerNames = await fetchReportingManagerNames(result.data);
        setReportingManagerNames(managerNames);
      } else {
        console.error("Error fetching users:", result.error);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const getUserDetails = async () => {
      const res = await axios.get("/api/users/me");
      setCurrentUser(res.data.data);
      setLoggedInUserRole(res.data.data.role);
    };
    getUserDetails();
  }, []);

  const handleReportingManagerChange = (value: string) => {
    if (value === "none") {
      setSelectedReportingManager("");
    } else {
      setSelectedReportingManager(value);
    }
  };

  // Filter users based on search query, active tab, and selected reporting manager
  const filteredUsers = users.filter((user) => {
    if (
      activeTab !== "all" &&
      !user.role.toLowerCase().includes(activeTab.toLowerCase())
    ) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !user.firstName.toLowerCase().includes(query) &&
        !user.lastName.toLowerCase().includes(query) &&
        !user.email.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (
      selectedReportingManager &&
      user.reportingManager !== selectedReportingManager
    ) {
      return false;
    }
    return true;
  });

  const handleCreateUser = async () => {
    setLoading(true);
    setIsSubmitted(true);
    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    try {
      setErrorMessage("");
      const response = await axios.post("/api/users/signup", {
        ...newMember,
        isLeaveAccess: newMember.isLeaveAccess,
        isTaskAccess: newMember.isTaskAccess,
      });
      const data: APIResponse<User> = response.data;

      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === editedUser._id ? data.user : user
          )
        );
        setIsModalOpen(false);
        setErrorMessage("");
        setNewMember({
          email: "",
          role: "member",
          password: "",
          firstName: "",
          lastName: "",
          whatsappNo: "",
          reportingManager: '',
          country: 'IN',
          isTaskAccess: false,
          isLeaveAccess: false,
        });
        setSelectedManager("");
        setIsSubmitted(false);
        setErrors({
          email: "",
          firstName: "",
          lastName: "",
          whatsappNo: "",
          password: "",
        });

        toast(<div className="w-full mb-6 gap-2 m-auto">
          <div className="w-full flex justify-center">
            <DotLottieReact
              src="/lottie/tick.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-black text-center font-medium text-lg">New Member added successfully</h1>
        </div>);
        fetchUsers();
      }
    } catch (error: any) {
      console.error("Error creating user:", error);

      if (error.response && error.response.data && error.response.data.error) {
        const msg = error.response.data.error;
        if (msg === "User limit reached for the current plan.") {
          toast(<div className="w-full mb-6 gap-2 m-auto">
            <div className="w-full flex justify-center">
              <DotLottieReact
                src="/lottie/error.lottie"
                loop
                autoplay
              />
            </div>
            <h1 className="text-black text-center font-medium text-lg">You have reached the maximum number of members for your current plan</h1>
          </div>);
          setErrorMessage("You have reached the maximum number of members for your current plan.");
        } else if (msg === "A user with this email already exists.") {
          toast(<div className="w-full mb-6 gap-2 m-auto">
            <div className="w-full flex justify-center">
              <DotLottieReact
                src="/lottie/error.lottie"
                loop
                autoplay
              />
            </div>
            <h1 className="text-black text-center font-medium text-lg">An user with this email already exists</h1>
          </div>);
          setErrorMessage("Email already exists")
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const clearFields = () => {
    setIsModalOpen(false);
    setNewMember({
      email: "",
      role: "member",
      password: "",
      firstName: "",
      lastName: "",
      whatsappNo: "",
      reportingManager: '',
      country: 'IN',
      isLeaveAccess: false,
      isTaskAccess: false,
    });
    setSelectedManager("");
  };

  const handleEditUser = async () => {
    setLoading(true);
    try {
      const updatedUser = {
        ...editedUser,
        reportingManager:
          updateModalReportingManager || editedUser.reportingManager,
        isLeaveAccess: editedUser.isLeaveAccess,
        isTaskAccess: editedUser.isTaskAccess,
      };

      const response = await fetch(`/api/users/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      const data: APIResponse<User> = await response.json();

      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === editedUser._id ? data.user : user
          )
        );

        const updatedManager = users.find(
          (user) => user._id === updatedUser.reportingManager
        );
        if (updatedManager) {
          setReportingManagerNames((prev) => ({
            ...prev,
            [data.user._id]: `${updatedManager.firstName} `,
          }));
        }
        toast(<div className="w-full mb-6 gap-2 m-auto">
          <div className="w-full flex justify-center">
            <DotLottieReact
              src="/lottie/tick.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-black text-center font-medium text-lg">User updated successfully</h1>
        </div>);

        setLoading(false);
        setIsEditModalOpen(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error editing user:", error);
      alert("Error editing user. Please try again.");
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIdToDelete: selectedUser._id }),
      });

      const data: APIResponse<void> = await response.json();

      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== selectedUser._id)
        );
        setSelectedUser(null);
        toast.success("Deleted user successfully");
      } else {
        toast.error(data.error || "Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user. Please try again.");
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (user: User) => {
    if (user._id === currentUser?._id) {
      toast(<div className="w-full mb-6 gap-2 m-auto">
        <div className="w-full flex justify-center">
          <DotLottieReact
            src="/lottie/error.lottie"
            loop
            autoplay
          />
        </div>
        <h1 className="text-black text-center font-medium text-lg">You cannot delete yourself</h1>
      </div>);
      return;
    }
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed header area with controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
        <Tabs3
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList3 className="flex gap-2">
            <TabsTrigger3 value="all">All</TabsTrigger3>
            <TabsTrigger3 value="orgAdmin">Admin</TabsTrigger3>
            <TabsTrigger3 value="manager">Manager</TabsTrigger3>
            <TabsTrigger3 value="member">Team Member</TabsTrigger3>
          </TabsList3>
        </Tabs3>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Select value={selectedReportingManager} onValueChange={handleReportingManagerChange}>
            <SelectTrigger className="h-9 md:w-[200px]">
              <SelectValue placeholder="Reporting Manager" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select Reporting Manager</SelectItem>
              {users.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1 md:w-auto">
            <FaSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search team members..."
              className="pl-8 h-9 min-w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loggedInUserRole === "orgAdmin" && (
            <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
              setIsModalOpen(isOpen);
              if (!isOpen) {
                setNewMember({
                  email: "",
                  role: "member",
                  password: "",
                  firstName: "",
                  lastName: "",
                  whatsappNo: "",
                  reportingManager: "",
                  country: "IN",
                  isTaskAccess: false,
                  isLeaveAccess: false,
                });
                setSelectedManager("");
                setIsSubmitted(false);
                setErrors({
                  email: "",
                  firstName: "",
                  lastName: "",
                  whatsappNo: "",
                  password: "",
                });
                setErrorMessage("");
              }
            }}>
              <DialogTrigger asChild>
                <Button className="h-9 bg-[#017a5b] hover:bg-[#15624f] border gap-1 flex items-center">
                  <Plus className="h-4 w-4" /> Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="p-6  overflow-y-scroll h-fit max-h-screen m-auto scrollbar-hide">
                <div className="flex justify-between w-full items-center">
                  <DialogTitle>
                    <div className="flex items-center gap-2">
                      <UserCircle className='h-7' />
                      <h1 className="text-md mt-1">
                        Add New Member
                      </h1>
                    </div>
                  </DialogTitle>
                  <DialogClose className="cursor-pointer">
                    <CrossCircledIcon
                      className="scale-150 cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
                    />
                  </DialogClose>
                </div>
                <DialogDescription>
                  Please fill in the details of the new team member.
                </DialogDescription>
                <div className="flex flex-col gap-4 mt-">
                  <Input
                    placeholder="First Name"
                    className={`py-2 px-2 focus-within:border-[#815BF5] text-xs bg-transparent border rounded outline-none ${isSubmitted && !newMember.firstName.trim() ? "border-red-500" : ""
                      }`}
                    value={newMember.firstName}
                    onChange={(e) =>
                      setNewMember({ ...newMember, firstName: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Last Name"
                    className={`py-2 px-2 focus-within:border-[#815BF5] text-xs bg-transparent border rounded outline-none ${isSubmitted && !newMember.lastName.trim() ? "border-red-500" : ""
                      }`}
                    value={newMember.lastName}
                    onChange={(e) =>
                      setNewMember({ ...newMember, lastName: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Email"
                    className={`py-2 px-2 focus-within:border-[#815BF5] text-xs bg-transparent border rounded outline-none ${isSubmitted && !newMember.email.trim() && errors.email ? "border-red-500" : ""
                      }`}
                    value={newMember.email}
                    onChange={(e) => {
                      setNewMember({ ...newMember, email: e.target.value });
                      if (errors.email) {
                        setErrors({ ...errors, email: "" });
                      }
                    }}
                  />
                  {isSubmitted && errors.email && (
                    <p className="text-red-500 text-xs -my-3">{errors.email}</p>
                  )}

                  {errorMessage && (
                    <p className="text-red-500 text-xs ml-1 -my-3">
                      {errorMessage}
                    </p>
                  )}

                  <UserCountry
                    selectedCountry={selectedCountry}
                    onCountrySelect={handleCountrySelect}
                  />
                  <div className="flex items-center">
                    <span className="py-2 px-2 bg-transparent border rounded-l text-xs">{countryCode}</span>
                    <Input
                      placeholder="WhatsApp Number"
                      value={newMember.whatsappNo}
                      className={`py-2 px-2 w-full focus-within:border-[#815BF5] text-xs bg-transparent border rounded outline-none ${isSubmitted && !newMember.whatsappNo.trim() ? "border-red-500" : ""
                        }`}
                      onChange={(e) => setNewMember({ ...newMember, whatsappNo: e.target.value })}
                    />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    className={`py-2 px-2 focus-within:border-[#815BF5] text-xs bg-transparent border rounded outline-none ${isSubmitted && !newMember.password.trim() ? "border-red-500" : ""
                      }`}
                    value={newMember.password}
                    onChange={(e) =>
                      setNewMember({ ...newMember, password: e.target.value })
                    }
                  />
                  <Select
                    value={newMember.role}
                    onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                  >
                    <SelectTrigger className="text-xs py-2 h-auto">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      <SelectItem value="member">Team Member</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      {loggedInUserRole === "orgAdmin" && (
                        <SelectItem value="orgAdmin">Admin</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <div>
                    {newMember.role !== "orgAdmin" && (
                      <Select
                        value={selectedManager}
                        onValueChange={setSelectedManager}
                      >
                        <SelectTrigger className="text-xs py-2 h-auto">
                          <SelectValue placeholder="Select Reporting Manager" />
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                          <SelectItem value="None">Select Reporting Manager</SelectItem>
                          {users.map((user) => (
                            <SelectItem key={user._id} value={user._id}>
                              {user.firstName} {user.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="justify-between p-2 w-full">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <img src="/branding/teamsicon.png" className="h-5 dark:block hidden" />
                        <img src="/branding/teamstext.png" className="h-4 mt-1 dark:block hidden" />
                        <img src="/branding/teams-light.png" className="h-5 dark:hidden block" />
                      </div>
                      <Switch
                        checked={newMember.isTaskAccess}
                        onCheckedChange={(checked) =>
                          setNewMember((prev) => ({ ...prev, isTaskAccess: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex gap-2 items-center">
                        <img src="/branding/payrollicon.png" className="h-5 dark:block hidden" />
                        <img src="/branding/payrolltext.png" className="h-4 mt-1 dark:block hidden" />
                        <img src="/branding/payroll-light.png" className="h-5 dark:hidden block" />
                      </div>
                      <Switch
                        checked={newMember.isLeaveAccess}
                        onCheckedChange={(checked) =>
                          setNewMember((prev) => ({ ...prev, isLeaveAccess: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-4">
                  <Button
                    variant="outline"
                    className="rounded"
                    onClick={clearFields}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#007A5A] rounded hover:bg-[#007A5A]"
                    onClick={handleCreateUser}
                  >
                    {loading ? (
                      <>
                        <Loader /> Adding Member
                      </>
                    ) : (
                      "Add Member"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="flex justify-start mb-4">
        <div className="flex items-center gap-1 bg-gradient-to-b from-[#815BF5] to-[#FC8929] p-2 rounded-lg">
          <Users2Icon className="h-4 text-white" />
          <h1 className="text-sm text-white">{filteredUsers.length} Members</h1>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto  pr-2">
        {isLoading ? (
          // Skeleton loading state
          <div className="space-y-3">
            {Array(5).fill(0).map((_, index) => (
              <div key={`skeleton-${index}`} className="flex rounded-xl border p-4 gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <div className="flex gap-8">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 h-fit max-h-screen pb-96 overflow-y-scroll scrollbar-hide pb- ">
            {filteredUsers
              .filter((user) => {
                if (activeTab === "all") return true;
                return user.role.toLowerCase().includes(activeTab.toLowerCase());
              })
              .map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="flex rounded-xl hover:border-[#815bf5] border cursor-pointer p-4 transition-all hover:shadow-sm"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      {user.profilePic ? (
                        <AvatarImage src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} />
                      ) : (
                        <AvatarFallback className="bg-[#815BF5] text-white">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex-1">
                      <p className="font-medium text-base">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" /> {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" /> {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaWhatsapp className="h-3.5 w-3.5 text-green-500" /> {user.whatsappNo}
                        </span>
                        {reportingManagerNames[user._id] && (
                          <span className="flex items-center gap-1">
                            <UserCircle className="h-3.5 w-3.5" /> {reportingManagerNames[user._id]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {user.isTaskAccess && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                          Tasks
                        </Badge>
                      )}
                      {user.isLeaveAccess && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                          Payroll
                        </Badge>
                      )}
                    </div>

                    <div
                      className={`px-3 py-1 text-white rounded text-xs ${
                        user.role === "orgAdmin"
                          ? "bg-[#B4173B]"
                          : user.role === "manager"
                            ? "bg-blue-600"
                            : user.role === "member"
                              ? "bg-[#007A5A]"
                              : "bg-gray-500"
                      }`}
                    >
                      {user.role === "orgAdmin"
                        ? "Admin"
                        : user.role === "member"
                          ? "Member"
                          : user.role === "manager"
                            ? "Manager"
                            : user.role}
                    </div>

                    {loggedInUserRole === "orgAdmin" && (
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditedUser({
                                    _id: user._id,
                                    email: user.email,
                                    role: user.role,
                                    password: "",
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    whatsappNo: user.whatsappNo,
                                    country: user?.country || "IN",
                                    reportingManager: user.reportingManager,
                                    profilePic: user.profilePic,
                                    isLeaveAccess: user.isLeaveAccess,
                                    isTaskAccess: user.isTaskAccess,
                                  });
                                  setUpdateModalReportingManager(user.reportingManager);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <Pencil className="h-5 text-blue-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit user</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteDialog(user);
                                }}
                                disabled={user._id === currentUser?._id}
                              >
                                <Trash2 className="text-[#9C2121] h-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {user._id === currentUser?._id ? "Cannot delete yourself" : "Delete user"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`https://wa.me/${user.whatsappNo}`}
                                onClick={(e) => e.stopPropagation()}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 p-0"
                                >
                                  <FaTelegramPlane className="h-5 dark:text-muted-foreground text-[#017a5b] cursor-pointer" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>Send Message</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                </div>
              ))}

            {filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center p-10 text-center bg-muted/30 rounded-lg border">
                <Users className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No team members found</h3>
                <p className="text-muted-foreground mb-5 max-w-md">
                  {activeTab !== "all"
                    ? `No members with ${activeTab === "orgAdmin" ? "admin" : activeTab} role found.`
                    : searchQuery
                      ? "No members match your search criteria."
                      : "Start building your team by adding members."}
                </p>
                {loggedInUserRole === "orgAdmin" && (
                  <Button
                    className="bg-[#017a5b] hover:bg-[#15624f] gap-1"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus className="h-4 w-4" /> Add Member
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="p-6 m-auto h-fit max-h-screen overflow-y-scroll scrollbar-hide">
          <div className="flex justify-between w-full items-center">
            <DialogTitle>
              <div className="flex items-center gap-2">
                <UserCircle className='h-7' />
                <h1 className="text-md mt-1">
                  Edit Member
                </h1>
              </div>
            </DialogTitle>
            <DialogClose className="cursor-pointer">
              <CrossCircledIcon
                className="scale-150 cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
              />
            </DialogClose>
          </div>
          <DialogDescription>
            Modify the details of the selected user.
          </DialogDescription>
          <div className="flex flex-col gap-4 mt-4">
            <Input
              placeholder="First Name"
              value={editedUser.firstName}
              className="py-2 px-2 focus-within:border-[#815BF5] text-xs bg-transparent border rounded outline-none"
              onChange={(e) =>
                setEditedUser({ ...editedUser, firstName: e.target.value })
              }
            />
            <Input
              placeholder="Last Name"
              value={editedUser.lastName}
              className="py-2 px-2 focus-within:border-[#815BF5] text-xs bg-transparent border rounded outline-none"
              onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={editedUser.email}
              className="py-2 px-2 focus-within:border-[#815BF5] text-xs bg-transparent border rounded outline-none"
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password (leave empty to keep unchanged)"
              value={editedUser.password}
              className="py-2 px-2 focus-within:border-[#815BF5] text-xs bg-transparent border rounded outline-none"
              onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
            />
            <Select
              value={editedUser.role}
              onValueChange={(value) => setEditedUser({ ...editedUser, role: value })}
            >
              <SelectTrigger className="text-xs py-2 h-auto bg-transparent">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="member">Team Member</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                {loggedInUserRole === "orgAdmin" && (
                  <SelectItem value="orgAdmin">Admin</SelectItem>
                )}
              </SelectContent>
            </Select>
            <Select
              value={updateModalReportingManager || ""}
              onValueChange={setUpdateModalReportingManager}
            >
              <SelectTrigger className="text-xs py-2 h-auto bg-transparent">
                <SelectValue placeholder="Select Reporting Manager" />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="NONE">Select Reporting Manager</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.firstName} {user.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <UserCountry
              selectedCountry={selectedCountry}
              onCountrySelect={handleCountrySelect}
            />
            <div className="flex items-center">
              <span className="py-2 px-2 bg-transparent border rounded-l text-xs">{countryCode}</span>
              <Input
                placeholder="WhatsApp Number"
                value={editedUser.whatsappNo}
                className="py-2 px-2 w-full focus-within:border-[#815BF5] text-xs bg-transparent border rounded-r outline-none"
                onChange={(e) => setEditedUser({ ...editedUser, whatsappNo: e.target.value })}
              />
            </div>
            <div className="justify-between p-2 w-full">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <img src="/branding/teamsicon.png" className="h-5 dark:block hidden" />
                  <img src="/branding/teamstext.png" className="h-4 mt-1 dark:block hidden" />
                  <img src="/branding/teams-light.png" className="h-5 dark:hidden block" />
                </div>
                <Switch
                  checked={editedUser.isTaskAccess}
                  onCheckedChange={(checked) =>
                    setEditedUser((prev) => ({ ...prev, isTaskAccess: checked }))
                  }
                />
              </div>
              <div className="flex justify-between mt-6">
                <div className="flex gap-2 items-center">
                  <img src="/branding/payrollicon.png" className="h-5 dark:block hidden" />
                  <img src="/branding/payrolltext.png" className="h-4 mt-1 dark:block hidden" />
                  <img src="/branding/payroll-light.png" className="h-5 dark:hidden block" />
                </div>
                <Switch
                  checked={editedUser.isLeaveAccess}
                  onCheckedChange={(checked) =>
                    setEditedUser((prev) => ({ ...prev, isLeaveAccess: checked }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <Button
              variant="outline"
              className="rounded"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-[#007A5A] hover:bg-[#007A5A] rounded"
              onClick={handleEditUser}
            >
              {loading ? (
                <>
                  <Loader />
                  Saving Changes
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      {selectedUser && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteUser}
          title="Delete User"
          description={`Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.lastName}? This action cannot be undone.`}
        />
      )}
    </div>
  );
}
