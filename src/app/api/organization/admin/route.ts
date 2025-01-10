import connectDB from "@/lib/db";
import Organization from "@/models/organizationModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(request: NextRequest) {
    try {
        const organizations = await Organization.find().populate('users');

        return NextResponse.json({
            message: "Organizations fetched successfully",
            data: organizations,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const { organizationId, extensionDays, revoke } = await request.json();

        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        }

        if (revoke) {
            // Set the trialExpires date to now to revoke access
            organization.trialExpires = new Date();
        } else {
            // Extend the trial period
            const newTrialDate = new Date(organization.trialExpires);
            if (isNaN(newTrialDate.getTime())) {
                return NextResponse.json({ error: "Invalid trialExpires date" }, { status: 400 });
            }
            newTrialDate.setDate(newTrialDate.getDate() + extensionDays);
            organization.trialExpires = newTrialDate;
        }

        await organization.save();

        return NextResponse.json({
            message: "Operation successful",
            data: organization,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
