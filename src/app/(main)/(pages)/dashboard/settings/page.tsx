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

  // All useEffects and function implementations remain unchanged
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
      <div className="container flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader />
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container overflow-y-scroll h-screen p-6 mx-auto scrollbar-hide space-y-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and organization settings
        </p>
      </div>

      {/* Organization Details Section */}
      {role === "orgAdmin" && (
        <section className="space-y-6">
          <div className="flex items-center">
            <Building className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Organization Profile</h2>
          </div>

          <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow duration-200">
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
                    className="transition-all duration-200"
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
                  className="resize-none transition-all duration-200"
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
            <CardFooter className="justify-between border-t pt-6 flex-wrap gap-4">
              <div className="text-sm text-muted-foreground">
                {isTrialExpired ? (
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
                    <span>Your trial has expired</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <InfoIcon className="h-4 w-4 mr-2 text-primary" />
                    <span>Last updated: Today</span>
                  </div>
                )}
              </div>
              <Button
                onClick={handleUpdateOrganization}
                className="relative overflow-hidden group"
                disabled={loading}
              >
                {loading ? (
                  <Loader  />
                ) : (
                  <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                )}
                <span>Update Organization</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Button>
            </CardFooter>
          </Card>
        </section>
      )}

      {/* WhatsApp Integration Section */}
      {role === "orgAdmin" && (
        <section className="space-y-6">
          <div className="flex items-center">
            <MessageSquare className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Messaging Integration</h2>
          </div>

          <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>WhatsApp Business Integration</CardTitle>
                <Badge variant="outline" className="border-green-500 text-green-500">
                  Recommended
                </Badge>
              </div>
              <CardDescription>
                Connect your WhatsApp Business Account to enable automated messaging features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <InfoIcon className="h-5 w-5 mr-2 text-primary mt-0.5" />
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
                  <Button variant="outline" className="w-full sm:w-auto group relative">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                        <span>Connect WhatsApp Business Account</span>
                      </div>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary/50 group-hover:w-full transition-all duration-300"></span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-6">
                  <DialogHeader>
                    <DialogTitle>WhatsApp Business API Connection</DialogTitle>
                    <DialogDescription>
                      Enter your WhatsApp Business API credentials to enable integration
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-4">
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
                          className="transition-all duration-200"
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
                  </div>
                  <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={saveWhatsAppConnection}
                      disabled={!channelId.trim() || loading}
                      className="relative group overflow-hidden"
                    >
                      {loading ? (
                        <Loader />
                      ) : (
                        <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      )}
                      Save Connection
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Notifications & Reminders Section */}
      <section className="space-y-6">
        <div className="flex items-center">
          <Bell className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">Notifications & Reminders</h2>
        </div>

        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Communication Preferences</CardTitle>
            <CardDescription>
              Configure how and when you receive updates, alerts, and reminders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-primary" />
                  Current Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-sm">Email Notifications</span>
                    </div>
                    <Badge>
                      {emailNotifications ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                    <div className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-sm">WhatsApp Notifications</span>
                    </div>
                    <Badge >
                      {whatsappNotifications ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
                      <span className="text-sm">Daily Reminder Time</span>
                    </div>
                    <Badge variant="secondary">
                      {dueTime ? formatTimeToAMPM(dueTime) : "Not set"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between h-full">
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <InfoIcon className="h-5 w-5 mr-2 text-primary mt-0.5" />
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
                    <Button
                      variant="default"
                      className="w-full group relative overflow-hidden bg-primary hover:bg-primary/80"
                    >
                      <Settings className="mr-2 h-4 w-4 group-hover:rotate-45 transition-transform duration-300" />
                      Customize Notification Settings
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-6 h-fit max-h-screen  justify-center m-auto overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Notification & Reminder Settings</DialogTitle>
                      <DialogDescription>
                        Tailor your communication preferences to stay informed and productive
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium flex items-center text-primary">
                          <Bell className="mr-2 h-4 w-4" />
                          Notification Channels
                        </h3>

                        <div className="flex items-start space-x-4 p-3 rounded-lg bg-background border">
                          <div className="mt-0.5">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">Email Notifications</label>
                              <Switch
                                checked={emailNotifications}
                                onCheckedChange={setEmailNotifications}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Receive task updates, assignments and system notifications via email
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 p-3 rounded-lg bg-background border">
                          <div className="mt-0.5">
                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">WhatsApp Notifications</label>
                              <Switch
                                checked={whatsappNotifications}
                                onCheckedChange={setWhatsappNotifications}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Receive instant updates and notifications via WhatsApp
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-sm font-medium flex items-center text-primary">
                          <Clock className="mr-2 h-4 w-4" />
                          Reminder Settings
                        </h3>

                        <div className="flex items-start space-x-4 p-3 rounded-lg bg-background border">
                          <div className="mt-0.5">
                            <StopwatchIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">Daily Reminder Time</label>
                              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="group">
                                    <StopwatchIcon className="mr-2 h-4 w-4 group-hover:text-primary" />
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

                          </div>
                        </div>

                        <div className="flex items-start space-x-4 p-3 rounded-lg bg-background border">
                          <div className="mt-0.5">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">Email Reminders</label>
                              <Switch
                                checked={emailReminders}
                                onCheckedChange={setEmailReminders}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Get task reminders and deadline alerts via email
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4 p-3 rounded-lg bg-background border">
                          <div className="mt-0.5">
                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium">WhatsApp Reminders</label>
                              <Switch
                                checked={whatsappReminders}
                                onCheckedChange={setWhatsappReminders}
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Get task reminders and deadline alerts via WhatsApp
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-sm font-medium flex items-center text-primary">
                          <Settings className="mr-2 h-4 w-4" />
                          Weekly Schedule
                        </h3>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Weekly Off Days</label>
                          <p className="text-xs text-muted-foreground mb-3">
                            Select days when you don&apos;t want to receive reminders
                          </p>
                          <div className="grid grid-cols-7 gap-2">
                            {daysOfWeek.map((day) => (
                              <div key={day} className="flex flex-col items-center">
                                <div
                                  className={`
                                    w-10 h-10 rounded-full flex items-center justify-center
                                    transition-colors duration-200 cursor-pointer
                                    ${selectedDays.includes(day)
                                      ? 'bg-primary text-white'
                                      : 'bg-muted hover:bg-muted/80'}
                                  `}
                                  onClick={() => handleCheckboxChange(day)}
                                >
                                  {day}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setSettingsOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={updateSettings}
                        disabled={loading}
                        className="relative group overflow-hidden bg-primary hover:bg-primary/80"
                      >
                        {loading ? (
                          <Loader  />
                        ) : (
                          <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        )}
                        Save Settings
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Export Data Section */}
      <section className="space-y-6">
        <div className="flex items-center">
          <Download className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">Data Management</h2>
        </div>

        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Export & Backup</CardTitle>
            <CardDescription>
              Export your data for reporting, backup, or analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start">
                    <InfoIcon className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
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
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-background">
                  <h3 className="text-sm font-medium mb-4">Available Export Options</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 border rounded bg-muted/30">
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Export Tasks</span>
                      </div>
                      <Badge variant="outline" className="text-amber-500">Coming Soon</Badge>
                    </div>

                    <div className="flex items-center justify-between p-2 border rounded bg-muted/30">
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">Export Analytics</span>
                      </div>
                      <Badge variant="outline" className="text-amber-500">Coming Soon</Badge>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      disabled
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Data (Coming Soon)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Advanced settings section - could be expanded in the future */}
      <section className="space-y-6">
        <div className="flex items-center">
          <Settings className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">Advanced Settings</h2>
        </div>

        <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Additional Preferences</CardTitle>
            <CardDescription>
              Configure advanced settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 border rounded-lg bg-muted/30">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Advanced Configuration Options</h3>
                <p className="text-sm text-muted-foreground">
                  Additional settings and preferences will be available here in future updates
                </p>
              </div>
              <Badge variant="outline" className="text-purple-500">Coming Soon</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer with support info */}
      <footer className="border-t pt-8 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
          <p>Need help with settings? Contact our support team for assistance.</p>
          <Button variant="link" className="h-auto p-0">
            <span className="underline">Contact Support</span>
          </Button>
        </div>
      </footer>
    </div>
  );
}
