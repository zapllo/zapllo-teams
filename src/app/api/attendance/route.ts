import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoginEntry from '@/models/loginEntryModel';
import Leave from '@/models/leaveModel';
import Holiday from '@/models/holidayModel';
import User, { IUser } from '@/models/userModel';
import { getDataFromToken } from '@/helper/getDataFromToken';
import { eachDayOfInterval, isWeekend, startOfMonth, endOfMonth } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    await connectDB();

    // Get logged-in user
    const userId = await getDataFromToken(req);
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get the user details
    const loggedInUser = await User.findById(userId);
    if (!loggedInUser || !loggedInUser.organization) {
        return NextResponse.json({ message: 'User not found or no organization found' }, { status: 404 });
    }

    const { role } = loggedInUser;
    const searchParams = req.nextUrl.searchParams;
    const date = searchParams.get('date'); // Expecting format like "2024-09"

    if (!date || !/^\d{4}-\d{2}$/.test(date)) {
        return NextResponse.json({ message: 'Invalid date format' }, { status: 400 });
    }

    try {
        // Construct start and end of the month
        const startDate = new Date(`${date}-01T00:00:00Z`);
        const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

        const allDays = eachDayOfInterval({ start: startDate, end: new Date(endDate.getTime() - 1) });

        // Fetch holidays for the month
        const holidays = await Holiday.find({
            organization: loggedInUser.organization,
            holidayDate: {
                $gte: startDate,
                $lt: endDate,
            },
        }).lean();

        // Map holidays for quick lookup
        const holidayDates = new Set(holidays.map((holiday) => holiday.holidayDate.toISOString().split('T')[0]));

        if (role === 'member') {
            // Fetch data for the logged-in user only
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

            const report = allDays.map((day) => {
                const dayString = day.toISOString().split('T')[0];
                const isHoliday = holidayDates.has(dayString);
                const isPresent = loginEntries.some(
                    (entry) => new Date(entry.timestamp).toISOString().split('T')[0] === dayString
                );
                const isOnLeave = leaveEntries.some(
                    (leave) =>
                        new Date(leave.fromDate) <= day &&
                        new Date(leave.toDate) >= day
                );

                return {
                    date: dayString,
                    day: day.toLocaleDateString('en-US', { weekday: 'short' }),
                    present: isPresent ? 1 : 0,
                    leave: isOnLeave ? 1 : 0,
                    absent: !isPresent && !isOnLeave && !isHoliday ? 1 : 0,
                    holiday: isHoliday ? 1 : 0,
                    total: 1,
                };
            });

            return NextResponse.json({
                monthlyReport: report,
                leaves: leaveEntries,
                holidays,
            });
        } else if (role === 'orgAdmin' || role === 'manager') {
            // Fetch data for all users in the organization
            const orgUsers = await User.find({ organization: loggedInUser.organization }).select('_id');
            const orgUserIds = orgUsers.map((user) => user._id);

            const loginEntries = await LoginEntry.find({
                userId: { $in: orgUserIds },
                timestamp: {
                    $gte: startDate,
                    $lt: endDate,
                },
            }).lean();

            const leaveEntries = await Leave.find({
                user: { $in: orgUserIds },
                status: 'Approved',
                $or: [
                    { fromDate: { $gte: startDate, $lt: endDate } },
                    { toDate: { $gte: startDate, $lt: endDate } },
                    { fromDate: { $lt: startDate }, toDate: { $gte: endDate } },
                ],
            }).lean();

            const report = allDays.map((day) => {
                const dayString = day.toISOString().split('T')[0];
                const isHoliday = holidayDates.has(dayString);

                const usersPresent = new Set();
                const usersOnLeave = new Set();

                // Calculate present and leave counts
                loginEntries.forEach((entry) => {
                    if (new Date(entry.timestamp).toISOString().split('T')[0] === dayString) {
                        usersPresent.add(entry.userId.toString());
                    }
                });

                leaveEntries.forEach((leave) => {
                    if (new Date(leave.fromDate) <= day && new Date(leave.toDate) >= day) {
                        usersOnLeave.add(leave.user.toString());
                    }
                });

                const presentCount = usersPresent.size;
                const leaveCount = usersOnLeave.size;
                const totalEmployees = orgUserIds.length;
                const absentCount = totalEmployees - presentCount - leaveCount;

                return {
                    date: dayString,
                    day: day.toLocaleDateString('en-US', { weekday: 'short' }),
                    present: presentCount,
                    leave: leaveCount,
                    absent: absentCount,
                    holiday: isHoliday ? totalEmployees : 0,
                    total: totalEmployees,
                };
            });

            return NextResponse.json({
                monthlyReport: report,
                leaves: leaveEntries,
                holidays,
            });
        } else {
            return NextResponse.json({ message: 'Access denied' }, { status: 403 });
        }
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        return NextResponse.json({ message: 'Error fetching attendance data' }, { status: 500 });
    }
}

