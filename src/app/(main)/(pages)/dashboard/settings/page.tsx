"use client";

import CustomTimePicker from "@/components/globals/time-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { CrossCircledIcon, StopwatchIcon } from "@radix-ui/react-icons";
import axios from "axios";
import {
  ChevronRight,
  Mail,
  Phone,
  PhoneCallIcon,
  Plus,
  PlusCircle,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface Category {
  _id: string;
  name: string;
  organization: string;
}

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const router = useRouter();
  const [firstName, setFirstName] = useState("User");
  const [organizationName, setOrganizationName] = useState("");
  const [description, setDescription] = useState("");
  const [lastName, setLastName] = useState("User");
  const [role, setRole] = useState("role");
  const [email, setEmail] = useState("email");
  const [whatsappNo, setWhatsAppNo] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [whatsappReminders, setWhatsappReminders] = useState(false);
  const [emailReminders, setEmailReminders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dueTime, setDueTime] = useState<string>("09:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [wabaOpen, setWabaOpen] = useState(false);


  useEffect(() => {
    // Fetch categories from the server
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category/get");
        const result = await response.json();
        if (response.ok) {
          setCategories(result.data);
        } else {
          console.error("Error fetching categories:", result.error);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);



  console.log(emailNotifications, whatsappNotifications, 'true fal')

  const handleCreateCategory = async () => {
    if (!newCategory) return;
    try {
      const response = await fetch("/api/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });

      const result = await response.json();

      if (response.ok) {
        // Add the new category to the categories list
        setCategories([...categories, result.data]);
        // Clear the new category input
        setNewCategory("");
      } else {
        console.error("Error creating category:", result.error);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  useEffect(() => {
    const getOrganizationDetails = async () => {
      const res = await axios.get("/api/organization/getById");
      const org = res.data.data;
      setOrganizationName(org.companyName);
      setDescription(org.description);
      setIndustry(org.industry);
      setTeamSize(org.teamSize);
    };
    getOrganizationDetails();
  }, []);

  const handleUpdateOrganization = async () => {
    try {
      setLoading(true);
      const response = await axios.patch("/api/organization/update", {
        companyName: organizationName,
        description,
        industry,
        teamSize,
      });

      if (response.status === 200) {
        toast.success("Organization updated successfully");
        setLoading(false);
      } else {
        alert("Failed to update organization");
      }
    } catch (error) {
      console.error("Error updating organization:", error);
      alert("An error occurred while updating the organization");
    }
  };

  const formatTimeToAMPM = (timeString: string | null): string => {
    if (!timeString) return ""; // Return an empty string if no time is selected

    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  // Function to convert time to "HH:mm" format
  const parseTimeTo24HourFormat = (timeStr: string): string => {
    const date = new Date(`1970-01-01T${timeStr}`);
    if (isNaN(date.getTime())) {
      // If invalid, try parsing with AM/PM
      const dateWithAmPm = new Date(`1970-01-01 ${timeStr}`);
      if (isNaN(dateWithAmPm.getTime())) {
        return "09:00"; // Default time if parsing fails
      }
      return dateWithAmPm.toTimeString().slice(0, 5);
    }
    return date.toTimeString().slice(0, 5);
  };

  useEffect(() => {
    const getUserDetails = async () => {
      const res = await axios.get("/api/users/me");
      const user = res.data.data;
      console.log(user, ' user for notif')
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setLoading(true);
      setRole(user.role);
      setLoading(false);
      // Initialize notification states from API response
      setEmailNotifications(user.notifications?.email ?? false);
      setEmailReminders(user.reminders?.email ?? false);
      setWhatsappNotifications(user.notifications?.whatsapp ?? false);
      setWhatsappReminders(user.reminders?.whatsapp ?? false);


      setSelectedDays(user.weeklyOffs || []);
      setEmail(user.email);
      setWhatsAppNo(user.whatsappNo);

      // Daily Reminder Time
      if (user.reminders?.dailyReminderTime) {
        const timeFromApi = user.reminders.dailyReminderTime;
        const parsedTime = parseTimeTo24HourFormat(timeFromApi);
        setDueTime(parsedTime);
      }

      const trialStatusRes = await axios.get("/api/organization/trial-status");
      setIsTrialExpired(trialStatusRes.data.isExpired);
    };
    getUserDetails();
  }, []);

  if (isTrialExpired) {
    return (
      <div className="p-4 text-center mt-32">
        <h1 className="text-xl font-bold text-red-500">
          Your trial has expired!
        </h1>
        <p>
          Please purchase a subscription to continue using the Task Management
          features.
        </p>
        <Link href="/dashboard/billing">
          <Button className="h-10 bg-white text-black hover:text-white mt-4 text-lg ">
            👑 Upgrade to Pro
          </Button>
        </Link>
      </div>
    );
  }

  const updateSettings = async () => {
    try {
      await axios.patch("/api/users/update-notifications", {
        email: emailNotifications,
        whatsapp: whatsappNotifications,
      });
      updateReminders();
      toast.success("Settings updated");
      setSettingsOpen(false);
    } catch (error) {
      console.error("Failed to update settings", error);
      alert("Failed to update settings");
    }
  };

  const updateReminders = async () => {
    try {
      await axios.patch("/api/users/update-reminders", {
        reminders: {
          dailyReminderTime: dueTime,
          email: emailReminders,
          whatsapp: whatsappReminders,
        },
        weeklyOffs: selectedDays,
      });
      // toast.success("Settings updated");
      setSettingsOpen(false);
    } catch (error) {
      console.error("Failed to update settings", error);
      alert("Failed to update settings");
    }
  };


  const handleCheckboxChange = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-4  h-fit max-h-screen  scrollbar-hide overflow-y-scroll ">
      {/* <Toaster /> */}

      {role === "orgAdmin" && (
        <div>
          {loading ? <Loader /> : ""}
          <div className=" mt-2 bg- p-2 px-4 border bg-[#0A0D28] text-lg rounded-xl ">
            <h1 className="text-sm text-muted-foreground">Organization Details</h1>
          </div>
          <div className=" text-xs grid grid-cols-1 text- p-2 gap-2 py-2">
            <div className="grid-cols-2 grid gap-2 p-2">
              <div className="space-y-8 mt-2">
                <h1 className="">Company Name</h1>
                <h1 className="">Industry</h1>
                <h1 className="">Company Description</h1>
                <h1 className="">Team Size</h1>
              </div>
              <div className="">
                <div>
                  <input
                    type="text"
                    className="px-4 py-2 w-full bg-[#0B0D29] focus-within:border-[#815BF5]  border rounded outline-none"
                    value={organizationName}
                    onChange={(e: any) => setOrganizationName(e.target.value)}
                  />
                </div>
                <div>
                  <select
                    value={industry}
                    onChange={(e: any) => setIndustry(e.target.value)}
                    className="w- mt-2 w-full outline-none bg-[#0B0D29] border rounded px-3 py-2"
                  >
                    <option value="" disabled>
                      Select Industry
                    </option>
                    <option value="Retail">Retail</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <textarea
                    className="px-4 py-2 mt-2 w-full bg-[#0B0D29] focus-within:border-[#815BF5]  border rounded outline-none"
                    value={description}
                    onChange={(e: any) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <select
                    value={teamSize}
                    onChange={(e: any) => setTeamSize(e.target.value)}
                    className="mt-2 border bg-[#0B0D29] outline-none w-full  rounded px-3 py-2"
                  >
                    <option value="" disabled>
                      Select Team Size
                    </option>
                    <option value="1-5">1-5</option>
                    <option value="5-10">5-10</option>
                    <option value="10-15">10-15</option>
                    <option value="15-20">15-20</option>
                    <option value="20-25">20-25</option>
                    <option value="25+">25+</option>
                  </select>
                </div>
              </div>
              <div className="mt-2">
                <button
                  onClick={handleUpdateOrganization}
                  className="mt-4 px-4 py-2 ml-auto bg-[#007A5A] hover:bg-[#0c4f3e] text-white rounded"
                >
                  {loading ? <Loader /> : "Update Organization "}
                </button>
              </div>
            </div>

            <div className="flex gap-2"></div>
            <div className="flex gap-2"></div>
          </div>
        </div>
      )}
      {role === "orgAdmin" && (
        <div>
          <div className=" mt-4 bg-[#0A0D28] p-2 px-4 border rounded-xl ">
            <h1 className="text-sm text-muted-foreground">WhatsApp Integration</h1>
          </div>
          <div onClick={() => setWabaOpen(true)} className="mb-2  mt-2 flex   px-4 py-4  ' cursor-pointer ' underline-offset-4  m border-b w-full  ">
            <h1 className=" text-xs text-start w-full">Connect your WABA Number</h1>
            <ChevronRight className="h-4" />
          </div>
        </div>
      )}
      <div className=" mt-6 bg-[#0A0D28] p-2 px-4 border rounded-xl ">
        <h1 className="text-sm text-muted-foreground">Task App Settings</h1>
      </div>
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogTrigger className="w-full  items-center mt-2  flex justify-">
          <div className="mb-2  px-4 ' ' underline-offset-4 py-4  m border-b w-full  ">
            <h1 className=" text-xs text-start w-full">Notifications & Reminders</h1>
          </div>
          <ChevronRight className="h-4 -ml-10" />
        </DialogTrigger>

        <DialogContent className=" z-[100] flex items-center justify-center">
          <div className="bg-[#0b0d29] z-[100] overflow-y-scroll scrollbar-hide h-fit max-h-[600px]  shadow-lg w-full   max-w-lg  rounded-lg">
            <div className="flex border-b py-2  w-full justify-between">
              <DialogTitle className="text-md   px-6 py-2 font-medium">
                Notifications
              </DialogTitle>
              <DialogClose className="px-6 py-2">
                <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
              </DialogClose>
            </div>
            <div className="space-y-4 p-6">
              {/* Email Notification */}

              <div className="mb-4 flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  Email Notifications
                </span>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(checked) =>
                    setEmailNotifications(checked)
                  }
                  className="form-checkbox text-white"
                />
              </div>

              {/* WhatsApp Notification */}

              <div className="mb-4 flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  WhatsApp Notifications
                </span>
                <Switch
                  checked={whatsappNotifications}
                  onCheckedChange={(checked) =>
                    setWhatsappNotifications(checked)
                  }
                  className="form-checkbox text-white"
                />
              </div>

              <Separator className="my-4" />

              <h1 className="text-xl font-bold mb-4 mt-2 text-gray-800 dark:text-white">
                Reminders
              </h1>

              {/* Daily Remainder Time */}

              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-gray-700 dark:text-gray-300">
                    Daily Reminder Time
                  </h1>
                  {dueTime ? (
                    <h1 className="text-xs mt-1 text-gray-800 dark:text-white">
                      {formatTimeToAMPM(dueTime)}
                    </h1>
                  ) : (
                    <h1 className="text-xs  mt-1 text-gray-800 dark:text-white">
                      Please Select Time
                    </h1>
                  )}
                </div>

                <Dialog
                  open={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                >
                  <DialogTrigger>
                    <Avatar
                      className="bg-[#815BF5] h-10 w-10 -mt-1 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <StopwatchIcon className="h-6 w-6 text-white" />
                    </Avatar>
                  </DialogTrigger>

                  {/* Time Picker Module */}
                  <DialogContent className="scale-75 p-6 ">


                    <CustomTimePicker
                      onCancel={() => setIsDialogOpen(false)}
                      onAccept={() => setIsDialogOpen(false)}
                      onBackToDatePicker={() => setIsDialogOpen(false)}
                      onTimeChange={setDueTime}
                      selectedTime={dueTime}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mb-4 mt-2 flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  Email Reminders
                </span>
                <Switch
                  checked={emailReminders}
                  onCheckedChange={(checked) => setEmailReminders(checked)}
                  className="form-checkbox text-white"
                />
              </div>

              <div className="mb-4 mt-2 flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  WhatsApp Reminders
                </span>
                <Switch
                  checked={whatsappReminders}
                  onCheckedChange={(checked) => setWhatsappReminders(checked)}
                  className="form-checkbox text-white"
                />
              </div>

              <Separator className="my-4" />

              <div className="mt-2">
                <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                  Weekly Offs
                </h1>
                <div className="grid grid-cols-7 py-4 gap-4">
                  {daysOfWeek.map((day) => (
                    <label
                      key={day}
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day)}
                        onChange={() => handleCheckboxChange(day)}
                        className="mr-2 mt-1"
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              {/* Save Setting button */}
              <div className="flex justify-center">
                <button
                  onClick={updateSettings}
                  className="bg-[#815BF5] w-full text-sm cursor-pointer  text-white px-4 mt-6  py-2 rounded"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={wabaOpen} onOpenChange={setWabaOpen}>
        <DialogContent className=" z-[100] flex items-center bg-[#0b0d29] h-[240px] justify-center">
          <div className="  overflow-y-scroll scrollbar-hide h-full  shadow-lg w-full   max-w-lg  rounded-lg">
            <div className="flex border-b py-2  w-full justify-between">
              <DialogTitle className="text-md   px-6 py-2 font-medium">
                WhatsApp API Connection
              </DialogTitle>
              <DialogClose className="px-6 py-2">
                <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
              </DialogClose>

            </div>
            <div className="relative mt-2 p-6 ">
              <label className="absolute bg-[#0b0d29] ml-2 text-xs text-[#787CA5] -mt-2 px-1">
                WA Channel ID
              </label>
              <input type="text"
                className="w-full text-sm focus-within:border-[#815BF5] p-2 border bg-transparent outline-none rounded" />
              <span className=" text-xs px-2">Get Your Channel ID From here -
                <a className="text-blue-400 '" href="http://waba.zapllo.com">http://waba.zapllo.com/</a>
              </span>
              <Button className="bg-[#815BF5] w-full text-sm cursor-pointer  text-white px-4 mt-6  py-2 rounded">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="mb-24   px-4 ' cursor-pointer ' underline-offset-4  m border-b w-full  py-2">
        <h1 className=" text-xs text-start w-full">Export Tasks (Coming Soon)</h1>
      </div>

      {/* 
            <div className='px-4 py-2 cursor-pointer border mt-4 rounded'>
                <h1>Logout</h1>
            </div> */}
    </div >
  );
}
