import connectDB from "@/lib/db";
import Tutorial from "@/models/tutorialModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const tutorial = await Tutorial.findById(params.id);

    if (!tutorial) {
      return NextResponse.json(
        { success: false, message: "Tutorial not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, tutorial });
  } catch (error) {
    console.error("Failed to fetch tutorial:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tutorial." },
      { status: 500 }
    );
  }
}
