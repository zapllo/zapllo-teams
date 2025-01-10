"use client";

import { CrossCircledIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"; // Replace this with the correct import path for your dialog component

type LeaveType = {
  _id: string;
  leaveType: string;
  allotedLeaves: number; // Allotted leave balance for each leave type
};

type LeaveBalance = {
  leaveType: LeaveType;
  leaveTypeId: string;
  balance: number;
  userLeaveBalance: number;
};

type User = {
  userId: string;
  firstName: string;
  lastName: string;
  leaveBalances: LeaveBalance[];
};

interface EditLeaveBalanceModalProps {
  user: User;
  leaveTypes: LeaveType[]; // All available leave types with allotted leave balances
  onClose: () => void;
  onSubmit: (updatedLeaveBalances: LeaveBalance[]) => Promise<void>;
}

const EditLeaveBalanceModal: React.FC<EditLeaveBalanceModalProps> = ({
  user,
  leaveTypes,
  onClose,
  onSubmit,
}) => {
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({}); // Track errors for each leave type

  useEffect(() => {
    // Initialize the leaveBalances state with the user's balances or default to 0
    const initialBalances: LeaveBalance[] = leaveTypes.map((leaveType) => {
      const existingBalance = user.leaveBalances.find(
        (lb) => lb.leaveTypeId === leaveType._id
      );
      return {
        leaveType: leaveType, // Include the leaveType object
        leaveTypeId: leaveType._id,
        balance: existingBalance ? existingBalance.balance : 0,
        userLeaveBalance: existingBalance
          ? existingBalance.userLeaveBalance
          : 0,
      };
    });
    setLeaveBalances(initialBalances);
  }, [user, leaveTypes]);

  const handleBalanceChange = (leaveTypeId: string, newBalance: number) => {
    const leaveType = leaveTypes.find((lt) => lt._id === leaveTypeId);

    if (leaveType) {
      if (newBalance > leaveType.allotedLeaves) {
        setErrors((prev) => ({
          ...prev,
          [leaveTypeId]: `Cannot exceed allotted leave of ${leaveType.allotedLeaves}`,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [leaveTypeId]: "",
        }));
        const updatedBalances = leaveBalances.map((lb) =>
          lb.leaveTypeId === leaveTypeId
            ? { ...lb, userLeaveBalance: newBalance }
            : lb
        );
        setLeaveBalances(updatedBalances);
      }
    }
  };

  const handleSubmit = () => {
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (!hasErrors) {
      onSubmit(leaveBalances);
      toast.success("Balance updated successfully!");
    } else {
      toast.error("Please fix the errors before submitting.");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <div className="px-6 py-4 flex justify-between items-center border-b">
            <DialogTitle>Update Leave Balance</DialogTitle>
            <DialogClose asChild>
              <button>
                <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="flex justify-start p-6 py-2 w-full">
          <div className="flex-shrink-0 flex gap-2">
            <div className="h-6 w-6 rounded-full bg-[#7c3987] flex items-center justify-center text-white text-sm">
              {user.firstName?.[0]}
            </div>
            <h1 className="text-sm mt-[2px]">
              {user.firstName} {user.lastName}
            </h1>
          </div>
        </div>
        <div className="px-2">
          <table className="min-w-full mt-2 border-collapse table-auto">
            <tbody>
              {leaveTypes.map((leaveType) => (
                <tr key={leaveType._id}>
                  <td className="px-4 py-2 text-xs">{leaveType.leaveType}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={
                        leaveBalances.find(
                          (lb) => lb.leaveTypeId === leaveType._id
                        )?.userLeaveBalance ?? 0
                      }
                      onChange={(e) =>
                        handleBalanceChange(
                          leaveType._id,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full text-xs p-2 bg-[#1A1C20] outline-none border rounded bg-transparent"
                    />
                    {errors[leaveType._id] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[leaveType._id]}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-4 p-6">
          <button
            className="bg-[#815BF5] w-full text-sm cursor-pointer  text-white px-4 mt-6  py-2 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeaveBalanceModal;
