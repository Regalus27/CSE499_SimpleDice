import type { Statistics } from '@/lib/statistics/fetchStatistics';

type SessionStatisticsProps = {
  statistics: Statistics;
  selectedDice: number;
};

export default function SessionStatistics({
  statistics,
  selectedDice,
}: SessionStatisticsProps) {
    return (
        <div className='mt-6 border-t border-[var(--border)] pt-6 text-center'>
            <h2 className='text-lg font-semibold text-[var(--text)] mb-2'>
              Session Statistics
            </h2>
            <p className='text-base text-[var(--text)]'>
              Total Rolls:{' '}
              <span className='font-bold text-[var(--text)]'>
                {statistics?.totalRolls ?? '—'}
              </span>
            </p>
            <p className='text-base text-[var(--text)]'>
              Sum of Rolls:{' '}
              <span className='font-bold text-[var(--text)]'>
                {statistics?.sumOfRolls ?? '—'}
              </span>
            </p>
            <p className='text-base text-[var(--text)]'>
              Most Frequent Roll of current die ({selectedDice} sides):{' '}
              <span className='font-bold text-[var(--text)]'>
                {statistics?.mostFrequentRollForCurrentDice ?? '—'}
              </span>
            </p>
            <p className='text-base text-[var(--text)]'>
              Most Frequent Roll (all dice):{' '}
              <span className='font-bold text-[var(--text)]'>
                {statistics?.mostFrequentRoll ?? '—'}
              </span>
            </p>
          </div>
    );
}