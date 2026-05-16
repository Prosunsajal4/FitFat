import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { workoutAPI, aiAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [weightData, setWeightData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recRes, progressRes] = await Promise.all([
        workoutAPI.getStats(),
        aiAPI.getRecommendations(),
        progressAPI.getChart({ period: 30 }),
      ]);

      setStats(statsRes.data);
      setRecommendation(recRes.data.recommendations?.[0]);
      setWeightData(progressRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const weeklyChartData = {
    labels: stats?.workoutFrequency?.map((d) => d.date.slice(5)) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Workouts',
        data: stats?.workoutFrequency?.map((d) => d.count) || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(57, 255, 20, 0.5)',
        borderColor: '#39ff14',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const weightChartData = {
    labels: weightData?.labels?.slice(-7) || [],
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightData?.weight?.slice(-7) || [],
        borderColor: '#b026ff',
        backgroundColor: 'rgba(176, 38, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#a0a0a0' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#a0a0a0' },
      },
    },
  };

  const getConsistencyScore = () => {
    if (!stats?.workoutFrequency) return 0;
    const total = stats.workoutFrequency.reduce((sum, d) => sum + d.count, 0);
    return Math.min(Math.round((total / 7) * 100), 100);
  };

  const getMuscleBalanceScore = () => {
    if (!stats?.muscleGroups) return 50;
    const muscles = Object.values(stats.muscleGroups);
    if (muscles.length === 0) return 50;
    const max = Math.max(...muscles);
    const min = Math.min(...muscles);
    return Math.round(100 - ((max - min) / max) * 50);
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
          <h1 className="text-3xl font-heading font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-gray-400">Here&apos;s your fitness overview</p>
        </div>
        <div className="text-right">
          <p className="text-neon-purple font-heading">{user?.goal?.toUpperCase()}</p>
          <p className="text-gray-400 text-sm">Goal</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="text-3xl mb-1">🔥</div>
          <p className="text-2xl font-bold text-neon-green">{stats?.userStats?.streak || 0}</p>
          <p className="text-gray-400 text-sm">Day Streak</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="text-3xl mb-1">💪</div>
          <p className="text-2xl font-bold text-neon-purple">{stats?.totalWorkouts || 0}</p>
          <p className="text-gray-400 text-sm">Total Workouts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="text-3xl mb-1">🔥</div>
          <p className="text-2xl font-bold text-orange-400">{stats?.weeklyCalories || 0}</p>
          <p className="text-gray-400 text-sm">Weekly Cal</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="text-3xl mb-1">⚖️</div>
          <p className="text-2xl font-bold text-white">{weightData?.weight?.[weightData.weight.length - 1] || user?.body?.weight || 0}kg</p>
          <p className="text-gray-400 text-sm">Current Weight</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="text-3xl mb-1">📊</div>
          <p className="text-2xl font-bold text-cyan-400">{getConsistencyScore()}%</p>
          <p className="text-gray-400 text-sm">Consistency</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="text-3xl mb-1">⚖️</div>
          <p className="text-2xl font-bold text-yellow-400">{getMuscleBalanceScore()}%</p>
          <p className="text-gray-400 text-sm">Muscle Balance</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="font-heading font-bold text-lg mb-4">Weekly Activity</h3>
          <div className="h-64">
            <Bar data={weeklyChartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="font-heading font-bold text-lg mb-4">Weight Progress</h3>
          <div className="h-64">
            <Line data={weightChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 border-l-4 border-neon-green"
          >
            <h3 className="font-heading font-bold text-lg mb-3">🤖 AI Suggestion</h3>
            <p className="text-gray-300">{recommendation.message}</p>
            <div className="mt-3 inline-block px-3 py-1 bg-neon-green/20 rounded-full text-xs text-neon-green">
              {recommendation.type}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border-l-4 border-neon-purple"
        >
          <h3 className="font-heading font-bold text-lg mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total XP</span>
              <span className="text-neon-green font-bold">{stats?.userStats?.xp || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Level</span>
              <span className="text-neon-purple font-bold">{stats?.userStats?.level || 1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">This Week</span>
              <span className="text-white font-bold">{stats?.weeklyWorkouts || 0} workouts</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border-l-4 border-blue-500"
        >
          <h3 className="font-heading font-bold text-lg mb-3">Muscle Groups</h3>
          <div className="space-y-2">
            {Object.entries(stats?.muscleGroups || {}).map(([muscle, volume]) => (
              <div key={muscle} className="flex items-center gap-2">
                <span className="text-gray-400 capitalize w-20">{muscle}</span>
                <div className="flex-1 h-2 bg-dark-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-neon-green to-neon-purple"
                    style={{ width: `${Math.min((volume / 1000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="font-heading font-bold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/workouts"
            className="p-4 bg-dark-bg rounded-lg text-center hover:bg-neon-green/20 transition-all"
          >
            <div className="text-2xl mb-2">➕</div>
            <p className="text-sm">New Workout</p>
          </a>
          <a
            href="/ai-workout"
            className="p-4 bg-dark-bg rounded-lg text-center hover:bg-neon-purple/20 transition-all"
          >
            <div className="text-2xl mb-2">🤖</div>
            <p className="text-sm">AI Plan</p>
          </a>
          <a
            href="/nutrition"
            className="p-4 bg-dark-bg rounded-lg text-center hover:bg-blue-500/20 transition-all"
          >
            <div className="text-2xl mb-2">🥗</div>
            <p className="text-sm">Log Food</p>
          </a>
          <a
            href="/coach"
            className="p-4 bg-dark-bg rounded-lg text-center hover:bg-yellow-500/20 transition-all"
          >
            <div className="text-2xl mb-2">💬</div>
            <p className="text-sm">Ask AI</p>
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}