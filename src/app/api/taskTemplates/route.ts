// src/app/api/taskTemplates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // your MongoDB connection util
import TaskTemplate from '@/models/templateModel';
import { getDataFromToken } from '@/helper/getDataFromToken';
import User from '@/models/userModel';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Extract user ID from the authentication token
    const userId = await getDataFromToken(request);

    // Find the authenticated user in the database based on the user ID
    const authenticatedUser = await User.findById(userId).select("-password");
    if (!authenticatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse the incoming data
    const data = await request.json();

    // Always set the organization to the authenticated user's organization
    data.organization = authenticatedUser.organization;

    // Create the new template
    const newTemplate = await TaskTemplate.create(data);

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error: any) {
    console.error('Error creating task template:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Extract user ID from the authentication token
    const userId = await getDataFromToken(request);

    // Find the authenticated user in the database based on the user ID
    const authenticatedUser = await User.findById(userId).select("-password");
    if (!authenticatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all templates where template.organization == user's organization
    const tasks = await TaskTemplate.find({
      organization: authenticatedUser.organization,
    }).populate({
      path: 'category',
      select: 'name', // Only include the category name
    });

    return NextResponse.json({
      message: "templates fetched successfully",
      data: tasks,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
