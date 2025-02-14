// src/app/api/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Blog from '@/models/blogModel';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';



// GET a single blog post by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
        }

        const blog = await Blog.findById(id).populate('author');

        if (!blog) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
        }

        return NextResponse.json(blog, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
    }
}


// UPDATE a blog post
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const body = await request.json();
        const { id } = params;

        const updatedPost = await Blog.findByIdAndUpdate(
            id,
            { ...body },
            { new: true }
        );

        if (!updatedPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

// DELETE a blog post
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;

        const deleted = await Blog.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
