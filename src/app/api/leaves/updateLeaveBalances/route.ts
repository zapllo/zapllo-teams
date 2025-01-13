import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Database connection
import Leave from '@/models/leaveTypeModel'; // Import the Leave model
import User from '@/models/userModel'; // Import the User model
import { getDataFromToken } from '@/helper/getDataFromToken';
import mongoose from 'mongoose';

connectDB(); // Establish the database connection

// Function to update leave balances for all users in the same organization as the authenticated user
async function updateLeaveBalancesForAllUsers(organizationId: mongoose.Types.ObjectId) {
    const leaveTypes = await Leave.find({ organization: organizationId });

    const users = await User.find({ organization: organizationId });

    for (const user of users) {
        if (!user.leaveBalances) {
            user.leaveBalances = [];
        }

        // Loop through each leave type to update balances based on the leaveReset criteria
        for (const leaveType of leaveTypes) {
            const existingBalance = user.leaveBalances.find(balance =>
                balance.leaveType && balance.leaveType.equals(leaveType._id)
            );

            if (existingBalance) {
                if (leaveType.leaveReset === "Reset") {
                    // Reset leave balance to the alloted leaves
                    existingBalance.balance = leaveType.allotedLeaves;
                } else if (leaveType.leaveReset === "CarryForward") {
                    // Add the alloted leaves to the existing balance
                    existingBalance.balance += leaveType.allotedLeaves;
                }
            } else {
                // If no existing balance, create a new entry
                user.leaveBalances.push({
                    leaveType: leaveType._id, // Correctly assign the ObjectId
                    balance: leaveType.allotedLeaves,
                });
            }
        }

        // Update the total leave balance (sum of all leave types)
        user.totalLeaveBalance = user.leaveBalances.reduce(
            (total, balance) => total + balance.balance,
            0
        );

        await user.save();  // Save the updated user
    }
}

// POST: Handle the update of leave balances for the year 2025 when user confirms
export async function POST(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const authenticatedUser = await User.findById(userId);
        if (!authenticatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if organization is valid
        if (!authenticatedUser.organization || !(authenticatedUser.organization instanceof mongoose.Types.ObjectId)) {
            return NextResponse.json({ error: "User's organization is not valid" }, { status: 400 });
        }

        // Update leave balances for all users in the same organization
        await updateLeaveBalancesForAllUsers(authenticatedUser.organization);

        // Return a success response
        return NextResponse.json({ message: 'Leave balances for all users updated successfully' });
    } catch (error) {
        console.error('Error updating leave balances:', error);
        return NextResponse.json({ error: 'Failed to update leave balances' }, { status: 500 });
    }
}
