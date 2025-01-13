"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format, subMonths, startOfMonth, endOfMonth, getDaysInMonth } from "date-fns";

const numberToWords = (num: number): string => {
    const a = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if (num === 0) return "Zero";

    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 !== 0 ? ` ${a[num % 10]}` : "");
    if (num < 1000)
        return (
            a[Math.floor(num / 100)] +
            " Hundred" +
            (num % 100 !== 0 ? ` and ${numberToWords(num % 100)}` : "")
        );
    if (num < 1000000)
        return (
            numberToWords(Math.floor(num / 1000)) +
            " Thousand" +
            (num % 1000 !== 0 ? ` ${numberToWords(num % 1000)}` : "")
        );
    return num.toString(); // Larger numbers can be handled if needed
};

interface PayslipData {
    logo: string;
    name: string;
    address: string;
    contact: string;
    emailOrWebsite: string;
}

interface SalaryDetail {
    name: string;
    amount: number;
}

interface DeductionDetail {
    name: string;
    amount: number;
}

interface AttendanceData {
    workingDays: number;
    weekOffs: number;
    holidays: number;
    leaves: number;
}

interface UserData {
    firstName: string;
    lastName: string;
    employeeId: string;
    designation: string;
    branch: string;
    department: string;
    bankDetails: {
        bankName: string;
        branchName: string;
        accountNumber: string;
        ifscCode: string;
    };
    salaryDetails: SalaryDetail[];
    deductionDetails: DeductionDetail[];
    monthCalculationType: string; // New Field for monthCalculationType
}

