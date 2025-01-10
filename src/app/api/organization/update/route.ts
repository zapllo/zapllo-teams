import connectDB from "@/lib/db";
import User from "@/models/userModel";
import Organization from "@/models/organizationModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";

connectDB();

export async function PATCH(request: NextRequest) {
  try {
    // Extract user ID from the authentication token
    const userId = await getDataFromToken(request);

    // Find the authenticated user in the database based on the user ID
    const authenticatedUser = await User.findById(userId);
    if (!authenticatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the organization details based on the user's organization ID
    const organization = await Organization.findById(authenticatedUser.organization);
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Parse the request body to get the updated fields
    const reqBody = await request.json();
    const { companyName, industry, description, teamSize } = reqBody;

    // Update the organization fields
    if (companyName) organization.companyName = companyName;
    if (industry) organization.industry = industry;
    if (description) organization.description = description;
    if (teamSize) organization.teamSize = teamSize;

    // Save the updated organization
    const updatedOrganization = await organization.save();

    return NextResponse.json({
      message: "Organization updated successfully",
      data: updatedOrganization,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
