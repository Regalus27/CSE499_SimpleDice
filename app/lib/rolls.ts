import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// RollPayload and saveRollToDatabase were taken from a branch written by Braxton.
export type RollPayload = {
  dice_type: number;
  dice_quantity: number;
  dice_sum: number;
  time_rolled: string;
};



export async function saveRollToDatabase(roll: RollPayload) {
  const response = await fetch("/api/rolls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(roll),
  });

  if (!response.ok) {
    throw new Error("Failed to save roll");
  }

  return response.json();
}