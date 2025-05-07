'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import Link from 'next/link'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

// UI Components
import CustomTimePicker from '@/components/globals/time-picker'
import Loader from '@/components/ui/loader'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs3, TabsContent3, TabsList3, TabsTrigger3 } from '@/components/ui/tabs3'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogOverlay, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

// Icons
import { CrossCircledIcon, StopwatchIcon } from '@radix-ui/react-icons'
import {
    Calendar, Clock, ChevronRight, MapPin, Timer, Bell,
    Shield, CreditCard, ArrowRight, User, AlertTriangle,
    Settings2
} from 'lucide-react'

// Types
interface IUser {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    reminders: {
        email: boolean;
    };
}

interface OrgData {
    penaltyOption: "leave" | "salary";
    lateLoginThreshold: number;
    penaltyLeaveType: "half day" | "full day" | "quarter day";
    penaltySalaryAmount: number;
    location?: { lat: number; lng: number };
    allowGeofencing?: boolean;
    geofenceRadius?: number;
    geofenceUnit?: "km" | "m";
}

type SettingsSectionProps = {
    title: string;
    icon: React.ReactNode;
    description: string;
    onClick?: () => void;
    linkHref?: string;
    badge?: string;
}

export default function Settings({ }: {}) {
    // State management
    const [timezone, setTimezone] = useState<string>("")
    const [availableTimezones, setAvailableTimezones] = useState<string[]>([])
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
    const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [orgData, setOrgData] = useState<OrgData | null>(null)
    const [pendingPenaltyPayload, setPendingPenaltyPayload] = useState<any>(null)
    const [isOverrideAlertOpen, setIsOverrideAlertOpen] = useState(false)
    const [isLoginLogoutDialogOpen, setIsLoginLogoutDialogOpen] = useState(false)
    const [isPenaltiesDialogOpen, setIsPenaltiesDialogOpen] = useState(false)
    const [loginTime, setLoginTime] = useState<string>('')
    const [logoutTime, setLogoutTime] = useState<string>('')
    const [isLoginTimePickerOpen, setIsLoginTimePickerOpen] = useState(false)
    const [isLogoutTimePickerOpen, setIsLogoutTimePickerOpen] = useState(false)
    const [allowGeofencing, setAllowGeofencing] = useState<boolean>(false)
    const [geofenceInput, setGeofenceInput] = useState<string>("")
    const [selectedUnit, setSelectedUnit] = useState<"km" | "m">("km")
    const [user, setUser] = useState<IUser | null>(null)
    const [penaltyOption, setPenaltyOption] = useState<"leave" | "salary">("leave")
    const [lateLoginThreshold, setLateLoginThreshold] = useState<string>("")
    const [penaltyLeaveType, setPenaltyLeaveType] = useState<"half day" | "Full Day" | "quarter day">("half day")
    const [penaltySalaryAmount, setPenaltySalaryAmount] = useState<string>("")
    const [isReminderEnabled, setIsReminderEnabled] = useState(false)
    const [loading, setLoading] = useState(true)
    const [reminderDialogOpen, setReminderDialogOpen] = useState(false)

    const mapContainerStyle = {
        width: '100%',
        height: '300px',
    }

    // Fetch organization data
    useEffect(() => {
        const fetchOrgData = async () => {
            try {
                const res = await axios.get("/api/organization/getById")
                const org = res.data.data
                setOrgData({
                    location: org.location,
                    allowGeofencing: org.allowGeofencing,
                    geofenceRadius: org.geofenceRadius,
                    geofenceUnit: org.geofenceUnit,
                    penaltyOption: org.penaltyOption,
                    lateLoginThreshold: org.lateLoginThreshold,
                    penaltyLeaveType: org.penaltyLeaveType,
                    penaltySalaryAmount: org.penaltySalaryAmount,
                })

                setPenaltyOption(org.penaltyOption)
                setLateLoginThreshold(org.lateLoginThreshold?.toString() || "")
                setPenaltyLeaveType(org.penaltyLeaveType)
                setPenaltySalaryAmount(org.penaltySalaryAmount?.toString() || "")

                if (org.location) {
                    setCurrentLocation(org.location)
                }
                if (typeof org.allowGeofencing === "boolean") {
                    setAllowGeofencing(org.allowGeofencing)
                }
                if (org.geofenceRadius) {
                    setGeofenceInput(org.geofenceRadius.toString())
                }
                if (org.geofenceUnit) {
                    setSelectedUnit(org.geofenceUnit)
                }
            } catch (error) {
                console.error("Error fetching organization data", error)
            }
        }
        fetchOrgData()
    }, [])

    // Fetch user's current location
    useEffect(() => {
        if (isLocationDialogOpen && !currentLocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                },
                (error) => {
                    console.error('Error fetching location:', error)
                    setCurrentLocation(null)
                }
            )
        }
    }, [isLocationDialogOpen, currentLocation])

    // Fetch organization login/logout times
    useEffect(() => {
        const getOrganizationDetails = async () => {
            try {
                const res = await axios.get("/api/organization/getById")
                const org = res.data.data
                if (org.loginTime) {
                    setLoginTime(org.loginTime)
                }
                if (org.logoutTime) {
                    setLogoutTime(org.logoutTime)
                }
            } catch (error) {
                console.error("Error fetching organization details:", error)
            }
        }
        getOrganizationDetails()
    }, [])

    // Fetch daily report time
    useEffect(() => {
        const fetchReportTime = async () => {
            try {
                const response = await fetch('/api/reports/daily-attendance-time', {
                    credentials: 'include'
                })
                const data = await response.json()
                if (data.success) {
                    setSelectedTime(data.dailyAttendanceReportTime)
                }
            } catch (error) {
                console.error('Failed to fetch report time:', error)
            }
        }

        fetchReportTime()

        // Set timezone options
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        setTimezone(detectedTimezone)
        setAvailableTimezones(Intl.supportedValuesOf("timeZone"))
    }, [])

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("/api/users/me")
                setUser(response.data.data)
                if (response.data?.data?.reminders?.email !== undefined) {
                    setIsReminderEnabled(response.data?.data?.reminders.email)
                }
            } catch (error) {
                console.error("Error fetching user data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    // Event handlers
    const handleTimezoneChange = (value: string) => {
        setTimezone(value)
    }

    const handleTimeChange = (time: string) => {
        const formattedTime = dayjs(`1970-01-01T${time}:00`, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm')
        setSelectedTime(formattedTime)
    }

    const handleTimeCancel = () => {
        setSelectedTime(null)
        setIsTimePickerOpen(false)
    }

    const handleTimeAccept = async () => {
        try {
            const response = await fetch('/api/reports/daily-attendance-time', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ newReportTime: selectedTime }),
            })
            const data = await response.json()
            if (data.success) {
                setIsTimePickerOpen(false)
                toast.success("Report time updated successfully")
            } else {
                toast.error(data.message || 'Failed to update report time')
            }
        } catch (error) {
            console.error('Failed to update report time:', error)
            toast.error("Failed to update report time")
        }
    }

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

    const handleSaveLocation = async () => {
        try {
            const payload = {
                location: currentLocation,
                allowGeofencing,
                geofenceInput: allowGeofencing ? geofenceInput : 0,
                unit: allowGeofencing ? selectedUnit : "m",
            }
            const res = await axios.post("/api/organization/location", payload)
            if (res.data.success) {
                toast.success("Office location and geofencing settings updated successfully")
                setIsLocationDialogOpen(false)
            } else {
                toast.error(res.data.message || "Failed to update settings")
            }
        } catch (error) {
            console.error("Error updating settings:", error)
            toast.error("Error updating settings")
        }
    }

    const updatePenaltyConfig = async (payload: any) => {
        try {
            const res = await axios.patch("/api/organization/penalty-config", payload)
            if (res.data.success) {
                toast.success("Penalty configuration updated successfully")
                setIsPenaltiesDialogOpen(false)
                setOrgData({
                    penaltyOption: payload.penaltyOption,
                    lateLoginThreshold: payload.lateLoginThreshold || 0,
                    penaltyLeaveType: payload.penaltyLeaveType || "",
                    penaltySalaryAmount: payload.penaltySalaryAmount || 0,
                })
            } else {
                toast.error(res.data.message || "Failed to update penalty configuration")
            }
        } catch (error) {
            console.error("Error updating penalty configuration:", error)
            toast.error("Error updating penalty configuration")
        }
    }

    const handleSavePenaltyConfig = async () => {
        const payload = {
            penaltyOption,
            lateLoginThreshold: Number(lateLoginThreshold),
            penaltyLeaveType: penaltyOption === "leave" ? penaltyLeaveType : undefined,
            penaltySalaryAmount: penaltyOption === "salary" ? Number(penaltySalaryAmount) : undefined,
        }

        if (orgData) {
            let isDifferent = false

            if (payload.penaltyOption !== orgData.penaltyOption) {
                isDifferent = true
            } else if (payload.penaltyOption === "leave") {
                if (
                    Number(payload.lateLoginThreshold) !== orgData.lateLoginThreshold ||
                    payload.penaltyLeaveType !== orgData.penaltyLeaveType
                ) {
                    isDifferent = true
                }
            } else if (payload.penaltyOption === "salary") {
                if (
                    Number(payload.lateLoginThreshold) !== orgData.lateLoginThreshold ||
                    Number(payload.penaltySalaryAmount) !== orgData.penaltySalaryAmount
                ) {
                    isDifferent = true
                }
            }

            if (isDifferent) {
                setPendingPenaltyPayload(payload)
                setIsOverrideAlertOpen(true)
                return
            }
        }

        await updatePenaltyConfig(payload)
    }

    const handleSwitchChange = async (checked: boolean) => {
        setIsReminderEnabled(checked)

        try {
            const response = await axios.patch("/api/users/update", {
                _id: user?._id,
                reminders: {
                    email: checked,
                },
            })

            if (!response.data.success) {
                throw new Error("Failed to update reminders")
            }
            toast.success("Reminder settings updated successfully")
        } catch (error) {
            console.error("Error updating reminder:", error)
            setIsReminderEnabled((prev) => !prev)
            toast.error("Failed to update reminder settings")
        }
    }

    const handleSaveReminderSettings = () => {
        toast.success("Reminder settings saved successfully")
        setReminderDialogOpen(false)
    }

    // Custom component for settings section
    const SettingsSection = ({ title, icon, description, onClick, linkHref, badge }: SettingsSectionProps) => {
        const content = (
            <Card className="relative cursor-pointer hover:shadow-md transition-all duration-300 border border-muted">
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="text-primary p-2 rounded-full bg-primary/10">
                            {icon}
                        </div>
                        <div>
                            <h3 className="font-medium text-sm">{title}</h3>
                            <p className="text-xs text-muted-foreground">{description}</p>
                        </div>
                    </div>
                    {badge && (
                        <Badge variant="outline" className="absolute top-2 right-2 text-xs">
                            {badge}
                        </Badge>
                    )}
                    {/* <ChevronRight className="h-5 w-5 text-muted-foreground" /> */}
                </CardContent>
            </Card>
        )

        if (linkHref) {
            return <Link href={linkHref}>{content}</Link>
        }

        return <div onClick={onClick}>{content}</div>
    }

    return (
        <div className='w-full h-full p-6 space-y-8 overflow-y-auto'>
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Configure your attendance and organization settings</p>
            </div>

            <Separator />

            {/* Leave Types Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-medium">Leave Management</h2>
                </div>

                <SettingsSection
                    title="Leave Types"
                    icon={<Calendar className="h-4 w-4" />}
                    description="Configure available leave types for your organization"
                    linkHref="/attendance/settings/leave-types"
                />
            </section>

            <Separator />

            {/* Attendance Settings Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-medium">Attendance Management</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <SettingsSection
                        title="Face Registration"
                        icon={<User className="h-4 w-4" />}
                        description="Set up face recognition for attendance tracking"
                        linkHref="/attendance/settings/register-faces"
                    />

                    <SettingsSection
                        title="Attendance Reminders"
                        icon={<Bell className="h-4 w-4" />}
                        description="Configure automated attendance notifications"
                        onClick={() => setReminderDialogOpen(true)}
                    />
                </div>
            </section>

            <Separator />

            {/* Office Settings Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-medium">Office Configuration</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <SettingsSection
                        title="Working Hours"
                        icon={<Clock className="h-4 w-4" />}
                        description="Set standard login and logout times"
                        onClick={() => setIsLoginLogoutDialogOpen(true)}
                        badge={loginTime ? `${dayjs(`1970-01T${loginTime}:00`).format("h:mm A")} - ${dayjs(`1970-01T${logoutTime}:00`).format("h:mm A")}` : "Not Set"}
                    />

                    <SettingsSection
                        title="Attendance Penalties"
                        icon={<AlertTriangle className="h-4 w-4" />}
                        description="Configure late arrival and absence penalties"
                        onClick={() => setIsPenaltiesDialogOpen(true)}
                        badge={penaltyOption === "leave" ? "Leave Deduction" : "Salary Deduction"}
                    />

                    <SettingsSection
                        title="Office Location"
                        icon={<MapPin className="h-4 w-4" />}
                        description="Set office location and geofencing options"
                        onClick={() => setIsLocationDialogOpen(true)}
                        badge={allowGeofencing ? `Geofencing: ${geofenceInput}${selectedUnit}` : "No Geofencing"}
                    />

                    <SettingsSection
                        title="Payslip Settings"
                        icon={<CreditCard className="h-4 w-4" />}
                        description="Configure payslip details and calculation rules"
                        linkHref="/attendance/settings/payslip-details"
                    />
                </div>
            </section>

            {/* Reminder Dialog */}
            <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
                <DialogContent className="sm:max-w-[425px] z-[100] p-6">
                    <DialogHeader>
                        <div className='flex justify-between'>
                            <DialogTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                Reminder Settings
                            </DialogTitle>
                            <DialogClose>
                                <CrossCircledIcon className="scale-150  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                            </DialogClose>
                        </div>

                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h4 className="font-medium">Daily Attendance Report</h4>
                                <p className="text-sm text-muted-foreground">Receive daily attendance summaries via email</p>
                            </div>
                            <Switch checked={isReminderEnabled} onCheckedChange={handleSwitchChange} />
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-medium">Report Time</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedTime
                                            ? dayjs(`1970-01-01T${selectedTime}:00`).format('hh:mm A')
                                            : "No time set"}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setIsTimePickerOpen(true)}
                                    className="h-9 w-9"
                                >
                                    <Clock className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Timezone</label>
                                <Select value={timezone} onValueChange={handleTimezoneChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px] z-[100]">
                                        {availableTimezones.map((tz) => (
                                            <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSaveReminderSettings} className="w-full">
                            Save Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Time Picker Dialog */}
            <Dialog open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
                <DialogContent className="p-6 scale-75 bg-[#0a0d28] dark:bg-[#0a0d28]">
                    <CustomTimePicker
                        selectedTime={selectedTime}
                        onTimeChange={handleTimeChange}
                        onCancel={handleTimeCancel}
                        onAccept={handleTimeAccept}
                        onBackToDatePicker={() => { }}
                    />
                </DialogContent>
            </Dialog>

            {/* Login-Logout Dialog */}
            <Dialog open={isLoginLogoutDialogOpen} onOpenChange={setIsLoginLogoutDialogOpen}>
                <DialogContent className='p-6 z-[100]'>
                    <div className='flex justify-between'>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Set Working Hours
                        </DialogTitle>
                    </DialogHeader>
                    <DialogClose>
                        <CrossCircledIcon className="scale-150  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                    </DialogClose>
                    </div>
                    <div className="grid gap-4 py-4">
                        <Card className="cursor-pointer hover:border-primary" onClick={() => setIsLoginTimePickerOpen(true)}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <h3 className="font-medium">Login Time</h3>
                                    <p className="text-2xl font-semibold text-primary">
                                        {loginTime ? dayjs(`1970-01T${loginTime}:00`).format("hh:mm A") : "Not set"}
                                    </p>
                                </div>
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Clock className="h-5 w-5 text-primary" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:border-primary" onClick={() => setIsLogoutTimePickerOpen(true)}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <h3 className="font-medium">Logout Time</h3>
                                    <p className="text-2xl font-semibold text-primary">
                                        {logoutTime ? dayjs(`1970-01T${logoutTime}:00`).format("hh:mm A") : "Not set"}
                                    </p>
                                </div>
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Timer className="h-5 w-5 text-primary" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSaveLoginLogoutTime} className="w-full">
                            Save Working Hours
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Custom Time Picker Dialogs */}
            <Dialog open={isLoginTimePickerOpen} onOpenChange={setIsLoginTimePickerOpen}>
                <DialogContent className="p-6 scale-75 bg-[#0a0d28] dark:bg-[#0a0d28]">
                    <CustomTimePicker
                        selectedTime={loginTime}
                        onTimeChange={(time) => setLoginTime(time)}
                        onCancel={() => setIsLoginTimePickerOpen(false)}
                        onAccept={() => setIsLoginTimePickerOpen(false)}
                        onBackToDatePicker={() => { }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={isLogoutTimePickerOpen} onOpenChange={setIsLogoutTimePickerOpen}>
                <DialogContent className="p-6 scale-75 bg-[#0a0d28] dark:bg-[#0a0d28]">
                    <CustomTimePicker
                        selectedTime={logoutTime}
                        onTimeChange={(time) => setLogoutTime(time)}
                        onCancel={() => setIsLogoutTimePickerOpen(false)}
                        onAccept={() => setIsLogoutTimePickerOpen(false)}
                        onBackToDatePicker={() => { }}
                    />
                </DialogContent>
            </Dialog>

            {/* Penalties Dialog */}
            <Dialog open={isPenaltiesDialogOpen} onOpenChange={setIsPenaltiesDialogOpen}>
                <DialogContent className='p-6 z-[100]  '>
                    <div className='z-[100] flex justify-between'>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Attendance Penalties
                            </DialogTitle>
                        </DialogHeader>

                        <DialogClose>
                            <CrossCircledIcon className="scale-150  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                        </DialogClose>
                    </div>
                    <AlertDialog open={isOverrideAlertOpen} onOpenChange={setIsOverrideAlertOpen}>
                        <AlertDialogOverlay />
                        <AlertDialogContent>
                            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will override your current penalty configuration. Are you sure you want to proceed?
                            </AlertDialogDescription>
                            <div className="flex justify-end gap-2 mt-4">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                    setIsOverrideAlertOpen(false);
                                    updatePenaltyConfig(pendingPenaltyPayload);
                                }}>
                                    Confirm
                                </AlertDialogAction>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>

                    <div className="py-4 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Penalty Type</h3>
                            <Tabs3
                                value={penaltyOption}
                                onValueChange={(value) => setPenaltyOption(value as "leave" | "salary")}
                                className="w-full"
                            >
                                <TabsList3 className="grid w-full grid-cols-2">
                                    <TabsTrigger3 value="leave">Leave Deduction</TabsTrigger3>
                                    <TabsTrigger3 value="salary">Salary Deduction</TabsTrigger3>
                                </TabsList3>

                                <TabsContent3 value="leave" className="mt-4 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Late Logins Allowed</label>
                                        <input
                                            type="number"
                                            value={lateLoginThreshold}
                                            onChange={(e) => setLateLoginThreshold(e.target.value)}
                                            className="w-full px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                                            placeholder="Number of allowed late logins"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Leave Deduction Type</label>
                                        <Select
                                            value={penaltyLeaveType}
                                            onValueChange={(value) =>
                                                setPenaltyLeaveType(value as "half day" | "Full Day" | "quarter day")
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select deduction type" />
                                            </SelectTrigger>
                                            <SelectContent className='z-[100]'>
                                                <SelectItem value="quarter day">Quarter Day</SelectItem>
                                                <SelectItem value="half day">Half Day</SelectItem>
                                                <SelectItem value="Full Day">Full Day</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TabsContent3>

                                <TabsContent3 value="salary" className="mt-4 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Late Logins Allowed</label>
                                        <input
                                            type="number"
                                            value={lateLoginThreshold}
                                            onChange={(e) => setLateLoginThreshold(e.target.value)}
                                            className="w-full px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                                            placeholder="Number of allowed late logins"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Salary Deduction Amount</label>
                                        <input
                                            type="number"
                                            value={penaltySalaryAmount}
                                            onChange={(e) => setPenaltySalaryAmount(e.target.value)}
                                            className="w-full px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                                            placeholder="Enter deduction amount"
                                        />
                                    </div>
                                </TabsContent3>
                            </Tabs3>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSavePenaltyConfig} className="w-full">
                            Save Penalty Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Location Dialog */}
            <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                <DialogContent className="sm:max-w-[550px] m-auto z-[100] p-6 overflow-y-scroll h-screen">
                    <DialogHeader className='flex justify-between'>
                        <div className='flex justify-between'>
                            <DialogTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                Office Location
                            </DialogTitle>
                            <DialogClose>
                                <CrossCircledIcon className="scale-150  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                            </DialogClose>
                        </div>
                    </DialogHeader>

                    <div className="py-4 space-y-6">
                        <div className="rounded-md overflow-hidden border">
                            {currentLocation ? (
                                <LoadScript googleMapsApiKey="AIzaSyASY9lRvSpjIR2skVaTLd6x7M1Kx2zY-4k">
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={currentLocation}
                                        zoom={15}
                                        options={{
                                            disableDefaultUI: true,
                                            zoomControl: true,
                                            styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }]
                                        }}
                                    >
                                        <Marker position={currentLocation} />
                                    </GoogleMap>
                                </LoadScript>
                            ) : (
                                <div className="flex items-center justify-center h-[300px]">
                                    <Loader />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium">Geofencing</h3>
                                    <p className="text-xs text-muted-foreground">
                                        Enable to restrict attendance based on location
                                    </p>
                                </div>
                                <Switch checked={allowGeofencing} onCheckedChange={setAllowGeofencing} />
                            </div>

                            {allowGeofencing && (
                                <div className="space-y-3">
                                    <Card className="border-primary/20">
                                        <CardContent className="p-4 space-y-4">
                                            <h4 className="text-sm font-medium">Geofence Radius</h4>

                                            <Tabs3 value={selectedUnit} onValueChange={(value) => setSelectedUnit(value as "km" | "m")}>
                                                <TabsList3 className="grid w-full grid-cols-2">
                                                    <TabsTrigger3 value="km">Kilometers</TabsTrigger3>
                                                    <TabsTrigger3 value="m">Meters</TabsTrigger3>
                                                </TabsList3>

                                                <div className="mt-4">
                                                    <input
                                                        type="number"
                                                        value={geofenceInput}
                                                        onChange={(e) => setGeofenceInput(e.target.value)}
                                                        placeholder={`Enter radius in ${selectedUnit === 'km' ? 'kilometers' : 'meters'}`}
                                                        className="w-full px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                                                    />
                                                </div>
                                            </Tabs3>

                                            <p className="text-xs text-muted-foreground">
                                                Employees can only mark attendance within this radius of the office location
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleSaveLocation} className="w-full">
                            Save Location Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
