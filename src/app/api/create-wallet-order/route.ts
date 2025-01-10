import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Order from '@/models/orderModel'; // Ensure the Order model is correctly imported
import connectDB from '@/lib/db';
import User from '@/models/userModel';
import Organization from '@/models/organizationModel'; // Import the Organization model

export async function POST(req: NextRequest) {
    try {
        // Connect to the database
        await connectDB();

        // Parse the request body
        const {
            userId,
            amount,
            planName,
            creditedAmount = 0, // Default to 0 if not provided
            subscribedUserCount,
            additionalUserCount = 0, // Default to 0 if not provided
            deduction,
        } = await req.json();

        // Log received data for debugging
        console.log('Received data:', {
            userId,
            amount,
            planName,
            creditedAmount,
            subscribedUserCount,
            additionalUserCount,
            deduction,
        });

        // Validate required fields
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Missing userId.' },
                { status: 400 }
            );
        }

        if (amount === undefined || amount === null) {
            return NextResponse.json(
                { success: false, message: 'Missing amount.' },
                { status: 400 }
            );
        }

        if (!planName) {
            return NextResponse.json(
                { success: false, message: 'Missing planName.' },
                { status: 400 }
            );
        }

        if (!subscribedUserCount) {
            return NextResponse.json(
                { success: false, message: 'Missing subscribedUserCount.' },
                { status: 400 }
            );
        }

        // Generate a unique order ID and payment ID if not using Razorpay
        const generatedOrderId = `order_${new mongoose.Types.ObjectId()}`;
        const generatedPaymentId = `payment_${new mongoose.Types.ObjectId()}`;

        // Create a new order document
        const newOrder = new Order({
            userId: new mongoose.Types.ObjectId(userId),
            orderId: generatedOrderId,
            paymentId: generatedPaymentId,
            amount,
            planName,
            creditedAmount, // Will be 0 unless plan is "Recharge"
            subscribedUserCount,
            additionalUserCount,
            deduction,
        });

        // Save the new order document to the database
        await newOrder.save();

        // Fetch the user document
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
        }

        // Proceed only if the user is part of an organization
        if (user.organization) {
            const organizationId = user.organization;

            // Initialize the organization update object
            const organizationUpdate: Partial<{
                isPro: boolean;
                subscriptionExpires: Date;
                subscribedPlan: string;
                subscribedUserCount: number;
                userExceed: boolean;
            }> = {};

            // Set common fields
            organizationUpdate.isPro = true;
            organizationUpdate.subscriptionExpires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Set expiration date to 1 year from now

            if (planName !== 'Recharge') {
                // Update subscribedPlan and subscribedUserCount
                organizationUpdate.subscribedPlan = planName;
                organizationUpdate.subscribedUserCount = subscribedUserCount;

                // Calculate userExceed
                const currentUserCount = await User.countDocuments({ organization: organizationId });
                organizationUpdate.userExceed = currentUserCount > subscribedUserCount;
            }

            // Update the organization document
            await Organization.findByIdAndUpdate(organizationId, { $set: organizationUpdate }, { new: true });
        }

        return NextResponse.json({
            success: true,
            message: 'Order created successfully.',
            order: newOrder,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { success: false, message: 'Error creating order.' },
            { status: 500 }
        );
    }
}
