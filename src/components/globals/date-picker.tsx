'use client';

import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';

interface CustomDatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  onCloseDialog?: () => void; // Function to close the dialog
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selectedDate, onDateChange, onCloseDialog }) => {
  const [selectedDateValue, setSelectedDateValue] = useState<Dayjs>(
    selectedDate ? dayjs(selectedDate) : dayjs(new Date())
  );

  const [currentDate, setCurrentDate] = useState(dayjs()); // For current month view
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false); // Toggle year picker

  // When the selectedDate prop changes, update the local selectedDateValue state
  useEffect(() => {
    if (selectedDate) {
      setSelectedDateValue(dayjs(selectedDate));
    }
  }, [selectedDate]);

  const years = Array.from({ length: 120 }, (_, i) => currentDate.year() - 60 + i); // List of years

  // Handler for changing the selected date
  const handleDateClick = (day: number) => {
    const newDate = currentDate.date(day); // Construct new date from current month and selected day
    setSelectedDateValue(newDate);
  };

  // Accept the selected date and pass it to the parent via onDateChange, then close the dialog
  const handleAccept = () => {
    onDateChange(selectedDateValue.toDate());
    if (onCloseDialog) {
      onCloseDialog(); // Call onCloseDialog if provided
    }
  };

  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf('month').day(); // Day of the week (Sunday = 0)

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month')); // Go to previous month
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month')); // Go to next month
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(currentDate.year(year));
    setIsYearPickerOpen(false);
  };

  const toggleYearPicker = () => {
    setIsYearPickerOpen(!isYearPickerOpen);
  };

  // Render the calendar days with placeholders for empty days at the start of the month
  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-full h-12"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDateValue.isSame(currentDate.date(day), 'day');
      days.push(
        <div
          key={day}
          className={`cursor-pointer flex justify-center items-center w-full h-12 rounded-full ${isSelected ? 'bg-[#017a5b] text-white' : 'hover:bg-gray-600 text-gray-300'
            }`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="flex flex-row gap-4 mt-4 scale-105   text-gray-300 w-full rounded-lg shadow-lg">
      {/* Selected Date Preview */}
      <div className="flex flex-col items-center text-white mr-8">
        {/* <div className="text-lg">Select Date</div> */}
        <div className="text-3xl   text-center font-bold mb-2">
          <h1 className='text-lg mt-4 text-gray-300 font-medium'>
            Select Date
          </h1>
          <h1 className='mt-28 w-24'>
            {selectedDateValue.format('ddd, MMM D')}
          </h1>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="flex flex-col w-full h-96 items-center">
        {/* Month and Year Navigation */}
        <div className="flex justify-between w-full mb-4">


          <div className="flex items-center">
            <div className='flex gap-2'>
              <div className="text-xl text-white font-semibold">{currentDate.format('MMMM YYYY')}</div>
              <button
                onClick={toggleYearPicker}
                className={`${isYearPickerOpen ? "rotate-180 transition duration-75" : ""} text-sm  font-semibold  px-2 py-1 rounded`}
              >
                ▼
              </button>
            </div>
          </div>
          <button onClick={handlePrevMonth} className="px-2 py-1 ml-16 hover:bg-gray-600  hover:rounded-full h-10 w-10 text-white font-bold rounded-full">
            &lt;
          </button>
          <button onClick={handleNextMonth} className="px-2 py-1 text-white bg-gray-600 hover:rounded-full h-10 w-10 font-bold rounded-full">
            &gt;
          </button>
        </div>

        {/* Year Picker */}
        {isYearPickerOpen && (
          <div className="overflow-y-auto bg-gray-800 rounded-lg p-2 h-96 w-full">
            <div className="grid grid-cols-3 gap-1">
              {years.map((year) => (
                <div
                  key={year}
                  className={`cursor-pointer text-center py-2 ${currentDate.year() === year ? 'bg-[#017a5b] text-white' : 'hover:bg-gray-600 text-gray-300'
                    }`}
                  onClick={() => handleYearChange(year)}
                >
                  {year}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Days of the Week */}
        {!isYearPickerOpen && (
          <>
            <div className="grid grid-cols-7 gap-1 text-center w-full">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Render Calendar Days */}
            <div className="grid grid-cols-7 gap-1 w-full">{renderDays()}</div>

            {/* Cancel and Accept Buttons */}
            <div className="flex gap-4 justify-end w-full mt-4">
              <button
                onClick={onCloseDialog}
                className="px-6 py-2  text-white rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 bg-[#017a5b] text-sm text-white rounded ="
              >
                OK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomDatePicker;
