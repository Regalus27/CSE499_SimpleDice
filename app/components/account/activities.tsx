'use client';

import { useEffect, useState } from 'react';

type Activity = {
  activityId: string;
  userId: string;
  name: string;
};

const activityOptions = [
  'Dice Game',
  'Card Game',
  'Multiplayer Game',
  'Puzzle Game',
  'Dungeons & Dragons',
  'Role-Playing Game',
  'Other',
];

export default function AccountActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadActivities() {
      try {
        const response = await fetch('/api/activities');

        if (!response.ok) {
          throw new Error('Unable to load activities.');
        }

        const data: { activities: Activity[] } = await response.json();
        if (isMounted) setActivities(data.activities);
      } catch {
        if (isMounted) setError('Unable to load activities.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  async function createActivity() {
    if (!selectedActivity) return;

    setIsCreating(true);
    setError('');

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedActivity }),
      });

      const data: { activity?: Activity; error?: string } =
        await response.json();

      if (!response.ok || !data.activity) {
        throw new Error(data.error ?? 'Unable to create activity.');
      }

      setActivities((currentActivities) => [
        ...currentActivities,
        data.activity!,
      ]);
      setSelectedActivity('');
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unable to create activity.',
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function deleteActivity(activityId: string) {
    setError('');

    try {
      const response = await fetch('/api/activities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId }),
      });

      const data: { success?: boolean; error?: string } = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Unable to delete activity.');
      }

      setActivities((currentActivities) =>
        currentActivities.filter(
          (activity) => activity.activityId !== activityId,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Unable to delete activity.',
      );
    }
  }

  return (
    <section>
      <h2 className='text-2xl font-bold text-[var(--text)]'>Activities</h2>

      {error && (
        <p role='alert' className='mt-4 text-sm text-red-700'>
          {error}
        </p>
      )}

      {isLoading ? (
        <p className='mt-6 text-[var(--text)]/75'>Loading activities...</p>
      ) : (
        activities.length === 0 && (
          <p className='mt-6 text-[var(--text)]/75'>
            You do not have any activities yet.
          </p>
        )
      )}

      <div className='mt-4 flex flex-col gap-3 sm:flex-row'>
        <select
          value={selectedActivity}
          onChange={(event) => setSelectedActivity(event.target.value)}
          className='flex-1 rounded-xl border border-[var(--border)] bg-white px-3 py-3 text-[var(--text)] outline-none focus:border-[var(--primary)]'
        >
          <option value='' disabled>
            Select an activity
          </option>

          {activityOptions.map((activity) => (
            <option key={activity} value={activity}>
              {activity}
            </option>
          ))}
        </select>

        <button
          type='button'
          onClick={createActivity}
          disabled={!selectedActivity || isCreating}
          className='rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white hover:bg-[#1268d6]'
        >
          {isCreating ? 'Creating...' : 'Create Activity'}
        </button>
      </div>

      {!isLoading && activities.length > 0 && (
        <div className='mt-6 grid gap-3'>
          {activities.map((activity) => (
            <article
              key={activity.activityId}
              className='rounded-xl border border-[var(--border)] bg-white p-4'
            >
              <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0'>
                  <h3 className='font-semibold text-[var(--text)]'>
                    {activity.name}
                  </h3>
                  <p className='mt-1 text-sm text-[var(--text)]/75'>
                    Most Recent Rolls: {activity.MostRecentRolls ?? 'N/A'}
                  </p>
                  <p className='mt-1 text-sm text-[var(--text)]/75'>
                    Last Time Rolled: {activity.LastTimeRolled ?? 'N/A'}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => deleteActivity(activity.activityId)}
                  aria-label={`Delete ${activity.name}`}
                  title='Delete activity'
                  className='shrink-0 rounded-lg p-2 text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700'
                >
                  <span aria-hidden='true' className='text-2xl'>
                    🗑
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
