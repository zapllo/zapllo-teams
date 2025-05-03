// /api/check-login-status.ts
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import LoginEntry from '@/models/loginEntryModel';
import FaceRegistrationRequest from '@/models/faceRegistrationRequest';
import User from '@/models/userModel';
import Organization from '@/models/organizationModel';
import { getDataFromToken } from '@/helper/getDataFromToken';
import dayjs from 'dayjs';

export async function GET(request: NextRequest) {
  try {
    // Extract userId from token
    const userId = await getDataFromToken(request);

    // Find the user and check if they're an admin in an enterprise org
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' });
    }

    const organization = await Organization.findById(user.organization);
    const isEnterpriseAdmin = organization?.isEnterprise &&
      (user.role === 'orgAdmin');

    // Fetch the latest login entry for the user
    const lastEntry = await LoginEntry.findOne({ userId }).sort({ timestamp: -1 }).exec();

    // Check if the user has any approved face registration requests
    const hasApprovedFaceRegistration = await FaceRegistrationRequest.exists({ userId, status: 'approved' });

    // If no login history, return logged-out status
    if (!lastEntry) {
      return NextResponse.json({
        success: true,
        isLoggedIn: false,
        isEnterpriseAdmin,
        hasRegisteredFaces: Boolean(hasApprovedFaceRegistration),
        message: 'No login history found'
      });
    }

    // Check if the latest entry is from today.
    const todayStr = dayjs().format('YYYY-MM-DD');
    const entryDay = dayjs(lastEntry.timestamp).format('YYYY-MM-DD');
    if (entryDay !== todayStr) {
      // Last entry was not made today; treat the user as logged out.
      return NextResponse.json({
        success: true,
        isLoggedIn: false,
        isEnterpriseAdmin,
        hasRegisteredFaces: Boolean(hasApprovedFaceRegistration),
        message: 'Last entry is not from today'
      });
    }

    // Determine login/break status based on the latest entry action.
    let isLoggedIn = false;
    let isBreakOpen = false;

    if (lastEntry.action === 'login') {
      isLoggedIn = true;
    } else if (lastEntry.action === 'logout') {
      isLoggedIn = false;
    } else if (lastEntry.action === 'break_started') {
      // If the user started a break, mark the break as open.
      isLoggedIn = true;
      isBreakOpen = true;
    } else if (lastEntry.action === 'break_ended') {
      // Break ended means user resumed work (still logged in)
      isLoggedIn = true;
    }

    return NextResponse.json({
      success: true,
      isLoggedIn,
      isBreakOpen,
      isEnterpriseAdmin,
      hasRegisteredFaces: Boolean(hasApprovedFaceRegistration)
    });
  } catch (error) {
    console.error('Error fetching login status:', error);
    return NextResponse.json({ success: false, error: 'Server error' });
  }
}
