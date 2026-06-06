export function EmptyWorkouts() {
  return (
    <div className="glass-card p-12 text-center">
      <div className="text-7xl mb-4">💪</div>
      <h3 className="text-xl font-heading font-bold mb-2">No Workouts Yet</h3>
      <p className="text-gray-400 mb-2">Start your fitness journey today!</p>
      <p className="text-sm text-gray-500">Create your first workout to begin tracking your progress</p>
    </div>
  );
}

export function EmptyProgress() {
  return (
    <div className="glass-card p-12 text-center">
      <div className="text-7xl mb-4">📊</div>
      <h3 className="text-xl font-heading font-bold mb-2">No Progress Data</h3>
      <p className="text-gray-400 mb-2">Log your first measurement to see trends</p>
      <p className="text-sm text-gray-500">Track weight, measurements, and body fat over time</p>
    </div>
  );
}

export function EmptyNutrition() {
  return (
    <div className="glass-card p-12 text-center">
      <div className="text-7xl mb-4">🥗</div>
      <h3 className="text-xl font-heading font-bold mb-2">No Meals Logged</h3>
      <p className="text-gray-400 mb-2">Start tracking your nutrition</p>
      <p className="text-sm text-gray-500">Log meals to monitor calories and macros</p>
    </div>
  );
}

export function EmptySearch({ query }) {
  return (
    <div className="glass-card p-8 text-center">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="text-lg font-heading font-bold mb-2">No results found</h3>
      <p className="text-gray-400">No items matching &quot;{query}&quot;</p>
    </div>
  );
}