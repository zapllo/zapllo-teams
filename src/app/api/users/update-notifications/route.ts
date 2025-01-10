// In /api/users/update-notifications.ts
import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";

connectDB();

export async function PATCH(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const { email, whatsapp } = await request.json();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        user.notifications.email = email;
        user.notifications.whatsapp = whatsapp;
        await user.save();

        return NextResponse.json({ message: "Notification settings updated" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
