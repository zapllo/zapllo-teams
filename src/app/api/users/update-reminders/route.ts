// In /api/users/update-reminders.ts
import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";

connectDB();

export async function PATCH(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const { reminders, weeklyOffs } = await request.json();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Ensure reminders object exists
        if (!user.reminders) {
            user.reminders = {
                dailyReminderTime: reminders.dailyReminderTime,
                email: reminders.email,
                whatsapp: reminders.whatsapp,
            };
        } else {
            // Update reminders fields if already exists
            user.reminders.dailyReminderTime = reminders.dailyReminderTime;
            user.reminders.email = reminders.email;
            user.reminders.whatsapp = reminders.whatsapp;
        }

        // Ensure weeklyOffs array exists and update it
        user.weeklyOffs = Array.isArray(user.weeklyOffs) ? weeklyOffs : [...weeklyOffs];

        await user.save();

        return NextResponse.json({ message: "Reminders and weekly offs updated" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
