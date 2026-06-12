import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { prAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import DBStatusBanner from '../components/DBStatusBanner';
import { useToast } from '../components/Toast';
import { SkeletonCard } from '../components/Skeleton';

const muscleColors = {
  chest: 'border-red-500',
  back: 'border-blue-500',
  legs: 'border-green-500',
  shoulders: 'border-yellow-500',
  arms: 'border-purple-500',
  core: 'border-orange-500',
  other: 'border-gray-500',
};

function PRsContent() {
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ exercise: '', muscleGroup: 'chest', weight: '', reps: '', sets: '3' });
  const toast = useToast();

  useEffect(() => { fetchPRs(); }, []);

  const fetchPRs = async () => {
    try {
      const res = await prAPI.getPRs();
      setPrs(res.data);
    } catch (error) {
      toast.error('Failed to load PRs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await prAPI.updatePR({
        exercise: formData.exercise,
        muscleGroup: formData.muscleGroup,
        weight: parseFloat(formData.weight) || 0,
        reps: parseInt(formData.reps) || 1,
        sets: parseInt(formData.sets) || 3,
      });
      if (res.data.isUpdated) {
        toast.success('New Personal Record! 🎉');
      } else {
        toast.info('PR logged');
      }
      setShowAdd(false);
      setFormData({ exercise: '', muscleGroup: 'chest', weight: '', reps: '', sets: '3' });
      fetchPRs();
    } catch (error) {
      toast.error('Failed to save PR');
    }
  };

  const deletePR = async (exercise) => {
    try {
      await prAPI.deletePR(exercise);
      toast.success('PR deleted');
      fetchPRs();
    } catch (error) {
      toast.error('Failed to delete PR');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DBStatusBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Personal Records 🏆</h1>
          <p className="text-gray-400">Track your best lifts for each exercise</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90"
        >
          + Log PR
        </button>
      </div>

      {prs.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-7xl mb-4 inline-block" style={{ animation: 'trophyPulse 2s ease-in-out infinite' }}>🏆</div>
          <h3 className="text-xl font-heading font-bold mb-2">No PRs Yet</h3>
          <p className="text-gray-400 mb-6">Start logging your personal records!</p>
          <button
            onClick={() => setShowAdd(true)}
            className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90"
          >
            Log First PR
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prs.map((pr, index) => (
            <motion.div
              key={pr._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`glass-card p-5 border-l-4 ${muscleColors[pr.muscleGroup] || muscleColors.other}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{pr.exercise}</h3>
                  <span className="text-xs text-gray-400 capitalize">{pr.muscleGroup}</span>
                </div>
                <button onClick={() => deletePR(pr.exercise)} className="text-gray-500 hover:text-red-400 text-sm">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-dark-bg p-3 rounded-lg">
                  <p className="text-2xl font-bold text-neon-green">{pr.bestWeight}kg</p>
                  <p className="text-xs text-gray-400">Best Weight</p>
                </div>
                <div className="bg-dark-bg p-3 rounded-lg">
                  <p className="text-2xl font-bold text-neon-purple">{pr.estimated1RM}kg</p>
                  <p className="text-xs text-gray-400">Est. 1RM</p>
                </div>
                <div className="bg-dark-bg p-3 rounded-lg">
                  <p className="text-2xl font-bold text-cyan-400">{pr.bestReps}</p>
                  <p className="text-xs text-gray-400">Best Reps</p>
                </div>
                <div className="bg-dark-bg p-3 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-400">{pr.bestVolume?.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Best Volume</p>
                </div>
              </div>
              {pr.history?.length > 1 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500">{pr.history.length} sessions logged</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {showAdd && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAdd(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="glass-card p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-heading font-bold mb-6">Log Personal Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Exercise Name</label>
                <input
                  type="text"
                  value={formData.exercise}
                  onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg"
                  placeholder="e.g., Bench Press"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Muscle Group</label>
                <select
                  value={formData.muscleGroup}
                  onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg"
                >
                  {['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'other'].map(m => (
                    <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg"
                    placeholder="80"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Reps</label>
                  <input
                    type="number"
                    value={formData.reps}
                    onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg"
                    placeholder="8"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Sets</label>
                  <input
                    type="number"
                    value={formData.sets}
                    onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg"
                    placeholder="3"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 bg-gray-700 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-neon-green text-black font-bold rounded-lg">
                  Save PR
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default function PRs() {
  return (
    <ProtectedRoute>
      <PRsContent />
    </ProtectedRoute>
  );
}