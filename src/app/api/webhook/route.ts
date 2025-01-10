import { getCountryCallingCode } from "libphonenumber-js";
import { NextRequest, NextResponse } from "next/server";

const sendWhatsAppMessage = async (phoneNumber: string, templateName: string, mediaUrl: string | null, bodyVariables: string[]) => {
    const payload: any = {
        fullPhoneNumber: phoneNumber,
        type: 'Template',
        template: {
            name: templateName,
            languageCode: 'en',
            bodyValues: bodyVariables,
        },
    };

    // Conditionally add mediaUrl to headerValues if it exists
    if (mediaUrl) {
        payload.template.headerValues = [mediaUrl];
    }
    console.log(payload, 'here is the payload')
    try {
        const response = await fetch('https://api.interakt.ai/v1/public/message/', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${process.env.INTERAKT_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(`Interakt API error: ${responseData.message}`);
        }
        console.log('WhatsApp message sent successfully:', payload);

    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw new Error('Failed to send WhatsApp message');
    }
};

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { phoneNumber, country, bodyVariables, templateName, mediaUrl } = reqBody;

        // Validate input
        if (!phoneNumber || !templateName || !bodyVariables || !Array.isArray(bodyVariables) || bodyVariables.length === 0) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }
        // Validate input

        // Get the country calling code
        const countryCode = getCountryCallingCode(country);

        // Format the full phone number
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;
        // Send WhatsApp message
        await sendWhatsAppMessage(fullPhoneNumber, templateName, mediaUrl, bodyVariables);

        return NextResponse.json({ status: 'success', message: 'WhatsApp message sent successfully' });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
