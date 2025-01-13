import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns'; // Date formatting for reports
import { sendEmail, SendEmailOptions } from '@/lib/sendEmail'; // Helper for sending emails
import { getDataFromToken } from '@/helper/getDataFromToken';
import User, { IUser } from '@/models/userModel';
import LoginEntry from '@/models/loginEntryModel';
import Leave from '@/models/leaveModel';
import { Types } from 'mongoose';

interface AttendanceReport {
    name: string;
    status: 'Present' | 'Absent' | 'On Leave';
    loginTime: string;
}

interface ReportData {
    reportData: AttendanceReport[];
}

export async function GET() {
    try {
        console.log('GET /api/reports/daily-attendance-report endpoint called');
        const now = new Date();
        const currentHourMinute = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // Local time in "HH:MM" format

        // Fetch users and filter out the ones with 'member' role
        const users = await User.find({}).exec();
        console.log(`Found ${users.length} users`);

        for (const user of users) {
            // Skip users with 'member' role
            if (user.role === 'member') {
                console.log(`Skipping user: ${user.email} as they have 'member' role.`);
                continue;
            }

            // Check if the user's reminder time matches the current time
            if (user.reminders.dailyAttendanceReportTime === currentHourMinute) {
                console.log(`Sending daily attendance report for user: ${user.email}`);

                // Fetch the employees reporting to this user and generate the report
                const employees = await User.find({ reportingManager: user._id });

                const reportDate = new Date();
                const formattedDate = format(reportDate, 'dd MMM yyyy');

                const reportData = await generateAttendanceReport(employees, formattedDate);

                const subject = `Employee Attendance Report for ${formattedDate}`;
                const htmlContent = generateReportHtml(reportData, user, formattedDate);

                const emailOptions: SendEmailOptions = {
                    to: user.email,
                    text: subject,
                    subject: subject,
                    html: htmlContent,
                };

                // Send the email
                await sendEmail(emailOptions);
            }
        }

        return NextResponse.json({ message: 'Daily attendance reports processed successfully.' }, { status: 200 });
    } catch (error) {
        console.error('Error processing daily attendance report:', error);
        return NextResponse.json({ error: 'Failed to process daily attendance report.' }, { status: 500 });
    }
}

const generateAttendanceReport = async (employees: IUser[], reportDate: string): Promise<ReportData> => {
    const reportData: AttendanceReport[] = [];

    for (const employee of employees) {
        const attendanceStatus = await getEmployeeAttendanceStatus(employee._id, reportDate);
        // Ensure the status is one of 'Present' | 'Absent' | 'On Leave'
        const status: 'Present' | 'Absent' | 'On Leave' = attendanceStatus.status as 'Present' | 'Absent' | 'On Leave';

        reportData.push({
            name: `${employee.firstName} ${employee.lastName}`,
            status: status,
            loginTime: attendanceStatus.loginTime || 'N/A',
        });
    }

    return { reportData };
};

// Function to retrieve the attendance status of each employee
const getEmployeeAttendanceStatus = async (employeeId: Types.ObjectId, date: string) => {
    const loginEntry = await LoginEntry.findOne({
        userId: employeeId,
        timestamp: { $gte: date, $lt: new Date(date).setDate(new Date(date).getDate() + 1) },
    });

    if (loginEntry) {
        return { status: 'Present', loginTime: format(loginEntry.timestamp, 'hh:mm a') };
    }

    const leaveRecord = await Leave.findOne({
        user: employeeId,
        fromDate: { $lte: date },
        toDate: { $gte: date },
    });

    if (leaveRecord) {
        return { status: 'On Leave', loginTime: 'N/A' };
    }

    return { status: 'Absent', loginTime: 'N/A' };
};

// Function to generate the HTML content for the report email
const generateReportHtml = (reportData: ReportData, user: IUser, formattedDate: string) => {
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLeave = 0;

    reportData.reportData.forEach((entry) => {
        if (entry.status === 'Present') totalPresent++;
        if (entry.status === 'Absent') totalAbsent++;
        if (entry.status === 'On Leave') totalLeave++;
    });

    return `
    <h2>Employee Attendance Report</h2>
    <p><strong>Dear ${user.firstName},</strong></p>
    <p>Please find below the attendance details of your employees for ${formattedDate}.</p>
    <div>
        <p>Total Employees: ${reportData.reportData.length}</p>
        <p>Present: ${totalPresent}</p>
        <p>Absent: ${totalAbsent}</p>
        <p>On Leave: ${totalLeave}</p>
    </div>
    <h3>${user.firstName}'s Team</h3>
    <table border="1">
        <thead>
            <tr>
                <th>Username</th>
                <th>Status</th>
                <th>Login Time</th>
            </tr>
        </thead>
        <tbody>
            ${reportData.reportData
            .map((entry) => `
                    <tr>
                        <td>${entry.name}</td>
                        <td>${entry.status}</td>
                        <td>${entry.loginTime}</td>
                    </tr>
                `)
            .join('')}
        </tbody>
    </table>
  `;
};
