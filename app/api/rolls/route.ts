import { RollPayload } from '@/app/lib/rolls';
import { MongoClient, ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    // convert request to usable data, return bad format if fails
    const body = await request.text();
    let roll;
    try {
        roll = JSON.parse(body) as RollPayload;
    } catch (error) {
        return NextResponse.json({ error: "Formatting Error: Invalid Dice Roll." }, {status: 400});
    }

    // get URI from .env
    // check if it exists
    if (!("DB_URI" in process.env)) {
        return NextResponse.json({error: "Server Error: Missing Environment Variable."}, {status: 500});
    }
    const uri = process.env.DB_URI!;

    // set up MongoClient
    const client = new MongoClient(uri);

    try {
        const database = client.db("db");
        const collection = database.collection("dice_rolls");
        const doc = {
            // mongodb handles _id
            activity_id: new ObjectId(), // fake activity id
            dice_type: roll.dice_type, // I decided using an int is good enough
            dice_quantity: roll.dice_quantity,
            dice_sum: roll.dice_sum,
            time_rolled: new Date(),
                // updated to use BSON date from mongodb, we can edit RollPayload from rolls.ts and the roll function in the main page 
                // to remove any date handling
        };
        const result = await collection.insertOne(doc);
        // Send a JSON response back
        return NextResponse.json({
            success: true,
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: "Server Error: Failed to insert data."
        }, { status: 500 });
    } finally {
        await client.close();
    }
}
