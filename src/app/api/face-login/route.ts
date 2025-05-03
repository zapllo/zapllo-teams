import { NextResponse, NextRequest } from 'next/server';
import AWS from 'aws-sdk';
import User from '@/models/userModel';
import Organization from '@/models/organizationModel';
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
    // Extract userId from token (this is the admin user in enterprise mode)
    const adminUserId = await getDataFromToken(request);

    // Parse request body
    const { imageUrl, lat, lng, action, workFromHome, targetUserId, enterpriseMode } = await request.json();

    // Validate inputs
    if (!imageUrl || lat === undefined || lng === undefined || !action) {
      return NextResponse.json(
        { success: false, error: 'Image URL, location, or action missing' },
        { status: 400 }
      );
    }

    // Fetch the admin user who is making the request
    const adminUser = await User.findById(adminUserId);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Admin user not found' },
        { status: 404 }
      );
    }

    const organization = await Organization.findById(adminUser.organization);

    // Determine which user's attendance to log
    let targetUser = adminUser;
    let isEnterpriseLogin = false;

    // If this is an enterprise login and a target user is specified
    if (enterpriseMode && targetUserId && organization?.isEnterprise) {
      // Verify the admin has proper role
      if (adminUser.role !== 'manager' && adminUser.role !== 'orgAdmin') {
        return NextResponse.json(
          { success: false, error: 'Only admins can manage attendance for other users' },
          { status: 403 }
        );
      }

      // Fetch the target user
      const fetchedTargetUser = await User.findById(targetUserId);
      if (!fetchedTargetUser) {
        return NextResponse.json(
          { success: false, error: 'Target user not found' },
          { status: 404 }
        );
      }

      // Verify target user belongs to same organization
      if (fetchedTargetUser.organization?.toString() !== adminUser.organization?.toString()) {
        return NextResponse.json(
          { success: false, error: 'Target user is not part of your organization' },
          { status: 403 }
        );
      }

      isEnterpriseLogin = true;
      targetUser = fetchedTargetUser;
    }

    const skipGeofencing = workFromHome === true && targetUser.workFromHomeAllowed === true;

    // If NOT skipping geofencing, proceed with geofencing checks
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

    // In enterprise mode, we need to check the face of the target user
    // Otherwise, we check the admin's face
    const userId = isEnterpriseLogin ? targetUserId : adminUserId;

    // Look for face registration for the appropriate user
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
        userId: targetUser._id, // The user whose attendance we're tracking
        lat,
        lng,
        action,
        timestamp,
      };

      // For enterprise logins, track the admin who initiated it
      if (isEnterpriseLogin) {
        loginEntryData.enterpriseMode = true;
        loginEntryData.managedBy = adminUserId;
      }

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
        // Existing penalty logic for late logins
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
            userId: targetUser._id, // Use target user's ID for penalties
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
                user: targetUser._id, // Apply penalty to target user
                leaveType: penaltyLeaveTypeDoc._id,
                fromDate: new Date(),
                toDate: new Date(),
                appliedDays,
                leaveDays: [
                  {
                    date: new Date(),
                    unit: organization.penaltyLeaveType,
                    status: 'Pending'
                  }
                ],
                leaveReason: "Penalty",
                status: "Pending"
              });
              await penaltyLeave.save();
            } else if (organization.penaltyOption === 'salary') {
              // Salary Penalty Logic
              let deductionUpdated = false;
              if (targetUser.deductionDetails && Array.isArray(targetUser.deductionDetails)) {
                for (let i = 0; i < targetUser.deductionDetails.length; i++) {
                  if (targetUser.deductionDetails[i].name === "Penalties") {
                    targetUser.deductionDetails[i].amount += organization.penaltySalaryAmount;
                    deductionUpdated = true;
                    break;
                  }
                }
              }
              if (!deductionUpdated) {
                targetUser.deductionDetails = targetUser.deductionDetails || [];
                targetUser.deductionDetails.push({
                  name: "Penalties",
                  amount: organization.penaltySalaryAmount,
                });
              }
              await targetUser.save();
            }
          }
        }
      }

      // Format the response based on whether it's enterprise mode or not
      const responseMessage = isEnterpriseLogin
        ? `${action === 'login' ? 'Login' : 'Logout'} successful for ${targetUser.firstName} ${targetUser.lastName}.`
        : `${action === 'login' ? 'Login' : 'Logout'} successful.`;

      return NextResponse.json({
        success: true,
        message: responseMessage,
        confidence: matchConfidence,
        enterpriseMode: isEnterpriseLogin,
        targetUser: isEnterpriseLogin ? {
          id: targetUser._id,
          name: `${targetUser.firstName} ${targetUser.lastName}`
        } : undefined,
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
