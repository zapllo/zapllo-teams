import connectDB from "@/lib/db";
import Category from "@/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";

connectDB();

export async function GET(request: NextRequest) {
    try {
        // Extract user ID from the authentication token
        const userId = await getDataFromToken(request);
        // Find the authenticated user in the database based on the user ID
        const authenticatedUser = await User.findById(userId);
        if (!authenticatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch categories specific to the organization
        const categories = await Category.find({ organization: authenticatedUser.organization });
        console.log(categories, 'categories?')
        return NextResponse.json({
            message: "Categories fetched successfully",
            data: categories,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
