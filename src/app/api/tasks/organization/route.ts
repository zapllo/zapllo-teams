import connectDB from "@/lib/db";
import Task from "@/models/taskModal";
import User from "@/models/userModel";
import Category from "@/models/categoryModel"; // Ensure this import is correct
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";

connectDB();

export async function GET(request: NextRequest) {
    try {
        // Extract user ID from the authentication token
        const userId = await getDataFromToken(request);

        // Find the authenticated user in the database based on the user ID
        const authenticatedUser = await User.findById(userId).select("-password");
        if (!authenticatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const tasks = await Task.find({
            organization: authenticatedUser.organization
        })
            .populate('user', 'firstName lastName')  // Populate only firstName and lastName of the user
            .populate('assignedUser', 'firstName lastName')  // Populate only firstName and lastName of the assignedUser
            .populate({
                path: 'category',
                select: 'name', // Only include the category name
            });

        return NextResponse.json({
            message: "Tasks fetched successfully",
            data: tasks,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
