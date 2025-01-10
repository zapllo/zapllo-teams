"use client";

import { ShiningButton } from "@/components/globals/shiningbutton";
import {
  Bell,
  Home,
  LogOut,
  MessageCircleReply,
  Users,
  Eye,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// Define the User interface
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  role: string;
}

interface Reminder {
  type: "minutes" | "hours" | "days" | "specific";
  value: number | undefined;
  date: Date | undefined;
  sent: boolean;
}

interface Task {
  _id: string;
  title: string;
  user: User;
  description: string;
  assignedUser: User;
  category: { _id: string; name: string };
  priority: string;
  repeatType: string;
  repeat: boolean;
  days?: string[];
  audioUrl?: string;
  dates?: number[];
  categories?: string[];
  dueDate: Date;
  completionDate: string;
  attachment?: string[];
  links?: string[];
  reminder: {
    email?: Reminder | null;
    whatsapp?: Reminder | null;
  } | null;
  status: string;
  comments: Comment[];
  createdAt: string;
}

interface Organization {
  _id: string;
  companyName: string;
  totalTasks: number;
  completedTasks: number;
  completionPercentage: string;
  users: User[];
  trialExpires: Date;
}

const DashboardPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks/get");
      const result = await response.json();
      if (response.ok) {
        setTasks(result.data);
      } else {
        console.error("Error fetching tasks:", result.error);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organization/summary");
      const result = await response.json();
      if (response.ok) {
        setOrganizations(result.data);
      } else {
        console.error("Error fetching organizations:", result.error);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users/all");
      const result = await response.json();
      if (response.ok) {
        setUsers(result.data);
      } else {
        console.error("Error fetching users:", result.error);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate the number of users assigned to tasks for each organization
  // Calculate the number of users assigned to tasks for each organization
  const getTaskUsersCount = (org: Organization) => {
    // Filter tasks that belong to the current organization
    const taskUsers = tasks
      .filter(
        (task) =>
          task.assignedUser && task.assignedUser.organization === org._id
      )
      .map((task) => task.assignedUser._id);

    // Use a Set to remove duplicates and get the unique count of task users
    return new Set(taskUsers).size;
  };

  const completedTasksCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  // Sort organizations in descending order of total tasks/completed tasks ratio
  const sortedOrganizations = organizations.sort((a, b) => {
    const ratioA = a.totalTasks / (a.completedTasks || 1);
    const ratioB = b.totalTasks / (b.completedTasks || 1);
    return ratioB - ratioA;
  });

  const filteredOrganizations = sortedOrganizations.filter((org) =>
    org.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedOrganizations = filteredOrganizations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-screen bg-[#04061E]">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6 ml-28">
          <div className="p-6 bg-transparent border rounded-lg text-center">
            <div className="text-white mt-2">Total Tasks</div>
            <div className="text-4xl text-white">{tasks.length}</div>
          </div>
          <div className="p-6 bg-transparent border rounded-lg text-center">
            <div className="text-white mt-2">Tasks Completed</div>
            <div className="text-4xl text-white">{completedTasksCount}</div>
          </div>
          <div className="p-6 bg-transparent border rounded-lg text-center">
            <div className="text-white mt-2">Total Companies</div>
            <div className="text-4xl text-white">{organizations.length}</div>
          </div>
          <div className="p-6 bg-transparent border rounded-lg text-center">
            <div className="text-white mt-2">Total Users</div>
            <div className="text-4xl text-white">{users.length}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 ml-40">
          {[
            "Today",
            "Yesterday",
            "This Week",
            "Last Week",
            "This Month",
            "Last Month",
            "This Year",
            "All Time",
            "Custom",
          ].map((tab) => (
            <button
              key={tab}
              className="px-4 py-2 bg-[#1f1b4e] text-white rounded-full"
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center mb-4 ml-96">
          <input
            className="px-4 py-2 rounded-sm bg-[#3c366b] text-white"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Data Table */}
        <div className="border rounded-lg p-4">
          {/* Table Header */}

          {/* <div className="flex items-center gap-4">
              <button className="bg-[#3c366b] p-2 rounded-full text-white">
                Filter
              </button>
              <button className="bg-[#3c366b] p-2 rounded-full text-white">
                Download
              </button>
            </div> */}

          {/* Data Table */}
          <table className="w-full text-white">
            <thead>
              <tr className="text-left">
                <th className="pb-2">Rank</th>
                <th className="pb-2">Company Name</th>
                <th className="pb-2">Total Tasks</th>
                <th className="pb-2">Completion %</th>
                <th className="pb-2">Task Users</th>
                <th className="pb-2">Added/Subscribed Users</th>
                <th className="pb-2">Dates(Join/Renewal)</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrganizations.map((org, index) => (
                <tr key={org._id} className="border-b border-gray-700">
                  <td className="py-2">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td>{org.companyName}</td>
                  <td>{org.totalTasks}</td>
                  <td>{org.completionPercentage}%</td>
                  <td>{getTaskUsersCount(org)}</td>
                  <td>{org.users.length}</td>
                  <td>{new Date(org.trialExpires).toLocaleDateString()}</td>
                  <td>
                    <button className="text-blue-400">
                      <Eye />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedOrganizations.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="text-white"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-white">
              Page {currentPage} of{" "}
              {Math.ceil(filteredOrganizations.length / itemsPerPage)}
            </span>
            <button
              className="text-white"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredOrganizations.length / itemsPerPage)
                  )
                )
              }
              disabled={
                currentPage ===
                Math.ceil(filteredOrganizations.length / itemsPerPage)
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
