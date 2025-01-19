import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { getDataFromToken } from "@/helper/getDataFromToken";

connectDB();

export async function PATCH(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const authenticatedUser = await User.findById(userId);

        if (!authenticatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const reqBody = await request.json();
        const { currentPassword, newPassword } = reqBody;

        if (currentPassword !== authenticatedUser.password) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }


        authenticatedUser.password = newPassword;

        await authenticatedUser.save();

        return NextResponse.json({
            message: "Password changed successfully",
            success: true,
        });
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
