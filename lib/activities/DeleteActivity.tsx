'use client';
// Component for deleting an existing activity

// import Statements
import { useState } from 'react';

// Props for the DeleteActivity component
type DeleteActivityProps = {
  activityId: string;
  name: string;
  onDeleted: (activityId: string) => void;
};

// DeleteActivity component definition
// Purpose: Renders a trash-can button that deletes one activity through the backend API.
// Props:
// - activityId - ID of the activity to delete.
// - name - Activity name, used for the button's accessible label.
// - onDeleted - Callback function invoked with the activityId after the server confirms the delete.
// Notes:
// - The parent list is only updated after the API reports success.
// - Errors are shown beneath the button for this activity only.
export function DeleteActivity({
  activityId,
  name,
  onDeleted,
}: DeleteActivityProps) {
  // State for the in-progress delete and any error message.
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  // Function to delete the activity by sending a DELETE request to the backend API.
  async function deleteActivity() {
    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch('/api/activities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId }),
      });

      const data: { success?: boolean; error?: string } = await response
        .json()
        .catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Unable to delete activity.');
      }

      onDeleted(activityId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to delete activity.',
      );
      setIsDeleting(false);
    }
  }

  return (
    <div className='flex shrink-0 flex-col items-end'>
      {/* Trash-can button that triggers the delete */}
      <button
        type='button'
        onClick={deleteActivity}
        disabled={isDeleting}
        aria-label={`Delete ${name}`}
        title='Delete activity'
        className='rounded-lg p-2 text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:opacity-50'
      >
        <span aria-hidden='true' className='text-2xl'>
          🗑
        </span>
      </button>

      {/* Error message shown when the delete fails */}
      {error && (
        <p role='alert' className='text-sm text-red-700'>
          {error}
        </p>
      )}
    </div>
  );
}
