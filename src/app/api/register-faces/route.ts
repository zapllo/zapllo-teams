import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import FaceRegistrationRequest from '@/models/faceRegistrationRequest';
import User from '@/models/userModel';
import connectDB from '@/lib/db';
import { getDataFromToken } from '@/helper/getDataFromToken';

import { RekognitionClient, DetectFacesCommand, Attribute } from '@aws-sdk/client-rekognition';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Initialize the Rekognition client
const rekognitionClient = new RekognitionClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Initialize the S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Function to extract S3 object key from URL
const extractS3Key = (url: string) => {
    const urlParts = url.split('/');
    return urlParts.slice(3).join('/'); // Removes the bucket and region parts of the URL
};
// Maximum file size in bytes (50 MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Handle face recognition and updating MongoDB
export async function POST(request: NextRequest) {
    try {
        // Validate content length
        const contentLength = request.headers.get('content-length');
        if (contentLength && parseInt(contentLength, 10) > MAX_FILE_SIZE) {
            return NextResponse.json({
                success: false,
                error: 'File size exceeds the 50 MB limit.',
            });
        }
        // Parse the request body (expecting userId and imageUrls)
        const { userId, imageUrls } = await request.json();

        // Validate userId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ success: false, error: 'Invalid user ID' });
        }

        // Validate imageUrls
        if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length !== 3) {
            return NextResponse.json({ success: false, error: 'You must provide exactly 3 image URLs' });
        }

        // Find the user in MongoDB
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' });
        }


        // Verify the object exists in S3
        const getObjectCommand = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: extractS3Key(imageUrls[0]),
        });

        // Check access to the object using the S3 client
        const s3Data = await s3Client.send(getObjectCommand);
        console.log("S3 Object Accessible:", s3Data);

        // Prepare Rekognition parameters
        const rekognitionParams = {
            Image: {
                S3Object: {
                    Bucket: process.env.AWS_S3_BUCKET_NAME!,
                    Name: extractS3Key(imageUrls[0]),
                },
            },
            Attributes: [Attribute.ALL],
        };

        console.log("Extracted S3 Key:", extractS3Key(imageUrls[0]));

        // Call AWS Rekognition to detect faces
        const detectFacesCommand = new DetectFacesCommand(rekognitionParams);
        const rekognitionData = await rekognitionClient.send(detectFacesCommand);

        if (rekognitionData.FaceDetails && rekognitionData.FaceDetails.length > 0) {
            const faceDescriptor = rekognitionData.FaceDetails[0]; // Get the first face descriptor

            // Save the face registration request with status pending
            const newRequest = new FaceRegistrationRequest({
                userId,
                imageUrls,
                status: 'pending',
            });

            // Save the request
            await newRequest.save();

            // Return success response
            return NextResponse.json({
                success: true,
                message: 'Face registration request submitted and pending approval.',
                faceDescriptor,
                imageUrls,
            });
        } else {
            return NextResponse.json({ success: false, message: 'No face detected in the image.' });
        }
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
    }
}




