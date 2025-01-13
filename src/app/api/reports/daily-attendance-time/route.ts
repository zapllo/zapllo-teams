import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import { getDataFromToken } from '@/helper/getDataFromToken';

export async function GET(request: NextRequest) {
    const managerId = await getDataFromToken(request); // Get logged-in manager's ID
    if (!managerId) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const manager = await User.findById(managerId);
        if (!manager) {
            return NextResponse.json({ success: false, message: 'Manager not found' }, { status: 404 });
        }

        const reportTime = manager.reminders.dailyAttendanceReportTime;

        return NextResponse.json({ success: true, dailyAttendanceReportTime: reportTime }, { status: 200 });
    } catch (error) {
        console.error('Error fetching report time:', error);
        return NextResponse.json({ success: false, message: 'Error fetching report time' }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    const managerId = await getDataFromToken(request); // Get logged-in manager's ID
    if (!managerId) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { newReportTime } = await request.json(); // Get the new report time from the request body
        const manager = await User.findById(managerId);
        if (!manager) {
            return NextResponse.json({ success: false, message: 'Manager not found' }, { status: 404 });
        }

        // Update the report time
        manager.reminders.dailyAttendanceReportTime = newReportTime;
        await manager.save();

        return NextResponse.json({ success: true, message: 'Report time updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating report time:', error);
        return NextResponse.json({ success: false, message: 'Error updating report time' }, { status: 500 });
    }
}