import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import { getDataFromToken } from '@/helper/getDataFromToken';
import connectDB from '@/lib/db';

connectDB();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);

        // Fetch the user to check their organization
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' });
        }

        // Check if the user is an orgAdmin
        if (user.role !== 'orgAdmin') {
            return NextResponse.json({ success: false, error: 'Not authorized to view this resource' });
        }

        // Fetch all users in the same organization
        const organizationId = user.organization;
        const users = await User.find({ organization: organizationId })
            .populate('leaveBalances.leaveType', 'leaveType')  // Populate leave type
            .select('firstName lastName leaveBalances');  // Select relevant fields

        return NextResponse.json({ success: true, users });
    } catch (error: any) {
        console.error('Error fetching users with leave balances:', error);
        return NextResponse.json({ success: false, error: error.message });
    }
}
