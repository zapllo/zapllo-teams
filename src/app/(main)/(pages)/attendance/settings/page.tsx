'use client'

import CustomTimePicker from '@/components/globals/time-picker'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Loader from '@/components/ui/loader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs2, TabsContent2, TabsList2, TabsTrigger2 } from '@/components/ui/tabs2'
import { Tabs3, TabsContent3, TabsList3, TabsTrigger3 } from '@/components/ui/tabs3'
import { CrossCircledIcon, StopwatchIcon } from '@radix-ui/react-icons'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import axios from 'axios'
import dayjs from 'dayjs'
import { Calendar, CameraIcon, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {}


interface OrgData {
    penaltyOption: "leave" | "salary";
    lateLoginThreshold: number;
    penaltyLeaveType: "half day" | "full day" | "quarter day";
    penaltySalaryAmount: number;
    // New fields for office location and geofencing:
    location?: { lat: number; lng: number };
    allowGeofencing?: boolean;
    geofenceRadius?: number;
    geofenceUnit?: "km" | "m";
}

export default function Settings({ }: Props) {
    const [timezone, setTimezone] = useState<string>("");
    const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);
    const [isReminderEnabled, setIsReminderEnabled] = useState<boolean>(false)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)

    // For controlling the visibility of the Time Picker dialog
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [orgData, setOrgData] = useState<OrgData | null>(null);

    // State to hold the payload pending override confirmation:
    const [pendingPenaltyPayload, setPendingPenaltyPayload] = useState<any>(null);
    // State to control our shadcn AlertDialog:
    const [isOverrideAlertOpen, setIsOverrideAlertOpen] = useState(false);

    // --- New state for Login/Logout Time dialog ---
    const [isLoginLogoutDialogOpen, setIsLoginLogoutDialogOpen] = useState(false)
    const [isPenaltiesDialogOpen, setIsPenaltiesDialogOpen] = useState(false)
    const [loginTime, setLoginTime] = useState<string>('')
    const [logoutTime, setLogoutTime] = useState<string>('')

    // --- New states for opening the custom time pickers for login and logout ---
    const [isLoginTimePickerOpen, setIsLoginTimePickerOpen] = useState(false);
    const [isLogoutTimePickerOpen, setIsLogoutTimePickerOpen] = useState(false);

    // ... inside your component, among other state declarations:
    const [allowGeofencing, setAllowGeofencing] = useState<boolean>(false);
    const [geofenceInput, setGeofenceInput] = useState<string>(""); // raw input from user
    const [selectedUnit, setSelectedUnit] = useState<"km" | "m">("km");

    // New state variables (add these along with your other state declarations)
    const [penaltyOption, setPenaltyOption] = useState<"leave" | "salary">("leave");
    const [lateLoginThreshold, setLateLoginThreshold] = useState<string>(""); // number of times user can be late
    const [penaltyLeaveType, setPenaltyLeaveType] = useState<"half day" | "Full Day" | "quarter day">("half day");
    const [penaltySalaryAmount, setPenaltySalaryAmount] = useState<string>("");


    const mapContainerStyle = {
        width: '100%',
        height: '300px',
    };


    useEffect(() => {
        const fetchOrgData = async () => {
            try {
                const res = await axios.get("/api/organization/getById");
                const org = res.data.data;
                // Save the entire org data if needed:
                setOrgData({
                    location: org.location, // office location
                    allowGeofencing: org.allowGeofencing,
                    geofenceRadius: org.geofenceRadius,
                    geofenceUnit: org.geofenceUnit,
                    penaltyOption: org.penaltyOption,
                    lateLoginThreshold: org.lateLoginThreshold,
                    penaltyLeaveType: org.penaltyLeaveType,
                    penaltySalaryAmount: org.penaltySalaryAmount,
                });
                // Also update the individual states so the inputs are prepopulated:
                setPenaltyOption(org.penaltyOption);
                setLateLoginThreshold(org.lateLoginThreshold.toString());
                setPenaltyLeaveType(org.penaltyLeaveType);
                setPenaltySalaryAmount(org.penaltySalaryAmount.toString());
                // Update location and geofencing states if available
                if (org.location) {
                    setCurrentLocation(org.location);
                }
                if (typeof org.allowGeofencing === "boolean") {
                    setAllowGeofencing(org.allowGeofencing);
                }
                if (org.geofenceRadius) {
                    setGeofenceInput(org.geofenceRadius.toString());
                }
                if (org.geofenceUnit) {
                    setSelectedUnit(org.geofenceUnit);
                }
            } catch (error) {
                console.error("Error fetching organization data", error);
            }
        };
        fetchOrgData();
    }, []);

    // Fetch user's current location
    useEffect(() => {
        if (isLocationDialogOpen) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error fetching location:', error);
                    setCurrentLocation(null); // Handle error case
                }
            );
        }
    }, [isLocationDialogOpen]);

    // NEW: Fetch organization details and update login/logout times (if available)
    useEffect(() => {
        const getOrganizationDetails = async () => {
            try {
                const res = await axios.get("/api/organization/getById");
                const org = res.data.data;
                if (org.loginTime) {
                    setLoginTime(org.loginTime);
                }
                if (org.logoutTime) {
                    setLogoutTime(org.logoutTime);
                }
            } catch (error) {
                console.error("Error fetching organization details:", error);
            }
        };
        getOrganizationDetails();
    }, []);

    const handleSaveLocation = async () => {
        try {
            const payload = {
                location: currentLocation,
                allowGeofencing,
                // Send the raw user input and unit so that the endpoint can compute the radius
                geofenceInput: allowGeofencing ? geofenceInput : 0,
                unit: allowGeofencing ? selectedUnit : "m", // default unit if geofencing is off
            };
            const res = await axios.post("/api/organization/location", payload);
            if (res.data.success) {
                toast.success("Office Location and geofencing settings updated successfully");
                setIsLocationDialogOpen(false);
            } else {
                toast.error(res.data.message || "Failed to update settings");
            }
        } catch (error) {
            console.error("Error updating settings:", error);
            toast.error("Error updating settings");
        }
    };

    const updatePenaltyConfig = async (payload: any) => {
        try {
            const res = await axios.patch("/api/organization/penalty-config", payload);
            if (res.data.success) {
                toast.success("Penalty configuration updated successfully");
                setIsPenaltiesDialogOpen(false);
                // Optionally update orgData with the new configuration:
                setOrgData({
                    penaltyOption: payload.penaltyOption,
                    lateLoginThreshold: payload.lateLoginThreshold || 0,
                    penaltyLeaveType: payload.penaltyLeaveType || "",
                    penaltySalaryAmount: payload.penaltySalaryAmount || 0,
                });
            } else {
                toast.error(res.data.message || "Failed to update penalty configuration");
            }
        } catch (error) {
            console.error("Error updating penalty configuration:", error);
            toast.error("Error updating penalty configuration");
        }
    };

    const handleSavePenaltyConfig = async () => {
        // Build the payload based on the penalty option selected
        const payload = {
            penaltyOption,
            // Always include lateLoginThreshold for both options
            lateLoginThreshold: Number(lateLoginThreshold),
            // Only include penaltyLeaveType if leave penalties are selected
            penaltyLeaveType: penaltyOption === "leave" ? penaltyLeaveType : undefined,
            // Only include penaltySalaryAmount if salary penalties are selected
            penaltySalaryAmount: penaltyOption === "salary" ? Number(penaltySalaryAmount) : undefined,
        };

        if (orgData) {
            let isDifferent = false;

            // Check if the penalty option is different
            if (payload.penaltyOption !== orgData.penaltyOption) {
                isDifferent = true;
            } else if (payload.penaltyOption === "leave") {
                // For leave penalties, check the threshold and leave type
                if (
                    Number(payload.lateLoginThreshold) !== orgData.lateLoginThreshold ||
                    payload.penaltyLeaveType !== orgData.penaltyLeaveType
                ) {
                    isDifferent = true;
                }
            } else if (payload.penaltyOption === "salary") {
                // For salary penalties, check both the threshold and the salary amount
                if (
                    Number(payload.lateLoginThreshold) !== orgData.lateLoginThreshold ||
                    Number(payload.penaltySalaryAmount) !== orgData.penaltySalaryAmount
                ) {
                    isDifferent = true;
                }
            }

            if (isDifferent) {
                // Instead of window.confirm, use the shadcn-ui AlertDialog:
                setPendingPenaltyPayload(payload);
                setIsOverrideAlertOpen(true);
                return; // Wait for user confirmation
            }
        }

        // If no differences, or if user has already confirmed, proceed with the update.
        await updatePenaltyConfig(payload);
    };




    // Fetch the current daily report time
    useEffect(() => {
        const fetchReportTime = async () => {
            try {
                const response = await fetch('/api/reports/daily-attendance-time');
                const data = await response.json();
                if (data.success) {
                    setSelectedTime(data.dailyAttendanceReportTime);
                }
            } catch (error) {
                console.error('Failed to fetch report time:', error);
            }
        };

        fetchReportTime();

        // Set timezone options
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(detectedTimezone);
        setAvailableTimezones(Intl.supportedValuesOf("timeZone"));
    }, []);

    const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTimezone(e.target.value)
    }

    const handleSwitchChange = (checked: boolean) => {
        setIsReminderEnabled(checked)
    }
    const handleTimeChange = (time: string) => {
        // Convert the 12-hour time format (hh:mm A) to 24-hour format (HH:mm)
        const formattedTime = dayjs(`1970-01-01T${time}:00`, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm');
        setSelectedTime(formattedTime);  // Update the selected time with the new format
    }

    const handleTimeCancel = () => {
        setSelectedTime(null) // Reset the time when canceled
        setIsTimePickerOpen(false); // Close the time picker dialog
    }

    const handleTimeAccept = async () => {
        // Update the report time in the backend
        try {
            const response = await fetch('/api/reports/daily-attendance-time', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newReportTime: selectedTime }),
            });
            const data = await response.json();
            if (data.success) {
                setIsTimePickerOpen(false);
            } else {
                console.error('Failed to update report time:', data.message);
            }
        } catch (error) {
            console.error('Failed to update report time:', error);
        }
    }

    // --- New handler for saving login/logout time ---
    const handleSaveLoginLogoutTime = async () => {
        try {
            const response = await fetch('/api/organization/login-logout-time', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    loginTime,
                    logoutTime,
                }),
            })
            const data = await response.json()
            if (data.success) {
                toast.success('Login/Logout time updated successfully')
                setIsLoginLogoutDialogOpen(false)
            } else {
                toast.error(data.message || 'Failed to update login/logout time')
            }
        } catch (error) {
            console.error('Error updating login/logout time:', error)
            toast.error('Error updating login/logout time')
        }
    }


    return (
        <div className='pt-4 w-full max-w-screen  overflow-y-scroll scrollbar-hide h-full '>
            <div className=' bg-[#0B0D29] px-4   mx-2  p-2 border rounded-xl '>
                <h1 className='text-md text-muted-foreground'>Leave Types</h1>
            </div>
            <Link href='/attendance/settings/leave-types'>
                <div className='mb-2 cursor-pointer flex items-center  justify-between gap-1   my-4 mx-2 p-2 w-   m border-b rounded py-2'>
                    <div className='flex gap-1 justify-between'>
                        {/* <Calendar className='h-4' /> */}
                        <h1 className=' text-sm px-2 mt-[1px] '>Add your Leave Types</h1>
                    </div>
                    <ChevronRight className='h-5' />
                </div>
            </Link>
            <div className=' mt-4 bg-[#0B0D29]   my-4 mx-2 p-2 border rounded-xl px-4'>
                <h1 className='text-md text-muted-foreground'>Attendance Settings</h1>
            </div>
            <Link href='/attendance/settings/register-faces'>
                <div className='mb-2 flex justify-between gap-1  cursor-pointer  my-4 mx-2 p-2 w- m border-b rounded py-2'>
                    {/* <CameraIcon className='h-4' /> */}
                    <h1 className=' text-sm px-2 '>
                        Setup Face Registration</h1>
                    <ChevronRight className='h-5' />
                </div>
            </Link>
            <Dialog>
                <DialogTrigger asChild>

                    <div className='mb-2 flex justify-between gap-1 cursor-pointer   my-4 mx-2 p-2 w- m border-b rounded py-2'>
                        {/* <StopwatchIcon className='h-4 ml-1' /> */}
                        <h1 className=' text-sm px-2'>Setup Reminders</h1>
                        <ChevronRight className='h-5 ' />
                    </div>
                </DialogTrigger>

                {/* Dialog Content */}
                <DialogContent className="">
                    <DialogHeader >
                        <div className='flex  justify-between w-full'>
                            <DialogTitle className='p-6'>Reminders</DialogTitle>
                            <DialogClose className="px-6 py-2">
                                <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                            </DialogClose>
                        </div>
                    </DialogHeader>
                    <div className="px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1>Daily Attendance Report</h1>
                            </div>
                            <div>
                                <Switch
                                    checked={isReminderEnabled}
                                    onCheckedChange={handleSwitchChange}
                                />
                            </div>
                        </div>


                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <h1>Daily Attendance Report Time</h1>
                                <div className="text-sm">
                                    {selectedTime || "No time set"}
                                </div>
                            </div>
                            <Avatar
                                className="bg-[#815BF5] h-9 w-9  flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                                onClick={() => setIsTimePickerOpen(true)}
                            >
                                <StopwatchIcon className="h-6 w-6 text-white" />
                            </Avatar>

                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <h1>Timezone</h1>
                            </div>
                            <div>
                                <label className="absolute bg-[#0b0d29] ml-2 text-xs text-[#787CA5] -mt-2 px-1">
                                    Timezone
                                </label>
                                <select
                                    value={timezone}
                                    onChange={handleTimezoneChange}
                                    className="w-full border bg-[#0B0D29] text-sm overflow-y-scroll scrollbar-thin scrollbar-thumb-[#815BF5] hover:scrollbar-thumb-[#815BF5] active:scrollbar-thumb-[#815BF5] scrollbar-track-gray-800   p-2 rounded bg-transparent outline-none focus-within:border-[#815BF5]"
                                >
                                    {availableTimezones.map((tz) => (
                                        <option className="bg-[#0B0D29] text-sm" key={tz} value={tz}>
                                            {tz}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className='p-6'>
                        <DialogClose asChild>
                            <Button className="w-full bg-[#815bf5] ">Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Time Picker Dialog */}
            <Dialog open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
                <DialogContent className="p-6 scale-75">


                    <CustomTimePicker
                        selectedTime={selectedTime}
                        onTimeChange={handleTimeChange}
                        onCancel={handleTimeCancel}
                        onAccept={handleTimeAccept}
                        onBackToDatePicker={() => { }}
                    />


                </DialogContent>
            </Dialog>

            <div className=' bg-[#0B0D29] px-4  mt-4 mx-2  my-4  p-2 border rounded-xl '>

                <h1 className='text-md text-muted-foreground'>Office Settings</h1>
            </div>
            <div onClick={() => setIsLoginLogoutDialogOpen(true)} className='mb-2 flex justify-between gap-1  cursor-pointer  my-4 mx-2 p-2 w- m border-b rounded py-2'>
                {/* <CameraIcon className='h-4' /> */}
                <h1 className=' text-sm px-2 '>
                    Set Login-Logout Time</h1>
                <ChevronRight className='h-5' />
            </div>

            <div onClick={() => setIsPenaltiesDialogOpen(true)} className='mb-2 flex justify-between gap-1  cursor-pointer  my-4 mx-2 p-2 w- m border-b rounded py-2'>
                {/* <CameraIcon className='h-4' /> */}
                <h1 className=' text-sm px-2 '>
                    Set Penalties</h1>
                <ChevronRight className='h-5' />
            </div>

            <Dialog open={isPenaltiesDialogOpen} onOpenChange={setIsPenaltiesDialogOpen}>
                <DialogContent className="p-6">
                    <DialogHeader className=''>
                        <div className='flex justify-between items-center'>
                            <DialogTitle
                            >
                                Set Penalties
                                <p className='text-xs text-muted-foreground font-thin'>You can either select the leave or salary penalty type</p>
                            </DialogTitle>
                            <DialogClose>
                                <CrossCircledIcon className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                            </DialogClose>
                        </div>
                    </DialogHeader>
                    {/* Penalty Configuration Section (from previous snippet) */}
                    <div className="">
                        <AlertDialog open={isOverrideAlertOpen} onOpenChange={setIsOverrideAlertOpen}>
                            <AlertDialogOverlay className='z-[100]' />
                            <AlertDialogContent className='z-[100] '>
                                <AlertDialogTitle>Confirm Override</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will override your current penalty configuration. Are you sure you want to proceed?
                                </AlertDialogDescription>
                                <div className="flex justify-end gap-2 mt-4">
                                    <AlertDialogCancel onClick={() => setIsOverrideAlertOpen(false)}>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                        setIsOverrideAlertOpen(false);
                                        updatePenaltyConfig(pendingPenaltyPayload);
                                    }}>
                                        Confirm
                                    </AlertDialogAction>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Tabs3
                            value={penaltyOption}
                            onValueChange={(value) => setPenaltyOption(value as "leave" | "salary")}
                            className=""
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-white">Select Penalty Type</h3>
                                <TabsList3 className="flex gap-4 w-fit">
                                    <TabsTrigger3 value="leave" className={penaltyOption === "leave" ? "bg-primary text-white" : ""}>
                                        Leave
                                    </TabsTrigger3>
                                    <TabsTrigger3 value="salary" className={penaltyOption === "salary" ? "bg-primary text-white" : ""}>
                                        Salary
                                    </TabsTrigger3>
                                </TabsList3>
                            </div>
                            <TabsContent3 value="leave" className="mt-4">
                                <div className="mb-3">
                                    <label className="block text-sm text-white">No. of Late Logins Allowed</label>
                                    <input
                                        type="number"
                                        value={lateLoginThreshold}
                                        onChange={(e) => setLateLoginThreshold(e.target.value)}
                                        className="mt-1 p-2 w-full bg-transparent border rounded-lg text-sm outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white">Penalty Leave Deduction Type</label>
                                    <Select
                                        value={penaltyLeaveType}
                                        onValueChange={(value) =>
                                            setPenaltyLeaveType(value as "half day" | "Full Day" | "quarter day")
                                        }
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select penalty leave type" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[100]">
                                            <SelectItem className='z-[100] hover:bg-accent' value="quarter day">Quarter Day</SelectItem>
                                            <SelectItem value="half day" className='hover:bg-accent'>Half Day</SelectItem>
                                            <SelectItem value="Full Day" className='hover:bg-accent'>Full Day</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent3>
                            <TabsContent3 value="salary" className="mt-4">
                                <div className="mb-3">
                                    <label className="block text-sm text-white">No. of Late Logins Allowed</label>
                                    <input
                                        type="number"
                                        value={lateLoginThreshold}
                                        onChange={(e) => setLateLoginThreshold(e.target.value)}
                                        className="mt-1 p-2 w-full bg-transparent border rounded-lg text-sm outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white">Salary Amount Deduction</label>
                                    <input
                                        type="number"
                                        value={penaltySalaryAmount}
                                        onChange={(e) => setPenaltySalaryAmount(e.target.value)}
                                        placeholder="Enter penalty amount"
                                        className="mt-1 p-2 w-full bg-transparent border rounded-lg text-sm outline-none focus:border-primary"
                                    />
                                </div>
                            </TabsContent3>
                        </Tabs3>

                    </div>

                    <DialogFooter className="mt-4">
                        <Button onClick={handleSavePenaltyConfig} className="w-full bg-[#815bf5]">
                            Save Penalty Configuration
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Login-Logout Dialog */}
            <Dialog open={isLoginLogoutDialogOpen} onOpenChange={setIsLoginLogoutDialogOpen}>
                <DialogContent className="p-6">
                    <DialogHeader className=''>
                        <div className='flex justify-between items-center'>
                            <DialogTitle>Set Login-Logout Time & Penalties</DialogTitle>
                            <DialogClose>
                                <CrossCircledIcon className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                            </DialogClose>
                        </div>
                    </DialogHeader>
                    <div className="mt-4 flex flex-col gap-4">
                        {/* Clickable field for Login Time */}
                        <div className="cursor-pointer border p-2 rounded" onClick={() => setIsLoginTimePickerOpen(true)}>
                            <label className="block text-sm font-medium text-muted-foreground">Login Time</label>
                            <div className="mt-1 text-lg">{loginTime ? dayjs(`1970-01T${loginTime}:00`).format("hh:mm A") : "Not set"}</div>
                        </div>
                        {/* Clickable field for Logout Time */}
                        <div className="cursor-pointer border p-2 rounded" onClick={() => setIsLogoutTimePickerOpen(true)}>
                            <label className="block text-sm font-medium text-muted-foreground">Logout Time</label>
                            <div className="mt-1 text-lg">{logoutTime ? dayjs(`1970-01T${logoutTime}:00`).format("hh:mm A") : "Not set"}</div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button onClick={handleSaveLoginLogoutTime} className="w-full bg-[#815bf5]">
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Custom Time Picker Dialog for Login Time */}
            <Dialog open={isLoginTimePickerOpen} onOpenChange={setIsLoginTimePickerOpen}>
                <DialogContent className="p-6 scale-75">
                    <CustomTimePicker
                        selectedTime={loginTime}
                        onTimeChange={(time) => setLoginTime(time)}
                        onCancel={() => setIsLoginTimePickerOpen(false)}
                        onAccept={() => setIsLoginTimePickerOpen(false)}
                        onBackToDatePicker={() => { }}
                    />
                </DialogContent>
            </Dialog>

            {/* Custom Time Picker Dialog for Logout Time */}
            <Dialog open={isLogoutTimePickerOpen} onOpenChange={setIsLogoutTimePickerOpen}>
                <DialogContent className="p-6 scale-75">
                    <CustomTimePicker
                        selectedTime={logoutTime}
                        onTimeChange={(time) => setLogoutTime(time)}
                        onCancel={() => setIsLogoutTimePickerOpen(false)}
                        onAccept={() => setIsLogoutTimePickerOpen(false)}
                        onBackToDatePicker={() => { }}
                    />
                </DialogContent>
            </Dialog>



            <div onClick={() => setIsLocationDialogOpen(true)} className='mb-2 flex justify-between gap-1 cursor-pointer    my-4 mx-2 p-2 w- m border-b rounded py-2'>
                {/* <StopwatchIcon className='h-4 ml-1' /> */}
                <h1 className=' text-sm px-2'>Office Location</h1>
                <ChevronRight className='h-5 ' />
            </div>

            <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                <DialogContent className="p-6">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle>Set Office Location</DialogTitle>
                            <DialogClose>
                                <CrossCircledIcon className="scale-150 cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                            </DialogClose>
                        </div>
                    </DialogHeader>
                    <div className="mt-4">
                        {currentLocation ? (
                            <LoadScript googleMapsApiKey="AIzaSyASY9lRvSpjIR2skVaTLd6x7M1Kx2zY-4k">
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={currentLocation}
                                    zoom={13}
                                    options={{ disableDefaultUI: true, zoomControl: true }}
                                >
                                    <Marker position={currentLocation} />
                                </GoogleMap>
                            </LoadScript>
                        ) : (
                            <Loader />
                        )}
                    </div>
                    {/* Geofencing Section */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Allow Geofencing</span>
                            <Switch checked={allowGeofencing} onCheckedChange={setAllowGeofencing} />
                        </div>
                        {allowGeofencing && (
                            <div className="mt-4">
                                <Tabs3 defaultValue="km" className=''>
                                    <TabsList3 className='gap-2'>
                                        <TabsTrigger3
                                            value="km"
                                            onClick={() => setSelectedUnit("km")}
                                            className={selectedUnit === "km" ? "bg-primary text-white" : ""}
                                        >
                                            Kilometers
                                        </TabsTrigger3>
                                        <TabsTrigger3
                                            value="m"
                                            onClick={() => setSelectedUnit("m")}
                                            className={selectedUnit === "m" ? "bg-primary text-white" : ""}
                                        >
                                            Meters
                                        </TabsTrigger3>
                                    </TabsList3>
                                    <TabsContent3 value="km">
                                        <input
                                            type="number"
                                            value={geofenceInput}
                                            onChange={(e) => setGeofenceInput(e.target.value)}
                                            placeholder="Enter radius in kilometers"
                                            className="mt-2 w-full rounded bg-transparent outline-none focus:border-primary border p-2"
                                        />
                                    </TabsContent3>
                                    <TabsContent3 value="m">
                                        <input
                                            type="number"
                                            value={geofenceInput}
                                            onChange={(e) => setGeofenceInput(e.target.value)}
                                            placeholder="Enter radius in meters"
                                            className="mt-2 w-full rounded outline-none focus:border-primary bg-transparent  border p-2"
                                        />
                                    </TabsContent3>
                                </Tabs3>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="mt-4">
                        <Button onClick={handleSaveLocation} className="w-full bg-[#815bf5]">
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <div className=' bg-[#0B0D29] px-4  mt-4 mx-2  my-4  p-2 border rounded-xl '>

                <h1 className='text-md text-muted-foreground'>Payslip Settings</h1>
            </div>
            <Link href='/attendance/settings/payslip-details'>
                <div className='mb-12 flex justify-between gap-1  cursor-pointer  my-4 mx-2 p-2 w- m border-b rounded py-2'>
                    {/* <CameraIcon className='h-4' /> */}
                    <h1 className=' text-sm px-2 '>
                        Set Payslip Details</h1>
                    <ChevronRight className='h-5' />
                </div>
            </Link>
        </div>
    )
}