'use client';
// Component for creating a new activity



// import Statements
import { useState } from 'react';
import { getActivityOptions } from './ActivityOptions';
import type { Activity } from './useActivities';


// Get the available activity options from the ActivityOptions module
const activityOptions = getActivityOptions();


// Props for the CreateActivity component
type CreateActivityProps = {
  onCreated: (activity: Activity) => void;
};

// CreateActivity component definition
// Purpose: Allows the user to create a new activity by selecting from available options and submitting it.
// Props: onCreated - Callback function invoked when a new activity is successfully created.
// Notes: 
// - The component maintains internal state for the selected activity, creation status, and any error messages.
// - It communicates with the backend API to create a new activity.
// - Upon successful creation, it invokes the onCreated callback and resets the selected activity.
export function CreateActivity({ onCreated }: CreateActivityProps) {
    // State for the selected activity, creation status, and error messages.
  const [selectedActivity, setSelectedActivity] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

// Function to create a new activity by sending a POST request to the backend API.
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

      onCreated(data.activity);
      setSelectedActivity('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to create activity.',
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div>
      {error && (
        <p role='alert' className='mt-4 text-sm text-red-700'>
          {error}
        </p>
      )}
      {/* Activity selection and creation UI */}
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
          {/* Button to trigger activity creation */}
        <button
          type='button'
          onClick={createActivity}
          disabled={!selectedActivity || isCreating}
          className='rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white hover:bg-[#1268d6]'
        >
          {isCreating ? 'Creating...' : 'Create Activity'}
        </button>
      </div>
    </div>
  );
}
