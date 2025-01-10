// components/modals/RegularizationRejectModal.tsx

"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface RegularizationRejectModalProps {
  regularizationId: string;
  remarks: string;
  setRemarks: (remarks: string) => void;
  onClose: () => void;
}

const RegularizationRejectModal: React.FC<RegularizationRejectModalProps> = ({
  regularizationId,
  remarks,
  setRemarks,
  onClose,
}) => {

  const [approvalRemarks, setApprovalRemarks] = useState<string>("");
  const [loading, setLoading] = useState(false); // For handling loading state

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `/api/regularization-approvals/${regularizationId}`,
        {
          action: "reject", // Automatically approving
          notes: approvalRemarks,
        }
      );

      if (response.data.success) {
        onClose();
        toast(<div className=" w-full mb-6 gap-2 m-auto  ">
          <div className="w-full flex  justify-center">
            <DotLottieReact
              src="/lottie/tick.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-black text-center font-medium text-lg">Regularization request rejected successfully</h1>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#0b0d29] overflow-y-scroll scrollbar-hide h-fit max-h-[600px]  shadow-lg w-full pb-6   max-w-md  rounded-lg">
        <div className="flex border-b py-2  w-full justify-between">
          <h2 className="text-md   px-6 py-2 font-medium">
            Reject Regularization
          </h2>
          <button onClick={onClose} className=" px-6 py-2">
            <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
          </button>
        </div>
        <p className="text-xs mt-2 px-6 text-[#787CA5]">
          Are you sure you want to reject this regularization?
        </p>
        <div className="px-6">
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks..."
            className="w-full mt-4 p-2 text-xs  bg-[#0b0d29] outline-none h-24 border rounded-md"
          />
        </div>
        <div className="flex justify-end space-x-2 mt-6 px-6">
          {/* <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>r */}
          <button
            onClick={handleSubmit}
            className="bg-[#815BF5] w-full text-sm cursor-pointer  text-white px-4 mt-4 -mt-6 py-2 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegularizationRejectModal;
