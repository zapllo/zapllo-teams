// app/api/subscribers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Subscriber from '@/models/subscriber';

export const dynamic = 'force-dynamic'; // Ensures the route is always dynamic

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    return NextResponse.json({ message: 'Subscription successful' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const subscribers = await Subscriber.find({});

    return NextResponse.json(subscribers, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
