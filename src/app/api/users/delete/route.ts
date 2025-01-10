import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";

connectDB();

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request); // Get authenticated user
    const authenticatedUser = await User.findById(userId);

    if (!authenticatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (authenticatedUser.role !== "orgAdmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { userIdToDelete } = await request.json();
    if (userIdToDelete === userId) {
      return NextResponse.json(
        { error: "You cannot delete yourself" },
        { status: 400 }
      );
    }

    const userToDelete = await User.findById(userIdToDelete);

    if (!userToDelete) {
      return NextResponse.json({ error: "User to delete not found" }, { status: 404 });
    }

    await User.findByIdAndDelete(userIdToDelete); // Delete the user

    return NextResponse.json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error deleting user:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
