import connectDB from "@/lib/db";
import User from "@/models/userModel";
import Organization from "@/models/organizationModel";
import Category from "@/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { SendEmailOptions, sendEmail } from "@/lib/sendEmail";
import { getDataFromToken } from "@/helper/getDataFromToken";
import Leave from "@/models/leaveTypeModel";
import { Types } from "mongoose";
import Order from "@/models/orderModel";
import jwt from "jsonwebtoken"; // Add this import if not already present


connectDB();


const sendWebhookNotification = async (
  phoneNumber: string,
  country: string,
  templateName: string,
  bodyVariables: string[]
) => {
  const payload = {
    phoneNumber,
    country,
    bodyVariables,
    templateName,
  };
  console.log(payload, 'payload');
  try {
    const response = await fetch('https://zapllo.com/api/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(`Webhook API error: ${responseData.message}`);
    }
    console.log('Webhook notification sent successfully:', payload);
  } catch (error) {
    console.error('Error sending webhook notification:', error);
    throw new Error('Failed to send webhook notification');
  }
};



// Function to initialize leave balances for a newly created user
async function initializeLeaveBalancesForNewUser(userId: string, organizationId: string) {
  const leaveTypes = await Leave.find({ organization: organizationId });

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.leaveBalances) {
    user.leaveBalances = [];
  }

  for (const leaveType of leaveTypes) {
    const existingBalance = user.leaveBalances.find(balance =>
      balance.leaveType && balance.leaveType.equals(leaveType._id as unknown as string)
    );

    if (!existingBalance) {
      user.leaveBalances.push({
        leaveType: leaveType._id as unknown as Types.ObjectId,
        balance: leaveType.allotedLeaves,
      });
    }
  }

  await user.save();
}


