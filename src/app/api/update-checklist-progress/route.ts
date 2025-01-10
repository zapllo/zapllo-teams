import connectDB from "@/lib/db";
import User from "@/models/userModel";
import ChecklistItem from "@/models/checklistModel"; // Import the ChecklistItem model
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";

connectDB();

export async function PATCH(request: NextRequest) {
    try {
        const { checklistItemId, isCompleted } = await request.json();

        // Log the input for debugging
        console.log("Received payload:", { checklistItemId, isCompleted });

        const userId = await getDataFromToken(request);
        // Validate input data
        if (!userId || !checklistItemId || typeof isCompleted !== "boolean") {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        // Check if the checklist item exists
        const checklistItem = await ChecklistItem.findById(checklistItemId);
        if (!checklistItem) {
            return NextResponse.json({ error: "Checklist item not found" }, { status: 404 });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update the user's checklist progress
        if (isCompleted) {
            // Add the checklist item ID if not already in progress
            if (!user.checklistProgress.includes(checklistItemId)) {
                user.checklistProgress.push(checklistItemId);
            }
        } else {
            // Remove the checklist item ID if it exists in progress
            user.checklistProgress = user.checklistProgress.filter(
                (itemId) => itemId.toString() !== checklistItemId
            );
        }

        // Save the user
        await user.save();

        return NextResponse.json({ message: "Checklist progress updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating checklist progress:", error);
        return NextResponse.json({ error: "Error updating checklist progress" }, { status: 500 });
    }
}
