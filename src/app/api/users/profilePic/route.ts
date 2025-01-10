// src/app/api/users/updateProfilePic/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/userModel';
import { getDataFromToken } from '@/helper/getDataFromToken';

connectDB();

export async function PATCH(request: NextRequest) {
    try {
        // Extract user ID from the authentication token
        const userId = await getDataFromToken(request);

        const { profilePic } = await request.json();
        const user = await User.findByIdAndUpdate(userId, { profilePic }, { new: true });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ message: 'Profile picture updated successfully', profilePic: user.profilePic });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        return NextResponse.json({ error: 'Failed to update profile picture' }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findByIdAndUpdate(userId, { profilePic: '' }, { new: true });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ message: 'Profile picture removed successfully' });
    } catch (error) {
        console.error('Error removing profile picture:', error);
        return NextResponse.json({ error: 'Failed to remove profile picture' }, { status: 500 });
    }
}