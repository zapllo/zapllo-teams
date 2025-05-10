"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Loader from "@/components/ui/loader";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { Mail, Phone, LogOut, HelpCircle, Lock, Languages, Clock, Trash2, Paperclip, Edit, UploadCloud, Globe, Users, FileCog, PanelLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaMobile, FaWhatsapp } from "react-icons/fa";
import { IoPersonAddSharp } from "react-icons/io5";
import { toast, Toaster } from "sonner";

type Props = {};

interface Category {
  _id: string;
  name: string;
  organization: string;
}

export default function Profile({ }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const router = useRouter();
  const [firstName, setFirstName] = useState("User");
  const [organizationName, setOrganizationName] = useState("");
  const [lastName, setLastName] = useState("User");
  const [role, setRole] = useState("role");
  const [email, setEmail] = useState("email");
  const [whatsappNo, setWhatsAppNo] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<string>("");
  const [userProfile, setUserProfile] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [timezone, setTimezone] = useState<string>("");
  const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);

  // Fetch user timezone
  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(detectedTimezone);
    setAvailableTimezones(Intl.supportedValuesOf("timeZone"));
  }, []);

  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
  };

  // Fetch user data
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get('/api/users/me');
        const user = res.data.data;
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setUserProfile(user.profilePic);
        setRole(user.role);
        setEmail(user.email);
        setWhatsAppNo(user.whatsappNo);
        setEmailNotifications(user.notifications?.email || true);
        setWhatsappNotifications(user.notifications?.whatsapp || true);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    getUserDetails();
  }, []);

  // Fetch organization data
  useEffect(() => {
    const getOrganizationDetails = async () => {
      try {
        const res = await axios.get('/api/organization/getById');
        const org = res.data.data;
        setOrganizationName(org.companyName);
        setIndustry(org.industry);
        setTeamSize(org.teamSize);
        setIsPro(org.isPro || false);
        // Check trial status - only set if not a Pro account
        const isExpired = !org.isPro && org.trialExpires && new Date(org.trialExpires) <= new Date();
        setIsTrialExpired(isExpired);
      } catch (error) {
        console.error('Error fetching organization details:', error);
      }
    };
    getOrganizationDetails();
  }, []);


  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category/get');
        const result = await response.json();
        if (response.ok) {
          setCategories(result.data);
        } else {
          console.error('Error fetching categories:', result.error);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      router.push('/login');
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // Profile picture handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsRemoving(false);
    }
  };

  const handleUploadProfilePic = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('files', selectedFile);

    try {
      setLoading(true);
      const uploadResponse = await axios.post('/api/upload', formData);
      const uploadedImageUrl = uploadResponse.data.fileUrls[0];
      await axios.patch('/api/users/profilePic', { profilePic: uploadedImageUrl });
      setProfilePic(uploadedImageUrl);
      setUserProfile(uploadedImageUrl);
      setLoading(false);
      toast.success("Profile picture updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture.");
      setLoading(false);
    }
  };

  const handleRemoveProfilePic = async () => {
    try {
      setLoading(true);
      await axios.delete('/api/users/profilePic');
      setUserProfile('');
      setProfilePic('');
      setPreviewUrl(null);
      setIsRemoving(false);
      setIsModalOpen(false);
      setLoading(false);
      toast.success("Profile picture removed successfully!");
    } catch (error) {
      console.error("Error removing profile picture:", error);
      toast.error("Failed to remove profile picture.");
      setLoading(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
  };

  return (
    <div style={{
      maxHeight: 'calc(100vh - 16px)', // Adjust based on your layout
      scrollBehavior: 'auto' // Prevent smooth scrolling which can interfere
    }}
      className="w-full pt-12 pb-16 px-4 mt-8 h-full overflow-y-auto scrollbar-hide md:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-primary/10">
                {userProfile ? (
                  <AvatarImage src={userProfile} alt={`${firstName} ${lastName}`} />
                ) : (
                  <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>

                <DialogContent className="p-6">
                  <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                    <DialogDescription>
                      Upload a new profile picture or remove your current one.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col items-center py-4">
                    <div className="relative mb-6">
                      {previewUrl || userProfile ? (
                        <div className="relative">
                          <Avatar className="h-32 w-32">
                            <AvatarImage
                              src={previewUrl || userProfile}
                              alt="Profile preview"
                              className="object-cover"
                            />
                            <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                          </Avatar>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                            onClick={() => {
                              setPreviewUrl(null);
                              setSelectedFile(null);
                              setIsRemoving(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="h-32 w-32 border-2 border-dashed rounded-full flex items-center justify-center bg-muted">
                          <UploadCloud className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="grid w-full max-w-sm gap-2">
                      <Label htmlFor="picture" className="text-center">Choose a profile picture</Label>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" className="w-full">
                          <label className="cursor-pointer">
                            Browse
                            <input
                              type="file"
                              id="picture"
                              onChange={handleFileChange}
                              className="hidden"
                              accept="image/*"
                            />
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={isRemoving ? handleRemoveProfilePic : handleUploadProfilePic}
                      variant={isRemoving ? "destructive" : "default"}
                      disabled={loading || (!selectedFile && !isRemoving)}
                    >
                      {loading ? (
                        <><Loader /> Processing...</>
                      ) : isRemoving ? (
                        <>Remove Picture</>
                      ) : (
                        <>Save Changes</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">
                {firstName} {lastName}
              </h2>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="outline" className="font-normal">
                  {role === "orgAdmin" ? "Admin" :
                    role === "member" ? "Member" :
                      role === "manager" ? "Manager" : role}
                </Badge>
                <Badge variant="outline" className="font-normal flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {email}
                </Badge>
                {whatsappNo && (
                  <Badge variant="outline" className="font-normal flex items-center gap-1">
                    <FaWhatsapp className="h-3 w-3 text-green-500" />
                    {whatsappNo}
                  </Badge>
                )}
              </div>
              {organizationName && (
                <p className="text-muted-foreground text-sm mt-1">
                  {organizationName} • {industry} • {teamSize} team members
                </p>
              )}

            </div>

            <div className="ml-auto hidden md:block">
             {isPro ? (
              <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                Pro Account
              </Badge>
            ) : isTrialExpired ? (
              <Badge variant="destructive" className="px-3 py-1.5 text-sm">
                Trial Expired
              </Badge>
            ) : (
              <Badge variant="outline" className="px-3 py-1.5 text-sm">
                Trial Account
              </Badge>
            )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Account Settings
            </div>
          </CardTitle>
          <CardDescription>
            Manage your account information and password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="font-medium flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Password Management
            </div>
            <p className="text-sm text-muted-foreground">
              Change your password to keep your account secure
            </p>
          </div>
          <div>
            <Link href="/dashboard/settings/changePassword">
              <Button variant="outline">Change Password</Button>
            </Link>
          </div>

          <Separator className="my-6" />

          <div className="space-y-1">
            <div className="font-medium flex items-center">
              <Trash2 className="h-4 w-4 mr-2" />
              Account Deletion
            </div>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data
            </p>
          </div>
          <div>
            <Link href="/account-deletion">
              <Button variant="destructive">Delete My Account</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <FileCog className="h-5 w-5 mr-2" />
              Preferences
            </div>
          </CardTitle>
          <CardDescription>
            Customize your application experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="font-medium flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Timezone
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timezone">Select your timezone</Label>
              <Select value={timezone} onValueChange={handleTimezoneChange}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {availableTimezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="font-medium flex items-center">
              <Languages className="h-4 w-4 mr-2" />
              Language
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Application language</Label>
              <Select disabled defaultValue="en">
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (Default)</SelectItem>
                  <SelectItem value="es">Spanish (Coming Soon)</SelectItem>
                  <SelectItem value="fr">French (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Additional languages will be available soon
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Support
            </div>
          </CardTitle>
          <CardDescription>
            Find help and resources for using the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/help/tutorials">
              <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <PanelLeft className="h-4 w-4 mr-2" />
                    Tutorials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Learn how to use the application with step-by-step guides
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/help/tickets">
              <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Paperclip className="h-4 w-4 mr-2" />
                    My Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View and manage your support tickets
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/help/tickets">
              <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Raise a Ticket
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get help from our support team
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/help/mobile-app">
              <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FaMobile className="h-4 w-4 mr-2" />
                    Mobile App
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Access the application on your mobile device
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <Link href="/help/events" className="block mt-4">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stay updated with upcoming webinars and training sessions
                </p>
              </CardContent>
            </Card>
          </Link>
        </CardContent>
      </Card>

      {/* Mobile logout button */}
      <div className="md:hidden flex justify-center mb-6">
        <Button
          variant="destructive"
          onClick={logout}
          className="w-full max-w-md"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
