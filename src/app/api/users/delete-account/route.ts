import connectDB from "@/lib/db";
import User from "@/models/userModel";
import Organization from "@/models/organizationModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { SendEmailOptions, sendEmail } from "@/lib/sendEmail";
import { getDataFromToken } from "@/helper/getDataFromToken";
import { Types } from "mongoose";

connectDB();

const sendWebhookNotification = async (
  phoneNumber: string,
  country: string,
  templateName: string,
  bodyVariables: string[]
) => {
  const payload = {
    phoneNumber,
    country,
    bodyVariables,
    templateName,
  };
  console.log(payload, 'payload');
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
    // Get the authenticated user from the token
    let userId: string | null = null;
    try {
      userId = await getDataFromToken(request);
      if (!userId) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
    } catch (err: any) {
      return NextResponse.json(
        { error: "Authentication error: " + err.message },
        { status: 401 }
      );
    }

    // Get request body
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify email matches authenticated user
    if (user.email !== email) {
      return NextResponse.json(
        { error: "Email does not match the authenticated user" },
        { status: 400 }
      );
    }


    if (password !== user.password) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 400 }
      );
    }

    // Check if user is an organization admin
    if (user.role === "orgAdmin" && user.organization) {
      // Count users in organization
      const usersInOrg = await User.countDocuments({
        organization: user.organization,
      });

      if (usersInOrg > 1) {
        return NextResponse.json(
          {
            error:
              "You must transfer ownership or delete your organization before deleting your account",
          },
          { status: 400 }
        );
      }

      // If user is the only one in the organization, we can delete the organization
      await Organization.findByIdAndDelete(user.organization);
    }

    // Set deletion date (14 days from now)
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 14);

    const formatDate = (date: Date): string => {
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      };
      return date
        .toLocaleDateString("en-GB", options)
        .replace(/ /g, "-");
    };

    const formattedDeletionDate = formatDate(deletionDate);

    // Update user status to deactivated and mark for deletion
    await User.findByIdAndUpdate(userId, {
      status: "Deactivated",
      verifyToken: "PENDING_DELETION",
      verifyTokenExpiry: deletionDate,
    });

    // Send confirmation email
    const emailSubject = "Account Deletion Request - Zapllo";
    const emailText = `Dear ${user.firstName},\n\nWe have received your request to delete your Zapllo account...`;
    const emailHtml = `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="padding: 20px; text-align: center;">
         <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
        </div>
        <div style="background: linear-gradient(90deg, #F57E57, #FF5A5A); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
          <h1 style="margin: 0; font-size: 20px;">Account Deletion Request</h1>
        </div>
        <div style="padding: 20px;">
          <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1731854541/account_deletion_qwdodx.png" alt="Account Deletion Illustration" style="max-width: 100%; height: auto;">
        </div>
        <div style="padding: 20px;">
          <p>Dear <strong>${user.firstName},</strong></p>
          <p>We have received your request to delete your Zapllo account. Your account has been deactivated and will be permanently deleted on <strong>${formattedDeletionDate}</strong>.</p>
          <p>During this 14-day period:</p>
          <ul>
            <li>You won't be able to access your account</li>
            <li>Your data will remain stored but inaccessible</li>
            <li>You can cancel the deletion process by contacting our support team</li>
          </ul>
          <p>Once the waiting period ends, all your personal data will be permanently deleted, including:</p>
          <ul>
            <li>Your profile information</li>
            <li>Your leave history and balances</li>
            <li>Your attendance records</li>
            <li>Your task history</li>
            <li>Your face recognition data</li>
            <li>Your bank and legal document information</li>
          </ul>
          <div style="background-color: #f8f9fa; border-left: 4px solid #0C874B; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Changed your mind?</strong> If you wish to cancel this deletion request, please contact our support team at <a href="mailto:support@zapllo.com" style="color: #0C874B;">support@zapllo.com</a> before the deletion date.</p>
          </div>
          <p>We're sorry to see you go. Thank you for being a part of Zapllo.</p>
          <p style="margin-top: 20px; font-size: 12px; text-align: center; color: #888888;">This is an automated notification. Please do not reply.</p>
        </div>
      </div>
    </div>
  </body>`;

    const emailOptions: SendEmailOptions = {
      to: user.email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    };

    await sendEmail(emailOptions);

    // Send WhatsApp notification
    if (user.whatsappNo && user.country) {
      const templateName = 'accountdeletion';
      const bodyVariables = [user.firstName, formattedDeletionDate];
      await sendWebhookNotification(
        user.whatsappNo,
        user.country,
        templateName,
        bodyVariables
      );
    }

    // Clear the authentication cookie
    const response = NextResponse.json({
      message: "Account deletion request received successfully. Your account will be permanently deleted after 14 days.",
      success: true,
    });

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
