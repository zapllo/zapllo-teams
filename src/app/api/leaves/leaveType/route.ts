import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Database connection
import Leave from '@/models/leaveTypeModel'; // Import the Leave model
import User from '@/models/userModel'; // Import the User model
import { getDataFromToken } from '@/helper/getDataFromToken';
import mongoose from 'mongoose';

connectDB(); // Establish the database connection

// Function to initialize leave balances for users in the same organization as the authenticated user
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

// POST: Create a new leave type
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

        // Parse the request body
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

        // Validate the selected units
        const validUnits = ['Full Day', 'Half Day', 'Short Leave'];
        const selectedUnits = unit.filter((u: string) => validUnits.includes(u));

        if (selectedUnits.length === 0) {
            return NextResponse.json({ error: 'Invalid unit selection. Please select valid units.' }, { status: 400 });
        }

        // Create a new leave document with the organization assigned from the authenticated user
        const newLeave = new Leave({
            leaveType,
            description,
            allotedLeaves,
            type,
            backdatedLeaveDays,
            advanceLeaveDays,
            includeHolidays,
            includeWeekOffs,
            unit: selectedUnits,  // Use validated units here
            organization: authenticatedUser.organization, // Automatically assign the organization from the authenticated user
        });

        // Save the leave document
        const savedLeave = await newLeave.save();

        // Initialize leave balances for all users with the newly created leave type
        await initializeBalancesForAllUsers(savedLeave._id as mongoose.Types.ObjectId, allotedLeaves, authenticatedUser.organization);

        // Return a success response
        return NextResponse.json({ message: 'Leave type created successfully and balances initialized', leave: savedLeave });
    } catch (error) {
        console.error('Error creating leave type:', error);
        return NextResponse.json({ error: 'Failed to create leave type' }, { status: 500 });
    }
}

// GET: Fetch all leave types for the authenticated user's organization
export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const authenticatedUser = await User.findById(userId);
        if (!authenticatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!authenticatedUser.organization || !(authenticatedUser.organization instanceof mongoose.Types.ObjectId)) {
            return NextResponse.json({ error: "User's organization is not valid" }, { status: 400 });
        }

        // Fetch all leave types for the authenticated user's organization
        const leaveTypes = await Leave.find({ organization: authenticatedUser.organization });

        return NextResponse.json(leaveTypes);
    } catch (error) {
        console.error('Error fetching leave types:', error);
        return NextResponse.json({ error: 'Failed to fetch leave types' }, { status: 500 });
    }
}
