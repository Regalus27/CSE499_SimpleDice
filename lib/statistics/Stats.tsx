export type DiceRoll = {
  dice_type: number;
  dice_sum: number;
};

export type Stats = {
  totalRolls: number;
  sumOfRolls: number;
  mostFrequentRoll: number;
  mostFrequentRollForCurrentDice: number;
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

// Restricts the most-frequent-roll calculation to rolls made with the given die.
export const getMostFrequentRollForDice = (
  rolls: DiceRoll[],
  diceType: number,
): number => {
  const sums = rolls
    .filter((roll) => roll.dice_type === diceType)
    .map((roll) => roll.dice_sum);

  return getMostFrequentRoll(sums);
};

export const Statistics = async (
  rolls: DiceRoll[],
  currentDiceType: number,
): Promise<Stats> => {
  const sums = rolls.map((roll) => roll.dice_sum);

  return {
    totalRolls: getTotalRolls(sums),
    sumOfRolls: getSumOfRolls(sums),
    mostFrequentRoll: getMostFrequentRoll(sums),
    mostFrequentRollForCurrentDice: getMostFrequentRollForDice(
      rolls,
      currentDiceType,
    ),
  };
};
