"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";
import { Mail, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";

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

interface SalaryDetail {
    name: string;
    amount: number;
}

interface DeductionDetail {
    name: string;
    amount: number;
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
    const [loadingPrint, setLoadingPrint] = useState(false); // Loader state for print
    const router = useRouter();

    const printRef = useRef<HTMLDivElement>(null);

    console.log(userId, 'user id')

    const handlePrint = () => {
        setLoadingPrint(true); // Show loader
        if (printRef.current) {

            const originalContents = document.body.innerHTML; // Save the original document content
            const printContents = printRef.current.innerHTML; // Get the content to print

            document.body.innerHTML = printContents; // Replace body content with the content to print
            document.body.innerHTML = `
            <style>
                @media print {
                    * {
                        color: black !important; /* Force all text to be black */
                        background-color:white
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    img {
                        max-width: 100%;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 10px;
                    }
                }
            </style>
            <div>${printContents}</div>
        `;

            window.print(); // Trigger the print dialog

            document.body.innerHTML = originalContents; // Restore the original document content

            setLoadingPrint(false); // Hide loader after print
        }
        window.location.reload();

    };






    // useEffect(() => {
    //     const fetchPayslipData = async () => {
    //         try {
    //             const [payslipResponse, userResponse, generateResponse] = await Promise.all([
    //                 axios.get(`/api/payslip/${userId}`),
    //                 axios.get(`/api/users/${userId}`),
    //                 axios.post(`/api/payslip/generate`, { userId, month, year }),
    //             ]);

    //             setPayslipData(payslipResponse.data.payslip);
    //             setUserData(userResponse.data.user);
    //             setTotalWorkingDays(generateResponse.data.totalWorkingDays);
    //         } catch (error) {
    //             console.error("Error fetching payslip data:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchPayslipData();
    // }, [userId, month, year]);

    useEffect(() => {
        const fetchPayslipDetails = async () => {
            try {
                const response = await axios.get(`/api/payslip/${userId}/${month}-${year}`);
                if (response.data.success) {
                    const { payslipLog, payslip } = response.data;
                    // Update the state with fetched payslip and payslip log details
                    setPayslipData(payslip); // Static company info
                    setPayslipLogData(payslipLog); // Salary and deduction info
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
                    const { user } = response.data; // `user` is directly available in the response
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

    console.log(userData, 'user data')
    if (loadingPrint) {
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


    const handleEmailShare = async () => {
        try {
            const response = await axios.post(`/api/payslip/share`, {
                userId,
                month,
                year
            });
            toast.success("Email Sent Successfully");

            setLoading(false);
        } catch (error) {
            console.error("Error fetching payslip data:", error);
            setLoading(false);
        }
    };

    const handleWhatsappShare = async () => {
        try {
            const response = await axios.post(`/api/payslip/share/whatsapp`, {
                userId,
                month,
                year
            });
            toast.success("WhatsApp Message Sent Successfully");
            setLoading(false);
        } catch (error) {
            console.error("Error fetching payslip data:", error);
            setLoading(false);
        }
    };



    if (loading) {
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
            <div className="">
                <DotLottieReact
                    src="/lottie/empty.lottie"
                    loop
                    className="h-56"
                    autoplay
                />
                <h1 className="text-center text-lg">No Data Available</h1>
            </div>
        </div>
    );

    return (
        <div className="mt-16 mb-12 h-screen mx-4 flex flex-col overflow-y-scroll scrollbar-hide">
        {/* Beautified Actions Tab */}
        <div className="mb-8 mt-4 max-w-5xl mx-auto w-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border p-6 w-full">
                <h1 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Payslip Actions
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Print Button */}
                    <Button
                        onClick={handlePrint}
                        disabled={loadingPrint}
                        className={`w-full px-4 py-6 flex justify-center text-gray-700 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 items-center gap-3 rounded-lg border hover:shadow-md transition-all ${loadingPrint ? "bg-gray-200 dark:bg-gray-600 cursor-not-allowed" : "hover:bg-white dark:hover:bg-gray-600"}`}
                    >
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 flex items-center justify-center">
                            <Printer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-medium">{loadingPrint ? "Printing..." : "Print Payslip"}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Generate a printable version</span>
                        </div>
                    </Button>

                    {/* Email Button */}
                    <Button
                        onClick={handleEmailShare}
                        disabled={loadingPrint}
                        className={`w-full px-4 py-6 flex justify-center text-gray-700 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 items-center gap-3 rounded-lg border hover:shadow-md transition-all ${loadingPrint ? "bg-gray-200 dark:bg-gray-600 cursor-not-allowed" : "hover:bg-white dark:hover:bg-gray-600"}`}
                    >
                        <div className="rounded-full bg-red-100 dark:bg-red-900 p-2 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-medium">Send Email</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Deliver payslip via email</span>
                        </div>
                    </Button>

                    {/* WhatsApp Button */}
                    <Button
                        onClick={handleWhatsappShare}
                        disabled={loadingPrint}
                        className={`w-full px-4 py-6 flex justify-center text-gray-700 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 items-center gap-3 rounded-lg border hover:shadow-md transition-all ${loadingPrint ? "bg-gray-200 dark:bg-gray-600 cursor-not-allowed" : "hover:bg-white dark:hover:bg-gray-600"}`}
                    >
                        <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center">
                            <FaWhatsapp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-medium">Send WhatsApp</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Share via WhatsApp message</span>
                        </div>
                    </Button>
                </div>
            </div>
        </div>

            <div ref={printRef} className="p-8 border w-full scrollbar-hide h- rounded-xl bg-white text-black max-w-5xl mx-auto shadow-md">
                {/* Header */}
                <div className="payslip-header mb-6 border-b pb-4">
                    <div className="flex w-full heading justify-between items-center gap-4">
                        <div className="w-full">
                            <h1 className="text-2xl companyName font-bold text-gray-800">{payslipData?.name}</h1>
                            <p className="address text-gray-600">{payslipData?.address}</p>
                            <p className="mob text-gray-600">Mob: {payslipData?.contact}</p>
                            <p className="email text-gray-600">{payslipData?.emailOrWebsite}</p>
                        </div>
                        <div>
                            {payslipData?.logo && (
                                <img
                                    src={payslipData.logo}
                                    alt="Company Logo"
                                    className="h-20 w-auto object-contain"
                                />
                            )}
                        </div>
                    </div>
                    <h2 className="text-xl mb-2 tracking-widest font-semibold text-center mt-6 text-blue-700 bg-gray-50 py-2 rounded-md">
                        PAYSLIP - {format(new Date(year, month - 1), "MMMM yyyy")}
                    </h2>
                </div>

                {/* Employee Details */}
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Employee Information</h3>
                    <table className="w-full border-collapse border mb-0 text-sm bg-white rounded-md overflow-hidden">
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2 font-semibold bg-gray-50 w-1/4">Employee Name:</td>
                                <td className="border px-4 py-2 w-1/4">
                                    {userData?.firstName} {userData?.lastName}
                                </td>
                                <td className="border px-4 py-2 font-semibold bg-gray-50 w-1/4">Employee Code:</td>
                                <td className="border px-4 py-2 w-1/4">{userData?.employeeId}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-semibold bg-gray-50">Designation:</td>
                                <td className="border px-4 py-2">{userData?.designation || "-"}</td>
                                <td className="border px-4 py-2 font-semibold bg-gray-50">Department:</td>
                                <td className="border px-4 py-2">{userData?.department || "-"}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-semibold bg-gray-50">Work Location:</td>
                                <td className="border px-4 py-2">{userData?.branch || "-"}</td>
                                <td className="border px-4 py-2 font-semibold bg-gray-50">Total Working Days:</td>
                                <td className="border px-4 py-2">{totalWorkingDays || "-"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Bank Details */}
                {userData?.bankDetails && (
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">Bank Details</h3>
                        <table className="w-full border-collapse border mb-0 text-sm bg-white rounded-md overflow-hidden">
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2 font-semibold bg-gray-50 w-1/4">Bank Name:</td>
                                    <td className="border px-4 py-2 w-1/4">{userData.bankDetails.bankName || "-"}</td>
                                    <td className="border px-4 py-2 font-semibold bg-gray-50 w-1/4">Branch:</td>
                                    <td className="border px-4 py-2 w-1/4">{userData.bankDetails.branchName || "-"}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-semibold bg-gray-50">Account Number:</td>
                                    <td className="border px-4 py-2">{userData.bankDetails.accountNumber || "-"}</td>
                                    <td className="border px-4 py-2 font-semibold bg-gray-50">IFSC Code:</td>
                                    <td className="border px-4 py-2">{userData.bankDetails.ifscCode || "-"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Salary and Deductions Table */}
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Earnings & Deductions</h3>
                    <table className="w-full border-collapse border text-left mb-0 bg-white rounded-md overflow-hidden">
                        <thead>
                            <tr className="bg-blue-50">
                                <th className="border px-4 py-2 text-blue-700">Standard Salary</th>
                                <th className="border px-4 py-2 text-blue-700 text-right">Amount</th>
                                <th className="border px-4 py-2 text-red-700">Deductions</th>
                                <th className="border px-4 py-2 text-red-700 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payslipLogData?.salaryDetails.map((allowance, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                                    <td className="border px-4 py-2">{allowance.name}</td>
                                    <td className="border px-4 py-2 text-right">₹ {allowance.amount.toLocaleString('en-IN')}</td>
                                    <td className="border px-4 py-2">
                                        {payslipLogData.deductionDetails[index]?.name || "-"}
                                    </td>
                                    <td className="border px-4 py-2 text-right">
                                        {payslipLogData.deductionDetails[index]?.amount ?
                                            `₹ ${payslipLogData.deductionDetails[index].amount.toLocaleString('en-IN')}` : "-"}
                                    </td>
                                </tr>
                            ))}
                            <tr className="font-bold bg-gray-100">
                                <td className="border px-4 py-2">Gross Pay</td>
                                <td className="border px-4 py-2 text-right text-blue-700">
                                    ₹ {payslipLogData?.salaryDetails
                                        .reduce((total, item) => total + (item.amount || 0), 0)
                                        .toLocaleString('en-IN')}
                                </td>
                                <td className="border px-4 py-2">Total Deductions</td>
                                <td className="border px-4 py-2 text-right text-red-700">
                                    ₹ {payslipLogData?.deductionDetails
                                        .reduce((total, item) => total + (item.amount || 0), 0)
                                        .toLocaleString('en-IN')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Net Pay Summary */}
                <div className="bg-blue-50 p-4 rounded-md mb-8 border border-blue-100">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="mb-2 md:mb-0">
                            <h3 className="font-semibold text-gray-700 mb-1">Net Pay:</h3>
                            <p className="text-2xl font-bold text-blue-700">
                                ₹{" "}
                                {(
                                    payslipLogData?.salaryDetails?.reduce(
                                        (total, item) => total + (item.amount || 0),
                                        0
                                    ) -
                                    payslipLogData?.deductionDetails?.reduce(
                                        (total, item) => total + (item.amount || 0),
                                        0
                                    )
                                ).toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700 mb-1">Amount in Words:</h3>
                            <p className="text-sm italic">
                                {numberToWords(
                                    payslipLogData?.salaryDetails?.reduce((total, item) => total + (item.amount || 0), 0) -
                                    payslipLogData?.deductionDetails?.reduce(
                                        (total, item) => total + (item.amount || 0),
                                        0
                                    )
                                )}{" "}
                                Only
                            </p>
                        </div>
                    </div>
                </div>
                <div className="border-t px-6 py-4 flex items-center justify-center space-x-2 text-xs text-muted-foreground"

                >
                    <span className='text-muted-foreground font-bold tracking-'>Powered by</span>
                    <a
                        href="https://zapllo.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center hover:opacity-80 transition-opacity"
                    >
                        <img
                            src="https://res.cloudinary.com/dndzbt8al/image/upload/v1743846882/logo-01_1_a2qvzt.png"
                            alt="Zapllo"
                            className="h-4 mr-1"
                        />

                    </a>
                </div>
                {/* Disclaimer */}
                <div className="mt-8 text-xs text-gray-500 border-t pt-4">
                    <p>This is a computer-generated document. No signature is required.</p>
                </div>


            </div>
        </div>
    );
}
