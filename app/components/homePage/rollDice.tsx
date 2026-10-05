'use client';

import { useState } from 'react';
import type { RollPayload } from '@/lib/rolls';

type RollDiceProps = {
  selectedDice: number;
  onDiceChange: (sides: number) => void;
  onRoll: (roll: RollPayload) => void;
};

const diceOptions = [
  { label: 'd4 (4-sided)', sides: 4 },
  { label: 'd6 (6-sided)', sides: 6 },
  { label: 'd8 (8-sided)', sides: 8 },
  { label: 'd10 (10-sided)', sides: 10 },
  { label: 'd12 (12-sided)', sides: 12 },
  { label: 'd20 (20-sided)', sides: 20 },
  { label: 'd100 (100-sided)', sides: 100 },
];

export default function RollDice({
  selectedDice,
  onDiceChange,
  onRoll,
}: RollDiceProps) {
  const [quantity, setQuantity] = useState(1);
  const [result, setResult] = useState<number | null>(null);
  

  // Handles the dice roll logic and updates the result and parent component.
  // Main Logic for rolling the dice.
  function handleRoll() {
    let total = 0;

    for (let index = 0; index < quantity; index++) {
      total += Math.floor(Math.random() * selectedDice) + 1;
    }

    setResult(total);
    onRoll({
      dice_type: selectedDice,
      dice_quantity: quantity,
      dice_sum: total,
    });
  }

  return (
    <section>
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-[var(--text)]">
          Roll Your Dice
        </h1>
        <p className="mt-2 text-base text-[var(--text)]/75">
          Choose your dice, set the amount, and let fate decide!
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--text)]">
            Dice Type
          </span>
          <select
            value={selectedDice}
            onChange={(event) => onDiceChange(Number(event.target.value))}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-[var(--text)] outline-none focus:border-[var(--primary)]"
          >
            {diceOptions.map((dice) => (
              <option key={dice.label} value={dice.sides}>
                {dice.label}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="mb-2 block text-sm font-medium text-[var(--text)]">
            Quantity
          </span>
          <div className="flex items-center rounded-xl border border-[var(--border)] bg-white">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="px-4 py-3 text-xl text-[var(--text)]"
            >
              −
            </button>
            <span className="flex-1 text-center text-lg font-semibold text-[var(--text)]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((current) => current + 1)}
              className="px-4 py-3 text-xl text-[var(--text)]"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleRoll}
        className="mt-6 w-full rounded-xl bg-[var(--primary)] px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#1268d6]"
      >
        Roll Dice
      </button>

      <div className="mt-6 border-t border-[var(--border)] pt-6 text-center">
        <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">
          Roll Result
        </h2>
        <p className="text-base text-[var(--text)]">
          The rolled result is:
          <span className="ml-2 font-bold">{result ?? '—'}</span>
        </p>
      </div>
    </section>
  );
}