"use client";

import React, { useEffect, useState } from "react";
import {
    Accordion2,
    AccordionItem2,
    AccordionTrigger2,
    AccordionContent2,
} from "../../ui/simple-accordion";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

interface PayslipLogData {
    _id: string;
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
    publicLink: string;
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

export default function UserLogs({ userId }: { userId: string }) {
    const [payslipLogData, setPayslipLogData] = useState<PayslipLogData[] | null>([]);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPayslipDetails = async () => {
            try {
                const response = await axios.get(`/api/payslip/${userId}`);
                if (response.data.success) {
                    const { payslipLogs, payslip } = response.data;
                    // Update the state with fetched payslip and payslip log details
                    setPayslipLogData(payslipLogs); // Salary and deduction info
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
    }, [userId]);

    console.log(payslipLogData, 'datda')
    return (
        <div className="w-full max-w-3xl mx-auto ">
            <h1 className="text-lg font-semibold mb-4">User Logs</h1>
            <Separator />
            <Accordion2 type="single" collapsible>
                {/* Bank Details Section */}
                <AccordionItem2 value="payslipLogs">
                    <AccordionTrigger2 className="text-lg text-muted-foreground font-semibold">
                        Payslip Logs
                    </AccordionTrigger2>
                    <AccordionContent2>
                        <div className="grid grid-cols-1 gap-4">
                            {payslipLogData?.map((payslips, index) => (
                                <div key={payslips._id}>
                                    <Link href={payslips.publicLink}>
                                        <h1 className="hover:underline text-blue-500 cursor-pointer">
                                            {new Date(payslips.year, payslips.month - 1).toLocaleString('default', { month: 'short', year: 'numeric' })}
                                        </h1>
                                        {/* <h1 className="hover:underline text-blue-500 cursor-pointer"> {payslips.month}-{payslips.year}</h1> */}
                                    </Link>
                                </div>
                            ))}



                        </div>

                    </AccordionContent2>
                </AccordionItem2>

            </Accordion2>
        </div>
    );
}
