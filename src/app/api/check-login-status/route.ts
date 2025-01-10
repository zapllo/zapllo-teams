export const dynamic = 'force-dynamic'; // Add this line
import { NextRequest, NextResponse } from 'next/server';
import LoginEntry from '@/models/loginEntryModel'; // Import LoginEntry model
import FaceRegistrationRequest from '@/models/faceRegistrationRequest'; // Import FaceRegistrationRequest model
import { getDataFromToken } from '@/helper/getDataFromToken'; // Extract userId from token

export async function GET(request: NextRequest) {
    try {
        // Extract userId from token
        const userId = await getDataFromToken(request);

        // Fetch the latest login entry for the user
        const lastEntry = await LoginEntry.findOne({ userId }).sort({ timestamp: -1 }).exec();

        // Check if the user has any approved face registration requests
        const hasApprovedFaceRegistration = await FaceRegistrationRequest.exists({ userId, status: 'approved' });

        // If no login history, return logged out status and check for face registration
        if (!lastEntry) {
            return NextResponse.json({
                success: true,
                isLoggedIn: false,
                hasRegisteredFaces: Boolean(hasApprovedFaceRegistration),
                message: 'No login history found'
            });
        }

        // Check if the last action was 'login'
        const isLoggedIn = lastEntry.action === 'login';

        return NextResponse.json({
            success: true,
            isLoggedIn,
            hasRegisteredFaces: Boolean(hasApprovedFaceRegistration)
        });
    } catch (error) {
        console.error('Error fetching login status:', error);
        return NextResponse.json({ success: false, error: 'Server error' });
    }
}
