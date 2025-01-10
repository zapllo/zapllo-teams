// src/app/api/regularization-approvals/[entryId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoginEntry from '@/models/loginEntryModel';
import User, { IUser } from '@/models/userModel';
import { getDataFromToken } from '@/helper/getDataFromToken'; // Your custom token extraction function

import { sendEmail, SendEmailOptions } from '@/lib/sendEmail';


// Helper function to format time in 12-hour format with AM/PM
const formatTime = (time24: string): string => {
    const [hours, minutes] = time24.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(date);
};


const sendRegularizationApprovalEmail = async (user: any, regularizationEntry: any, approverName: string) => {
    // Format login and logout times
    const formattedLoginTime = formatTime(regularizationEntry.loginTime);
    const formattedLogoutTime = formatTime(regularizationEntry.logoutTime);
    const emailOptions: SendEmailOptions = {
        to: `${user.email}`,
        text: "Regularization Request - Approved",
        subject: "Regularization Request - Approved",
        html: ` <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px; ">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 20px; text-align: center; ">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
            </div>
          <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
    <h1 style="margin: 0; font-size: 20px;">Regularization Request - Approved</h1>
</div>
                     <div style="padding: 20px; color:#000000;">
                        <p>Dear ${user.firstName},</p>
                        <p>Your regularization application has been <strong>Approved</strong> by ${approverName}, given below are the details:</p>
                             <div style="border-radius:8px; margin-top:4px; color:#000000; padding:10px; background-color:#ECF1F6">
                        <p><strong>Date:</strong> ${formatDate(regularizationEntry.createdAt)}</p>
                        <p><strong>Login Time:</strong> ${formattedLoginTime}</p>
                        <p><strong>Logout Time:</strong> ${formattedLogoutTime}</p>
                        <p><strong>Manager Remarks:</strong> ${regularizationEntry.notes || "Approved"}</p>
                        </div>
                        <div style="text-align: center; margin-top: 40px;">
                            <a href="https://zapllo.com/attendance/my-attendance" style="background-color: #017a5b; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Payroll App</a>
                        </div>
                        <p style="margin-top: 20px; text-align:center; font-size: 12px; color: #888888;">This is an automated notification. Please do not reply.</p>
                    </div>
                </div>
            </div>
        </body>`,
    };

    await sendEmail(emailOptions);
};

