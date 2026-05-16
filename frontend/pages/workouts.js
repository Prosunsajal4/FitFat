import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workoutAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

const muscleGroups = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'other'];

function WorkoutsContent() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    exercises: [{ name: '', sets: 3, reps: 10, weight: 0, muscleGroup: 'chest' }],
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const res = await workoutAPI.getWorkouts({ limit: 50 });
      setWorkouts(res.data.workouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingWorkout) {
        await workoutAPI.updateWorkout(editingWorkout._id, formData);
      } else {
        await workoutAPI.createWorkout(formData);
      }
      setShowModal(false);
      setEditingWorkout(null);
      setFormData({
        name: '',
        exercises: [{ name: '', sets: 3, reps: 10, weight: 0, muscleGroup: 'chest' }],
      });
      fetchWorkouts();
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this workout?')) return;
    try {
      await workoutAPI.deleteWorkout(id);
      fetchWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      name: workout.name,
      exercises: workout.exercises.map((e) => ({
        name: e.name,
        sets: e.sets,
        reps: e.reps,
        weight: e.weight,
        muscleGroup: e.muscleGroup || 'other',
      })),
    });
    setShowModal(true);
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [
        ...formData.exercises,
        { name: '', sets: 3, reps: 10, weight: 0, muscleGroup: 'chest' },
      ],
    });
  };

  const removeExercise = (index) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index),
    });
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index][field] = value;
    setFormData({ ...formData, exercises: newExercises });
  };

  const calculateVolume = (exercises) => {
    return exercises.reduce((sum, ex) => sum + ex.sets * ex.reps * (ex.weight || 0), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Workout Tracker</h1>
          <p className="text-gray-400">Log and track your gym sessions</p>
        </div>
        <button
          onClick={() => {
            setEditingWorkout(null);
            setFormData({
              name: '',
              exercises: [{ name: '', sets: 3, reps: 10, weight: 0, muscleGroup: 'chest' }],
            });
            setShowModal(true);
          }}
          className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90"
        >
          + New Workout
        </button>
      </div>

      {workouts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">💪</div>
          <h3 className="text-xl font-heading font-bold mb-2">No workouts yet</h3>
          <p className="text-gray-400 mb-4">Start tracking your fitness journey today!</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-neon-purple text-white font-bold rounded-lg"
          >
            Create First Workout
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {workouts.map((workout, index) => (
            <motion.div
              key={workout._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-neon-green">{workout.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(workout.date).toLocaleDateString()} | {workout.exercises.length} exercises
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(workout)}
                    className="p-2 text-gray-400 hover:text-neon-green"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(workout._id)}
                    className="p-2 text-gray-400 hover:text-red-400"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="text-left py-2">Exercise</th>
                      <th className="text-left py-2">Muscle</th>
                      <th className="text-center py-2">Sets</th>
                      <th className="text-center py-2">Reps</th>
                      <th className="text-center py-2">Weight</th>
                      <th className="text-right py-2">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workout.exercises.map((ex, i) => (
                      <tr key={i} className="border-b border-gray-800">
                        <td className="py-2">{ex.name}</td>
                        <td className="py-2">
                          <span className="px-2 py-1 bg-dark-bg rounded text-xs capitalize">
                            {ex.muscleGroup || 'other'}
                          </span>
                        </td>
                        <td className="py-2 text-center">{ex.sets}</td>
                        <td className="py-2 text-center">{ex.reps}</td>
                        <td className="py-2 text-center">{ex.weight}kg</td>
                        <td className="py-2 text-right text-gray-400">
                          {ex.sets * ex.reps * (ex.weight || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm">
                <span className="text-gray-400">Total Volume: <span className="text-neon-purple font-bold">{workout.totalVolume || calculateVolume(workout.exercises)}</span></span>
                <span className="text-gray-400">Calories: <span className="text-orange-400 font-bold">{workout.caloriesBurned || 0}</span></span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-heading font-bold mb-6">
                {editingWorkout ? 'Edit Workout' : 'New Workout'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Workout Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg"
                    placeholder="e.g., Push Day, Leg Day"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-400">Exercises</label>
                    <button
                      type="button"
                      onClick={addExercise}
                      className="text-neon-green hover:underline"
                    >
                      + Add Exercise
                    </button>
                  </div>

                  {formData.exercises.map((ex, index) => (
                    <div key={index} className="p-4 bg-dark-bg rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Exercise {index + 1}</span>
                        {formData.exercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="text-red-400"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={ex.name}
                          onChange={(e) => updateExercise(index, 'name', e.target.value)}
                          className="px-3 py-2 rounded"
                          placeholder="Exercise name"
                          required
                        />

                        <select
                          value={ex.muscleGroup}
                          onChange={(e) => updateExercise(index, 'muscleGroup', e.target.value)}
                          className="px-3 py-2 rounded"
                        >
                          {muscleGroups.map((m) => (
                            <option key={m} value={m}>
                              {m.charAt(0).toUpperCase() + m.slice(1)}
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                          className="px-3 py-2 rounded"
                          placeholder="Sets"
                          min="1"
                        />

                        <input
                          type="number"
                          value={ex.reps}
                          onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                          className="px-3 py-2 rounded"
                          placeholder="Reps"
                          min="1"
                        />

                        <input
                          type="number"
                          value={ex.weight}
                          onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                          className="px-3 py-2 rounded"
                          placeholder="Weight (kg)"
                          step="0.5"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90"
                  >
                    {editingWorkout ? 'Update Workout' : 'Save Workout'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Workouts() {
  return (
    <ProtectedRoute>
      <WorkoutsContent />
    </ProtectedRoute>
  );
}