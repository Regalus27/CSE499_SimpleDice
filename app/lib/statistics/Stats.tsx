export type Stats = {
  totalRolls: number;
  sumOfRolls: number;
  mostFrequentRoll: number;
};

export const getTotalRolls = (rolls: number[]): number => {
  return rolls.length;
};

export const getSumOfRolls = (rolls: number[]): number => {
  return rolls.reduce((sum, roll) => sum + roll, 0);
};

export const getMostFrequentRoll = (rolls: number[]): number => {
  if (rolls.length === 0) {
    return 0;
  }

  const rollCounts: Record<number, number> = {};

  rolls.forEach((roll) => {
    rollCounts[roll] = (rollCounts[roll] ?? 0) + 1;
  });

  return Number(
    Object.keys(rollCounts).reduce(
      (currentBest, nextRoll) =>
        rollCounts[Number(currentBest)] >= rollCounts[Number(nextRoll)]
          ? currentBest
          : nextRoll,
      '0',
    ),
  );
};

export const Statistics = async (rolls: number[]): Promise<Stats> => {
  return {
    totalRolls: getTotalRolls(rolls),
    sumOfRolls: getSumOfRolls(rolls),
    mostFrequentRoll: getMostFrequentRoll(rolls),
  };
};
