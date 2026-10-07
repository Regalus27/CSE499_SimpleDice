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
        // join #1: test_roll
        {
          $lookup: {
            from: 'test_roll',
            let: { activityId: '$activityId' }, // parent id (not _id?) of activities collection
            pipeline: [
              { $match: { $expr: { $eq: ['$activity_id', '$$activityId'] } } }, // $$id refers to var
              { $sort: { time_rolled: -1 } },
              { $limit: 1 }, // pull only the most recent roll for each activity
              {
                $project: {
                  _id: 1, // need this for next join
                  activity_id: 1, 
                  time_rolled: 1, // used in sorting
                },
              },
            ],
            as: 'rolls',
          },
        },
        // join #2: test_dice
        {
          $lookup: {
            from: 'test_dice',
            let: { rollId: { $arrayElemAt: ['$rolls._id', 0] } }, // extract roll id from test_rolls table
            pipeline: [
              { $match: { $expr: { $eq: ['$roll_id', '$$rollId'] } } }, // $$id refers to var
              { $limit: 10 }, // pull up to 10 dice values
              {
                $project: {
                  _id: 0, // no more joins, don't need
                  roll_id: 1,
                  dice_type: 1,
                  dice_result: 1,
                },
              },
            ],
            as: 'dice_values',
          },
        },
        {
          $project: {
            _id: 1,
            activityId: 1,
            userId: 1,
            name: 1,
            lastRolled: { $arrayElemAt: ['$rolls.time_rolled', 0] }, // grab index 0 for timestamp of latest roll
            recentRolls: {
              $map: {
                input: '$dice_values', // telling which table to use
                as: 'd',
                in: {
                  diceType: '$$d.dice_type',
                  diceValue: '$$d.dice_result',
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
