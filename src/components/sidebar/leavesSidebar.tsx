"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  CalendarMinus,
  CalendarX,
  CalendarCheck2,
  Grid2X2,
  Stamp,
  Settings,
  CalendarMinus2Icon,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeavesSidebarProps {
  sidebarWidth?: number;
}

const LeavesSidebar: React.FC<LeavesSidebarProps> = ({ sidebarWidth = 20 }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/api/users/me");
        setUserRole(response.data.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;
  const isOrgAdmin = userRole === "orgAdmin";
  const isAdminOrManager = userRole && userRole !== "member";

  return (
    <div className="h-screen overflow-y-scroll scrollbar-hide mt-12 dark:bg-[#04061e]">
      <div className="px-4 py-6 flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Attendance & Leaves</h2>
          </div>
          <div className="h-0.5 bg-gradient-to-r from-primary/60 to-transparent mt-2"></div>
        </div>

        {/* Navigation Groups */}
        <div className="space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground ml-2 mb-2">OVERVIEW</h3>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-md gap-3 py-2 h-auto",
                isActive('/attendance')
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => handleNavigation('/attendance')}
            >
              <Grid2X2 className={cn("h-4 w-4", isActive('/attendance') && "text-primary")} />
              <span>Dashboard</span>
            </Button>
          </div>

          {/* Personal Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground ml-2 mb-2">PERSONAL</h3>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-md gap-3 py-2 h-auto",
                isActive('/attendance/my-attendance')
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => handleNavigation('/attendance/my-attendance')}
            >
              <CalendarCheck className={cn("h-4 w-4", isActive('/attendance/my-attendance') && "text-primary")} />
              <span>My Attendance</span>
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-md gap-3 py-2 h-auto",
                isActive('/attendance/my-leaves')
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => handleNavigation('/attendance/my-leaves')}
            >
              <CalendarMinus className={cn("h-4 w-4", isActive('/attendance/my-leaves') && "text-primary")} />
              <span>My Leaves</span>
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-md gap-3 py-2 h-auto",
                isActive('/attendance/holidays')
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => handleNavigation('/attendance/holidays')}
            >
              <CalendarX className={cn("h-4 w-4", isActive('/attendance/holidays') && "text-primary")} />
              <span>Holidays</span>
            </Button>
          </div>

          {/* Management Section - for Admin/Manager roles */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground ml-2 mb-2">MANAGEMENT</h3>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-md gap-3 py-2 h-auto",
                isActive('/attendance/approvals')
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => handleNavigation('/attendance/approvals')}
            >
              <Stamp className={cn("h-4 w-4", isActive('/attendance/approvals') && "text-primary")} />
              <span>Approvals</span>
            </Button>

            {/* Admin Only Section */}
            {isOrgAdmin && (
              <>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-md gap-3 py-2 h-auto",
                    isActive('/attendance/all-leaves')
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted"
                  )}
                  onClick={() => handleNavigation('/attendance/all-leaves')}
                >
                  <CalendarMinus2Icon className={cn("h-4 w-4", isActive('/attendance/all-leaves') && "text-primary")} />
                  <span>All Leaves</span>
                </Button>

                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-md gap-3 py-2 h-auto",
                    isActive('/attendance/all-attendance')
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted"
                  )}
                  onClick={() => handleNavigation('/attendance/all-attendance')}
                >
                  <CalendarCheck2 className={cn("h-4 w-4", isActive('/attendance/all-attendance') && "text-primary")} />
                  <span>All Attendance</span>
                </Button>
              </>
            )}
          </div>

          {/* Settings - Admin Only */}
          {isOrgAdmin && (
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-muted-foreground ml-2 mb-2">SETTINGS</h3>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start rounded-md gap-3 py-2 h-auto",
                  isActive('/attendance/settings')
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted"
                )}
                onClick={() => handleNavigation('/attendance/settings')}
              >
                <Settings className={cn("h-4 w-4", isActive('/attendance/settings') && "text-primary")} />
                <span>Settings</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeavesSidebar;
