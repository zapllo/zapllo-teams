import { NextRequest, NextResponse } from "next/server";
import PayslipLog from "@/models/payslipLogModel";
import Payslip from "@/models/payslipModel";

export async function GET(req: NextRequest, { params }: { params: { userId: string; } }) {
    try {
        const { userId } = params;

        // Fetch PayslipLog details
        const payslipLogs = await PayslipLog.find({ userId });
        if (!payslipLogs) {
            return NextResponse.json({ success: false, message: "PayslipLogs not found" }, { status: 404 });
        }

        // Fetch Payslip details
        const payslip = await Payslip.findOne({ user: userId });
        if (!payslip) {
            return NextResponse.json({ success: false, message: "Payslip not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            payslipLogs,
            payslip,
        });
    } catch (error) {
        console.error("Error fetching payslip and payslip log:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch payslip data" }, { status: 500 });
    }
}
