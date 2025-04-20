import connectDB from "@/lib/db";
import Event from "@/models/eventModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const eventId = params.id;

        const event = await Event.findById(eventId)
            .populate({
                path: 'registrations.user',
                select: 'firstName lastName profilePic email'
            })
            .populate({
                path: 'comments.user',
                select: 'firstName lastName profilePic'
            })
            .populate({
                path: 'createdBy',
                select: 'firstName lastName'
            });

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Event details fetched successfully",
            data: event
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
