'use client';

import { useEffect } from 'react';
import { CreateActivity } from '@/lib/activities/CreateActivity';
import { DisplayActivities } from '@/lib/activities/DisplayActivities';
import type { Activity } from '@/lib/activities/useActivities';

type ActivitiesProps = {
  isLoggedIn: boolean;
  activities: Activity[];
  isLoading: boolean;
  error: string;
  selectedId?: string;
  onSelect: (activityId: string | undefined) => void;
  onCreated: (activity: Activity) => void;
  onDeleted: (activityId: string) => void;
};

export default function Activities({
  isLoggedIn,
  activities,
  isLoading,
  error,
  selectedId,
  onSelect,
  onCreated,
  onDeleted,
}: ActivitiesProps) {
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
      {error && (
        <p role='alert' className='mb-3 text-sm text-red-700'>
          {error}
        </p>
      )}
      <h2 className='mb-2 text-2xl font-semibold text-[var(--text)]'>
        Your Activities
      </h2>
      <CreateActivity onCreated={onCreated} />
      {activities.length === 0 ? (
        <p className='mt-4 text-lg text-[var(--text)]/85'>
          You do not have any activities yet.
        </p>
      ) : (
        <DisplayActivities
          activities={activities}
          selectedId={selectedId}
          onSelect={onSelect}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
}
