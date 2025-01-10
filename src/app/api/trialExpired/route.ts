import mongoose from 'mongoose';
import Organization from '../../../models/organizationModel';
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

const sendWebhookNotification = async (user: IUser, trialExpired: string) => {
    const payload = {
        phoneNumber: user.whatsappNo,
        country: user.country,
        templateName: 'trial_expires',
        bodyVariables: [
            user.firstName,
            user.lastName,
            trialExpired,
        ],
    };
    console.log('Payload for WhatsApp notification:', JSON.stringify(payload, null, 2));
    try {
        const response = await fetch('https://zapllo.com/api/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const responseData = await response.text(); // Get the response text
            console.error('Webhook API error response:', responseData);
            throw new Error(`Webhook API error: ${response.status} ${response.statusText}`);
        }
        console.log('WhatsApp notification sent successfully.');
    } catch (error) {
        console.error('Error sending WhatsApp notification:', error);
        throw new Error('Failed to send WhatsApp notification');
    }
};

const sendTrialExpiredNotification = async (user: IUser, trialExpired: string) => {

    const emailOptions: SendEmailOptions = {
        to: user.email,
        subject: "Your Trial has Expired, Upgrade Now!",
        text: `Trial Expired`,
        html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px; ">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 20px; text-align: center; ">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
            </div>
          <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
    <h1 style="margin: 0; font-size: 20px;">Your Trial has Expired</h1>
</div>
                        <div style="padding: 20px;">
                            <p><strong>Dear ${user.firstName} ${user.lastName},</strong></p>
                            <p>We hope you enjoyed your trial with our Task App.</p>
                            <p>⏰ Your trial period has expired on ${trialExpired}</p>
                            <p>We would love for you to continue using our app!</p>
                            <p>✨ Please consider upgrading to one of our premium plans to maintain access to all of your tasks and features.</p>
                            <div style="text-align: center; margin-top: 40px;">
                                <a href="https://zapllo.com/dashboard/tasks" style="background-color: #017a5b; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Upgrade Now</a>
                            </div>
                            <p style="margin-top: 20px; text-align:center; font-size: 12px; color: #888888;">This is an <strong>automated</strong> notification. Please do not reply</p>
                        </div>
                    </div>
                </div>
            </body>`,
    };
    try {
        await sendEmail(emailOptions);
        await sendWebhookNotification(user, trialExpired);
        console.log('Email sent successfully to', user.email);
        console.log('WhatsApp message sent successfully to', user.whatsappNo);
    } catch (error) {
        console.error('Error sending notifications:', error);
    }

};

export async function GET() {
    try {
        console.log('GET /api/trialExpired endpoint called');
        await connectDB();
        console.log("MongoDB Connected for trial expired notifications!");

        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get tomorrow's date at midnight
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Find organizations where trialExpires is today
        // and subscriptionExpires is either not set or has expired
        const organizations = await Organization.find({
            trialExpires: {
                $gte: today,
                $lt: tomorrow
            },
            $or: [
                { subscriptionExpires: { $exists: false } },
                { subscriptionExpires: { $lt: today } }
            ]
        }).exec();

        console.log(`Found ${organizations.length} organizations with trial expiring today and no active subscriptions`);

        // Get the list of organization IDs
        const organizationIds = organizations.map(org => org._id);

        // Query users whose 'organization' field is in the list of organization IDs
        const users = await User.find({ organization: { $in: organizationIds } }).exec();

        console.log(`Found ${users.length} users associated with expiring organizations`);

        // Map organizations for easy access
        const organizationMap = new Map();
        organizations.forEach(org => {
            organizationMap.set(org._id.toString(), org);
        });

        // Process each user
        for (const user of users) {
            if (user) {
                const org = organizationMap.get(user.organization?.toString());
                const trialExpiredDate = formatDate(org.trialExpires);
                console.log(`Sending trial expired notifications to user: ${user.email}`);
                await sendTrialExpiredNotification(user, trialExpiredDate);
            } else {
                console.log('User not found or undefined');
            }
        }

        return new Response(JSON.stringify({ message: 'Trial Expired Notifications processed successfully.' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error processing trial expired notifications', error);
        return new Response(JSON.stringify({ error: 'Failed to process trial expired notifications.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

