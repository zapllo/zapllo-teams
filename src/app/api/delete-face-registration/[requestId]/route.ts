import { NextRequest, NextResponse } from 'next/server';
import FaceRegistrationRequest from '@/models/faceRegistrationRequest';
import connectDB from '@/lib/db'; // Utility function for MongoDB connection

// DELETE: Delete face registration request
export async function DELETE(req: NextRequest, { params }: { params: { requestId: string } }) {
    try {
        await connectDB(); // Ensure you're connected to the database

        const { requestId } = params;

        // Find the face registration request by its ID
        const registrationRequest = await FaceRegistrationRequest.findById(requestId);
        if (!registrationRequest) {
            return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
        }

        // Delete the face registration request
        await FaceRegistrationRequest.findByIdAndDelete(requestId);

        return NextResponse.json({ success: true, message: 'Face registration request deleted successfully.' });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
