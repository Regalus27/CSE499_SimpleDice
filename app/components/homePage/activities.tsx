'use client';

import { useEffect } from 'react';
import { CreateActivity } from '@/lib/activities/CreateActivity';
import { DisplayActivities } from '@/lib/activities/DisplayActivities';
import { useActivities } from '@/lib/activities/useActivities';

type ActivitiesProps = {
  isLoggedIn: boolean;
  selectedId?: string;
  onSelect: (activityId: string | undefined) => void;
};

export default function Activities({
  isLoggedIn,
  selectedId,
  onSelect,
}: ActivitiesProps) {
  const { activities, isLoading, addActivity, removeActivity } =
    useActivities(isLoggedIn);

  // Clear the selection when its activity is deleted.
  useEffect(() => {
    if (
      !isLoading &&
      selectedId &&
      !activities.some((activity) => activity.activityId === selectedId)
    ) {
      onSelect(undefined);
    }
  }, [activities, isLoading, selectedId, onSelect]);

  if (!isLoggedIn || isLoading) return null;

  return (
    <div className='mt-6 border-t border-[var(--border)] pt-6 text-center'>
      <h2 className='mb-2 text-2xl font-semibold text-[var(--text)]'>
        Your Activities
      </h2>
      <CreateActivity onCreated={addActivity} />
      {activities.length === 0 ? (
        <p className='mt-4 text-lg text-[var(--text)]/85'>
          You do not have any activities yet.
        </p>
      ) : (
        <DisplayActivities
          activities={activities}
          selectedId={selectedId}
          onSelect={onSelect}
          onDeleted={removeActivity}
        />
      )}
    </div>
  );
}
