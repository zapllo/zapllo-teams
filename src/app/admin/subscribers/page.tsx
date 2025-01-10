"use client";
import React, { useEffect, useState } from "react";

interface Subscriber {
    _id: string;
    email: string;
    createdAt: string; // Assuming you want to display the createdAt field as well
}

export default function Subscribers() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [sortField, setSortField] = useState<keyof Subscriber>("email");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        async function fetchSubscribers() {
            try {
                const response = await fetch("/api/subscribers");
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data: Subscriber[] = await response.json();
                setSubscribers(data);
                setFilteredSubscribers(data);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred");
                }
            }
        }

        fetchSubscribers();
    }, []);

    useEffect(() => {
        let filtered = subscribers;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(subscriber =>
                subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
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

        setFilteredSubscribers(filtered);
    }, [subscribers, searchQuery, sortField, sortOrder]);

    // Pagination
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedSubscribers = filteredSubscribers.slice(startIndex, startIndex + pageSize);
    const totalPages = Math.ceil(filteredSubscribers.length / pageSize);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = (field: keyof Subscriber) => {
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

    return (
        <div className="border-l-[1px] border-t-[1px] pb-20 scrollbar-hide h-full w-full overflow-hidden rounded-l-3xl border-muted-foreground/20 overflow-y-scroll">
            <div className="w-full p-8">
                <h1 className="mb-4 text-2xl font-bold">Subscribers</h1>
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
                            <tr>
                                <th
                                    onClick={() => handleSort("email")}
                                    className="p-2 text-start border-bcursor-pointer"
                                >
                                    Email {sortField === "email" && (sortOrder === "asc" ? "🔼" : "🔽")}
                                </th>
                                <th
                                    onClick={() => handleSort("createdAt")}
                                    className="p-2 text-start border-b cursor-pointer"
                                >
                                    Subscribed At {sortField === "createdAt" && (sortOrder === "asc" ? "🔼" : "🔽")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSubscribers.map(subscriber => (
                                <tr key={subscriber._id}>
                                    <td className="p-2 border-b">{subscriber.email}</td>
                                    <td className="p-2 border-b ">{formatDate(subscriber.createdAt)}</td>
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
                            onChange={e => setPageSize(Number(e.target.value))}
                            className="p-2 border  rounded"
                        >
                            {[10, 20, 30, 40, 50].map(size => (
                                <option key={size} value={size}>
                                    Show {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    );
}
