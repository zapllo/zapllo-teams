// pages/api/organizations/summary.ts
import { NextRequest, NextResponse } from 'next/server';
import Organization from '@/models/organizationModel'; // Adjust the path as necessary
import Task from '@/models/taskModal'; // Adjust the path as necessary
import connectDB from '@/lib/db';

// Define the Organization interface
interface OrganizationType {
    _id: string;
    companyName: string;
    trialExpires: Date;
    tasks: string[]; // Adjust if tasks are more complex
    users: { _id: string }[];
}

export async function GET(request: NextRequest) {
    try {
        await connectDB(); // Ensure the database is connected

        // Fetch all organizations with their tasks
        const organizations: OrganizationType[] = await Organization.find({})
            .populate({
                path: 'users',
                select: '_id', // Populate with only necessary fields
            })
            .lean(); // Convert to plain JavaScript objects

        // Fetch all tasks and group them by organization
        const tasks = await Task.find({}).lean();

        const orgTasks = organizations.map(org => {
            const orgTasks = tasks.filter(task => task.organization.toString() === org._id.toString());
            const totalTasks = orgTasks.length;
            const completedTasks = orgTasks.filter(task => task.status === 'Completed').length;
            const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return {
                ...org,
                totalTasks,
                completedTasks,
                completionPercentage: completionPercentage.toFixed(2), // Keep two decimal places
            };
        });

        return NextResponse.json({ data: orgTasks });
    } catch (error) {
        console.error('Error fetching organization summary: ', error);
        return NextResponse.json({ error: 'Error fetching organization summary' }, { status: 500 });
    }
}
