'use client';

import { useEffect, useState } from 'react';
import {
  fetchAccountStatistics,
  Statistics,
} from '@/lib/statistics/fetchStatistics';

export default function AccountStatistics() {
  const [statistics, setStatistics] = useState<Statistics>({
    totalRolls: 0,
    sumOfRolls: 0,
    mostFrequentRoll: 0,
    mostFrequentRollForCurrentDice: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      const stats = await fetchAccountStatistics();
      setStatistics(stats);
    };
    fetchData();
  }, []);

  return (
    <section>
      <h2 className='text-2xl font-bold text-[var(--text)]'>
        Global Statistics
      </h2>

      <div className='mt-6 grid gap-3 sm:grid-cols-2'>
        <div className='rounded-xl border border-[var(--border)] bg-white p-4 text-center'>
          <p className='text-2xl font-bold text-[var(--text)]'>
            {statistics.totalRolls}
          </p>
          <p className='mt-1 text-sm text-[var(--text)]/70'>Total Rolls</p>
        </div>

        <div className='rounded-xl border border-[var(--border)] bg-white p-4 text-center'>
          <p className='text-2xl font-bold text-[var(--text)]'>
            {statistics.sumOfRolls}
          </p>
          <p className='mt-1 text-sm text-[var(--text)]/70'>Sum of All Rolls</p>
        </div>

        <div className='rounded-xl border border-[var(--border)] bg-white p-4 text-center'>
          <p className='text-2xl font-bold text-[var(--text)]'>
            {statistics.mostFrequentRoll}
          </p>
          <p className='mt-1 text-sm text-[var(--text)]/70'>
            Most Frequent Roll
          </p>
        </div>
      </div>
    </section>
  );
}
