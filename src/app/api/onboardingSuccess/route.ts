import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Onboarding from '@/models/onboardingModel'; // Adjust path as necessary
import connectDB from '@/lib/db';
import { sendEmail, SendEmailOptions } from '@/lib/sendEmail';

const sendWebhookNotification = async (user: any) => {
    const payload = {
        phoneNumber: user.whatsappNo,
        country: user.countryCode, // Ensure this field exists on the user model
        templateName: 'onboarding_purchased',
        bodyVariables: [
            user.firstName,
            user.planName,
            user.companyName,
            user.subscribedUserCount,
            user.email,
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
            const responseData = await response.text();
            console.error('Webhook API error response:', responseData);
            throw new Error(`Webhook API error: ${response.status} ${response.statusText}`);
        }

        console.log('WhatsApp notification sent successfully.');
    } catch (error) {
        console.error('Error sending WhatsApp notification:', error);
        throw new Error('Failed to send WhatsApp notification');
    }
};

export async function POST(request: NextRequest) {
    const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        firstName,
        lastName,
        companyName,
        industry,
        email,
        whatsappNo,
        amount,
        countryCode,
        planName,
        subscribedUserCount,
    } = await request.json();

    // Compute the expected signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest('hex');

    // Verify the signature
    if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    try {
        await connectDB();


        // Save the onboarding details in the database
        const onboardingData = {
            firstName,
            lastName,
            companyName,
            industry,
            email,
            countryCode,
            whatsappNo,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            amount,
            planName,
            subscribedUserCount,
            createdAt: new Date(),
        };

        const newOnboarding = new Onboarding(onboardingData);
        await newOnboarding.save();

        // **Send Email Notification**
        const emailOptions: SendEmailOptions = {
            to: email,
            subject: 'Thank You for Your Purchase',
            text: `Hi ${firstName},

🎉 Thank you so much for your purchase.

We are excited to get you up and running soon.

One of our onboarding specialists will connect with you soon and get your workspace up and running.

Regards,
Zapllo Support Team`,
            html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px; ">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 20px; text-align: center; ">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
            </div>
            <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
                <h1 style="margin: 0; font-size: 20px;">Thank You for Your Purchase</h1>
            </div>
            <div style="padding: 20px; color:#000000;">
                            <p>Hi ${firstName},<br/>
                         <p style="margin-top:4px;">Thank you for subscribing to the ${planName} ! 🎉</p>
                           <p style="margin-top:4px;">We are excited to get you up and running soon. Here are your subscription details: </p>
                            <div style="border-radius:8px; margin-top:4px; color:#000000; padding:10px; background-color:#ECF1F6">
                          <p><strong>Company Name:</strong> ${companyName}</p>
                          <p><strong>Total Users Subscribed:</strong> ${subscribedUserCount}</p>
                          <p><strong>Subscription Email ID:</strong> ${email}</p> 
                           </div>
                             <p style="margin-top:4px;">One of our onboarding specialists will connect with you soon and get your workspace up and running.</p>
                  Regards,</br>
                  <p style="margin-top:4px;">Zapllo Support Team </p>
                  </p>
                              <p style="margin-top: 20px; text-align:center; font-size: 12px; color: #888888;">This is an automated notification. Please do not reply.</p>
                          </div>
                      </div>
                  </div>
              </body>`,
        };
        try {
            await sendEmail(emailOptions);
            console.log('Email sent successfully to', email);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }

        // **Send WhatsApp Notification**
        const user = {
            whatsappNo,
            firstName,
            countryCode,
            companyName,
            email,
            subscribedUserCount,
            planName,
        };

        console.log(user, 'check!')
        try {
            await sendWebhookNotification(user);
        } catch (webhookError) {
            console.error('Error sending WhatsApp notification:', webhookError);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving onboarding data: ', error);
        return NextResponse.json({ error: 'Error saving onboarding data' }, { status: 500 });
    }
}
