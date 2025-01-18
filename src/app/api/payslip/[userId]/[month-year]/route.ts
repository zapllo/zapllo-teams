import { NextRequest, NextResponse } from "next/server";
import PayslipLog from "@/models/payslipLogModel";
import Payslip from "@/models/payslipModel";

export async function GET(req: NextRequest, { params }: { params: { userId: string; "month-year": string } }) {
    try {
        const { userId, "month-year": monthYear } = params;
        const [month, year] = monthYear.split("-").map(Number);

        // Fetch PayslipLog details
        const payslipLog = await PayslipLog.findOne({ userId, month, year });
        if (!payslipLog) {
            return NextResponse.json({ success: false, message: "PayslipLog not found" }, { status: 404 });
        }

        // Fetch Payslip details
        const payslip = await Payslip.findOne({ user: userId });
        if (!payslip) {
            return NextResponse.json({ success: false, message: "Payslip not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            payslipLog,
            payslip,
        });
    } catch (error) {
        console.error("Error fetching payslip and payslip log:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch payslip data" }, { status: 500 });
    }
}
