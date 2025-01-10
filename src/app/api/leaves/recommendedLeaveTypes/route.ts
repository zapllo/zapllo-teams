import { getDataFromToken } from '@/helper/getDataFromToken';
import Leave from '@/models/leaveTypeModel';
import User from '@/models/userModel';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Database connection

connectDB(); // Establish the database connection

// Function to initialize leave balances for users in the same organization
async function initializeBalancesForAllUsers(leaveTypeId: mongoose.Types.ObjectId, allotedLeaves: number, organizationId: mongoose.Types.ObjectId) {
    const users = await User.find({ organization: organizationId });

    for (const user of users) {
        if (!user.leaveBalances) {
            user.leaveBalances = [];
        }

        const existingBalance = user.leaveBalances.find(balance =>
            balance.leaveType && balance.leaveType.equals(leaveTypeId)  // Use .equals() for ObjectId comparison
        );

        if (!existingBalance) {
            user.leaveBalances.push({
                leaveType: leaveTypeId,  // Correctly assign the ObjectId
                balance: allotedLeaves,
            });
        }

        await user.save();  // Save the updated user
    }
}

// POST: Bulk create recommended leave types
export async function POST(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);

        // Fetch the authenticated user from the database
        const authenticatedUser = await User.findById(userId);
        if (!authenticatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Ensure the user is part of a valid organization
        if (!authenticatedUser.organization || !(authenticatedUser.organization instanceof mongoose.Types.ObjectId)) {
            return NextResponse.json({ error: "User's organization is not valid" }, { status: 400 });
        }

        // Define the recommended leave types with the user's organization
        const recommendedLeaveTypes = [
            {
                leaveType: 'Casual Leave',
                description: 'Casual Leave is intended for short-term personal needs such as attending to personal matters, family emergencies, or other unforeseen events.',
                allotedLeaves: 12,
                type: 'Paid',
                backdatedLeaveDays: 60,
                advanceLeaveDays: 90,
                includeHolidays: false,
                includeWeekOffs: false,
                unit: ['Full Day', 'Half Day', 'Short Leave'],
                organization: authenticatedUser.organization, // Assign the authenticated user's organization
            },
            {
                leaveType: 'Sick Leave',
                description: 'Sick Leave can be availed by employees when they are ill or need medical attention. This type of leave is intended for health-related absences.',
                allotedLeaves: 12,
                type: 'Paid',
                backdatedLeaveDays: 60,
                advanceLeaveDays: 90,
                includeHolidays: false,
                includeWeekOffs: false,
                unit: ['Full Day', 'Half Day', 'Short Leave'],
                organization: authenticatedUser.organization, // Assign the authenticated user's organization
            },
            {
                leaveType: 'Earned Leave',
                description: 'Earned Leave, also known as Annual Leave or Privilege Leave, is accrued based on the length of service and can be used for planned vacations or personal time off.',
                allotedLeaves: 15,
                type: 'Paid',
                backdatedLeaveDays: 60,
                advanceLeaveDays: 90,
                includeHolidays: false,
                includeWeekOffs: false,
                unit: ['Full Day', 'Half Day', 'Short Leave'],
                organization: authenticatedUser.organization, // Assign the authenticated user's organization
            },
            {
                leaveType: 'Leave Without Pay',
                description: 'Leave Without Pay is granted when an employee has exhausted all other leave types and still needs time off. This leave is unpaid.',
                allotedLeaves: 6,
                type: 'Unpaid',
                backdatedLeaveDays: 60,
                advanceLeaveDays: 90,
                includeHolidays: false,
                includeWeekOffs: false,
                unit: ['Full Day', 'Half Day', 'Short Leave'],
                organization: authenticatedUser.organization, // Assign the authenticated user's organization
            },
        ];

        // Insert the recommended leave types into the database
        const insertedLeaveTypes = await Leave.insertMany(recommendedLeaveTypes);

        // Initialize leave balances for all users with the newly created leave types
        for (const leaveType of insertedLeaveTypes) {
            await initializeBalancesForAllUsers(leaveType._id, leaveType.allotedLeaves, authenticatedUser.organization);
        }

        // Return a success response with the newly created leave types
        return NextResponse.json({ success: true, message: 'Recommended leave types created and balances initialized', data: insertedLeaveTypes });
    } catch (error) {
        console.error('Error creating recommended leave types:', error);
        return NextResponse.json({ success: false, error: 'Failed to create recommended leave types' });
    }
}
