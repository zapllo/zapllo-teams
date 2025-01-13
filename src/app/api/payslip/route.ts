// src/app/api/payslip/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Payslip from '@/models/payslipModel';
import connectDB from '@/lib/db';
import { getDataFromToken } from '@/helper/getDataFromToken'; // Helper to extract user ID

export async function POST(request: NextRequest) {
    await connectDB(); // Ensure the database is connected

    try {
        // Extract user ID from the token
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse the request body
        const { logo, name, address, contact, emailOrWebsite } = await request.json();

        // Validate required fields
        if (!name || !address || !contact || !emailOrWebsite) {
            return NextResponse.json(
                { success: false, message: 'All required fields must be provided' },
                { status: 400 }
            );
        }

        // Create a new payslip document
        const payslip = new Payslip({
            user: userId, // Link the payslip to the logged-in user
            logo,
            name,
            address,
            contact,
            emailOrWebsite,
        });

        // Save the payslip to the database
        await payslip.save();

        return NextResponse.json(
            { success: true, message: 'Payslip saved successfully', data: payslip },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error saving payslip:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to save payslip', error },
            { status: 500 }
        );
    }
}


// GET endpoint to fetch a payslip for the logged-in user
export async function GET(request: NextRequest) {
    await connectDB();

    try {
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const payslip = await Payslip.findOne({ user: userId });

        if (!payslip) {
            return NextResponse.json(
                { success: false, message: 'Payslip not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: payslip }, { status: 200 });
    } catch (error) {
        console.error('Error fetching payslip:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch payslip', error },
            { status: 500 }
        );
    }
}