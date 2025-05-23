import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";
import Organization from "@/models/organizationModel";
import connectDB from "@/lib/db";
import { subDays, format, eachDayOfInterval } from "date-fns";

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
    const organization = await Organization.findById(user.organization);

    if (!organization) {
      return NextResponse.json({
        success: false,
        error: "Organization not found"
      }, { status: 404 });
    }

    // Calculate dates for different time periods
    const today = new Date();
    const last30Days = subDays(today, 30);
    const lastWeekStart = subDays(today, 7);
    const previousWeekStart = subDays(today, 14);

    // Get the history from the organization
    interface CreditHistoryItem {
      type: string;
      date: Date | string;
      credits: number;
    }
    const history: CreditHistoryItem[] = organization.aiCreditsHistory || [];

    // Calculate usage statistics
    const usageHistory = history.filter((item: CreditHistoryItem) =>
      item.type === 'usage' && new Date(item.date) >= last30Days
    );

    const lastWeekUsage = usageHistory.filter(item =>
      new Date(item.date) >= lastWeekStart
    ).reduce((sum, item) => sum + item.credits, 0);

    const previousWeekUsage = usageHistory.filter(item =>
      new Date(item.date) >= previousWeekStart && new Date(item.date) < lastWeekStart
    ).reduce((sum, item) => sum + item.credits, 0);

    // Generate daily usage data for the chart
    // Create an array of all dates in the past 30 days
    const dateRange = eachDayOfInterval({ start: last30Days, end: today });

    const dailyUsage = dateRange.map(date => {
      const dateString = format(date, 'yyyy-MM-dd');
      const usage = usageHistory
        .filter(item => format(new Date(item.date), 'yyyy-MM-dd') === dateString)
        .reduce((sum, item) => sum + item.credits, 0);

      return {
        date: dateString,
        usage: usage
      };
    });

    // Recent transactions (last 5 recharges)
    const recentTransactions = history
      .filter((item: CreditHistoryItem) => item.type === 'recharge')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    // Return the summary data
    return NextResponse.json({
      success: true,
      data: {
        currentCredits: organization.aiCredits,
        dailyUsage,
        lastWeekUsage,
        previousWeekUsage,
        percentChange: previousWeekUsage === 0
          ? 100
          : ((lastWeekUsage - previousWeekUsage) / previousWeekUsage) * 100,
        totalUsage: usageHistory.reduce((sum, item) => sum + item.credits, 0),
        recentTransactions
      }
    });

  } catch (error: any) {
    console.error("Error fetching AI credits summary:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
