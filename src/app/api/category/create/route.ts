import connectDB from "@/lib/db";
import Category from "@/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";

connectDB();

export async function POST(request: NextRequest) {
    try {
        // Extract user ID from the authentication token
        const userId = await getDataFromToken(request);
        // Find the authenticated user in the database based on the user ID
        const authenticatedUser = await User.findById(userId);
        if (!authenticatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        // Parse the JSON body from the request
        const reqBody = await request.json();
        const { name } = reqBody;
        // Create a new category with the provided data and the authenticated user's organization
        const newCategory = new Category({
            name,
            organization: authenticatedUser.organization, // Link category to the user's organization
        });

        // Save the new category to the database
        const savedCategory = await newCategory.save();

        return NextResponse.json({
            message: "Category created successfully",
            data: savedCategory,
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
