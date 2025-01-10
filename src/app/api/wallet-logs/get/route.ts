// /app/api/order-logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/orderModel';
import connectDB from '@/lib/db';
import { getDataFromToken } from '@/helper/getDataFromToken';

export async function GET(request: NextRequest) {
    await connectDB(); // Ensure that the database is connected

    // Get the current user's session
    try {
    const userId = await getDataFromToken(request);

        const orders = await Order.find({ userId }).sort({ createdAt: -1 }).exec();

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching order logs: ', error);
        return NextResponse.json({ error: 'Error fetching order logs' }, { status: 500 });
    }
}
