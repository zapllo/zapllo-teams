import { NextRequest, NextResponse } from 'next/server';
import Organization from '@/models/organizationModel';
import connectDB from '@/lib/db';
import { getDataFromToken } from '@/helper/getDataFromToken';
import User from '@/models/userModel';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Get user ID from the token
        const userId = await getDataFromToken(req);

        // Find the authenticated user and their organization
        const authenticatedUser = await User.findById(userId).select("-password");
        if (!authenticatedUser || !authenticatedUser.organization) {
            return NextResponse.json({ error: "User or organization not found" }, { status: 404 });
        }

        const organizationId = authenticatedUser.organization;

        const { product, trialExpires } = await req.json();
        if (!product || !trialExpires) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let update = {};
        if (product === 'leaves' || product === "attendance") {
            update = { leavesTrialExpires: trialExpires, attendanceTrialExpires: trialExpires };
        } else {
            return NextResponse.json({ error: 'Invalid product specified' }, { status: 400 });
        }

        const organization = await Organization.findByIdAndUpdate(organizationId, update, { new: true });

        if (!organization) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Trial started successfully', organization }, { status: 200 });
    } catch (error) {
        console.error('Error starting trial:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
