"use client";

// components/HolidayForm.tsx
import React, { useState } from "react";
import axios from "axios";
import CustomDatePicker from "../globals/date-picker";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { toast, Toaster } from "sonner";
import { Calendar } from "lucide-react";
import Loader from "../ui/loader";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface HolidayFormProps {
  onHolidayCreated: () => void; // Callback to trigger after a holiday is created
}

const HolidayForm: React.FC<HolidayFormProps> = ({ onHolidayCreated }) => {
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState<string | null>(null); // Change to string or null to handle the custom date
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // To handle the date picker dialog

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayName || !holidayDate) {
      toast.error("Please fill all the fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send request to create holiday
      await axios.post("/api/holidays", {
        holidayName,
        holidayDate,
      });

      // Reset form
      setHolidayName("");
      setHolidayDate(null); // Reset holiday date
      setIsSubmitting(false);
     
      // Callback after creation
      onHolidayCreated();
    } catch (error) {
      console.error("Error creating holiday:", error);
      toast.error("Failed to add holiday");
      setIsSubmitting(false);
    }
  };

  // Function to format the date to "dd-mm-yyyy"
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Select Date";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad to two digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-11) and pad to two digits
    const year = date.getFullYear(); // Get full year
    return `${day}-${month}-${year}`; // Return formatted date
  };

  return (
    <div className="relative">
                  {/* <Toaster /> */}
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
          {/* <label className="absolute text-xs -mt-2 bg-[#0B0D29] ml-1">
            Holiday Date
          </label> */}

          {/* Date Picker Button */}
          <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(true)}
                className="rounded border w-full px-2 flex gap-1 py-2"
              >
                {holidayDate ? (
                  // Show the selected date if a date has been picked
                  <div className="flex gap-1">
                    <Calendar className="h-5" />
                    <h1 className="h-5 text-xs mt-0.5">
                      {formatDate(holidayDate)}
                    </h1>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Calendar className="h-5" />
                    <h1 className="text-xs mt-0.5 bg-[#0b0d29] text-[#787CA5]  ">
                      Select Date
                    </h1>
                  </div>
                )}
              </button>
            </DialogTrigger>

            <DialogContent className=" z-[100]  scale-90 flex justify-center ">
              <div className=" z-[20] rounded-lg  scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
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
            className="bg-[#815BF5] w-full text-sm cursor-pointer  text-white px-4 mt-6  py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader /> : "Save Holiday"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HolidayForm;
