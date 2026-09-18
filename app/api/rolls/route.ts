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
        return NextResponse.json({ error: "Invalid JSON string." }, {status: 400});
    }

    // putting it in a helper function broke it.
    /**return NextResponse.json({
        success: true,
    }, { status: 200 });**/

    // get URI from .env
    // needs error handling if it is null
    const uri = process.env.DB_URI!;

    // set up MongoClient
    // Probably shouldn't set up a new instance for each individual call. Optimizations for next sprint.
    const client = new MongoClient(uri);

    try {
        const database = client.db("db");
        const collection = database.collection("dice_rolls");
        const doc = {
            // mongodb handles _id
            // fake activity id
            activity_id: new ObjectId(),
            dice_type: roll.dice_type, // I decided using an int is good enough
            dice_quantity: roll.dice_quantity,
            dice_sum: roll.dice_sum,
            time_rolled: roll.time_rolled,
        };
        const result = await collection.insertOne(doc);
        // Send a JSON response back
        return NextResponse.json({
            success: true,
        }, { status: 200 });
        
    } catch (error) { // More granualar error messages needed.
        return NextResponse.json({
            success: false,
            message: "Server Error: Failed to insert data."
        }, { status: 500 });
    } finally {
        await client.close();
    }
}
