export function exportToCSV(data, filename) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        let val = row[h];
        if (val === null || val === undefined) val = '';
        if (typeof val === 'object') val = JSON.stringify(val);
        if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
          val = `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      }).join(',')
    )
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportWorkouts(workouts) {
  const data = workouts.map(w => ({
    name: w.name,
    date: new Date(w.createdAt || w.date).toLocaleDateString(),
    exercises: w.exercises?.length || 0,
    totalVolume: w.totalVolume || 0,
    caloriesBurned: w.caloriesBurned || 0,
  }));
  exportToCSV(data, 'fitfat-workouts');
}

export function exportProgress(progress) {
  const data = progress.map(p => ({
    date: new Date(p.date).toLocaleDateString(),
    weight: p.weight || '',
    chest: p.chest || '',
    arms: p.arms || '',
    waist: p.waist || '',
    bodyFat: p.bodyFat || '',
  }));
  exportToCSV(data, 'fitfat-progress');
}