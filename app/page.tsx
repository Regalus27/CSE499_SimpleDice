"use client";

import { useState } from "react";
import { saveRollToDatabase } from "./lib/rolls";

const diceOptions = [
  { label: "d4 (4-sided)", sides: 4 },
  { label: "d6 (6-sided)", sides: 6 },
  { label: "d8 (8-sided)", sides: 8 },
  { label: "d10 (10-sided)", sides: 10 },
  { label: "d12 (12-sided)", sides: 12 },
  { label: "d20 (20-sided)", sides: 20 },
  { label: "d100 (100-sided)", sides: 100 },
];

export default function Home() {
  const [selectedDice, setSelectedDice] = useState(6);
  const [quantity, setQuantity] = useState(1);
  const [result, setResult] = useState<number | null>(null);

  const handleRoll = () => {
    let total = 0;

    for (let i = 0; i < quantity; i++) {
      total += Math.floor(Math.random() * selectedDice) + 1;
    }
    // Again, copying Braxton's rough draft for testing purposes.
    // this is how the database would store the roll information:
    // dice_type = selectedDice,
    // dice_quantity = quantity,
    // dice_sum = total,
    // time_rolled = new Date().toISOString()
    // console.log(`Rolled ${quantity}d${selectedDice}: ${total} at ${new Date().toISOString()}`);
    
    // if you are logged in it will save rolls to database
    const userIsLoggedIn = true; // Replace with actual login check logic
    if (userIsLoggedIn) {
      saveRollToDatabase({
        dice_type: selectedDice,
        dice_quantity: quantity,
        dice_sum: total,
        // time_rolled: new Date().toISOString(),
      });
    }

    setResult(total);
  };

  const updateQuantity = (change: number) => {
    setQuantity((current) => Math.max(1, current + change));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[var(--bg)] px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_10px_30px_rgba(20,42,67,0.08)] md:p-8">
        <section className="w-full rounded-[24px] bg-[var(--bg)] p-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--navy)]">
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
                onChange={(e) => setSelectedDice(Number(e.target.value))}
                className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-[var(--text)] outline-none focus:border-[var(--primary)]"
              >
                {diceOptions.map((dice) => (
                  <option key={dice.label} value={dice.sides}>
                    {dice.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--text)]">
                Quantity
              </span>
              <div className="flex items-center rounded-xl border border-[var(--border)] bg-white">
                <button
                  type="button"
                  onClick={() => updateQuantity(-1)}
                  className="px-4 py-3 text-xl text-[var(--navy)]"
                >
                  −
                </button>

                <span className="flex-1 text-center text-lg font-semibold text-[var(--text)]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => updateQuantity(1)}
                  className="px-4 py-3 text-xl text-[var(--navy)]"
                >
                  +
                </button>
              </div>
            </label>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleRoll}
              className="w-full rounded-xl bg-[var(--primary)] px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#1268d6]"
            >
              Roll Dice
            </button>
          </div>

          <div className="mt-6 border-t border-[var(--border)] pt-6 text-center">
            <p className="text-base text-[var(--text)]">
              The rolled result is:
              <span className="ml-2 font-bold text-[var(--navy)]">
                {result ?? "—"}
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}