import connectDB from "@/lib/db";
import Category from "@/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";

connectDB();

export async function PATCH(request: NextRequest) {
    try {
        // Extract user ID from the authentication token
        const userId = await getDataFromToken(request);
        // Parse the JSON body from the request
        const { categoryId, name } = await request.json();

        // Find the authenticated user in the database based on the user ID
        const authenticatedUser = await User.findById(userId);
        if (!authenticatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find and update the category
        const updatedCategory = await Category.findOneAndUpdate(
            { _id: categoryId, organization: authenticatedUser.organization },
            { name },
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            return NextResponse.json({ error: "Category not found or not authorized to update" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Category updated successfully",
            data: updatedCategory,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
