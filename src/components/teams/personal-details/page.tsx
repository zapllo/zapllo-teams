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

export default function PersonalDetails({ userId }: { userId: string }) {

    const [bankDetails, setBankDetails] = useState({
        bankName: "",
        branchName: "",
        accountNumber: "",
        ifscCode: "",
    });

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`/api/users/${userId}`);
            const user = response.data.user;

            // Set bankDetails or initialize with empty fields
            setBankDetails(user.bankDetails || {
                bankName: "",
                branchName: "",
                accountNumber: "",
                ifscCode: "",
            });
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };


    const updateBankDetails = async () => {
        try {
            await axios.patch(`/api/users/update`, {
                _id: userId,
                bankDetails,
            });
            toast.success("Bank details updated successfully!");
        } catch (error) {
            console.error("Error updating bank details:", error);
            toast.error("Failed to update bank details.");
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    return (
        <div className="w-full max-w-3xl mx-auto ">
            <h1 className="text-xl font-semibold mb-4">Personal Details</h1>
            <Separator />
            <Accordion2 type="single" collapsible>
                {/* Bank Details Section */}
                <AccordionItem2 value="bankDetails">
                    <AccordionTrigger2 className="text-lg text-muted-foreground font-semibold">
                        Bank Details
                    </AccordionTrigger2>
                    <AccordionContent2>
                        <div className="grid grid-cols-2 gap-4">

                            <div className="relative mt-4">
                                <label className="absolute text-gray-500 bg-[#04061E] px-1 -top-2 left-2 text-xs">Bank Name</label>
                                <input
                                    type="text"
                                    value={bankDetails.bankName}
                                    onChange={(e) =>
                                        setBankDetails({ ...bankDetails, bankName: e.target.value })
                                    }
                                    className="border outline-none bg-[#04061E] rounded-2xl text-white focus:border-[#815bf5] px-2 py-2 w-full"
                                />
                            </div>

                            <div className="relative mt-4">
                                <label className="absolute text-gray-500 bg-[#04061E] px-1 -top-2 left-2 text-xs">Branch Name</label>
                                <input
                                    type="text"
                                    value={bankDetails.branchName}
                                    onChange={(e) =>
                                        setBankDetails({
                                            ...bankDetails,
                                            branchName: e.target.value,
                                        })
                                    }
                                    className="border outline-none bg-[#04061E] rounded-2xl text-white focus:border-[#815bf5] px-2 py-2 w-full"
                                />
                            </div>

                            <div className="relative mt-4">
                                <label className="absolute text-gray-500 bg-[#04061E] px-1 -top-2 left-2 text-xs">Account No</label>
                                <input
                                    type="text"
                                    value={bankDetails.accountNumber}
                                    onChange={(e) =>
                                        setBankDetails({
                                            ...bankDetails,
                                            accountNumber: e.target.value,
                                        })
                                    }
                                    className="border outline-none bg-[#04061E] rounded-2xl text-white focus:border-[#815bf5] px-2 py-2 w-full"
                                />
                            </div>

                            <div className="relative mt-4">
                                <label className="absolute text-gray-500 bg-[#04061E] px-1 -top-2 left-2 text-xs">IFSC Code</label>
                                <input
                                    type="text"
                                    value={bankDetails.ifscCode}
                                    onChange={(e) =>
                                        setBankDetails({ ...bankDetails, ifscCode: e.target.value })
                                    }
                                    className="border outline-none bg-[#04061E] rounded-2xl text-white focus:border-[#815bf5] px-2 py-2 w-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={updateBankDetails}
                                className="px-4 py-2 bg-[#017a5b] text-sm text-white rounded hover:bg-green-800"
                            >
                                Save Bank Details
                            </button>
                        </div>
                    </AccordionContent2>
                </AccordionItem2>

                {/* Legal Documents Section */}
                <AccordionItem2 value="legalDocuments">
                    <AccordionTrigger2 className="text-lg text-muted-foreground  font-semibold">
                        Legal Documents
                    </AccordionTrigger2>
                    <AccordionContent2>
                        <p>Legal Documents Section Coming Soon...</p>
                    </AccordionContent2>
                </AccordionItem2>

                {/* Contact Information Section */}
                <AccordionItem2 value="contactInformation">
                    <AccordionTrigger2 className="text-lg text-muted-foreground  font-semibold">
                        Contact Information
                    </AccordionTrigger2>
                    <AccordionContent2>
                        <p>Contact Information Section Coming Soon...</p>
                    </AccordionContent2>
                </AccordionItem2>

                {/* Personal Information Section */}
                <AccordionItem2 value="personalInformation">
                    <AccordionTrigger2 className="text-lg text-muted-foreground  font-semibold">
                        Personal Information
                    </AccordionTrigger2>
                    <AccordionContent2>
                        <p>Personal Information Section Coming Soon...</p>
                    </AccordionContent2>
                </AccordionItem2>

                {/* Reference Section */}
                <AccordionItem2 value="reference">
                    <AccordionTrigger2 className="text-lg text-muted-foreground  font-semibold">
                        Reference
                    </AccordionTrigger2>
                    <AccordionContent2>
                        <p>Reference Section Coming Soon...</p>
                    </AccordionContent2>
                </AccordionItem2>
            </Accordion2>
        </div>
    );
}
