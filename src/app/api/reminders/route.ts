import mongoose from 'mongoose';
import Task from '../../../models/taskModal';
import User, { IUser } from '../../../models/userModel';
import connectDB from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import Category from '@/models/categoryModel';
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


const sendWebhookNotification = async (task: any, assignedUser: any, reminderTime: string, formattedDueDate: string) => {
    const payload = {
        phoneNumber: assignedUser.whatsappNo, // Ensure this field exists on the user model
        country: assignedUser.country, // Ensure this field exists on the user model
        templateName: 'reminder_template',
        bodyVariables: [
            assignedUser.firstName,      // {{1}}
            reminderTime,                // {{2}}
            task.category.name,          // {{3}}
            task.title,                  // {{4}}
            formattedDueDate,            // {{5}}
            task.priority,               // {{6}}
        ],
    };
    console.log(payload, 'payload')
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
        console.log('Webhook notification sent successfully:', payload);
    } catch (error) {
        console.error('Error sending webhook notification:', error);
        throw new Error('Failed to send webhook notification');
    }
};


const sendReminderNotification = async (task: any, reminder: any, assignedUser: any) => {
    console.log(`Sending ${reminder.notificationType} reminder for task: ${task.title} to user: ${assignedUser.email}`);

    const reminderTime = `${reminder.value ?? 'N/A'}`;
    const formattedDueDate = formatDate(task.dueDate);

    // Email Reminder
    if (reminder.notificationType === 'email' && !reminder.sent && assignedUser.notifications.email) {
        console.log('Preparing to send email reminder');
        if (reminder.value > 0) {
            console.log('Sending email reminder to', assignedUser.email);
            const emailOptions: SendEmailOptions = {
                to: `${assignedUser.email}`,
                subject: "Task Reminder",
                text: `Zapllo`,
                html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px; ">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 20px; text-align: center; ">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
            </div>
          <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
    <h1 style="margin: 0; font-size: 20px;">Task Reminder</h1>
</div>
                     <div style="padding: 20px; color:#000000;">
                <p><strong>Dear ${assignedUser.firstName},</strong></p>
                <p>A task assigned to you is due in <strong>${reminderTime}</strong> minutes ⏰</p>
                <p>Here are the task details:</p>
                 <div style="border-radius:8px; margin-top:4px; color:#000000; padding:10px; background-color:#ECF1F6">
                <p><strong>Category:</strong> ${task.category.name}</p>
                <p><strong>Task:</strong> ${task.title}</p>
                <p><strong>Due Date:</strong> ${formattedDueDate}</p>
                <p><strong>Priority:</strong> ${task.priority}</p>  
                </div>
                <div style="text-align: center; margin-top: 40px;">
                    <a href="https://zapllo.com/dashboard/tasks" style="background-color: #017a5b; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Task App</a>
                </div>
                <p style="margin-top: 20px; font-size: 12px; text-align:center; color: #888888;">This is an automated notification. Please do not reply</p>
            </div>
        </div>
    </div>
</body>`,
            };
            try {
                console.log('sending email')
                await sendEmail(emailOptions);
                console.log('Email sent successfully to', assignedUser.email);
                reminder.sent = true; // Mark this specific reminder as sent
            } catch (error) {
                console.error('Error sending email:', error);
                throw new Error('Failed to send email notification');
            }
        } else {
            console.log('Reminder type not supported or user has disabled notifications');
        }
    } else if (reminder.notificationType === 'whatsapp' && assignedUser.notifications.whatsapp) {
        console.log('Preparing to send WhatsApp reminder');
        console.log('Sending WhatsApp reminder to', assignedUser.whatsappNo);
        try {
            await sendWebhookNotification(task, assignedUser, reminderTime, formattedDueDate);
            console.log('WhatsApp message sent successfully to', assignedUser.whatsappNo);
            reminder.sent = true; // Mark this specific reminder as sent
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw new Error('Failed to send WhatsApp notification');
        }
    } else {
        console.log('Email reminder already sent or user has disabled email notifications');
    }
    // Save task to update reminder sent status
    try {
        await task.save();
        console.log('Task updated with sent reminders');
        console.log('Registered Models:', mongoose.models);
        const users = await User.find({});
        console.log(`Found ${users.length} users`);
        const category = await Category.find({});
        console.log(`Found ${category.length} categories`);

    } catch (error) {
        console.error('Error saving task:', error);
        throw new Error('Failed to save task after sending reminders');
    }
};



export async function GET() {
    // console.log("GET ENDPOINT");
    try {
        console.log('GET /api/reminders endpoint called');
        await connectDB();
        console.log("MongoDB Connected for reminders!");

        const now = new Date();
        const nowUTC = new Date(now.toISOString());
        console.log('Current UTC time:', nowUTC.toISOString());
        const todayDay = now.toLocaleDateString('en-US', { weekday: 'short' }); // Get today's day in "Sun", "Mon", etc.
        const tasks = await Task.find()
            .populate<{ assignedUser: IUser }>('assignedUser')
            .populate('category')
            .exec();
        console.log(`Found ${tasks.length} tasks`);



        for (const task of tasks) {
            console.log(`Processing task: ${task.title}, dueDate: ${task.dueDate}`);

            const assignedUser = task.assignedUser;
            if (!assignedUser) {
                console.error('Assigned user is missing');
                continue;
            }
            // Check if today is a weekly off day for the assigned user
            if (assignedUser.weeklyOffs && assignedUser.weeklyOffs.includes(todayDay)) {
                console.log(`Skipping reminders for user: ${assignedUser.email} because today (${todayDay}) is a weekly off.`);
                continue;
            }
            for (const reminder of task.reminders) {
                let reminderDate = new Date(task.dueDate);

                // Adjust reminderDate based on the reminder type
                if (reminder.type === 'minutes' && reminder.value) {
                    reminderDate.setMinutes(reminderDate.getMinutes() - reminder.value);
                } else if (reminder.type === 'hours' && reminder.value) {
                    reminderDate.setHours(reminderDate.getHours() - reminder.value);
                } else if (reminder.type === 'days' && reminder.value) {
                    reminderDate.setDate(reminderDate.getDate() - reminder.value);
                } else if (reminder.type === 'specific' && reminder.date) {
                    reminderDate = new Date(reminder.date);
                }

                console.log(`Calculated reminderDate for ${reminder.notificationType}: ${reminderDate.toISOString()}`);

                // Check if the reminder is due
                if (reminderDate <= nowUTC && !reminder.sent) {
                    console.log(`${reminder.notificationType} reminder is due now or overdue`);
                    const assignedUser = task.assignedUser;
                    if (!assignedUser) {
                        console.error('Assigned user is missing');
                        continue;
                    }
                    console.log('sending email')
                    await sendReminderNotification(task, reminder, assignedUser);
                } else {
                    console.log(`No due reminders for this task: ${task.title}`);
                }
            }
        }
        return new Response(JSON.stringify({ message: 'Reminders processed successfully.' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error processing reminders:', error);
        return new Response(JSON.stringify({ error: 'Failed to process reminders.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
