"use client"

import { ShiningButton } from "@/components/globals/shiningbutton";
import React, { useEffect, useState } from "react";

interface Lead {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  mobNo: string;
  createdAt: string; // Added createdAt field
}

export default function Messages() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortField, setSortField] = useState<keyof Lead>("email");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch("/api/leads");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: Lead[] = await response.json();
        setLeads(data);
        setFilteredLeads(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }

    fetchLeads();
  }, []);

  useEffect(() => {
    let filtered = leads;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (lead) =>
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.mobNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.createdAt.toLowerCase().includes(searchQuery.toLowerCase()) // Also search in createdAt field
      );
    }

    // Sorting
    filtered = filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      } else if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });

    setFilteredLeads(filtered);
  }, [leads, searchQuery, sortField, sortOrder]);

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredLeads.length / pageSize);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Function to format timestamp
  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${formattedHours}:${minutes} ${period} ${month}/${day}/${year}`;
  };

  const openModal = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const closeModal = () => {
    setSelectedLead(null);
  };
  return (
    <div className="border-l-[1px] border-t-[1px] pb-20 scrollbar-hide h-full w-full overflow-hidden rounded-l-3xl border-muted-foreground/20 overflow-y-scroll">
      <div className="w-full p-8">
        <h1 className="mb-4 text-2xl font-bold">Messages (Leads)</h1>
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search"
            className="p-2 border  rounded mb-4"
          />
          <table className="min-w-full  border  rounded">
            <thead>
              <tr className="text-start">
                <th onClick={() => handleSort("email")} className="p-2 text-start border-b cursor-pointer">
                  Email {sortField === "email" && (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th onClick={() => handleSort("firstName")} className="p-2 text-start border-b cursor-pointer">
                  First Name {sortField === "firstName" && (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th onClick={() => handleSort("lastName")} className="p-2 border-b text-start cursor-pointer">
                  Last Name {sortField === "lastName" && (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th onClick={() => handleSort("message")} className="p-2 border-b text-start cursor-pointer">
                  Message {sortField === "message" && (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th onClick={() => handleSort("mobNo")} className="p-2 border-b text-start cursor-pointer">
                  Mobile No {sortField === "mobNo" && (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th onClick={() => handleSort("createdAt")} className="p-2 border-b text-start cursor-pointer">
                  Created At {sortField === "createdAt" && (sortOrder === "asc" ? "🔼" : "🔽")}
                </th>
                <th>
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead) => (
                <tr key={lead._id}>
                  <td className="p-2 border-b">{lead.email}</td>
                  <td className="p-2 border-b">{lead.firstName}</td>
                  <td className="p-2 border-b">{lead.lastName}</td>
                  <td className="p-2 border-b">{lead.message.substring(0, 35)}{lead.message.length > 35 && '...'}</td>
                  <td className="p-2 border-b">{lead.mobNo}</td>
                  <td className="p-2 border-b">{formatDate(lead.createdAt)}</td>
                  <td className=" border-b">
                    <button onClick={() => openModal(lead)} className="text-blue-500 scale-75 underline">
                      <ShiningButton text="View Message" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border rounded"
            >
              {"<"}
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border  rounded"
            >
              {">"}
            </button>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="p-2 border  rounded"
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {selectedLead && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50">
            <div className="bg-black backdrop-blur-sm border border-white  p-8 rounded shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Message</h2>
              <p>{selectedLead.message}</p>
              <button onClick={closeModal} className="mt-4 p-2 border rounded">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
