// Fetches statistics for dice rolls from the API and calculates total rolls, sum of rolls, and the most frequent roll.

import {
  Statistics as calculateStatistics,
  getMostFrequentRoll,
  getSumOfRolls,
  getTotalRolls,
} from "@/lib/statistics/Stats";

// The structure of Roll represents a single dice roll with its sum.
export type Roll = {
  dice_sum: number;
};

// The structure of Statistics represents the calculated statistics for dice rolls.
export type Statistics = {
  totalRolls: number;
  sumOfRolls: number;
  mostFrequentRoll: number;
};
export const fetchAccountStatistics = async (): Promise<Statistics> => {
  try {
    const response = await fetch('/api/rolls');

    if (!response.ok) {
      throw new Error('Failed to fetch rolls');
    }

    const data: { rolls: Roll[] } = await response.json();

    const rolls = data.rolls.map((roll) => roll.dice_sum);

    const stats = await calculateStatistics(rolls);

    return stats;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return {
      totalRolls: 0,
      sumOfRolls: 0,
      mostFrequentRoll: 0,
    };
  }
};

export const sessionStatistics = (rolls: number[]): Statistics => {
  if (rolls.length === 0) {
    return {
      totalRolls: 0,
      sumOfRolls: 0,
      mostFrequentRoll: 0,
    };
  }

  const total = getTotalRolls(rolls);
  const sum = getSumOfRolls(rolls);
  const frequent = getMostFrequentRoll(rolls);

  return {
    totalRolls: total,
    sumOfRolls: sum,
    mostFrequentRoll: frequent,
  };
};
