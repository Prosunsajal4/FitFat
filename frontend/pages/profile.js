import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

const badges = {
  '7-day-streak': { name: '7-Day Streak', icon: '🔥', description: 'Workout 7 days in a row' },
  '30-workouts': { name: '30 Workouts', icon: '💪', description: 'Complete 30 total workouts' },
  'first-10-workouts': { name: 'First 10', icon: '🌟', description: 'Complete first 10 workouts' },
};

const levels = [
  { level: 1, name: 'Beginner', minXP: 0, maxXP: 100, color: '#888888' },
  { level: 2, name: 'Intermediate', minXP: 101, maxXP: 500, color: '#39ff14' },
  { level: 3, name: 'Advanced', minXP: 501, maxXP: 1000, color: '#b026ff' },
  { level: 4, name: 'Pro', minXP: 1001, maxXP: 2500, color: '#ffaa00' },
  { level: 5, name: 'Beast', minXP: 2501, maxXP: 5000, color: '#ff4444' },
  { level: 6, name: 'Legend', minXP: 5001, maxXP: 999999, color: '#00ffff' },
];

function ProfileContent() {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    goal: user?.goal || 'maintenance',
    experience: user?.experience || 'beginner',
    weight: user?.body?.weight || 0,
    height: user?.body?.height || 0,
    age: user?.body?.age || 0,
  });
  const [saving, setSaving] = useState(false);

  const currentLevel = levels.find((l) => l.level === (user?.stats?.level || 1)) || levels[0];
  const nextLevel = levels.find((l) => l.level === (user?.stats?.level || 1) + 1);
  const xpInCurrentLevel = (user?.stats?.xp || 0) - currentLevel.minXP;
  const xpNeeded = currentLevel.maxXP - currentLevel.minXP;
  const progressPercentage = Math.min((xpInCurrentLevel / xpNeeded) * 100, 100);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(formData);
      updateUser(res.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Profile</h1>
        <p className="text-gray-400">Manage your account and view achievements</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-green to-neon-purple flex items-center justify-center text-4xl font-heading font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>

            <div className="mt-6 p-4 bg-dark-bg rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neon-green font-bold">{currentLevel.name}</span>
                <span className="text-gray-400">Level {user?.stats?.level || 1}</span>
              </div>
              <div className="h-3 bg-dark-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-green to-neon-purple transition-all"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {xpInCurrentLevel} / {xpNeeded} XP to next level
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">Account Details</h3>
              <button
                onClick={() => setEditing(!editing)}
                className="text-neon-green hover:underline"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Goal</label>
                    <select
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg"
                    >
                      <option value="bulking">Muscle Building</option>
                      <option value="cutting">Fat Loss</option>
                      <option value="strength">Strength</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-dark-bg rounded-lg">
                  <p className="text-gray-400 text-sm">Goal</p>
                  <p className="font-bold capitalize">{user?.goal || 'Not set'}</p>
                </div>
                <div className="p-4 bg-dark-bg rounded-lg">
                  <p className="text-gray-400 text-sm">Experience</p>
                  <p className="font-bold capitalize">{user?.experience || 'Not set'}</p>
                </div>
                <div className="p-4 bg-dark-bg rounded-lg">
                  <p className="text-gray-400 text-sm">Weight</p>
                  <p className="font-bold">{user?.body?.weight || 0} kg</p>
                </div>
                <div className="p-4 bg-dark-bg rounded-lg">
                  <p className="text-gray-400 text-sm">Height</p>
                  <p className="font-bold">{user?.body?.height || 0} cm</p>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="font-heading font-bold text-lg mb-4">Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-dark-bg rounded-lg text-center">
                <p className="text-2xl font-bold text-neon-green">{user?.stats?.streak || 0}</p>
                <p className="text-gray-400 text-sm">Day Streak</p>
              </div>
              <div className="p-4 bg-dark-bg rounded-lg text-center">
                <p className="text-2xl font-bold text-neon-purple">{user?.stats?.totalWorkouts || 0}</p>
                <p className="text-gray-400 text-sm">Workouts</p>
              </div>
              <div className="p-4 bg-dark-bg rounded-lg text-center">
                <p className="text-2xl font-bold text-orange-400">{user?.stats?.xp || 0}</p>
                <p className="text-gray-400 text-sm">Total XP</p>
              </div>
              <div className="p-4 bg-dark-bg rounded-lg text-center">
                <p className="text-2xl font-bold text-cyan-400">{user?.stats?.badges?.length || 0}</p>
                <p className="text-gray-400 text-sm">Badges</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-heading font-bold text-lg mb-4">Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(badges).map(([key, badge]) => {
                const earned = user?.stats?.badges?.includes(key);
                return (
                  <div
                    key={key}
                    className={`p-4 rounded-lg text-center ${
                      earned ? 'bg-neon-green/20 border border-neon-green/30' : 'bg-dark-bg opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <p className="font-bold">{badge.name}</p>
                    <p className="text-xs text-gray-400">{badge.description}</p>
                    {earned && <span className="text-neon-green text-xs mt-2 block">✓ Earned</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h3 className="font-heading font-bold text-lg mb-4 text-red-400">Danger Zone</h3>
        <p className="text-gray-400 mb-4">
          Once you log out, you&apos;ll need to sign in again to access your account.
        </p>
        <button
          onClick={logout}
          className="px-6 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30"
        >
          Logout
        </button>
      </motion.div>
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}