export const MUSCLE_ICONS = {
  Chest: '🫁',
  Back: '🔙',
  Shoulders: '💪',
  Biceps: '💪',
  Triceps: '💪',
  Forearms: '🤲',
  Abs: '🎯',
  Obliques: '🔄',
  Quads: '🦵',
  Hamstrings: '🦵',
  Glutes: '🍑',
  Calves: '🦶',
  Traps: '🏔️',
  Lats: '🦅',
  Rhomboids: '💎',
};

export const EQUIPMENT_ICONS = {
  Barbell: '🏋️',
  Dumbbell: '🏋️',
  Kettlebell: '🔔',
  'Cable Machine': '⚙️',
  'Pull-up Bar': '🏗️',
  'Resistance Band': '🔗',
  Machine: '⚙️',
  Bodyweight: '🤸',
  'Smith Machine': '🏗️',
  'EZ Bar': '🏋️',
  'Foam Roller': '🧘',
  'Medicine Ball': '⚽',
  TRX: '🔗',
};

export function getMuscleIcon(muscle) {
  return MUSCLE_ICONS[muscle] || '💪';
}

export function getEquipmentIcon(equipment) {
  return EQUIPMENT_ICONS[equipment] || '🏋️';
}
