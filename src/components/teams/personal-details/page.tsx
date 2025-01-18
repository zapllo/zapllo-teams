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
import LegalDocuments from "../legalDocuments/page";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CustomDatePicker from "@/components/globals/date-picker";
import { Calendar } from "lucide-react";

export default function PersonalDetails({ userId }: { userId: string }) {
    const [bankDetails, setBankDetails] = useState({
        bankName: "",
        branchName: "",
        accountNumber: "",
        ifscCode: "",
    });

    const [personalInfo, setPersonalInfo] = useState({
        dateOfBirth: null,
        dateOfJoining: null,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [datePickerTarget, setDatePickerTarget] = useState<"dateOfBirth" | "dateOfJoining">("dateOfBirth");


    const handleDateChange = (date: Date) => {
        setPersonalInfo((prev) => ({
            ...prev,
            [datePickerTarget]: date,
        }));
    };

    const [contactDetails, setContactDetails] = useState({
        emergencyContact: "",
        contactPersonName: "",
        relation: "",
        address: "",
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

            // Set contactDetails or initialize with empty fields
            setContactDetails(user.contactDetails || {
                emergencyContact: "",
                contactPersonName: "",
                relation: "",
                address: "",
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

    const updateContactDetails = async () => {
        try {
            await axios.patch(`/api/users/update`, {
                _id: userId,
                contactDetails,
            });
            toast.success("Contact details updated successfully!");
        } catch (error) {
            console.error("Error updating contact details:", error);
            toast.error("Failed to update contact details.");
        }
    };

    const savePersonalInformation = async () => {
        try {
            await axios.patch(`/api/users/update`, {
                _id: userId,
                personalInformation: personalInfo,
            });
            toast.success("Personal information updated successfully!");
        } catch (error) {
            console.error("Error updating personal information:", error);
            toast.error("Failed to update personal information.");
        }
    };


    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    return (
        <div className="w-full max-w-3xl mx-auto">
            <h1 className="text-lg font-semibold mb-4">Personal Details</h1>
            <Separator />
            <Accordion2 type="single" collapsible>
                {/* Bank Details Section */}
                <AccordionItem2 value="bankDetails">
                    <AccordionTrigger2 className="text-muted-foreground font-semibold">
                        Bank Details
                    </AccordionTrigger2>
                    <AccordionContent2 className="border rounded-xl p-4">
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
                                className="px-4 py-2 bg-[#017a5b] text-xs text-white rounded hover:bg-green-800"
                            >
                                Save Bank Details
                            </button>
                        </div>
                    </AccordionContent2>
                </AccordionItem2>

                {/* Legal Documents Section */}
                <AccordionItem2 value="legalDocuments">
                    <AccordionTrigger2 className="text-muted-foreground font-semibold">
                        Legal Documents
                    </AccordionTrigger2>
                    <AccordionContent2>
                        <LegalDocuments userId={userId} />
                    </AccordionContent2>
                </AccordionItem2>

                {/* Contact Information Section */}
                <AccordionItem2 value="contactInformation">
                    <AccordionTrigger2 className="text-muted-foreground font-semibold">
                        Contact Information
                    </AccordionTrigger2>
                    <AccordionContent2 className="border p-4 rounded-xl">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="relative mt-4">
                                <label className="absolute text-gray-500 bg-[#04061E] px-1 -top-2 left-2 text-xs">Emergency Contact</label>
                                <input
                                    type="text"
                                    value={contactDetails.emergencyContact}
                                    onChange={(e) =>
                                        setContactDetails({ ...contactDetails, emergencyContact: e.target.value })
                                    }
                                    className="border outline-none bg-[#04061E] rounded-2xl text-white focus:border-[#815bf5] px-2 py-2 w-72"
                                />
                            </div>

                            <div className="relative mt-4">
                                <label className="absolute text-gray-500 bg-[#04061E] px-1 -top-2 left-2 text-xs">Contact Person Name</label>
                                <input
                                    type="text"
                                    value={contactDetails.contactPersonName}
                                    onChange={(e) =>
                                        setContactDetails({
                                            ...contactDetails,
                                            contactPersonName: e.target.value,
                                        })
                                    }
                                    className="border outline-none bg-[#04061E] rounded-2xl text-white focus:border-[#815bf5] px-2 py-2 w-72"
                                />
                            </div>

                            <div className="relative mt-4">
                                <label className="absolute text-gray-500 bg-[#04061E] px-1 -top-2 left-2 text-xs">Relation</label>
                                <input
                                    type="text"
                                    value={contactDetails.relation}
                                    onChange={(e) =>
                                        setContactDetails({ ...contactDetails, relation: e.target.value })
                                    }
                                    className="border outline-none bg-[#04061E] rounded-2xl text-white focus:border-[#815bf5] px-2 py-2 w-72"
                                />
                            </div>

                            <div className="relative mt-4">
                                <label className="absolute text-gray-500 bg-[#04061E] px-1 -top-2 left-2 text-xs">Address</label>
                                <textarea
                                    value={contactDetails.address}
                                    onChange={(e) =>
                                        setContactDetails({ ...contactDetails, address: e.target.value })
                                    }
                                    className="border outline-none bg-[#04061E] rounded-2xl text-white focus:border-[#815bf5] px-2 py-2 w-72"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={updateContactDetails}
                                className="px-4 py-2 bg-[#017a5b] text-xs text-white rounded hover:bg-green-800"
                            >
                                Save Contact Details
                            </button>
                        </div>
                    </AccordionContent2>
                </AccordionItem2>

                {/* Personal Information Section */}
                <AccordionItem2 value="personalInformation">
                    <AccordionTrigger2 className="text-muted-foreground font-semibold">
                        Personal Information
                    </AccordionTrigger2>
                    <AccordionContent2 className="border rounded-xl  justify-between  p-4">
                        <div className="grid  grid-cols-2  gap-4">
                            <div>
                                <label className="block text-sm">Date of Birth</label>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger onClick={() => setDatePickerTarget("dateOfBirth")}>
                                        <button className="px-4 mt-2 gap-2 hover:border-muted-foreground py-2 border bg-transparent  text-white flex items-center rounded">
                                            <Calendar className="h-4" />
                                            {personalInfo.dateOfBirth
                                                ? new Date(personalInfo.dateOfBirth).toDateString()
                                                : "Select date"}
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="z-[100] scale-90  flex justify-center ">
                                        <div className="z-[20] rounded-lg  scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
                                            <div className="w-full flex mb-4 justify-between">
                                                <CustomDatePicker
                                                    selectedDate={personalInfo.dateOfBirth}
                                                    onDateChange={handleDateChange}
                                                    onCloseDialog={() => setIsDialogOpen(false)}
                                                />
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div>
                                <label className="block">Date of Joining</label>

                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger onClick={() => setDatePickerTarget("dateOfJoining")}>
                                        <button className="px-4 mt-2 py-2 border  gap-2 hover:border-muted-foreground bg-transparent  text-white flex items-center rounded">
                                            <Calendar className="h-4" />
                                            {personalInfo.dateOfJoining
                                                ? new Date(personalInfo.dateOfJoining).toDateString()
                                                : "Select Date"}
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="z-[100] scale-90  flex justify-center ">
                                        <div className="z-[20] rounded-lg  scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
                                            <div className="w-full flex mb-4 justify-between">
                                                <CustomDatePicker
                                                    selectedDate={personalInfo.dateOfJoining}
                                                    onDateChange={handleDateChange}
                                                    onCloseDialog={() => setIsDialogOpen(false)}
                                                />
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <div className="flex justify-end ">
                            <button
                                onClick={savePersonalInformation}
                                className="px-4 py-2 text-xs  bg-[#017a5b] text-white rounded mt-4"
                            >
                                Save Personal Information
                            </button>
                        </div>
                    </AccordionContent2>
                </AccordionItem2>
            </Accordion2>
        </div>
    );
}
