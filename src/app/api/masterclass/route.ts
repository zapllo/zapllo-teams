import { sendEmail, SendEmailOptions } from "@/lib/sendEmail";
import { NextRequest, NextResponse } from "next/server";

// Helper function to format date and time if needed
const formatDate = (dateInput: string | Date): string => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const optionsDate: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "2-digit" };
    const optionsTime: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
    const formattedDate = new Intl.DateTimeFormat("en-GB", optionsDate).format(date);
    const formattedTime = new Intl.DateTimeFormat("en-GB", optionsTime).format(date);
    const timeParts = formattedTime.match(/(\d{1,2}:\d{2})\s*(AM|PM)/);
    const formattedTimeUppercase = timeParts ? `${timeParts[1]} ${timeParts[2].toUpperCase()}` : formattedTime;

    return `${formattedDate} ${formattedTimeUppercase}`;
};

// API route handler
export async function POST(request: NextRequest) {
    try {
        // Extract the email and other details from the incoming request (e.g., from a form submission)
        const { email, date, time, masterclassUrl } = await request.json();

        if (!email || !date || !time) {
            return NextResponse.json({ error: "Missing required data (email, date, or time)" }, { status: 400 });
        }

        // Define the email content and structure
        const emailOptions: SendEmailOptions = {
            to: email, // The email to send to
            text: "[Confirmation] Your registration has been confirmed for the event: Business Automation Masterclass",
            subject: "[Confirmation] Your registration has been confirmed for the event: Business Automation Masterclass",
            html: `
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="background-color: #f0f4f8; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <div style="padding: 20px; text-align: center;">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
              </div>
              <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
                <h1 style="margin: 0; font-size: 20px;">Registration Successful</h1>
              </div>
              <div style="padding: 20px;">
                <p>In this Masterclass, you'll discover how you can streamline your business operations and 5X your business productivity.</p>
                <div style="border-radius:8px; margin-top:4px; color:#000000; padding:10px; background-color:#ECF1F6">
                  <p><strong>Workshop Details</strong></p>
                  <p><strong>Event Name:</strong> Business Automation Masterclass</p>
                  <p><strong>Date:</strong> ${date}</p>
                  <p><strong>Time:</strong> ${time}</p>
                </div>
                <p>Here's what you will learn in 2 hours:</p>
                <ul>
                  <li>✅ Why You Need to be System Dependent Instead of People Dependent</li>
                  <li>✅ Discover the True Potential of the TASK DELEGATION APP 2.0</li>
                  <li>✅ Automate Any Business Process Using TASK & WhatsApp in Less Than 10 Minutes</li>
                  <li>✅ Business Automation Checklist</li>
                  <li>✅ What Can You Do with WhatsApp Automation?</li>
                  <li>✅ Seamless Leave, Attendance & Payroll Management</li>
                  <li>✅ How to Start Your Business Automation Journey</li>
                </ul>
                <div style="text-align: center; margin-top: 20px;">
                 <a href="${masterclassUrl}" style="background-color: #0C874B; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join LIVE Masterclass</a>
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
