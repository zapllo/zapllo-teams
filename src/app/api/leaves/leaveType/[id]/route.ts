import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Database connection
import Leave from '@/models/leaveTypeModel'; // Import the Leave model
import { getDataFromToken } from '@/helper/getDataFromToken'; // Import your token helper
import User from '@/models/userModel'; // Import the User model

connectDB(); // Establish the database connection

// PUT: Edit an existing leave type
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Extract the userId from the token using the helper
        const userId = await getDataFromToken(request);
        const authenticatedUser = await User.findById(userId);

        if (!authenticatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Parse the request body for updated leave data
        const {
            leaveType,
            description,
            allotedLeaves,
            type,
            backdatedLeaveDays,
            advanceLeaveDays,
            includeHolidays,
            includeWeekOffs,
            unit,
        } = await request.json();

        // Find the leave type by ID and ensure it's within the authenticated user's organization
        const leave = await Leave.findOne({ _id: params.id, organization: authenticatedUser.organization });

        if (!leave) {
            return NextResponse.json({ error: 'Leave type not found' }, { status: 404 });
        }

        // Update the leave type fields
        leave.leaveType = leaveType || leave.leaveType;
        leave.description = description || leave.description;
        leave.allotedLeaves = allotedLeaves || leave.allotedLeaves;
        leave.type = type || leave.type;
        leave.backdatedLeaveDays = backdatedLeaveDays ?? leave.backdatedLeaveDays; // Handle zero values correctly
        leave.advanceLeaveDays = advanceLeaveDays ?? leave.advanceLeaveDays;
        leave.includeHolidays = includeHolidays ?? leave.includeHolidays;
        leave.includeWeekOffs = includeWeekOffs ?? leave.includeWeekOffs;
        leave.unit = unit || leave.unit;

        // Save the updated document
        await leave.save();

        // Return a success response
        return NextResponse.json({ message: 'Leave type updated successfully', leave });
    } catch (error) {
        console.error('Error updating leave type:', error);
        return NextResponse.json({ error: 'Failed to update leave type' }, { status: 500 });
    }
}

// DELETE: Remove an existing leave type
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Extract the userId from the token using the helper
        const userId = await getDataFromToken(request);
        const authenticatedUser = await User.findById(userId);

        if (!authenticatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Find and delete the leave type by ID
        const leave = await Leave.findOneAndDelete({ _id: params.id, organization: authenticatedUser.organization });

        if (!leave) {
            return NextResponse.json({ error: 'Leave type not found' }, { status: 404 });
        }

        // Return a success response
        return NextResponse.json({ message: 'Leave type deleted successfully' });
    } catch (error) {
        console.error('Error deleting leave type:', error);
        return NextResponse.json({ error: 'Failed to delete leave type' }, { status: 500 });
    }
}
