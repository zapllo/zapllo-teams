// src/app/api/regularize/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import LoginEntry from '@/models/loginEntryModel';
import { getDataFromToken } from '@/helper/getDataFromToken';
import User, { IUser } from '@/models/userModel';
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

const sendRegularizationEmail = async (
    user: any,
    reportingManager: any,
    loginTime: string,
    logoutTime: string,
    remarks: string,
    createdAt: Date
) => {

    // Format login and logout times
    const formattedLoginTime = formatTime(loginTime);
    const formattedLogoutTime = formatTime(logoutTime);

    const emailOptions: SendEmailOptions = {
        to: `${reportingManager.email}`,
        text: "New Regularization Application",
        subject: "New Regularization Application",

        html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px; ">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 20px; text-align: center; ">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
            </div>
          <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
    <h1 style="margin: 0; font-size: 20px;">New Regularization Application</h1>
</div>
                    <div style="padding: 20px; color:#000000;">
                        <p>Dear ${reportingManager.firstName},</p>
                        <p>A new regularization request has been raised by ${user.firstName}, given below are the details:</p>
                         <div style="border-radius:8px; margin-top:4px; color:#000000; padding:10px; background-color:#ECF1F6">
                        <p><strong>Date:</strong>${formatDate(createdAt)}</p>
                        <p><strong>Login Time:</strong>${formattedLoginTime}</p>
                        <p><strong>Logout Time:</strong> ${formattedLogoutTime}</p>
                        <p><strong>Remarks:</strong>${remarks}</p>
                        </div>
                        <div style="text-align: center; margin-top: 40px;">
                            <a href="https://zapllo.com/attendance/my-attendance" style="background-color: #017a5b; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Payroll App</a>
                        </div>
                        <p style="margin-top: 20px; font-size: 12px; text-align:center; color: #888888;">This is an automated notification. Please do not reply.</p>
                    </div>
                </div>
            </div>
        </body>`,
    };

    await sendEmail(emailOptions);
};


// Define the shape of the request body
interface RegularizationRequestBody {
    date: string; // ISO string or 'YYYY-MM-DD'
    loginTime: string; // 'HH:MM' format
    logoutTime: string; // 'HH:MM' format
    remarks: string;
}

// Helper function to format date for WhatsApp body variables
const formatDate = (dateInput: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
    };
    return new Intl.DateTimeFormat('en-GB', options).format(dateInput);
};

// Helper function to send WhatsApp notification
const sendRegularizationWhatsAppNotification = async (
    user: any,
    reportingManagerFirstName: string,
    reportingManagerPhoneNumber: string,
    reportingManagerCountry: string,
    loginTime: string,
    logoutTime: string,
    remarks: string,
    createdAt: Date
) => {
    const payload = {
        phoneNumber: reportingManagerPhoneNumber,
        country: reportingManagerCountry,
        templateName: 'regularizationrequest',
        bodyVariables: [
            reportingManagerFirstName, // 1. Reporting Manager's first name
            user.firstName,            // 2. User's first name
            formatDate(createdAt),     // 3. Created at date (formatted as DDMMYYYY)
            loginTime,                 // 4. Login time
            logoutTime,                // 5. Logout time
            remarks,                   // 6. Remarks
        ],
    };
    console.log(payload, 'payload');
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
            throw new Error(`Webhook API error: ${JSON.stringify(responseData)}`);
        }

        console.log('Regularization WhatsApp notification sent successfully:', payload);
    } catch (error) {
        console.error('Error sending regularization WhatsApp notification:', error);
    }
};

export async function POST(request: NextRequest) {
    const userId = await getDataFromToken(request);

    if (!userId) {
        return NextResponse.json(
            { success: false, message: 'Unauthorized' },
            { status: 401 }
        );
    }

    await connectDB();

    const user = await User.findById(userId).populate<{ reportingManager: IUser }>({
        path: 'reportingManager',
        select: 'firstName lastName whatsappNo email',
    });

    if (!user) {
        return NextResponse.json(
            { success: false, message: 'User not found' },
            { status: 404 }
        );
    }

    let body: RegularizationRequestBody;

    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Invalid JSON' },
            { status: 400 }
        );
    }

    const { date, loginTime, logoutTime, remarks } = body;

    if (!date || !loginTime || !logoutTime || !remarks) {
        return NextResponse.json(
            { success: false, message: 'All fields are required' },
            { status: 400 }
        );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

    if (!dateRegex.test(date)) {
        return NextResponse.json(
            { success: false, message: 'Invalid date format. Use YYYY-MM-DD.' },
            { status: 400 }
        );
    }

    if (!timeRegex.test(loginTime) || !timeRegex.test(logoutTime)) {
        return NextResponse.json(
            { success: false, message: 'Invalid time format. Use HH:MM.' },
            { status: 400 }
        );
    }

    const timestamp = new Date(date);
    if (isNaN(timestamp.getTime())) {
        return NextResponse.json(
            { success: false, message: 'Invalid date.' },
            { status: 400 }
        );
    }

    try {
        const regularizationEntry = new LoginEntry({
            userId,
            action: 'regularization',
            timestamp,
            loginTime,
            logoutTime,
            remarks,
        });

        await regularizationEntry.save();

        // Send WhatsApp message after successful save
        let reportingManagerFirstName = 'N/A';
        let reportingManagerPhoneNumber = '';
        let reportingManagerCountry = '';
        let reportingManagerEmail = '';

        if (user.reportingManager && 'firstName' in user.reportingManager) {
            const reportingManager = user.reportingManager as IUser;
            reportingManagerFirstName = reportingManager.firstName || 'N/A';
            reportingManagerPhoneNumber = reportingManager.whatsappNo || '';
            reportingManagerEmail = reportingManager.email || '';
            reportingManagerCountry = reportingManager.country || '';
        }

        await sendRegularizationWhatsAppNotification(
            user,
            reportingManagerFirstName,
            reportingManagerPhoneNumber,
            reportingManagerCountry,
            loginTime,
            logoutTime,
            remarks,
            new Date() // Use current date for createdAt field
        );
        console.log(reportingManagerEmail, 'reporting manager email?')
        // Send email notification to the reporting manager
        if (reportingManagerEmail) {
            await sendRegularizationEmail(
                user,
                { firstName: reportingManagerFirstName, email: reportingManagerEmail },
                loginTime,
                logoutTime,
                remarks,
                new Date()
            );
        }

        return NextResponse.json(
            { success: true, message: 'Regularization request submitted successfully.' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error in /api/regularize:', error);
        return NextResponse.json(
            { success: false, message: 'Server Error' },
            { status: 500 }
        );
    }
}
