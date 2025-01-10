import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { SendEmailOptions, sendEmail } from "@/lib/sendEmail";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const token = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_SECRET!, { expiresIn: '1h' });
        const resetLink = `https://zapllo.com/reset-password?token=${token}`;

        const emailOptions: SendEmailOptions = {
            to: email,
            subject: "Reset your password",
            text: `Please use the following link to reset your password: ${resetLink}`,
            html: `
                  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
            <div style="background-color: #f0f4f8; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <div style="padding: 20px; text-align: center;">
                        <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
                    </div>
                    <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
                        <h1 style="margin: 0; font-size: 20px;">Reset Password</h1>
                    </div>
                    <div style="padding: 20px;">
                    <p style="font-size: 16px; color: #000000; margin-bottom: 20px;">
                        Please use the following link to reset your password:
                    </p>
                   
          <div style="text-align: center; margin-top: 40px;">
                            <a href="${resetLink}" style="background-color: #017a5b; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                        </div>
                        <p style="margin-top: 20px; font-size: 12px; color: #888888; text-align: center;">This is an automated notification. Please do not reply.</p>
                    </div>
                </div>
            </div>
        </body>`,
        };

        await sendEmail(emailOptions);

        return NextResponse.json({
            message: "Password reset link sent to your email",
            success: true,
        });
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
