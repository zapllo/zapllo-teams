// api/organization/create.js

import connectDB from "@/lib/db";
import Organization from "@/models/organizationModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { userId, companyName, industry, teamSize, description, categories } = reqBody;

        // Create the new organization
        const newOrganization = new Organization({
            companyName,
            industry,
            teamSize,
            description,
            categories,
            trialExpires: new Date(), // You might want to set a trial expiration date here
            users: [userId], // Add the user to the users array
        });

        // Save the new organization
        const savedOrganization = await newOrganization.save();

        // Associate the organization with the user
        await User.findByIdAndUpdate(userId, { $set: { organization: savedOrganization._id } });

        return NextResponse.json({
            message: "Organization created successfully",
            success: true,
            organization: savedOrganization,
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
