export const WORKOUT_TIPS = {
  pull: [
    'Focus on pulling with your elbows, not your hands',
    'Squeeze your shoulder blades together at the top',
    'Keep your core braced throughout',
    'Control the eccentric (lowering) phase',
    'Warm up your rotator cuff before heavy pulling',
  ],
  push: [
    'Keep your wrists neutral during presses',
    'Drive through your feet on bench press',
    'Full range of motion for maximum growth',
    'Retract your scapula before pressing',
    'Control the weight on the way down',
  ],
  legs: [
    'Push through your heels on squats',
    'Keep your knees tracking over toes',
    'Full depth for maximum quad activation',
    'Brace your core like you are about to be punched',
    'Don\'t lock your knees at the top',
  ],
  general: [
    'Hydrate well before and during your workout',
    'Rest 60-90 seconds between sets for hypertrophy',
    'Eat protein within 30 minutes post-workout',
    'Track your workouts for progressive overload',
    'Sleep 7-9 hours for optimal recovery',
  ],
};

export function getRandomTip(type = 'general') {
  const tips = WORKOUT_TIPS[type] || WORKOUT_TIPS.general;
  return tips[Math.floor(Math.random() * tips.length)];
}
