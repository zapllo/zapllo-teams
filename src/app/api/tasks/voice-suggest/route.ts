import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";
import Category from "@/models/categoryModel";
import OpenAI from "openai";
import connectDB from "@/lib/db";
import { addDays, addWeeks, addMonths, parseISO, set } from "date-fns";
import mongoose from "mongoose";
import Organization from "@/models/organizationModel";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

// Connect to database
connectDB();

// Helper functions (same as before)
function parseRelativeDateFromPrompt(prompt: string): Date {
  const today = new Date();
  const lowercasePrompt = prompt.toLowerCase();

  // Check for specific date patterns
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

  for (let i = 0; i < monthNames.length; i++) {
    const month = monthNames[i];
    const pattern1 = new RegExp(`(\\d+)(?:st|nd|rd|th)?\\s+(?:of\\s+)?${month}`, 'i');
    const pattern2 = new RegExp(`${month}\\s+(\\d+)(?:st|nd|rd|th)?`, 'i');

    let match = lowercasePrompt.match(pattern1) || lowercasePrompt.match(pattern2);
    if (match && match[1]) {
      const day = parseInt(match[1], 10);
      const result = new Date(today.getFullYear(), i, day);

      if (result < today) {
        result.setFullYear(today.getFullYear() + 1);
      }

      return result;
    }
  }

  // Check for "next day-of-week" pattern
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < daysOfWeek.length; i++) {
    if (lowercasePrompt.includes(`next ${daysOfWeek[i]}`)) {
      const result = new Date(today);
      const currentDay = today.getDay();
      const targetDay = i;
      const daysToAdd = (targetDay - currentDay + 7) % 7 || 7;
      result.setDate(today.getDate() + daysToAdd);
      return result;
    }
  }

  // Existing relative date patterns
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

  return addDays(today, 1);
}

function parseTimeFromPrompt(prompt: string): { hours: number, minutes: number } {
  const lowercasePrompt = prompt.toLowerCase();
  let hours = 12;
  let minutes = 0;

  const timePattern = /(\d{1,2})(?::(\d{2}))?(?:\s*)?(am|pm)?/i;
  const match = lowercasePrompt.match(timePattern);

  if (match) {
    let extractedHours = parseInt(match[1], 10);
    const extractedMinutes = match[2] ? parseInt(match[2], 10) : 0;
    const period = match[3] ? match[3].toLowerCase() : null;

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

    // Check AI credits
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

    // Get audio file from form data
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ success: false, error: "Audio file is required" }, { status: 400 });
    }

    try {
      // Convert File to Blob for ElevenLabs SDK
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBlob = new Blob([arrayBuffer], { type: audioFile.type });

      // Transcribe audio using ElevenLabs SDK
      const transcription = await elevenlabs.speechToText.convert({
        file: audioBlob,
        modelId: "scribe_v1",
        languageCode: "eng",
        tagAudioEvents: false, // Set to false for cleaner transcripts
        diarize: false, // Set to false for single speaker scenarios
      });

      const transcript = transcription.text || '';

      if (!transcript) {
        return NextResponse.json({ 
          success: false, 
          error: "No speech detected in audio" 
        }, { status: 400 });
      }

      console.log('Transcribed text:', transcript);

      // Parse dates and times from transcript
      const parsedDate = parseRelativeDateFromPrompt(transcript);
      const parsedTime = parseTimeFromPrompt(transcript);

      let dueDateObject = set(parsedDate, {
        hours: parsedTime.hours,
        minutes: parsedTime.minutes,
        seconds: 0,
        milliseconds: 0
      });

      // Get categories and users for AI processing
      const categories = await Category.find({ organization: authenticatedUser.organization });
      const categoryNames = categories.map(cat => cat.name).join(", ");

      const users = await User.find({
        organization: authenticatedUser.organization
      }).select('_id firstName lastName');

      const userNames = users.map(user => `${user.firstName} ${user.lastName || ""}`).join(", ");

      // Process transcript with OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful task creation assistant. Parse the user's spoken request to extract relevant task details.
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
            content: `Transcribed speech: "${transcript}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const content = response.choices[0]?.message?.content || "";
      let parsedContent;

      try {
        parsedContent = JSON.parse(content);
      } catch (error) {
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

      // Find category and assigned user
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

      let assignedUser = null;
      if (parsedContent.assignTo) {
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

      // Deduct AI credits
      organization.aiCredits -= 1;
      if (!organization.aiCreditsHistory) {
        organization.aiCreditsHistory = [];
      }

      organization.aiCreditsHistory.push({
        amount: 0,
        credits: 1,
        transactionId: new mongoose.Types.ObjectId().toString(),
        date: new Date(),
        type: 'usage',
        user: userId,
        task: parsedContent.title || 'Voice Task Suggestion',
        taskId: null
      });
      await organization.save();

      // Format task data
      const hours = dueDateObject.getHours().toString().padStart(2, '0');
      const minutes = dueDateObject.getMinutes().toString().padStart(2, '0');
      const dueTimeString = `${hours}:${minutes}`;

      const taskData = {
        title: parsedContent.title || '',
        description: parsedContent.description || '',
        priority: parsedContent.priority || 'Medium',
        category: parsedContent.category,
        assignedUser: assignedUser,
        dueDate: dueDateObject.toISOString(),
        dueTime: dueTimeString
      };

      return NextResponse.json({
        success: true,
        transcript,
        taskData,
        creditStatus: {
          remaining: organization.aiCredits,
          used: 1
        }
      });

    } catch (transcriptionError: any) {
      console.error('ElevenLabs transcription error:', transcriptionError);
      return NextResponse.json({ 
        success: false, 
        error: `Failed to transcribe audio: ${transcriptionError.message}` 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Error in voice task suggestion:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}