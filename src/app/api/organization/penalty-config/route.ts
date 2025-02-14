import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Organization from '@/models/organizationModel';
import User from '@/models/userModel';
import { getDataFromToken } from '@/helper/getDataFromToken';

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    // Extract penalty configuration data from the request body
    const { penaltyOption, lateLoginThreshold, penaltyLeaveType, penaltySalaryAmount } = await req.json();

    // Extract user ID from token and fetch the user
    const userId = await getDataFromToken(req);
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    if (user.role !== 'orgAdmin') {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
    }
    
    // Get the organization ID from the user record
    const organizationId = user.organization;
    if (!organizationId) {
      return NextResponse.json({ success: false, message: 'Organization not found' }, { status: 404 });
    }
    
    // Build the update payload based on the penaltyOption
    let updatePayload: any = { penaltyOption };

    if (penaltyOption === 'leave') {
      // For leave penalties, require a threshold and a leave type
      if (lateLoginThreshold === undefined || penaltyLeaveType === undefined) {
        return NextResponse.json(
          { success: false, message: 'Missing required fields for leave penalty configuration' },
          { status: 400 }
        );
      }
      updatePayload.lateLoginThreshold = Number(lateLoginThreshold);
      updatePayload.penaltyLeaveType = penaltyLeaveType;
      // Reset salary-related field
      updatePayload.penaltySalaryAmount = 0;
    } else if (penaltyOption === 'salary') {
      // For salary penalties, require an amount
      if (penaltySalaryAmount === undefined) {
        return NextResponse.json(
          { success: false, message: 'Missing required field for salary penalty configuration' },
          { status: 400 }
        );
      }
      updatePayload.penaltySalaryAmount = Number(penaltySalaryAmount);
      // Reset leave-related fields
      updatePayload.lateLoginThreshold = 0;
      updatePayload.penaltyLeaveType = "";
    } else {
      return NextResponse.json({ success: false, message: 'Invalid penalty option' }, { status: 400 });
    }
    
    // Update the organization document with the new penalty configuration
    const updatedOrg = await Organization.findByIdAndUpdate(organizationId, updatePayload, { new: true });
    if (!updatedOrg) {
      return NextResponse.json({ success: false, message: 'Organization not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, organization: updatedOrg }, { status: 200 });
  } catch (error) {
    console.error('Error updating penalty configuration:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
