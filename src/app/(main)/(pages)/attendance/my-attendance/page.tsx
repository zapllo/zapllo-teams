"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Cookies from 'js-cookie';
import Webcam from "react-webcam";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from "@/components/ui/tabs3";
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs3, TabsList3, TabsTrigger3 } from "@/components/ui/tabs3";
import { toast } from "sonner";
import Loader from "@/components/ui/loader";
import CustomDatePicker from "@/components/globals/date-picker";
import CustomTimePicker from "@/components/globals/time-picker";

// Icons
import {
  BookIcon,
  Building,
  Calendar,
  CalendarClock,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  LayoutDashboard,
  MapPin,
  MapPinIcon,
  MoreHorizontal,
  UserIcon,
  Users,
  Users2,
  X,
  ArrowRight,
  BarChart,
  RefreshCw
} from "lucide-react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { FaHouseUser } from "react-icons/fa";

// Custom Components
import RegularizationDetails from "@/components/sheets/regularizationDetails";
import { getBrowserLocation } from "@/lib/location";

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

// Define interface for login entries
interface LoginEntry {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    reportingManager: {
      firstName: string;
      lastName: string;
    };
  };
  lat: number;
  lng: number;
  timestamp: string;
  action: "login" | "logout" | "regularization" | "break_started" | "break_ended";
  approvalStatus?: "Pending" | "Approved" | "Rejected";
  loginTime: string;
  logoutTime: string;
  remarks: string;
  notes?: string;
}

