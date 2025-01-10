import mongoose from 'mongoose';
import Task from '../../../models/taskModal';
import User, { IUser } from '../../../models/userModel';
import connectDB from '@/lib/db';
import { sendEmail, SendEmailOptions } from "@/lib/sendEmail";

export const dynamic = 'force-dynamic';

const formatDate = (dateInput: string | Date): string => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const optionsDate: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: '2-digit' };
    const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
    const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);
    const timeParts = formattedTime.match(/(\d{1,2}:\d{2})\s*(AM|PM)/);
    const formattedTimeUppercase = timeParts ? `${timeParts[1]} ${timeParts[2].toUpperCase()}` : formattedTime;

    return `${formattedDate} ${formattedTimeUppercase}`;
};

const sendWebhookNotification = async (user: IUser, reminderTime: string, overdueCount: number, pendingCount: number, inProgressCount: number) => {
    const payload = {
        phoneNumber: user.whatsappNo,
        country: user.country,
        templateName: 'daily_report',
        bodyVariables: [
            user.firstName,
            overdueCount.toString(),
            pendingCount.toString(),
            inProgressCount.toString()
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
            throw new Error(`Webhook API error: ${responseData.message}`);
        }
        console.log('WhatsApp notification sent successfully:', payload);
    } catch (error) {
        console.error('Error sending WhatsApp notification:', error);
        throw new Error('Failed to send WhatsApp notification');
    }
};

const sendDailyReminderNotification = async (user: IUser, reminderTime: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Get the day's name
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeek[today.getDay()];
    const subject = `Your ${dayName}'s Task Report`;

    const tasks = await Task.find({
        assignedUser: user._id,
        dueDate: { $gte: today, $lt: tomorrow }
    });

    const overdueCount = tasks.filter(task => task.status === 'Pending' && task.dueDate < new Date()).length;
    const pendingCount = tasks.filter(task => task.status === 'Pending').length;
    const inProgressCount = tasks.filter(task => task.status === 'In Progress').length;

    if (user.reminders.email) {
        const taskDetailsHTML = tasks
            .map(
                (task) => `
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: left;">${task.title}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${task.status}</td>
                </tr>`
            )
            .join('');

        const emailOptions: SendEmailOptions = {
            to: `${user.email}`,
            subject: subject,
            text: subject,
            html: `
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
            <div style="background-color: #f0f4f8; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <div style="padding: 20px; text-align: center;">
                        <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
                    </div>
                    <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
                        <h1 style="margin: 0; font-size: 20px;">${subject}</h1>
                    </div>
                    <div style="padding: 20px;">
                        <p><strong>Dear ${user.firstName},</strong></p>
                        <p>⏰ Here is the detailed curated report on your today’s task update:</p>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                            <thead>
                                <tr style="background-color: #f2f2f2;">
                                    <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Task Title</th>
                                    <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${taskDetailsHTML}
                            </tbody>
                        </table>
                        <p style="margin-top: 20px;">Please ensure timely completion of the tasks and update their status on the application accordingly.</p>
                        <div style="text-align: center; margin-top: 40px;">
                            <a href="https://zapllo.com/dashboard/tasks" style="background-color: #017a5b; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Task App</a>
                        </div>
                        <p style="margin-top: 20px; font-size: 12px; color: #888888; text-align: center;">This is an automated notification. Please do not reply.</p>
                    </div>
                </div>
            </div>
        </body>`,
        };

        try {
            await sendEmail(emailOptions);
            console.log('Email sent successfully to', user.email);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email notification');
        }
    }

    if (user.reminders.whatsapp) {
        try {
            await sendWebhookNotification(user, reminderTime, overdueCount, pendingCount, inProgressCount);
            console.log('WhatsApp message sent successfully to', user.whatsappNo);
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw new Error('Failed to send WhatsApp notification');
        }
    }
};


export async function GET() {
    try {
        console.log('GET /api/reminders endpoint called');
        await connectDB();
        console.log("MongoDB Connected for reminders!");

        const now = new Date();
        const currentHourMinute = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // Local time in "HH:MM" format
        const todayDay = now.toLocaleDateString('en-US', { weekday: 'short' }); // Get today's day in "Mon", "Tue", etc.

        const users = await User.find({}).exec();
        console.log(`Found ${users.length} users`);

        for (const user of users) {
            if (user.weeklyOffs && user.weeklyOffs.includes(todayDay)) {
                console.log(`Skipping notifications for user: ${user.email} because today (${todayDay}) is a weekly off.`);
                continue;
            }
            console.log(`Checking reminder for user: ${user.email} - Stored Reminder Time: ${user.reminders.dailyReminderTime} - Current Time: ${currentHourMinute}`);
            if (user.reminders && user.reminders.dailyReminderTime === currentHourMinute) {
                console.log(`Sending daily reminder for user: ${user.email}`);
                await sendDailyReminderNotification(user, currentHourMinute);
            } else {
                console.log(`No daily reminder due for user: ${user.email} at ${currentHourMinute}`);
            }
        }

        return new Response(JSON.stringify({ message: 'Daily reminders processed successfully.' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error processing daily reminders:', error);
        return new Response(JSON.stringify({ error: 'Failed to process daily reminders.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

