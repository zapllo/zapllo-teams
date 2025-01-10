'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { menuOptions } from '@/lib/constants';
import clsx from 'clsx';
import { Separator } from '@/components/ui/separator';
import { Database, GitBranch, LucideMousePointerClick, LogOut } from 'lucide-react';
import axios from 'axios';
import { IconLogout2 } from '@tabler/icons-react';

type Props = {};

const MenuOptions = (props: Props) => {
  const pathName = usePathname();
  const [role, setRole] = useState("");
  const router = useRouter();
  const [leavesTrialExpires, setLeavesTrialExpires] = useState<Date | null>(null);
  const [attendanceTrialExpires, setAttendanceTrialExpires] = useState<Date | null>(null);

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      router.push('/login');
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get('/api/users/me');
        const user = res.data.data;
        setRole(user.role);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };
    getUserDetails();
  }, []);

  const fetchTrialStatus = async () => {
    try {
      const response = await axios.get('/api/organization/getById');
      const { leavesTrialExpires, attendanceTrialExpires } = response.data.data;
      setLeavesTrialExpires(
        leavesTrialExpires && new Date(leavesTrialExpires) > new Date()
          ? new Date(leavesTrialExpires)
          : null
      );
      setAttendanceTrialExpires(
        attendanceTrialExpires && new Date(attendanceTrialExpires) > new Date()
          ? new Date(attendanceTrialExpires)
          : null
      );
    } catch (error) {
      console.error("Failed to fetch trial status:", error);
    }
  };

  useEffect(() => {
    fetchTrialStatus();
  }, []);

  const filteredMenuOptions = menuOptions.filter(menuItem => {
    if (menuItem.name === "Leaves & Attendance") {
      return leavesTrialExpires || attendanceTrialExpires;
    }
    // Exclude "Billing" for roles 'member' and 'manager'
    if ((role === 'member' || role === 'manager') && menuItem.name === 'Billing') {
      return false;
    }
    return true;
  });

  // Helper function to determine if a menu item is active
  const isActive = (menuItem: any, currentPath: any) => {
    // Handle "Help" menu item
    if (menuItem.name === "Help") {
      return currentPath.startsWith("/help") || currentPath.endsWith("/checklist");
    }

    // Handle "Leaves & Attendance" menu item
    if (menuItem.href === "/attendance") {
      return currentPath.startsWith("/attendance");
    }

    // Add more conditions for other menu items with subpaths if needed

    // Default exact match
    return currentPath === menuItem.href;
  };

  return (
    <nav className="dark:bg-[#0A0D28] z-[50] h-screen fixed border-r border-[#37384B] overflow-hidden scrollbar-hide justify-between flex items-center flex-col gap-10 py-4 px-2 w-14">
      <div className="flex items-center justify-center flex-col gap-8">
        <Link href="/dashboard">
          <img src='/icons/zapllo.png' className='h-full w-full scale-75' alt="Zapllo Logo" />
        </Link>

        <TooltipProvider>
          {filteredMenuOptions.map((menuItem) => (
            <React.Fragment key={menuItem.name}>
              <ul>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <li className="cursor-pointer">
                      <Link
                        href={menuItem.href}
                        className={clsx(
                          'group h-6 w-6 flex items-center justify-center scale-[1.5] rounded-lg p-[3px] cursor-pointer',
                          {
                            'bg-[#FC8929]': isActive(menuItem, pathName),
                          }
                        )}
                      >
                        <menuItem.Component
                          selected={isActive(menuItem, pathName)}
                        />
                      </Link>
                    </li>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-black/10 backdrop-blur-xl"
                  >
                    <p>{menuItem.name}</p>
                  </TooltipContent>
                </Tooltip>
              </ul>
              {/* Optional: Add separators or other UI elements here */}
            </React.Fragment>
          ))}
        </TooltipProvider>
      </div>

      {/* Uncomment and adjust the logout section as needed */}
      {/* <div className="flex items-center justify-center flex-col mt-8">
        <TooltipProvider>
          <ul>
            <Tooltip delayDuration={0}>
              <TooltipTrigger>
                <li className="cursor-pointer h-8 w-8" onClick={logout}>
                  <IconLogout2 className='text-[#FD8829] text-3xl' />
                </li>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-black/10 backdrop-blur-xl"
              >
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </ul>
        </TooltipProvider>
      </div> */}
    </nav>
  );
};

export default MenuOptions;
