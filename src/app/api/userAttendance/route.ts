import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoginEntry from '@/models/loginEntryModel';
import Leave from '@/models/leaveModel';
import Holiday from '@/models/holidayModel';
import User from '@/models/userModel';
import { getDataFromToken } from '@/helper/getDataFromToken';
import { eachDayOfInterval, isWeekend, startOfMonth, endOfMonth } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    await connectDB();

    const userId = await getDataFromToken(req);
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const loggedInUser = await User.findById(userId);
    if (!loggedInUser || !loggedInUser.organization) {
        return NextResponse.json({ message: 'User not found or no organization found' }, { status: 404 });
    }

    const searchParams = req.nextUrl.searchParams;
    const date = searchParams.get('date');

    if (!date || !/^\d{4}-\d{2}$/.test(date)) {
        return NextResponse.json({ message: 'Invalid date format' }, { status: 400 });
    }

    try {
        const startDate = new Date(`${date}-01T00:00:00Z`);
        const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
        const allDays = eachDayOfInterval({ start: startDate, end: new Date(endDate.getTime() - 1) });

        const loginEntries = await LoginEntry.find({
            userId,
            timestamp: {
                $gte: startDate,
                $lt: endDate,
            },
        }).lean();

        const leaveEntries = await Leave.find({
            user: userId,
            status: 'Approved',
            $or: [
                { fromDate: { $gte: startDate, $lt: endDate } },
                { toDate: { $gte: startDate, $lt: endDate } },
                { fromDate: { $lt: startDate }, toDate: { $gte: endDate } },
            ],
        }).lean();

        console.log(leaveEntries, 'leave entries');

        const holidays = await Holiday.find({
            organization: loggedInUser.organization,
            holidayDate: {
                $gte: startDate,
                $lt: endDate,
            },
        }).lean();

        const holidayDates = new Set(holidays.map(holiday => holiday.holidayDate.toISOString().split('T')[0]));

        const report = allDays.map(day => {
            const dayString = day.toISOString().split('T')[0];
            const isHoliday = holidayDates.has(dayString);

            const isPresent = loginEntries.some(entry => new Date(entry.timestamp).toISOString().split('T')[0] === dayString);


            // Check if the day falls within any approved leave interval
            const isOnLeave = leaveEntries.some(leave => {
                const fromDate = new Date(leave.fromDate);
                const toDate = new Date(leave.toDate);
                return day >= fromDate && day <= toDate;
            });

            return {
                date: dayString,
                day: day.toLocaleDateString('en-US', { weekday: 'short' }),
                present: isPresent,
                leave: isOnLeave,
                holiday: isHoliday,
            };
        });

        // console.log(report, 'report for the user')

        return NextResponse.json({ monthlyReport: report });
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        return NextResponse.json({ message: 'Error fetching attendance data' }, { status: 500 });
    }
}