// Helper function to group entries by day
const groupEntriesByDay = (
  entries: LoginEntry[] | undefined | null
): { [date: string]: LoginEntry[] } => {
  if (!entries || entries.length === 0) {
    return {};
  }

  return entries.reduce((acc: { [date: string]: LoginEntry[] }, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {});
};

export default function MyAttendance() {
  // Organization & user states
  const [organization, setOrganization] = useState<any>(null);
  const [orgUsers, setOrgUsers] = useState<any[]>([]);
  const [enterpriseMode, setEnterpriseMode] = useState(false);
  const [selectedTargetUser, setSelectedTargetUser] = useState<string | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [workerStatuses, setWorkerStatuses] = useState<Record<string, { isLoggedIn: boolean; isBreakOpen: boolean }>>({});
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("");

  // Attendance states
  const [loginEntries, setLoginEntries] = useState<LoginEntry[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBreakOpen, setIsBreakOpen] = useState(false);
  const [isEnterpriseAdmin, setIsEnterpriseAdmin] = useState(false);
  const [currentAction, setCurrentAction] = useState<'login' | 'logout' | 'break_started' | 'break_ended'>('login');
  const [hasRegisteredFaces, setHasRegisteredFaces] = useState(false);
  const [isWorkFromHome, setIsWorkFromHome] = useState(false);

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  // Add a new state variable
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  // Tab states
  const [activeTab, setActiveTab] = useState("thisMonth");
  const [activeAttendanceTab, setActiveAttendanceTab] = useState("dailyReport");

  // Date and time states
  const [customDateRange, setCustomDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isLogoutTimePickerOpen, setIsLogoutTimePickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState<boolean>(false);

  // Regularization states
  const [isRegularizationModalOpen, setIsRegularizationModalOpen] = useState(false);
  const [regularizationDate, setRegularizationDate] = useState("");
  const [regularizationLoginTime, setRegularizationLoginTime] = useState("");
  const [regularizationLogoutTime, setRegularizationLogoutTime] = useState("");
  const [regularizationRemarks, setRegularizationRemarks] = useState("");
  const [isSubmittingRegularization, setIsSubmittingRegularization] = useState(false);
  const [selectedRegularization, setSelectedRegularization] = useState<LoginEntry | null>(null);

  // Face registration states
  const [isRegisterFaceModalOpen, setIsRegisterFaceModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBreakImage, setCapturedBreakImage] = useState<string | null>(null);

  // Location states
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [orgData, setOrgData] = useState<{ location: { lat: number; lng: number }; allowGeofencing: boolean; geofenceRadius: number; } | null>(null);

  // Dropdown states
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showBreakUserDropdown, setShowBreakUserDropdown] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  // Expanded days for accordion
  const [expandedDays, setExpandedDays] = useState<{ [date: string]: boolean }>({});

  // References
  const webcamRef = React.useRef<Webcam>(null);

  // Formatting helper functions
  const formatTimeForDisplay = (time: string | null): string => {
    if (!time) return '';
    return format(new Date(`1970-01-01T${time}:00`), 'hh:mm a');
  };

  const formatTimeToAMPM = (timeString: string | undefined): string => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calculate distance between coordinates (for geofencing)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Time picker handlers
  const handleTimeChange = (time: string) => {
    setRegularizationLoginTime(time);
  };

  const handleLogoutTimeChange = (time: string) => {
    setRegularizationLogoutTime(time);
  };

  const openTimePicker = () => {
    setIsTimePickerOpen(true);
  };

  const handleCancel = () => {
    setIsTimePickerOpen(false);
  };

  const handleAccept = () => {
    setIsTimePickerOpen(false);
  };

  const openLogoutTimePicker = () => {
    setIsLogoutTimePickerOpen(true);
  };

  const handleLogoutCancel = () => {
    setIsLogoutTimePickerOpen(false);
  };

  const handleLogoutAccept = () => {
    setIsLogoutTimePickerOpen(false);
  };

  // Map view handler
  const handleViewMap = (lat: number, lng: number) => {
    setMapCoords({ lat, lng });
    setMapModalOpen(true);
  };

  // Worker status check
  const checkWorkerStatus = async (workerId: string) => {
    try {
      const response = await fetch('/api/check-worker-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId })
      });

      const data = await response.json();

      if (data.success) {
        setWorkerStatuses(prev => ({
          ...prev,
          [workerId]: {
            isLoggedIn: data.isLoggedIn,
            isBreakOpen: data.isBreakOpen
          }
        }));

        if (!data.isLoggedIn) {
          setCurrentAction('login');
        } else if (data.isBreakOpen) {
          setCurrentAction('break_ended');
        }
      }
    } catch (error) {
      console.error('Error checking worker status:', error);
    }
  };

  const handleWorkerSelect = (workerId: string | null) => {
    setSelectedTargetUser(workerId);

    if (workerId) {
      checkWorkerStatus(workerId);
    } else {
      setCurrentAction(isLoggedIn ? (isBreakOpen ? 'break_ended' : 'logout') : 'login');
    }
  };


  // Replace the fetchLocation function completely
  const fetchLocation = async (): Promise<{ lat: number; lng: number } | null> => {
    setIsLocationLoading(true);
    setLocationError(null);

    /* --------------------------------------------------------------------
     * 1. Try the cached copy in the `userLocation` cookie (valid ≤1 h)
     * ------------------------------------------------------------------*/
    try {
      const cached = Cookies.get("userLocation");
      if (cached) {
        const { location: savedLoc, timestamp } = JSON.parse(cached);
        const ONE_HOUR = 60 * 60 * 1000;

        if (Date.now() - timestamp < ONE_HOUR) {
          setLocation(savedLoc);
          setIsLocationLoading(false);
          return savedLoc;
        }
        Cookies.remove("userLocation");
      }
    } catch {
      Cookies.remove("userLocation"); // corrupted cookie – just wipe it
    }

    /* --------------------------------------------------------------------
     * 2. Ask the Permissions API – bail early if the user already blocked us
     * ------------------------------------------------------------------*/
    try {
      if ("permissions" in navigator) {
        const { state } = await navigator.permissions.query({ name: "geolocation" });
        if (state === "denied") {
          const msg = "Location permission is blocked. Enable it in site settings and retry.";
          setLocationError(msg);
          toast.error(msg);
          return null;                       // early exit – no point asking again
        }
      }
    } catch {
      /* ignore – not every browser supports Permissions API */
    }

    /* --------------------------------------------------------------------
     * 3. Call the helper that wraps navigator.geolocation
     * ------------------------------------------------------------------*/
    try {
      const loc = await getBrowserLocation();       // <-- may throw
      setLocation(loc);
      Cookies.set(
        "userLocation",
        JSON.stringify({ location: loc, timestamp: Date.now() }),
        { expires: 1 / 24 }                         // 1 hour
      );
      return loc;
    } catch (err: any) {
      /* -----------------------------------------------
       * Map Geolocation errors to user-friendly text
       * ---------------------------------------------*/
      const message =
        err.code === 1
          ? "You blocked location permission. Enable it in your browser settings and retry."
          : err.code === 2
            ? "Position unavailable. Are you on a simulator or is GPS switched off?"
            : err.code === 3
              ? "Location request timed out. Please try again."
              : err.message || "Failed to retrieve location.";

      setLocationError(message);
      toast.error(message);
      return null;                               // always resolve ↔ never throw
    } finally {
      setIsLocationLoading(false);
    }
  };

  /// Dialog handlers
  const handleModalChange = async (isOpen: boolean) => {
    if (isOpen) {
      await fetchLocation();
      setCapturedImage(null);
    } else {
      setCapturedImage(null);
    }
    setIsModalOpen(isOpen);
  };

  const handleBreakModalChange = async (isOpen: boolean) => {
    if (isOpen) {
      await fetchLocation();
      setCapturedBreakImage(null);
    } else {
      setCapturedBreakImage(null);
    }
    setIsBreakModalOpen(isOpen);
  };



  // Attendance action handlers
  const handleLoginLogout = () => {
    setIsModalOpen(true);
    setCapturedImage(null);
  };

  const handleBreaks = () => {
    setIsBreakModalOpen(true);
    setCapturedBreakImage(null);
  };

  // Face image handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      setSelectedImages(selectedFiles.slice(0, 3)); // Limit to 3 images
    }
  };

  // Base64 to Blob
  const dataURLtoBlob = (dataurl: string, filename: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([new Blob([u8arr], { type: mime })], filename);
  };


  const captureImageAndSubmitLogin = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }

    if (!imageSrc) {
      toast.error("Please capture an image to proceed.");
      return;
    }

    // If location is loading, wait for it
    if (isLocationLoading) {
      toast.info("Please wait while we get your location...");
      return;
    }

    // If no location, try to fetch it again
    if (!location) {
      toast.info("Trying to get your location...");
      const loc = await fetchLocation();
      if (!loc) {
        toast.error("Unable to proceed without location. Please allow location access and try again.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("files", dataURLtoBlob(imageSrc, "captured_image.jpg"));

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.fileUrls[0];

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed.");
      }

      const action = isLoggedIn ? "logout" : "login";
      const requestBody: any = {
        imageUrl,
        lat: location?.lat,
        lng: location?.lng,
        action,
        workFromHome: isWorkFromHome,
      };

      if (enterpriseMode && selectedTargetUser) {
        requestBody.enterpriseMode = true;
        requestBody.targetUserId = selectedTargetUser;
      }

      const loginResponse = await fetch("/api/face-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok && loginData.success) {
        if (loginData.enterpriseMode) {
          toast.success(`${action === "login" ? "Login" : "Logout"} successful for ${loginData.targetUser.name}.`);
        } else {
          toast.success(`${action === "login" ? "Login" : "Logout"} successful.`);
          setIsLoggedIn(action === "login");
        }

        setIsModalOpen(false);

        const resEntries = await fetch("/api/loginEntries");
        const dataEntries = await resEntries.json();
        setLoginEntries(dataEntries.entries);
      } else {
        if (loginData.error === "You are outside the allowed geofencing area.") {
          toast(<div className="w-full mb-6 gap-2 m-auto">
            <div className="w-full flex justify-center">
              <DotLottieReact
                src="/lottie/error.lottie"
                loop
                autoplay
              />
            </div>
            <h1 className="text-black text-center font-medium text-lg">You are outside the allowed<br /> Geo-Fencing Area</h1>
            <p className="text-sm text-center text-black font-medium">Please raise a regularization request</p>
          </div>);
        } else if (loginData.error === "No matching face found. Please ensure you are facing the camera clearly and retry.") {
          toast.error("Face not recognized. Please try again or contact support.");
        } else {
          throw new Error(loginData.error || "Face recognition failed.");
        }
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Break management
  const captureImageAndSubmitBreakStart = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedBreakImage(imageSrc);
    }
    if (!imageSrc || !location) {
      toast.error("Please capture an image and ensure location is available.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("files", dataURLtoBlob(imageSrc, "captured_image.jpg"));

      const uploadResponse = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.fileUrls[0];

      if (!uploadResponse.ok) {
        throw new Error("Image upload failed.");
      }

      const action = isBreakOpen ? "break_ended" : "break_started";
      const requestBody: any = {
        imageUrl,
        lat: location.lat,
        lng: location.lng,
        action,
      };

      if (enterpriseMode && selectedTargetUser) {
        requestBody.enterpriseMode = true;
        requestBody.targetUserId = selectedTargetUser;
      }

      const loginResponse = await fetch("/api/face-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok && loginData.success) {
        if (loginData.enterpriseMode) {
          if (action === "break_started") {
            toast.success(`Break started for ${loginData.targetUser.name}.`);
          } else {
            toast.success(`Break ended for ${loginData.targetUser.name}.`);
          }
        } else {
          if (action === "break_started") {
            toast.success("Break started.");
            setIsBreakOpen(true);
          } else {
            toast.success("Break ended.");
            setIsBreakOpen(false);
          }
        }

        setIsBreakModalOpen(false);

        const resEntries = await fetch("/api/loginEntries");
        const dataEntries = await resEntries.json();
        setLoginEntries(dataEntries.entries);
      } else {
        if (action === "break_started") {
          toast.error(loginData.error || "Break start failed.");
        } else {
          toast.error(loginData.error || "Break end failed.");
        }
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Face registration
  const handleFaceRegistrationSubmit = async () => {
    if (selectedImages?.length !== 3) {
      toast.info("Please upload exactly 3 images.");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      selectedImages.forEach((file) => formData.append("files", file));

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error("Image upload failed.");
      }

      const faceRegistrationResponse = await fetch(
        "/api/face-registration-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrls: uploadData.fileUrls,
          }),
        }
      );

      const faceRegistrationData = await faceRegistrationResponse.json();
      if (faceRegistrationResponse.ok && faceRegistrationData.success) {
        setIsLoading(false);
        toast.success(
          "Face registration request submitted successfully and is pending approval."
        );
        setIsRegisterFaceModalOpen(false);
        setSelectedImages([]);
      } else {
        throw new Error("Face registration request submission failed.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle regularization
  const handleSubmitRegularization = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !regularizationDate ||
      !regularizationLoginTime ||
      !regularizationLogoutTime ||
      !regularizationRemarks
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmittingRegularization(true);

    try {
      setAttendanceLoading(true);
      const response = await fetch("/api/regularize", {
        method: "POST",
        body: JSON.stringify({
          date: regularizationDate,
          loginTime: regularizationLoginTime,
          logoutTime: regularizationLogoutTime,
          remarks: regularizationRemarks,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast(<div className="w-full mb-6 gap-2 m-auto">
          <div className="w-full flex justify-center">
            <DotLottieReact
              src="/lottie/tick.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-black text-center font-medium text-lg">Regularization request submitted successfully</h1>
        </div>);

        const resEntries = await fetch("/api/loginEntries");
        const dataEntries = await resEntries.json();
        setLoginEntries(dataEntries.entries);
        setAttendanceLoading(false);

        setRegularizationDate("");
        setRegularizationLoginTime("");
        setRegularizationLogoutTime("");
        setRegularizationRemarks("");
        setIsRegularizationModalOpen(false);
      } else {
        throw new Error(
          data.message || "Failed to submit regularization request."
        );
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingRegularization(false);
      setAttendanceLoading(false);
    }
  };

  // Toggle accordion
  const toggleDayExpansion = (date: string) => {
    setExpandedDays((prevState) => ({
      ...prevState,
      [date]: !prevState[date],
    }));
  };

  // Handle regularization detail
  const handleRegularizationClick = (regularization: LoginEntry) => {
    setSelectedRegularization(regularization);
  };

  const handleSheetClose = () => {
    setSelectedRegularization(null);
  };

  // Custom date range
  const openCustomModal = () => {
    setIsCustomModalOpen(true);
  };

  const handleCustomDateSubmit = (start: Date, end: Date) => {
    setCustomDateRange({ start, end });
    setIsCustomModalOpen(false);
    setActiveTab("custom");
  };

  const handleClose = () => {
    setCustomDateRange({ start: null, end: null });
    setIsCustomModalOpen(false);
  };

  // Fetch user details
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setUser(res.data.data);
        setRole(res.data.data.role);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUserDetails();
  }, []);

  // Fetch organization data
  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const res = await axios.get("/api/organization/getById");
        setOrgData(res.data.data);
        setOrganization(res.data.data);

        // If it's an enterprise organization and user is admin, fetch all users
        if (res.data.data?.isEnterprise && (user?.role === 'admin' || user?.role === 'orgAdmin')) {
          setEnterpriseMode(true);
          const usersRes = await axios.get("/api/organization/getOrgUsers");
          setOrgUsers(usersRes.data.data || []);
          setFilteredUsers(usersRes.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching organization data", error);
      }
    };
    fetchOrgData();
  }, [user]);

  // Fetch login status
  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        setDisplayLoader(true);
        const res = await fetch("/api/check-login-status");
        const data = await res.json();

        if (data.success) {
          setIsLoggedIn(data.isLoggedIn);
          setIsBreakOpen(data.isBreakOpen);
          setIsEnterpriseAdmin(data.isEnterpriseAdmin);
          setHasRegisteredFaces(data.hasRegisteredFaces);
        } else {
          toast.error(data.error || "Failed to fetch login status.");
        }
      } catch (error) {
        console.error("Error fetching login status:", error);
      } finally {
        setDisplayLoader(false);
      }
    };

    fetchLoginStatus();
  }, []);

  // Fetch login entries
  useEffect(() => {
    const fetchLoginEntriesAndStatus = async () => {
      try {
        setDisplayLoader(true);
        const resEntries = await fetch("/api/loginEntries");
        const dataEntries = await resEntries.json();
        setLoginEntries(dataEntries.entries);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDisplayLoader(false);
      }
    };

    fetchLoginEntriesAndStatus();
  }, [isLoggedIn, isBreakOpen]);

  // Filter users based on search
  useEffect(() => {
    if (!userSearchQuery) {
      setFilteredUsers(orgUsers);
      return;
    }

    const filtered = orgUsers.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [userSearchQuery, orgUsers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dropdown = document.getElementById('user-dropdown');
      const breakDropdown = document.getElementById('break-user-dropdown');

      if (dropdown && !dropdown.contains(event.target as Node) && showUserDropdown) {
        setShowUserDropdown(false);
      }

      if (breakDropdown && !breakDropdown.contains(event.target as Node) && showBreakUserDropdown) {
        setShowBreakUserDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown, showBreakUserDropdown]);

  // Filtering functions for attendance entries
  const isWithinDateRange = (date: Date, startDate: Date, endDate: Date) => {
    return date >= startDate && date <= endDate;
  };

  const isWithinLastNDays = (date: Date, days: number) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    return date >= pastDate && date <= today;
  };

  const filterEntriesByTab = () => {
    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const normalizeDate = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const todayNormalized = normalizeDate(today);

    switch (activeTab) {
      case "today":
        return loginEntries?.filter((entry) => {
          const entryDate = normalizeDate(new Date(entry.timestamp));
          return entryDate.getTime() === todayNormalized.getTime();
        });
      // ... continuing the filterEntriesByTab function
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayNormalized = normalizeDate(yesterday);
        return loginEntries?.filter((entry) => {
          const entryDate = normalizeDate(new Date(entry.timestamp));
          return entryDate.getTime() === yesterdayNormalized.getTime();
        });
      case "thisWeek":
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        return loginEntries?.filter((entry) => {
          const entryDate = normalizeDate(new Date(entry.timestamp));
          return (
            entryDate >= normalizeDate(thisWeekStart) &&
            entryDate <= todayNormalized
          );
        });
      case "lastWeek":
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
        return loginEntries?.filter((entry) => {
          const entryDate = normalizeDate(new Date(entry.timestamp));
          return (
            entryDate >= normalizeDate(lastWeekStart) &&
            entryDate <= normalizeDate(lastWeekEnd)
          );
        });
      case "thisMonth":
        return loginEntries?.filter((entry) => {
          const entryDate = normalizeDate(new Date(entry.timestamp));
          return (
            entryDate >= normalizeDate(thisMonthStart) &&
            entryDate <= todayNormalized
          );
        });
      case "lastMonth":
        return loginEntries?.filter((entry) => {
          const entryDate = normalizeDate(new Date(entry.timestamp));
          return (
            entryDate >= normalizeDate(lastMonthStart) &&
            entryDate <= normalizeDate(lastMonthEnd)
          );
        });
      case "allTime":
        return loginEntries;
      case "custom":
        if (customDateRange.start && customDateRange.end) {
          const startNormalized = normalizeDate(customDateRange.start);
          const endNormalized = normalizeDate(customDateRange.end);
          return loginEntries?.filter((entry) => {
            const entryDate = normalizeDate(new Date(entry.timestamp));
            return entryDate >= startNormalized && entryDate <= endNormalized;
          });
        } else {
          return loginEntries;
        }
      default:
        return loginEntries;
    }
  };

  const filteredEntries = filterEntriesByTab();

  // Filter for different report types
  const filterDailyReportEntries = (entries: LoginEntry[]) => {
    return entries?.filter((entry) => {
      if (entry.action === "regularization" && entry.approvalStatus !== "Approved") {
        return false;
      }
      return true;
    });
  };

  const filterRegularizationEntries = (entries: LoginEntry[]) => {
    return entries?.filter((entry) => entry.action === "regularization");
  };

  const filterTodayEntries = (entries: LoginEntry[]) => {
    return entries?.filter((entry) => {
      const today = new Date();
      const entryDate = new Date(entry.timestamp);
      return (
        entryDate.getDate() === today.getDate() &&
        entryDate.getMonth() === today.getMonth() &&
        entryDate.getFullYear() === today.getFullYear() &&
        (
          entry.action === "login" ||
          entry.action === "logout" ||
          entry.action === "break_started" ||
          entry.action === "break_ended"
        )
      );
    });
  };

  // Calculate hours between login/logout
  const calculateHoursBetweenLoginLogout = (entries: LoginEntry[]): string => {
    // Sort entries by timestamp (ascending)
    const sortedEntries = entries.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    let totalNetMs = 0;
    let loginTime: number | null = null;
    let totalBreakMs = 0;
    let currentBreakStart: number | null = null;

    sortedEntries.forEach((entry) => {
      const entryTime = new Date(entry.timestamp).getTime();

      if (entry.action === 'login') {
        // Start a new work session
        loginTime = entryTime;
        totalBreakMs = 0;
        currentBreakStart = null;
      } else if (entry.action === 'break_started') {
        // Mark the break start time
        currentBreakStart = entryTime;
      } else if (entry.action === 'break_ended') {
        if (currentBreakStart !== null) {
          // Add break duration
          totalBreakMs += entryTime - currentBreakStart;
          currentBreakStart = null;
        }
      } else if (entry.action === 'logout') {
        if (loginTime !== null) {
          // If a break was ongoing, add break duration until logout.
          if (currentBreakStart !== null) {
            totalBreakMs += entryTime - currentBreakStart;
            currentBreakStart = null;
          }
          const sessionDurationMs = entryTime - loginTime;
          const netSessionMs = sessionDurationMs - totalBreakMs;
          totalNetMs += netSessionMs;
          // Reset for the next session.
          loginTime = null;
          totalBreakMs = 0;
        }
      }
    });

    // If the last entry is a break_started (and there was a login), assume the session ended at the break start.
    if (loginTime !== null && currentBreakStart !== null) {
      const sessionDurationMs = currentBreakStart - loginTime;
      const netSessionMs = sessionDurationMs - totalBreakMs;
      totalNetMs += netSessionMs;
    }

    // Convert totalNetMs to hours and minutes
    const hours = Math.floor(totalNetMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalNetMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  // Prepare data for rendering
  const displayedEntries = activeAttendanceTab === "dailyReport"
    ? filterDailyReportEntries(filteredEntries)
    : filterRegularizationEntries(filteredEntries);

  const todayEntries = filterTodayEntries(loginEntries);

  // Calculate stats
  const [daysCount, setDaysCount] = useState(0);
  const [regularizedCount, setRegularizedCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  // Calculate counts and hours based on filtered entries
  useEffect(() => {
    const dailyReportEntries = filterDailyReportEntries(filteredEntries);

    const uniqueDays = new Set(
      dailyReportEntries?.map((entry) => new Date(entry.timestamp).toLocaleDateString())
    );

    const totalRegularized = dailyReportEntries?.filter(
      (entry) => entry.action === "regularization"
    ).length;

    const verifiedRegularized = dailyReportEntries?.filter(
      (entry) => entry.approvalStatus === "Approved"
    ).length;

    let totalHoursAcc = 0;
    uniqueDays.forEach((day) => {
      const entriesForDay = dailyReportEntries?.filter(
        (entry) => new Date(entry.timestamp).toLocaleDateString() === day
      );

      // Calculate total hours including regularization
      totalHoursAcc += parseFloat(calculateHoursBetweenLoginLogout(entriesForDay));
    });

    // Handle regularization entries separately
    const regularizationEntriesForDay = dailyReportEntries?.filter(
      (entry) => entry.action === "regularization"
    );

    if (regularizationEntriesForDay?.length > 0) {
      totalHoursAcc += parseFloat(calculateHoursBetweenLoginLogout(regularizationEntriesForDay));
    }

    setDaysCount(uniqueDays.size);
    setRegularizedCount(totalRegularized);
    setVerifiedCount(verifiedRegularized);
    setTotalHours(Number(totalHoursAcc.toFixed(2)));
  }, [filteredEntries, activeAttendanceTab]);

  // Display regularization entries
  const renderRegularizationEntries = () => {
    const regularizationEntries = filterRegularizationEntries(filteredEntries);

    return (
      <>
        {regularizationEntries?.length === 0 ? (
          <Card className="w-full mt-4">
            <CardContent className="pt-6 flex flex-col items-center">
              <DotLottieReact
                src="/lottie/empty.lottie"
                loop
                className="h-56"
                autoplay
              />
              <h3 className="font-semibold text-lg">No Entries Found</h3>
              <p className="text-sm text-muted-foreground">
                It seems like you have not raised any requests yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {regularizationEntries.map((entry, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <button
                    onClick={() => handleRegularizationClick(entry)}
                    className="w-full p-4 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
                  >
                    {entry.userId && (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                          <span className="text-xs uppercase font-semibold">
                            {entry.userId.firstName[0]}
                            {entry.userId.lastName[0]}
                          </span>
                        </div>
                        <span className="font-medium text-sm">
                          {`${entry.userId.firstName} ${entry.userId.lastName}`}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {`${formatTimeToAMPM(entry.loginTime)} - ${formatTimeToAMPM(entry.logoutTime)}`}
                      </span>

                      <Badge
                        className={
                          entry.approvalStatus === "Approved"
                            ? "hover:bg-green-200 bg-green-100 text-green-800 border-green-200"
                            : entry.approvalStatus === "Rejected"
                              ? "hover:bg-red-200 bg-red-100 text-red-800 border-red-200"
                              : "hover:bg-yellow-200 bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        {entry.approvalStatus}
                      </Badge>

                      {entry.lat && entry.lng && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMap(entry.lat, entry.lng);
                          }}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {selectedRegularization && (
          <RegularizationDetails
            selectedRegularization={selectedRegularization}
            onClose={handleSheetClose}
          />
        )}
      </>
    );
  };



  const filterApprovedEntries = (entries: LoginEntry[]) => {
    return entries?.filter((entry) => {
      if (
        entry.action === "regularization" &&
        entry.approvalStatus !== "Approved"
      ) {
        return false;
      }
      return true;
    });
  };
  // Filter and group entries for display
  const groupedEntries = groupEntriesByDay(
    filterApprovedEntries(filteredEntries)
  );

  const AttendanceLoader = () => {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/10 animate-pulse"></div>

            {/* Multiple spinning rings */}
            <div className="h-24 w-24 rounded-full border-t-4 border-r-2 border-primary animate-spin"></div>
            <div className="absolute inset-0 h-20 w-20 m-auto rounded-full border-b-4 border-l-2 border-primary/70 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-0 h-16 w-16 m-auto rounded-full border-l-4 border-t-2 border-primary/40 animate-spin" style={{ animationDuration: '2s' }}></div>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h3 className="font-semibold text-xl">Loading Your Attendance</h3>
            <p className="text-muted-foreground text-sm">Preparing your attendance records...</p>

            {/* Progress bar */}
            <div className="w-56 h-1.5 bg-muted rounded-full overflow-hidden mt-2">
              <div className="h-full bg-primary rounded-full animate-loader-progress"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add these keyframes to the global style tag in the component
  // or you can move this to your globals.css
  const loaderStyles = `
  @keyframes loader-progress {
    0% { width: 0%; }
    20% { width: 20%; }
    40% { width: 40%; }
    60% { width: 60%; }
    80% { width: 80%; }
    95% { width: 95%; }
    100% { width: 95%; }
  }

  .animate-loader-progress {
    animation: loader-progress 1.8s ease-in-out infinite;
  }
`;



  // Main render
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Loading overlay */}
      {(displayLoader || attendanceLoading) && <AttendanceLoader />}

      {/* Page header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">My Attendance</h1>
          </div>

          {/* Enterprise mode indicator */}
          {organization?.isEnterprise && (user?.role === 'admin' || user?.role === 'orgAdmin') && (
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                <span className="font-medium">Enterprise Mode</span>
              </div>
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Track and manage your daily attendance records
        </p>
      </div>

      {/* Action buttons */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Attendance Actions</CardTitle>
          <CardDescription>
            Record your attendance or manage worker attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasRegisteredFaces ? (
            <div className="flex flex-wrap gap-3">
              {/* Enterprise mode - always show all buttons */}
              {organization?.isEnterprise && (user?.role === 'admin' || user?.role === 'orgAdmin') ? (
                <>
                  {/* Enterprise selector */}
                  <div className="w-full mb-4">
                    <div className="relative">
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                      >
                        {selectedTargetUser ?
                          `${orgUsers.find(u => u._id === selectedTargetUser)?.firstName} ${orgUsers.find(u => u._id === selectedTargetUser)?.lastName}` :
                          "Select worker to manage attendance..."
                        }
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>

                      {showUserDropdown && (
                        <div id="user-dropdown" className="absolute top-full mt-1 w-full z-50 max-h-[300px] overflow-auto rounded-md border bg-popover shadow-md">
                          <div className="sticky top-0 z-10 p-2 bg-popover border-b">
                            <Input
                              placeholder="Search workers..."
                              value={userSearchQuery}
                              onChange={(e) => setUserSearchQuery(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="p-1">
                            <Button
                              variant={!selectedTargetUser ? "secondary" : "ghost"}
                              className="w-full justify-start text-left mb-1"
                              onClick={() => {
                                handleWorkerSelect(null);
                                setShowUserDropdown(false);
                              }}
                            >
                              <UserIcon className="mr-2 h-4 w-4" />
                              <span>Myself (Admin)</span>
                            </Button>

                            {filteredUsers.length === 0 ? (
                              <div className="py-6 text-center text-sm text-muted-foreground">
                                No workers found
                              </div>
                            ) : (
                              filteredUsers.map(user => (
                                <Button
                                  key={user._id}
                                  variant={selectedTargetUser === user._id ? "secondary" : "ghost"}
                                  className="w-full justify-start text-left mb-1"
                                  onClick={() => {
                                    handleWorkerSelect(user._id);
                                    setShowUserDropdown(false);
                                  }}
                                >
                                  <div className="flex items-center">
                                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs mr-2">
                                      {user.firstName?.[0]}{user.lastName?.[0]}
                                    </div>
                                    <span>{user.firstName} {user.lastName}</span>
                                  </div>
                                </Button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enterprise action buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <Button
                      onClick={handleLoginLogout}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Login Worker
                    </Button>
                    <Button
                      onClick={handleBreaks}
                      variant="outline"
                      className={isBreakOpen ?
                        "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200" :
                        "bg-amber-500 text-white hover:bg-amber-600"
                      }
                    >
                      {isBreakOpen ? "End Break" : "Take a Break"}
                    </Button>
                    <Button
                      onClick={handleLoginLogout}
                      variant="destructive"
                    >
                      Logout Worker
                    </Button>
                  </div>
                </>
              ) : (
                /* Regular mode - conditional buttons based on login state */
                <div className="flex gap-3">
                  {isLoggedIn ? (
                    <>
                      {isBreakOpen ? (
                        <Button
                          onClick={handleBreaks}
                          className="bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          End Break
                        </Button>
                      ) : (
                        <Button
                          onClick={handleBreaks}
                          variant="outline"
                          className="border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                        >
                          Take a Break
                        </Button>
                      )}
                      <Button
                        onClick={handleLoginLogout}
                        variant="destructive"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleLoginLogout}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Login
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="rounded-full bg-amber-100 p-3">
                <Camera className="h-6 w-6 text-amber-600" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-medium">Face Registration Required</h3>
                <p className="text-sm text-muted-foreground">Register your face to use the attendance system</p>
              </div>
              <Button
                onClick={() => setIsRegisterFaceModalOpen(true)}
                className="mt-2"
              >
                Register Faces
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's entries */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today&apos;s Activity
          </CardTitle>
          <CardDescription>
            Your attendance records for {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayEntries?.length === 0 ? (
            <div className="bg-muted/30 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <img src="/animations/not found.gif" className="h-40" />
              </div>
              <h3 className="font-medium">No entries found for today</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Click on Login to record your attendance
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayEntries?.map((entry: LoginEntry, index: number) => {
                const formattedLoginTime = entry.loginTime
                  ? format(new Date(entry.loginTime), 'hh:mm a')
                  : null;

                const formattedLogoutTime = entry.logoutTime
                  ? format(new Date(entry.logoutTime), 'hh:mm a')
                  : null;

                const formattedBreakTime = format(new Date(entry.timestamp), 'hh:mm a');

                return (
                  <div key={index} className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted">
                        {entry.action === "login" && <UserIcon className="h-5 w-5 text-emerald-500" />}
                        {entry.action === "logout" && <UserIcon className="h-5 w-5 text-rose-500" />}
                        {entry.action === "break_started" && <Clock className="h-5 w-5 text-amber-500" />}
                        {entry.action === "break_ended" && <Clock className="h-5 w-5 text-blue-500" />}
                      </div>

                      <div>
                        {entry.loginTime && (
                          <div className="text-sm font-medium">Login: {formattedLoginTime}</div>
                        )}
                        {entry.logoutTime && (
                          <div className="text-sm font-medium">Logout: {formattedLogoutTime}</div>
                        )}
                        {(entry.action === "break_started" || entry.action === "break_ended") && (
                          <div className="text-sm font-medium">
                            {entry.action === "break_started" ? "Break started" : "Break ended"}: {formattedBreakTime}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          entry.action === "login" ? "hover:bg-green-200 bg-green-100 text-green-800 border-green-200" :
                            entry.action === "logout" ? "hover:bg-red-200 bg-red-100 text-red-800 border-red-200" :
                              entry.action === "break_started" ? "hover:bg-yellow-200 bg-yellow-100 text-yellow-800 border-yellow-200" :
                                "bg-blue-100 text-blue-800 border-blue-200"
                        }
                      >
                        {entry.action === "login" ? "LOGIN" :
                          entry.action === "logout" ? "LOGOUT" :
                            entry.action === "break_started" ? "BREAK STARTED" : "BREAK ENDED"}
                      </Badge>

                      {entry.lat && entry.lng && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewMap(entry.lat, entry.lng)}
                          className="h-8 w-8"
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button
            variant="outline"
            onClick={() => setIsRegularizationModalOpen(true)}
            className="w-full"
          >
            <FileText className="mr-2 h-4 w-4" />
            Apply for Regularization
          </Button>
        </CardFooter>
      </Card>

      {/* Attendance history */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Attendance History</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("thisMonth")}
            className="gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Filters
          </Button>
        </div>

        {/* Time period filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-8 h-auto p-1">
            <TabsTrigger value="today" className="text-xs h-8">Today</TabsTrigger>
            <TabsTrigger value="yesterday" className="text-xs h-8">Yesterday</TabsTrigger>
            <TabsTrigger value="thisWeek" className="text-xs h-8">This Week</TabsTrigger>
            <TabsTrigger value="lastWeek" className="text-xs h-8">Last Week</TabsTrigger>
            <TabsTrigger value="thisMonth" className="text-xs h-8">This Month</TabsTrigger>
            <TabsTrigger value="lastMonth" className="text-xs h-8">Last Month</TabsTrigger>
            <TabsTrigger value="allTime" className="text-xs h-8">All Time</TabsTrigger>
            <TabsTrigger value="custom" onClick={openCustomModal} className="text-xs h-8">Custom</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Report type selector */}
        <div className="flex justify-center">
          <Tabs value={activeAttendanceTab} onValueChange={setActiveAttendanceTab} className="w-full max-w-md">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="dailyReport" className="flex items-center gap-1.5">
                <LayoutDashboard className="h-4 w-4" />
                Daily Report
              </TabsTrigger>
              <TabsTrigger value="regularization" className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                Regularization
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Report content */}
        <div className="mt-4">
          {activeAttendanceTab === "dailyReport" ? (
            <>
              {Object.keys(groupedEntries)?.length === 0 ? (
                <Card className="border">
                  <CardContent className="pt-6 flex flex-col items-center">
                    <DotLottieReact
                      src="/lottie/empty.lottie"
                      loop
                      className="h-56"
                      autoplay
                    />
                    <h3 className="font-medium text-center">No Entries for the selected time frame</h3>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-1">
                  {/* Stats row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <Card className="shadow-sm">
                      <CardContent className="p-4 flex gap-3 items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Days</p>
                          <p className="text-lg font-bold">{daysCount}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                      <CardContent className="p-4 flex gap-3 items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Verified</p>
                          <p className="text-lg font-bold">{verifiedCount}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                      <CardContent className="p-4 flex gap-3 items-center">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <CalendarClock className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Regularized</p>
                          <p className="text-lg font-bold">{regularizedCount}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                      <CardContent className="p-4 flex gap-3 items-center">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Hours</p>
                          <p className="text-lg font-bold">{totalHours}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Daily entries accordion */}
                  <div className="space-y-3">
                    {Object.keys(groupedEntries || {}).map((date, index) => (
                      <Card key={index} className="overflow-hidden border">
                        <button
                          onClick={() => toggleDayExpansion(date)}
                          className="w-full text-left px-4 py-3 flex items-center justify-between border-b bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex gap-4 items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="font-medium">{date}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{calculateHoursBetweenLoginLogout(groupedEntries[date])}</span>
                            </div>

                            <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${expandedDays[date] ? 'rotate-90' : ''}`} />
                          </div>
                        </button>

                        {expandedDays[date] && (
                          <div className="divide-y">
                            {groupedEntries[date].map((entry, idx) => (
                              <div key={idx} className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  {entry.action === "regularization" ? (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Login: {formatTimeToAMPM(entry.loginTime)}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Logout: {formatTimeToAMPM(entry.logoutTime)}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm">
                                        {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}: {format(new Date(entry.timestamp), 'hh:mm a')}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={
                                      entry.action === "login" ? "hover:bg-green-200 bg-green-100 text-green-800 border-green-200" :
                                        entry.action === "logout" ? "hover:bg-red-200 bg-red-100 text-red-800 border-red-200" :
                                          entry.action === "break_started" ? "hover:bg-yellow-200 bg-yellow-100 text-yellow-800 border-yellow-200" :
                                            entry.action === "break_ended" ? "hover:bg-blue-200 bg-blue-100 text-blue-800 border-blue-200" :
                                              " hover:bg-gray-200 text-gray-800 border-gray-200"
                                    }
                                  >
                                    {entry.action === "login" ? "LOGIN" :
                                      entry.action === "logout" ? "LOGOUT" :
                                        entry.action === "break_started" ? "BREAK STARTED" :
                                          entry.action === "break_ended" ? "BREAK ENDED" :
                                            "REGULARIZATION"}
                                  </Badge>

                                  {entry.lat && entry.lng && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleViewMap(entry.lat, entry.lng)}
                                      className="h-8 w-8"
                                    >
                                      <MapPin className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            // Render regularization entries
            renderRegularizationEntries()
          )}
        </div>
      </div>

      {/* Dialogs and Modals */}

      {/* Face Login Dialog */}
      <Dialog open={isModalOpen} onOpenChange={handleModalChange}>
        <DialogContent className="-md p-6 ">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/branding/AII.png" className="h-8 dark:block hidden" />
                <img src="/branding/zapllo ai.png" className="h-4 dark:block hidden" />
                <img src="/branding/ai-light.png" className="h-7 dark:hidden block" />
              </div>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {isLoggedIn ? `Logout at ${format(new Date(), 'hh:mm a')}` : `Login at ${format(new Date(), 'hh:mm a')}`}
              </h3>

              {/* Work from home toggle */}
              <Tabs3
                value={isWorkFromHome ? "work-from-home" : "office"}
                onValueChange={(val) => setIsWorkFromHome(val === "work-from-home")}
              >
                <TabsList3>
                  <TabsTrigger3 value="office">Office</TabsTrigger3>
                  <TabsTrigger3
                    value="work-from-home"
                    disabled={!user?.workFromHomeAllowed}
                  >
                    Work From Home
                  </TabsTrigger3>
                </TabsList3>
              </Tabs3>
            </div>

            {/* Enterprise mode selector */}
            {organization?.isEnterprise && (user?.role === 'admin' || user?.role === 'orgAdmin') && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <h3 className="text-sm font-medium text-amber-700 dark:text-amber-400">Enterprise Mode</h3>
                </div>

                <div className="relative">
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    {selectedTargetUser ?
                      `${orgUsers.find(u => u._id === selectedTargetUser)?.firstName} ${orgUsers.find(u => u._id === selectedTargetUser)?.lastName}` :
                      "Select worker to manage attendance..."
                    }
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>

                  {showUserDropdown && (
                    <div className="absolute z-50 mt-1 w-full bg-popover rounded-md border shadow-md">
                      <div className="p-2 border-b">
                        <Input
                          placeholder="Search workers..."
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          className="h-8"
                        />
                      </div>

                      <div className="max-h-60 overflow-y-auto py-1">
                        <Button
                          variant={!selectedTargetUser ? "secondary" : "ghost"}
                          className="w-full justify-start text-left"
                          onClick={() => {
                            handleWorkerSelect(null);
                            setShowUserDropdown(false);
                          }}
                        >
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Myself (Admin)</span>
                        </Button>

                        {filteredUsers.length === 0 ? (
                          <div className="px-3 py-2 text-center text-sm text-muted-foreground">
                            No workers found
                          </div>
                        ) : (
                          filteredUsers.map(user => (
                            <Button
                              key={user._id}
                              variant={selectedTargetUser === user._id ? "secondary" : "ghost"}
                              className="w-full justify-start text-left"
                              onClick={() => {
                                handleWorkerSelect(user._id);
                                setShowUserDropdown(false);
                              }}
                            >
                              <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs mr-2">
                                  {user.firstName?.[0]}{user.lastName?.[0]}
                                </div>
                                <span>{user.firstName} {user.lastName}</span>
                              </div>
                            </Button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {selectedTargetUser && (
                  <div className="p-2 bg-muted/50 rounded-md border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                        {orgUsers.find(u => u._id === selectedTargetUser)?.firstName?.[0]}
                        {orgUsers.find(u => u._id === selectedTargetUser)?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {orgUsers.find(u => u._id === selectedTargetUser)?.firstName} {orgUsers.find(u => u._id === selectedTargetUser)?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isLoggedIn ? `Recording logout for this worker` : `Recording login for this worker`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedTargetUser(null)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Webcam or Captured Image */}
            {/* Webcam or Captured Image - Enhanced Animation */}
            <div className="relative overflow-hidden rounded-lg border">
              {capturedImage ? (
                <div className="relative w-full">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-auto aspect-video object-cover"
                  />

                  {/* Enhanced Face Detection Animation Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    {/* Main animation in center */}
                    <div className="relative flex items-center justify-center w-full">
                      <DotLottieReact
                        src="/lottie/facescan.lottie"
                        loop
                        className="h-36 z-10"
                        autoplay
                      />

                      {/* Pulsing ring effect */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-32 w-32 rounded-full border-4 border-primary/50 animate-ping opacity-30"></div>
                      </div>
                    </div>

                    {/* Progress indicators */}
                    <div className="mt-4 flex flex-col items-center">
                      <div className="text-white font-medium text-sm tracking-wide mb-2">
                        Analyzing your face...
                      </div>

                      <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full animate-progressBar"></div>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                        <span className="text-xs text-white">Secure verification in progress</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-auto aspect-video object-cover"
                  videoConstraints={{
                    facingMode: "user"
                  }}
                />
              )}

              {/* Face alignment guide when not captured yet */}
              {/* {!capturedImage && (
    <div className="absolute inset-0 pointer-events-none">
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-48 h-48 border-2 border-dashed border-primary/40 rounded-full flex items-center justify-center">
          <div className="w-36 h-36 border border-primary/30 rounded-full flex items-center justify-center">
            <div className="text-xs text-primary/70 font-medium text-center">
              Position your face in the center
            </div>
          </div>
        </div>
      </div>
    </div>
  )} */}
            </div>

            {/* Add this CSS animation definition somewhere in your globals.css or a style tag */}
            <style jsx global>{`
  @keyframes progressBar {
    0% { width: 0%; }
    20% { width: 20%; }
    50% { width: 50%; }
    70% { width: 70%; }
    90% { width: 90%; }
    100% { width: 98%; }
  }

  .animate-progressBar {
    animation: progressBar 2s ease-in-out infinite;
  }
`}</style>
            {/* Capture button */}
            <div className="flex justify-center">
              <Button
                onClick={captureImageAndSubmitLogin}
                size="lg"
                className="rounded-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="h-5 w-5" />
                ) : (
                  <Camera className="h-5 w-5 mr-2" />
                )}
                {capturedImage ? "Submit" : "Capture"}
              </Button>
            </div>

            {/* Location info */}
            {orgData && orgData.allowGeofencing && location && (
              <div className="text-center">
                {calculateDistance(
                  location.lat,
                  location.lng,
                  orgData.location?.lat,
                  orgData.location?.lng
                ) <= orgData.geofenceRadius ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200 gap-1 ">
                    <FaHouseUser className="h-3.5 w-3.5" />
                    You are in office reach
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 border-red-200 gap-1">
                    <FaHouseUser className="h-3.5 w-3.5" />
                    You are outside office reach
                  </Badge>
                )}
              </div>
            )}
            {/* // Then update the location display in the dialog */}
            {/* Location info in dialog */}
            <div className="flex justify-center">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs ${locationError ? "bg-red-100 text-red-800" :
                isLocationLoading ? "bg-amber-100 text-amber-800" :
                  location ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"
                }`}>
                <MapPinIcon className={`h-3.5 w-3.5 ${isLocationLoading ? "animate-pulse" : ""
                  }`} />
                <span>
                  {isLocationLoading
                    ? "Getting your location..."
                    : locationError
                      ? locationError
                      : location
                        ? `Lat: ${location.lat.toFixed(6)}, Long: ${location.lng.toFixed(6)}`
                        : "Location unavailable. Please allow location access."
                  }
                </span>


                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 ml-2 px-2"
                  onClick={() => fetchLocation()}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>

              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Break Dialog */}
      <Dialog open={isBreakModalOpen} onOpenChange={handleBreakModalChange}>
        <DialogContent className="sm:max-w-md p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/branding/AII.png" className="h-8 dark:block hidden" />
                <img src="/branding/zapllo ai.png" className="h-4 dark:block hidden" />
                <img src="/branding/ai-light.png" className="h-7 dark:hidden block" />
              </div>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                {isBreakOpen ? `End Break at ${format(new Date(), 'hh:mm a')}` : `Start Break at ${format(new Date(), 'hh:mm a')}`}
              </h3>
            </div>

            {/* Enterprise mode selector */}
            {organization?.isEnterprise && (user?.role === 'admin' || user?.role === 'orgAdmin') && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <h3 className="text-sm font-medium text-amber-700 dark:text-amber-400">Enterprise Mode</h3>
                </div>

                <div className="relative">
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    onClick={() => setShowBreakUserDropdown(!showBreakUserDropdown)}
                  >
                    {selectedTargetUser ?
                      `${orgUsers.find(u => u._id === selectedTargetUser)?.firstName} ${orgUsers.find(u => u._id === selectedTargetUser)?.lastName}` :
                      "Select worker to manage breaks..."
                    }
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>

                  {showBreakUserDropdown && (
                    <div id="break-user-dropdown" className="absolute top-full mt-1 w-full z-50 max-h-[300px] overflow-auto rounded-md border bg-popover shadow-md">
                      <div className="sticky top-0 z-10 p-2 bg-popover border-b">
                        <Input
                          placeholder="Search workers..."
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div className="p-1">
                        <Button
                          variant={!selectedTargetUser ? "secondary" : "ghost"}
                          className="w-full justify-start text-left mb-1"
                          onClick={() => {
                            handleWorkerSelect(null);
                            setShowBreakUserDropdown(false);
                          }}
                        >
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Myself (Admin)</span>
                        </Button>

                        {filteredUsers.length === 0 ? (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            No workers found
                          </div>
                        ) : (
                          filteredUsers.map(user => (
                            <Button
                              key={user._id}
                              variant={selectedTargetUser === user._id ? "secondary" : "ghost"}
                              className="w-full justify-start text-left mb-1"
                              onClick={() => {
                                handleWorkerSelect(user._id);
                                setShowBreakUserDropdown(false);
                              }}
                            >
                              <div className="flex items-center">
                                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs mr-2">
                                  {user.firstName?.[0]}{user.lastName?.[0]}
                                </div>
                                <span>{user.firstName} {user.lastName}</span>
                              </div>
                            </Button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {selectedTargetUser && (
                  <div className="p-2 bg-muted/50 rounded-md border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                        {orgUsers.find(u => u._id === selectedTargetUser)?.firstName?.[0]}
                        {orgUsers.find(u => u._id === selectedTargetUser)?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {orgUsers.find(u => u._id === selectedTargetUser)?.firstName} {orgUsers.find(u => u._id === selectedTargetUser)?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isBreakOpen ? `Recording break end for this worker` : `Recording break start for this worker`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedTargetUser(null)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Webcam for Break - Enhanced Animation */}
            <div className="relative overflow-hidden rounded-lg border">
              {capturedBreakImage ? (
                <div className="relative w-full">
                  <img
                    src={capturedBreakImage}
                    alt="Captured"
                    className="w-full h-auto aspect-video object-cover"
                  />

                  {/* Enhanced Break Detection Animation Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 to-amber-800/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    {/* Main animation in center */}
                    <div className="relative flex items-center justify-center w-full">
                      <DotLottieReact
                        src="/lottie/facescan.lottie"
                        loop
                        className="h-36 z-10"
                        autoplay
                      />

                      {/* Spinning clock effect for break */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-40 w-40 rounded-full border-4 border-amber-400/50 animate-spin opacity-30" style={{ animationDuration: '3s' }}></div>
                      </div>
                    </div>

                    {/* Progress indicators */}
                    <div className="mt-4 flex flex-col items-center">
                      <div className="text-white font-medium text-sm tracking-wide mb-2">
                        {isBreakOpen ? "Ending your break..." : "Starting your break..."}
                      </div>

                      <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full animate-progressBar"></div>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
                        <span className="text-xs text-white">Verifying your identity</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-auto aspect-video object-cover"
                  videoConstraints={{
                    facingMode: "user"
                  }}
                />
              )}

             
            </div>

            {/* Capture button */}
            <div className="flex justify-center">
              <Button
                onClick={captureImageAndSubmitBreakStart}
                size="lg"
                className={`rounded-full ${isBreakOpen ? "bg-blue-500 hover:bg-blue-600" : "bg-amber-500 hover:bg-amber-600"}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="h-5 w-5" />
                ) : (
                  <Camera className="h-5 w-5 mr-2" />
                )}
                {capturedBreakImage ? "Submit" : "Capture"}
              </Button>
            </div>

            {/* Location info */}
            <div className="flex justify-center">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs ${locationError ? "bg-red-100 text-red-800" :
                isLocationLoading ? "bg-amber-100 text-amber-800" :
                  location ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground"
                }`}>
                <MapPinIcon className={`h-3.5 w-3.5 ${isLocationLoading ? "animate-pulse" : ""}`} />
                <span>
                  {isLocationLoading
                    ? "Getting your location..."
                    : locationError
                      ? locationError
                      : location
                        ? `Lat: ${location.lat.toFixed(6)}, Long: ${location.lng.toFixed(6)}`
                        : "Location unavailable. Please allow location access."
                  }
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 ml-2 px-2"
                  onClick={() => fetchLocation()}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Map Modal */}
      <Dialog open={mapModalOpen} onOpenChange={setMapModalOpen}>
        <DialogContent className="sm:max-w-xl p-6">
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Location Details
          </DialogTitle>
          <Separator />
          <div className="h-[400px] overflow-hidden rounded-md border">
            {mapCoords && (
              <LoadScript googleMapsApiKey="AIzaSyASY9lRvSpjIR2skVaTLd6x7M1Kx2zY-4k">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCoords}
                  zoom={15}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: true,
                  }}
                >
                  <Marker position={mapCoords} />
                </GoogleMap>
              </LoadScript>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Date Range Dialog */}
      <Dialog open={isCustomModalOpen} onOpenChange={setIsCustomModalOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogTitle>Select Custom Date Range</DialogTitle>
          <DialogDescription>
            Choose start and end dates to filter your attendance records
          </DialogDescription>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customDateRange.start && customDateRange.end) {
                handleCustomDateSubmit(customDateRange.start, customDateRange.end);
              }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => setIsStartPickerOpen(true)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {customDateRange.start ? (
                    format(customDateRange.start, "PP")
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => setIsEndPickerOpen(true)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {customDateRange.end ? (
                    format(customDateRange.end, "PP")
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full">Apply Date Range</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Date Picker Modals */}
      <Dialog open={isStartPickerOpen} onOpenChange={setIsStartPickerOpen}>
        <DialogContent className="p-0 max-w-full scale-90 bg-transparent border-none">
          <CustomDatePicker
            selectedDate={customDateRange.start}
            onDateChange={(newDate) => {
              setCustomDateRange(prev => ({ ...prev, start: newDate }));
              setIsStartPickerOpen(false);
            }}
            onCloseDialog={() => setIsStartPickerOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEndPickerOpen} onOpenChange={setIsEndPickerOpen}>
        <DialogContent className="p-0 scale-90 max-w-full bg-transparent border-none">
          <CustomDatePicker
            selectedDate={customDateRange.end}
            onDateChange={(newDate) => {
              setCustomDateRange(prev => ({ ...prev, end: newDate }));
              setIsEndPickerOpen(false);
            }}
            onCloseDialog={() => setIsEndPickerOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Regularization Modal */}
      <Dialog open={isRegularizationModalOpen} onOpenChange={setIsRegularizationModalOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogTitle>Apply for Regularization</DialogTitle>
          <DialogDescription>
            Submit a request to regularize your attendance for a specific date
          </DialogDescription>

          <form onSubmit={handleSubmitRegularization} className="space-y-4">
            {/* Date Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => setIsDatePickerOpen(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {regularizationDate ? (
                  format(parseISO(regularizationDate), "PP")
                ) : (
                  <span className="text-muted-foreground">Select date</span>
                )}
              </Button>
            </div>

            {/* Login Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Login Time</label>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => setIsTimePickerOpen(true)}
              >
                <Clock className="mr-2 h-4 w-4" />
                {regularizationLoginTime ? (
                  formatTimeForDisplay(regularizationLoginTime)
                ) : (
                  <span className="text-muted-foreground">Select login time</span>
                )}
              </Button>
            </div>

            {/* Logout Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Logout Time</label>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => setIsLogoutTimePickerOpen(true)}
              >
                <Clock className="mr-2 h-4 w-4" />
                {regularizationLogoutTime ? (
                  formatTimeForDisplay(regularizationLogoutTime)
                ) : (
                  <span className="text-muted-foreground">Select logout time</span>
                )}
              </Button>
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Remarks</label>
              <Textarea
                value={regularizationRemarks}
                onChange={(e) => setRegularizationRemarks(e.target.value)}
                placeholder="Provide reason for regularization"
                className="min-h-[100px]"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmittingRegularization}
            >
              {isSubmittingRegularization ? <Loader className="mr-2 h-4 w-4" /> : null}
              Submit Regularization
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Time Picker Dialogs */}
      <Dialog open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
        <DialogContent className=" scale-75 w-[550px] bg-transparent border-none">
          <CustomTimePicker
            selectedTime={regularizationLoginTime}
            onTimeChange={handleTimeChange}
            onCancel={handleCancel}
            onAccept={handleAccept}
            onBackToDatePicker={() => setIsTimePickerOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isLogoutTimePickerOpen} onOpenChange={setIsLogoutTimePickerOpen}>
        <DialogContent className=" scale-75 w-[550px] bg-transparent border-none">
          <CustomTimePicker
            selectedTime={regularizationLogoutTime}
            onTimeChange={handleLogoutTimeChange}
            onCancel={handleLogoutCancel}
            onAccept={handleLogoutAccept}
            onBackToDatePicker={() => setIsLogoutTimePickerOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Date Picker for Regularization */}
      <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <DialogContent className="p-6 scale-90 max-w-full bg-transparent border-none">
          <CustomDatePicker
            selectedDate={regularizationDate ? new Date(regularizationDate) : null}
            onDateChange={(newDate) => {
              // Manually extract the local date (year, month, day)
              const localDate = new Date(
                newDate.getTime() - newDate.getTimezoneOffset() * 60000
              ).toISOString().split("T")[0];
              setRegularizationDate(localDate);
              setIsDatePickerOpen(false);
            }}
            onCloseDialog={() => setIsDatePickerOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Face Registration Modal */}
      <Dialog open={isRegisterFaceModalOpen} onOpenChange={setIsRegisterFaceModalOpen}>
        <DialogContent className="sm:max-w-lg p-6">
          <DialogTitle>Register Your Face</DialogTitle>
          <DialogDescription>
            Upload 3 clear photos of your face for attendance verification
          </DialogDescription>

          <div className="space-y-4">
            <div className="bg-muted/50 p-6 rounded-lg border border-dashed border-muted-foreground/50 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
              </div>

              <h3 className="text-lg font-medium mb-2">Upload Face Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please upload exactly 3 clear photos showing your face from different angles
              </p>

              <label className="cursor-pointer">
                <div className="flex items-center justify-center p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-sm">Select Images</span>
                </div>
              </label>
            </div>

            {selectedImages.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Selected Images ({selectedImages.length}/3)</h4>
                <div className="grid grid-cols-3 gap-4">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Face image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full"
                        onClick={() => {
                          const newImages = [...selectedImages];
                          newImages.splice(index, 1);
                          setSelectedImages(newImages);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  {/* Placeholder slots for remaining images */}
                  {Array.from({ length: Math.max(0, 3 - selectedImages.length) }).map((_, i) => (
                    <div
                      key={`placeholder-${i}`}
                      className="border border-dashed rounded-md flex items-center justify-center bg-muted/30 aspect-square"
                    >
                      <Camera className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleFaceRegistrationSubmit}
              className="w-full"
              disabled={selectedImages.length !== 3 || isLoading}
            >
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4" />
              ) : null}
              Submit Face Registration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
