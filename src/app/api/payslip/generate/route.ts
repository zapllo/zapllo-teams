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
    const publicLink = `/payslip/${userId}/${month}-${year}`;
    
    // Check if a payslip for the same month and year already exists
    const existingPayslip = await PayslipLog.findOne({ userId, month, year });
    if (existingPayslip) {
      return NextResponse.json({
        success: true,
        uniqueLink: existingPayslip.uniqueLink,
        publicLink: existingPayslip.publicLink,
        message: "Payslip already generated!",
      });
    }

    // Extract salary and deduction details from the user
    const { salaryDetails = [], deductionDetails = [] } = user;

    // Reset any penalties in the deductions (set the amount to zero if the name is "Penalties")
    const updatedDeductionDetails = deductionDetails.map((deduction: any) => {
      if (deduction.name === "Penalties") {
        return { ...deduction, amount: 0 };
      }
      return deduction;
    });

    // Create and save the payslip log with the updated details
    const payslip = new PayslipLog({
      userId,
      month,
      year,
      uniqueLink,
      publicLink,
      salaryDetails,
      deductionDetails: updatedDeductionDetails,
    });
    await payslip.save();

    // Also update the user document to reset the "Penalties" deduction
    await User.findByIdAndUpdate(userId, {
      $set: { deductionDetails: updatedDeductionDetails },
    });

    return NextResponse.json({ success: true, uniqueLink, publicLink });
  } catch (error) {
    console.error("Error generating payslip:", error);
    return NextResponse.json({ success: false, message: "Failed to generate payslip" }, { status: 500 });
  }
}
