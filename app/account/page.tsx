"use client";

import { useState } from "react";

type Activity = {
  id: number;
  name: string;
  description: string;
};

const activityOptions = [
  "Dice Game",
  "Card Game",
  "Multiplayer Game",
  "Puzzle Game",
  "Dungeons & Dragons",
  "Role-Playing Game",
  "Other",
];

export default function AccountPage() {
const isUserLoggedIn = true;
const [activities, setActivities] = useState<Activity[]>([]);
const [selectedActivity, setSelectedActivity] = useState("");

function createActivity() {
  if (!selectedActivity) return;

  const newActivity: Activity = {
    id: Date.now(),
    name: selectedActivity,
    description: `Activity details for ${selectedActivity}`,
  };

  setActivities((currentActivities) => [
    ...currentActivities,
    newActivity,
  ]);

  setSelectedActivity("");
}


  return (
    <div className="min-h-[calc(100vh-80px)] bg-[var(--bg)] px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_10px_30px_rgba(20,42,67,0.08)] md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--navy)]">
            Account Page
          </h1>
          <p className="mt-2 text-base text-[var(--text)]/75">
            Manage your account and view your activity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-[24px] bg-[var(--bg)] p-6">
            <h2 className="text-xl font-bold text-[var(--navy)]">
              Account Details
            </h2>

            <div className="mt-4 space-y-3 text-[var(--text)]">
              <p>
                <span className="font-semibold">Username:</span>{" "}
                [Your Username]
              </p>

              <button
                type="button"
                className="font-medium text-[var(--primary)] hover:underline"
              >
                Change Password
              </button>
            </div>
          </section>

          <section className="rounded-[24px] bg-[var(--bg)] p-6">
            <h2 className="text-xl font-bold text-[var(--navy)]">
              Statistics
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--border)] bg-white p-4 text-center">
                <p className="text-2xl font-bold text-[var(--navy)]">0</p>
                <p className="mt-1 text-sm text-[var(--text)]/70">
                  Total Rolls
                </p>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-white p-4 text-center">
                <p className="text-2xl font-bold text-[var(--navy)]">0</p>
                <p className="mt-1 text-sm text-[var(--text)]/70">
                  Games Played
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-[24px] bg-[var(--bg)] p-6">
          <h2 className="text-xl font-bold text-[var(--navy)]">
            Recent Activity
          </h2>

          {!isUserLoggedIn ? (
            <p className="mt-4 text-[var(--text)]/75">
              Please log in to view your activities.
            </p>
          ) : activities.length === 0 ? (
            <div className="mt-4">
              <p className="text-[var(--text)]/75">
                You do not have any activities yet. Create one to get started.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <select
                  value={selectedActivity}
                  onChange={(event) => setSelectedActivity(event.target.value)}
                  className="flex-1 rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-[var(--text)] outline-none focus:border-[var(--primary)]"
                >
                  <option value="" disabled>
                    Select an activity
                  </option>

                  {activityOptions.map((activity) => (
                    <option key={activity} value={activity}>
                      {activity}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={createActivity}
                  className="rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:bg-[#1268d6]"
                >
                  Create Activity
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {activities.map((activity) => (
                <article
                  key={activity.id}
                  className="rounded-xl border border-[var(--border)] bg-white p-4"
                >
                  <h3 className="font-semibold text-[var(--navy)]">
                    {activity.name}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text)]/75">
                    {activity.description}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}