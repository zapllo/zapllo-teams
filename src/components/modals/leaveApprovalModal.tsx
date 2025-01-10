"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import Loader from "../ui/loader";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LeaveDay {
  date: string;
  unit:
  | "Full Day"
  | "1st Half"
  | "2nd Half"
  | "1st Quarter"
  | "2nd Quarter"
  | "3rd Quarter"
  | "4th Quarter";
  status: "Pending" | "Approved" | "Rejected"; // Ensure this property is present in both
}

interface LeaveApprovalModalProps {
  leaveId: string;
  leaveDays: LeaveDay[];
  appliedDays: number;
  leaveReason: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  user: { firstName: string; lastName: string };
  manager: { firstName: string; lastName: string };
  onClose: () => void;
}

const LeaveApprovalModal: React.FC<LeaveApprovalModalProps> = ({
  leaveId,
  leaveDays,
  appliedDays,
  leaveReason,
  leaveType,
  fromDate,
  toDate,
  user,
  manager,
  onClose,
}) => {
  const [approvalData, setApprovalData] = useState<LeaveDay[]>(
    leaveDays.map((day) => ({
      ...day,
      status: day.status === "Pending" ? "Approved" : day.status, // Default to 'Approved' if 'Pending'
    }))
  );
  const [approvedDaysCount, setApprovedDaysCount] = useState<number>(0); // State for approved days count
  const [remarks, setRemarks] = useState<string>(""); // State for remarks
  const [loading, setLoading] = useState<boolean>(false);

  // Calculate the initial number of approved days
  useEffect(() => {
    const approvedDays = approvalData.filter(
      (day) => day.status === "Approved"
    ).length;
    setApprovedDaysCount(approvedDays);
  }, [approvalData]);

  // Handle the status change (either Approve or Reject)
  const handleStatusChange = (
    date: string,
    newStatus: "Approved" | "Rejected"
  ) => {
    console.log(`Updating ${date} to ${newStatus}`);
    setApprovalData((prevData) =>
      prevData.map((day) =>
        day.date === date ? { ...day, status: newStatus } : day
      )
    );
  };

  // Submit the approval/rejection data to the backend
  const handleSubmit = async () => {
    console.log("Submitting data:", approvalData);
    console.log("Submitting remarks:", remarks); // Add this to check the remarks value
    setLoading(true);
    try {
      const response = await axios.post(`/api/leaveApprovals/${leaveId}`, {
        leaveDays: approvalData,
        remarks,
        action: approvalData.every((day) => day.status === "Approved")
          ? "approve"
          : "reject", // Send action
      });
      if (response.data.success) {
        toast(<div className=" w-full mb-6 gap-2 m-auto  ">
          <div className="w-full flex  justify-center">
            <DotLottieReact
              src="/lottie/tick.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-black text-center font-medium text-lg">Leave Approved successfully</h1>
        </div>);
        onClose();
        setLoading(false);
      } else {
        console.error("API Error:", response.data.error);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  // Update the approved days count each time a dropdown selection changes
  useEffect(() => {
    const approvedDays = approvalData.filter(
      (day) => day.status === "Approved"
    ).length;
    setApprovedDaysCount(approvedDays);
  }, [approvalData]);

  // console.log(manager, 'whats the issue?');

  return (
    <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-[#0b0d29] overflow-y-scroll pb-6 scrollbar-hide h-fit max-h-screen m-auto shadow-lg w-full z-[100]  max-w-md  rounded-lg">
        <div className="flex border-b py-2  w-full justify-between">
          <h2 className="text-md   px-6 py-2 font-medium">
            {leaveType} By {user.firstName} {user.lastName}
          </h2>
          <div className=" px-6 py-2">
            <CrossCircledIcon
              onClick={onClose}
              className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5] cursor-pointer"
            />
          </div>
        </div>
        <div className="text-sm   px-6 py-2 font-medium">
          <p>Applied On:</p>
          <h1></h1>
        </div>
        <div className="mb-4 flex justify-between text-xs ">
          <div className="flex items-center gap-2  px-6  font-medium">
            <p>Applied By:</p>

            <div className="rounded-full text-sm bg-[#815BF5] w-6 h-6 flex items-center justify-center text-white">
              {user.firstName[0]}
            </div>
            <div className="flex gap-2 text-sm ">
              <h1>
                {user.firstName} {user.lastName}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4">
            <p>Manager: </p>
            {manager && (
              <div className="rounded-full bg-[#815BF5] w-6 h-6 flex items-center justify-center text-white">
                {manager?.firstName[0]}
              </div>
            )}
            <div className="flex text-sm gap-2 mt-[2px]">
              <h1>
                {manager?.firstName} {manager?.lastName}
              </h1>
            </div>
          </div>
        </div>

        <div className="mb-4 text-xs px-6">
          <p className="flex gap-2">
            <h1>Leave Type:</h1> {leaveType}
          </p>
          <p className="flex gap-2">
            <h1>Reason:</h1> {leaveReason}
          </p>
        </div>

        <div className="mb-4 text-xs justify-between flex px-6">
          <div className="flex gap-2">
            <h1 className="mt-2">From:</h1>{" "}
            <input
              type="text"
              value={new Date(fromDate).toDateString()}
              readOnly
              className="w-full  p-2   bg-[#0b0d29] outline-none border rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <h1 className="mt-2 ml-2">To:</h1>{" "}
            <input
              type="text"
              value={new Date(toDate).toDateString()}
              readOnly
              className="w-full  p-2   bg-[#0b0d29] outline-none border rounded-md"
            />
          </div>
        </div>

        <div className="mb-4 px-6">
          {approvalData?.map((day, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-2 border p-3 rounded-md"
            >
              <span className="text-xs text-[#787CA5]">
                {new Date(day.date).toDateString()} ({day.unit})
              </span>
              <select
                className={`text-xs outline-none border  bg-[#0b0d29] rounded-md p-2 ${day.status === "Approved"
                  ? "border-[#017a5b]"
                  : day.status === "Rejected"
                    ? "border-red-500"
                    : "border-gray-300"
                  }`}
                value={day.status}
                onChange={(e) =>
                  handleStatusChange(
                    day.date,
                    e.target.value as "Approved" | "Rejected"
                  )
                }
              >
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          ))}
        </div>

        <div className="flex justify-between mb-4 px-6">
          <div className="flex gap-2 text-xs">
            <h1>Applied For:</h1> <span>{appliedDays} Day(s)</span>
          </div>
          <div className="flex gap-2 text-xs">
            <h1>Approved For:</h1> <span>{approvedDaysCount} Day(s)</span>
          </div>
        </div>

        <div className="mb-4 px-6">
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full text-xs p-2 border bg-transparent outline-none rounded"
            placeholder="Remarks"
          />
        </div>

        <div className="flex justify-end space-x-2 px-6">
          <button
            onClick={handleSubmit}
            className="bg-[#815BF5] w-full text-sm cursor-pointer  text-white px-4 mt-4 -mt-6 py-2 rounded"
          >
            {loading ? <Loader /> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovalModal;
