import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import { getDataFromToken } from '@/helper/getDataFromToken';
import connectDB from '@/lib/db';

connectDB();

export async function POST(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const body = await request.json();
        const { userIdToUpdate, leaveBalances } = body;  // Get the userId and leaveBalances from the request

        // Fetch the orgAdmin user to check their organization
        const orgAdmin = await User.findById(userId);
        if (!orgAdmin || orgAdmin.role !== 'orgAdmin') {
            return NextResponse.json({ success: false, error: 'Not authorized to update leave balances' });
        }

        // Fetch the user whose leave balance is being updated
        const userToUpdate = await User.findById(userIdToUpdate);
        if (!userToUpdate || String(userToUpdate.organization) !== String(orgAdmin.organization)) {
            return NextResponse.json({ success: false, error: 'User not found or not in the same organization' });
        }

        // Update leave balances
        userToUpdate.leaveBalances = leaveBalances;
        await userToUpdate.save();

        return NextResponse.json({ success: true, message: 'Leave balance updated successfully' });
    } catch (error: any) {
        console.error('Error updating leave balance:', error);
        return NextResponse.json({ success: false, error: error.message });
    }
}