export default function PayslipPage({ userId }: { userId: string }) {
    const [payslipData, setPayslipData] = useState<PayslipData | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
    const [loading, setLoading] = useState(true);

    const lastMonth = subMonths(new Date(), 1); // Get last month
    const lastMonthStart = startOfMonth(lastMonth); // Start of last month
    const lastMonthEnd = endOfMonth(lastMonth); // End of last month
    const formattedMonthYear = format(lastMonth, "MMMM yyyy"); // Format month and year

    useEffect(() => {
        const fetchPayslipData = async () => {
            try {
                const [payslipResponse, userResponse, attendanceResponse] = await Promise.all([
                    axios.get(`/api/payslip/${userId}`),
                    axios.get(`/api/users/${userId}`),
                    axios.post(`/api/reports/cumulative`, {
                        startDate: lastMonthStart.toISOString(),
                        endDate: lastMonthEnd.toISOString(),
                        employeeId: userId,
                    }),
                ]);

                setPayslipData(payslipResponse.data.payslip);
                setUserData(userResponse.data.user);
                setAttendanceData(attendanceResponse.data || null);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching payslip data:", error);
                setLoading(false);
            }
        };

        fetchPayslipData();
    }, [userId]);

    if (loading) return <div>Loading...</div>;

    if (!payslipData || !userData) return <div>No data available</div>;

    // Determine total days in the month based on monthCalculationType
    let totalDaysInMonth = getDaysInMonth(lastMonth);
    switch (userData.monthCalculationType) {
        case "Every Month 30 Days":
            totalDaysInMonth = 30;
            break;
        case "Every Month 28 Days":
            totalDaysInMonth = 28;
            break;
        case "Every Month 26 Days":
            totalDaysInMonth = 26;
            break;
        case "Exclude Weekly Offs":
            totalDaysInMonth -= attendanceData?.weekOffs || 0;
            break;
        default:
            // "Calendar Month" or any other invalid input defaults to actual days in the month
            break;
    }

    // Calculate payable days (working days + leaves)
    const payableDays = attendanceData
        ? attendanceData.workingDays + attendanceData.leaves
        : "-";

    // Calculate gross salary and deductions
    const totalSalary = userData.salaryDetails.reduce((total, item) => total + (item.amount || 0), 0);
    const deductions = userData.deductionDetails.reduce((total, item) => total + (item.amount || 0), 0);

    // Prorate salary based on attendance and total days in the month
    const proratedSalary = attendanceData
        ? Math.round((totalSalary / totalDaysInMonth) * (attendanceData.workingDays + attendanceData.leaves) - deductions)
        : "-";

    return (
        <div  className="p-8 border rounded-xl bg-white text-black max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center w-full mb-6">
                <div className="flex justify-start w-full gap-4 ">
                    <div>
                        {payslipData.logo && (
                            <img src={payslipData.logo} alt="Company Logo" className="h-16 mx-auto mb-4" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">{payslipData.name}</h1>
                        <p>{payslipData.address}</p>
                        <p>Mob: {payslipData.contact}</p>
                        <p>{payslipData.emailOrWebsite}</p>
                    </div>
                </div>
                <h2 className="text-xl tracking-widest font-semibold underline text-center mt-4">
                    PAYSLIP - {formattedMonthYear}
                </h2>
            </div>

            {/* Employee Details */}
            <table className="w-full border-collapse border mb-6 text-sm">
                <tbody>
                    <tr >
                        <h1 className=" px-4 py-2 font-semibold">For:
                            <span className="ml-1 uppercase">
                                {userData.firstName} {userData.lastName}
                            </span>
                        </h1>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Payroll/Work Location:</td>
                        <td className="border px-4 py-2">{userData.branch || "-"}</td>
                        <td className="border px-4 py-2 font-semibold">Bank Name:</td>
                        <td className="border px-4 py-2">{userData.bankDetails?.bankName || "-"}</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Employee Code:</td>
                        <td className="border px-4 py-2">{userData.employeeId}</td>
                        <td className="border px-4 py-2 font-semibold">IFSC Code:</td>
                        <td className="border px-4 py-2">{userData.bankDetails?.ifscCode || "-"}</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Employee Name:</td>
                        <td className="border px-4 py-2">
                            {userData.firstName} {userData.lastName}
                        </td>
                        <td className="border px-4 py-2 font-semibold">Bank A/c No:</td>
                        <td className="border px-4 py-2">{userData.bankDetails?.accountNumber || "-"}</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Department:</td>
                        <td className="border px-4 py-2">{userData.department || "-"}</td>
                        <td className="border px-4 py-2 font-semibold">Branch Name:</td>
                        <td className="border px-4 py-2">{userData.bankDetails?.branchName || "-"}</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-semibold">Designation:</td>
                        <td className="border px-4 py-2">{userData.designation || "-"}</td>
                        <td className="border px-4 py-2 font-semibold">Date Generated:</td>
                        <td className="border px-4 py-2">{format(new Date(), "dd/MM/yyyy")}</td>
                    </tr>
                </tbody>
            </table>

            {/* Salary and Deductions Table */}
            <table className="w-full border-collapse border text-left mb-6">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Standard Salary</th>
                        <th className="border px-4 py-2">Amount</th>
                        <th className="border px-4 py-2">Deductions</th>
                        <th className="border px-4 py-2">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {userData.salaryDetails.map((allowance, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{allowance.name}</td>
                            <td className="border px-4 py-2">{allowance.amount !== undefined ? allowance.amount : "-"}</td>
                            <td className="border px-4 py-2">{userData.deductionDetails[index]?.name || "-"}</td>
                            <td className="border px-4 py-2">{userData.deductionDetails[index]?.amount || "-"}</td>
                        </tr>
                    ))}
                    <tr>
                        <td className="border px-4 py-2 font-bold">Gross Pay</td>
                        <td className="border px-4 py-2 font-bold">{totalSalary}</td>
                        <td className="border px-4 py-2 font-bold">Total Deductions</td>
                        <td className="border px-4 py-2 font-bold">{deductions}</td>
                    </tr>
                    <tr>
                        <td className="border px-4 py-2 font-bold">Net Pay</td>
                        <td className="border px-4 py-2 font-bold">{proratedSalary}</td>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2"></td>
                    </tr>
                </tbody>
            </table>

            <p>
                <strong>Amount in Words:</strong>{" "}
                {proratedSalary !== "-" ? `${numberToWords(proratedSalary as number)} Only` : "-"}
            </p>
            <p>
                <strong>Payable Days:</strong> {payableDays}
            </p>
        </div>
    );
}
