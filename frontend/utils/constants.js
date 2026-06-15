export const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Forearms', 'Abs', 'Obliques', 'Quads', 'Hamstrings',
  'Glutes', 'Calves', 'Traps', 'Lats', 'Rhomboids',
];

export const EQUIPMENT = [
  'Barbell', 'Dumbbell', 'Kettlebell', 'Cable Machine',
  'Pull-up Bar', 'Resistance Band', 'Machine',
  'Bodyweight', 'Smith Machine', 'EZ Bar',
  'Foam Roller', 'Medicine Ball', 'TRX',
];

export const WORKOUT_TYPES = [
  { key: 'pull', label: 'Pull Day', color: '#00ff88' },
  { key: 'push', label: 'Push Day', color: '#a855f7' },
  { key: 'legs', label: 'Leg Day', color: '#3b82f6' },
  { key: 'upper', label: 'Upper Body', color: '#f97316' },
  { key: 'lower', label: 'Lower Body', color: '#ef4444' },
  { key: 'full', label: 'Full Body', color: '#eab308' },
  { key: 'cardio', label: 'Cardio', color: '#06b6d4' },
];

export const XP_PER_LEVEL = 100;

export const BADGES = [
  { id: 'first_workout', name: 'First Steps', description: 'Complete your first workout', icon: '🏁' },
  { id: 'streak_7', name: 'On Fire', description: '7-day workout streak', icon: '🔥' },
  { id: 'streak_30', name: 'Unstoppable', description: '30-day workout streak', icon: '⚡' },
  { id: 'workouts_50', name: 'Dedicated', description: 'Complete 50 workouts', icon: '💪' },
  { id: 'workouts_100', name: 'Centurion', description: 'Complete 100 workouts', icon: '🏆' },
  { id: 'weight_loss_5', name: 'Lean Machine', description: 'Lose 5kg', icon: '⚖️' },
  { id: 'weight_loss_10', name: 'Transformation', description: 'Lose 10kg', icon: '🎯' },
  { id: 'pr_streak', name: 'PR Machine', description: 'Set 5 PRs in a row', icon: '📈' },
  { id: 'diet_week', name: 'Clean Eater', description: 'Log meals for 7 days', icon: '🥗' },
  { id: 'early_bird', name: 'Early Bird', description: '10 workouts before 7 AM', icon: '🌅' },
];

export const BENGALI_MEAL_NAMES = {
  breakfast: 'সকালের নাস্তা',
  morning_snack: 'প্রথম পেশি',
  lunch: 'দুপুরের খাবার',
  afternoon_snack: 'বিকালের নাস্তা',
  dinner: 'রাতের খাবার',
  pre_workout: 'ওয়ার্কাউটের আগে',
  post_workout: 'ওয়ার্কাউটের পরে',
};

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary (office job)' },
  { value: 'light', label: 'Lightly Active (1-3 days/week)' },
  { value: 'moderate', label: 'Moderately Active (3-5 days/week)' },
  { value: 'active', label: 'Very Active (6-7 days/week)' },
  { value: 'extreme', label: 'Extremely Active (athlete)' },
];
