import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import connectDB from "@/lib/db";
import mongoose from "mongoose"; // Import mongoose to validate ObjectId

connectDB();



export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: "Invalid userId" }, { status: 400 });
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, deductionDetails: user.deductionDetails || [] }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching deduction details:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}


export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: "Invalid userId" }, { status: 400 });
        }

        const { deductionDetails } = await request.json();

        // Validate `deductionDetails` structure if provided
        if (deductionDetails && (!Array.isArray(deductionDetails) || !deductionDetails.every((item: any) => typeof item.name === 'string' && typeof item.amount === 'number'))) {
            return NextResponse.json({ success: false, message: "Invalid deduction details structure" }, { status: 400 });
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Update the user's deduction details if provided
        if (deductionDetails) {
            user.deductionDetails = deductionDetails;
        }

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Deduction details updated successfully",
            deductionDetails: user.deductionDetails,
        });
    } catch (error: any) {
        console.error("Error updating deduction details:", error);
        return NextResponse.json({ success: false, message: `Error: ${error.message}` }, { status: 500 });
    }
}





export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { name } = await request.json(); // Extract the allowance name to delete

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Remove the allowance from the salaryDetails array
        user.deductionDetails = user.deductionDetails?.filter((allowance) => allowance.name !== name);

        await user.save(); // Save the updated user document

        return NextResponse.json({
            success: true,
            message: `Allowance "${name}" deleted successfully.`,
            deductionDetails: user.deductionDetails,
        });
    } catch (error: any) {
        console.error("Error deleting allowance:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

