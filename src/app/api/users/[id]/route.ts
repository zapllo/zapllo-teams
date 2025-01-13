import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        const user = await User.findById(id)
            .populate("reportingManager", "firstName lastName whatsappNo")
            .exec();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const organizationUsers = await User.find({ organization: user.organization });
        const employeeIndex = organizationUsers
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
            .findIndex((u) => u._id.toString() === id);

        const employeeId = `EMP${employeeIndex + 1}`;

        return NextResponse.json({
            user: {
                ...user.toObject(),
                employeeId,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
