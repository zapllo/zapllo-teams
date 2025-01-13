import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Payslip from "@/models/payslipModel";

connectDB();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const payslip = await Payslip.findOne({ user: id });
    if (!payslip) {
      return NextResponse.json({ success: false, message: "Payslip not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, payslip }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
