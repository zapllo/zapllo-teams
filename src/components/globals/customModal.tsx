
import React, { useState } from 'react';

type DateFilterProps = {
  activeDateFilter: string | null;
  setActiveDateFilter: (filter: string | null) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
};

// Modal component
const DateFilterModal: React.FC<DateFilterProps> = ({
  activeDateFilter,
  setActiveDateFilter,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}) => {
  // Function to apply the filter and close the modal
  const applyFilter = () => {
    // You can apply additional filter logic here if needed
    setActiveDateFilter(null); // Close the modal
  };

  return (
    <>
      {activeDateFilter === "custom" && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-white mb-4">Select Date Range</h3>
            <div className="flex flex-col gap-4">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="border px-2 py-1 rounded-md bg-white"
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="border px-2 py-1 rounded-md bg-white"
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setActiveDateFilter(null)} // Close the modal
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={applyFilter} // Apply filter and close the modal
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DateFilterModal;
