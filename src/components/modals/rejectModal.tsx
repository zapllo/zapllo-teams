import { CrossCircledIcon } from "@radix-ui/react-icons";
import React from "react";

interface RejectModalProps {
  entryId: string;
  remarks: string;
  setRemarks: (remarks: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const RejectModal: React.FC<RejectModalProps> = ({
  entryId,
  remarks,
  setRemarks,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#0b0d29] overflow-y-scroll scrollbar-hide h-fit max-h-[600px]  shadow-lg w-full pb-6   max-w-md  rounded-lg">
        <div className="flex border-b py-2  w-full justify-between">
          <h2 className="text-md   px-6 py-2 font-medium">Reject Leave</h2>
          <button onClick={onClose} className="px-6 py-2 ">
            <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
          </button>
        </div>
        <p className="text-xs mt-2 px-6 text-[#787CA5]">
          Are you sure you want to reject this leave?
        </p>
        <div className="px-6">
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks..."
            className="w-full mt-4 p-2 text-xs h-24 bg-[#0b0d29] outline-none border rounded-md"
          />
        </div>
        <div className="flex justify-end space-x-2 mt-6 px-6">
          {/* <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button> */}
          <button
            onClick={onSubmit}
            className="bg-[#815BF5] w-full text-sm cursor-pointer  text-white px-4 mt-4 -mt-6 py-2 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
