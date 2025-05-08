"use client";

import React, { useEffect, useState } from "react";
import { Edit2, Plus, Trash2, CalendarIcon, Calendar } from "lucide-react";
import { toast } from "sonner";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Loader from "@/components/ui/loader";
import DeleteConfirmationDialog from "@/components/modals/deleteConfirmationDialog";
import HolidayFormModal from "@/components/modals/EditHoliday";
import HolidayForm from "@/components/forms/HolidayForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Holiday {
  _id: string;
  holidayName: string;
  holidayDate: string;
}

const HolidayManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isLeaveAccess, setIsLeaveAccess] = useState<boolean | null>(null);
  const router = useRouter();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editHoliday, setEditHoliday] = useState<Holiday | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState<Holiday | null>(null);

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
      setCurrentUserRole(response.data.data.role);
      setUserRole(response.data.data.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const deleteHoliday = async (id: string) => {
    setIsDeleting(id);
    try {
      await axios.delete(`/api/holidays/${id}`);
      setHolidays(holidays.filter((holiday) => holiday._id !== id));
      toast.success("Holiday deleted successfully");
    } catch (error) {
      console.error('Error deleting holiday:', error);
      toast.error("Failed to delete holiday");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEditClick = (holiday: Holiday) => {
    setEditHoliday(holiday);
  };

  const handleHolidayUpdated = (updatedHoliday: Holiday) => {
    setHolidays((prevHolidays) =>
      prevHolidays.map((holiday) =>
        holiday._id === updatedHoliday._id ? updatedHoliday : holiday
      )
    );
    toast.success("Holiday updated successfully!");
    setEditHoliday(null);
  };

  const handleDeleteClick = (holiday: Holiday) => {
    setHolidayToDelete(holiday);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (holidayToDelete) {
      deleteHoliday(holidayToDelete._id);
      setDeleteConfirmationOpen(false);
    }
  };

  const handleHolidayCreated = () => {
    setIsModalOpen(false);
    fetchHolidays();
    toast.success("Holiday added successfully", {
      icon: <DotLottieReact src="/lottie/tick.lottie" loop autoplay style={{ width: 40, height: 40 }} />,
    });
  };

  useEffect(() => {
    fetchHolidays();
    fetchUserRole();
  }, []);

  // Get the current year and upcoming holidays
  const currentYear = new Date().getFullYear();
  const upcomingHolidays = holidays
    .filter(holiday => new Date(holiday.holidayDate) >= new Date())
    .sort((a, b) => new Date(a.holidayDate).getTime() - new Date(b.holidayDate).getTime())
    .slice(0, 5);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle className="text-xl font-bold">Holiday Calendar</CardTitle>
            <CardDescription>Manage organization holidays and important dates</CardDescription>
          </div>
          {currentUserRole === "orgAdmin" && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-[#017a5b] hover:bg-[#0f5140]"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Holiday
                </Button>
              </DialogTrigger>
              <DialogContent className="z-[100] w-full max-w-lg">
                <div className="">
                  <div className="flex border-b py-2 w-full justify-between">
                    <DialogTitle className="text-md px-6 py-2 font-medium">
                      Add New Holiday
                    </DialogTitle>
                    <DialogClose className="px-6 py-2">
                      <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                    </DialogClose>
                  </div>
                  <div className="">
                    <HolidayForm onHolidayCreated={handleHolidayCreated} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>

        <CardContent className="pt-4">
          {holidays.length > 0 ? (
            <div className="space-y-6">
              {upcomingHolidays.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Upcoming Holidays
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {upcomingHolidays.map((holiday) => (
                      <Card key={holiday._id} className="bg-muted/30 hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20">
                            {format(new Date(holiday.holidayDate), 'MMMM dd, yyyy')}
                          </Badge>
                          <p className="font-medium">{holiday.holidayName}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center text-muted-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  All Holidays ({currentYear})
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Holiday Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Day</TableHead>
                        {userRole === 'orgAdmin' && <TableHead className="text-right">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {holidays.sort((a, b) =>
                        new Date(a.holidayDate).getTime() - new Date(b.holidayDate).getTime()
                      ).map((holiday) => {
                        const holidayDate = new Date(holiday.holidayDate);
                        const isPast = holidayDate < new Date();

                        return (
                          <TableRow key={holiday._id} className={isPast ? "text-muted-foreground" : ""}>
                            <TableCell className="font-medium">
                              {holiday.holidayName}
                              {isPast && <Badge variant="outline" className="ml-2 text-xs">Past</Badge>}
                            </TableCell>
                            <TableCell>{format(holidayDate, 'MMMM dd, yyyy')}</TableCell>
                            <TableCell>{format(holidayDate, 'EEEE')}</TableCell>
                            {userRole === 'orgAdmin' && (
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditClick(holiday)}
                                  className="h-8 w-8"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteClick(holiday)}
                                  disabled={isDeleting === holiday._id}
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <DotLottieReact
                src="/lottie/empty.lottie"
                loop
                className="h-56"
                autoplay
              />
              <h1 className="font-bold text-lg mt-4">
                No Holidays Found
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {currentUserRole === "orgAdmin"
                  ? "Click 'Add Holiday' to create your organization's holiday calendar"
                  : "The holiday calendar is currently empty"}
              </p>
              {currentUserRole === "orgAdmin" && (
                <Button
                  className="mt-4 bg-[#017a5b] hover:bg-[#0f5140]"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Holiday
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Holiday Modal */}
      {editHoliday && (
        <HolidayFormModal
          holiday={editHoliday}
          onHolidayUpdated={handleHolidayUpdated}
          onClose={() => setEditHoliday(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Holiday"
        description={`Are you sure you want to delete the holiday "${holidayToDelete?.holidayName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default HolidayManager;
