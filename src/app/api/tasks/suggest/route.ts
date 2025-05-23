import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";
import Category from "@/models/categoryModel";
import OpenAI from "openai";
import connectDB from "@/lib/db";
import { addDays, addWeeks, addMonths, parseISO, set } from "date-fns";
import mongoose from "mongoose";
import Organization from "@/models/organizationModel";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Connect to database
connectDB();

// Helper function to parse natural language date references
function parseRelativeDateFromPrompt(prompt: string): Date {
  const today = new Date();
  const lowercasePrompt = prompt.toLowerCase();

  // Check for specific date patterns (e.g., "26th of January", "January 26th")
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  // Pattern for "X of Y" or "Y X" format (e.g., "26th of January" or "January 26th")
  for (let i = 0; i < monthNames.length; i++) {
    const month = monthNames[i];
    // Match patterns like "26th of January", "26 of January"
    const pattern1 = new RegExp(`(\\d+)(?:st|nd|rd|th)?\\s+(?:of\\s+)?${month}`, 'i');
    // Match patterns like "January 26th", "January 26"
    const pattern2 = new RegExp(`${month}\\s+(\\d+)(?:st|nd|rd|th)?`, 'i');

    let match = lowercasePrompt.match(pattern1) || lowercasePrompt.match(pattern2);
    if (match && match[1]) {
      const day = parseInt(match[1], 10);
      const result = new Date(today.getFullYear(), i, day);

      // If the date is in the past, assume next year
      if (result < today) {
        result.setFullYear(today.getFullYear() + 1);
      }

      return result;
    }
  }

  // Check for "next day-of-week" pattern (e.g., "next Saturday")
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < daysOfWeek.length; i++) {
    if (lowercasePrompt.includes(`next ${daysOfWeek[i]}`)) {
      const result = new Date(today);
      const currentDay = today.getDay();
      const targetDay = i;

      // Calculate days to add (ensure we get next week's day, not this week's)
      const daysToAdd = (targetDay - currentDay + 7) % 7 || 7;
      result.setDate(today.getDate() + daysToAdd);
      return result;
    }
  }

  // Existing code for relative dates
  if (lowercasePrompt.includes('tomorrow')) {
    return addDays(today, 1);
  } else if (lowercasePrompt.includes('today')) {
    return today;
  } else if (lowercasePrompt.includes('next week')) {
    return addWeeks(today, 1);
  } else if (lowercasePrompt.includes('next month')) {
    return addMonths(today, 1);
  } else if (lowercasePrompt.match(/in\s+(\d+)\s+days?/)) {
    const match = lowercasePrompt.match(/in\s+(\d+)\s+days?/);
    if (match && match[1]) {
      const daysToAdd = parseInt(match[1], 10);
      return addDays(today, daysToAdd);
    }
  }

  // Default to tomorrow if no clear date reference
  return addDays(today, 1);
}

