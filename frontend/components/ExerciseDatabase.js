import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const exerciseDatabase = [
  { name: 'Bench Press', muscle: 'chest', equipment: 'barbell' },
  { name: 'Incline Bench Press', muscle: 'chest', equipment: 'barbell' },
  { name: 'Dumbbell Press', muscle: 'chest', equipment: 'dumbbell' },
  { name: 'Incline Dumbbell Press', muscle: 'chest', equipment: 'dumbbell' },
  { name: 'Cable Flyes', muscle: 'chest', equipment: 'cable' },
  { name: 'Push Ups', muscle: 'chest', equipment: 'bodyweight' },
  { name: 'Dips', muscle: 'chest', equipment: 'bodyweight' },
  { name: 'Chest Fly Machine', muscle: 'chest', equipment: 'machine' },
  { name: 'Deadlift', muscle: 'back', equipment: 'barbell' },
  { name: 'Barbell Row', muscle: 'back', equipment: 'barbell' },
  { name: 'Lat Pulldown', muscle: 'back', equipment: 'cable' },
  { name: 'Pull Ups', muscle: 'back', equipment: 'bodyweight' },
  { name: 'Seated Cable Row', muscle: 'back', equipment: 'cable' },
  { name: 'Dumbbell Row', muscle: 'back', equipment: 'dumbbell' },
  { name: 'T-Bar Row', muscle: 'back', equipment: 'barbell' },
  { name: 'Back Extension', muscle: 'back', equipment: 'bodyweight' },
  { name: 'Squat', muscle: 'legs', equipment: 'barbell' },
  { name: 'Front Squat', muscle: 'legs', equipment: 'barbell' },
  { name: 'Leg Press', muscle: 'legs', equipment: 'machine' },
  { name: 'Lunges', muscle: 'legs', equipment: 'dumbbell' },
  { name: 'Bulgarian Split Squat', muscle: 'legs', equipment: 'dumbbell' },
  { name: 'Leg Extension', muscle: 'legs', equipment: 'machine' },
  { name: 'Leg Curl', muscle: 'legs', equipment: 'machine' },
  { name: 'Calf Raises', muscle: 'legs', equipment: 'machine' },
  { name: 'Romanian Deadlift', muscle: 'legs', equipment: 'barbell' },
  { name: 'Hip Thrust', muscle: 'legs', equipment: 'barbell' },
  { name: 'Overhead Press', muscle: 'shoulders', equipment: 'barbell' },
  { name: 'Dumbbell Shoulder Press', muscle: 'shoulders', equipment: 'dumbbell' },
  { name: 'Lateral Raise', muscle: 'shoulders', equipment: 'dumbbell' },
  { name: 'Front Raise', muscle: 'shoulders', equipment: 'dumbbell' },
  { name: 'Reverse Fly', muscle: 'shoulders', equipment: 'dumbbell' },
  { name: 'Face Pull', muscle: 'shoulders', equipment: 'cable' },
  { name: 'Shrugs', muscle: 'shoulders', equipment: 'dumbbell' },
  { name: 'Barbell Curl', muscle: 'arms', equipment: 'barbell' },
  { name: 'Dumbbell Curl', muscle: 'arms', equipment: 'dumbbell' },
  { name: 'Hammer Curl', muscle: 'arms', equipment: 'dumbbell' },
  { name: 'Preacher Curl', muscle: 'arms', equipment: 'barbell' },
  { name: 'Tricep Pushdown', muscle: 'arms', equipment: 'cable' },
  { name: 'Skull Crushers', muscle: 'arms', equipment: 'barbell' },
  { name: 'Tricep Dips', muscle: 'arms', equipment: 'bodyweight' },
  { name: 'Overhead Tricep Extension', muscle: 'arms', equipment: 'dumbbell' },
  { name: 'Plank', muscle: 'core', equipment: 'bodyweight' },
  { name: 'Crunches', muscle: 'core', equipment: 'bodyweight' },
  { name: 'Hanging Leg Raise', muscle: 'core', equipment: 'bodyweight' },
  { name: 'Russian Twist', muscle: 'core', equipment: 'bodyweight' },
  { name: 'Cable Crunch', muscle: 'core', equipment: 'cable' },
  { name: 'Ab Rollout', muscle: 'core', equipment: 'ab wheel' },
  { name: 'Mountain Climbers', muscle: 'core', equipment: 'bodyweight' },
  { name: 'Burpees', muscle: 'other', equipment: 'bodyweight' },
  { name: 'Jump Rope', muscle: 'other', equipment: 'other' },
  { name: 'Treadmill Running', muscle: 'other', equipment: 'cardio' },
  { name: 'Cycling', muscle: 'other', equipment: 'cardio' },
  { name: 'Rowing Machine', muscle: 'other', equipment: 'cardio' },
];

const muscleColors = {
  chest: 'text-red-400 bg-red-500/20',
  back: 'text-blue-400 bg-blue-500/20',
  legs: 'text-green-400 bg-green-500/20',
  shoulders: 'text-yellow-400 bg-yellow-500/20',
  arms: 'text-purple-400 bg-purple-500/20',
  core: 'text-orange-400 bg-orange-500/20',
  other: 'text-gray-400 bg-gray-500/20',
};

export default function ExerciseDatabase({ onSelectExercise, onClose }) {
  const [search, setSearch] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('all');

  const muscles = ['all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'other'];

  const filtered = useMemo(() => {
    return exerciseDatabase.filter((ex) => {
      const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      const matchMuscle = filterMuscle === 'all' || ex.muscle === filterMuscle;
      return matchSearch && matchMuscle;
    });
  }, [search, filterMuscle]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card p-6 w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-heading font-bold">🏋️ Exercise Database</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full px-4 py-2 rounded-lg bg-dark-bg border border-gray-700 focus:ring-2 focus:ring-neon-green"
          />
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {muscles.map((m) => (
            <button
              key={m}
              onClick={() => setFilterMuscle(m)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterMuscle === m
                  ? 'bg-neon-green text-black'
                  : 'bg-dark-card text-gray-400 hover:text-white'
              }`}
            >
              {m === 'all' ? 'All' : m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {filtered.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No exercises found</p>
          ) : (
            filtered.map((ex, i) => (
              <button
                key={i}
                onClick={() => { onSelectExercise(ex); onClose(); }}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-dark-card transition-all text-left"
              >
                <div>
                  <p className="font-medium text-white">{ex.name}</p>
                  <p className="text-xs text-gray-500">{ex.equipment}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${muscleColors[ex.muscle]}`}>
                  {ex.muscle}
                </span>
              </button>
            ))
          )}
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">{filtered.length} exercises</p>
      </motion.div>
    </motion.div>
  );
}