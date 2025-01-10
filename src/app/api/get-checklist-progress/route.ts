import { getDataFromToken } from "@/helper/getDataFromToken";
import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(request: NextRequest) {
    try {
        // Retrieve user ID from the token
        const userId = await getDataFromToken(request);

        // Validate user ID
        if (!userId) {
            console.error("User ID is missing or invalid.");
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Find user by ID
        const user = await User.findById(userId);

        // Handle user not found
        if (!user) {
            console.error("User not found:", userId);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Initialize checklistProgress if missing
        if (!user.checklistProgress) {
            console.warn("User checklistProgress is not initialized. Setting to an empty array.");
            user.checklistProgress = [];
        }

        // Return the checklist progress
        console.log("Fetched checklist progress for user:", userId, user.checklistProgress);
        return NextResponse.json({ progress: user.checklistProgress }, { status: 200 });
    } catch (error) {
        console.error("Error fetching checklist progress:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
