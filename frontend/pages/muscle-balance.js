import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { workoutAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import DBStatusBanner from '../components/DBStatusBanner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const muscleGroups = [
  { id: 'chest', name: 'Chest', position: 'top-center' },
  { id: 'back', name: 'Back', position: 'top-center' },
  { id: 'shoulders', name: 'Shoulders', position: 'top-left' },
  { id: 'arms', name: 'Arms', position: 'middle-left' },
  { id: 'core', name: 'Core', position: 'center' },
  { id: 'legs', name: 'Legs', position: 'bottom-center' },
];

function MuscleBalanceContent() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await workoutAPI.getStats();
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a0a0a0' } },
      y: { grid: { display: false }, ticks: { color: '#a0a0a0' } },
    },
  };

  const chartData = {
    labels: muscleGroups.map((m) => m.name),
    datasets: [
      {
        label: 'Volume',
        data: muscleGroups.map((m) => stats?.muscleGroups?.[m.id] || 0),
        backgroundColor: muscleGroups.map((m) => {
          const volume = stats?.muscleGroups?.[m.id] || 0;
          const max = Math.max(...Object.values(stats?.muscleGroups || {}));
          if (max === 0) return 'rgba(57, 255, 20, 0.5)';
          const ratio = volume / max;
          if (ratio < 0.3) return 'rgba(255, 68, 68, 0.8)';
          if (ratio < 0.6) return 'rgba(255, 170, 0, 0.8)';
          return 'rgba(57, 255, 20, 0.8)';
        }),
        borderRadius: 8,
      },
    ],
  };

  const getBalanceScore = () => {
    if (!stats?.muscleGroups) return 50;
    const volumes = Object.values(stats.muscleGroups);
    if (volumes.length === 0) return 50;
    const max = Math.max(...volumes);
    const min = Math.min(...volumes);
    if (max === 0) return 50;
    return Math.round(100 - ((max - min) / max) * 50);
  };

  const getOvertrainedMuscles = () => {
    if (!stats?.muscleGroups) return [];
    const max = Math.max(...Object.values(stats.muscleGroups));
    return Object.entries(stats.muscleGroups)
      .filter(([_, v]) => max > 0 && v / max > 0.7)
      .map(([k]) => k);
  };

  const getNeglectedMuscles = () => {
    if (!stats?.muscleGroups) return [];
    const max = Math.max(...Object.values(stats.muscleGroups));
    return Object.entries(stats.muscleGroups)
      .filter(([_, v]) => max > 0 && v / max < 0.3)
      .map(([k]) => k);
  };

  const getMuscleColor = (muscle) => {
    const volume = stats?.muscleGroups?.[muscle] || 0;
    const max = Math.max(...Object.values(stats?.muscleGroups || {}));
    if (max === 0) return 'rgba(57, 255, 20, 0.3)';
    const ratio = volume / max;
    if (ratio < 0.3) return 'rgba(255, 68, 68, 0.8)';
    if (ratio < 0.6) return 'rgba(255, 170, 0, 0.8)';
    return 'rgba(57, 255, 20, 0.8)';
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
      <DBStatusBanner />
      <div>
        <h1 className="text-3xl font-heading font-bold">Muscle Balance Analyzer</h1>
        <p className="text-gray-400">Identify overtrained and neglected muscle groups</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 text-center">
          <div className="text-4xl font-bold text-neon-green mb-2">{getBalanceScore()}%</div>
          <p className="text-gray-400">Balance Score</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 text-center">
          <div className="text-4xl font-bold text-red-400 mb-2">{getOvertrainedMuscles().length}</div>
          <p className="text-gray-400">Overtrained</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 text-center">
          <div className="text-4xl font-bold text-yellow-400 mb-2">{getNeglectedMuscles().length}</div>
          <p className="text-gray-400">Neglected</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Body Map</h3>
          <div className="relative h-80 flex items-center justify-center">
            <div className="w-40 h-64 bg-dark-bg rounded-3xl relative">
              {muscleGroups.map((muscle) => {
                const positions = {
                  'top-center': 'top: 20px; left: 50%; transform: translateX(-50%);',
                  'top-left': 'top: 20px; left: 10px;',
                  'middle-left': 'top: 100px; left: 10px;',
                  'center': 'top: 130px; left: 50%; transform: translateX(-50%);',
                  'bottom-center': 'bottom: 40px; left: 50%; transform: translateX(-50%);',
                };
                return (
                  <div
                    key={muscle.id}
                    className="absolute w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all hover:scale-110"
                    style={{
                      ...(positions[muscle.position] || {}),
                      backgroundColor: getMuscleColor(muscle.id),
                      boxShadow: `0 0 20px ${getMuscleColor(muscle.id)}`,
                    }}
                    title={`${muscle.name}: ${stats?.muscleGroups?.[muscle.id] || 0} volume`}
                  >
                    {muscle.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span> Neglected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Moderate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-neon-green"></span> Balanced
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Volume Distribution</h3>
          <div className="h-72">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {getOvertrainedMuscles().length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border-l-4 border-red-500">
          <h3 className="font-heading font-bold text-lg mb-4 text-red-400">⚠️ Overtrained Muscles</h3>
          <p className="text-gray-400 mb-4">These muscle groups are receiving high volume. Consider reducing to prevent overtraining:</p>
          <div className="flex flex-wrap gap-2">
            {getOvertrainedMuscles().map((muscle) => (
              <span key={muscle} className="px-4 py-2 bg-red-500/20 border border-red-500 rounded-full capitalize">
                {muscle}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {getNeglectedMuscles().length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 border-l-4 border-yellow-500">
          <h3 className="font-heading font-bold text-lg mb-4 text-yellow-400">⚠️ Neglected Muscles</h3>
          <p className="text-gray-400 mb-4">These muscle groups need more attention for balanced development:</p>
          <div className="flex flex-wrap gap-2">
            {getNeglectedMuscles().map((muscle) => (
              <span key={muscle} className="px-4 py-2 bg-yellow-500/20 border border-yellow-500 rounded-full capitalize">
                {muscle}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h3 className="font-heading font-bold text-lg mb-4">Recommendations</h3>
        <div className="space-y-3">
          {getBalanceScore() >= 70 ? (
            <p className="text-neon-green">✓ Your muscle balance is great! Keep up the good work maintaining variety in your training.</p>
          ) : getBalanceScore() >= 40 ? (
            <p className="text-yellow-400">⚡ Your muscle balance could use some improvement. Try adding more exercises for neglected muscle groups.</p>
          ) : (
            <p className="text-red-400">⚠️ Your muscle balance needs attention. Consider restructuring your workout split to target underworked muscles.</p>
          )}
          {getNeglectedMuscles().includes('legs') && (
            <p className="text-gray-400">💡 Don&apos;t skip leg day! Start with squats or leg presses to build lower body strength.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function MuscleBalance() {
  return (
    <ProtectedRoute>
      <MuscleBalanceContent />
    </ProtectedRoute>
  );
}