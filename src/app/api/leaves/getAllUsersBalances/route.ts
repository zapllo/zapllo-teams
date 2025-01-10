import { NextRequest, NextResponse } from 'next/server';
import User, { IUser } from '@/models/userModel';
import LeaveType, { ILeaveType } from '@/models/leaveTypeModel';
import connectDB from '@/lib/db';
import mongoose, { Document, Types } from 'mongoose';
import { getDataFromToken } from '@/helper/getDataFromToken';

export const dynamic = 'force-dynamic';

export interface ILeaveBalance {
    leaveType: Types.ObjectId | ILeaveType; // It can be an ObjectId or populated ILeaveType
    balance: number;
}


export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Get the logged-in user's information from the token
        const userId = await getDataFromToken(request);
        const authenticatedUser = await User.findById(userId);
        if (!authenticatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Ensure the user's organization is valid
        if (
            !authenticatedUser.organization ||
            !(authenticatedUser.organization instanceof mongoose.Types.ObjectId)
        ) {
            return NextResponse.json(
                { error: "User's organization is not valid" },
                { status: 400 }
            );
        }

        // Fetch users in the authenticated user's organization and populate leaveBalances.leaveType
        const users = await User.find({ organization: authenticatedUser.organization }).populate(
            'leaveBalances.leaveType'
        ) as (IUser & { leaveBalances: (ILeaveBalance & { leaveType: ILeaveType })[] })[];

        if (!users || users.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No users found in this organization',
            });
        }

        // Fetch leave types that belong to the same organization (if needed)
        const leaveTypes = await LeaveType.find({
            organization: authenticatedUser.organization,
        });

        if (!leaveTypes || leaveTypes.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No leave types found for this organization',
            });
        }

        // Prepare a response with all users in the same organization and their respective leave balances
        const data = users.map((user) => ({
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            leaveBalances: user.leaveBalances
                .filter((balance) => balance.leaveType !== null)
                .map((balance) => {
                    const leaveType = balance.leaveType as unknown as ILeaveType; // Type assertion
                    return {
                        leaveTypeId: leaveType._id,
                        leaveTypeName: leaveType.leaveType,
                        userLeaveBalance: balance.balance,
                    };
                }),
        }));

        console.log(data, 'data');

        return NextResponse.json({
            success: true,
            data: {
                users: data,
                leaveTypes, // Send all leave types for dynamic table headers
            },
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
