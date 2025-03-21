"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";
import { Mail, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
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
            setLoading(false);
        } catch (error) {
            console.error("Error fetching payslip data:", error);
            setLoading(false);
        }
    };



    if (loading) return <div>Loading...</div>;
    if (!payslipLogData || !userData || !payslipData) return <div className="ml-24 text-2xl font-bold mt-12">No data available</div>;

    return (
        <main className="bg-[#] bg-[#05071E]  mx-auto h-full z-10 overflow-hidden">
            {/* <FloatingNavbar /> */}
            <div className="flex items-center justify-center m-auto ">
                <img src="/logo.png" className="h-8 mt-6" />
            </div>
            <div className="  mb-12  h-full mx-4   scrollbar-hide">
                <div className="flex justify-start gap-4 mx-auto p-4">
                    <div className="  px-4 py-2 rounded-md ">
                        {/* <h1 className="font-bold text-lg">Actions:</h1> */}

                    </div>
                </div>
                <div className="grid text-white max-w-5xl mx-auto w-full gap-4 py-2 ">
                    <div>
                        <Button
                            onClick={handlePrint}
                            disabled={loadingPrint} // Disable button while printing
                            className={`px-4 py-2 flex bg-transparent items-center gap-2 rounded-md border shadow-md ${loadingPrint ? "bg-gray-400 cursor-not-allowed" : " hover:bg-transparent hover:border-muted-foreground "
                                } text-`}
                        >
                            <Printer className="h-5" /> {loadingPrint ? "Printing..." : "Print Payslip"}
                        </Button>
                    </div>
                </div>
                <div ref={printRef} className="p-8 border  w-full  scrollbar-hide overflow-x-scroll rounded-xl bg-white text-black max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="payslip-header">
                        <div className="flex w-full heading justify-between gap-4">
                            <div className="w-full">
                                <h1 className="text-xl companyName font-bold">{payslipData.name}</h1>
                                <p className="address">{payslipData.address}</p>
                                <p className="mob">Mob: {payslipData.contact}</p>
                                <p className="email">{payslipData.emailOrWebsite}</p>
                            </div>
                            <div>
                                {payslipData.logo && (
                                    <img
                                        src={payslipData.logo}
                                        alt="Company Logo"
                                        className="h-16 w-auto mx-auto mb-4"
                                    />
                                )}
                            </div>
                        </div>
                        <h2 className="text-xl mb-4 tracking-widest font-semibold underline text-center mt-6">
                            PAYSLIP - {format(new Date(year, month - 1), "MMMM yyyy")}
                        </h2>
                    </div>

                    {/* Employee Details */}
                    <table className="w-full border-collapse border mb-6 text-sm">
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2 font-semibold">Employee Name:</td>
                                <td className="border px-4 py-2">
                                    {userData.firstName} {userData.lastName}
                                </td>
                                <td className="border px-4 py-2 font-semibold">Employee Code:</td>
                                <td className="border px-4 py-2">{userData.employeeId}</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2 font-semibold">Payroll/Work Location:</td>
                                <td className="border px-4 py-2">{userData.branch || "-"}</td>
                                <td className="border px-4 py-2 font-semibold">Total Working Days:</td>
                                <td className="border px-4 py-2">{totalWorkingDays || "-"}</td>
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
                            {payslipLogData?.salaryDetails.map((allowance, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{allowance.name}</td>
                                    <td className="border px-4 py-2">₹ {allowance.amount}</td>
                                    <td className="border px-4 py-2">
                                        {payslipLogData.deductionDetails[index]?.name || "-"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        ₹ {payslipLogData.deductionDetails[index]?.amount || "-"}
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td className="border px-4 py-2 font-bold">Gross Pay</td>
                                <td className="border px-4 py-2 font-bold">
                                    ₹ {payslipLogData?.salaryDetails.reduce((total, item) => total + (item.amount || 0), 0)}
                                </td>
                                <td className="border px-4 py-2 font-bold">Total Deductions</td>
                                <td className="border px-4 py-2 font-bold">
                                    ₹ {payslipLogData?.deductionDetails.reduce((total, item) => total + (item.amount || 0), 0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="flex justify-between">
                        <div>
                            <strong>Total Amount:</strong>{" "}
                            ₹{" "}
                            {payslipLogData?.salaryDetails?.reduce(
                                (total, item) => total + (item.amount || 0),
                                0
                            ) -
                                payslipLogData?.deductionDetails?.reduce(
                                    (total, item) => total + (item.amount || 0),
                                    0
                                )}
                        </div>
                        <div className="mb-12">
                            <strong>Amount in Words:</strong>{" "}
                            {numberToWords(
                                payslipLogData?.salaryDetails?.reduce((total, item) => total + (item.amount || 0), 0) -
                                payslipLogData?.deductionDetails?.reduce(
                                    (total, item) => total + (item.amount || 0),
                                    0
                                )
                            )}{" "}
                            Only
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}