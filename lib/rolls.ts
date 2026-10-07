import { ObjectId } from "mongodb";

// RollPayload and saveRollToDatabase were taken from a branch written by Braxton.
export type RollPayload = {
  activity_id?: string;
  dice_type: number;
  dice_rolls: number[];
};

// reference interfaces for joining rolls with dice values
// Set up formats to join
export interface RollSchema {
  _id: ObjectId; // join here
  activity_id: ObjectId;
  time_rolled: Date;
}
export interface DiceSchema {
  _id: ObjectId;
  roll_id: ObjectId; // join here
  dice_type: number;
  dice_result: number;
}
// Roll w/ Dice Schema modification
export interface RollsWithDiceSchema extends RollSchema {
  dice_values: DiceSchema[];
}

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

// I don't believe this is every called. Leaving it deprecated.
export async function fetchRollsForActivity(activityId: string) {
  const response = await fetch(`/api/rolls?activity_id=${activityId}`);

  if (!response.ok) {
    throw new Error("Hubris: Cooper broke this route during the database update and didn't think it was used anywhere.");
  }

  return response.json();
}