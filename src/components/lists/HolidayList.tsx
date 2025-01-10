'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Edit2 } from 'lucide-react';
import HolidayFormModal from '../modals/EditHoliday'; // Import a component for the modal form
import Loader from '../ui/loader';
import { toast, Toaster } from 'sonner';
import DeleteConfirmationDialog from '../modals/deleteConfirmationDialog'; // Import your delete confirmation modal
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface Holiday {
    _id: string;
    holidayName: string;
    holidayDate: string;
}

const HolidayList: React.FC = () => {
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

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto p-6">
            <h3 className="text-sm font-bold mb-4">Upcoming Holidays</h3>
            {/* <Toaster /> */}
            {holidays.length > 0 ? (
                <table className="w-full rounded table-auto border-collapse border">
                    <thead className='bg-[#0B0D29]  '>
                        <tr>
                            <th className="px-4 text-xs text-start py-2">Name</th>
                            <th className="px-4 text-xs text-start py-2">Date</th>
                            {userRole === 'orgAdmin' && <th className="text-xs text-start px-4 py-2">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {holidays.map((holiday) => (
                            <tr className='border-t' key={holiday._id}>
                                <td className="px-4 text-xs py-2">{holiday.holidayName}</td>
                                <td className="px-4 text-xs py-2">
                                    {new Date(holiday.holidayDate).toLocaleDateString()}
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
    );
};

export default HolidayList;
