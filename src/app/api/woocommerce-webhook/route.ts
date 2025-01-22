import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import WoocommerceLead from '@/models/woocomercelead';

export async function POST(req: NextRequest) {
    try {
        const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET; // Add this to your .env file
        const rawBody = await req.text(); // Raw body for signature verification

        // Ensure the secret is defined
        if (!secret) {
            console.error('WOOCOMMERCE_WEBHOOK_SECRET is not defined');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Validate the webhook signature
        const signature = req.headers.get('x-wc-webhook-signature');
        const hash = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');

        if (signature !== hash) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }

        // Parse the webhook data
        const data = JSON.parse(rawBody);

        // Log the raw data to understand the structure
        console.log('Received WooCommerce Webhook Data:', JSON.stringify(data, null, 2));

        // Temporarily return the raw data for debugging purposes
        return NextResponse.json({ message: 'Webhook data received', data });

        // Uncomment the following after confirming the response structure
        // await connectDB();

        // Save the lead data to the database
        // const lead = new WoocommerceLead({
        //     firstName: data.billing.first_name,
        //     lastName: data.billing.last_name,
        //     email: data.billing.email,
        //     phone: data.billing.phone,
        // });
        //
        // await lead.save();

        // return NextResponse.json({ message: 'Lead captured successfully' });
    } catch (error) {
        console.error('Error handling WooCommerce webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
