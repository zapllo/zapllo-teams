import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";
import Organization from "@/models/organizationModel";
import connectDB from "@/lib/db";
import { subDays } from "date-fns";

// Connect to database
connectDB();

export async function GET(request: NextRequest) {
  try {
    // Get user ID from token
    const userId = await getDataFromToken(request);
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Find the organization
    const organization = await Organization.findById(user.organization)
      .populate({
        path: 'aiCreditsHistory.user',
        select: 'firstName lastName email'
      });

    if (!organization) {
      return NextResponse.json({
        success: false,
        error: "Organization not found"
      }, { status: 404 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all'; // 'usage', 'recharge', or 'all'
    const days = searchParams.get('days') ? parseInt(searchParams.get('days') as string) : 30;

    // Calculate the start date (default to last 30 days)
    const startDate = subDays(new Date(), days);

    // Define the type for history items
    interface CreditHistoryItem {
      type: string;
      date: Date;
      user: any;
      credits: number;
      amount: number;
      transactionId: string;
      task?: string;
    }

    // Get the history from the organization
    let history: CreditHistoryItem[] = organization.aiCreditsHistory || [];

    // Filter by type if specified
    if (type !== 'all') {
      history = history.filter((item: CreditHistoryItem) => item.type === type);
    }

    // Filter to only include items from the start date
    history = history.filter((item: CreditHistoryItem) => new Date(item.date) >= startDate);

    // Sort by date (newest first)
    history.sort((a: CreditHistoryItem, b: CreditHistoryItem) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({
      success: true,
      data: history
    });

  } catch (error: any) {
    console.error("Error fetching AI credits history:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
