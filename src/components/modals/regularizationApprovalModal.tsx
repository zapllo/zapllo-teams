"use client";

import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast, Toaster } from "sonner";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import Loader from "../ui/loader";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface RegularizationApprovalModalProps {
  regularizationId: string;
  timestamp: string;
  loginTime: string;
  logoutTime: string;
  remarks: string;
  onClose: () => void;
  onSubmit: () => void;
}

const RegularizationApprovalModal: React.FC<
  RegularizationApprovalModalProps
> = ({
  regularizationId,
  timestamp,
  loginTime,
  logoutTime,
  remarks,
  onClose,
  onSubmit,
}) => {
    const [approvalRemarks, setApprovalRemarks] = useState<string>("");
    const [loading, setLoading] = useState(false); // For handling loading state

    const handleSubmit = async () => {
      setLoading(true);
      try {
        const response = await axios.patch(
          `/api/regularization-approvals/${regularizationId}`,
          {
            action: "approve", // Automatically approving
            notes: approvalRemarks,
          }
        );

        if (response.data.success) {
          onSubmit(); // Refresh data or perform other actions
          onClose();
          toast(<div className=" w-full mb-6 gap-2 m-auto  ">
            <div className="w-full flex  justify-center">
              <DotLottieReact
                src="/lottie/tick.lottie"
                loop
                autoplay
              />
            </div>
            <h1 className="text-black text-center font-medium text-lg">Regularization request approved</h1>
          </div>);
        } else {
          throw new Error(
            response.data.message || "Failed to approve regularization."
          );
        }
      } catch (error: any) {
        console.error(
          "Error approving regularization:",
          error.response?.data || error.message
        );

      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        {/* <Toaster /> */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#0b0d29] overflow-y-scroll scrollbar-hide h-fit max-h-[600px]  shadow-lg w-full pb-6   max-w-md  rounded-lg">
            <div className="flex border-b py-2  w-full justify-between">
              <h2 className="text-md   px-6 py-2 font-medium">
                Approve Regularization Request
              </h2>
              <button className=" px-6 py-2" onClick={onClose}>
                <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
              </button>
            </div>
            <p className="text-xs mt-2 px-6 text-[#787CA5]">
              Please add a note before approving the regularization request.
            </p>

            {/* <div className="mt-4">
                    <p className="text-xs text-gray-300"><strong>Date:</strong> {new Date(timestamp).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-300"><strong>Login Time:</strong> {loginTime}</p>
                    <p className="text-xs text-gray-300"><strong>Logout Time:</strong> {logoutTime}</p>
                    <p className="text-xs text-gray-300"><strong>Remarks:</strong> {remarks}</p>
                </div> */}

            <div className="px-6">
              {/* <label className="text-sm text-white">Approval Note</label> */}
              <textarea
                value={approvalRemarks}
                onChange={(e) => setApprovalRemarks(e.target.value)}
                className="w-full mt-4 p-2 text-xs  bg-[#0b0d29] outline-none  h-24 border rounded-md"
                placeholder="Add a note before approval (optional)"
              />
            </div>

            <div className="flex justify-end space-x-2 mt-6 px-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#815BF5] w-full text-sm cursor-pointer  text-white px-4 mt-4 -mt-6 py-2 rounded"
              >
                {loading ? <Loader /> : "Approve"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

export default RegularizationApprovalModal;
