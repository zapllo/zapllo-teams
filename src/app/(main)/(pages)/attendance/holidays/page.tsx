// pages/holidayManager.tsx
"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import HolidayForm from "@/components/forms/HolidayForm"; // Ensure you have this component to create holidays
import HolidayList from "@/components/lists/HolidayList"; // Ensure you have this component to display holidays
import { toast, Toaster } from "sonner";
import { CrossCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Loader from "@/components/ui/loader";
import DeleteConfirmationDialog from "@/components/modals/deleteConfirmationDialog";
import HolidayFormModal from "@/components/modals/EditHoliday";

interface Holiday {
  _id: string;
  holidayName: string;
  holidayDate: string;
}

const HolidayManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Control the modal state
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isLeaveAccess, setIsLeaveAccess] = useState<boolean | null>(null);
  const router = useRouter();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Store the ID of the holiday being deleted
  const [editHoliday, setEditHoliday] = useState<Holiday | null>(null); // Store the holiday being edited
  const [userRole, setUserRole] = useState<string | null>(null); // Store the user's role
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State to control the delete confirmation modal
  const [holidayToDelete, setHolidayToDelete] = useState<Holiday | null>(null); // Store the holiday to be deleted

  const fetchHolidays = async () => {
    try {
      const response = await axios.get('/api/holidays');
      setHolidays(response.data.holidays);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setIsLoading(false);
    }
  };

  const fetchUserRole = async () => {
    try {
      const response = await axios.get('/api/users/me');
      // console.log(response.data.data.role, 'what is response from role?')
      setCurrentUserRole(response.data.data.role)
      setUserRole(response.data.data.role); // Assuming role is in response.data.data.role
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const deleteHoliday = async (id: string) => {
    setIsDeleting(id); // Mark this holiday as being deleted
    try {
      await axios.delete(`/api/holidays/${id}`);
      setHolidays(holidays.filter((holiday) => holiday._id !== id)); // Update state after deletion
      toast.success("Holiday deleted successfully");
    } catch (error) {
      console.error('Error deleting holiday:', error);
      toast.error("Failed to delete holiday");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (holiday: Holiday) => {
    setEditHoliday(holiday); // Open the modal and pass the holiday to be edited
  };

  const handleHolidayUpdated = (updatedHoliday: Holiday) => {
    setHolidays((prevHolidays) =>
      prevHolidays.map((holiday) =>
        holiday._id === updatedHoliday._id ? updatedHoliday : holiday
      )
    );
    toast.success("Holiday updated successfully!");
    setEditHoliday(null); // Close the modal after updating
  };

  const handleDeleteClick = (holiday: Holiday) => {
    setHolidayToDelete(holiday); // Set the selected holiday to delete
    setDeleteConfirmationOpen(true); // Open the delete confirmation modal
  };

  const handleConfirmDelete = () => {
    if (holidayToDelete) {
      deleteHoliday(holidayToDelete._id); // Delete the holiday
      setDeleteConfirmationOpen(false); // Close the modal after deletion
    }
  };

  useEffect(() => {
    fetchHolidays();
    fetchUserRole(); // Fetch user role
  }, []);



  console.log(userRole, 'user role');
  if (isLoading) {
    return <Loader />;
  }

  const handleHolidayCreated = () => {
    setIsModalOpen(false); // Close modal after holiday is created
    fetchHolidays();
    toast(<div className=" w-full mb-6 gap-2 m-auto  ">
      <div className="w-full flex  justify-center">
        <DotLottieReact
          src="/lottie/tick.lottie"
          loop
          autoplay
        />
      </div>
      <h1 className="text-black text-center font-medium text-lg">Holiday added successfully</h1>
    </div>);
  };






  return (
    <div className="container mx-auto p-6">
      {/* <Toaster /> */}
      {/* <h2 className="text-lg font-bold mb-6">Holiday Manager</h2> */}

      {/* Dialog Root */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {currentUserRole === "orgAdmin" && (
          <div className="flex justify-between items-center mx-11 ml-5">
            <h1 className="font-semibold">Upcoming Holidays</h1>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="w-fit  flex gap-2 hover:bg-[#0f5140] bg-[#017a5b] px-4"
                onClick={() => setIsModalOpen(true)}
              >
                Add New Holiday
              </Button>
            </DialogTrigger>
          </div>
        )}

        {/* Modal Content */}

        <DialogContent className=" z-[100]  flex items-center justify-center">
          <div className="bg-[#0b0d29] w-full max-w-lg overflow-y-scroll scrollbar-hide h-fit max-h-[600px]  shadow-lg   rounded-lg">
            <div className="flex border-b py-2  w-full justify-between">

              <DialogTitle className="text-md   px-6 py-2 font-medium">
                Add New Holiday
              </DialogTitle>
              <DialogClose className=" px-6 py-2">
                <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
              </DialogClose>
            </div>
            <div className="relative">
              <HolidayForm onHolidayCreated={handleHolidayCreated} />{" "}
              {/* Holiday Form Component */}
            </div>
            <div className="flex justify-end mt-4"></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Holiday List */}
      <div className="mt-6">
        <div className="container mx-auto p-6">
          {/* <h3 className="text-sm font-bold mb-4">Upcoming Holidays</h3> */}
          {/* <Toaster /> */}
          {holidays.length > 0 ? (
            <div className="bg-[#0B0D29] text-sm w-full rounded-2xl  border overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#0B0D29] ">
                  <tr>
                    <th className="px-4 text-gray-400 text-xs text-start py-2">Name</th>
                    <th className="px-4 text-gray-400 text-xs text-start py-2">Date</th>
                    {userRole === 'orgAdmin' && <th className="text-xs text-start px-4 py-2">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {holidays.map((holiday) => (
                    <tr className='border-t' key={holiday._id}>
                      <td className="px-4 text-xs py-2">{holiday.holidayName}</td>
                      <td className="px-4 text-xs py-2">
                        {new Date(holiday.holidayDate).toLocaleDateString("en-GB")}
                      </td>
                      {userRole === 'orgAdmin' && (
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleEditClick(holiday)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(holiday)} // Trigger delete confirmation modal
                            disabled={isDeleting === holiday._id}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (<div className='flex w-full justify-center '>
            < div className="mt-8 ml-4">
              <DotLottieReact
                src="/lottie/empty.lottie"
                loop
                className="h-56"
                autoplay
              />
              <h1 className="text-center font-bold text-md m ">
                No Holidays Found
              </h1>
              <p className="text-center text-sm p-2 ">The list is currently empty </p>
            </div>
          </div >)}
          {
            editHoliday && (
              <HolidayFormModal
                holiday={editHoliday}
                onHolidayUpdated={handleHolidayUpdated}
                onClose={() => setEditHoliday(null)} // Close the modal if canceled
              />
            )
          }

          {/* Render the delete confirmation modal */}
          <DeleteConfirmationDialog
            isOpen={deleteConfirmationOpen}
            onClose={() => setDeleteConfirmationOpen(false)} // Close the delete confirmation modal
            onConfirm={handleConfirmDelete} // Handle delete confirmation
            title="Delete Holiday"
            description={`Are you sure you want to delete the holiday "${holidayToDelete?.holidayName}"? This action cannot be undone.`}
          />
        </div >
      </div>
    </div >
  );
};

export default HolidayManager;
