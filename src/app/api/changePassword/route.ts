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

        const validPassword = await bcryptjs.compare(currentPassword, authenticatedUser.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);
        authenticatedUser.password = hashedPassword;

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
