export function calculateWorkoutStats(workouts) {
  if (!workouts || !workouts.length) {
    return { total: 0, thisWeek: 0, thisMonth: 0, avgDuration: 0, totalVolume: 0 };
  }

  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisWeek = workouts.filter((w) => new Date(w.date) >= weekAgo).length;
  const thisMonth = workouts.filter((w) => new Date(w.date) >= monthStart).length;

  let totalDuration = 0;
  let totalVolume = 0;
  workouts.forEach((w) => {
    totalDuration += w.duration || 0;
    (w.exercises || []).forEach((ex) => {
      (ex.sets || []).forEach((s) => {
        totalVolume += (s.weight || 0) * (s.reps || 0);
      });
    });
  });

  return {
    total: workouts.length,
    thisWeek,
    thisMonth,
    avgDuration: Math.round(totalDuration / workouts.length),
    totalVolume,
  };
}

export function calculateWorkoutFrequency(workouts, days = 30) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const recent = workouts.filter((w) => new Date(w.date) >= cutoff);
  return Math.round((recent.length / days) * 7 * 10) / 10;
}

export function getWorkoutStreak(workouts) {
  if (!workouts.length) return 0;
  const sorted = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i - 1].date) - new Date(sorted[i].date)) / (1000 * 60 * 60 * 24);
    if (diff <= 1.5) streak++;
    else break;
  }
  return streak;
}
