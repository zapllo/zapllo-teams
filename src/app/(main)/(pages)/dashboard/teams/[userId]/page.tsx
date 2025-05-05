'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Shadcn Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Component imports
import EmployeeProfile from "@/components/teams/profile/page";
import Loader from "@/components/ui/loader";
import CustomDatePicker from "@/components/globals/date-picker";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SalaryMenu from "@/components/teams/salary/page";
import DeductionMenu from "@/components/teams/deductions/page";
import PersonalDetails from "@/components/teams/personal-details/page";
import PayslipPage from "@/components/teams/payslip/page";
import UserLogs from "@/components/teams/logs/userLogs";

// Icons
import { FaCalendarAlt, FaFileAlt, FaFileInvoice, FaHistory, FaLock, FaMinusCircle, FaUser, FaWallet } from "react-icons/fa";

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
    { id: "profile", name: "Profile", icon: <FaUser className="h-4 w-4" /> },
    { id: "personal-details", name: "Personal Details", icon: <FaFileAlt className="h-4 w-4" /> },
    { id: "attendance", name: "Attendance", icon: <FaCalendarAlt className="h-4 w-4" /> },
    { id: "salary-overview", name: "Salary Overview", icon: <FaWallet className="h-4 w-4" /> },
    { id: "deductions", name: "Deductions", icon: <FaMinusCircle className="h-4 w-4" /> },
    { id: "payslip", name: "Payslip", icon: <FaFileInvoice className="h-4 w-4" /> },
    { id: "user-logs", name: "User Logs", icon: <FaHistory className="h-4 w-4" /> },
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
        } finally {
            setAttendanceLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === "attendance") {
            fetchAttendanceReport();
        }
    }, [activeTab]);

    const handleGeneratePayslip = async () => {
        setLoading(true);

        try {
            const response = await axios.post("/api/payslip/generate", { userId, month, year });
            if (response.data.success) {
                setUniqueLink(response.data.uniqueLink);
            }
        } catch (error) {
            console.error("Error generating payslip:", error);
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
                toast.success(`User status changed successfully to ${response.data.user.status}`);
            } else {
                console.error("Failed to update user:", response.data.error);
                setUser((prevUser) => ({
                    ...prevUser!,
                    [field]: user[field as keyof UserDetails],
                }));
            }
        } catch (error) {
            console.error("Error updating user:", error);
            setUser((prevUser) => ({
                ...prevUser!,
                [field]: user[field as keyof UserDetails],
            }));
        }
    };

    const renderAttendanceSection = () => {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Attendance Report</h2>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => {
                            setDatePickerTarget("start");
                            setIsDateDialogOpen(true);
                        }}
                    >
                        <FaCalendarAlt className="h-4 w-4" />
                        {startDate ? startDate.toLocaleDateString() : "Select Start Date"}
                    </Button>

                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => {
                            setDatePickerTarget("end");
                            setIsDateDialogOpen(true);
                        }}
                    >
                        <FaCalendarAlt className="h-4 w-4" />
                        {endDate ? endDate.toLocaleDateString() : "Select End Date"}
                    </Button>

                    <Button
                        variant="default"
                        className="ml-auto bg-emerald-600 hover:bg-emerald-700"
                        onClick={fetchAttendanceReport}
                        disabled={!startDate || !endDate}
                    >
                        Fetch Report
                    </Button>
                </div>

                {attendanceLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader />
                    </div>
                ) : attendanceData ? (
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-wrap gap-3 mb-6">
                                <Badge variant="outline" className="px-3 py-1 text-blue-500 border-blue-200">
                                    Total Days: {attendanceData.totalDays}
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1 text-amber-500 border-amber-200">
                                    Working: {attendanceData.workingDays}
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1 text-green-500 border-green-200">
                                    Week Offs: {attendanceData.weekOffs}
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1 text-rose-500 border-rose-200">
                                    Holidays: {attendanceData.holidays.length}
                                </Badge>
                            </div>

                            <div className="rounded-lg overflow-hidden border">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="p-3 text-left font-medium">User</th>
                                            <th className="p-3 text-left font-medium">Present</th>
                                            <th className="p-3 text-left font-medium">Absent</th>
                                            <th className="p-3 text-left font-medium">Leave</th>
                                            <th className="p-3 text-left font-medium">Reporting Manager</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceData.report.map((entry: any, index: number) => (
                                            <tr key={index} className="border-t">
                                                <td className="p-3">{entry.user}</td>
                                                <td className="p-3">{entry.present}</td>
                                                <td className="p-3">{entry.absent}</td>
                                                <td className="p-3">{entry.leave}</td>
                                                <td className="p-3">{entry.reportingManager}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="flex flex-col items-center justify-center p-8 bg-muted/10">
                        <DotLottieReact
                            src="/lottie/empty.lottie"
                            loop
                            className="h-40"
                            autoplay
                        />
                        <h3 className="text-lg font-semibold mt-4">No Attendance Records Found</h3>
                        <p className="text-muted-foreground text-center mt-2">
                            The list is currently empty for the selected date range.
                        </p>
                    </Card>
                )}
            </div>
        );
    };

    const renderPayslipSection = () => {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Generate Payslip</h2>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-wrap gap-4 mb-6">
                            <Select
                                value={month.toString()}
                                onValueChange={(value) => setMonth(parseInt(value))}
                            >
                                <SelectTrigger className="w-[180px]">
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

                            <Select
                                value={year.toString()}
                                onValueChange={(value) => setYear(parseInt(value))}
                            >
                                <SelectTrigger className="w-[180px]">
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

                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 ml-auto"
                                onClick={handleGeneratePayslip}
                                disabled={loading}
                            >
                                {loading ? "Generating..." : "Generate Payslip"}
                            </Button>
                        </div>

                        {uniqueLink && (
                            <div className="mt-6 p-4 border rounded-lg bg-muted/20">
                                <p className="text-sm text-muted-foreground mb-2">Payslip generated successfully:</p>
                                <a
                                    href={uniqueLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-2"
                                >
                                    <FaFileInvoice className="h-4 w-4" />
                                    View Payslip
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* <PayslipPage userId={userId} /> */}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
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
            <div className="w-full max-w-5xl mx-auto p-6">
                <Card>
                    <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px]">
                        <FaLock className="h-12 w-12 text-red-500 mb-4" />
                        <h1 className="text-xl font-semibold text-center mb-2">Access Denied</h1>
                        <p className="text-muted-foreground text-center">
                            You're not authorized to access Employee Details
                        </p>
                        <Button
                            className="mt-6"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-full max-w-5xl  mx-auto p-6">
                <Card>
                    <CardContent className="p-8 flex flex-col items-center justify-center">
                        <h1 className="text-xl font-semibold text-center">User not found</h1>
                        <Button
                            className="mt-6"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getRoleBadgeColor = (role: string) => {
        switch(role) {
            case "orgAdmin": return "bg-rose-600 text-white";
            case "manager": return "bg-blue-600 text-white";
            case "member": return "bg-emerald-600 text-white";
            default: return "bg-gray-500 text-white";
        }
    };

    const getRoleDisplayName = (role: string) => {
        switch(role) {
            case "orgAdmin": return "Admin";
            case "manager": return "Manager";
            case "member": return "Member";
            default: return role;
        }
    };

    return (
        <div className="w-full max-w-7xl mt-12 h-screen overflow-y-scroll scrollbar-hide mx-auto p-4 pb-24">
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                className="rounded-full p-2"
                                onClick={() => router.back()}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>

                            <div className="relative">
                                <div className='p-[2px] rounded-full bg-gradient-to-r from-[#815BF5] to-[#FC8929]'>
                                    <div className='p-1 rounded-full bg-white dark:bg-[#04061e]'>
                                        <Avatar className="h-16 w-16">
                                            {user.profilePic ? (
                                                <AvatarImage
                                                    src={user.profilePic}
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                />
                                            ) : (
                                                <AvatarFallback className="bg-[#815BF5] text-white">
                                                    {`${user.firstName}`.slice(0, 1)}
                                                    {`${user.lastName}`.slice(0, 1)}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                    </div>
                                </div>
                                <img
                                    src='/branding/badge.png'
                                    className="absolute -bottom-2 -right-2 z-10 h-6"
                                    alt="Badge"
                                />
                            </div>

                            <div>
                                <h1 className="text-xl font-semibold">
                                    {`${user.firstName} ${user.lastName}`}
                                </h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <Badge className={getRoleBadgeColor(user.role)}>
                                        {getRoleDisplayName(user.role)}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        ID: {user.employeeId}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Select
                            value={user?.status || "Active"}
                            onValueChange={(value) => handleUpdateField("status", value)}
                        >
                            <SelectTrigger className="w-[180px] bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active" className="hover:bg-[#815BF5]/10">
                                    Active
                                </SelectItem>
                                <SelectItem value="Deactivated" className="hover:bg-[#FC8929]/10">
                                    Deactivated
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 overflow-hidden">
                    <CardHeader className="pb-3">
                        <h3 className="font-medium">Employee Details</h3>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="space-y-1">
                            {tabs.map((tab) => {
                                const isLocked = !isPlanEligible &&
                                  ["attendance", "salary-overview", "deductions", "payslip", "user-logs"].includes(tab.id);

                                return (
                                    <div key={tab.id} className="relative">
                                        <Button
                                            variant={activeTab === tab.id ? "default" : "ghost"}
                                            className={`w-full justify-start px-4 py-2 text-sm font-medium ${
                                                activeTab === tab.id ? "bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white" : ""
                                            } ${isLocked ? "opacity-60" : ""}`}
                                            onClick={() => {
                                                if (isLocked) {
                                                    toast.error("Purchase Money Saver Bundle to unlock");
                                                    return;
                                                }
                                                setActiveTab(tab.id);
                                            }}
                                        >
                                            <span className="mr-3">{tab.icon}</span>
                                            {tab.name}
                                        </Button>

                                        {isLocked && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <FaLock className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

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

            <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
                <DialogContent className="sm:max-w-md">
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
