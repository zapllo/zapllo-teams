import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Label } from "../ui/label";
import {
  ArrowLeft,
  Clock,
  Calendar,
  MessageSquare,
  CheckCircle,
  Circle,
  CheckCheck,
  Bell,
} from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

interface Regularization {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    reportingManager: {
      firstName: string;
      lastName: string;
    };
  };
  timestamp: string;
  loginTime: string;
  logoutTime: string;
  remarks: string;
  approvalStatus?: "Pending" | "Approved" | "Rejected";
  notes?: string;
  approvedBy?: {
    firstName: string;
    lastName: string;
  };
  approvedAt?: string;
  updatedAt?: string;
}

interface RegularizationDetailsProps {
  selectedRegularization: Regularization;
  onClose: () => void;
}
function formatTimeToAMPM(timeString: string): string {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const RegularizationDetails: React.FC<RegularizationDetailsProps> = ({
  selectedRegularization,
  onClose,
}) => {
  if (!selectedRegularization) return null;
  console.log(selectedRegularization, "selected regularization object");

  return (
    <Sheet open={!!selectedRegularization} onOpenChange={onClose}>
      <SheetContent className="max-w-4xl z-[100] w-full">
        <SheetHeader>
          <div className="flex gap-2">
            <ArrowLeft
              onClick={onClose}
              className="cursor-pointer border rounded-full border-white h-7 hover:bg-white hover:text-black w-7"
            />
            <SheetTitle className="text-white mb-4">
              Regularization Details
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="border overflow-y-scroll scrollbar-hide h-10/11 p-4 rounded-lg">
          <h1 className="font-bold text-sm px-2">
            Regularization by {selectedRegularization.userId?.firstName}{" "}
          </h1>

          <div className="flex mt-4 justify-start space-x-12 text-start items-center gap-6 px-2">
            {/* User Info */}

            <div className="flex items-center space-x-28 w-full ">
              <div className="flex  gap-2">
                <Label htmlFor="user" className="text-right text-xs mt-1">
                  Applied By
                </Label>
                {selectedRegularization.userId?.firstName && (
                  <div className="flex gap-2 justify-start ml-11">
                    <div className="h-6 w-6 rounded-full bg-primary">
                      <h1 className="text-center uppercase text-xs mt-1">
                        {selectedRegularization.userId.firstName[0]}
                        {selectedRegularization.userId.lastName[0]}
                      </h1>
                    </div>
                    <h1
                      id="userName"
                      className="col-span-3 text-sm"
                    >{`${selectedRegularization.userId.firstName} ${selectedRegularization.userId.lastName}`}</h1>
                  </div>
                )}
              </div>
              {selectedRegularization.approvedBy ? (

                <div className="flex gap-2">
                  <Label htmlFor="user" className="text-right text-xs mt-1">
                    Approved By
                  </Label>
                  <div className="flex gap-2 justify-start">
                    <div className="h-6 w-6 rounded-full bg-primary">
                      <h1 className="text-center uppercase text-xs mt-1">
                        {selectedRegularization.approvedBy?.firstName[0]}
                        {selectedRegularization.approvedBy?.lastName[0]}
                      </h1>
                    </div>
                    <h1
                      id="userName"
                      className="col-span-3 text-sm"
                    >{`${selectedRegularization.approvedBy?.firstName} ${selectedRegularization.approvedBy?.lastName}`}</h1>
                  </div>


                </div>
              ) : (
                <h1 className="text-sm  text-gray-500">N/A</h1>
              )}
            </div>
          </div>
          <div className="flex px-2 mt-2  gap-2">
            <Label htmlFor="user" className="text-right text-xs mt-1">
              Applied On
            </Label>
            <h1 className="text-center uppercase text-xs mt-1 ml-12">
              {new Date(selectedRegularization.timestamp).toLocaleDateString()}
            </h1>
          </div>
          {/* Regularization Dates */}
          <div className="flex gap-28 ml-1 ">
            <div className="flex items-center gap-1 mt-4">
              <Calendar className="h-4 text-[#E94C4C]" />
              <Label htmlFor="timestamp" className="text-right text-sm">
                Date
              </Label>
              <div className="flex gap-2 ml-2 mt-1 text-xs justify-start">
                <h1 id="timestamp" className="col-span-3 ml-12">
                  {new Date(
                    selectedRegularization.timestamp
                  ).toLocaleDateString()}
                </h1>
              </div>
            </div>
          </div>
          <div className="flex space-x-40 ml-1">
            <div className="flex items-center gap-1 mt-4">
              <Clock className="h-4 text-[#E94C4C]" />
              <Label htmlFor="loginTime" className="text-right text-sm">
                Login Time
              </Label>
              <div className="flex gap-2 ml-5 justify-start">
                <h1 id="loginTime" className="col-span-3 text-xs">
                  {formatTimeToAMPM(selectedRegularization.loginTime)}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-4">
              <Clock className="h-4 text-[#E94C4C]" />
              <Label htmlFor="logoutTime" className="text-right text-sm">
                Logout Time
              </Label>
              <div className="flex gap-2 ml-5 justify-start">
                <h1 id="logoutTime" className="col-span-3 text-xs">
                  {formatTimeToAMPM(selectedRegularization.logoutTime)}
                </h1>
              </div>
            </div>
          </div>
          {/* Status */}
          <div className="flex items-center gap-1 ml-1 mt-4">
            {selectedRegularization.approvalStatus === "Pending" && (
              <Circle className="h-4 text-red-500" />
            )}
            {selectedRegularization.approvalStatus === "Approved" && (
              <CheckCircle className="h-4 text-green-500" />
            )}
            <Label htmlFor="status" className="text-right text-sm">
              Status
            </Label>
            <div className="flex gap-2 ml-11 justify-start">
              <h1 id="status" className="col-span-3 text-xs ml-1">
                {selectedRegularization.approvalStatus}
              </h1>
            </div>
          </div>

          {/* Remarks */}
          <div className="flex items-center gap-1 ml-1 mt-4">
            <MessageSquare className="h-4 text-[#C3AB1E]" />
            <Label htmlFor="remarks" className="text-right text-sm">
              Reason
            </Label>
            <div className="flex ml-10 justify-start">
              <h1 id="remarks" className="col-span-3 text-xs">
                {selectedRegularization.remarks || "No remarks provided."}
              </h1>
            </div>
          </div>

          {/* Approval Remarks */}
          {/* {selectedRegularization.notes && (
                        <div className="flex items-center gap-1 mt-4">
                            <MessageSquare className="h-4 text-[#C3AB1E]" />
                            <Label htmlFor="approvalRemarks" className="text-right text-sm">Approval Remarks</Label>
                            <div className="flex ml-12 justify-start">
                                <h1 id="approvalRemarks" className="col-span-3 text-xs">{selectedRegularization.notes}</h1>
                            </div>
                        </div>
                    )} */}

          {/* Remarks and Updates */}
          <Separator className="mt-4" />
          <div className="rounded-xl bg-[#] p-4 mb-4">
            <div className="mb-4 gap-2 flex justify-start">
              <CheckCheck className="h-5" />
              <Label className=" text-md mt-auto">Updates</Label>
            </div>
            <div className="mt-2 border bg-[#121212] p-2 py-8 rounded">
              {selectedRegularization.notes ? (
                <div className="flex justify-between items-center p-2 rounded">
                  {/* Display remark and approvedBy user */}
                  <div className="flex gap-2 items-start">
                    <div className="h-6 w-6 rounded-full bg-primary">
                      <h1 className="text-center uppercase text-xs mt-1">
                        {
                          selectedRegularization.approvedBy
                            ?.firstName[0]
                        }
                        {
                          selectedRegularization.approvedBy
                            ?.lastName[0]
                        }
                      </h1>
                    </div>
                    <div>
                      <h1 className="text-sm font-semibold">{`${selectedRegularization.approvedBy?.firstName} ${selectedRegularization.approvedBy?.lastName}`}</h1>
                      <p className="text-xs text-gray-500">
                        {" "}
                        {selectedRegularization.updatedAt
                          ? new Date(
                            selectedRegularization.updatedAt
                          ).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p className="text-xs max-w-[600px]">
                        {selectedRegularization.notes}
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#017a5b] rounded px-2 py-1">
                    <p className="text-xs">
                      {selectedRegularization.approvalStatus}
                    </p>
                  </div>
                </div>
              ) : (
                <div className='flex justify-center'>
                  <div>
                    <Bell />
                    <p className="text-xs mt-2 -ml-10 text-white -500">
                      No remarks provided.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
};

export default RegularizationDetails;
