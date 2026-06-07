import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import DBStatusBanner from '../components/DBStatusBanner';
import { useToast } from '../components/Toast';

function SettingsContent() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [amoledMode, setAmoledMode] = useState(false);
  const [targets, setTargets] = useState({
    dailyCalorieTarget: user?.settings?.dailyCalorieTarget || 2000,
    proteinTarget: user?.settings?.proteinTarget || 150,
    waterGoal: user?.settings?.waterGoal || 8,
  });

  useEffect(() => {
    const saved = localStorage.getItem('amoledMode') === 'true';
    setAmoledMode(saved);
    if (saved) document.documentElement.classList.add('amoled');
  }, []);

  const toggleAmoled = () => {
    const next = !amoledMode;
    setAmoledMode(next);
    localStorage.setItem('amoledMode', next);
    document.documentElement.classList.toggle('amoled', next);
    toast.info(next ? 'AMOLED mode enabled - true black background' : 'AMOLED mode disabled');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile({
        settings: {
          dailyCalorieTarget: parseInt(targets.dailyCalorieTarget) || 2000,
          proteinTarget: parseInt(targets.proteinTarget) || 150,
          waterGoal: parseInt(targets.waterGoal) || 8,
        }
      });
      updateUser(res.data);
      toast.success('Targets updated!');
    } catch (error) {
      toast.error('Failed to update targets');
    } finally {
      setSaving(false);
    }
  };

  const presets = [
    { label: 'Cutting', calories: 1800, protein: 160, water: 10 },
    { label: 'Maintenance', calories: 2200, protein: 140, water: 8 },
    { label: 'Bulking', calories: 2800, protein: 180, water: 10 },
  ];

  return (
    <div className="space-y-6">
      <DBStatusBanner />
      <div>
        <h1 className="text-3xl font-heading font-bold">Settings ⚙️</h1>
        <p className="text-gray-400">Configure your nutrition targets</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="font-heading font-bold text-lg mb-4">Display Settings</h3>
          <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
            <div>
              <p className="font-bold">AMOLED / OLED Mode</p>
              <p className="text-xs text-gray-400">True black background for OLED screens</p>
            </div>
            <button
              onClick={toggleAmoled}
              className={`relative w-12 h-6 rounded-full transition-colors ${amoledMode ? 'bg-neon-green' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${amoledMode ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="font-heading font-bold text-lg mb-4">Daily Nutrition Targets</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Calorie Target (kcal)</label>
              <input
                type="number"
                value={targets.dailyCalorieTarget}
                onChange={(e) => setTargets({ ...targets, dailyCalorieTarget: e.target.value })}
                className="w-full px-4 py-2 rounded-lg"
                placeholder="2000"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Protein Target (g)</label>
              <input
                type="number"
                value={targets.proteinTarget}
                onChange={(e) => setTargets({ ...targets, proteinTarget: e.target.value })}
                className="w-full px-4 py-2 rounded-lg"
                placeholder="150"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Water Goal (glasses/day)</label>
              <input
                type="number"
                value={targets.waterGoal}
                onChange={(e) => setTargets({ ...targets, waterGoal: e.target.value })}
                className="w-full px-4 py-2 rounded-lg"
                placeholder="8"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Targets'}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="font-heading font-bold text-lg mb-4">Quick Presets</h3>
          <div className="space-y-3">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setTargets({
                    dailyCalorieTarget: preset.calories,
                    proteinTarget: preset.protein,
                    waterGoal: preset.water,
                  });
                  toast.info(`${preset.label} preset applied`);
                }}
                className="w-full p-4 rounded-lg bg-dark-bg hover:bg-dark-card text-left transition-all"
              >
                <p className="font-bold text-neon-green">{preset.label}</p>
                <div className="flex gap-4 text-xs text-gray-400 mt-1">
                  <span>{preset.calories} kcal</span>
                  <span>{preset.protein}g protein</span>
                  <span>{preset.water} glasses water</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-dark-bg rounded-lg">
            <h4 className="font-bold text-sm mb-2">Protein Recommendation</h4>
            <p className="text-xs text-gray-400">
              Based on your weight ({user?.body?.weight || 70}kg):
            </p>
            <p className="text-lg font-bold text-neon-green mt-1">
              {Math.round((user?.body?.weight || 70) * 1.8)}g - {Math.round((user?.body?.weight || 70) * 2.2)}g per day
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}