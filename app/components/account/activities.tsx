"use client";

import { useState } from "react";

type Activity = {
  id: number;
  name: string;
  description: string;
};

type AccountActivitiesProps = {
  isUserLoggedIn: boolean;
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

export default function AccountActivities({
  isUserLoggedIn,
}: AccountActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState("");

  function createActivity() {
    if (!selectedActivity) return;

    setActivities((currentActivities) => [
      ...currentActivities,
      {
        id: Date.now(),
        name: selectedActivity,
        description: `Activity details for ${selectedActivity}`,
      },
    ]);

    setSelectedActivity("");
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-[var(--navy)]">Activities</h2>

      {!isUserLoggedIn ? (
        <p className="mt-6 text-[var(--text)]/75">
          Please log in to view your activities.
        </p>
      ) : activities.length === 0 ? (
        <div className="mt-6">
          <p className="text-[var(--text)]/75">
            You do not have any activities yet.
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
              className="rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white hover:bg-[#1268d6]"
            >
              Create Activity
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
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
  );
}