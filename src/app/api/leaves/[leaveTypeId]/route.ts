import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import LeaveType from '@/models/leaveTypeModel';
import { getDataFromToken } from '@/helper/getDataFromToken'; // If you're using JWT-based auth
import connectDB from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { leaveTypeId: string } }) {
    try {
        await connectDB(); // Ensure you're connected to the database

        const userId = await getDataFromToken(request); // Get user ID from token if authenticated
        const { leaveTypeId } = params; // Get the leaveTypeId from the URL params

        // Fetch the user leave balances and populate leave type references
        const user = await User.findById(userId).populate('leaveBalances.leaveType');

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' });
        }

        // Find the user's balance for the specific leave type
        const leaveBalance = user.leaveBalances.find(
            (balance) => String(balance?.leaveType?._id) === String(leaveTypeId)
        );

        if (!leaveBalance || !leaveBalance.leaveType) {
            return NextResponse.json({ success: false, message: 'No leave balance found for this leave type' });
        }

        // Fetch the total allotted leaves from the LeaveType model
        const leaveType = await LeaveType.findById(leaveTypeId);

        if (!leaveType) {
            return NextResponse.json({ success: false, message: 'Leave type not found' });
        }

        // Return both the leave balance and total allotted leaves
        return NextResponse.json({
            success: true,
            data: {
                leaveType: leaveType.leaveType,
                allotedLeaves: leaveType.allotedLeaves, // Total leaves allotted for this leave type
                userLeaveBalance: leaveBalance.balance, // User's remaining leave balance
            },
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message });
    }
}

