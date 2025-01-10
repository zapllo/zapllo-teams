import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/leads';
import { SendEmailOptions, sendEmail } from '@/lib/sendEmail';

export const dynamic = 'force-dynamic'; // Ensures the route is always dynamic

const sendWebhookNotification = async (phoneNumber: string, country: string, templateName: string, firstName: string,) => {
    const payload = {
        phoneNumber,
        country,
        bodyVariables: [firstName],
        templateName,
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
        console.log('Webhook notification sent successfully:', payload);
    } catch (error) {
        console.error('Error sending webhook notification:', error);
        throw new Error('Failed to send webhook notification');
    }
};

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email, firstName, lastName, message, mobNo } = await request.json();

        if (!email || !firstName || !lastName || !mobNo || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const existingLead = await Lead.findOne({ email });

        if (existingLead) {
            return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 });
        }

        const newLead = new Lead({ email, firstName, lastName, message, mobNo });
        await newLead.save();

        const emailOptions: SendEmailOptions = {
            to: email,
            cc: 'support@zapllo.com',
            subject: 'We have Received Your Inquiry',
            text: `Zapllo`,
            html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px; ">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 20px; text-align: center; ">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
            </div>
          <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
    <h1 style="margin: 0; font-size: 20px;">Thanks for Reaching Out!</h1>
</div>
 <div style="padding: 20px; color:#000000;">
               <p> Dear <strong>${firstName}</strong>,\n\n<p>Thank you for reaching out to Zapllo!</p></p>
               <p>Our team is already on it, and you can expect to hear back from us within the next 24 hours.In the meantime, feel free to explore our website to learn more about what we offer and how we can assist you.</p>\n\nThanks & Regards\n
               <p><strong>Team Zapllo</strong></p>
               </div>`,
        };
        await sendEmail(emailOptions);
        const mediaUrl = "https://res.cloudinary.com/dndzbt8al/image/upload/v1732650791/50_t0ypt5.png";
        const templateName = 'leadenquirycontactus';
        try {
            await sendWebhookNotification(mobNo, "IN", templateName, firstName);
        } catch (error) {
            console.warn("WhatsApp notification failed, but proceeding with response:", error);
        }

        return NextResponse.json({ message: 'Lead Captured successfully!' }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const leads = await Lead.find({});
        return NextResponse.json(leads, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
