import { NextRequest, NextResponse } from 'next/server';
import Leave from '@/models/leaveModel';
import User from '@/models/userModel';
import LeaveType from '@/models/leaveTypeModel';
import Holiday from '@/models/holidayModel';
import { getDataFromToken } from '@/helper/getDataFromToken';
import { isWeekend, isSameDay } from 'date-fns';
import mongoose from 'mongoose';
import { sendEmail, SendEmailOptions } from '@/lib/sendEmail';

type LeaveUnit = 'Full Day' | '1st Half' | '2nd Half' | '1st Quarter' | '2nd Quarter' | '3rd Quarter' | '4th Quarter';

// Define the mapping for leave units and their corresponding values
const unitMapping: Record<LeaveUnit, number> = {
    'Full Day': 1,
    '1st Half': 0.5,
    '2nd Half': 0.5,
    '1st Quarter': 0.25,
    '2nd Quarter': 0.25,
    '3rd Quarter': 0.25,
    '4th Quarter': 0.25,
};

// Helper function to format date
const formatDate = (dateInput: string | Date): string => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const optionsDate: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: '2-digit' };
    return new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
};

// Helper function to fetch non-deductible days
async function getNonDeductibleDaysInRange(
    startDate: Date,
    endDate: Date,
    organization: mongoose.Types.ObjectId,
    includeHolidays: boolean,
    includeWeekOffs: boolean
) {
    const nonDeductibleDays: Date[] = [];

    if (includeHolidays) {
        const holidays = await Holiday.find({
            organization,
            holidayDate: { $gte: startDate, $lte: endDate },
        }).exec();
        nonDeductibleDays.push(...holidays.map((holiday) => holiday.holidayDate));
    }

    if (includeWeekOffs) {
        let current = new Date(startDate);
        while (current <= endDate) {
            if (isWeekend(current)) {
                nonDeductibleDays.push(new Date(current));
            }
            current.setDate(current.getDate() + 1);
        }
    }

    return nonDeductibleDays;
}

// Helper function to send WhatsApp notifications
const sendLeaveWebhookNotification = async (
    leave: any,
    reportingManager: any,
    user: any,
    leaveType: any,
    phoneNumber: string,
    country: string
) => {
    const payload = {
        phoneNumber,
        country,
        templateName: 'leaverequest', // Change this to the correct template name
        bodyVariables: [
            reportingManager.firstName, // Reporting Manager's first name
            user.firstName, // User's first name
            leaveType.leaveType,
            formatDate(leave.fromDate), // Start date of the leave
            formatDate(leave.toDate), // End date of the leave
            String(leave.appliedDays), // Total applied days
            leave.leaveReason, // Reason for the leave
        ],
    };

    try {
        const response = await fetch('https://zapllo.com/api/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(`Webhook API error: ${JSON.stringify(responseData)}`);
        }
    } catch (error: any) {
        console.error('Error sending leave webhook notification:', error.message);
    }
};

