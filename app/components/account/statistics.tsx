"use client";

import { useEffect, useState } from "react";

type Roll = {
  dice_sum: number;
};

type Statistics = {
  totalRolls: number;
  sumOfRolls: number;
  mostFrequentRoll: number;
};

export default function AccountStatistics() {
  const [statistics, setStatistics] = useState<Statistics>({
    totalRolls: 0,
    sumOfRolls: 0,
    mostFrequentRoll: 0,
  });

  useEffect(() => {
    async function fetchStatistics() {
      try {
        const response = await fetch("/api/rolls");

        if (!response.ok) {
          throw new Error("Failed to fetch rolls");
        }

        const data: { rolls: Roll[] } = await response.json();
        const rolls = data.rolls ?? [];

        const frequency = new Map<number, number>();

        for (const roll of rolls) {
          frequency.set(
            roll.dice_sum,
            (frequency.get(roll.dice_sum) ?? 0) + 1
          );
        }

        const mostFrequentRoll =
          [...frequency.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;

        setStatistics({
          totalRolls: rolls.length,
          sumOfRolls: rolls.reduce(
            (sum, roll) => sum + roll.dice_sum,
            0
          ),
          mostFrequentRoll,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    }

    fetchStatistics();
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-bold text-[var(--navy)]">
        Global Statistics
      </h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-white p-4 text-center">
          <p className="text-2xl font-bold text-[var(--navy)]">
            {statistics.totalRolls}
          </p>
          <p className="mt-1 text-sm text-[var(--text)]/70">
            Total Rolls
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-white p-4 text-center">
          <p className="text-2xl font-bold text-[var(--navy)]">
            {statistics.sumOfRolls}
          </p>
          <p className="mt-1 text-sm text-[var(--text)]/70">
            Sum of All Rolls
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-white p-4 text-center">
          <p className="text-2xl font-bold text-[var(--navy)]">
            {statistics.mostFrequentRoll}
          </p>
          <p className="mt-1 text-sm text-[var(--text)]/70">
            Most Frequent Roll
          </p>
        </div>
      </div>
    </section>
  );
}