'use client';
// Component for displaying a list of activities

// import Statements
import { DeleteActivity } from './DeleteActivity';
import type { Activity } from './useActivities';

// Props for the DisplayActivities component
type DisplayActivitiesProps = {
  activities: Activity[];
  onDeleted?: (activityId: string) => void;
  selectedId?: string;
  onSelect?: (activityId: string | undefined) => void;
};

// DisplayActivities component definition
// Purpose: Shows each activity with its most recent rolls and last time rolled.
// Props:
// - activities - Activities to display.
// - onDeleted - Optional. When provided, each activity shows a delete button and this runs after a delete succeeds.
// - selectedId - Optional. ID of the currently selected activity.
// - onSelect - Optional. When provided, each activity shows a checkbox; called with the ID, or undefined when unchecked.
// Notes:
// - The same component serves the homepage (select) and the account page (view and delete).
// - Only one activity can be selected at a time, since selectedId holds a single ID.
export function DisplayActivities({
  activities,
  onDeleted,
  selectedId,
  onSelect,
}: DisplayActivitiesProps) {
  return (
    <div className='mt-6 grid grid-cols-1 gap-3'>
      {activities.map((activity) => {
        // Whether this activity is the one currently selected.
        const isSelected = activity.activityId === selectedId;

        return (
          <article
            key={activity.activityId}
            className={`min-w-0 rounded-xl border bg-white p-4 text-left ${
              isSelected
                ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]'
                : 'border-[var(--border)]'
            }`}
          >
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0 flex-1'>
                {/* Checkbox with name when selectable, plain heading otherwise */}
                {onSelect ? (
                  <label className='flex cursor-pointer items-center gap-3 text-xl font-semibold text-[var(--text)]'>
                    <input
                      type='checkbox'
                      checked={isSelected}
                      onChange={() =>
                        onSelect(isSelected ? undefined : activity.activityId)
                      }
                      className='h-6 w-6 shrink-0 cursor-pointer accent-[var(--primary)]'
                    />
                    <span className='min-w-0 break-words'>{activity.name}</span>
                  </label>
                ) : (
                  <h3 className='text-xl font-semibold text-[var(--text)]'>
                    {activity.name}
                  </h3>
                )}
                {/* Up to the last 5 rolls, shown as quantity d type: result */}
                <p className='mt-2 text-base text-[var(--text)]/85'>
                  Most Recent Rolls:{' '}
                  {activity.recentRolls?.length
                    ? `${activity.recentRolls.length}d${activity.recentRolls[0].diceType}: 
                    ${activity.recentRolls.reduce((sum, roll) => sum + roll.diceValue, 0)} 
                    (${activity.recentRolls.map((roll) => roll.diceValue).join(', ')})` 
                    : 'N/A'}
                </p>
                {/* Time of the most recent roll for this activity */}
                <p className='mt-1 text-base text-[var(--text)]/85'>
                  Last Time Rolled:{' '}
                  {activity.lastRolled
                    ? new Date(activity.lastRolled).toLocaleString()
                    : 'N/A'}
                </p>
              </div>

              {/* Delete button, shown only when a delete handler is provided */}
              {onDeleted && (
                <DeleteActivity
                  activityId={activity.activityId}
                  name={activity.name}
                  onDeleted={onDeleted}
                />
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
