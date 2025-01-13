'use client'

import CustomTimePicker from '@/components/globals/time-picker'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { CrossCircledIcon, StopwatchIcon } from '@radix-ui/react-icons'
import dayjs from 'dayjs'
import { Calendar, CameraIcon, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props = {}

export default function Settings({ }: Props) {
    const [timezone, setTimezone] = useState<string>("");
    const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);
    const [isReminderEnabled, setIsReminderEnabled] = useState<boolean>(false)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)

    // For controlling the visibility of the Time Picker dialog
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);


    // Fetch the current daily report time
    useEffect(() => {
        const fetchReportTime = async () => {
            try {
                const response = await fetch('/api/reports/daily-attendance-time');
                const data = await response.json();
                if (data.success) {
                    setSelectedTime(data.dailyAttendanceReportTime);
                }
            } catch (error) {
                console.error('Failed to fetch report time:', error);
            }
        };

        fetchReportTime();

        // Set timezone options
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(detectedTimezone);
        setAvailableTimezones(Intl.supportedValuesOf("timeZone"));
    }, []);

    const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTimezone(e.target.value)
    }

    const handleSwitchChange = (checked: boolean) => {
        setIsReminderEnabled(checked)
    }
    const handleTimeChange = (time: string) => {
        // Convert the 12-hour time format (hh:mm A) to 24-hour format (HH:mm)
        const formattedTime = dayjs(`1970-01-01T${time}:00`, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm');
        setSelectedTime(formattedTime);  // Update the selected time with the new format
    }

    const handleTimeCancel = () => {
        setSelectedTime(null) // Reset the time when canceled
        setIsTimePickerOpen(false); // Close the time picker dialog
    }

    const handleTimeAccept = async () => {
        // Update the report time in the backend
        try {
            const response = await fetch('/api/reports/daily-attendance-time', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newReportTime: selectedTime }),
            });
            const data = await response.json();
            if (data.success) {
                setIsTimePickerOpen(false);
            } else {
                console.error('Failed to update report time:', data.message);
            }
        } catch (error) {
            console.error('Failed to update report time:', error);
        }
    }


    return (
        <div className='pt-4 w-full max-w-screen overflow-y-scroll h-screen  '>
            <div className=' bg-[#0B0D29] px-4  mt-4 mx-2  my-4  p-2 border rounded-xl '>
                <h1 className='text-sm text-muted-foreground'>Leave Types</h1>
            </div>
            <Link href='/attendance/settings/leave-types'>
                <div className='mb-2 cursor-pointer flex items-center  justify-between gap-1   my-4 mx-2 p-2 w-   m border-b rounded py-2'>
                    <div className='flex gap-1 justify-between'>
                        {/* <Calendar className='h-4' /> */}
                        <h1 className=' text-xs px-2 mt-[1px] '>Add your Leave Types</h1>
                    </div>
                    <ChevronRight className='h-5' />
                </div>
            </Link>
            <div className=' mt-4 bg-[#0B0D29]   my-4 mx-2 p-2 border rounded-xl px-4'>
                <h1 className='text-sm text-muted-foreground'>Attendance Settings</h1>
            </div>
            <Link href='/attendance/settings/register-faces'>
                <div className='mb-2 flex justify-between gap-1  cursor-pointer  my-4 mx-2 p-2 w- m border-b rounded py-2'>
                    {/* <CameraIcon className='h-4' /> */}
                    <h1 className=' text-xs px-2 '>
                        Setup Face Registration</h1>
                    <ChevronRight className='h-5' />
                </div>
            </Link>
            <Dialog>
                <DialogTrigger asChild>

                    <div className='mb-2 flex justify-between gap-1 cursor-pointer   my-4 mx-2 p-2 w- m border-b rounded py-2'>
                        {/* <StopwatchIcon className='h-4 ml-1' /> */}
                        <h1 className=' text-xs px-2'>Setup Reminders</h1>
                        <ChevronRight className='h-5 ' />
                    </div>
                </DialogTrigger>

                {/* Dialog Content */}
                <DialogContent className="">
                    <DialogHeader >
                        <div className='flex  justify-between w-full'>
                            <DialogTitle className='p-6'>Reminders</DialogTitle>
                            <DialogClose className="px-6 py-2">
                                <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                            </DialogClose>
                        </div>
                    </DialogHeader>
                    <div className="px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1>Daily Attendance Report</h1>
                            </div>
                            <div>
                                <Switch
                                    checked={isReminderEnabled}
                                    onCheckedChange={handleSwitchChange}
                                />
                            </div>
                        </div>


                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <h1>Daily Attendance Report Time</h1>
                                <div className="text-sm">
                                    {selectedTime || "No time set"}
                                </div>
                            </div>
                            <Avatar
                                className="bg-[#815BF5] h-9 w-9  flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                                onClick={() => setIsTimePickerOpen(true)}
                            >
                                <StopwatchIcon className="h-6 w-6 text-white" />
                            </Avatar>

                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <h1>Timezone</h1>
                            </div>
                            <div>
                                <label className="absolute bg-[#0b0d29] ml-2 text-xs text-[#787CA5] -mt-2 px-1">
                                    Timezone
                                </label>
                                <select
                                    value={timezone}
                                    onChange={handleTimezoneChange}
                                    className="w-full border bg-[#0B0D29] text-sm overflow-y-scroll scrollbar-thin scrollbar-thumb-[#815BF5] hover:scrollbar-thumb-[#815BF5] active:scrollbar-thumb-[#815BF5] scrollbar-track-gray-800   p-2 rounded bg-transparent outline-none focus-within:border-[#815BF5]"
                                >
                                    {availableTimezones.map((tz) => (
                                        <option className="bg-[#0B0D29] text-sm" key={tz} value={tz}>
                                            {tz}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className='p-6'>
                        <DialogClose asChild>
                            <Button className="w-full bg-[#815bf5] ">Save</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Time Picker Dialog */}
            <Dialog open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
                <DialogContent className="p-6 scale-75">


                    <CustomTimePicker
                        selectedTime={selectedTime}
                        onTimeChange={handleTimeChange}
                        onCancel={handleTimeCancel}
                        onAccept={handleTimeAccept}
                        onBackToDatePicker={() => { }}
                    />


                </DialogContent>
            </Dialog>

            <div className=' bg-[#0B0D29] px-4  mt-4 mx-2  my-4  p-2 border rounded-xl '>

                <h1 className='text-sm text-muted-foreground'>Office Settings</h1>
            </div>
            <div className='mb-2 flex justify-between gap-1  cursor-pointer  my-4 mx-2 p-2 w- m border-b rounded py-2'>
                {/* <CameraIcon className='h-4' /> */}
                <h1 className=' text-xs px-2 '>
                    Set Login-Logout Time</h1>
                <ChevronRight className='h-5' />
            </div>

            <div className='mb-2 flex justify-between gap-1 cursor-pointer   my-4 mx-2 p-2 w- m border-b rounded py-2'>
                {/* <StopwatchIcon className='h-4 ml-1' /> */}
                <h1 className=' text-xs px-2'>Office Location</h1>
                <ChevronRight className='h-5 ' />
            </div>

            <div className=' bg-[#0B0D29] px-4  mt-4 mx-2  my-4  p-2 border rounded-xl '>

                <h1 className='text-sm text-muted-foreground'>Payslip Settings</h1>
            </div>
            <Link href='/attendance/payslip-details'>
                <div className='mb-12 flex justify-between gap-1  cursor-pointer  my-4 mx-2 p-2 w- m border-b rounded py-2'>
                    {/* <CameraIcon className='h-4' /> */}
                    <h1 className=' text-xs px-2 '>
                        Set Payslip Details</h1>
                    <ChevronRight className='h-5' />
                </div>
            </Link>
        </div>
    )
}