import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workoutAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import RestTimer from '../components/RestTimer';
import WorkoutCalendar from '../components/WorkoutCalendar';
import ExerciseDatabase from '../components/ExerciseDatabase';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';
import { SkeletonCard } from '../components/Skeleton';

const muscleGroups = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'other'];

function WorkoutsContent() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showExerciseDB, setShowExerciseDB] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const toast = useToast();
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
        toast.success('Workout updated!');
      } else {
        await workoutAPI.createWorkout(formData);
        toast.success('Workout created!');
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
      toast.error('Failed to save workout');
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await workoutAPI.deleteWorkout(id);
      toast.success('Workout deleted!');
      fetchWorkouts();
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast.error('Failed to delete workout');
    }
  };

  const handleDelete = async (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    try {
      await workoutAPI.deleteWorkout(deleteConfirm.id);
      toast.success('Workout deleted!');
      fetchWorkouts();
    } catch (error) {
      toast.error('Failed to delete workout');
    }
    setDeleteConfirm({ show: false, id: null });
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
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
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
        <div className="flex gap-3">
          <button
            onClick={() => setShowTimer(true)}
            className="px-4 py-3 bg-neon-purple text-white font-bold rounded-lg hover:bg-neon-purple/90"
          >
            ⏱️ Timer
          </button>
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
      </div>

      {workouts.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search workouts by name..."
            className="w-full px-4 py-2 rounded-lg bg-dark-card border border-gray-700 focus:ring-2 focus:ring-neon-green"
          />
        </div>
      )}

      {workouts.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WorkoutCalendar workouts={workouts} onSelectWorkout={setSelectedWorkout} selectedWorkout={selectedWorkout} />
          </div>
          <div className="lg:col-span-2">
            {selectedWorkout && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 mb-4 border-l-4 border-neon-green"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-bold text-lg">📅 {selectedWorkout.name}</h3>
                  <span className="text-xs text-gray-400">{new Date(selectedWorkout.createdAt || selectedWorkout.date).toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div className="bg-dark-bg p-2 rounded">
                    <p className="text-neon-green font-bold">{selectedWorkout.exercises?.length || 0}</p>
                    <p className="text-gray-500">Exercises</p>
                  </div>
                  <div className="bg-dark-bg p-2 rounded">
                    <p className="text-neon-purple font-bold">{selectedWorkout.totalVolume?.toLocaleString() || 0}</p>
                    <p className="text-gray-500">Volume</p>
                  </div>
                  <div className="bg-dark-bg p-2 rounded">
                    <p className="text-yellow-400 font-bold">{selectedWorkout.caloriesBurned || 0}</p>
                    <p className="text-gray-500">Calories</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingWorkout(selectedWorkout);
                      setFormData({ name: selectedWorkout.name, exercises: selectedWorkout.exercises });
                      setShowModal(true);
                    }}
                    className="px-3 py-1.5 bg-neon-green/20 text-neon-green rounded-lg text-sm hover:bg-neon-green/30"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setSelectedWorkout(null)}
                    className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

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
          {workouts.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase())).map((workout, index) => (
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
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={ex.name}
                            onChange={(e) => updateExercise(index, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 rounded"
                            placeholder="Exercise name"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => { setExerciseIndex(index); setShowExerciseDB(true); }}
                            className="px-3 py-2 bg-neon-purple text-white rounded-lg text-sm hover:bg-neon-purple/80"
                            title="Search exercise database"
                          >
                            🔍
                          </button>
                        </div>

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

      <AnimatePresence>
        {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showExerciseDB && (
          <ExerciseDatabase
            onClose={() => setShowExerciseDB(false)}
            onSelectExercise={(ex) => {
              const newExercises = [...formData.exercises];
              newExercises[exerciseIndex] = {
                ...newExercises[exerciseIndex],
                name: ex.name,
                muscleGroup: ex.muscle,
              };
              setFormData({ ...formData, exercises: newExercises });
            }}
          />
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title="Delete Workout"
        message="This action cannot be undone. Are you sure?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ show: false, id: null })}
        confirmText="Delete"
      />
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