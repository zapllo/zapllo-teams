import { NextRequest, NextResponse } from "next/server";
import PayslipLog from "@/models/payslipLogModel";
import User from "@/models/userModel";

export async function POST(req: NextRequest) {
    try {
        const { userId, month, year } = await req.json();

        // Validate user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Generate unique link (using userId, month, and year)
        const uniqueLink = `/dashboard/teams/${userId}/payslip/${month}-${year}`;

        // Check if a payslip for the same month and year already exists
        const existingPayslip = await PayslipLog.findOne({ userId, month, year });
        if (existingPayslip) {
            return NextResponse.json({
                success: true,
                uniqueLink: existingPayslip.uniqueLink,
                message: "Payslip already generated!",
            });
        }

        // Save the payslip log
        const payslip = new PayslipLog({
            userId,
            month,
            year,
            uniqueLink,
        });
        await payslip.save();

        return NextResponse.json({ success: true, uniqueLink });
    } catch (error) {
        console.error("Error generating payslip:", error);
        return NextResponse.json({ success: false, message: "Failed to generate payslip" }, { status: 500 });
    }
}
