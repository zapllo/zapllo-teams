import { NextRequest, NextResponse } from 'next/server';
import FaceRegistrationRequest from '@/models/faceRegistrationRequest';
import User from '@/models/userModel'; // Assuming you have the User model
import connectDB from '@/lib/db'; // Utility function for MongoDB connection

export const dynamic = 'force-dynamic'; // Add this line

// POST: Approve or reject face registration request
export async function POST(req: NextRequest, { params }: { params: { requestId: string } }) {
    try {
        await connectDB(); // Ensure you're connected to the database

        const { requestId } = params;
        const { status } = await req.json(); // Get the status from the request body

        // Validate status
        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
        }

        // Find the pending face registration request
        const registrationRequest = await FaceRegistrationRequest.findById(requestId);
        if (!registrationRequest) {
            return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
        }

        // Check if the request is already processed
        if (registrationRequest.status !== 'pending') {
            return NextResponse.json({ success: false, message: 'Request is already processed' }, { status: 400 });
        }

        // Find the user associated with the request
        const user = await User.findById(registrationRequest.userId);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Update the request status (either approved or rejected)
        registrationRequest.status = status;
        await registrationRequest.save();

        return NextResponse.json({ success: true, message: `Face registration ${status}.` });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
