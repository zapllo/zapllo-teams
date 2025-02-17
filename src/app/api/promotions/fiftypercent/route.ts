import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User, { IUser } from "@/models/userModel";
import fetch from "node-fetch";


const WEBHOOK_URL = "https://zapllo.com/api/webhook";
const TEMPLATE_NAME = "admin_success_login_after_1_hours";
const mediaUrl = 'https://res.cloudinary.com/dndzbt8al/image/upload/v1732650791/50_t0ypt5.png';

// Function to send webhook notification
const sendWebhookNotification = async (admin: IUser) => {
    const payload = {
        phoneNumber: admin.whatsappNo,
        country: admin.country,
        bodyVariables: [admin.firstName],
        templateName: TEMPLATE_NAME,
        mediaUrl,
    };
    console.log("Payload for webhook:", payload);

    try {
        await connectDB();
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const responseData = await response.json();
            console.error("Webhook API error:", responseData);
            throw new Error(`Webhook API error: ${responseData.message || "Unknown error"}`);
        }

        console.log("Webhook notification sent successfully:", payload);
    } catch (error) {
        console.error("Error sending webhook notification:", error);
        throw new Error("Failed to send webhook notification");
    }
};

// Endpoint logic
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const results = [];

        while (true) {
            // Find and update a single orgAdmin atomically
            const admin = await User.findOneAndUpdate(
                {
                    role: "orgAdmin",
                    createdAt: { $lte: oneHourAgo },
                    promotionNotification: false,
                },
                { $set: { promotionNotification: true } }, // Mark as notified
                { new: true } // Return the updated document
            );

            console.log("Query conditions:", {
                role: "orgAdmin",
                createdAt: { $lte: oneHourAgo },
                promotionNotification: false,
            });
            console.log("One hour ago timestamp:", oneHourAgo);


            console.log(admin, 'admin?')
            if (!admin) {
                break; // No more pending notifications
            }

            try {
                // Send the webhook notification
                await sendWebhookNotification(admin);
                results.push({ adminId: admin._id, success: true });
            } catch (error: any) {
                console.error(`Failed to notify admin ${admin._id}:`, error.message);

                // Rollback the promotionNotification flag
                await User.findByIdAndUpdate(admin._id, { $set: { promotionNotification: false } });

                results.push({ adminId: admin._id, success: false, error: error.message });
            }
        }

        return NextResponse.json({
            message: "Notification process completed",
            results,
        });
    } catch (error: any) {
        console.error("Error in promotion notification process:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
