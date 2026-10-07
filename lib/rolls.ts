// RollPayload and saveRollToDatabase were taken from a branch written by Braxton.
export type RollPayload = {
  activity_id?: string;
  dice_type: number;
  dice_rolls: number[];
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





export async function fetchRollsForActivity(activityId: string) {
  const response = await fetch(`/api/rolls?activity_id=${activityId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch rolls");
  }

  return response.json();
}