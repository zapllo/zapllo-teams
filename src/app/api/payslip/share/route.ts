import { sendEmail, SendEmailOptions } from "@/lib/sendEmail";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

// API route handler
export async function POST(request: NextRequest) {
    try {
        // Extract the email and other details from the incoming request (e.g., from a form submission)
        const { userId, month, year } = await request.json();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User to share not found" }, { status: 404 });
        }
        // Define the email content and structure
        const emailOptions: SendEmailOptions = {
            to: user?.email, // The email to send to
            text: "Payslip Generated",
            subject: `Your Payslip has been Generated for ${month}-${year}`,
            html: `
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="background-color: #f0f4f8; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <div style="padding: 20px; text-align: center;">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
              </div>
              <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
                <h1 style="margin: 0; font-size: 20px;">Payslip Generated</h1>
              </div>
              <div style="padding: 20px;">
                <p>Your payslip for ${month}-${year} has been successfully generated, please click the following button to access your payslip details</p>
                
                <div style="text-align: center; margin-top: 20px;">
                 <a href="https://zapllo.com/dashboard/teams/${userId}/payslip/${month}-${year}" style="background-color: #0C874B; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Payslip</a>
                </div>
                <p style="margin-top:20px; text-align:center; font-size: 12px; color: #888888;">This is an automated notification. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>`,
        };

        // Send the email
        await sendEmail(emailOptions);

        return NextResponse.json({ message: "Registration confirmation email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}
