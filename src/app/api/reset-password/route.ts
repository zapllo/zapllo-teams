import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();
        const decoded: any = jwt.verify(token, process.env.RESET_PASSWORD_SECRET!);

        if (!decoded) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
