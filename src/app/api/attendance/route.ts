import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoginEntry from '@/models/loginEntryModel';
import Leave from '@/models/leaveModel';
import Holiday from '@/models/holidayModel';
import User from '@/models/userModel';
import { getDataFromToken } from '@/helper/getDataFromToken';
import { parse, format, eachDayOfInterval, isWeekend } from 'date-fns';

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
    // Parse startDate as a local date using date-fns
    const startDate = parse(`${date}-01`, 'yyyy-MM-dd', new Date());
    // Set endDate to the last moment of the month (local time)
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

    // Generate all days in the interval (local dates)
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Fetch holidays for the month
    const holidays = await Holiday.find({
      organization: loggedInUser.organization,
      holidayDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).lean();

    // Create a set of holiday dates in 'yyyy-MM-dd' format
    const holidayDates = new Set(
      holidays.map((holiday) =>
        format(new Date(holiday.holidayDate), 'yyyy-MM-dd')
      )
    );

    if (role === 'member') {
      // Fetch data for the logged-in user only
      const loginEntries = await LoginEntry.find({
        userId,
        timestamp: {
          $gte: startDate,
          $lte: endDate,
        },
      }).lean();

      const leaveEntries = await Leave.find({
        user: userId,
        status: 'Approved',
        $or: [
          { fromDate: { $gte: startDate, $lte: endDate } },
          { toDate: { $gte: startDate, $lte: endDate } },
          { fromDate: { $lt: startDate }, toDate: { $gte: endDate } },
        ],
      }).lean();

      const report = allDays.map((day) => {
        // Use format to produce a consistent date string
        const dayString = format(day, 'yyyy-MM-dd');
        const isHoliday = holidayDates.has(dayString);
        const isPresent = loginEntries.some(
          (entry) => format(new Date(entry.timestamp), 'yyyy-MM-dd') === dayString
        );
        const isOnLeave = leaveEntries.some(
          (leave) =>
            new Date(leave.fromDate) <= day &&
            new Date(leave.toDate) >= day
        );

        return {
          date: dayString,
          day: format(day, 'EEE'), // Abbreviated weekday name
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
          $lte: endDate,
        },
      }).lean();

      const leaveEntries = await Leave.find({
        user: { $in: orgUserIds },
        status: 'Approved',
        $or: [
          { fromDate: { $gte: startDate, $lte: endDate } },
          { toDate: { $gte: startDate, $lte: endDate } },
          { fromDate: { $lt: startDate }, toDate: { $gte: endDate } },
        ],
      }).lean();

      const report = allDays.map((day) => {
        const dayString = format(day, 'yyyy-MM-dd');
        const isHoliday = holidayDates.has(dayString);

        const usersPresent = new Set();
        const usersOnLeave = new Set();

        // Calculate present and leave counts
        loginEntries.forEach((entry) => {
          if (format(new Date(entry.timestamp), 'yyyy-MM-dd') === dayString) {
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
          day: format(day, 'EEE'),
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
