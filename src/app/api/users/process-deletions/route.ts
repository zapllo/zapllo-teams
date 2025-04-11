import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
  try {

    const now = new Date();

    // Find all users marked for deletion where the grace period has expired
    const usersToDelete = await User.find({
      verifyToken: "PENDING_DELETION",
      verifyTokenExpiry: { $lt: now },
      status: "Deactivated"
    });

    console.log(`Found ${usersToDelete.length} accounts to permanently delete`);

    let deletedCount = 0;

    // Process each user for deletion
    for (const user of usersToDelete) {
      try {
        // Permanently delete the user's data
        await User.findByIdAndDelete(user._id);
        deletedCount++;
        console.log(`Successfully deleted user: ${user.email}`);
      } catch (deleteError) {
        console.error(`Error deleting user ${user.email}:`, deleteError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed account deletions. ${deletedCount} accounts permanently deleted.`,
      deletedCount
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
