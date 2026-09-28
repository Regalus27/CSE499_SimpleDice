// Fetches statistics for dice rolls from the API and calculates total rolls, sum of rolls, and the most frequent roll.

import {
  Statistics as calculateStatistics,
  getMostFrequentRoll,
  getMostFrequentRollForDice,
  getSumOfRolls,
  getTotalRolls,
  type DiceRoll,
} from '@/lib/statistics/Stats';

// The structure of Roll represents a single dice roll with its type and sum.
export type Roll = {
  dice_type: number;
  dice_sum: number;
};

// The structure of Statistics represents the calculated statistics for dice rolls.
export type Statistics = {
  totalRolls: number;
  sumOfRolls: number;
  mostFrequentRoll: number;
  mostFrequentRollForCurrentDice: number;
};
export const fetchAccountStatistics = async (): Promise<Statistics> => {
  try {
    const response = await fetch('/api/rolls');

    if (!response.ok) {
      throw new Error('Failed to fetch rolls');
    }

    const data: { rolls: Roll[] } = await response.json();

    // Account-wide statistics span every dice type, so there is no single "current die" to filter by.
    const stats = await calculateStatistics(data.rolls, 0);

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

  const sums = rolls.map((roll) => roll.dice_sum);

  const total = getTotalRolls(sums);
  const sum = getSumOfRolls(sums);
  const frequent = getMostFrequentRoll(sums);
  const frequentForCurrentDice = getMostFrequentRollForDice(
    rolls,
    currentDiceType,
  );

  return {
    totalRolls: total,
    sumOfRolls: sum,
    mostFrequentRoll: frequent,
    mostFrequentRollForCurrentDice: frequentForCurrentDice,
  };
};
