import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import { getDatabase } from '@/lib/mongodb';
import type { RollPayload } from '@/lib/rolls';

export async function POST(request: NextRequest) {
  try {
    const sessionId = (await cookies()).get('session')?.value;
    if (!sessionId || !ObjectId.isValid(sessionId)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }
    const roll: RollPayload = await request.json();

    if (!roll.dice_type || !roll.dice_quantity || roll.dice_sum === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Formatting Error: Invalid Dice Roll.',
        },
        {
          status: 400,
        },
      );
    }

    if (typeof roll.activity_id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Activity is required.' },
        { status: 400 },
      );
    }

    const database = await getDatabase();
    const activity = await database
      .collection('activities')
      .findOne({ activityId: roll.activity_id, userId: sessionId });

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found.' },
        { status: 404 },
      );
    }

    const doc = {
      activity_id: roll.activity_id,
      dice_type: roll.dice_type,
      dice_quantity: roll.dice_quantity,
      dice_sum: roll.dice_sum,
      time_rolled: new Date(),
    };

    const collection = database.collection('dice_rolls');
    const result = await collection.insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        id: result.insertedId.toString(),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error('Roll save error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Server Error: Failed to insert data.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    const sessionId = (await cookies()).get('session')?.value;
    if (!sessionId || !ObjectId.isValid(sessionId)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const database = await getDatabase();
    const activities = await database
      .collection('activities')
      .find({ userId: sessionId })
      .project({ _id: 0, activityId: 1 })
      .toArray();

    const rolls = await database
      .collection('dice_rolls')
      .find({ activity_id: { $in: activities.map((a) => a.activityId) } })
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