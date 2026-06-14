import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { workoutAPI, nutritionAPI, progressAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import DBStatusBanner from '../components/DBStatusBanner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AnalyticsContent() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [workoutStats, weeklyNutrition] = await Promise.all([
        workoutAPI.getStats(),
        nutritionAPI.getWeekly(),
      ]);
      setStats({
        ...workoutStats.data,
        nutrition: weeklyNutrition.data,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#a0a0a0' } },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a0a0a0' } },
      y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a0a0a0' } },
    },
  };

  const workoutFrequencyData = {
    labels: stats?.workoutFrequency?.map((d) => d.date?.slice(5)) || [],
    datasets: [
      {
        label: 'Workouts',
        data: stats?.workoutFrequency?.map((d) => d.count) || [],
        backgroundColor: 'rgba(57, 255, 20, 0.5)',
        borderColor: '#39ff14',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const caloriesData = {
    labels: stats?.nutrition?.daily?.map((d) => d.date.slice(5)) || [],
    datasets: [
      {
        label: 'Calories',
        data: stats?.nutrition?.daily?.map((d) => d.calories) || [],
        borderColor: '#b026ff',
        backgroundColor: 'rgba(176, 38, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const muscleData = {
    labels: Object.keys(stats?.muscleGroups || {}).map((k) => k.charAt(0).toUpperCase() + k.slice(1)),
    datasets: [
      {
        data: Object.values(stats?.muscleGroups || {}),
        backgroundColor: [
          '#39ff14',
          '#b026ff',
          '#ffaa00',
          '#00ffff',
          '#ff4444',
          '#44ff44',
          '#888888',
        ],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#a0a0a0' } } },
    cutout: '60%',
  };

  const getConsistencyPercentage = () => {
    if (!stats?.workoutFrequency) return 0;
    const total = stats.workoutFrequency.reduce((sum, d) => sum + d.count, 0);
    return Math.round((total / 7) * 100);
  };

  const getAverageCalories = () => {
    if (!stats?.nutrition?.averages) return 0;
    return stats.nutrition.averages.calories;
  };

  const getMostTrainedMuscle = () => {
    if (!stats?.muscleGroups) return 'N/A';
    const muscles = Object.entries(stats.muscleGroups);
    if (muscles.length === 0) return 'N/A';
    const max = muscles.reduce((a, b) => (a[1] > b[1] ? a : b));
    return max[0].charAt(0).toUpperCase() + max[0].slice(1);
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
        <h1 className="text-3xl font-heading font-bold">Analytics Dashboard</h1>
        <p className="text-gray-400">Deep dive into your fitness data</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💪</span>
            <div>
              <p className="text-gray-400 text-xs">Total Workouts</p>
              <p className="text-2xl font-bold text-neon-green">{stats?.totalWorkouts || 0}</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <p className="text-gray-400 text-xs">This Week</p>
              <p className="text-2xl font-bold text-neon-purple">{stats?.weeklyWorkouts || 0}</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <p className="text-gray-400 text-xs">Consistency</p>
              <p className="text-2xl font-bold text-cyan-400">{getConsistencyPercentage()}%</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-gray-400 text-xs">Avg Daily Cal</p>
              <p className="text-2xl font-bold text-orange-400">{getAverageCalories()}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Workout Frequency (7 Days)</h3>
          <div className="h-64">
            <Bar data={workoutFrequencyData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Calories Burned Trend</h3>
          <div className="h-64">
            <Line data={caloriesData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Muscle Group Distribution</h3>
          <div className="h-64">
            <Doughnut data={muscleData} options={doughnutOptions} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Muscle Volume Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(stats?.muscleGroups || {}).map(([muscle, volume]) => {
              const maxVolume = Math.max(...Object.values(stats.muscleGroups || {}));
              const percentage = maxVolume > 0 ? (volume / maxVolume) * 100 : 0;
              return (
                <div key={muscle} className="flex items-center gap-3">
                  <span className="w-20 text-sm capitalize text-gray-400">{muscle}</span>
                  <div className="flex-1 h-4 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-green to-neon-purple"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-neon-green w-16 text-right">{volume}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-dark-bg rounded-lg">
            <p className="text-sm text-gray-400 mb-2">🏆 Most Trained: <span className="text-neon-green font-bold">{getMostTrainedMuscle()}</span></p>
            <p className="text-sm text-gray-400">Keep balanced training for optimal results!</p>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h3 className="font-heading font-bold text-lg mb-4">Performance Summary</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-dark-bg rounded-lg">
            <span className="text-2xl">🔥</span>
            <p className="text-gray-400 mb-1 text-sm">Weekly Calories Burned</p>
            <p className="text-2xl font-bold text-neon-purple">{stats?.weeklyCalories || 0}</p>
          </div>
          <div className="text-center p-4 bg-dark-bg rounded-lg">
            <span className="text-2xl">📅</span>
            <p className="text-gray-400 mb-1 text-sm">Last Workout</p>
            <p className="text-2xl font-bold text-neon-green">
              {stats?.lastWorkoutDate
                ? new Date(stats.lastWorkoutDate).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
          <div className="text-center p-4 bg-dark-bg rounded-lg">
            <span className="text-2xl">🏋️</span>
            <p className="text-gray-400 mb-1 text-sm">Total Volume</p>
            <p className="text-2xl font-bold text-cyan-400">
              {Object.values(stats?.muscleGroups || {}).reduce((a, b) => a + b, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Analytics() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}