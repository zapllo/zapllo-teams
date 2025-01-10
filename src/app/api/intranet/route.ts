// /app/api/intranet/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Intranet from '../../../models/intranetModel'; // Adjust the path to your Intranet model
import connectDB from '@/lib/db';
import { getDataFromToken } from '@/helper/getDataFromToken';
import User from '@/models/userModel';

// Connect to the database
connectDB();

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const userId = await getDataFromToken(request);
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const intranet = await Intranet.create({ ...data, organization: user.organization });
        return NextResponse.json(intranet, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create Intranet entry' }, { status: 400 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const intranetEntries = await Intranet.find({ organization: user.organization }).populate('category');
        return NextResponse.json(intranetEntries);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch Intranet entries' }, { status: 400 });
    }
}

// PATCH endpoint for updating an intranet entry
export async function PATCH(request: NextRequest) {
    try {
        const { id, linkUrl, description, linkName, category } = await request.json();
        const userId = await getDataFromToken(request);
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if the entry belongs to the user's organization
        const entry = await Intranet.findOne({ _id: id, organization: user.organization });
        if (!entry) {
            return NextResponse.json({ error: 'Intranet entry not found or does not belong to the user\'s organization' }, { status: 404 });
        }

        const updatedEntry = await Intranet.findByIdAndUpdate(
            id,
            { linkUrl, description, linkName, category },
            { new: true }
        );
        if (!updatedEntry) {
            return NextResponse.json({ error: 'Intranet entry not found' }, { status: 404 });
        }
        return NextResponse.json(updatedEntry);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update Intranet entry' }, { status: 400 });
    }
}

// DELETE endpoint for deleting an intranet entry
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        const userId = await getDataFromToken(request);
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if the entry belongs to the user's organization
        const entry = await Intranet.findOne({ _id: id, organization: user.organization });
        if (!entry) {
            return NextResponse.json({ error: 'Intranet entry not found or does not belong to the user\'s organization' }, { status: 404 });
        }

        const deletedEntry = await Intranet.findByIdAndDelete(id);
        if (!deletedEntry) {
            return NextResponse.json({ error: 'Intranet entry not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Intranet entry deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete Intranet entry' }, { status: 400 });
    }
}
