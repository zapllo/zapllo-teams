import { NextResponse, NextRequest } from 'next/server';
import AWS from 'aws-sdk';
import User from '@/models/userModel';
import Organization from '@/models/organizationModel'; // Import the Organization model
import FaceRegistrationRequest from '@/models/faceRegistrationRequest';
import LoginEntry from '@/models/loginEntryModel';
import { getDataFromToken } from '@/helper/getDataFromToken';
import Leave from '@/models/leaveModel';
import LeaveType from '@/models/leaveTypeModel';
import dayjs from 'dayjs';

// AWS Rekognition client (using v3 SDK)
const rekognitionClient = new AWS.Rekognition({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper function to extract S3 object key from URL
const extractS3Key = (url: string) => {
  const urlParts = url.split('/');
  return urlParts.slice(3).join('/');
};

// Helper: Calculate distance between two lat/lng pairs (in meters) using the Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(request: NextRequest) {
  try {
    // Extract userId from token
    const userId = await getDataFromToken(request);

    // Parse request body
    const { imageUrl, lat, lng, action, workFromHome } = await request.json();

    // Validate inputs
    if (!imageUrl || lat === undefined || lng === undefined || !action) {
      return NextResponse.json(
        { success: false, error: 'Image URL, location, or action missing' },
        { status: 400 }
      );
    }

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    const organization = await Organization.findById(user.organization);

    const skipGeofencing = workFromHome === true && user.workFromHomeAllowed === true;

    // If NOT skipping geofencing, proceed with geofencing checks:
    if (!skipGeofencing) {
      // Geofencing is enforced only if the organization's settings say so
      if (organization && organization.allowGeofencing && organization.location) {
        const distance = calculateDistance(
          Number(lat),
          Number(lng),
          organization.location.lat,
          organization.location.lng
        );
        if (distance > organization.geofenceRadius) {
          return NextResponse.json(
            {
              success: false,
              error: "You are outside the allowed geofencing area.",
            },
            { status: 400 }
          );
        }
      }
    }

    // Continue with face recognition as before...
    const faceRegistration = await FaceRegistrationRequest.findOne({
      userId,
      status: 'approved',
    });

    if (!faceRegistration || faceRegistration.imageUrls.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No approved face registrations found for this user' },
        { status: 404 }
      );
    }

    let matchFound = false;
    let matchConfidence = 0;

    for (const registeredImageUrl of faceRegistration.imageUrls) {
      const compareParams = {
        SourceImage: {
          S3Object: {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Name: extractS3Key(imageUrl),
          },
        },
        TargetImage: {
          S3Object: {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Name: extractS3Key(registeredImageUrl),
          },
        },
        SimilarityThreshold: 90,
      };

      const compareData = await rekognitionClient.compareFaces(compareParams).promise();

      if (compareData.FaceMatches && compareData.FaceMatches.length > 0) {
        const confidence = compareData.FaceMatches[0]?.Similarity;
        if (confidence !== undefined && confidence >= 90) {
          matchFound = true;
          matchConfidence = confidence;
          break;
        }
      }
    }

    if (matchFound) {
      const timestamp = new Date();
      const loginEntryData: any = {
        userId,
        lat,
        lng,
        action,
        timestamp,
      };

      if (action === 'login') {
        loginEntryData.loginTime = timestamp.toISOString();
      } else if (action === 'logout') {
        loginEntryData.logoutTime = timestamp.toISOString();
      }

      const loginEntry = new LoginEntry(loginEntryData);
      await loginEntry.save();

      // --- Penalty Logic (for login actions) ---
      // Only process penalties on login
      if (action === 'login' && organization) {
        // Construct cutoff time for today using organization's allowed loginTime.
        // Assume organization.loginTime is in "HH:mm" format.
        const todayStr = dayjs(timestamp).format("YYYY-MM-DD");
        const cutoff = dayjs(`${todayStr}T${organization.loginTime}:00`);

        // Check if current login is late
        if (dayjs(timestamp).isAfter(cutoff)) {
          // Count all late login entries for the user in the current month.
          const startOfMonth = dayjs(timestamp).startOf('month').toDate();
          const endOfMonth = dayjs(timestamp).endOf('month').toDate();
          const loginEntries = await LoginEntry.find({
            userId,
            action: 'login',
            timestamp: { $gte: startOfMonth, $lte: endOfMonth }
          });

          // Count distinct days on which a login entry is late (only the first login of the day counts).
          const distinctLateDays = new Set<string>();
          loginEntries.forEach(entry => {
            const entryDay = dayjs(entry.timestamp).format("YYYY-MM-DD");
            const dayCutoff = dayjs(`${entryDay}T${organization.loginTime}:00`);
            if (dayjs(entry.timestamp).isAfter(dayCutoff)) {
              distinctLateDays.add(entryDay);
            }
          });

          const distinctLateLoginDaysCount = distinctLateDays.size;

          // If late login days exceed threshold, then process penalty based on organization settings
          if (distinctLateLoginDaysCount > organization.lateLoginThreshold) {
            if (organization.penaltyOption === 'leave') {
              // Penalty Leave Logic
              const penaltyLeaveTypeDoc = await LeaveType.findOne({
                leaveType: "Earned Leave",
                organization: organization._id
              });
              if (!penaltyLeaveTypeDoc) {
                return NextResponse.json(
                  { success: false, error: 'Penalty leave type "Earned Leave" not defined. Please contact admin.' },
                  { status: 400 }
                );
              }

              // Map penalty leave type to applied days (e.g., "half day" = 0.5)
              const unitMapping: Record<string, number> = {
                "half day": 0.5,
                "Full Day": 1,
                "quarter day": 0.25,
              };
              const appliedDays = unitMapping[organization.penaltyLeaveType] || 0;

              // Create a penalty leave request.
              const penaltyLeave = new Leave({
                user: userId,
                leaveType: penaltyLeaveTypeDoc._id,  // Use the "Earned Leave" leave type ID
                fromDate: new Date(), // Penalty leave for today
                toDate: new Date(),   // Same day leave
                appliedDays,
                leaveDays: [
                  {
                    date: new Date(),
                    unit: organization.penaltyLeaveType,
                    status: 'Pending'
                  }
                ],
                leaveReason: "Penalty", // Tag this leave request as a penalty
                status: "Pending"
              });
              await penaltyLeave.save();
            } else if (organization.penaltyOption === 'salary') {
              // Salary Penalty Logic: update the user's deductionDetails.
              let deductionUpdated = false;
              if (user.deductionDetails && Array.isArray(user.deductionDetails)) {
                for (let i = 0; i < user.deductionDetails.length; i++) {
                  if (user.deductionDetails[i].name === "Penalties") {
                    user.deductionDetails[i].amount += organization.penaltySalaryAmount;
                    deductionUpdated = true;
                    break;
                  }
                }
              }
              if (!deductionUpdated) {
                user.deductionDetails = user.deductionDetails || [];
                user.deductionDetails.push({
                  name: "Penalties",
                  amount: organization.penaltySalaryAmount,
                });
              }
              await user.save();
            }
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: `Face match found. ${action === 'login' ? 'Login' : 'Logout'} successful.`,
        confidence: matchConfidence,
        lat,
        lng,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'No matching face found. Please ensure you are facing the camera clearly and retry.',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error occurred while processing the request.' },
      { status: 500 }
    );
  }
}
