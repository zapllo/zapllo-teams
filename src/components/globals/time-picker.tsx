"use client";

import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import dayjs, { Dayjs } from "dayjs";
import Box from "@mui/material/Box";

interface CustomTimePickerProps {
  selectedTime: string | null;
  onTimeChange: (time: string) => void;
  onCancel: () => void; // Modify to make onCancel required
  onAccept: () => void; // Modify to make onAccept required
  onBackToDatePicker: () => void;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  selectedTime,
  onTimeChange,
  onCancel,
  onAccept,
  onBackToDatePicker,
}) => {
  console.log(selectedTime, 'timeeeeeeeeee')
  const [selectedTimeValue, setSelectedTimeValue] =
    React.useState<Dayjs | null>(
      selectedTime ? dayjs(`1970-01-01T${selectedTime}:00`) : dayjs() // Default to the current tt
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "none",
        borderColor: "red",
        spaceY: 2,
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticTimePicker
          orientation="landscape"
          value={selectedTimeValue}
          onChange={handleTimeChange}
          displayStaticWrapperAs="mobile"
          ampm={true} // Enable 12-hour format with AM/PM
          sx={{
            backgroundColor: "transparent",
            border: "none",
            "& .MuiPickersLayout-root": {
              backgroundColor: "transparent",
              borderTop: "none", // Remove top border in action buttons
              borderBottom: "none",
            },
            "& .MuiPickersToolbar-root": {
              backgroundColor: "#0B0D29",
              color: "white",
              border: "none",
            },
            "& .MuiTypography-root.Mui-selected": {
              color: "white", // Active AM/PM button typography is white
              border: "none",
            },
            "& .MuiTypography-root": {
              color: "gray", // Inactive AM/PM button typography is gray
              border: "none",
            },
            "& .MuiPickersToolbar-content": {
              color: "white",
              border: "none",
            },
            "& .MuiPickersLayout-contentWrapper": {
              border: "none",
            },
            "& .MuiTimeClock-root": {
              backgroundColor: "#0B0D29",
              border: "none",
              borderColor: "red",
            },
            "& .MuiClock-wrapper": {
              backgroundColor: "white",
              border: "none",
            },
            "& .MuiClockNumber-root": {
              color: "white",
              border: "none",
            },
            "& .MuiDialogActions-root": {
              backgroundColor: "#0B0D29",
              borderTop: "none", // Remove top border in action buttons
              borderBottom: "none",
            },
            "& .MuiTypography-h3": {
              border: "none", // Remove border around time typography
            },
            "& .MuiButtonBase-root": {
              color: "white",
              border: "none",
            },
            "& .MuiSvgIcon-root": {
              color: "white",
              border: "none",
            },
            "& .MuiClockPicker-root": {
              backgroundColor: "transparent",
              border: "none",
            },
            "& .MuiPaper-root": {
              backgroundColor: "transparent",
              border: "none",
            },
            "& .MuiBox-root": {
              border: "none",
            },
            "& .MuiClock-pin": {
              backgroundColor: "#017a5b", // Set the dot (thumb) color to #017a5b
              border: "none",
            },
            "& .MuiDialogActions-root button:nth-of-type(1)": {
              display: "none", // Hide the Cancel button in the dialog
              border: "none",
            },
            "& .MuiClockPointer-root": {
              backgroundColor: "#017a5b", // Set the clock hand color to #017a5b
              border: "none",
            },
            "& .MuiClockPointer-thumb": {
              borderColor: "#017a5b", // Set the thumb (center point of the clock) to the same color
              backgroundColor: "#017a5b", // Set the dot (thumb) color to #017a5b
            },
            "& .MuiClock-squareMask": {
              border: "none", // Remove the square mask border
            },
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            border: "none",
            mt: 2,
          }}
        >
          <button
            onClick={onCancel} // Close the modal without saving the time
            className="border absolute -mt-[58px] text-sm ml-6  text-white rounded px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleOkClick} // Set the time and close the modal
            className="bg-[#017a5b] absolute -mt-[58px]  left-96 hover:bg-[#017a5b] text-white rounded px-4 py-2 w-24 text-sm"
          >
            OK
          </button>
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default CustomTimePicker;