export async function POST(request: NextRequest) {
  try {
    let authenticatedUser = null;
    let userId: string | null = null;

    // Try to retrieve the token if present
    try {
      userId = await getDataFromToken(request);
      if (userId) {
        authenticatedUser = await User.findById(userId);
        if (!authenticatedUser) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
      }
    } catch (err: any) {
      console.log('No token provided or error retrieving token:', err.message);
    }

    const reqBody = await request.json();
    const {
      whatsappNo,
      email,
      password,
      companyName,
      industry,
      teamSize,
      description,
      role,
      categories = [], // Default to empty array if not provided
      reportingManagerId,
      country, // New field
      isLeaveAccess,
      isTaskAccess,
    } = reqBody;

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 400 });
    }
    let organizationId = authenticatedUser?.organization ?? null;

    if (organizationId) {
      // Retrieve the latest order for the user's organization
      const organization = await Organization.findOne({ _id: organizationId })
        .exec();

      const subscribedUserLimit = organization?.subscribedUserCount || 99999;

      // Get the current user count for the organization
      const currentUserCount = await User.countDocuments({ organization: organizationId });

      // Check if the current user count exceeds the subscribed limit
      if (currentUserCount >= subscribedUserLimit) {
        return NextResponse.json({ error: "User limit reached for the current plan." }, { status: 403 });
      }
    }

    // Hash the password using bcryptjs
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create trial expiration date
    const trialDays = 7;
    const trialExpires = new Date();
    trialExpires.setDate(trialExpires.getDate() + trialDays);

    const formatDate = (date: Date): string => {
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: '2-digit' };
      return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
    };

    // Determine the role of the new user
    let newUserRole = "member";
    let newOrganizationId: string | null = null;

    if (authenticatedUser) {
      if (authenticatedUser.role === "orgAdmin") {
        newUserRole = role || "member";
        newOrganizationId = authenticatedUser.organization ? authenticatedUser.organization.toString() : null;
      }
    } else {
      newUserRole = "orgAdmin"; // Default role for new users signing up
    }

    // Initialize user creation object
    const newUser = new User({
      whatsappNo,
      firstName: reqBody.firstName,
      lastName: reqBody.lastName,
      email,
      password: hashedPassword,
      trialExpires,
      role: newUserRole,
      organization: newOrganizationId,
      country,
      reportingManager: reportingManagerId || null, // Assign reporting manager
      isLeaveAccess,
      isTaskAccess
    });

    let savedOrganization = null;

    if (companyName && industry && teamSize && description && categories.length > 0) {
      // Create a temporary organization without categories
      const tempOrganization = new Organization({
        companyName,
        industry,
        teamSize,
        description,
        trialExpires,
        country, // New field
      });

      const savedTempOrganization = await tempOrganization.save();

      // Create categories and associate them with the temporary organization
      const createdCategories = await Promise.all(
        categories.map(async (categoryName: string) => {
          let category = await Category.findOne({ name: categoryName });
          if (!category) {
            category = new Category({
              name: categoryName,
              organization: savedTempOrganization._id, // Associate with temp organization
            });
            await category.save();
          } else {
            // Update existing categories with the temp organization ID
            category.organization = savedTempOrganization._id;
            await category.save();
          }
          return category._id;
        })
      );

      // Update the temp organization with categories
      savedTempOrganization.categories = createdCategories;
      const savedOrganization = await savedTempOrganization.save();

      // Finalize the new user with the organization ID
      newUser.organization = savedOrganization._id;
      newUser.isAdmin = true;
    }

    const savedUser = await newUser.save();
    const organization = await Organization.findById(savedUser.organization);

    const formattedTrialExpires = formatDate(trialExpires);

    // Determine the template based on the user creation context
    let templateName;
    let bodyVariables: string[];

    if (authenticatedUser) {
      templateName = 'loginsuccessmember'; // Template for new member
      bodyVariables = [savedUser.firstName, authenticatedUser.firstName, organization.companyName, email, password];
    } else {
      templateName = 'loginsuccessadmin'; // Template for new orgAdmin
      bodyVariables = [savedUser.firstName, organization.companyName]; // Different body variables
    }

    let emailSubject;
    let emailText;
    let emailHtml;

    if (authenticatedUser) {
      templateName = 'loginsuccessmember'; // Template for new member
      emailSubject = `Business Workspace Invitation to Team - ${organization.companyName}`;
      emailText = `Dear ${reqBody.firstName},\n\nYou've been added to ${organization.companyName} on Zapllo! ...`;
      emailHtml = `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="padding: 20px; text-align: center;">
         <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
        </div>
        <div style="padding: 20px;">
          <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1731423673/01_xlguy8.png" alt="Team Illustration" style="max-width: 100%; height: auto;">
        </div>
        <h1 style="font-size: 24px; margin: 0; padding: 10px 20px; color: #000000;">Welcome to Team - ${organization.companyName}</h1>
        <div style="padding: 20px;">
          <p>We are excited to have you on board. Here are your account details:</p>
          <p>Name:<strong> ${reqBody.firstName} ${reqBody.lastName}</strong></p>
          <p>Email:<strong> <a href="mailto:${email}" style="color: #1a73e8;">${email}</a></strong></p>
          <p>Password:<strong> ${password}</strong></p>
          <p>WhatsApp Number:<strong> ${whatsappNo}</strong></p>
          <p>Role:<strong> ${newUserRole}</strong></p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://zapllo.com/login" style="background-color: #0C874B; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Here</a>
          </div>
          <p style="margin-top: 20px; font-size: 12px;  text-align: center; color: #888888;">This is an automated notification. Please do not reply.</p>
        </div>
      </div>
    </div>
  </body>`;
    } else {
      templateName = 'loginsuccessadmin'; // Template for new orgAdmin 1st message with heading and no illustration
      emailSubject = `Business Workspace Creation for Team - ${organization.companyName}!`;
      emailText = `Dear ${reqBody.firstName},\n\nThank you for signing up at Zapllo! ...`;
      emailHtml = `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 20px; text-align: center;">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
            </div>
          <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
    <h1 style="margin: 0; font-size: 20px;">New Workspace Created</h1>
</div>
            <div style="padding: 20px; text-align: left;">
                <p>Dear <strong>${reqBody.firstName},</strong></p>
                <p>You have created your Workspace - ${organization.companyName}</p>
                <p>We have started a FREE Trial for your account which is valid till <strong>${formattedTrialExpires}</strong>.</p>
                <p>In the trial period, you can invite up to 100 team members to try out how the app works.</p>
                <p>Login to the app now and start Delegating Now!</p>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://zapllo.com/login" style="background-color: #0C874B; color: #ffffff; padding: 12px 24px; font-size: 16px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login</a>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #888888; text-align: center;">This is an automated notification. Please do not reply.</p>
            </div>
        </div>
    </div>
</body>`;

    }
    // Send the email
    const emailOptions: SendEmailOptions = {
      to: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    };

    await sendEmail(emailOptions);

    if (!authenticatedUser) {
      let emailSubject;
      let emailText;
      let emailHtml;

      emailSubject = `Business Workspace Invitation to Team - ${organization.companyName}!`; {/**Admin 2nd message with illustration */ }
      emailText = `Dear ${reqBody.firstName},\n\nYou've been added to ${organization.companyName} on Zapllo! ...`;
      emailHtml = `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="padding: 20px; text-align: center;">
         <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
        </div>
        <div style="padding: 20px;">
          <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1731423673/01_xlguy8.png" alt="Team Illustration" style="max-width: 100%; height: auto;">
        </div>
          <h1 style="font-size: 24px; margin: 0; padding: 10px 20px; color: #000000;">Welcome to Team - ${organization.companyName}</h1>
            <div style="padding: 20px;">
                <p>We are excited to have you on board. Here are your account details:</p>
                <p>First Name:<strong> ${reqBody.firstName}</strong></p>
                <p>Last Name:<strong>${reqBody.lastName}</strong></p>
                <p>Email:<strong> <a href="mailto:${email}" style="color: #1a73e8;">${email}</a></strong></p>
                <p>Password:<strong> ${password}</strong></p>
                <p>WhatsApp Number:<strong> ${whatsappNo}<strong></p>
                <p>Role:<strong> ${newUserRole}</strong></p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="https://zapllo.com/login" style="background-color: #0C874B; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Here</a>
                </div>
                <p style="margin-top: 20px; font-size: 12px; text-align: center; color: #888888;">This is an automated notification. Please do not reply.</p>
            </div>
        </div>
    </div>
</body>`;
      // Only send the second email if it's a new admin
      const credentialsEmailOptions: SendEmailOptions = {
        to: email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      };

      await sendEmail(credentialsEmailOptions);
    }

    // Send the WhatsApp notification
    const mediaUrl = "https://interaktprodmediastorage.blob.core.windows.net/mediaprodstoragecontainer/d262fa42-63b2-417e-83f2-87871d3474ff/message_template_media/w4B2cSkUyaf3/logo-02%204.png?se=2029-07-07T15%3A30%3A43Z&sp=rt&sv=2019-12-12&sr=b&sig=EtEFkVbZXLeBLJ%2B9pkZitby/%2BwJ4HzJkGgeT2%2BapgoQ%3D";
    await sendWebhookNotification(whatsappNo, country, templateName, bodyVariables);
    if (newOrganizationId && savedUser._id) {
      await initializeLeaveBalancesForNewUser(savedUser._id.toString(), newOrganizationId);
    }
    // Create token data
    const tokenData = {
      id: savedUser._id,
      email: savedUser.email,
    };

    // Generate the JWT token
    // const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

    // Add the token as an HTTP-only cookie to the response
    const response = NextResponse.json({
      message: "Signup successful",
      success: true,
      user: savedUser,
      organization: savedOrganization,
    });

    // Only set a token if there is no authenticated user (i.e., creating a new orgAdmin)
    if (!authenticatedUser) {
      // Create token data
      const tokenData = {
        id: savedUser._id,
        email: savedUser.email,
      };

      // Generate the JWT token
      const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

      // Set the token as an HTTP-only cookie
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: true, // Ensure HTTPS in production
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60, // 15 days in seconds
        path: "/",
      });
    }

    // Return the response
    return response;

  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
