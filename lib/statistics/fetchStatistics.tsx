// Fetches statistics for dice rolls from the API and calculates total rolls, sum of rolls, and the most frequent roll.

import {
  Statistics,
  getMostFrequentRoll,
  getMostFrequentRollForDice,
  getSumOfRolls,
  getTotalRolls,
  type DiceRoll,
} from '@/lib/statistics/Stats';
import { Activity } from '../activities/useActivities';

// The structure of Statistics represents the calculated statistics for dice rolls.
export type Statistics = {
  totalRolls: number;
  sumOfRolls: number;
  mostFrequentRoll: number;
  mostFrequentRollForCurrentDice: number;
};

// Fetches account-wide statistics for dice rolls.
export const fetchAccountStatistics = async (): Promise<Statistics> => {
  try {
    // Get all activities associated with user
    const response = await fetch('/api/activities');

    if (!response.ok) {
      throw new Error('Failed to fetch rolls');
    }

    const data: { activities: Activity[] } = await response.json();

    // Extract all dice rolls
    let diceRolls: Array<DiceRoll> = [];
    // TODO: add new endpoint just for this now that it functions.
    for (const rolled of data.activities[0].globalRolls) {
      // convert from RecentRoll to DiceRoll
      let diceRoll: DiceRoll = {
        dice_type: rolled.diceType,
        dice_value: rolled.diceValue
      }
      diceRolls.push(diceRoll);
    }

    // Account-wide statistics span every dice type, so there is no single "current die" to filter by.
    const stats = await Statistics(diceRolls, 0);

    return stats;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return {
      totalRolls: 0,
      sumOfRolls: 0,
      mostFrequentRoll: 0,
      mostFrequentRollForCurrentDice: 0,
    };
  }
};

// Fetches session-specific statistics for dice rolls.
export const sessionStatistics = (
  rolls: DiceRoll[],
  currentDiceType: number,
): Statistics => {
  if (rolls.length === 0) {
    return {
      totalRolls: 0,
      sumOfRolls: 0,
      mostFrequentRoll: 0,
      mostFrequentRollForCurrentDice: 0,
    };
  }

  const sums = rolls.map((roll) => roll.dice_value);

  // Calculate the total rolls, sum of rolls, and most frequent rolls based on the extracted sums.
  const total = getTotalRolls(sums);
  const sum = getSumOfRolls(sums);
  const frequent = getMostFrequentRoll(sums);
  const frequentForCurrentDice = getMostFrequentRollForDice(
    rolls,
    currentDiceType,
  );

  // Return the calculated statistics for the session.
  return {
    totalRolls: total,
    sumOfRolls: sum,
    mostFrequentRoll: frequent,
    mostFrequentRollForCurrentDice: frequentForCurrentDice,
  };
};
