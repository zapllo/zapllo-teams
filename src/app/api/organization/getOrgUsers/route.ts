import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import Organization from "@/models/organizationModel";

connectDB();

export async function GET(request: NextRequest) {
    try {
        // Extract admin user ID from token
        const adminUserId = await getDataFromToken(request);

        // Find the admin user
        const adminUser = await User.findById(adminUserId).select("-password");
        if (!adminUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if the user is an admin or orgAdmin
        if (adminUser.role !== 'orgAdmin') {
            return NextResponse.json({ error: "Only admins can access this resource" }, { status: 403 });
        }

        // Get the organization
        const organization = await Organization.findById(adminUser.organization);
        if (!organization) {
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        }



        // Get all users in the organization who have registered faces
        // Join with FaceRegistrationRequest to check which users have registered faces
        const usersWithFaces = await User.aggregate([
            {
                $match: {
                    organization: adminUser.organization,
                    // Optionally exclude the admin
                    _id: { $ne: adminUser._id }
                }
            },
            {
                $lookup: {
                    from: "faceregistrationrequests",  // The collection name in MongoDB
                    localField: "_id",
                    foreignField: "userId",
                    as: "faceRegistrations"
                }
            },
            {
                $match: {
                    "faceRegistrations.status": "approved"  // Only include users with approved faces
                }
            },
            {
                $project: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    role: 1,
                    position: 1,
                    department: 1
                }
            },
            {
                $sort: { firstName: 1 }  // Sort by first name
            }
        ]);

        return NextResponse.json({
            message: "Users with registered faces fetched successfully",
            data: usersWithFaces,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
