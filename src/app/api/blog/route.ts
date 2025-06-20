// src/app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Blog from '@/models/blogModel';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { getDataFromToken } from '@/helper/getDataFromToken';

// GET all blog posts
export async function GET() {
  try {
    await connectDB();
    const posts = await Blog.find().populate('author');
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// CREATE a blog post
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const userId = await getDataFromToken(request);
    // body should contain necessary fields
    const { title, slug, excerpt, content, coverImage, media, categories, tags, published, metaTitle, metaDescription } = body;

    const newPost = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      media,
      categories,
      tags,
      author: userId,
      published,
      metaTitle,
      metaDescription,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}


