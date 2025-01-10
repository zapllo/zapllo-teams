import { NextResponse, NextRequest } from 'next/server';
import AWS from 'aws-sdk';
import User from '@/models/userModel'; // Import the User model
import FaceRegistrationRequest from '@/models/faceRegistrationRequest'; // Import the FaceRegistrationRequest model
import LoginEntry from '@/models/loginEntryModel'; // Import the LoginEntry model
import { getDataFromToken } from '@/helper/getDataFromToken'; // Function to extract userId from token

// AWS Rekognition client (using v3 SDK)
const rekognitionClient = new AWS.Rekognition({
    region: process.env.AWS_REGION, // e.g., 'us-east-1'
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Function to extract S3 object key from URL
const extractS3Key = (url: string) => {
    const urlParts = url.split('/');
    return urlParts.slice(3).join('/'); // Removes bucket and region parts of the URL
};

// POST: Handle face recognition login
export async function POST(request: NextRequest) {
    try {
        // Extract userId from the token
        const userId = await getDataFromToken(request);

        // Parse the request body
        const { imageUrl, lat, lng, action } = await request.json();

        // Validate inputs
        if (!imageUrl || !lat || !lng || !action) {
            return NextResponse.json(
                { success: false, error: 'Image URL, location, or action missing' },
                { status: 400 }
            );
        }

        // Find the approved face registration request for the user
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

        // Iterate over the user's approved registered images
        for (const registeredImageUrl of faceRegistration.imageUrls) {
            const compareParams = {
                SourceImage: {
                    S3Object: {
                        Bucket: process.env.AWS_S3_BUCKET_NAME!,
                        Name: extractS3Key(imageUrl), // Image captured during login
                    },
                },
                TargetImage: {
                    S3Object: {
                        Bucket: process.env.AWS_S3_BUCKET_NAME!,
                        Name: extractS3Key(registeredImageUrl), // Registered images
                    },
                },
                SimilarityThreshold: 90, // Only accept matches with confidence >= 90%
            };

            const compareData = await rekognitionClient.compareFaces(compareParams).promise();

            if (compareData.FaceMatches && compareData.FaceMatches.length > 0) {
                const confidence = compareData.FaceMatches[0]?.Similarity;
                if (confidence !== undefined && confidence >= 90) {
                    matchFound = true;
                    matchConfidence = confidence;
                    break; // Stop after finding a match
                }
            }
        }

        if (matchFound) {
            const timestamp = new Date();

            // Prepare loginEntry data
            const loginEntryData: any = {
                userId,
                lat,
                lng,
                action,
                timestamp,
            };

            // Set loginTime or logoutTime based on the action
            if (action === 'login') {
                loginEntryData.loginTime = timestamp.toISOString();
            } else if (action === 'logout') {
                loginEntryData.logoutTime = timestamp.toISOString();
            }

            // Save the login entry
            const loginEntry = new LoginEntry(loginEntryData);
            await loginEntry.save();

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
