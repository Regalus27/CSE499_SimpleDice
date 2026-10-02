'use client';

import { CreateActivity } from '@/lib/activities/CreateActivity';
import { DisplayActivities } from '@/lib/activities/DisplayActivities';
import { useActivities } from '@/lib/activities/useActivities';

export default function AccountActivities() {
  const { activities, isLoading, error, addActivity, removeActivity } =
    useActivities();

  return (
    <section>
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

      <CreateActivity onCreated={addActivity} />

      {!isLoading && activities.length > 0 && (
        <DisplayActivities activities={activities} onDeleted={removeActivity} />
      )}
    </section>
  );
}