// Helper function to parse time from a prompt
function parseTimeFromPrompt(prompt: string): { hours: number, minutes: number } {
  const lowercasePrompt = prompt.toLowerCase();
  let hours = 12; // Default to noon
  let minutes = 0;

  // Match patterns like "3:30 pm", "3pm", "15:00", etc.
  const timePattern = /(\d{1,2})(?::(\d{2}))?(?:\s*)?(am|pm)?/i;
  const match = lowercasePrompt.match(timePattern);

  if (match) {
    let extractedHours = parseInt(match[1], 10);
    const extractedMinutes = match[2] ? parseInt(match[2], 10) : 0;
    const period = match[3] ? match[3].toLowerCase() : null;

    // Handle AM/PM conversion
    if (period === 'pm' && extractedHours < 12) {
      extractedHours += 12;
    } else if (period === 'am' && extractedHours === 12) {
      extractedHours = 0;
    }

    hours = extractedHours;
    minutes = extractedMinutes;
  }

  return { hours, minutes };
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from token
    const userId = await getDataFromToken(request);
    const authenticatedUser = await User.findById(userId);

    if (!authenticatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    // Check if the organization has AI credits available
    const organization = await Organization.findById(authenticatedUser.organization);
    if (!organization) {
      return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
    }

    if (organization.aiCredits <= 0) {
      return NextResponse.json({
        success: false,
        error: "No AI credits remaining. Please contact your administrator.",
        creditStatus: { remaining: 0 }
      }, { status: 403 });
    }
    // Get prompt and assignedUserId from request body
    const { prompt, assignedUserId } = await request.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
    }

    // Do our own parsing for dates and times from the prompt
    const parsedDate = parseRelativeDateFromPrompt(prompt);
    const parsedTime = parseTimeFromPrompt(prompt);

    // Set the time on the parsed date
    let dueDateObject = set(parsedDate, {
      hours: parsedTime.hours,
      minutes: parsedTime.minutes,
      seconds: 0,
      milliseconds: 0
    });

    // Fetch categories to reference in the AI prompt
    const categories = await Category.find({ organization: authenticatedUser.organization });
    const categoryNames = categories.map(cat => cat.name).join(", ");

    // Get all users in the organization for assignedUser suggestions
    const users = await User.find({
      organization: authenticatedUser.organization
    }).select('_id firstName lastName');

    const userNames = users.map(user => `${user.firstName} ${user.lastName || ""}`).join(", ");

    // Create an OpenAI completion prompt
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful task creation assistant. Parse the user's request to extract relevant task details.
            Available categories: ${categoryNames || "No categories available yet."}
            Available users: ${userNames || "No users available yet."}

            For priority, choose from: High, Medium, Low.

            Return a JSON object with the following fields:
            - title: A concise task title
            - description: A detailed task description
            - priority: The priority level (High, Medium, Low)
            - category: The most appropriate category from the list provided (return just the name)
            - assignTo: The full name of a user to assign this task to from the available users list

            Format all responses as valid JSON with no additional explanation.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Extract JSON from the response
    const content = response.choices[0]?.message?.content || "";
    let parsedContent;

    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      // If JSON parsing fails, try to extract it from the text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedContent = JSON.parse(jsonMatch[0]);
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: "Failed to parse AI response"
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({
          success: false,
          error: "AI response is not in valid JSON format"
        }, { status: 500 });
      }
    }

    // Find the category ID from the category name
    let categoryId = null;
    if (parsedContent.category) {
      const category = categories.find(
        cat => cat.name.toLowerCase() === parsedContent.category.toLowerCase()
      );
      if (category) {
        categoryId = category._id;
        parsedContent.category = { _id: categoryId, name: category.name };
      }
    }

    // Find assigned user by name or use provided assignedUserId
    let assignedUser = null;

    // Priority 1: Use explicitly provided assignedUserId from @mention
    if (assignedUserId && mongoose.Types.ObjectId.isValid(assignedUserId)) {
      const user = await User.findById(assignedUserId).select('_id firstName lastName');
      if (user) {
        assignedUser = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName || ''
        };
      }
    }
    // Priority 2: Use AI-extracted user name
    else if (parsedContent.assignTo) {
      const userName = parsedContent.assignTo;
      const user = users.find(
        u => `${u.firstName} ${u.lastName || ''}`.toLowerCase() === userName.toLowerCase()
      );

      if (user) {
        assignedUser = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName || ''
        };
      }
    }

    // Format due date and time to match what the task modal expects
    // Extract hours and minutes for the time input
    const hours = dueDateObject.getHours().toString().padStart(2, '0');
    const minutes = dueDateObject.getMinutes().toString().padStart(2, '0');
    const dueTimeString = `${hours}:${minutes}`;

    organization.aiCredits -= 1;
    // Add the transaction to aiCreditsHistory
    if (!organization.aiCreditsHistory) {
      organization.aiCreditsHistory = [];
    }

    organization.aiCreditsHistory.push({
      amount: 0,
      credits: 1,
      transactionId: new mongoose.Types.ObjectId().toString(), // Generate a unique ID
      date: new Date(),
      type: 'usage',
      user: userId,
      task: parsedContent.title || 'AI Task Suggestion',
      taskId: null // This would be filled if the task is actually created
    });
    await organization.save();

    // Prepare the task data with the properly formatted date and fields
    const taskData = {
      title: parsedContent.title || '',
      description: parsedContent.description || '',
      priority: parsedContent.priority || 'Medium',
      category: parsedContent.category,
      assignedUser: assignedUser,
      dueDate: dueDateObject.toISOString(), // Send as ISO string
      dueTime: dueTimeString // This will be used for the time input
    };

    console.log("Task data being sent:", {
      ...taskData,
      dueDate: new Date(taskData.dueDate).toLocaleString(), // For better debugging visibility
    });
    return NextResponse.json({
      success: true,
      taskData,
      creditStatus: {
        remaining: organization.aiCredits,
        used: 1
      }
    });

  } catch (error: any) {
    console.error("Error in AI task suggestion:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
