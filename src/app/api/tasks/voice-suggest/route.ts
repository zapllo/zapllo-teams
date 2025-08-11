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

// Initialize clients - ElevenLabs client will automatically use ELEVENLABS_API_KEY from env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const elevenlabs = new ElevenLabsClient();

// Connect to database
connectDB();

// Helper functions (same as before)
function parseRelativeDateFromPrompt(prompt: string): Date {
  const today = new Date();
  const lowercasePrompt = prompt.toLowerCase();

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

    console.log('Received audio file:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
    });

    // Validate audio file
    if (audioFile.size === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Audio file is empty. Please try recording again." 
      }, { status: 400 });
    }

    if (audioFile.size < 1000) {
      return NextResponse.json({ 
        success: false, 
        error: "Audio recording is too short. Please speak for at least 2-3 seconds." 
      }, { status: 400 });
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        error: "Audio file is too large (max 25MB)" 
      }, { status: 400 });
    }

    try {
      // Convert the File to a Blob as shown in the ElevenLabs documentation
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBlob = new Blob([arrayBuffer], { type: "audio/wav" });

      console.log('Processing audio blob:', {
        size: audioBlob.size,
        type: audioBlob.type
      });

      // Use ElevenLabs speech-to-text exactly as shown in their documentation
      const transcription = await elevenlabs.speechToText.convert({
        file: audioBlob,
        modelId: "scribe_v1", // Only supported model as per docs
        languageCode: "eng", // Set to null for auto-detection if needed
        tagAudioEvents: false, // Set to false for cleaner transcripts
        diarize: false, // Set to false for single speaker
      });

      console.log('ElevenLabs transcription result:', transcription);

      const transcript = transcription?.text?.trim() || '';

      if (!transcript) {
        return NextResponse.json({ 
          success: false, 
          error: "No speech detected in the audio. Please speak clearly and try again." 
        }, { status: 400 });
      }

      console.log('Successfully transcribed text:', transcript);

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
      
      // Handle specific ElevenLabs errors
      if (transcriptionError.statusCode === 400) {
        const errorDetail = transcriptionError.body?.detail;
        if (errorDetail?.status === 'empty_file') {
          return NextResponse.json({ 
            success: false, 
            error: "Audio file appears to be empty or corrupted. Please try recording again." 
          }, { status: 400 });
        }
      }
      
      return NextResponse.json({ 
        success: false, 
        error: `Speech transcription failed: ${transcriptionError.message || 'Please try recording again with clearer audio.'}` 
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