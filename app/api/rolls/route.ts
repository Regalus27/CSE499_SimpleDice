import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import { getDatabase, getMongoClient } from '@/lib/mongodb';
import type { RollPayload, RollSchema, RollsWithDiceSchema } from '@/lib/rolls';
import { DiceRoll } from '@/lib/statistics/Stats';

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

    if (!roll.dice_type || roll.dice_rolls === undefined) {
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

    // Swapped from database to a more generic mongoclient to allow for sessions and transactions.
    // This is necessary to simultaneously work with multiple collections for the dice overhaul.
    const client = await getMongoClient();
    const activity = client
      .db('db')
      .collection('activities')
      .findOne({ activityId: roll.activity_id, userId: sessionId });
    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found.' },
        { status: 404 },
      );
    }

    // Create new roll_id to tie rolls and dice
    // Technically not guaranteed to be unique, but ensuring this is unique is beyond the scope of a low-stakes 4 week project.
    const roll_id = new ObjectId();
    const roll_doc = {
      _id: roll_id,
      activity_id: roll.activity_id, // modifying this to string to match activities design
      time_rolled: new Date(),
    }

    // Create array of dice_docs to be pushed to database simultaneously with the overarching roll_doc
    let dice_docs = []
    for (const roll_number of roll.dice_rolls) {
      let dice_doc = {
        // _id will be handled automatically by MongoDb
        roll_id: roll_id, // foreign key
        dice_type: roll.dice_type,
        dice_result: roll_number,
      };
      dice_docs.push(dice_doc);
    }

    // Start Session
    const session = client.startSession();

    // Transaction to add the data to the roll and dice_values collections in one call.
    try {
      await session.withTransaction(async () => {
        const roll_collection = client.db('db').collection('test_roll');
        const dice_collection = client.db('db').collection('test_dice');

        await roll_collection.insertOne(roll_doc, { session });
        await dice_collection.insertMany(dice_docs, { session });
      });
    } 
    // errors here will be caught by our nested try/catch
    finally {
      // Close Session
      await session.endSession();
      await client.close();
    }

    return NextResponse.json(
      {
        success: true,
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
      .project({ _id: 0, activityId: 1 }) // activityId: string
      .toArray();

    /*const rolls = await database
      .collection('test_roll') // CHANGE
      .find({ activity_id: { $in: activities.map((a) => a.activityId) } })
      .sort({ time_rolled: -1 })
      .toArray();
    */

    // join tables and match against above activityIds
    // Grab rolls
    const rollCollection = database.collection<RollSchema>("test_roll");
    // Join with dice values
    const cursor = rollCollection.aggregate<RollsWithDiceSchema>([
      {
        $lookup: {
          from: "test_dice",        // target collection
          localField: "_id",        // source primary key
          foreignField: "roll_id",  // target foreign key
          as: "rolls_with_dice",    
        },
      },
    ]);

    const rollsWithDice = await cursor.toArray();

    // filter to activity id
    // TODO: Now I know how to do this in one query but I am NOT writing that at 1am
    const validActivityIds = activities.map((activity) => new ObjectId(activity.activityId));
    const roll = rollsWithDice.filter(r => validActivityIds.includes(r.activity_id));

    // Convert RollsWithDiceSchema to DiceRoll
    let diceValues: Array<DiceRoll> = []; // dice_sum (actually dice_value now)
    const diceRolls = roll.map((roll) => roll.dice_values);
    for (const diceRoll of diceRolls) {
      for (const dice of diceRoll) {
        let object: DiceRoll = {
          dice_type: dice.dice_type,
          dice_value: dice.dice_result,
        };
        diceValues.push(object);
      }
    }

    return NextResponse.json({ success: true, diceValues });
  } catch (error) {
    console.error('Roll fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Server Error: Failed to fetch data.' },
      { status: 500 },
    );
  }
}