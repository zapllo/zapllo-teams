import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns'; // Date formatting for reports
import { sendEmail, SendEmailOptions } from '@/lib/sendEmail'; // Helper for sending emails
import { getDataFromToken } from '@/helper/getDataFromToken';
import User, { IUser } from '@/models/userModel';
import LoginEntry from '@/models/loginEntryModel';
import Leave from '@/models/leaveModel';
import { Types } from 'mongoose';
import dayjs from 'dayjs';
import connectDB from '@/lib/db';
export const dynamic = 'force-dynamic';

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
    console.log('🚀 GET /api/reports/daily-attendance-report endpoint called');

    await connectDB();
    console.log('✅ MongoDB Connected!');

    const now = new Date();
    const currentHourMinute = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // Local time in "HH:MM" format
    console.log(`🕒 Current Time: ${currentHourMinute}`);

    // Fetch users
    const users = await User.find({}).exec();
    console.log(`👥 Found ${users.length} users in database`);

    for (const user of users) {
      if (!user.reminders || !user.reminders.dailyAttendanceReportTime) {
        console.log(`⚠️ Skipping user ${user.email}, no dailyAttendanceReportTime set`);
        continue;
      }

      const storedHourMinute = user.reminders.dailyAttendanceReportTime; // e.g. "04:20"
      console.log(`📌 Checking user ${user.email} - Reminder time: ${storedHourMinute}`);

      // Parse stored time
      const [storedHStr, storedMStr] = storedHourMinute.split(':');
      const storedH = parseInt(storedHStr, 10);
      const storedM = parseInt(storedMStr, 10);

      // Parse current time
      const [currentHStr, currentMStr] = currentHourMinute.split(':');
      const currentH = parseInt(currentHStr, 10);
      const currentM = parseInt(currentMStr, 10);

      console.log(`🔄 Parsed times for ${user.email} - Stored: ${storedH}:${storedM}, Current: ${currentH}:${currentM}`);

      // Match conditions
      const exactMatch = storedH === currentH && storedM === currentM;
      const twelveHourMatch = ((storedH + 12) % 24) === currentH && storedM === currentM;

      if (exactMatch || twelveHourMatch) {
        console.log(`✅ Match found for ${user.email}, sending report...`);

        const employees = await User.find({ reportingManager: user._id });
        console.log(`📊 ${employees.length} employees found under ${user.email}`);

        const reportDate = new Date();
        const formattedDate = format(reportDate, 'dd MMM yyyy');
        console.log(`📅 Report Date: ${formattedDate}`);

        const reportData = await generateAttendanceReport(employees, formattedDate);
        console.log(`📈 Report Data Generated`);

        const subject = `Employee Attendance Report for ${formattedDate}`;
        const htmlContent = generateReportHtml(reportData, user, formattedDate);
        console.log(`📧 Email Content Generated`);

        const emailOptions: SendEmailOptions = {
          to: user.email,
          text: subject,
          subject,
          html: htmlContent,
        };

        try {
          console.log(`📤 Sending email to ${user.email}...`);
          await sendEmail(emailOptions);
          console.log('✅ Email sent successfully!');
        } catch (emailError) {
          console.error(`❌ Error sending email to ${user.email}:`, emailError);
        }
      } else {
        console.log(`⏭ No time match for ${user.email}, skipping email`);
      }
    }

    console.log('🎉 Daily attendance reports processed successfully');
    return NextResponse.json({ message: 'Daily attendance reports processed successfully.' }, { status: 200 });
  } catch (error) {
    console.error('🚨 Error processing daily attendance report:', error);
    return NextResponse.json({ error: 'Failed to process daily attendance report.' }, { status: 500 });
  }
}

const generateAttendanceReport = async (employees: IUser[], reportDate: string): Promise<ReportData> => {
  console.log('📌 Generating attendance report...');
  const reportData: AttendanceReport[] = [];

  for (const employee of employees) {
    const attendanceStatus = await getEmployeeAttendanceStatus(employee._id, reportDate);
    const status: 'Present' | 'Absent' | 'On Leave' = attendanceStatus.status as 'Present' | 'Absent' | 'On Leave';

    reportData.push({
      name: `${employee.firstName} ${employee.lastName}`,
      status: status,
      loginTime: attendanceStatus.loginTime || 'N/A',
    });
  }

  console.log(`✅ Attendance report generated for ${employees.length} employees`);
  return { reportData };
};

const getEmployeeAttendanceStatus = async (employeeId: Types.ObjectId, date: string) => {
  console.log(`🔍 Fetching attendance status for employee ${employeeId}`);

  const loginEntry = await LoginEntry.findOne({
    userId: employeeId,
    timestamp: { $gte: date, $lt: new Date(date).setDate(new Date(date).getDate() + 1) },
  });

  if (loginEntry) {
    console.log(`✅ Employee ${employeeId} is Present`);
    return { status: 'Present', loginTime: format(loginEntry.timestamp, 'hh:mm a') };
  }

  const leaveRecord = await Leave.findOne({
    user: employeeId,
    fromDate: { $lte: date },
    toDate: { $gte: date },
  });

  if (leaveRecord) {
    console.log(`🟠 Employee ${employeeId} is On Leave`);
    return { status: 'On Leave', loginTime: 'N/A' };
  }

  console.log(`❌ Employee ${employeeId} is Absent`);
  return { status: 'Absent', loginTime: 'N/A' };
};

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
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
      <div style="background-color: #f0f4f8; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="padding: 20px; text-align: center;">
            <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
          </div>
          <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
            <h1 style="margin: 0; font-size: 20px;">Employee Attendance Report for ${formattedDate}</h1>
          </div>
          <div style="padding: 20px;">
            <p><strong>Dear ${user.firstName},</strong></p>
            <p>Here is the detailed attendance report for your employees on ${formattedDate}:</p>
            <div style="margin-top: 20px;">
              <p>Total Employees: ${reportData.reportData.length}</p>
              <p>Present: ${totalPresent}</p>
              <p>Absent: ${totalAbsent}</p>
              <p>On Leave: ${totalLeave}</p>
            </div>
            <h3 style="margin-top: 30px;">${user.firstName}'s Team</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #f2f2f2;">
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Employee Name</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Status</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Login Time</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.reportData
      .map((entry) => `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #ddd;">${entry.name}</td>
                      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${entry.status}</td>
                      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${entry.loginTime}</td>
                    </tr>
                  `)
      .join('')}
              </tbody>
            </table>
            <div style="text-align: center; margin-top: 40px;">
              <a href="https://zapllo.com/dashboard/attendance" style="background-color: #017a5b; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Attendance Details</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #888888; text-align: center;">This is an automated notification. Please do not reply.</p>
          </div>
        </div>
      </div>
    </body>
    `;
};
