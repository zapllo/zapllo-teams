export const dynamic = 'force-dynamic'; // Add this line at the top
import { NextRequest, NextResponse } from 'next/server';
import Leave from '@/models/leaveModel';
import User from '@/models/userModel';
import { getDataFromToken } from '@/helper/getDataFromToken';

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);

        // Fetch the user to check role and organization
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' });
        }

        // Check if the user is an orgAdmin
        if (user.role !== 'orgAdmin') {
            return NextResponse.json({ success: false, error: 'Not authorized to view this resource' });
        }

        // Fetch all leaves for users in the same organization
        const organizationId = user.organization;

        // First populate 'user' and their reporting manager, then filter leaves by the organization of the user
        const leaves = await Leave.find({})
            .populate({
                path: 'user',
                match: { organization: organizationId }, // Filter users by organization
                select: 'firstName lastName organization reportingManager', // Select necessary fields
                populate: {
                    path: 'reportingManager', // Populate reporting manager details
                    select: 'firstName lastName' // Select firstName and lastName of the reporting manager
                }
            })
            .populate('leaveType', 'leaveType') // Populate leaveType details
            .populate({
                path: 'approvedBy rejectedBy', // Populate both approvedBy and rejectedBy
                select: 'firstName lastName',  // Select firstName and lastName
            }).sort({ createdAt: -1 }) // Sort by createdAt in descending order (latest entries first)
            .exec();

        // Filter out any leaves where the user doesn't match the organization
        const filteredLeaves = leaves.filter((leave) => leave.user);

        if (!filteredLeaves || filteredLeaves.length === 0) {
            return NextResponse.json({ success: false, error: 'No leaves found' });
        }

        return NextResponse.json({ success: true, leaves: filteredLeaves });
    } catch (error: any) {
        console.error('Error fetching leaves: ', error.message);
        return NextResponse.json({ success: false, error: error.message });
    }
}