const sendRegularizationRejectionEmail = async (user: any, regularizationEntry: any, approverName: string) => {
    // Format login and logout times
    const formattedLoginTime = formatTime(regularizationEntry.loginTime);
    const formattedLogoutTime = formatTime(regularizationEntry.logoutTime);

    const emailOptions: SendEmailOptions = {
        to: `${user.email}`,
        text: "Regularization Request - Rejected",
        subject: "Regularization Request - Rejected",
        html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px; ">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 20px; text-align: center; ">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
            </div>
          <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 10px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
    <h1 style="margin: 0; font-size: 20px;">Regularization Request - Rejected</h1>
</div>
                     <div style="padding: 20px; color:#000000;">
                        <p>Dear ${user.firstName},</p>
                        <p>Your regularization application has been <strong>Rejected</strong> by ${approverName}, given below are the details:</p>
                             <div style="border-radius:8px; margin-top:4px; color:#000000; padding:10px; background-color:#ECF1F6">
                        <p><strong>Date:</strong> ${formatDate(regularizationEntry.createdAt)}</p>
                        <p><strong>Login Time:</strong> ${formattedLoginTime}</p>
                        <p><strong>Logout Time:</strong> ${formattedLogoutTime}</p>
                        <p><strong>Manager Remarks:</strong> ${regularizationEntry.notes || "Approved"}</p>
                        </div>
                        <div style="text-align: center; margin-top: 40px;">
                            <a href="https://zapllo.com/attendance/my-attendance" style="background-color: #017a5b; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Payroll App</a>
                        </div>
                        <p style="margin-top: 20px; text-align:center; font-size: 12px; color: #888888;">This is an automated notification. Please do not reply.</p>
                    </div>
                </div>
            </div>
        </body>`,
    };

    await sendEmail(emailOptions);
};



interface ApprovalRequestBody {
    action: 'approve' | 'reject';
    remarks?: string;
    notes?: string;
}

// Helper function to format date
const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: '2-digit' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
};

const sendWhatsAppRegularizationNotification = async (
    user: any,
    phoneNumber: string,
    country: string,
    approverName: string,
    regularizationEntry: any,
    templateName: string
) => {
    const payload = {
        phoneNumber,
        country,
        templateName, // Use the dynamic template name for either approval or rejection
        bodyVariables: [
            user.firstName, // 1. User's first name
            approverName, // 2. Approver's name (either reporting manager or orgAdmin)
            formatDate(regularizationEntry.createdAt), // 3. Created at date (formatted)
            regularizationEntry.loginTime, // 4. Login time
            regularizationEntry.logoutTime, // 5. Logout time
            regularizationEntry.remarks || 'No remarks', // 6. Remarks
        ],
    };

    console.log('Sending WhatsApp payload:', payload);

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
            console.error('Webhook API error:', responseData);
            throw new Error(`Webhook API error, response data: ${JSON.stringify(responseData)}`);
        }

        console.log('WhatsApp notification sent successfully:', payload);
    } catch (error) {
        console.error('Error sending WhatsApp notification:', error);
    }
};




export async function PATCH(request: NextRequest, { params }: { params: { entryId: string } }) {
    const { entryId } = params;

    try {
        const managerId = await getDataFromToken(request);

        if (!managerId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const loggedInUser = await User.findById(managerId);

        if (!loggedInUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const regularizationEntry = await LoginEntry.findById(entryId);
        if (!regularizationEntry) {
            return NextResponse.json({ success: false, message: 'Regularization entry not found' }, { status: 404 });
        }

        if (regularizationEntry.action !== 'regularization' || regularizationEntry.approvalStatus !== 'Pending') {
            return NextResponse.json({ success: false, message: 'Invalid regularization entry' }, { status: 400 });
        }

        const user = await User.findById(regularizationEntry.userId).populate<{ reportingManager: IUser | null }>('reportingManager', 'firstName lastName');
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const isManager = user.reportingManager && user.reportingManager._id.equals(managerId);
        const isOrgAdmin = loggedInUser.role === 'orgAdmin';

        if (!isManager && !isOrgAdmin) {
            return NextResponse.json({ success: false, message: 'You do not have permission to approve this regularization' }, { status: 403 });
        }

        const body: ApprovalRequestBody = await request.json();
        const { action, notes } = body;

        if (!['approve', 'reject'].includes(action)) {
            return NextResponse.json({ success: false, message: 'Invalid action. Must be approve or reject.' }, { status: 400 });
        }

        regularizationEntry.approvalStatus = action === 'approve' ? 'Approved' : 'Rejected';
        regularizationEntry.approvedBy = managerId;
        regularizationEntry.approvedAt = new Date();
        regularizationEntry.notes = notes || '';

        await regularizationEntry.save();

        // Re-fetch the regularization entry and populate the approvedBy field to include firstName
        await regularizationEntry.populate({
            path: 'approvedBy',
            select: 'firstName',
            model: 'users', // Explicitly specify the model name
        });

        // Determine the approver's name for the notification
        const approverName = isOrgAdmin
            ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
            : `${user.reportingManager?.firstName || ''} ${user.reportingManager?.lastName || ''}`;

        // Send WhatsApp notification based on the action (approve or reject)
        if (user.whatsappNo) {
            const templateName = action === 'approve' ? 'regularizationapproval' : 'regularizationrejection';
            await sendWhatsAppRegularizationNotification(user, user.whatsappNo, user.country, approverName, regularizationEntry, templateName);
        }

        // Send Email based on the action
        if (action === 'approve') {
            await sendRegularizationApprovalEmail(user, regularizationEntry, approverName);
        } else {
            await sendRegularizationRejectionEmail(user, regularizationEntry, approverName);
        }

        return NextResponse.json({ success: true, message: `Regularization has been ${action}d successfully.` }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating regularization approval:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}



export async function DELETE(request: NextRequest, { params }: { params: { entryId: string } }) {
    const { entryId } = params;

    try {
        // Extract manager's userId from the token
        const managerId = await getDataFromToken(request);

        if (!managerId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to the database
        await connectDB();

        // Fetch the regularization entry
        const regularizationEntry = await LoginEntry.findById(entryId);

        if (!regularizationEntry) {
            return NextResponse.json(
                { success: false, message: 'Regularization entry not found' },
                { status: 404 }
            );
        }

        // Fetch the user who submitted the regularization
        const user = await User.findById(regularizationEntry.userId);

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Check if the logged-in user has the authority to delete this entry
        const isManager = user.reportingManager?.toString() === managerId;

        if (!isManager) {
            return NextResponse.json(
                { success: false, message: 'You do not have permission to delete this regularization' },
                { status: 403 }
            );
        }

        // Delete the regularization entry using findByIdAndDelete
        await LoginEntry.findByIdAndDelete(entryId);

        return NextResponse.json(
            { success: true, message: 'Regularization entry deleted successfully.' },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error deleting regularization entry:', error);
        return NextResponse.json(
            { success: false, message: 'Server Error' },
            { status: 500 }
        );
    }
}
