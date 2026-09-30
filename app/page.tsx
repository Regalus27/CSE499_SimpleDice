'use client';
// import necessary modules and components
import { useMemo, useState } from 'react';
import { saveRollToDatabase } from '@/lib/rolls';
import { sessionStatistics } from '@/lib/statistics/fetchStatistics';
import type { DiceRoll } from '@/lib/statistics/Stats';
import RollDice from './components/homePage/rollDice';
import type { RollPayload } from '@/lib/rolls';
import SessionStatistics from './components/homePage/sessionStatistics';




export default function Home() {
  const [selectedDice, setSelectedDice] = useState(6);
  const [sessionRolls, setSessionRolls] = useState<DiceRoll[]>([]);

  // Derived so the "current die" stat stays in sync whenever the selected die or rolls change.
  const statistics = useMemo(
    () => sessionStatistics(sessionRolls, selectedDice),
    [sessionRolls, selectedDice],
  );

  const handleRoll = (roll: RollPayload) => {
    const userIsLoggedIn = false; // Replace with actual login check logic
    
    if (userIsLoggedIn) {
      // Save the roll to the database if the user is logged in
      void saveRollToDatabase(roll).catch((error: unknown) => {
        console.error('Failed to save roll:', error);
      });
    }

    setSessionRolls((currentRolls) => [
      ...currentRolls,
      { dice_type: roll.dice_type, dice_sum: roll.dice_sum },
    ]);
  };

  return (
    <div className='min-h-[calc(100vh-80px)] bg-[var(--bg)] px-4 py-8'>
      <div className='mx-auto max-w-5xl rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_10px_30px_rgba(20,42,67,0.08)] md:p-8'>
        <section className='w-full rounded-[24px] bg-[var(--bg)] p-6'>
          {/* Roll Dice Component */}
          <RollDice
            selectedDice={selectedDice}
            onDiceChange={setSelectedDice}
            onRoll={handleRoll}
          />

          {/* Session Statistics Component */}
          <SessionStatistics
            statistics={statistics}
            selectedDice={selectedDice}
          />
        </section>
      </div>
    </div>
  );
}
