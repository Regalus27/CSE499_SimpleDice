'use client';
// Hook and types for loading and managing the signed-in user's activities

// import Statements
import { useCallback, useEffect, useState } from 'react';

// A single saved roll as returned with an activity.
export type RecentRoll = {
  diceType: number;
  quantity: number;
  result: number;
};

// An activity as returned by GET /api/activities.
// lastRolled is an ISO date string; both lastRolled and recentRolls are absent until the activity has rolls.
export type Activity = {
  activityId: string;
  userId: string;
  name: string;
  lastRolled?: string;
  recentRolls?: RecentRoll[];
};

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
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState('');

  // Load the activities once when enabled; isMounted prevents updates after unmount.
  useEffect(() => {
    if (!enabled) return;
    let isMounted = true;

    fetch('/api/activities')
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const data: { activities: Activity[] } = await response.json();
        if (isMounted) setActivities(data.activities);
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

  return { activities, isLoading, error, addActivity, removeActivity };
}
