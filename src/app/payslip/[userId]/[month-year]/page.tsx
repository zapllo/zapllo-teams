"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingNavbar } from "@/components/globals/navbar";

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
    return num.toString();
};

interface PayslipData {
    logo: string;
    name: string;
    address: string;
    contact: string;
    emailOrWebsite: string;
}

interface PayslipLogData {
    salaryDetails: {
        name: string;
        amount: number;
    }[];
    deductionDetails: {
        name: string;
        amount: number;
    }[];
    month: number;
    year: number;
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
}

export default function PayslipPage({
    params,
}: {
    params: { userId: string; "month-year": string };
}) {
    const { userId, "month-year": monthYear } = params;
    const [month, year] = monthYear.split("-").map(Number);
    const [payslipData, setPayslipData] = useState<PayslipData | null>(null);
    const [payslipLogData, setPayslipLogData] = useState<PayslipLogData | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [totalWorkingDays, setTotalWorkingDays] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingPrint, setLoadingPrint] = useState(false);

    const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    setLoadingPrint(true);
    if (printRef.current) {
        const originalContents = document.body.innerHTML;
        const printContents = printRef.current.innerHTML;

        document.body.innerHTML = `
        <style>
            @media print {
                * {
                    color: black !important;
                    background-color: white;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                img {
                    max-width: 100%;
                }
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 5px;
                    font-size: 11px;
                    line-height: 1.2;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 8px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 4px 6px;
                    text-align: left;
                    font-size: 10px;
                }
                h1, h2, h3 {
                    margin: 6px 0 4px 0;
                    font-size: 14px;
                }
                h2 {
                    font-size: 16px;
                    padding: 6px;
                }
                h3 {
                    font-size: 12px;
                    margin-bottom: 6px;
                }
                .header-section {
                    margin-bottom: 8px;
                    padding: 8px;
                }
                .section {
                    margin-bottom: 8px;
                }
                .net-pay-section {
                    padding: 8px;
                    margin: 8px 0;
                }
                .footer-section {
                    margin-top: 6px;
                    padding-top: 6px;
                }
                .company-logo {
                    max-height: 50px !important;
                }
                .zapllo-logo {
                    max-height: 12px !important;
                }
                @page {
                    size: A4;
                    margin: 8mm;
                }
                /* Force single page */
                .payslip-container {
                    page-break-inside: avoid;
                    height: auto;
                    max-height: none;
                }
                /* Reduce spacing */
                p {
                    margin: 2px 0;
                    font-size: 10px;
                }
            }
        </style>
        <div class="payslip-container">${printContents}</div>
    `;

        window.print();
        document.body.innerHTML = originalContents;
        setLoadingPrint(false);
    }
    window.location.reload();
};

    useEffect(() => {
        const fetchPayslipDetails = async () => {
            try {
                const response = await axios.get(`/api/payslip/${userId}/${month}-${year}`);
                if (response.data.success) {
                    const { payslipLog, payslip } = response.data;
                    setPayslipData(payslip);
                    setPayslipLogData(payslipLog);
                } else {
                    console.error("Error fetching payslip details:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching payslip details:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}`);
                if (response.status === 200) {
                    const { user } = response.data;
                    setUserData(user);
                } else {
                    console.error("Error fetching user details:", response.data.error);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchPayslipDetails();
        fetchUserDetails();
    }, [userId, month, year]);

    if (loading || loadingPrint) {
        return (
            <div className="flex justify-center items-center h-screen">
                <DotLottieReact
                    src="/lottie/loader.lottie"
                    loop
                    autoplay
                    className="h-56"
                />
            </div>
        );
    }

    if (!payslipLogData || !userData || !payslipData) return (
        <div className="h-screen w-screen items-center flex justify-center m-auto">
            <div className="text-center">
                <DotLottieReact
                    src="/lottie/empty.lottie"
                    loop
                    className="h-56 mx-auto"
                    autoplay
                />
                <h1 className="text-center text-lg">No Payslip Data Available</h1>
            </div>
        </div>
    );

    // Calculate net pay
    const grossPay = payslipLogData.salaryDetails.reduce((total, item) => total + (item.amount || 0), 0);
    const totalDeductions = payslipLogData.deductionDetails.reduce((total, item) => total + (item.amount || 0), 0);
    const netPay = grossPay - totalDeductions;

    return (
        <main className="bg-black min-h-screen pb-16">
            {/* <FloatingNavbar /> */}
            <div className="container  mx-auto px-4 py-6 max-w-5xl">
                {/* <div className="flex items-center justify-center mb-6">
                    <img src="/logo.png" className="h-8" alt="Logo" />
                </div> */}

                {/* Print Button */}
                <div className="mb-6">
                    <Button
                        onClick={handlePrint}
                        disabled={loadingPrint}
                        className="w-full sm:w-auto bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 border border-gray-400 rounded shadow flex items-center justify-center gap-2"
                    >
                        <Printer className="h-5 w-5" />
                        {loadingPrint ? "Printing..." : "Print Payslip"}
                    </Button>
                </div>

                {/* Payslip Content - Mobile Responsive */}
                <div
                    ref={printRef}
                    className="bg-white text-black rounded-xl shadow-lg overflow-hidden border border-gray-200"
                >
                    {/* Header */}
                    <div className="p-4 sm:p-6 border-b">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-center sm:text-left">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{payslipData.name}</h1>
                                <p className="text-gray-600 text-sm">{payslipData.address}</p>
                                <p className="text-gray-600 text-sm">Mob: {payslipData.contact}</p>
                                <p className="text-gray-600 text-sm">{payslipData.emailOrWebsite}</p>
                            </div>
                            {payslipData.logo && (
                                <img
                                    src={payslipData.logo}
                                    alt="Company Logo"
                                    className="h-16 sm:h-20 w-auto object-contain"
                                />
                            )}
                        </div>
                        <h2 className="text-lg sm:text-xl text-center font-semibold mt-4 pt-3 text-blue-700 bg-gray-50 py-2 rounded-md">
                            PAYSLIP - {format(new Date(year, month - 1), "MMMM yyyy")}
                        </h2>
                    </div>

                    {/* Employee Information */}
                    <div className="p-4 sm:p-6">
                        <h3 className="text-md sm:text-lg font-semibold mb-3 text-gray-700">Employee Information</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border text-sm bg-white mb-6">
                                <tbody>
                                    <tr>
                                        <td className="border px-3 py-2 font-semibold bg-gray-50">Employee Name:</td>
                                        <td className="border px-3 py-2">
                                            {userData.firstName} {userData.lastName}
                                        </td>
                                        <td className="border px-3 py-2 font-semibold bg-gray-50">Employee Code:</td>
                                        <td className="border px-3 py-2">{userData.employeeId || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-3 py-2 font-semibold bg-gray-50">Designation:</td>
                                        <td className="border px-3 py-2">{userData.designation || "-"}</td>
                                        <td className="border px-3 py-2 font-semibold bg-gray-50">Department:</td>
                                        <td className="border px-3 py-2">{userData.department || "-"}</td>
                                    </tr>
                                    <tr>
                                        <td className="border px-3 py-2 font-semibold bg-gray-50">Work Location:</td>
                                        <td className="border px-3 py-2">{userData.branch || "-"}</td>
                                        <td className="border px-3 py-2 font-semibold bg-gray-50">Working Days:</td>
                                        <td className="border px-3 py-2">{totalWorkingDays || "-"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Bank Details if available */}
                        {userData.bankDetails && (
                            <div className="mt-6">
                                <h3 className="text-md sm:text-lg font-semibold mb-3 text-gray-700">Bank Details</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border text-sm bg-white mb-6">
                                        <tbody>
                                            <tr>
                                                <td className="border px-3 py-2 font-semibold bg-gray-50">Bank Name:</td>
                                                <td className="border px-3 py-2">{userData.bankDetails.bankName || "-"}</td>
                                                <td className="border px-3 py-2 font-semibold bg-gray-50">Branch:</td>
                                                <td className="border px-3 py-2">{userData.bankDetails.branchName || "-"}</td>
                                            </tr>
                                            <tr>
                                                <td className="border px-3 py-2 font-semibold bg-gray-50">Account Number:</td>
                                                <td className="border px-3 py-2">{userData.bankDetails.accountNumber || "-"}</td>
                                                <td className="border px-3 py-2 font-semibold bg-gray-50">IFSC Code:</td>
                                                <td className="border px-3 py-2">{userData.bankDetails.ifscCode || "-"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Earnings & Deductions */}
                        <div className="mt-6">
                            <h3 className="text-md sm:text-lg font-semibold mb-3 text-gray-700">Earnings & Deductions</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border text-sm bg-white mb-6">
                                    <thead>
                                        <tr className="bg-blue-50">
                                            <th className="border px-3 py-2 text-blue-700 text-left">Standard Salary</th>
                                            <th className="border px-3 py-2 text-blue-700 text-right">Amount</th>
                                            <th className="border px-3 py-2 text-red-700 text-left">Deductions</th>
                                            <th className="border px-3 py-2 text-red-700 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payslipLogData.salaryDetails.map((allowance, index) => (
                                            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                                                <td className="border px-3 py-2">{allowance.name}</td>
                                                <td className="border px-3 py-2 text-right">₹ {allowance.amount.toLocaleString('en-IN')}</td>
                                                <td className="border px-3 py-2">
                                                    {payslipLogData.deductionDetails[index]?.name || "-"}
                                                </td>
                                                <td className="border px-3 py-2 text-right">
                                                    {payslipLogData.deductionDetails[index]?.amount ?
                                                        `₹ ${payslipLogData.deductionDetails[index].amount.toLocaleString('en-IN')}` : "-"}
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="font-bold bg-gray-100">
                                            <td className="border px-3 py-2">Gross Pay</td>
                                            <td className="border px-3 py-2 text-right text-blue-700">
                                                ₹ {grossPay.toLocaleString('en-IN')}
                                            </td>
                                            <td className="border px-3 py-2">Total Deductions</td>
                                            <td className="border px-3 py-2 text-right text-red-700">
                                                ₹ {totalDeductions.toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Net Pay Summary */}
                        <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-100">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="mb-2 sm:mb-0">
                                    <h3 className="font-semibold text-gray-700 mb-1">Net Pay:</h3>
                                    <p className="text-xl sm:text-2xl font-bold text-blue-700">
                                        ₹ {netPay.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-1">Amount in Words:</h3>
                                    <p className="text-sm italic">
                                        {numberToWords(netPay)} Only
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t pt-4 mt-6">
                            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mb-4">
                                <span className="font-medium">Powered by</span>
                                <a
                                    href="https://zapllo.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center hover:opacity-80 transition-opacity"
                                >
                                    <img
                                        src="https://res.cloudinary.com/dndzbt8al/image/upload/v1743846882/logo-01_1_a2qvzt.png"
                                        alt="Zapllo"
                                        className="h-4"
                                    />
                                </a>
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                                This is a computer-generated document. No signature is required.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
