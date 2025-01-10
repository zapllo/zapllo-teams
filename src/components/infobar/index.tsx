"use client";
import React, { useEffect, useState } from "react";
import {
  Bell,
  BellDot,
  Book,
  DollarSign,
  Headphones,
  LogOut,
  LogOutIcon,
  Search,
  Settings,
  User,
  User2,
  XIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ModeToggle } from "../globals/mode-toggle";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { BellIcon } from "@radix-ui/react-icons";
import { Label } from "../ui/label";
import MainLoader from "../loaders/loader";
import { ModeToggle2 } from "../globals/mode-toggle2";
import { FaAndroid, FaApple } from "react-icons/fa";

type Props = {};

const InfoBar = (props: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const [firstName, setFirstName] = useState("User");
  const [lastName, setLastName] = useState("User");
  const [role, setRole] = useState("role");
  const [profilePic, setProfilePic] = useState("");
  const [trialExpires, setTrialExpires] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState("");
  const [userLoading, setUserLoading] = useState<boolean | null>(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setUserLoading(true);
        const userRes = await axios.get("/api/users/me");
        setFirstName(userRes.data.data.firstName);
        setLastName(userRes.data.data.lastName);
        setProfilePic(userRes.data.data.profilePic);
        setRole(userRes.data.data.role);
        setUserLoading(false);
        // Fetch trial status
        const response = await axios.get("/api/organization/getById");
        console.log(response.data.data); // Log the organization data

        const organization = response.data.data;

        const isExpired =
          organization.trialExpires &&
          new Date(organization.trialExpires) <= new Date();
        console.log("isExpired:", isExpired);
        console.log("trialExpires:", organization.trialExpires);

        setTrialExpires(isExpired ? null : organization.trialExpires);
      } catch (error) {
        console.error("Error fetching user details or trial status:", error);
      }
    };
    getUserDetails();
  }, []);

  console.log(trialExpires, "trial");

  useEffect(() => {
    if (trialExpires) {
      // Calculate remaining time
      const calculateRemainingTime = () => {
        const now = new Date();
        const distance = formatDistanceToNow(new Date(trialExpires), {
          addSuffix: true,
        });
        setRemainingTime(distance);
      };

      calculateRemainingTime();
      const intervalId = setInterval(calculateRemainingTime, 1000 * 60); // Update every minute

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [trialExpires]);

  console.log(remainingTime, "time?");

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const getPageTitle = () => {
    if (pathName === "/dashboard") {
      return "My Business Apps ";
    } else if (pathName === "/dashboard/tasks") {
      return "Task Management";
    } else if (pathName === "/dashboard/teams") {
      return "My Team";
    } else if (pathName === "/dashboard/settings") {
      return "Settings";
    } else if (pathName === "/dashboard/settings/categories") {
      return "Categories";
    } else if (pathName === "/dashboard/billing") {
      return "Billing & Wallet";
    } else if (pathName === "/dashboard/billing/wallet-logs") {
      return "Billing Logs";
    } else if (pathName === "/dashboard/checklist") {
      return "My Checklist";
    } else if (pathName === "/help/tickets") {
      return "My Tickets";
    } else if (pathName === "/help/mobile-app") {
      return "Mobile App";
    }
    // Handle the dynamic route for /dashboard/tickets/[id]
    else if (pathName.startsWith("/help/tickets/")) {
      return "Ticket Details";
    } else if (pathName === "/dashboard/profile") {
      return "My Profile";
    } else if (pathName === "/dashboard/integrations") {
      return "Integrations";
    } else if (pathName === "/intranet") {
      return "Intranet";
    } else if (pathName === "/help/tutorials") {
      return "Tutorials";
    } else if (pathName === "/help/events") {
      return "Events";
    } else if (pathName === "/admin/dashboard") {
      return "Admin Dashboard";
    } else if (pathName === "/dashboard/settings/changePassword") {
      return "Change Password";
    } else if (pathName === "/attendance") {
      return "Dashboard";
    } else if (pathName === "/attendance/settings") {
      return "Settings";
    } else if (pathName === "/attendance/settings/leave-types") {
      return "Leave Types";
    } else if (pathName === "/attendance/settings/register-faces") {
      return "Register Faces";
    } else if (pathName === "/attendance/my-leaves") {
      return "My Leaves";
    } else if (pathName === "/attendance/my-attendance") {
      return "My Attendance";
    } else if (pathName === "/attendance/holidays") {
      return "Holidays";
    } else if (pathName === "/attendance/all-leaves") {
      return "All Leaves";
    } else if (pathName === "/attendance/all-attendance") {
      return "All Attendance";
    } else if (pathName === "/attendance/approvals") {
      return "Approvals";
    }
  };

  return (
    <>
      {userLoading && (
        <MainLoader />
      )}
      <div className="  fixed  w-[100%]  z-[10]">
        <div className="gap-6 ml-12 border-b  items-center px-4 py-2 w-[100%] z-[10] flex flex-row  bg-[#04061e]">
          {/* <img src='/icons/ellipse.png' className='absolute h-[50%] z-[10]   opacity-30 -ml-32 ' /> */}
          <div
            className={`flex   ${pathName === "/dashboard" ? "text-center ml-[42%] w-screen" : ""
              }`}
          >
            <h1 className={`text-md mt-1 ml-4 text-white font-bold `}>
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4 ml-auto mx-12 font-bold">
            {/* <h1 className='text-xs mt- '>Access Expires in <span className='text-red-500 font-bold'>{remainingTime || 'Loading...'}</span></h1> */}
            {/* <Label className="text-xs p-2 bg-red-500 rounded-full">
              <h1>Trial Expired</h1>
            </Label> */}
            {/* <ModeToggle /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="relative rounded-full hover:bg-[] bg-[] border p-2 h-9 w-9"
                  size="icon"
                >
                  <img
                    src="/icons/bell.png"
                    className="h"
                    alt="Notification Bell"
                  />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-red-500 "></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 -ml-36">
                <DropdownMenuLabel>
                  Notifications Coming Soon.
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex gap-2 ">
                  <div className="h-9 w-9 text-xs items-center cursor-pointer flex justify-center border bg-[#815BF5] rounded-full">
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <>
                        {firstName.slice(0, 1)}
                        {lastName.slice(0, 1)}
                      </>
                    )}
                  </div>

                  <div>
                    <h1 className="text-[#ffffff] text-sm ">{firstName}</h1>
                    {role === "orgAdmin" ? (
                      <h1 className=" text-[10px] text-muted-foreground font-thin ">
                        Admin
                      </h1>
                    ) : role === "manager" ? (
                      <h1 className="text-[10px]">Manager</h1>
                    ) : role === "Admin" ? (
                      <h1 className="text-[10px]">Super Admin</h1>
                    ) : <h1 className="text-[10px]"> Member</h1>}
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 -ml-36">
                <DropdownMenuLabel>
                  {firstName} {lastName}
                  <p className="text-xs text-gray-400 capitalize">
                    Role:{" "}
                    {role === "orgAdmin" ? (
                      <span>Admin</span>
                    ) : role === "manager" ? (
                      <span className="text-[10px]">Manager</span>
                    ) : role === "Admin" ? (
                      <span className="text-[10px]">Super Admin</span>
                    ) : (
                      <span className="text-[10px]">Member</span>
                    )}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/dashboard/profile">
                    <DropdownMenuItem className="gap-1">
                      <User2 className="h-4" />
                      Profile
                      {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                    </DropdownMenuItem>
                  </Link>
                  {role === "orgAdmin" ? (
                    <Link href="/dashboard/billing">
                      <DropdownMenuItem className="gap-1">
                        <DollarSign className="h-4" />
                        Billing
                        {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                      </DropdownMenuItem>
                    </Link>
                  ) : (
                    ""
                  )}

                  <Link href="/dashboard/settings">
                    <DropdownMenuItem className="gap-1">
                      <Settings className="h-4" />
                      Settings
                      {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <Link href="/help/mobile-app">
                    <DropdownMenuItem className="gap-1 ">
                      <div className="flex items-center gap-2 px-1 ">
                        <FaAndroid className="h-4" />
                        <h1>Android App</h1>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/help/mobile-app">
                    <DropdownMenuItem className="gap-1">
                      <div className="flex items-center gap-2 px-1 ">
                        <FaApple className="h-4" />
                        <h1>Iphone App</h1>
                      </div>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />

                  <div className="gap-1 p-2">
                    <ModeToggle2 />
                  </div>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />


                <DropdownMenuItem className="gap-1" onClick={logout}>
                  <LogOut className="h-4" />
                  Log out
                  {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoBar;
