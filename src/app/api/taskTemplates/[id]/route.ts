// /src/app/api/taskTemplates/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TaskTemplate from "@/models/templateModel";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // We can read :id from params
    const templateId = params.id;

    // 1) Auth
    const userId = await getDataFromToken(request);
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2) Make sure the template belongs to the user's organization
    const existing = await TaskTemplate.findOne({
      _id: templateId,
      organization: user.organization,
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Template not found or not in your org" },
        { status: 404 }
      );
    }

    // 3) Delete
    await TaskTemplate.deleteOne({ _id: templateId });

    return NextResponse.json(
      { message: "Template deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting template:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// PUT: Edit an existing template
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const templateId = params.id;

    // Auth
    const userId = await getDataFromToken(request);
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure template belongs to user's org
    const existing = await TaskTemplate.findOne({
      _id: templateId,
      organization: user.organization,
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Template not found or not in your org" },
        { status: 404 }
      );
    }

    // Grab updated fields from request body
    const body = await request.json();

    // Update
    const updatedTemplate = await TaskTemplate.findOneAndUpdate(
      { _id: templateId, organization: user.organization },
      { $set: body },
      { new: true }
    );

    if (!updatedTemplate) {
      return NextResponse.json(
        { error: "Failed to update template" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { data: updatedTemplate, message: "Template updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating template:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}