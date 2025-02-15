import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogModel";
import connectDB from "@/lib/db";
import { getDataFromToken } from "@/helper/getDataFromToken";
import mongoose from "mongoose";


// ✅ GET Comments for a specific blog post
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
        }

        const blog = await Blog.findById(id).populate("comments.user", "firstName lastName profilePic");

        if (!blog) {
            return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }

        return NextResponse.json({ comments: blog.comments }, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}


export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = params;
        const { content } = await request.json();

        // Check if the user is logged in
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }

        // Add comment
        blog.comments.push({
            user: userId, content, createdAt: new Date(),
            updatedAt: new Date(),
        });
        await blog.save();
        // Populate the newly added comment with user details
        const populatedBlog = await Blog.findById(id).populate("comments.user", "firstName lastName profilePic");
        const lastComment = populatedBlog?.comments[populatedBlog.comments.length - 1];

        return NextResponse.json({ comment: lastComment }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
}
