import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(request: NextRequest) {
    try {
        // Fetch all users from the database
        const users = await User.find({})
        return NextResponse.json({
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
