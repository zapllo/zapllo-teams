"use client";

// components/HolidayFormModal.tsx
import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { toast } from "sonner";
import Loader from "../ui/loader";
import CustomDatePicker from "../globals/date-picker";
import { Calendar } from "lucide-react";

interface Holiday {
    _id: string;
    holidayName: string;
    holidayDate: string;
}

interface HolidayFormModalProps {
    holiday: Holiday;
    onHolidayUpdated: (updatedHoliday: Holiday) => void;
    onClose: () => void;
}

const HolidayFormModal: React.FC<HolidayFormModalProps> = ({
    holiday,
    onHolidayUpdated,
    onClose,
}) => {
    const [holidayName, setHolidayName] = useState(holiday.holidayName);
    const [holidayDate, setHolidayDate] = useState<string | null>(holiday.holidayDate);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!holidayName || !holidayDate) {
            toast.error("Please fill all the fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.put(`/api/holidays/${holiday._id}`, {
                holidayName,
                holidayDate,
            });

            onHolidayUpdated(response.data.holiday);
            setIsSubmitting(false);
            onClose(); // Close the modal after successful update
        } catch (error) {
            console.error("Error updating holiday:", error);
            toast.error("Failed to update holiday");
            setIsSubmitting(false);
        }
    };

    // Function to format the date to "dd-mm-yyyy"
    const formatDate = (dateString: string | null): string => {
        if (!dateString) return "Select Date";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="z-[100] flex items-center justify-center">
                <div className="bg-[#0b0d29] w-full max-w-lg overflow-y-scroll scrollbar-hide h-fit max-h-[600px] shadow-lg rounded-lg">
                    <div className="flex border-b py-2 w-full justify-between">
                        <DialogTitle className="text-md px-6 py-2 font-medium">
                            Edit Holiday
                        </DialogTitle>
                        <DialogClose className="px-6 py-2">
                            <button
                                onClick={onClose}
                                className="scale-150 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
                            >
                                X
                            </button>
                        </DialogClose>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 p-6">
                        <div className="relative">
                            <label className="absolute bg-[#0b0d29] text-[#787CA5] ml-2 text-xs -mt-2 px-1">
                                Holiday Name
                            </label>
                            <input
                                type="text"
                                value={holidayName}
                                onChange={(e) => setHolidayName(e.target.value)}
                                required
                                className="w-full focus-within:border-[#815BF5] text-sm p-2 border bg-transparent outline-none rounded"
                            />
                        </div>

                        <div className="mt-4">
                            <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() => setIsDatePickerOpen(true)}
                                        className="rounded border w-full px-2 flex gap-1 py-2"
                                    >
                                        {holidayDate ? (
                                            <div className="flex gap-1">
                                                <Calendar className="h-5" />
                                                <h1 className="h-5 text-xs mt-0.5">
                                                    {formatDate(holidayDate)}
                                                </h1>
                                            </div>
                                        ) : (
                                            <div className="flex gap-1">
                                                <Calendar className="h-5" />
                                                <h1 className="text-xs mt-0.5 bg-[#0b0d29] text-[#787CA5]">
                                                    Select Date
                                                </h1>
                                            </div>
                                        )}
                                    </button>
                                </DialogTrigger>

                                <DialogContent className="z-[100] scale-90 flex justify-center">
                                    <div className="z-[20] rounded-lg scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
                                        <div className="w-full flex mb-4 justify-between">
                                            <CustomDatePicker
                                                selectedDate={holidayDate ? new Date(holidayDate) : null}
                                                onDateChange={(newDate) => {
                                                    const localDate = new Date(
                                                        newDate.getTime() - newDate.getTimezoneOffset() * 60000
                                                    )
                                                        .toISOString()
                                                        .split("T")[0];
                                                    setHolidayDate(localDate);
                                                    setIsDatePickerOpen(false); // Close the picker after selecting the date
                                                }}
                                                onCloseDialog={() => setIsDatePickerOpen(false)}
                                            />
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="bg-[#815BF5] w-full text-sm cursor-pointer text-white px-4 mt-6 py-2 rounded"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader /> : "Update Holiday"}
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HolidayFormModal;
