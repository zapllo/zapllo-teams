import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import Organization from "@/models/organizationModel";

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

        const organization = await Organization.findById(authenticatedUser.organization);

        return NextResponse.json({
            message: "Users fetched successfully",
            data: organization,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
