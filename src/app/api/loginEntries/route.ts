export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import LoginEntry from '@/models/loginEntryModel';
import { getDataFromToken } from '@/helper/getDataFromToken';
import { IUser } from '@/models/userModel';

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);

        // Fetch all login entries for the user, populate `userId` and `reportingManager`
        const entries = await LoginEntry.find({ userId })
            .populate({
                path: 'userId',
                select: 'firstName lastName reportingManager',
                populate: {
                    path: 'reportingManager',
                    select: 'firstName lastName',
                },
            })
            .sort({ createdAt: -1 })
            .exec();

        // Populate `approvedBy` only for entries with action 'regularization'
        const populatedEntries = await Promise.all(entries.map(async (entry) => {
            if (entry.action === 'regularization') {
                await entry.populate({ path: 'approvedBy', select: 'firstName lastName' });
            }
            return entry;
        }));

        // Format entries to ensure timestamp is in ISO and populate necessary fields
        const formattedEntries = populatedEntries.map((entry) => {
            const populatedUser = entry.userId as IUser;
            return {
                ...entry.toObject(),
                timestamp: new Date(entry.timestamp).toISOString(),
                userId: {
                    firstName: populatedUser.firstName,
                    lastName: populatedUser.lastName,
                    reportingManager: populatedUser.reportingManager
                        ? {
                              firstName: (populatedUser.reportingManager as unknown as IUser).firstName,
                              lastName: (populatedUser.reportingManager as unknown as IUser).lastName,
                          }
                        : null,
                },
                approvedBy: entry.approvedBy
                    ? {
                          firstName: (entry.approvedBy as IUser).firstName,
                          lastName: (entry.approvedBy as IUser).lastName,
                      }
                    : null,
            };
        });

        return NextResponse.json({ success: true, entries: formattedEntries });
    } catch (error) {
        console.error('Error fetching entries:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch entries' });
    }
}