// POST: Create a leave request
export async function POST(request: NextRequest) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = await getDataFromToken(request);
        const body = await request.json();

        const user = await User.findById(userId).populate('leaveBalances.leaveType').session(session);
        if (!user) throw new Error('User not found.');
        if (!user.organization) throw new Error('User is not associated with an organization.');

        const leaveType = await LeaveType.findById(body.leaveType).session(session);
        if (!leaveType) throw new Error('Leave type not found.');

        const nonDeductibleDays = await getNonDeductibleDaysInRange(
            new Date(body.fromDate),
            new Date(body.toDate),
            user.organization,
            leaveType.includeHolidays,
            leaveType.includeWeekOffs
        );

        let totalAppliedDays = 0;
        for (const leaveDay of body.leaveDays) {
            if (!nonDeductibleDays.some((day) => isSameDay(day, new Date(leaveDay.date)))) {
                totalAppliedDays += unitMapping[leaveDay.unit as LeaveUnit];
            }
        }

        const userLeaveBalance = user.leaveBalances.find(
            (balance) => String(balance.leaveType?._id || balance.leaveType) === String(body.leaveType)
        );

        if (!userLeaveBalance || userLeaveBalance.balance < totalAppliedDays) {
            throw new Error('Insufficient leave balance.');
        }

        userLeaveBalance.balance -= totalAppliedDays; // Deduct applied days
        await user.save({ session });

        const newLeave = new Leave({
            user: userId,
            leaveType: body.leaveType,
            fromDate: body.fromDate,
            toDate: body.toDate,
            leaveDays: body.leaveDays,
            appliedDays: totalAppliedDays,
            leaveReason: body.leaveReason,
            attachment: body.attachment,
            audioUrl: body.audioUrl || '',
            status: 'Pending',
        });

        const savedLeave = await newLeave.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Background notification processing
        (async () => {
            try {
                console.log('Fetching reporting manager...');
                const reportingManager = await User.findById(user.reportingManager);

                if (!reportingManager) {
                    console.error('Reporting manager not found');
                    return;
                }

                await savedLeave.populate('leaveType');

                if (reportingManager && reportingManager.notifications.email) {
                    const emailOptions: SendEmailOptions = {
                        to: `${reportingManager.email}`,
                        text: 'New Leave Application',
                        subject: "New Leave Application",
                        html: ` <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px; ">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 20px; text-align: center; ">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
            </div>
          <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
    <h1 style="margin: 0; font-size: 20px;">New Leave Application</h1>
</div>
                    <div style="padding: 20px; color:#000000;">
                        <p>Dear ${reportingManager.firstName},</p>
                        <p>A new leave application has been raised by ${user.firstName}. Below are the details:</p>
                          <div style="border-radius:8px; margin-top:4px; color:#000000; padding:10px; background-color:#ECF1F6">
                        <p><strong>Leave Type:</strong>${leaveType.leaveType}</p>
                        <p><strong>Reason:</strong> ${savedLeave.leaveReason}</p>
                        <p><strong>From:</strong> ${formatDate(savedLeave.fromDate)}</p>
                        <p><strong>To:</strong>${formatDate(savedLeave.toDate)}</p>
                        <p><strong>Applied Duration:</strong> ${savedLeave.appliedDays} days</p>
                        </div>
                        <div style="text-align: center; margin-top: 40px;">
                            <a href="https://zapllo.com/attendance/my-leaves" style="background-color: #017a5b; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Payroll App</a>
                        </div>
                        <p style="margin-top: 20px; text-align:center; font-size: 12px; color: #888888;">This is an automated notification. Please do not reply.</p>
                    </div>
                </div>
            </div>
        </body>`,
                    };
                    await sendEmail(emailOptions);
                }
                // Send WhatsApp notification if enabled
                if (reportingManager.notifications.whatsapp) {
                    console.log('Sending WhatsApp notification...');
                    await sendLeaveWebhookNotification(
                        savedLeave,
                        reportingManager,
                        user,
                        savedLeave.leaveType,
                        reportingManager.whatsappNo,
                        reportingManager.country,
                    );
                    console.log('WhatsApp notification sent');
                }
            } catch (error: any) {
                console.error('Error in background notification processing:', error.message);
            }
        })();
        return NextResponse.json({ success: true, leave: savedLeave });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error during leave creation:', error.message);
        return NextResponse.json({ success: false, error: error.message });
    }
}

// GET: Fetch user leaves
export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const userLeaves = await Leave.find({ user: userId })
            .populate({ path: 'leaveType', model: 'leaveTypes' })
            .populate({ path: 'user', model: 'users', select: 'firstName lastName _id' })
            .populate({ path: 'approvedBy', model: 'users', select: 'firstName lastName _id' })
            .populate({ path: 'rejectedBy', model: 'users', select: 'firstName lastName _id' })
            .sort({ createdAt: -1 });

        if (!userLeaves || userLeaves.length === 0) {
            return NextResponse.json({ success: false, error: 'No leaves found for this user' });
        }

        return NextResponse.json({ success: true, leaves: userLeaves });
    } catch (error: any) {
        console.error('Error fetching user leaves:', error.message);
        return NextResponse.json({ success: false, error: error.message });
    }
}