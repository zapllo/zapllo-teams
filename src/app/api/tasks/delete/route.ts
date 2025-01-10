
// Import necessary modules and models
import connectDB from "@/lib/db";
import Task from "@/models/taskModal";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Task deleted successfully",
            data: deletedTask,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}