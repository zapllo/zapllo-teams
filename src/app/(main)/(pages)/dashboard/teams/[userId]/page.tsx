'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Shadcn Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Component imports
import EmployeeProfile from "@/components/teams/profile/page";
import Loader from "@/components/ui/loader";
import CustomDatePicker from "@/components/globals/date-picker";
import SalaryMenu from "@/components/teams/salary/page";
import DeductionMenu from "@/components/teams/deductions/page";
import PersonalDetails from "@/components/teams/personal-details/page";
import PayslipPage from "@/components/teams/payslip/page";
import UserLogs from "@/components/teams/logs/userLogs";

// Icons
import {
  ArrowLeft,
  Calendar,
  FileText,
  FileSpreadsheet,
  History,
  Lock,
  Menu,
  MinusCircle,
  UserIcon,
  Wallet,
  User2,
  Shield,
  ChevronRight,
  AlertCircle,
  Download,
  Eye
} from "lucide-react";

interface UserDetails {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    whatsappNo: string;
    profilePic: string;
    role: string;
    reportingManager: {
        firstName: string;
        lastName: string;
        whatsappNo: string;
    } | null;
    isLeaveAccess: boolean;
    isTaskAccess: boolean;
    country: string;
    designation: string;
    staffType: string;
    contactNumber: string;
    asset: string;
    branch: string;
    status: string;
    employeeId: string;
}

const tabs = [
    { id: "profile", name: "Profile", icon: <User2 className="h-4 w-4" /> },
    { id: "personal-details", name: "Personal Details", icon: <FileText className="h-4 w-4" /> },
    { id: "attendance", name: "Attendance", icon: <Calendar className="h-4 w-4" /> },
    { id: "salary-overview", name: "Salary Overview", icon: <Wallet className="h-4 w-4" /> },
    { id: "deductions", name: "Deductions", icon: <MinusCircle className="h-4 w-4" /> },
    { id: "payslip", name: "Payslip", icon: <FileSpreadsheet className="h-4 w-4" /> },
    { id: "user-logs", name: "User Logs", icon: <History className="h-4 w-4" /> },
];

