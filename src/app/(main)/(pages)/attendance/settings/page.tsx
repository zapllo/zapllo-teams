import { StopwatchIcon } from '@radix-ui/react-icons'
import { Calendar, CameraIcon, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {}

export default function Settings({ }: Props) {
    return (
        <div className='pt-4 w-full max-w-screen '>
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
            <div className='mb-2 flex justify-between gap-1 cursor-pointer   my-4 mx-2 p-2 w- m border-b rounded py-2'>
                {/* <StopwatchIcon className='h-4 ml-1' /> */}
                <h1 className=' text-xs px-2'>Setup Reminders</h1>
                <ChevronRight className='h-5 ' />
            </div>
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
        </div>
    )
}