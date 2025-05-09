"use client";

import React, { useState, useEffect } from "react";
import {
  LucideHome,
  ListChecks,
  UserCheck,
  ClipboardList,
  Save,
  Folder,
  CheckSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";

interface TaskSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: string;
  sidebarWidth?: number;
}

export default function TaskSidebar({
  activeTab,
  setActiveTab,
  userRole,
  sidebarWidth = 20
}: TaskSidebarProps) {
  const [fetchedUserRole, setFetchedUserRole] = useState<string | null>(userRole || null);

  useEffect(() => {
    if (!userRole) {
      const fetchUserRole = async () => {
        try {
          const response = await axios.get("/api/users/me");
          setFetchedUserRole(response.data.data.role);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      };
      fetchUserRole();
    }
  }, [userRole]);

  const actualRole = userRole || fetchedUserRole;
  const isOrgAdmin = actualRole === "orgAdmin";
  const isAdminOrManager = actualRole && (actualRole === "orgAdmin" || actualRole === "manager");

  const isActive = (tabId: string) => activeTab === tabId;

  return (
    <div className="h-screen overflow-y-scroll scrollbar-hide dark:bg-[#04061e] w-64 border-r border-border">
      <div className="px-4 py-6 flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Task Management</h2>
          </div>
          <div className="h-0.5 bg-gradient-to-r from-primary/60 to-transparent mt-2"></div>
        </div>

        {/* Navigation Groups */}
        <div className="space-y-6">
          {/* Overview Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground ml-2 mb-2">OVERVIEW</h3>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-md gap-3 py-2 h-auto",
                isActive('all')
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => setActiveTab('all')}
            >
              <LucideHome className={cn("h-4 w-4", isActive('all') && "text-primary")} />
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
                isActive('myTasks')
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => setActiveTab('myTasks')}
            >
              <ListChecks className={cn("h-4 w-4", isActive('myTasks') && "text-primary")} />
              <span>My Tasks</span>
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-md gap-3 py-2 h-auto",
                isActive('delegatedTasks')
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => setActiveTab('delegatedTasks')}
            >
              <UserCheck className={cn("h-4 w-4", isActive('delegatedTasks') && "text-primary")} />
              <span>Delegated Tasks</span>
            </Button>
          </div>

          {/* Management Section - for Admin/Manager roles */}
          {isAdminOrManager && (
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-muted-foreground ml-2 mb-2">MANAGEMENT</h3>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start rounded-md gap-3 py-2 h-auto",
                  isActive('allTasks')
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted"
                )}
                onClick={() => setActiveTab('allTasks')}
              >
                <ClipboardList className={cn("h-4 w-4", isActive('allTasks') && "text-primary")} />
                <span>All Tasks</span>
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start rounded-md gap-3 py-2 h-auto",
                  isActive('taskTemplates')
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted"
                )}
                onClick={() => setActiveTab('taskTemplates')}
              >
                <Save className={cn("h-4 w-4", isActive('taskTemplates') && "text-primary")} />
                <span>Task Templates</span>
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start rounded-md gap-3 py-2 h-auto",
                  isActive('taskDirectory')
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted"
                )}
                onClick={() => setActiveTab('taskDirectory')}
              >
                <Folder className={cn("h-4 w-4", isActive('taskDirectory') && "text-primary")} />
                <span>Task Directory</span>
              </Button>


            </div>
          )}
        </div>
      </div>
    </div>
  );
}
