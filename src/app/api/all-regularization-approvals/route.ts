import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoginEntry from '@/models/loginEntryModel';
import User from '@/models/userModel';
import { getDataFromToken } from '@/helper/getDataFromToken'; // Your custom token extraction function

export const dynamic = 'force-dynamic'; // Add this line

export async function GET(request: NextRequest) {
    try {
        // Extract manager's userId from the token
        const managerId = await getDataFromToken(request);

        if (!managerId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to the database
        await connectDB();

        // Fetch the manager's data to get the organization
        const manager = await User.findById(managerId).select('organization');
        if (!manager || !manager.organization) {
            return NextResponse.json(
                { success: false, message: 'Manager or organization not found' },
                { status: 404 }
            );
        }

        // Fetch users from the same organization as the manager
        const organizationUsers = await User.find({ organization: manager.organization }).select('_id');

        // Extract user IDs from the organization
        const organizationUserIds = organizationUsers.map(user => user._id);

        // Fetch regularization entries that are pending approval for users in the same organization
        const pendingRegularizations = await LoginEntry.find({
            userId: { $in: organizationUserIds },
            action: 'regularization',
        })
            .populate('userId', 'firstName lastName email reportingManager') // Populate user and reporting manager fields
            .populate({
                path: 'userId',
                select: 'firstName lastName email reportingManager',
                populate: {
                    path: 'reportingManager',
                    model: 'users', // Ensure the correct model is populated
                    select: 'firstName lastName', // Select firstName and lastName only
                },
            });

        // Respond with success and the pending regularizations data
        return NextResponse.json(
            { success: true, regularizations: pendingRegularizations },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error fetching regularization approvals:', error);
        return NextResponse.json(
            { success: false, message: 'Server Error' },
            { status: 500 }
        );
    }
}
