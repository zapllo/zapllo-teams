import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoginEntry from '@/models/loginEntryModel';
import User from '@/models/userModel';
import { getDataFromToken } from '@/helper/getDataFromToken'; // Your custom token extraction function

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

        // Fetch login and logout entries for users in the same organization
        const loginLogoutEntries = await LoginEntry.find({
            userId: { $in: organizationUserIds },
            action: { $in: ['login', 'logout'] }, // Filter for login and logout actions
        })
            .populate('userId', 'firstName lastName email') // Populate user details if needed
            .sort({ timestamp: -1 }); // Sort by timestamp (most recent first)

        return NextResponse.json(
            { success: true, entries: loginLogoutEntries },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error fetching login/logout entries:', error);
        return NextResponse.json(
            { success: false, message: 'Server Error' },
            { status: 500 }
        );
    }
}
