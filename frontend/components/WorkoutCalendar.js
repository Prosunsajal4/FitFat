import { useState } from 'react';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const workoutColors = {
  push: 'bg-red-500',
  pull: 'bg-blue-500',
  legs: 'bg-green-500',
  full: 'bg-yellow-500',
  cardio: 'bg-purple-500',
  rest: 'bg-gray-500',
  default: 'bg-neon-green',
};

function getWorkoutColor(name) {
  const lower = (name || '').toLowerCase();
  if (lower.includes('push')) return workoutColors.push;
  if (lower.includes('pull')) return workoutColors.pull;
  if (lower.includes('leg')) return workoutColors.legs;
  if (lower.includes('full')) return workoutColors.full;
  if (lower.includes('cardio')) return workoutColors.cardio;
  if (lower.includes('rest')) return workoutColors.rest;
  return workoutColors.default;
}

export default function WorkoutCalendar({ workouts, onSelectWorkout, selectedWorkout }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const workoutDates = {};
  workouts.forEach((w) => {
    const d = new Date(w.createdAt || w.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!workoutDates[key]) workoutDates[key] = [];
    workoutDates[key].push(w);
  });

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const today = new Date();
  const monthWorkouts = workouts.filter((w) => {
    const d = new Date(w.createdAt || w.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-dark-card rounded-lg text-gray-400 hover:text-white">◀</button>
        <h3 className="font-heading font-bold text-lg">{monthNames[currentMonth]} {currentYear}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-dark-card rounded-lg text-gray-400 hover:text-white">▶</button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs text-gray-500 py-1">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          const key = `${currentYear}-${currentMonth}-${day}`;
          const dayWorkouts = workoutDates[key] || [];
          const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

          return (
            <button
              key={day}
              onClick={() => dayWorkouts.length > 0 && onSelectWorkout(dayWorkouts[0])}
              className={`relative p-2 rounded-lg text-sm transition-all min-h-[48px] ${
                dayWorkouts.length > 0
                  ? 'hover:bg-dark-card hover:text-white cursor-pointer'
                  : 'text-gray-400'
              } ${isToday ? 'ring-2 ring-neon-purple' : ''}`}
            >
              <span className={isToday ? 'text-neon-purple font-bold' : ''}>{day}</span>
              {dayWorkouts.length > 0 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {dayWorkouts.slice(0, 3).map((w, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${getWorkoutColor(w.name)}`}></span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {monthWorkouts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-2">{monthWorkouts.length} workout{monthWorkouts.length > 1 ? 's' : ''} this month</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(workoutColors).filter(([k]) => k !== 'default').map(([type, color]) => (
              <div key={type} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${color}`}></span>
                <span className="text-xs text-gray-500 capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}