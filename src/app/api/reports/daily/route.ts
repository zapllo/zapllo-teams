import connectDB from '@/lib/db';
import LoginEntry from '@/models/loginEntryModel';
import Leave from '@/models/leaveModel';
import User, { IUser } from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helper/getDataFromToken';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  await connectDB();

  const userId = await getDataFromToken(request);
  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  // Get the logged-in user's organization and role
  const loggedInUser = await User.findById(userId).select('organization role');
  if (!loggedInUser || !loggedInUser.organization) {
    return NextResponse.json({ success: false, message: 'User organization not found' }, { status: 404 });
  }

  const { date, employeeId, managerId } = await request.json();
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    let queryFilter: { [key: string]: any };

    if (loggedInUser.role === 'manager') {
      // For managers, include only the manager and their direct reports
      queryFilter = {
        organization: loggedInUser.organization,
        $or: [
          { _id: loggedInUser._id }, // The manager himself
          { reportingManager: loggedInUser._id }, // Employees reporting to the manager
        ],
      };
    } else {
      // For orgAdmin or other roles, include all users in the organization
      queryFilter = { organization: loggedInUser.organization };

      if (employeeId) {
        queryFilter._id = new mongoose.Types.ObjectId(employeeId);
      } else if (managerId) {
        queryFilter.reportingManager = new mongoose.Types.ObjectId(managerId);
      }
    }

    console.log('Fetching organization users with filter:', queryFilter);
    const organizationUsers = await User.find(queryFilter).select('_id firstName lastName');
    console.log('Fetched organization users:', organizationUsers);

    const organizationUserIds = organizationUsers.map((user) => user._id.toString());

    console.log('Fetching login entries for user IDs:', organizationUserIds);
    const loginEntries = await LoginEntry.find({
      userId: { $in: organizationUserIds },
      timestamp: { $gte: startOfDay, $lte: endOfDay },
    }).populate<{ userId: IUser }>('userId', 'firstName lastName');
    console.log('Fetched login entries:', loginEntries);

    console.log('Fetching leave entries for user IDs:', organizationUserIds);
    const leaveEntries = await Leave.find({
      user: { $in: organizationUserIds },
      'leaveDays.date': { $gte: startOfDay, $lte: endOfDay },
      status: 'Approved',
    }).populate<{ user: IUser }>('user', 'firstName lastName');
    console.log('Fetched leave entries:', leaveEntries);

    const usersOnLeave = new Set(leaveEntries.map((leave) => (leave.user as IUser)._id.toString()));

    const usersWithLoginEntries = new Map<string, any>();
    loginEntries.forEach((entry) => {
      const userId = entry.userId._id.toString();
      const loginTime = entry.action === 'login' ? entry.loginTime : null;
      const logoutTime = entry.action === 'logout' ? entry.logoutTime : null;

      if (!usersWithLoginEntries.has(userId)) {
        usersWithLoginEntries.set(userId, {
          user: `${entry.userId.firstName} ${entry.userId.lastName}`,
          loginTimes: [],
          logoutTimes: [],
          regularization: null,
        });
      }

      const userLog = usersWithLoginEntries.get(userId);

      if (entry.action === 'regularization' && entry.approvalStatus === 'Approved') {
        const loginTime = parseTimeOnDate(date, entry.loginTime || '');  // Use an empty string if undefined
        const logoutTime = parseTimeOnDate(date, entry.logoutTime || '');
        userLog.regularization = {
          loginTime: loginTime || 'N/A',
          logoutTime: logoutTime || 'N/A',
          status: 'Present',
        };
      }

      if (loginTime) userLog.loginTimes.push(loginTime);
      if (logoutTime) userLog.logoutTimes.push(logoutTime);
    });

    const report = organizationUsers.map((user) => {
      const userId = user._id.toString();

      if (usersOnLeave.has(userId)) {
        return {
          user: `${user.firstName} ${user.lastName}`,
          status: 'On Leave',
          loginTime: 'N/A',
          logoutTime: 'N/A',
          totalDuration: 'N/A',
        };
      }

      if (usersWithLoginEntries.has(userId)) {
        const userLog = usersWithLoginEntries.get(userId);

        if (userLog.regularization) {
          const { loginTime, logoutTime } = userLog.regularization;
          return {
            user: userLog.user,
            status: 'Present',
            loginTime,
            logoutTime,
            totalDuration: calculateDuration(new Date(loginTime), new Date(logoutTime)),
          };
        }

        const firstLoginTime = userLog.loginTimes[0] || 'N/A';
        const lastLogoutTime = userLog.logoutTimes[userLog.logoutTimes.length - 1] || 'N/A';
        const totalDuration =
          firstLoginTime !== 'N/A' && lastLogoutTime !== 'N/A'
            ? calculateDuration(new Date(firstLoginTime), new Date(lastLogoutTime))
            : 'N/A';

        return {
          user: userLog.user,
          status: 'Present',
          loginTime: firstLoginTime,
          logoutTime: lastLogoutTime,
          totalDuration,
        };
      }

      return {
        user: `${user.firstName} ${user.lastName}`,
        status: 'Absent',
        loginTime: 'N/A',
        logoutTime: 'N/A',
        totalDuration: 'N/A',
      };
    });

    return NextResponse.json({ report }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching report:', error); // Log the full error object in the console
    return NextResponse.json({ message: 'Error fetching report', error: error.message || 'Unknown error' }, { status: 500 });
  }
}

// Helper function to parse HH:mm on a specific date
function parseTimeOnDate(date: string, time: string): string | null {
  if (!time) return null;
  const [hours, minutes] = time.split(':').map(Number);
  const parsedDate = new Date(date);
  parsedDate.setHours(hours, minutes, 0, 0);
  return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
}

function calculateDuration(loginTime: any, logoutTime: any): string {
  if (!(loginTime instanceof Date) || isNaN(loginTime.getTime()) ||
    !(logoutTime instanceof Date) || isNaN(logoutTime.getTime())) {
    return 'N/A';
  }

  const diffInMs = logoutTime.getTime() - loginTime.getTime();
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}
