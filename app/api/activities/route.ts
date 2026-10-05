import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';

// GET /api/activities - Fetch all activities for the authenticated user
export async function GET() {
  try {
    const sessionId = (await cookies()).get('session')?.value;

    if (!sessionId || !ObjectId.isValid(sessionId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const activities = await db
      .collection('activities')
      .aggregate([
        { $match: { userId: sessionId } },
        {
          $lookup: {
            from: 'dice_rolls',
            let: { id: '$activityId' },
            pipeline: [
              { $match: { $expr: { $eq: ['$activity_id', '$$id'] } } },
              { $sort: { time_rolled: -1 } },
              { $limit: 5 },
              {
                $project: {
                  _id: 0,
                  dice_type: 1,
                  dice_quantity: 1,
                  dice_sum: 1,
                  time_rolled: 1,
                },
              },
            ],
            as: 'rolls',
          },
        },
        {
          $project: {
            _id: 0,
            activityId: 1,
            userId: 1,
            name: 1,
            lastRolled: { $arrayElemAt: ['$rolls.time_rolled', 0] },
            recentRolls: {
              $map: {
                input: '$rolls',
                as: 'roll',
                in: {
                  diceType: '$$roll.dice_type',
                  quantity: '$$roll.dice_quantity',
                  result: '$$roll.dice_sum',
                },
              },
            },
          },
        },
      ])
      .toArray();

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Activity fetch error:', error);
    return NextResponse.json(
      { error: 'Unable to fetch activities.' },
      { status: 500 },
    );
  }
}

// POST /api/activities - Create a new activity for the authenticated user
export async function POST(request: Request) {
  try {
    const sessionId = (await cookies()).get('session')?.value;

    if (!sessionId || !ObjectId.isValid(sessionId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: unknown = await request.json();
    const name =
      typeof body === 'object' &&
      body !== null &&
      'name' in body &&
      typeof body.name === 'string'
        ? body.name.trim()
        : '';

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const activity = {
      activityId: new ObjectId().toString(),
      userId: sessionId,
      name,
    };
    await db.collection('activities').insertOne({
      ...activity,
    });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error('Activity create error:', error);
    return NextResponse.json(
      { error: 'Unable to create activity.' },
      { status: 500 },
    );
  }
}
// DELETE /api/activities - Delete an activity for the authenticated user
export async function DELETE(request: Request) {
  try {
    const sessionId = (await cookies()).get('session')?.value;

    if (!sessionId || !ObjectId.isValid(sessionId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: unknown = await request.json();
    const activityId =
      typeof body === 'object' &&
      body !== null &&
      'activityId' in body &&
      typeof body.activityId === 'string'
        ? body.activityId.trim()
        : '';

    if (!activityId) {
      return NextResponse.json(
        { error: 'Activity ID is required' },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const result = await db.collection('activities').deleteOne({
      activityId,
      userId: sessionId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Activity delete error:', error);
    return NextResponse.json(
      { error: 'Unable to delete activity.' },
      { status: 500 },
    );
  }
}
