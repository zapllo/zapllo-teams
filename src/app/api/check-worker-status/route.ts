// /api/check-worker-status.ts
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import LoginEntry from '@/models/loginEntryModel';
import { getDataFromToken } from '@/helper/getDataFromToken';
import dayjs from 'dayjs';

export async function POST(request: NextRequest) {
  try {
    // Extract admin userId from token
    const adminUserId = await getDataFromToken(request);

    // Get worker ID from request body
    const { workerId } = await request.json();

    if (!workerId) {
      return NextResponse.json({ success: false, error: 'Worker ID is required' }, { status: 400 });
    }

    // Fetch the latest login entry for the specified worker
    const lastEntry = await LoginEntry.findOne({ userId: workerId })
      .sort({ timestamp: -1 })
      .exec();

    // If no login history, worker is logged out
    if (!lastEntry) {
      return NextResponse.json({
        success: true,
        isLoggedIn: false,
        isBreakOpen: false,
        message: 'No login history found for this worker'
      });
    }

    // Check if the latest entry is from today
    const todayStr = dayjs().format('YYYY-MM-DD');
    const entryDay = dayjs(lastEntry.timestamp).format('YYYY-MM-DD');
    if (entryDay !== todayStr) {
      // Last entry was not made today; worker is logged out
      return NextResponse.json({
        success: true,
        isLoggedIn: false,
        isBreakOpen: false,
        message: 'Last entry is not from today'
      });
    }

    // Determine login/break status based on the latest entry action
    let isLoggedIn = false;
    let isBreakOpen = false;

    if (lastEntry.action === 'login') {
      isLoggedIn = true;
    } else if (lastEntry.action === 'logout') {
      isLoggedIn = false;
    } else if (lastEntry.action === 'break_started') {
      isLoggedIn = true;
      isBreakOpen = true;
    } else if (lastEntry.action === 'break_ended') {
      isLoggedIn = true;
    }

    return NextResponse.json({
      success: true,
      isLoggedIn,
      isBreakOpen
    });
  } catch (error) {
    console.error('Error fetching worker status:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
