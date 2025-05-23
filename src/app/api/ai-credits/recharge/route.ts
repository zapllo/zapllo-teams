import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";
import Organization from "@/models/organizationModel";
import connectDB from "@/lib/db";
import crypto from 'crypto';

// Connect to database
connectDB();

export async function POST(request: NextRequest) {
  try {
    // Get user ID from token
    const userId = await getDataFromToken(request);
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Parse request body
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      credits,
      amount,
      gstNumber
    } = await request.json();

    // Verify the payment is legitimate
    // This should match your implementation in the payment verification endpoint
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({
        success: false,
        error: "Payment verification failed"
      }, { status: 400 });
    }

    // Find the organization and update its AI credits
    const organization = await Organization.findById(user.organization);

    if (!organization) {
      return NextResponse.json({
        success: false,
        error: "Organization not found"
      }, { status: 404 });
    }

    // Add the credits to the organization
    organization.aiCredits += credits;

    // Save the transaction in the rechargeHistory
    if (!organization.aiCreditsHistory) {
      organization.aiCreditsHistory = [];
    }

    organization.aiCreditsHistory.push({
      amount: amount,
      credits: credits,
      transactionId: razorpay_payment_id,
      date: new Date(),
      type: 'recharge',
      user: userId,
      gstNumber: gstNumber || null
    });

    await organization.save();

    return NextResponse.json({
      success: true,
      message: "AI credits added successfully",
      aiCredits: organization.aiCredits
    });

  } catch (error: any) {
    console.error("Error in AI credits recharge:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
