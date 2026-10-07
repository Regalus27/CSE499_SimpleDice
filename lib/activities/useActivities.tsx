'use client';
// Hook and types for loading and managing the signed-in user's activities

// import Statements
import { useCallback, useEffect, useState } from 'react';

// A single saved roll as returned with an activity.
export type RecentRoll = {
  diceType: number;
  diceValue: number;
};

// An activity as returned by GET /api/activities.
// lastRolled is an ISO date string; both lastRolled and recentRolls are absent until the activity has rolls.
export type Activity = {
  activityId: string;
  userId: string;
  name: string;
  lastRolled: string;
  recentRolls: RecentRoll[];
  globalRolls: RecentRoll[];
};

// Updates an existing activity in the local list.
async function fetchActivities(): Promise<Activity[]> {
  const response = await fetch('/api/activities');
  if (!response.ok) throw new Error('Unable to load activities.');

  const data: { activities: Activity[] } = await response.json();
  return data.activities;
}

// useActivities hook definition
// Purpose: Loads the user's activities from the backend and exposes helpers to update the local list.
// Params: enabled - When false, nothing is fetched (e.g. the user is not logged in).
// Returns: activities, isLoading, error, addActivity, removeActivity.
// Notes:
// - addActivity and removeActivity only change local state; the API calls live in CreateActivity and DeleteActivity.
// - Each component that calls this hook keeps its own copy of the list.
export function useActivities(enabled = true) {
  // State for the activity list, loading status, and error messages.
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshActivities = useCallback(async () => {
    setActivities(await fetchActivities());
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;

    fetchActivities()
      .then((items) => {
        if (isMounted) {
          setActivities(items);
          setError('');
        }
      })
      .catch(() => {
        if (isMounted) setError('Unable to load activities.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  // Adds a newly created activity to the local list.
  const addActivity = useCallback((activity: Activity) => {
    setActivities((current) => [...current, activity]);
  }, []);

  // Removes a deleted activity from the local list.
  const removeActivity = useCallback((activityId: string) => {
    setActivities((current) =>
      current.filter((activity) => activity.activityId !== activityId),
    );
  }, []);

  return {
    activities,
    isLoading,
    error,
    addActivity,
    removeActivity,
    refreshActivities,
  };
}
