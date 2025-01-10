import React from 'react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';
import { Label } from '../ui/label';
import { ArrowLeft, Calendar, CheckCircle, Circle, Clock, CalendarDays, MessageSquare, CheckCheck, CalendarCheck, Bell } from 'lucide-react';
import { Separator } from '../ui/separator';
import CustomAudioPlayer from '../globals/customAudioPlayer'; // Import your audio player component

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
  status: "Pending" | "Approved" | "Rejected";
}

interface LeaveType {
  _id: string;
  leaveType: string;
}

interface Leave {
  _id: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  status: string;
  leaveReason: string;
  appliedDays: number;
  leaveDays: LeaveDay[];
  remarks: string;
  attachment?: string[]; // File attachment URLs
  audioUrl?: string; // Audio URL
  user: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  approvedBy?: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  rejectedBy?: {
    firstName: string;
    lastName: string;
    _id: string;
  };
  updatedAt: string;
}

interface LeaveDetailsProps {
  selectedLeave: Leave | null;
  onClose: () => void;
}

const LeaveDetails: React.FC<LeaveDetailsProps> = ({ selectedLeave, onClose }) => {
    if (!selectedLeave) return null;
    console.log(selectedLeave, 'selected leave!')
    return (
        <Sheet open={!!selectedLeave} onOpenChange={onClose}>
            <SheetContent className="max-w-4xl z-[100]  w-full">
                <SheetHeader>
                    <div className="flex gap-2">
                        <ArrowLeft className="cursor-pointer h-7 w-7 bg-[#121212] border hover:bg-white hover:text-[#121212] border-white rounded-full" onClick={onClose} />
                        <SheetTitle className="text-white mb-4">Leave Details</SheetTitle>
                    </div>
                </SheetHeader>
                <div className="border overflow-y-scroll scrollbar-hide h-10/11 p-4 rounded-lg">
                    <h1 className="font-bold text-sm px-2">{selectedLeave.leaveType?.leaveType}</h1>

          <div className="flex mt-4 justify-start space-x-12 text-start items-center gap-6 px-2">
            {/* Requested By */}
            <div className="flex items-center gap-4">
              <Label htmlFor="user" className="text-right text-xs">
                Requested By
              </Label>
              {selectedLeave.user.firstName && (
                <div className="flex gap-2 justify-start">
                  <div className="h-6 w-6 rounded-full bg-primary">
                    <h1 className="text-center uppercase text-xs mt-1">
                      {selectedLeave.user.firstName[0]}
                      {selectedLeave.user.lastName[0]}
                    </h1>
                  </div>
                  <h1
                    id="userName"
                    className="col-span-3 text-sm"
                  >{`${selectedLeave.user.firstName} ${selectedLeave.user.lastName}`}</h1>
                </div>
              )}
            </div>
            {/* Approved/Rejection Manager */}
            {selectedLeave.approvedBy && (
              <div className="flex items-center gap-4">
                <Label htmlFor="approvedBy" className="text-right text-xs">
                  Approved By{" "}
                </Label>
                {selectedLeave.approvedBy.firstName && (
                  <div className="flex gap-2 justify-start">
                    <div className="h-6 w-6 rounded-full bg-green-400">
                      <h1 className="text-center uppercase text-xs mt-1">
                        {selectedLeave.approvedBy.firstName[0]}
                        {selectedLeave.approvedBy.lastName[0]}
                      </h1>
                    </div>
                    <h1
                      id="approvedBy"
                      className="col-span-3 text-sm"
                    >{`${selectedLeave.approvedBy.firstName} ${selectedLeave.approvedBy.lastName}`}</h1>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Leave Dates */}
          <div className="flex gap-28 ml-1">
            <div className="flex items-center gap-1 mt-4">
              <Calendar className="h-4 text-[#E94C4C]" />
              <Label htmlFor="fromDate" className="text-right text-sm">
                From Date
              </Label>
              <div className="flex gap-2 ml-2 text-xs justify-start">
                <h1 id="fromDate" className="col-span-3">
                  {new Date(selectedLeave.fromDate).toLocaleDateString()}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-4">
              <Clock className="h-4 text-[#E94C4C]" />
              <Label htmlFor="toDate" className="text-right text-sm">
                To Date
              </Label>
              <div className="flex gap-2 ml-5 justify-start">
                <h1 id="toDate" className="col-span-3 text-xs">
                  {new Date(selectedLeave.toDate).toLocaleDateString()}
                </h1>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1 mt-4">
            {selectedLeave.status === "Pending" && (
              <Circle className="h-4 text-red-500" />
            )}
            {selectedLeave.status === "Approved" && (
              <CheckCircle className="h-4 text-green-500" />
            )}
            <Label htmlFor="status" className="text-right text-sm">
              Status
            </Label>
            <div className="flex gap-2 ml-12 justify-start">
              <h1 id="status" className="col-span-3 text-xs ml-1">
                {selectedLeave.status}
              </h1>
            </div>
          </div>

          {/* Leave Type and Applied/Approved Days */}
          <div className="flex items-center gap-1 mt-4">
            <CalendarDays className="h-4 text-[#C3AB1E]" />
            <Label htmlFor="leaveType" className="text-right text-sm">
              Leave Type
            </Label>
            <div className="flex ml-6 justify-start">
              <h1 id="leaveType" className="col-span-3 text-xs">
                {selectedLeave.leaveType?.leaveType}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <Calendar className="h-4 text-gray-400" />
            <Label htmlFor="leaveType" className="text-right text-sm">
              Applied For
            </Label>
            <div className="flex ml-5 justify-start">
              <h1 id="leaveType" className="col-span-3 text-xs">
                {" "}
                {selectedLeave.appliedDays} Day(s)
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <CalendarCheck className="h-4 text-green-500" />
            <Label htmlFor="leaveType" className="text-right text-sm">
              Approved For
            </Label>
            <div className="flex ml-2 justify-start">
              <h1 id="leaveType" className="col-span-3 text-xs">
                {
                  selectedLeave.leaveDays.filter(
                    (day) => day.status === "Approved"
                  ).length
                }{" "}
                Day(s)
              </h1>
            </div>
          </div>

          {/* Leave Reason */}
          <div className="flex items-center gap-1 mt-4">
            <MessageSquare className="h-4 text-[#C3AB1E]" />
            <Label htmlFor="leaveType" className="text-right text-sm">
              Reason
            </Label>
            <div className="flex ml-12 justify-start">
              <h1 id="leaveType" className="col-span-3 text-xs">
                {selectedLeave.leaveReason}
              </h1>
            </div>
          </div>

          {/* Audio Player */}
          {selectedLeave.audioUrl && (
            <div className="mt-6 w-[43.33%]">
              {/* <Label htmlFor="audio" className="text-right text-sm">Audio Recording</Label> */}
              <CustomAudioPlayer audioUrl={selectedLeave.audioUrl} />
            </div>
          )}

                    {/* File Attachments */}
                    {selectedLeave.attachment && selectedLeave.attachment.length > 0 && (
                        <div className="mt-6">
                            <Label htmlFor="attachments" className="text-right text-sm">Attachments</Label>
                            <ul className="flex gap-6 text-xs mt-2">
                                {selectedLeave.attachment.map((fileUrl, index) => (
                                    <h1 key={index}>
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                            {`Attachment ${index + 1}`}
                                        </a>
                                    </h1>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* Remarks and Updates */}
                    <Separator className='mt-4' />
                    <div className="rounded-xl bg-[#] p-4 mb-4">
                        <div className="mb-4 gap-2 flex justify-start">
                            <CheckCheck className="h-5" />
                            <Label className=" text-md mt-auto">Updates</Label>
                        </div>
                        <div className="mt-2 border bg-[#121212] p-2 py-8 rounded">
                            {selectedLeave.remarks ? (
                                <div className="flex justify-between items-center p-2 rounded">
                                    {/* Display remark and approvedBy user */}
                                    {selectedLeave.approvedBy && (
                                        <div className="flex gap-2 items-start">
                                            <div className="h-6 w-6 rounded-full bg-primary">
                                                <h1 className="text-center uppercase text-xs mt-1">{selectedLeave.approvedBy?.firstName[0]}{selectedLeave.approvedBy?.lastName[0]}</h1>
                                            </div>
                                            <div>
                                                <h1 className="text-sm font-semibold">{`${selectedLeave.approvedBy?.firstName} ${selectedLeave.approvedBy?.lastName}`}</h1>
                                                <p className="text-xs text-gray-500">{new Date(selectedLeave.updatedAt).toLocaleString()}</p>
                                                <p className="text-xs max-w-[600px]">{selectedLeave.remarks}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className='bg-[#017a5b] rounded px-2 py-1'>
                                        <p className="text-xs">{selectedLeave.status}</p>
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

export default LeaveDetails;