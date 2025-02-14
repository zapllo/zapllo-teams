// app/api/organization/login-logout-time/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Organization from '@/models/organizationModel'
import connectDB from '@/lib/db'
import User from '@/models/userModel'
import { getDataFromToken } from '@/helper/getDataFromToken'

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { loginTime, logoutTime } = await req.json()
        const userId = await getDataFromToken(req);

        // Fetch the user to check role and organization
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' });
        }

        // Check if the user is an orgAdmin
        if (user.role !== 'orgAdmin') {
            return NextResponse.json({ success: false, error: 'Not authorized to view this resource' });
        }

        // Fetch all leaves for users in the same organization
        const organizationId = user.organization;

        if (!organizationId || !loginTime || !logoutTime) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            )
        }

        const updatedOrg = await Organization.findByIdAndUpdate(
            organizationId,
            { loginTime, logoutTime },
            { new: true }
        )

        if (!updatedOrg) {
            return NextResponse.json(
                { success: false, message: 'Organization not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, organization: updatedOrg }, { status: 200 })
    } catch (error) {
        console.error('Error updating login/logout time:', error)
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
