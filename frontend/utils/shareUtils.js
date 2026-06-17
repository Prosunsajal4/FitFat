export function generateShareText(workout) {
  const lines = [`🏋️ Workout: ${workout.type || 'Session'}`, `📅 ${new Date(workout.date).toLocaleDateString()}`];

  if (workout.duration) lines.push(`⏱️ Duration: ${Math.round(workout.duration / 60)} min`);

  let totalVolume = 0;
  (workout.exercises || []).forEach((ex) => {
    lines.push(`\n${ex.name}`);
    (ex.sets || []).forEach((s, i) => {
      const vol = (s.weight || 0) * (s.reps || 0);
      totalVolume += vol;
      lines.push(`  Set ${i + 1}: ${s.weight || 0}kg × ${s.reps || 0}`);
    });
  });

  if (totalVolume > 0) lines.push(`\n📊 Total Volume: ${totalVolume.toLocaleString()}kg`);
  lines.push('\n💪 #FitFat #Workout');

  return lines.join('\n');
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    textarea.remove();
    return ok;
  }
}

export function generateShareURL(baseURL, workout) {
  const params = new URLSearchParams({
    type: workout.type || '',
    date: workout.date || '',
    exercises: String((workout.exercises || []).length),
  });
  return `${baseURL}?${params.toString()}`;
}
