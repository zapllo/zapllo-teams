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

        return NextResponse.json({ success: true, salaryDetails: user.salaryDetails || [] }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching salary details:", error);
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

        const { salaryDetails, monthCalculationType } = await request.json(); // Accept `monthCalculationType`


        // Validate input structure
        if (!Array.isArray(salaryDetails) || !salaryDetails.every((item: any) => typeof item.name === 'string' && typeof item.amount === 'number')) {
            return NextResponse.json({ success: false, message: "Invalid salary details structure" }, { status: 400 });
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Update salary details and month calculation type
        user.salaryDetails = salaryDetails || user.salaryDetails;
        user.monthCalculationType = monthCalculationType || user.monthCalculationType;

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Salary details updated successfully",
            salaryDetails: user.salaryDetails,
            monthCalculationType: user.monthCalculationType,
        });
    } catch (error: any) {
        console.error("Error updating salary details:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}



export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
        }

        // Parse the request body
        const { monthCalculationType } = await request.json();

        if (!monthCalculationType) {
            return NextResponse.json(
                { success: false, message: "monthCalculationType is required" },
                { status: 400 }
            );
        }

        // Update the user's monthCalculationType
        const user = await User.findByIdAndUpdate(
            id,
            { monthCalculationType },
            { new: true } // Return the updated document
        );

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Month calculation type updated successfully",
            user,
        });
    } catch (error: any) {
        console.error("Error updating month calculation type:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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
        user.salaryDetails = user.salaryDetails?.filter((allowance) => allowance.name !== name);

        await user.save(); // Save the updated user document

        return NextResponse.json({
            success: true,
            message: `Allowance "${name}" deleted successfully.`,
            salaryDetails: user.salaryDetails,
        });
    } catch (error: any) {
        console.error("Error deleting allowance:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

