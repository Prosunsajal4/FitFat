import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { workoutAPI, aiAPI, progressAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import { SkeletonCard, SkeletonChart } from '../components/Skeleton';
import DBStatusBanner from '../components/DBStatusBanner';

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
  const [lastWorkout, setLastWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recRes, progressRes, workoutRes] = await Promise.all([
        workoutAPI.getStats(),
        aiAPI.getRecommendations(),
        progressAPI.getChart({ period: 30 }),
        workoutAPI.getWorkouts({ limit: 1 }),
      ]);

      setStats(statsRes.data);
      setRecommendation(recRes.data.recommendations?.[0]);
      setWeightData(progressRes.data);
      if (workoutRes.data?.length > 0) setLastWorkout(workoutRes.data[0]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const weeklyChartData = {
    labels: stats?.workoutFrequency?.map((d) => d.date?.slice(5)) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅';
    if (hour < 17) return '☀️';
    return '🌙';
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
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DBStatusBanner />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">{getGreeting()}, {user?.name}! {getGreetingIcon()}</h1>
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
          transition={{ delay: 0.1 }}
          className={`glass-card p-4 ${(stats?.userStats?.streak || 0) > 0 ? 'border-neon-green/40 shadow-neon-green' : ''}`}
        >
          <div className="text-3xl mb-1">🔥</div>
          <p className="text-2xl font-bold text-neon-green">{stats?.userStats?.streak || 0}</p>
          <p className="text-gray-400 text-sm">Day Streak</p>
          {stats?.userStats?.bestStreak > 0 && (
            <p className="text-yellow-400 text-xs mt-1">Best: {stats.userStats.bestStreak} days</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-4"
        >
          <div className="text-3xl mb-1">💪</div>
          <p className="text-2xl font-bold text-neon-purple">{stats?.totalWorkouts || 0}</p>
          <p className="text-gray-400 text-sm">Total Workouts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4"
        >
          <div className="text-3xl mb-1">🔥</div>
          <p className="text-2xl font-bold text-orange-400">{stats?.weeklyCalories || 0}</p>
          <p className="text-gray-400 text-sm">Weekly Cal</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-4"
        >
          <div className="text-3xl mb-1">⚖️</div>
          <p className="text-2xl font-bold text-white">{weightData?.weight?.[weightData.weight.length - 1] || user?.body?.weight || 0}kg</p>
          <p className="text-gray-400 text-sm">Current Weight</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4"
        >
          <div className="text-3xl mb-1">📊</div>
          <p className="text-2xl font-bold text-cyan-400">{getConsistencyScore()}%</p>
          <p className="text-gray-400 text-sm">Consistency</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
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

      {lastWorkout && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Last Workout</h3>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-neon-green font-bold text-lg">{lastWorkout.name}</h4>
            <span className="text-gray-400 text-sm">
              {(() => {
                const diff = Date.now() - new Date(lastWorkout.date).getTime();
                const hours = Math.floor(diff / 3600000);
                if (hours < 1) return 'Just now';
                if (hours < 24) return `${hours}h ago`;
                const days = Math.floor(hours / 24);
                if (days === 1) return 'Yesterday';
                return `${days} days ago`;
              })()}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-neon-purple">{lastWorkout.exercises?.length || 0}</p>
              <p className="text-gray-400 text-xs">Exercises</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neon-green">{lastWorkout.exercises?.reduce((sum, e) => sum + (e.sets || 0) * (e.reps || 0) * (e.weight || 0), 0).toLocaleString() || 0}</p>
              <p className="text-gray-400 text-xs">Total Volume (kg)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-400">{lastWorkout.exercises?.reduce((sum, e) => sum + (e.sets || 0), 0) || 0}</p>
              <p className="text-gray-400 text-xs">Total Sets</p>
            </div>
          </div>
        </motion.div>
      )}

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
            className="p-4 bg-dark-bg rounded-lg text-center hover:bg-neon-green/20 transition-all group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">➕</div>
            <p className="text-sm font-medium">New Workout</p>
          </a>
          <a
            href="/ai-workout"
            className="p-4 bg-dark-bg rounded-lg text-center hover:bg-neon-purple/20 transition-all group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🤖</div>
            <p className="text-sm font-medium">AI Plan</p>
          </a>
          <a
            href="/nutrition"
            className="p-4 bg-dark-bg rounded-lg text-center hover:bg-blue-500/20 transition-all group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🥗</div>
            <p className="text-sm font-medium">Log Food</p>
          </a>
          <a
            href="/coach"
            className="p-4 bg-dark-bg rounded-lg text-center hover:bg-yellow-500/20 transition-all group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">💬</div>
            <p className="text-sm font-medium">Ask AI</p>
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