import { NextRequest, NextResponse } from 'next/server';
import Organization from '@/models/organizationModel';
import connectDB from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { organizationId, subscribedUserCount, additionalUserCount } = await req.json();

        if (!organizationId) {
            return NextResponse.json({ success: false, message: 'Organization ID is required.' }, { status: 400 });
        }

        await Organization.updateOne(
            { _id: organizationId },
            {
                $set: { subscribedUserCount },
                $inc: { additionalUserCount: additionalUserCount || 0 },
            }
        );

        return NextResponse.json({ success: true, message: 'User count updated successfully.' });
    } catch (error) {
        console.error('Error updating user count:', error);
        return NextResponse.json({ success: false, message: 'Error updating user count.' }, { status: 500 });
    }
}
