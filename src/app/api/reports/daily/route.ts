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

    // Build a set of user IDs that are on leave.
    const usersOnLeave = new Set(leaveEntries.map((leave) => (leave.user as IUser)._id.toString()));

    // Build a map of all login entries for each user (including break events).
    const userEntriesMap = new Map<string, any[]>();
    loginEntries.forEach((entry) => {
      const uid = entry.userId._id.toString();
      if (!userEntriesMap.has(uid)) {
        userEntriesMap.set(uid, []);
      }
      userEntriesMap.get(uid)?.push(entry);
    });

    // Build the final report.
    const report = organizationUsers.map((user) => {
      const uid = user._id.toString();

      if (usersOnLeave.has(uid)) {
        return {
          user: `${user.firstName} ${user.lastName}`,
          status: 'On Leave',
          loginTime: 'N/A',
          logoutTime: 'N/A',
          totalDuration: 'N/A',
        };
      }

      if (userEntriesMap.has(uid)) {
        const entries = userEntriesMap.get(uid) || [];
        // Sort the entries by timestamp (ascending)
        entries.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        // For display, get the first login and the last logout (if any)
        const firstLoginEntry = entries.find(e => e.action === 'login');
        const lastLogoutEntry = [...entries].reverse().find(e => e.action === 'logout');

        const totalDuration = calculateHoursBetweenLoginLogout(entries);
        return {
          user: `${user.firstName} ${user.lastName}`,
          status: 'Present',
          loginTime: firstLoginEntry ? firstLoginEntry.loginTime || 'N/A' : 'N/A',
          logoutTime: lastLogoutEntry ? lastLogoutEntry.logoutTime || 'N/A' : 'N/A',
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

// Helper function to parse HH:mm on a specific date.
function parseTimeOnDate(date: string, time: string): string | null {
  if (!time) return null;
  const [hours, minutes] = time.split(':').map(Number);
  const parsedDate = new Date(date);
  parsedDate.setHours(hours, minutes, 0, 0);
  return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
}

/**
 * calculateHoursBetweenLoginLogout
 * This function mimics the client-side logic by sorting the entries by timestamp and
 * calculating the net working duration per session (login to logout), subtracting any breaks.
 */

function calculateHoursBetweenLoginLogout(entries: any[]): string {
  // Sort entries by timestamp (ascending)
  const sortedEntries = entries.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  let totalNetMs = 0;
  let loginTime: number | null = null;
  let totalBreakMs = 0;
  let currentBreakStart: number | null = null;

  sortedEntries.forEach((entry) => {
    const entryTime = new Date(entry.timestamp).getTime();

    if (entry.action === 'login') {
      // Start a new work session
      loginTime = entryTime;
      totalBreakMs = 0;
      currentBreakStart = null;
    } else if (entry.action === 'break_started') {
      // Mark the break start time
      currentBreakStart = entryTime;
    } else if (entry.action === 'break_ended') {
      if (currentBreakStart !== null) {
        // Add break duration
        totalBreakMs += entryTime - currentBreakStart;
        currentBreakStart = null;
      }
    } else if (entry.action === 'logout') {
      if (loginTime !== null) {
        // If a break was ongoing, add break duration until logout.
        if (currentBreakStart !== null) {
          totalBreakMs += entryTime - currentBreakStart;
          currentBreakStart = null;
        }
        const sessionDurationMs = entryTime - loginTime;
        const netSessionMs = sessionDurationMs - totalBreakMs;
        totalNetMs += netSessionMs;
        // Reset for the next session.
        loginTime = null;
        totalBreakMs = 0;
      }
    }
  });

  // If the last entry is a break_started (and there was a login), assume the session ended at the break start.
  if (loginTime !== null && currentBreakStart !== null) {
    const sessionDurationMs = currentBreakStart - loginTime;
    const netSessionMs = sessionDurationMs - totalBreakMs;
    totalNetMs += netSessionMs;
  }

  // Convert totalNetMs to hours and minutes
  const hours = Math.floor(totalNetMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalNetMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}

