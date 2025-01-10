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

// POST: Create a new face registration request and process face descriptors
export async function POST(request: NextRequest) {
    try {
        await connectDB(); // Ensure connection to the database

        // Validate Content-Length for request size
        const contentLength = request.headers.get('content-length');
        if (contentLength && parseInt(contentLength, 10) > MAX_FILE_SIZE) {
            return NextResponse.json(
                { success: false, message: 'Payload size exceeds 50 MB limit.' },
                { status: 413 }
            );
        }

        const { imageUrls } = await request.json();

        // Get userId from token
        const userId = await getDataFromToken(request);

        // Validate userId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
        }

        // Validate imageUrls
        if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length !== 3) {
            return NextResponse.json({ success: false, message: 'You must provide exactly 3 image URLs' }, { status: 400 });
        }

        // Find the user in MongoDB
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Verify the object exists in S3
        const getObjectCommand = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: extractS3Key(imageUrls[0]),
        });

        // Check access to the object using the S3 client
        const s3Data = await s3Client.send(getObjectCommand);
        console.log('S3 Object Accessible:', s3Data);

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

        console.log('Extracted S3 Key:', extractS3Key(imageUrls[0]));

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

// GET: Retrieve face registration requests for an organization
export async function GET(request: NextRequest) {
    try {
        await connectDB(); // Ensure connection to the database

        const userId = await getDataFromToken(request);
        const loggedInUser = await User.findById(userId);

        if (!loggedInUser || !loggedInUser.organization) {
            return NextResponse.json({ success: false, message: 'User or organization not found' }, { status: 404 });
        }

        const faceRequests = await FaceRegistrationRequest.find({
            userId: { $in: await User.find({ organization: loggedInUser.organization }).select('_id') },
        })
            .populate('userId', 'firstName lastName')
            .exec();

        return NextResponse.json({ success: true, requests: faceRequests }, { status: 200 });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
