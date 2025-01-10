import { getDataFromToken } from "@/helper/getDataFromToken";
import connectDB from "@/lib/db";
import Ticket from "@/models/ticketModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDB(); // Ensure the database is connected
        // Fetch tickets for the specific user and populate user data
        const tickets = await Ticket.find({})
            .populate({
                path: 'user',
                select: 'firstName lastName organization', // Select relevant fields
                populate: {
                    path: 'organization',
                    select: 'companyName', // Populate organization name
                },
            })
            .lean(); // Convert Mongoose documents to plain JavaScript objects
        console.log(tickets, 'tickets?')
        // Return the tickets as a JSON response
        return NextResponse.json(tickets);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
    }
}