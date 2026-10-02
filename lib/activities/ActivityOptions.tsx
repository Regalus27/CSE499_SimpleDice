// Available activity types a user can choose from when creating an activity

// List of selectable activity names
const activityOptions = [
  'Dice Game',
  'Card Game',
  'Multiplayer Game',
  'Puzzle Game',
  'Dungeons & Dragons',
  'Role-Playing Game',
  'Other',
];

// Returns the list of selectable activity names.
export const getActivityOptions = () => {
  return activityOptions;
};
