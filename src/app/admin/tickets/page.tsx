'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs"; // For date formatting
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";


// Interface for the User object (based on your user model)
interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    organization: IOrganization;
}

// Interface for the Organization object
interface IOrganization {
    _id: string;
    companyName: string;
}

// Interface for the Ticket object (based on your ticket model)
interface ITicket {
    _id: string;
    category: string;
    subcategory: string;
    user: IUser; // Referencing the User interface
    subject: string;
    description: string;
    fileUrl?: string[];
    createdAt: Date;
    updatedAt: Date;
    comments: IComment[];
    status: string;
}

// Interface for the Comment object (based on your ticket model)
interface IComment {
    userId: string;
    content: string;
    fileUrls?: string[] | null;
    createdAt: Date;
}




const TicketsTable = () => {
    const [tickets, setTickets] = useState<ITicket[]>([]); // Use ITicket[] for the state
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get("/api/tickets/all");
                console.log(response, 'tickets?')

                setTickets(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load tickets");
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);


    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    const handleViewDetails = (ticket: ITicket) => {
        router.push(`/admin/tickets/${ticket._id}`) // Navigate to the ticket details page
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 text-white">
                <thead>
                    <tr className="text-left border-b border-gray-700">
                        <th className="py-2 px-4">S.No</th>
                        <th className="py-2 px-4">User Name</th>
                        <th className="py-2 px-4">Organization Name</th>
                        <th className="py-2 px-4">Category</th>
                        <th className="py-2 px-4">Subcategory</th>
                        <th className="py-2 px-4">Date</th>
                        <th className="py-2 px-4">Due Date</th>
                        <th className="py-2 px-4">Status</th>
                        <th className="py-2 px-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets?.map((ticket, index) => (
                        <tr key={ticket._id} className="border-b border-gray-700">
                            <td className="py-2 px-4">{index + 1}</td>
                            <td className="py-2 px-4">
                                {ticket?.user?.firstName} {ticket?.user?.lastName}
                            </td>
                            <td className="py-2 px-4">{ticket?.user?.organization?.companyName}</td>
                            <td className="py-2 px-4">{ticket?.category}</td>
                            <td className="py-2 px-4">{ticket?.subcategory}</td>
                            <td className="py-2 px-4">{dayjs(ticket?.createdAt).format('MMM DD, YYYY')}</td>
                            <td className="py-2 px-4">{dayjs(ticket?.createdAt).add(1, 'day').format('MMM DD, YYYY')}</td>
                            <td className={`py-2 px-4 ${ticket?.status === "Over Due" ? "text-red-500" : "text-green-500"}`}>
                                {ticket.status}
                            </td>
                            <td className="py-2 px-4 text-center">
                                <button onClick={() => handleViewDetails(ticket)} className="text-blue-500 hover:underline">
                                    <Eye />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TicketsTable;
