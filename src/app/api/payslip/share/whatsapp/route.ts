import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { userId, month, year } = await request.json();

        // Fetch user data
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User to share not found" }, { status: 404 });
        }

        // Extract the user's WhatsApp phone number and country
        const phoneNumber = user.whatsappNo;
        const country = user.country; // Assuming country code is stored here

        if (!phoneNumber || !country) {
            return NextResponse.json({ error: "User phone number or country is missing" }, { status: 400 });
        }
        const uniqueLink = `https://zapllo.com/dashboard/teams/${userId}/payslip/${month}-${year}`
        // Prepare payload for webhook
        const payload = {
            phoneNumber,
            country,
            bodyVariables: [uniqueLink, month, year],
            templateName: "payslip_details_v2", // Replace with your actual template name
            mediaUrl: null, // Optional media URL, if needed
        };
        console.log(payload, 'payload')

        // Call the webhook endpoint
        const response = await fetch("https://zapllo.com/api/webhook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        console.log(response, 'responseeeeeeeeeee!')

        // Handle webhook response
        if (!response.ok) {
            const responseData = await response.json();
            console.error("Webhook API error:", responseData);
            return NextResponse.json({ error: "Failed to send WhatsApp message" }, { status: 500 });
        }

        return NextResponse.json({ message: "WhatsApp message sent successfully" });
    } catch (error) {
        console.error("Error sending WhatsApp message:", error);
        return NextResponse.json({ error: "Failed to send WhatsApp message" }, { status: 500 });
    }
}
