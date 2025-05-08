"use client";

import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import dayjs, { Dayjs } from "dayjs";
import { Clock, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Box from "@mui/material/Box";

interface CustomTimePickerProps {
  selectedTime: string | null;
  onTimeChange: (time: string) => void;
  onCancel: () => void;
  onAccept: () => void;
  onBackToDatePicker: () => void;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  selectedTime,
  onTimeChange,
  onCancel,
  onAccept,
  onBackToDatePicker,
}) => {
  const [selectedTimeValue, setSelectedTimeValue] = React.useState<Dayjs | null>(
    selectedTime ? dayjs(`1970-01-01T${selectedTime}:00`) : dayjs()
  );

  // Update selectedTimeValue when selectedTime changes
  React.useEffect(() => {
    if (selectedTime && selectedTime !== "") {
      setSelectedTimeValue(dayjs(`1970-01-01T${selectedTime}:00`));
    } else {
      setSelectedTimeValue(dayjs()); // Default to current time
    }
  }, [selectedTime]);

  const handleTimeChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setSelectedTimeValue(newValue);
    }
  };

  const handleOkClick = () => {
    if (selectedTimeValue) {
      // Format the time as HH:mm (24-hour format) and pass it to the parent
      const formattedTime = selectedTimeValue.format("HH:mm");
      onTimeChange(formattedTime); // Set the time
    }
    onAccept(); // Close the modal
  };

  return (
    <div className="flex flex-col p-4 bg-background rounded-lg w-full max-w-">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-medium">Select Time</h3>
          <p className="text-sm text-muted-foreground">
            Choose a time
          </p>
        </div>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="border rounded-md p-2 mb-4">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticTimePicker
            orientation="landscape"
            value={selectedTimeValue}
            onChange={handleTimeChange}
            displayStaticWrapperAs="mobile"
            ampm={true}
            sx={{
              backgroundColor: "transparent",
              border: "none",
              "& .MuiPickersLayout-root": {
                backgroundColor: "transparent",
                borderTop: "none",
                borderBottom: "none",
              },
              "& .MuiPickersToolbar-root": {
                backgroundColor: "transparent",
                color: "inherit",
                border: "none",
              },
              "& .MuiTypography-root.Mui-selected": {
                color: "var(--primary)",
                border: "none",
              },
              "& .MuiTypography-root": {
                color: "inherit",
                border: "none",
              },
              "& .MuiPickersToolbar-content": {
                color: "inherit",
                border: "none",
              },
              "& .MuiPickersLayout-contentWrapper": {
                border: "none",
              },
              "& .MuiTimeClock-root": {
                backgroundColor: "transparent",
                border: "none",
              },
              "& .MuiClock-wrapper": {
                backgroundColor: "transparent",
                border: "none",
              },
              "& .MuiClockNumber-root": {
                color: "inherit",
                border: "none",
              },
              "& .MuiDialogActions-root": {
                backgroundColor: "transparent",
                borderTop: "none",
                borderBottom: "none",
                display: "none",
              },
              "& .MuiTypography-h3": {
                border: "none",
              },
              "& .MuiButtonBase-root": {
                color: "inherit",
                border: "none",
              },
              "& .MuiSvgIcon-root": {
                color: "inherit",
                border: "none",
              },
              "& .MuiClockPicker-root": {
                backgroundColor: "transparent",
                border: "none",
              },
              "& .MuiPaper-root": {
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
              },
              "& .MuiBox-root": {
                border: "none",
              },
              // Clock hand styling adjustments
              "& .MuiClock-pin": {
                backgroundColor: "#017a5b",
                border: "none",
              },
              "& .MuiClockPointer-root": {
                backgroundColor: "#017a5b",
                "&::before": {
                  backgroundColor: "#017a5b",
                  border: "1px solid #017a5b",
                },
              },
              "& .MuiClockPointer-thumb": {
                border: "4px solid #017a5b",
                backgroundColor: "#017a5b",
                width: "14px",
                height: "14px",
              },
              "& .MuiClock-clock": {
                backgroundColor: "#f3f4f6", // Light background for the clock face
                border: "1px solid #e5e7eb",
              },
              "& .MuiClockNumber-root.Mui-selected": {
                backgroundColor: "#017a5b",
                color: "white",
              },
              "& .MuiClock-squareMask": {
                border: "none",
                backgroundColor: "rgba(1, 122, 91, 0.1)",
              },
            }}
          />
        </LocalizationProvider>
      </div>

      <div className="p-3 bg-muted/40 rounded-md mb-4">
        <h4 className="text-sm font-medium mb-1">Selected Time</h4>
        <p className="text-xl font-semibold">
          {selectedTimeValue?.format("hh:mm A") || "No time selected"}
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleOkClick} className="bg-primary hover:bg-primary/90">
          <Check className="h-4 w-4 mr-2" />
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default CustomTimePicker;
