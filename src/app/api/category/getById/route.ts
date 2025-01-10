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

        // Extract the category ID from the request body
        const { categoryId } = await request.json();

        // Fetch the specific category by ID and organization
        const category = await Category.findOne({ _id: categoryId });
        console.log(categoryId, 'categoryID');
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Category fetched successfully",
            data: category,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
