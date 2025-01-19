'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Calendar } from "lucide-react";
import EmployeeProfile from "@/components/teams/profile/page";
import Loader from "@/components/ui/loader";
import CustomDatePicker from "@/components/globals/date-picker";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import SalaryMenu from "@/components/teams/salary/page";
import DeductionMenu from "@/components/teams/deductions/page";
import PersonalDetails from "@/components/teams/personal-details/page";
import PayslipPage from "@/components/teams/payslip/page";
import UserLogs from "@/components/teams/logs/userLogs";
import { FaCalendarAlt, FaFileAlt, FaFileInvoice, FaHistory, FaLock, FaMinusCircle, FaUser, FaWallet } from "react-icons/fa";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

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
    employeeId: string; // EMP1, EMP2, etc.
}

export default function UserDetailPage({ params }: { params: { userId: string } }) {
    const { userId } = params;
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("Profile"); // Active section state
    const [attendanceData, setAttendanceData] = useState<any>(null);
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
    const [datePickerTarget, setDatePickerTarget] = useState<'start' | 'end'>('start');
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1); // Default to current month
    const [year, setYear] = useState<number>(new Date().getFullYear()); // Default to current year
    const [uniqueLink, setUniqueLink] = useState<string | null>(null);
    const [leavesTrialExpires, setLeavesTrialExpires] = useState<Date | null>(null);
    const [attendanceTrialExpires, setAttendanceTrialExpires] = useState<Date | null>(null);
    const [subscribedPlan, setSubscribedPlan] = useState<string | null>(null);
    const [isPlanEligible, setIsPlanEligible] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        if (userId) {
            // Fetch user details
            axios
                .get(`/api/users/${userId}`)
                .then((response) => {
                    setUser(response.data.user);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user details:", error);
                    setLoading(false);
                });
        }
    }, [userId]);

    useEffect(() => {
        const fetchPlanStatus = async () => {
            try {
                const response = await axios.get("/api/organization/getById");
                const {
                    leavesTrialExpires: leavesExpire,
                    attendanceTrialExpires: attendanceExpire,
                    subscribedPlan: plan,
                } = response.data.data;

                const eligiblePlans = ["Money Saver Bundle", "Zapllo Payroll"];
                setLeavesTrialExpires(leavesExpire ? new Date(leavesExpire) : null);
                setAttendanceTrialExpires(attendanceExpire ? new Date(attendanceExpire) : null);
                setSubscribedPlan(plan);
                setIsPlanEligible(eligiblePlans.includes(plan));
            } catch (error) {
                console.error("Error fetching plan status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlanStatus();
    }, []);
console.log(subscribedPlan, 'plan?')
    const handleTabClick = (tabName: string) => {
        const lockedTabs = ["Attendance", "Salary Overview", "Deductions", "Payslip", "User Logs"];
        const isLocked = !isPlanEligible && lockedTabs.includes(tabName);

        if (isLocked) {
            toast.error("Purchase Money Saver Bundle to unlock");
        } else {
            setActiveTab(tabName);
        }
    };

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
        if (activeTab === "Attendance") {
            fetchAttendanceReport();
        }
    }, [activeTab]);

    const renderAttendanceSection = () => {
        return (
            <div>
                <h2 className="text-lg font-semibold mb-4">Attendance Report</h2>

                {/* Date Selection and Fetch Button */}
                <div className="flex gap-4 mb-4">
                    <button
                        className="px-4 py-2 flex items-center text-sm gap-2 bg-transparent border text-white rounded"
                        onClick={() => {
                            setDatePickerTarget("start");
                            setIsDateDialogOpen(true);
                        }}
                    >
                        <Calendar className="h-5" /> {startDate ? startDate.toDateString() : "Select Start Date"}
                    </button>
                    <button
                        className="px-4 py-2 flex text-sm items-center gap-2 bg-transparent border text-white rounded"
                        onClick={() => {
                            setDatePickerTarget("end");
                            setIsDateDialogOpen(true);
                        }}
                    >
                        <Calendar className="h-5" /> {endDate ? endDate.toDateString() : "Select End Date"}
                    </button>
                    <div className="ml-auto">
                        <button
                            className="px-4 text-sm py-2 bg-[#017a5b] -600 text-white rounded"
                            onClick={fetchAttendanceReport}
                            disabled={!startDate || !endDate}
                        >
                            Fetch Report
                        </button>
                    </div>
                </div>

                {/* Attendance Report */}
                {attendanceLoading ? (
                    <Loader />
                ) : attendanceData ? (
                    <div className="border mt-2 rounded-xl p-4">
                        <div className="flex gap-4">
                            <div>
                                <span className="border text-xs text-blue-400 text-= p-2 rounded">Total Days: {attendanceData.totalDays}</span>
                            </div>
                            <div>
                                <span className="border text-xs text-yellow-400  p-2 rounded">Working: {attendanceData.workingDays}</span>
                            </div>
                            <div>
                                <span className="border text-xs text-green-400  p-2 rounded">Week Offs: {attendanceData.weekOffs}</span>
                            </div>
                            <div>
                                <span className="border text-xs text-red-500  p-2 rounded">Holidays: {attendanceData.holidays.length}</span>
                            </div>
                        </div>

                        <table className="w-full mt-4 border-collapse border">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2 text-left">User</th>
                                    <th className="border px-4 py-2 text-left">Present</th>
                                    <th className="border px-4 py-2 text-left">Absent</th>
                                    <th className="border px-4 py-2 text-left">Leave</th>
                                    <th className="border px-4 py-2 text-left">Reporting Manager</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.report.map((entry: any, index: number) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{entry.user}</td>
                                        <td className="border px-4 py-2">{entry.present}</td>
                                        <td className="border px-4 py-2">{entry.absent}</td>
                                        <td className="border px-4 py-2">{entry.leave}</td>
                                        <td className="border px-4 py-2">{entry.reportingManager}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex w-full justify-center -ml-4">
                        <div className="mt-2">
                            <DotLottieReact
                                src="/lottie/empty.lottie"
                                loop
                                className="h-56"
                                autoplay
                            />
                            <h1 className="text-center font-bold text-md  -ml-4">
                                No Attendance Records Found
                            </h1>
                            <p className="text-center text-sm -ml-4 p-2">
                                The list is currently empty for the selected date range.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    };


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


    const renderTabs = () => {
        return tabs.map((tab) => {
            const lockedTabs = ["Attendance", "Salary Overview", "Deductions", "Payslip", "User Logs"];
            const isLocked = !isPlanEligible && lockedTabs.includes(tab.name);
    
            return (
                <button
                    key={tab.name}
                    onClick={() => handleTabClick(tab.name)}
                    className={`relative flex items-center gap-4 px-4 text-sm py-2 border rounded-2xl text-left ${
                        activeTab === tab.name && !isLocked
                            ? "bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white"
                            : ""
                    }`}
                >
                    {/* Tab Content */}
                    <div
                        className={`flex items-center gap-4 ${
                            isLocked ? "blur-" : "blur-none"
                        }`}
                    >
                        {tab.icon}
                        {tab.name}
                    </div>
    
                    {/* Lock Overlay */}
                    {isLocked && (
                        <div
                            className="absolute inset-0 flex  items-center justify-start bg-black bg-opacity-80 rounded-2xl"
                            style={{ pointerEvents: "auto" }}
                        >
                            <FaLock
                                className="text-gray-400 ml-4 text-lg cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent tab click
                                    toast.error("Purchase Money Saver Bundle to unlock");
                                }}
                            />
                        </div>
                    )}
                </button>
            );
        });
    };
    

    const renderActiveSection = () => {
        switch (activeTab) {
            case "Profile":
                return <EmployeeProfile userId={userId} />;
            case "Personal Details":
                return <PersonalDetails userId={userId} />;
            case "Attendance":
                return renderAttendanceSection();
            case "Salary Overview":
                return <SalaryMenu userId={userId} />;
            case "Deductions":
                return <DeductionMenu userId={userId} />;
            case "Payslip":
                return (<div className="p-6">
                    <h1 className="text-lg font-bold mb-4">Generate Payslip</h1>
                    <div className="flex gap-4 mb-4">
                        {/* Month Dropdown */}
                        <select
                            className="p-2 border bg-[#04061E] outline-none rounded"
                            value={month}
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                                </option>
                            ))}
                        </select>

                        {/* Year Dropdown */}
                        <select
                            className="p-2 border outline-none bg-[#04061E] rounded"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                        >
                            {Array.from({ length: 5 }, (_, i) => (
                                <option key={i} value={new Date().getFullYear() - i}>
                                    {new Date().getFullYear() - i}
                                </option>
                            ))}
                        </select>
                        {/* Generate Button */}
                        <button
                            className={`px-4 py-2 text-white rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#017a5b] hover:bg-green-800 text-sm -600"
                                }`}
                            onClick={handleGeneratePayslip}
                            disabled={loading}
                        >
                            {loading ? "Generating..." : "Generate"}
                        </button>
                    </div>

                    {/* Display Generated Link */}
                    {uniqueLink && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Payslip generated successfully:</p>
                            <a
                                href={uniqueLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                View Payslip
                            </a>
                        </div>
                    )}
                </div>)
            case "User Logs":
                return <UserLogs userId={userId} />
            default:
                return null;
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
                _id: user._id, // Pass the user's ID
                [field]: value, // Pass the updated field and value
            });

            if (response.data.success) {
                console.log("User updated successfully:", response.data.user);
            } else {
                console.error("Failed to update user:", response.data.error);
                // Revert the UI update if the API call fails
                setUser((prevUser) => ({
                    ...prevUser!,
                    [field]: user[field as keyof UserDetails], // Restore original value
                }));
            }
        } catch (error) {
            console.error("Error updating user:", error);
            // Revert the UI update in case of an error
            setUser((prevUser) => ({
                ...prevUser!,
                [field]: user[field as keyof UserDetails],
            }));
        }
    };


    const tabs = [
        { name: "Profile", icon: <FaUser className="h-4 w-4" /> },
        { name: "Personal Details", icon: <FaFileAlt className="h-4 w-4" /> },
        { name: "Attendance", icon: <FaCalendarAlt className="h-4 w-4" /> },
        { name: "Salary Overview", icon: <FaWallet className="h-4 w-4" /> },
        { name: "Deductions", icon: <FaMinusCircle className="h-4 w-4" /> },
        { name: "Payslip", icon: <FaFileInvoice className="h-4 w-4" /> },
        { name: "User Logs", icon: <FaHistory className="h-4 w-4" /> },
    ];

    if (loading) return <p><Loader /></p>;
    if (!user) return <p>User not found.</p>;

    return (
        <div className="w-full max-w-5xl overflow-y-scroll overflow-x-hidden h-full scrollbar-hide mt-16 mx-auto">
            {/* Header */}
            {/* User Summary */}
            <div className="border rounded-xl relative mt-4 p-6 ">
                <div className="flex items-cente absolute left-0 scale-75  p-1 top-0 r mb-4">
                    <button onClick={() => router.back()}>
                        <div className="flex items-center gap-2 font-medium text-xl cursor-pointer">
                            <ArrowLeft className="h-7 rounded-full border-white border w-7 hover:bg-white hover:text-black" />
                            {/* <h1>Back</h1> */}
                        </div>
                    </button>
                </div>
                <div className="flex justify-between w-full items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 relative">
                            <img src='/branding/badge.png' className="absolute -bottom-2 scale-90  left-6   z-[40]  h-6" />

                            <div className='p-[2px] scale-90  rounded-full bg-gradient-to-r from-[#815BF5] to-[#FC8929]'>
                                <div className='p-1 rounded-full bg-[#04061e] '>
                                    <Avatar className="rounded-full h-16 w-16 flex bg-[#815BF5] items-center ">

                                        {user.profilePic ? (
                                            <img
                                                src={user.profilePic}
                                                alt={`${user.firstName} ${user.lastName}`}
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <AvatarFallback className="">
                                                <h1 className="text-2xl">
                                                    {`${user.firstName}`.slice(0, 1)}
                                                    {`${user.lastName}`.slice(0, 1)}
                                                </h1>
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                </div>
                            </div>

                            <div>
                                <h1 className="text-lg font-semibold">{`${user.firstName} ${user.lastName}`}</h1>
                                <div className="flex items-center gap-2  ">
                                    <div
                                        className={`w-fit px-4 py-1 rounded text-xs ${user.role === "orgAdmin"
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
                                    <p className="text-gray-500">ID: {user.employeeId}</p>

                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="relative">
                        <Select
                            value={user.status || "Active"}
                            onValueChange={(value) => handleUpdateField("status", value)}
                        >
                            <SelectTrigger className=" bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white outline-none focus:ring-[#815BF5]">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="p-1 bg-[#04061E] text-white rounded-xl shadow-lg">
                                <SelectItem value="Active" className="hover:bg-[#815BF5] font-medium">
                                    Active
                                </SelectItem>
                                <SelectItem
                                    value="Deactivated"
                                    className="hover:bg-[#FC8929] font-medium"
                                >
                                    Deactivated
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                </div>
            </div>

            {/* Tabs */}
            <div className="grid mb-24 grid-cols-4 gap-6 mt-6">
                <div className="col-span-1 rounded-xl p-4 border">
                    <div className="flex flex-col gap-4">
                       {renderTabs()}
                    </div>
                </div>

                {/* Active Section */}
                <div className="col-span-3">
                    <div className="border p-6 rounded-xl shadow-md">{renderActiveSection()}</div>
                </div>
                <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
                    <DialogContent className="z-[100] scale-90  flex justify-center ">
                        <div className="z-[20] rounded-lg  scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
                            <div className="w-full flex mb-4 justify-between">
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
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}
