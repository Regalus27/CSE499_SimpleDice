import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getDatabase } from "@/lib/mongodb";
import type { RollPayload } from "@/lib/rolls";

export async function POST(request: NextRequest) {
  try {
    const roll: RollPayload = await request.json();

    if (
      !roll.dice_type ||
      !roll.dice_quantity ||
      roll.dice_sum === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Formatting Error: Invalid Dice Roll.",
        },
        {
          status: 400,
        }
      );
    }

    const database = await getDatabase();

    const collection =
      database.collection("dice_rolls");

    const doc = {
      activity_id: new ObjectId(),

      dice_type: roll.dice_type,

      dice_quantity:
        roll.dice_quantity,

      dice_sum: roll.dice_sum,

      time_rolled: new Date(),
    };

    const result =
      await collection.insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        id: result.insertedId.toString(),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Roll save error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Server Error: Failed to insert data.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: NextRequest) {
    const uri = process.env.DB_URI!;
    const client = new MongoClient(uri);

    try {
        const database = client.db("db");
        const collection = database.collection("dice_rolls");
        const rolls = await collection.find().toArray();
        return NextResponse.json({ success: true, rolls }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Server Error: Failed to fetch data." }, { status: 500 });
    } finally {
        await client.close();
    }
}