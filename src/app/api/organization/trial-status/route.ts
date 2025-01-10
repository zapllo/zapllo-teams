// pages/api/organizations/trial-status.ts
import connectDB from '@/lib/db';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helper/getDataFromToken';

connectDB();

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);

        // Fetch user and populate organization
        const user = await User.findById(userId).populate('organization').exec();

        if (!user) {
            throw new Error('User not found');
        }

        // Use a static value for trialExpires
        const staticTrialExpires = new Date('2028-12-31'); // Replace with your desired static date
        const currentDate = new Date();

        return NextResponse.json({
            isExpired: staticTrialExpires < currentDate
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
