import connectDB from "@/lib/db";
import Task from "@/models/taskModal";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(request: NextRequest) {
    try {
        // Fetch all users from the database
        const tasks = await Task.find({}); // Exclude password field
        return NextResponse.json({
            message: "Tasks fetched successfully",
            data: tasks,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