export default function UserDetailPage({ params }: { params: { userId: string } }) {
    const { userId } = params;
    const router = useRouter();

    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");
    const [attendanceData, setAttendanceData] = useState<any>(null);
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
    const [datePickerTarget, setDatePickerTarget] = useState<'start' | 'end'>('start');
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [uniqueLink, setUniqueLink] = useState<string | null>(null);
    const [isPlanEligible, setIsPlanEligible] = useState<boolean>(false);
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userRes = await axios.get("/api/users/me");
                const currentUser = userRes.data.data;
                setCurrentUserRole(currentUser.role);

                if (currentUser.role !== "orgAdmin") {
                    setLoading(false);
                    return;
                }

                if (userId) {
                    const response = await axios.get(`/api/users/${userId}`);
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                toast.error("Failed to load user details");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);

    useEffect(() => {
        const fetchPlanStatus = async () => {
            try {
                const response = await axios.get("/api/organization/getById");
                const { subscribedPlan: plan } = response.data.data;
                const eligiblePlans = ["Money Saver Bundle", "Zapllo Payroll"];
                setIsPlanEligible(eligiblePlans.includes(plan));
            } catch (error) {
                console.error("Error fetching plan status:", error);
            }
        };

        fetchPlanStatus();
    }, []);

    // Fetch attendance report
    const fetchAttendanceReport = async () => {
        if (!userId || !startDate || !endDate) return;
        setAttendanceLoading(true);

        try {
            const response = await axios.post(`/api/reports/cumulative`, {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                employeeId: userId,
            });

            setAttendanceData(response.data);
        } catch (error) {
            console.error("Error fetching attendance report:", error);
            toast.error("Failed to fetch attendance report");
        } finally {
            setAttendanceLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "attendance" && startDate && endDate) {
            fetchAttendanceReport();
        }
    }, [activeTab, startDate, endDate]);

    const handleGeneratePayslip = async () => {
        setLoading(true);

        try {
            const response = await axios.post("/api/payslip/generate", { userId, month, year });
            if (response.data.success) {
                setUniqueLink(response.data.uniqueLink);
                toast.success("Payslip generated successfully");
            }
        } catch (error) {
            console.error("Error generating payslip:", error);
            toast.error("Failed to generate payslip");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateField = async (field: string, value: string) => {
        if (!user) return;

        try {
            // Update UI optimistically
            setUser((prevUser) => ({
                ...prevUser!,
                [field]: value,
            }));

            // Send the PATCH request to update the user
            const response = await axios.patch(`/api/users/update`, {
                _id: user._id,
                [field]: value,
            });

            if (response.data.success) {
                setUser(response.data.user);
                toast.success(`User status changed to ${value}`);
            } else {
                console.error("Failed to update user:", response.data.error);
                toast.error("Failed to update user status");
                setUser((prevUser) => ({
                    ...prevUser!,
                    [field]: user[field as keyof UserDetails],
                }));
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Error updating user status");
            setUser((prevUser) => ({
                ...prevUser!,
                [field]: user[field as keyof UserDetails],
            }));
        }
    };

    const renderAttendanceSection = () => {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">Attendance Report</h2>
                        <p className="text-muted-foreground text-sm mt-1">View and analyze employee attendance records</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9"
                            onClick={() => {
                                setDatePickerTarget("start");
                                setIsDateDialogOpen(true);
                            }}
                        >
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {startDate ? startDate.toLocaleDateString() : "Start Date"}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9"
                            onClick={() => {
                                setDatePickerTarget("end");
                                setIsDateDialogOpen(true);
                            }}
                        >
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {endDate ? endDate.toLocaleDateString() : "End Date"}
                        </Button>

                        <Button
                            variant="default"
                            size="sm"
                            className="h-9"
                            onClick={fetchAttendanceReport}
                            disabled={!startDate || !endDate || attendanceLoading}
                        >
                            {attendanceLoading ? <Loader /> : null}
                            Generate Report
                        </Button>
                    </div>
                </div>

                {attendanceLoading ? (
                    <div className="flex justify-center items-center p-12">
                        <Loader  />
                        <span className="ml-3 text-muted-foreground">Loading attendance data...</span>
                    </div>
                ) : attendanceData ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-muted-foreground text-xs">Total Days</p>
                                        <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">{attendanceData.totalDays}</p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-blue-500 opacity-80" />
                                </CardContent>
                            </Card>

                            <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-muted-foreground text-xs">Working Days</p>
                                        <p className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">{attendanceData.workingDays}</p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-emerald-500 opacity-80" />
                                </CardContent>
                            </Card>

                            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-muted-foreground text-xs">Week Offs</p>
                                        <p className="text-3xl font-semibold text-amber-600 dark:text-amber-400">{attendanceData.weekOffs}</p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-amber-500 opacity-80" />
                                </CardContent>
                            </Card>

                            <Card className="bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800">
                                <CardContent className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-muted-foreground text-xs">Holidays</p>
                                        <p className="text-3xl font-semibold text-rose-600 dark:text-rose-400">{attendanceData.holidays.length}</p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-rose-500 opacity-80" />
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Attendance Details</CardTitle>
                                <CardDescription>Summary of attendance from {startDate?.toLocaleDateString()} to {endDate?.toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="rounded-md overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-muted/60">
                                                <th className="p-3 text-left font-medium text-sm">User</th>
                                                <th className="p-3 text-left font-medium text-sm">Present</th>
                                                <th className="p-3 text-left font-medium text-sm">Absent</th>
                                                <th className="p-3 text-left font-medium text-sm">Leave</th>
                                                <th className="p-3 text-left font-medium text-sm">Reporting Manager</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {attendanceData.report.map((entry: any, index: number) => (
                                                <tr key={index} className="hover:bg-muted/30 transition-colors">
                                                    <td className="p-3 text-sm">{entry.user}</td>
                                                    <td className="p-3 text-sm">
                                                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 border-green-200">
                                                            {entry.present}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-sm">
                                                        <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200">
                                                            {entry.absent}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-sm">
                                                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200">
                                                            {entry.leave}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3 text-sm">{entry.reportingManager}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Card className="border border-dashed">
                        <CardContent className="flex flex-col items-center justify-center p-12">
                            <DotLottieReact
                                src="/lottie/empty.lottie"
                                loop
                                className="h-40 w-40"
                                autoplay
                            />
                            <h3 className="text-lg font-medium mt-6">No Attendance Data Available</h3>
                            <p className="text-muted-foreground text-sm text-center mt-2 max-w-md">
                                {startDate && endDate
                                    ? "No attendance records found for the selected date range"
                                    : "Select a date range to view attendance records"}
                            </p>
                            {!startDate || !endDate ? (
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => {
                                        setDatePickerTarget("start");
                                        setIsDateDialogOpen(true);
                                    }}
                                >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Select Date Range
                                </Button>
                            ) : null}
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    };

    const renderPayslipSection = () => {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">Payslip Generator</h2>
                        <p className="text-muted-foreground text-sm mt-1">Generate and view employee payslips</p>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Generate Payslip</CardTitle>
                        <CardDescription>Select month and year to generate payslip</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Month</label>
                                <Select
                                    value={month.toString()}
                                    onValueChange={(value) => setMonth(parseInt(value))}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                {new Date(0, i).toLocaleString("default", { month: "long" })}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Year</label>
                                <Select
                                    value={year.toString()}
                                    onValueChange={(value) => setYear(parseInt(value))}
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <SelectItem key={i} value={(new Date().getFullYear() - i).toString()}>
                                                {new Date().getFullYear() - i}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                className="ml-auto"
                                onClick={handleGeneratePayslip}
                                disabled={loading}
                            >
                                {loading ? <Loader  /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
                                Generate Payslip
                            </Button>
                        </div>
                    </CardContent>

                    {uniqueLink && (
                        <CardFooter className="bg-muted/20 border-t px-6 py-4">
                            <div className="w-full">
                                <h4 className="text-sm font-medium mb-2">Payslip Generated Successfully</h4>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        {`${new Date(0, month-1).toLocaleString("default", { month: "long" })} ${year}`} Payslip
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(uniqueLink, '_blank')}
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </Button>
                                        {/* <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => window.open(uniqueLink, '_blank')}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button> */}
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                    )}
                </Card>

                {/* <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Payslip History</CardTitle>
                        <CardDescription>View previously generated payslips</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PayslipPage userId={userId} />
                    </CardContent>
                </Card> */}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="w-full mt-12 max-w-5xl mx-auto p-6 space-y-6">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-6">
                    <Skeleton className="h-[600px] col-span-1" />
                    <Skeleton className="h-[600px] col-span-3" />
                </div>
            </div>
        );
    }

    if (currentUserRole !== "orgAdmin") {
        return (
            <div className="w-full max-w-5xl mx-auto py-12 px-6">
                <Card>
                    <CardContent className="p-12 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-6">
                            <Lock className="h-8 w-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-semibold text-center mb-2">Access Denied</h1>
                        <p className="text-muted-foreground text-center max-w-md mb-8">
                            You don&apos;t have permission to access employee details. Please contact your administrator.
                        </p>
                        <Button
                            onClick={() => router.back()}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> Return to previous page
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-full max-w-5xl mx-auto py-12 px-6">
                <Card>
                    <CardContent className="p-12 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-6">
                            <AlertCircle className="h-8 w-8 text-amber-500" />
                        </div>
                        <h1 className="text-2xl font-semibold text-center mb-2">User Not Found</h1>
                        <p className="text-muted-foreground text-center max-w-md mb-8">
                            The employee you&apos;re looking for doesn&apos;t exist or has been removed from the system.
                        </p>
                        <Button
                            onClick={() => router.back()}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" /> Return to team list
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getRoleBadgeColor = (role: string) => {
        switch(role) {
            case "orgAdmin": return "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-none";
            case "manager": return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none";
            case "member": return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-none";
            default: return "bg-gradient-to-r from-slate-500 to-gray-500 text-white border-none";
        }
    };

    const getRoleDisplayName = (role: string) => {
        switch(role) {
            case "orgAdmin": return "Administrator";
            case "manager": return "Manager";
            case "member": return "Team Member";
            default: return role;
        }
    };

    // Sidebar component for desktop and tablet
    const SidebarContent = () => (
        <ScrollArea className="h-full py-2">
            <div className="space-y-1 px-1">
                {tabs.map((tab) => {
                    const isLocked = !isPlanEligible &&
                      ["attendance", "salary-overview", "deductions", "payslip", "user-logs"].includes(tab.id);

                    return (
                        <div key={tab.id} className="relative">
                            <Button
                                variant={activeTab === tab.id ? "default" : "ghost"}
                                className={`w-full justify-start px-4 py-2 h-10 text-sm font-medium ${
                                    activeTab === tab.id
                                        ? "bg-primary text-primary-foreground"
                                        : ""
                                } ${isLocked ? "opacity-60" : ""}`}
                                onClick={() => {
                                    if (isLocked) {
                                        toast.error("Upgrade to Money Saver Bundle to unlock this feature");
                                        return;
                                    }
                                    setActiveTab(tab.id);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <span className="mr-3">{tab.icon}</span>
                                {tab.name}
                                {isLocked && (
                                    <Lock className="ml-auto h-3 w-3" />
                                )}
                                {!isLocked && activeTab !== tab.id && (
                                    <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                                )}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    );

    return (
        <div className=" mt-12 max-w- h-screen overflow-y-scroll mx-auto scrollbar-hide px-4 py-6 pb-24">
            <div className="mb-6 flex items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="mr-4"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                <h1 className="text-2xl font-bold tracking-tight">Employee Profile</h1>

                <div className="ml-auto md:hidden">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-semibold">Employee Profile</h3>
                                <p className="text-sm text-muted-foreground">Navigation menu</p>
                            </div>
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <Card className="mb-6 overflow-hidden">
                <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                            <div className="relative flex-shrink-0">
                                <div className='p-[3px] rounded-full bg-gradient-to-r from-primary to-primary/60'>
                                    <div className='p-1 rounded-full bg-background'>
                                        <Avatar className="h-20 w-20">
                                            {user.profilePic ? (
                                                <AvatarImage
                                                    src={user.profilePic}
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                />
                                            ) : (
                                                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                                   {`${user.firstName}`.slice(0, 1)}
                                                    {`${user.lastName}`.slice(0, 1)}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                    </div>
                                </div>
                                <img
                                    src='/branding/badge.png'
                                    className="absolute -bottom-2 right-[35px] z-10 h-6"
                                    alt="Badge"
                                />
                            </div>

                            <div className="space-y-1 flex-grow">
                                <h2 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h2>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                    <Badge className={getRoleBadgeColor(user.role)}>
                                        {getRoleDisplayName(user.role)}
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                        <Shield className="h-3.5 w-3.5" />
                                        <span>ID: {user.employeeId || "N/A"}</span>
                                    </div>
                                    {user.designation && (
                                        <div className="flex items-center gap-1">
                                            <UserIcon className="h-3.5 w-3.5" />
                                            <span>{user.designation}</span>
                                        </div>
                                    )}
                                </div>
                                {user.email && (
                                    <p className="text-sm">{user.email}</p>
                                )}
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <Select
                                    value={user?.status || "Active"}
                                    onValueChange={(value) => handleUpdateField("status", value)}
                                >
                                    <SelectTrigger className="w-[160px] bg-primary text-primary-foreground border-none">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">
                                            <div className="flex items-center">
                                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                                Active
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Deactivated">
                                            <div className="flex items-center">
                                                <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                                                Deactivated
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar for desktop */}
                <Card className="hidden lg:block lg:col-span-1 overflow-hidden">
                    <CardHeader className="pb-2">
                        <h3 className="font-medium">Employee Information</h3>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-0 h-[calc(100%-56px)]">
                        <SidebarContent />
                    </CardContent>
                </Card>

                {/* Main content area */}
                <Card className="lg:col-span-3">
                    <CardContent className="p-6">
                        {activeTab === "profile" && <EmployeeProfile userId={userId} />}
                        {activeTab === "personal-details" && <PersonalDetails userId={userId} />}
                        {activeTab === "attendance" && renderAttendanceSection()}
                        {activeTab === "salary-overview" && <SalaryMenu userId={userId} />}
                        {activeTab === "deductions" && <DeductionMenu userId={userId} />}
                        {activeTab === "payslip" && renderPayslipSection()}
                        {activeTab === "user-logs" && <UserLogs userId={userId} />}
                    </CardContent>
                </Card>
            </div>

            {/* Date picker dialog */}
            <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
                <DialogContent className=" p-6 max-w-7xl  w-full scale-75">
                    <CustomDatePicker
                        selectedDate={datePickerTarget === 'start' ? startDate : endDate}
                        onDateChange={(date) => {
                            if (datePickerTarget === 'start') {
                                setStartDate(date);
                            } else {
                                setEndDate(date);
                            }
                        }}
                        onCloseDialog={() => setIsDateDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
