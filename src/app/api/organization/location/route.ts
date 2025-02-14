// app/api/organization/location/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Organization from '@/models/organizationModel';
import connectDB from '@/lib/db';
import User from '@/models/userModel';
import { getDataFromToken } from '@/helper/getDataFromToken';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { location, allowGeofencing, geofenceInput, unit } = await req.json();
        // Convert the input to meters if necessary (assume unit is either "km" or "m")
        const geofenceRadius = unit === "km" ? Number(geofenceInput) * 1000 : Number(geofenceInput);

        const userId = await getDataFromToken(req);

        // Verify the user and organization
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        if (user.role !== 'orgAdmin') {
            return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
        }
        const organizationId = user.organization;
        if (!organizationId || !location) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const updatedOrg = await Organization.findByIdAndUpdate(
            organizationId,
            { location, allowGeofencing, geofenceRadius },
            { new: true }
        );

        if (!updatedOrg) {
            return NextResponse.json({ success: false, message: 'Organization not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, organization: updatedOrg }, { status: 200 });
    } catch (error) {
        console.error('Error updating organization location/geofencing:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
