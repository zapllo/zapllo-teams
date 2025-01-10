import { NextResponse } from 'next/server';
import Organization from '@/models/organizationModel';
import User from '@/models/userModel';
import connectDB from '@/lib/db'; // Assuming you have a DB connection helper

export async function GET() {
    try {
        await connectDB();
        // Find all organizations and populate their orgAdmin
        const organizations = await Organization.find({})
            .populate({
                path: 'users', // Ensure this is the correct field to populate
                select: 'firstName lastName email whatsappNo role',
            })
            .lean();

        console.log(organizations, 'what?')
        // Send the response with the populated organizations
        return NextResponse.json(organizations);
    } catch (error) {
        console.error('Error fetching organizations:', error);
        return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
    }
}
