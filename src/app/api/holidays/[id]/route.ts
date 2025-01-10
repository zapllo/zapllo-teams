// app/api/holidays/[id]/route.ts

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Ensure you have the DB connection setup
import Holiday from '@/models/holidayModel'; // Your Holiday model

// Ensure DB connection is established
connectDB();

// PUT request: Update holiday
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { holidayName, holidayDate } = await request.json();

  try {
    const updatedHoliday = await Holiday.findByIdAndUpdate(
      id,
      { holidayName, holidayDate },
      { new: true }
    );

    if (!updatedHoliday) {
      return NextResponse.json({ error: 'Holiday not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, holiday: updatedHoliday });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update holiday' }, { status: 500 });
  }
}

// DELETE request: Remove holiday
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const deletedHoliday = await Holiday.findByIdAndDelete(id);

    if (!deletedHoliday) {
      return NextResponse.json({ error: 'Holiday not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Holiday deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete holiday' }, { status: 500 });
  }
}
