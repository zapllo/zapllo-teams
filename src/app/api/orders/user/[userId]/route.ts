import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/orderModel';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        await connectDB(); // Ensure the database is connected

        const { userId } = params;

        // Fetch orders by user ID
        const userOrders = await Order.find({ userId }).sort({ createdAt: -1 }).exec();

        if (!userOrders) {
            return NextResponse.json({ error: 'No orders found for this user' }, { status: 404 });
        }

        return NextResponse.json(userOrders, { status: 200 });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
