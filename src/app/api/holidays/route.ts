import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Database connection
import Holiday from '@/models/holidayModel'; // Import the Holiday model
import { getDataFromToken } from '@/helper/getDataFromToken';
import User from '@/models/userModel';

connectDB(); // Establish the database connection

// POST: Add a new holiday
export async function POST(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const authenticatedUser = await User.findById(userId);
        if (!authenticatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { holidayName, holidayDate } = await request.json();

        // Create a new holiday document
        const newHoliday = new Holiday({
            holidayName,
            holidayDate,
            organization: authenticatedUser.organization, // Link holiday to the user's organization
        });

        await newHoliday.save();

        return NextResponse.json({ message: 'Holiday added successfully', holiday: newHoliday });
    } catch (error) {
        console.error('Error adding holiday:', error);
        return NextResponse.json({ error: 'Failed to add holiday' }, { status: 500 });
    }
}

// GET: Fetch all holidays for the authenticated user's organization
export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const authenticatedUser = await User.findById(userId);
        if (!authenticatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch all holidays for the authenticated user's organization
        const holidays = await Holiday.find({ organization: authenticatedUser.organization });

        return NextResponse.json({ holidays });
    } catch (error) {
        console.error('Error fetching holidays:', error);
        return NextResponse.json({ error: 'Failed to fetch holidays' }, { status: 500 });
    }
}
