import { NextRequest, NextResponse } from 'next/server';
import FaceRegistrationRequest from '@/models/faceRegistrationRequest';
import { getDataFromToken } from '@/helper/getDataFromToken';
import connectDB from '@/lib/db';
export const dynamic = 'force-dynamic'; // Add this line


export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const userId = await getDataFromToken(request);

        // Check if there's an approved face registration request for the user
        const faceRegistration = await FaceRegistrationRequest.findOne({
            userId,
            status: 'approved',
        });

        if (faceRegistration) {
            return NextResponse.json({ success: true, isFaceRegistered: true });
        }

        return NextResponse.json({ success: true, isFaceRegistered: false });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
