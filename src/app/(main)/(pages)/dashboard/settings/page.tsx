"use client";

import CustomTimePicker from "@/components/globals/time-picker";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CrossCircledIcon, StopwatchIcon } from "@radix-ui/react-icons";
import axios from "axios";
import {
  AlertCircle,
  Bell,
  Building,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  HelpCircle,
  InfoIcon,
  Mail,
  MessageSquare,
  Save,
  Settings,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  organization: string;
}

export default function Page() {
  // State variables remain unchanged
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
  const [channelId, setChannelId] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
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
        setCategories([...categories, result.data]);
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
        toast.error("Failed to update organization");
      }
    } catch (error) {
      console.error("Error updating organization:", error);
      toast.error("An error occurred while updating the organization");
    }
  };

  const formatTimeToAMPM = (timeString: string | null): string => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const parseTimeTo24HourFormat = (timeStr: string): string => {
    const date = new Date(`1970-01-01T${timeStr}`);
    if (isNaN(date.getTime())) {
      const dateWithAmPm = new Date(`1970-01-01 ${timeStr}`);
      if (isNaN(dateWithAmPm.getTime())) {
        return "09:00";
      }
      return dateWithAmPm.toTimeString().slice(0, 5);
    }
    return date.toTimeString().slice(0, 5);
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get("/api/users/me");
        const user = res.data.data;
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setRole(user.role);
        setEmailNotifications(user.notifications?.email ?? false);
        setEmailReminders(user.reminders?.email ?? false);
        setWhatsappNotifications(user.notifications?.whatsapp ?? false);
        setWhatsappReminders(user.reminders?.whatsapp ?? false);
        setSelectedDays(user.weeklyOffs || []);
        setEmail(user.email);
        setWhatsAppNo(user.whatsappNo);

        if (user.reminders?.dailyReminderTime) {
          const timeFromApi = user.reminders.dailyReminderTime;
          const parsedTime = parseTimeTo24HourFormat(timeFromApi);
          setDueTime(parsedTime);
        }

        const trialStatusRes = await axios.get("/api/organization/trial-status");
        setIsTrialExpired(trialStatusRes.data.isExpired);
        setPageLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setPageLoading(false);
      }
    };
    getUserDetails();
  }, []);

  const updateSettings = async () => {
    try {
      setLoading(true);
      await axios.patch("/api/users/update-notifications", {
        email: emailNotifications,
        whatsapp: whatsappNotifications,
      });
      await updateReminders();
      toast.success("Settings updated successfully", {
        description: "Your notification preferences have been saved."
      });
      setSettingsOpen(false);
      setLoading(false);
    } catch (error) {
      console.error("Failed to update settings", error);
      toast.error("Failed to update settings", {
        description: "Please try again or contact support."
      });
      setLoading(false);
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
    } catch (error) {
      console.error("Failed to update reminders", error);
      throw error;
    }
  };

  const handleCheckboxChange = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const saveWhatsAppConnection = async () => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("WhatsApp connection saved", {
        description: "Your WhatsApp Business Account is now connected."
      });
      setWabaOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to save WhatsApp connection", {
        description: "Please verify your Channel ID and try again."
      });
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader />
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and organization settings
          </p>
          <Separator className="my-6" />
        </div>

        {/* Main content */}
        <div className="space-y-10">
          {/* Organization Profile Section */}
          {role === "orgAdmin" && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Building className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold tracking-tight">Organization Profile</h2>
              </div>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>
                    Update your organization details and business profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="companyName" className="text-sm font-medium">
                          Company Name
                        </label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-80">
                                Your company name will appear on all communications and documents.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="companyName"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="Enter your company name"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="industry" className="text-sm font-medium">
                          Industry
                        </label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-80">
                                Selecting your industry helps us tailor the experience to your needs.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select
                        value={industry}
                        onValueChange={(value) => setIndustry(value)}
                      >
                        <SelectTrigger id="industry">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                          <SelectItem value="Retail/E-Commerce">Retail/E-Commerce</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Service Provider">Service Provider</SelectItem>
                          <SelectItem value="Healthcare(Doctors/Clinics/Physicians/Hospital)">
                            Healthcare
                          </SelectItem>
                          <SelectItem value="Logistics">Logistics</SelectItem>
                          <SelectItem value="Financial Consultants">Financial Consultants</SelectItem>
                          <SelectItem value="Trading">Trading</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Real Estate/Construction/Interior/Architects">
                            Real Estate/Construction
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="description" className="text-sm font-medium">
                        Company Description
                      </label>
                      <span className="text-xs text-muted-foreground">
                        {description.length}/500 characters
                      </span>
                    </div>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly describe what your company does"
                      rows={3}
                      maxLength={500}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="teamSize" className="text-sm font-medium">
                        Team Size
                      </label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-80">
                              This helps us understand your organization&apos;s scale and requirements.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select
                      value={teamSize}
                      onValueChange={(value) => setTeamSize(value)}
                    >
                      <SelectTrigger id="teamSize">
                        <SelectValue placeholder="Select your team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-20">11-20 employees</SelectItem>
                        <SelectItem value="21-30">21-30 employees</SelectItem>
                        <SelectItem value="31-50">31-50 employees</SelectItem>
                        <SelectItem value="51+">51+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                  {isTrialExpired && (
                    <div className="mr-auto flex items-center text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>Your trial has expired</span>
                    </div>
                  )}
                  <Button
                    onClick={handleUpdateOrganization}
                    disabled={loading}
                  >
                    {loading ? <Loader /> : <Save className="mr-2 h-4 w-4" />}
                    <span>Update Organization</span>
                  </Button>
                </CardFooter>
              </Card>
            </section>
          )}

          {/* WhatsApp Integration Section */}
          {role === "orgAdmin" && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold tracking-tight">Messaging Integration</h2>
              </div>

              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>WhatsApp Business Integration</CardTitle>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      Recommended
                    </Badge>
                  </div>
                  <CardDescription>
                    Connect your WhatsApp Business Account to enable automated messaging features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/40 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <InfoIcon className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm">Why connect WhatsApp?</h4>
                        <p className="text-sm text-muted-foreground">
                          Integrating with WhatsApp allows you to send automated task reminders, notifications,
                          and updates directly to your team members&apos; WhatsApp accounts, improving response times
                          and productivity.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Dialog open={wabaOpen} onOpenChange={setWabaOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <Smartphone className="h-4 w-4 mr-2" />
                            <span>Connect WhatsApp Business Account</span>
                          </div>
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="p-6">
                      <DialogHeader>
                        <DialogTitle>WhatsApp Business API Connection</DialogTitle>
                        <DialogDescription>
                          Enter your WhatsApp Business API credentials to enable integration
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="waChannelId" className="text-sm font-medium flex items-center">
                            WhatsApp Channel ID
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-80">
                                    You can find your Channel ID in the WhatsApp Business API dashboard.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </label>
                          <Input
                            id="waChannelId"
                            value={channelId}
                            onChange={(e) => setChannelId(e.target.value)}
                            placeholder="Enter your WhatsApp channel ID"
                          />
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <ExternalLink className="h-4 w-4 text-primary" />
                          <a
                            href="http://waba.zapllo.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Get your Channel ID from waba.zapllo.com
                          </a>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          onClick={saveWhatsAppConnection}
                          disabled={!channelId.trim() || loading}
                        >
                          {loading ? <Loader /> : <Save className="mr-2 h-4 w-4" />}
                          Save Connection
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Notifications & Reminders Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Bell className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold tracking-tight">Notifications & Reminders</h2>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive updates, alerts, and reminders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Current Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Email Notifications</span>
                        </div>
                        <Badge className="bg-primary text-white" >
                          {emailNotifications ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">WhatsApp Notifications</span>
                        </div>
                        <Badge className="bg-primary text-white" >
                          {whatsappNotifications ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Daily Reminder Time</span>
                        </div>
                        <Badge variant="secondary">
                          {dueTime ? formatTimeToAMPM(dueTime) : "Not set"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="bg-muted/40 rounded-lg p-4 mb-auto">
                      <div className="flex items-start">
                        <InfoIcon className="h-5 w-5 mr-3 text-primary mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm">About Notifications</h4>
                          <p className="text-sm text-muted-foreground">
                            Customize how you receive task updates, reminders, and team communications.
                            You can set daily reminder times and choose which days to exclude.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                      <DialogTrigger asChild>
                        <Button className="mt-4">
                          <Settings className="mr-2 h-4 w-4" />
                          Customize Notification Settings
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="h-fit scrollbar-hide max-h-screen m-auto p-6 overflow-y-auto">
                        <div className="flex items-center justify-between ">
                          <DialogHeader>
                            <DialogTitle>Notification & Reminder Settings</DialogTitle>
                            <DialogDescription>
                              Tailor your communication preferences to stay informed and productive
                            </DialogDescription>
                          </DialogHeader>
                          <DialogClose>
                            <CrossCircledIcon className="scale-150 -mt-8 cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                          </DialogClose>
                        </div>
                        <div className="space-y-6 py-4">
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium text-primary">Notification Channels</h3>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                              <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">Email Notifications</p>
                                  <p className="text-xs text-muted-foreground">
                                    Receive task updates, assignments and system notifications via email
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={emailNotifications}
                                onCheckedChange={setEmailNotifications}
                              />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                              <div className="flex items-center gap-3">
                                <Smartphone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">WhatsApp Notifications</p>
                                  <p className="text-xs text-muted-foreground">
                                    Receive instant updates and notifications via WhatsApp
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={whatsappNotifications}
                                onCheckedChange={setWhatsappNotifications}
                              />
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-4">
                            <h3 className="text-sm font-medium text-primary">Reminder Settings</h3>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                              <div className="flex items-center gap-3">
                                <StopwatchIcon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">Daily Reminder Time</p>
                                  <p className="text-xs text-muted-foreground">
                                    Set a time to receive your daily task reminders
                                  </p>
                                </div>
                              </div>
                              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <StopwatchIcon className="mr-2 h-4 w-4" />
                                    {dueTime ? formatTimeToAMPM(dueTime) : "Set Time"}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="p-6 scale-75 bg-[#0a0d28] dark:bg-[#0a0d28]">
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

                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                              <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">Email Reminders</p>
                                  <p className="text-xs text-muted-foreground">
                                    Get task reminders and deadline alerts via email
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={emailReminders}
                                onCheckedChange={setEmailReminders}
                              />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                              <div className="flex items-center gap-3">
                                <Smartphone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm font-medium">WhatsApp Reminders</p>
                                  <p className="text-xs text-muted-foreground">
                                    Get task reminders and deadline alerts via WhatsApp
                                  </p>
                                </div>
                              </div>
                              <Switch
                                checked={whatsappReminders}
                                onCheckedChange={setWhatsappReminders}
                              />
                            </div>
                          </div>

                          <Separator />
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium text-primary">Weekly Schedule</h3>

                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium">Weekly Off Days</p>
                                <p className="text-xs text-muted-foreground mb-3">
                                  Select days when you don&apos;t want to receive reminders
                                </p>
                              </div>
                              <div className="grid grid-cols-7 gap-2">
                                {daysOfWeek.map((day) => (
                                  <div key={day} className="flex flex-col items-center">
                                    <button
                                      type="button"
                                      className={`
                                        w-10 h-10 rounded-full flex items-center justify-center
                                        transition-colors duration-200 cursor-pointer
                                        ${selectedDays.includes(day)
                                          ? 'bg-primary text-primary-foreground'
                                          : 'bg-muted hover:bg-muted/80 text-foreground'}
                                      `}
                                      onClick={() => handleCheckboxChange(day)}
                                      aria-pressed={selectedDays.includes(day)}
                                    >
                                      {day}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setSettingsOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={updateSettings}
                            disabled={loading}
                          >
                            {loading ? <Loader /> : <Save className="mr-2 h-4 w-4" />}
                            Save Settings
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Data Management Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Download className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold tracking-tight">Data Management</h2>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Export & Backup</CardTitle>
                <CardDescription>
                  Export your data for reporting, backup, or analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="bg-muted/40 rounded-lg p-4">
                    <div className="flex items-start">
                      <InfoIcon className="h-5 w-5 mr-3 text-primary mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm">About Data Exports</h4>
                        <p className="text-sm text-muted-foreground">
                          Export your tasks and project data in CSV or Excel format for reporting
                          or backup purposes. This feature will allow you to analyze your team&apos;s
                          performance and track progress over time.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/10">
                    <h3 className="text-sm font-medium mb-4">Available Export Options</h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                        <div className="flex items-center gap-3">
                          <Download className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Export Tasks</span>
                        </div>
                        <Badge variant="outline">Coming Soon</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                        <div className="flex items-center gap-3">
                          <Download className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Export Analytics</span>
                        </div>
                        <Badge variant="outline">Coming Soon</Badge>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-3"
                        disabled
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Data (Coming Soon)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Advanced Settings Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Settings className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold tracking-tight">Advanced Settings</h2>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Additional Preferences</CardTitle>
                <CardDescription>
                  Configure advanced settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">Advanced Configuration Options</h3>
                    <p className="text-sm text-muted-foreground">
                      Additional settings and preferences will be available here in future updates
                    </p>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Footer with support info */}
        <footer className="mt-12 pt-6 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-2">
            <p>Need help with settings? Contact our support team for assistance.</p>
            <Button variant="link" className="h-auto p-0">
              <span className="underline">Contact Support</span>
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
