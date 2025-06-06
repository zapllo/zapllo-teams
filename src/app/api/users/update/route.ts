import connectDB from "@/lib/db";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { getDataFromToken } from "@/helper/getDataFromToken";

connectDB();

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const authenticatedUser = await User.findById(userId);

    if (!authenticatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (authenticatedUser.role !== "orgAdmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const reqBody = await request.json();
    const {
      _id,
      whatsappNo,
      email,
      password,
      firstName,
      reminders,
      lastName,
      role,
      reportingManager,  // Add reportingManager in the request body
      country,
      isLeaveAccess = true, // Set default to false if not provided
      isTaskAccess = true,  // Set default to false if not provided
      designation,  // New field
      staffType,    // New field
      asset,        // New field
      branch,       // New field
      department,
      status,       // New field
      gender, // New gender field
      bankDetails,
      legalDocuments,
      contactDetails,
      personalInformation,
      workFromHomeAllowed,
    } = reqBody;

    const userToEdit = await User.findById(_id);

    if (!userToEdit) {
      return NextResponse.json({ error: "User to edit not found" }, { status: 404 });
    }

    if (email && email !== userToEdit.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
      userToEdit.email = email;
    }

    if (password) {
      userToEdit.password = password;
    }

    if (whatsappNo) userToEdit.whatsappNo = whatsappNo;
    if (firstName) userToEdit.firstName = firstName;
    if (lastName) userToEdit.lastName = lastName;
    if (role) userToEdit.role = role;
    if (reportingManager) userToEdit.reportingManager = reportingManager;  // Update the reportingManager
    if (country) userToEdit.country = country;  // Update country
    // Set or update access fields
    // Set or update access fields
    userToEdit.isLeaveAccess = typeof isLeaveAccess !== "undefined" ? isLeaveAccess : userToEdit.isLeaveAccess;
    userToEdit.isTaskAccess = typeof isTaskAccess !== "undefined" ? isTaskAccess : userToEdit.isTaskAccess;
    if (designation !== undefined) userToEdit.designation = designation;
    if (staffType !== undefined) userToEdit.staffType = staffType;
    if (asset !== undefined) userToEdit.asset = asset;
    if (branch !== undefined) userToEdit.branch = branch;
    if (department !== undefined) userToEdit.department = department;
    if (status !== undefined) userToEdit.status = status;
    if (gender !== undefined) userToEdit.gender = gender; // Update gender field
    // Update bank details if provided
    if (bankDetails) {
      userToEdit.bankDetails = bankDetails;
    }

    // Update legal documents if provided
    if (legalDocuments) {
      userToEdit.legalDocuments = {
        ...userToEdit.legalDocuments, // Preserve existing documents
        ...legalDocuments, // Overwrite with new data
      };
    }

    if (contactDetails) {
      userToEdit.contactDetails = contactDetails;
    }

    // Update personal information if provided
    if (personalInformation) {
      userToEdit.personalInformation = personalInformation;
    }
    if (typeof workFromHomeAllowed !== "undefined") {
      userToEdit.workFromHomeAllowed = workFromHomeAllowed;
    }
    // ✅ Update the `reminders` field if provided
    if (reminders) {
      userToEdit.reminders = { ...userToEdit.reminders, ...reminders };
    }


    await userToEdit.save();

    return NextResponse.json({
      message: "User details updated successfully",
      success: true,
      user: userToEdit,
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
