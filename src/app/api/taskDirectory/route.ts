import connectDB from "@/lib/db";
import TaskTemplate from "@/models/templateModel";
import { NextResponse } from "next/server";

connectDB();

// Predefined task templates for industries
const predefinedTemplates = [
    {
        title: "Sales Objection Sheet",
        description: "Create a sheet with FAQs and client's objections.",
        category: "Sales",
        priority: "Medium",
        repeat: false,
    },
    {
        title: "Generate sales reports",
        description: "Compile and analyze sales performance data.",
        category: "Sales",
        priority: "High",
        repeat: false,
    },
    {
        title: "Monitor Competitor Pricing",
        description: "Regularly track competitor pricing strategies.",
        category: "Sales",
        priority: "Medium",
        repeat: false,
    },
    {
        title: "Hiring Plan for Q2",
        description: "Prepare a hiring roadmap for the next quarter.",
        category: "HR",
        priority: "High",
        repeat: false,
    },
    {
        title: "IT Security Audit",
        description: "Conduct a monthly security audit.",
        category: "IT",
        priority: "High",
        repeat: true,
        repeatType: "Monthly",
    },
];

// Insert predefined templates into DB
export async function POST() {
    try {
        await TaskTemplate.insertMany(predefinedTemplates);
        return NextResponse.json({ message: "Task directory populated successfully" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Get task directory templates
export async function GET() {
    try {
        const templates = await TaskTemplate.find();
        return NextResponse.json(templates);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
