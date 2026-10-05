import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import { getDatabase } from '@/lib/mongodb';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ activityId: string }> },
) {
  try {
    const sessionId = (await cookies()).get('session')?.value;
    if (!sessionId || !ObjectId.isValid(sessionId)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { activityId } = await params;
    const database = await getDatabase();

    // Ownership check: users can only read rolls for their own activities.
    const activity = await database
      .collection('activities')
      .findOne({ activityId, userId: sessionId });

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found.' },
        { status: 404 },
      );
    }

    const rolls = await database
      .collection('dice_rolls')
      .find({ activity_id: activityId })
      .sort({ time_rolled: -1 })
      .toArray();

    return NextResponse.json({ success: true, rolls });
  } catch (error) {
    console.error('Roll fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Server Error: Failed to fetch data.' },
      { status: 500 },
    );
  }
}