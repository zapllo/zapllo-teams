import LoginEntry from '@/models/loginEntryModel';
import Leave from '@/models/leaveModel';
import User from '@/models/userModel';  // Assuming you have this model defined
import { NextRequest, NextResponse } from 'next/server';
import { startOfMonth, endOfMonth } from 'date-fns';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { getDataFromToken } from '@/helper/getDataFromToken'; // Assuming this function extracts user data from token

export const dynamic = 'force-dynamic'; // Add this line

export async function POST(request: NextRequest) {
    await connectDB();

    // Extract the user ID from the token (using the helper function)
    const userId = await getDataFromToken(request);
    if (!userId) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Find the logged-in user and their organization
    const loggedInUser = await User.findById(userId).select('organization');
    if (!loggedInUser || !loggedInUser.organization) {
        return NextResponse.json({ success: false, message: 'User organization not found' }, { status: 404 });
    }

    // Get the organization ID from the logged-in user's profile
    const userOrganization = loggedInUser.organization;

    // Parse request body for period and managerId
    const { period, managerId } = await request.json();

    let startDate, endDate;

    if (period === 'thisMonth') {
        startDate = startOfMonth(new Date());
        endDate = endOfMonth(new Date());
    } else {
        startDate = new Date(period.start);
        endDate = new Date(period.end);
    }

    try {
        // Fetch users from the same organization as the logged-in user
        const organizationUsers = await User.find({ organization: userOrganization }).select('_id');

        // Extract user IDs
        const organizationUserIds = organizationUsers.map(user => user._id);

        // Login entries aggregation
        const loginEntries = await LoginEntry.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate, $lte: endDate },
                    userId: { $in: organizationUserIds } // Filter by users in the same organization
                }
            },
            {
                $group: {
                    _id: '$userId',
                    present: { $sum: { $cond: [{ $eq: ['$action', 'login'] }, 1, 0] } },
                    absent: { $sum: { $cond: [{ $eq: ['$action', 'logout'] }, 1, 0] } }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user.reportingManager',
                    foreignField: '_id',
                    as: 'reportingManager'
                }
            },
            {
                $unwind: {
                    path: '$reportingManager',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                // If managerId is provided, filter users by the selected managerId
                $match: managerId ? { 'user.reportingManager': new mongoose.Types.ObjectId(managerId) } : {}
            },
            {
                $project: {
                    'user.firstName': 1,
                    'user.lastName': 1,
                    'present': 1,
                    'absent': 1,
                    'reportingManager.firstName': 1,
                    'reportingManager.lastName': 1
                }
            }
        ]);

        // Leave entries aggregation
        const leaves = await Leave.aggregate([
            {
                $match: {
                    fromDate: { $gte: startDate },
                    toDate: { $lte: endDate },
                    user: { $in: organizationUserIds } // Filter by users in the same organization
                }
            },
            {
                $group: {
                    _id: '$user',
                    leaveCount: { $sum: 1 }
                }
            }
        ]);

        // Combine present, absent, and leave counts
        const report = loginEntries.map(entry => {
            const leave = leaves.find(l => l._id.equals(entry._id));
            return {
                user: `${entry.user.firstName} ${entry.user.lastName}`,
                present: entry.present,
                absent: entry.absent,
                leave: leave ? leave.leaveCount : 0,
                reportingManager: entry.reportingManager
                    ? `${entry.reportingManager.firstName} ${entry.reportingManager.lastName}`
                    : 'N/A'
            };
        });

        return NextResponse.json({ report }, { status: 200 });
    } catch (error) {
        console.error('Error fetching cumulative report:', error);
        return NextResponse.json({ message: 'Error fetching cumulative report', error }, { status: 500 });
    }
}
