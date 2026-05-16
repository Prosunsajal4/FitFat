import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { progressAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ProgressContent() {
  const [progressData, setProgressData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    chest: '',
    arms: '',
    waist: '',
    bodyFat: '',
  });

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const [progressRes, chartRes, predRes] = await Promise.all([
        progressAPI.getProgress({ limit: 30 }),
        progressAPI.getChart({ period: 60 }),
        progressAPI.getPredictions(),
      ]);
      setProgressData(progressRes.data);
      setChartData(chartRes.data);
      setPredictions(predRes.data.predictions || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await progressAPI.addProgress(formData);
      setShowModal(false);
      setFormData({ weight: '', chest: '', arms: '', waist: '', bodyFat: '' });
      fetchProgress();
    } catch (error) {
      console.error('Error adding progress:', error);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, labels: { color: '#a0a0a0' } },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a0a0a0' } },
      y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a0a0a0' } },
    },
  };

  const weightChartData = {
    labels: chartData?.labels?.map((l) => l.slice(5)) || [],
    datasets: [
      {
        label: 'Weight (kg)',
        data: chartData?.weight || [],
        borderColor: '#39ff14',
        backgroundColor: 'rgba(57, 255, 20, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const measurementsChartData = {
    labels: chartData?.labels?.map((l) => l.slice(5)) || [],
    datasets: [
      {
        label: 'Chest (cm)',
        data: chartData?.chest || [],
        borderColor: '#b026ff',
        tension: 0.4,
      },
      {
        label: 'Arms (cm)',
        data: chartData?.arms || [],
        borderColor: '#39ff14',
        tension: 0.4,
      },
      {
        label: 'Waist (cm)',
        data: chartData?.waist || [],
        borderColor: '#ffaa00',
        tension: 0.4,
      },
    ],
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
          <h1 className="text-3xl font-heading font-bold">Body Progress</h1>
          <p className="text-gray-400">Track your body measurements over time</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90"
        >
          + Log Measurement
        </button>
      </div>

      {predictions.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {predictions.map((pred, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card p-4 border-l-4 ${
                pred.type === 'weight_gain' || pred.type === 'weight_loss'
                  ? 'border-neon-purple'
                  : pred.type === 'consistency'
                  ? 'border-neon-green'
                  : 'border-blue-500'
              }`}
            >
              <p className="text-sm text-gray-400 uppercase mb-1">{pred.type}</p>
              <p className="text-gray-200">{pred.message}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="font-heading font-bold text-lg mb-4">Weight Trend</h3>
          <div className="h-64">
            <Line data={weightChartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="font-heading font-bold text-lg mb-4">Body Measurements</h3>
          <div className="h-64">
            <Line data={measurementsChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="font-heading font-bold text-lg mb-4">Recent Entries</h3>

        {progressData.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No progress entries yet. Start logging your measurements!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-3">Date</th>
                  <th className="text-right py-3">Weight</th>
                  <th className="text-right py-3">Chest</th>
                  <th className="text-right py-3">Arms</th>
                  <th className="text-right py-3">Waist</th>
                  <th className="text-right py-3">Body Fat</th>
                </tr>
              </thead>
              <tbody>
                {progressData.slice(0, 10).map((entry, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-3">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="py-3 text-right text-neon-green">{entry.weight || '-'} kg</td>
                    <td className="py-3 text-right">{entry.chest || '-'} cm</td>
                    <td className="py-3 text-right">{entry.arms || '-'} cm</td>
                    <td className="py-3 text-right">{entry.waist || '-'} cm</td>
                    <td className="py-3 text-right">{entry.bodyFat || '-'}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="glass-card p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-heading font-bold mb-6">Log Measurement</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg"
                    placeholder="70"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Body Fat %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bodyFat}
                    onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg"
                    placeholder="15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.chest}
                    onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Arms (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.arms}
                    onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg"
                    placeholder="35"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.waist}
                    onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg"
                    placeholder="80"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-neon-green text-black font-bold rounded-lg">
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default function Progress() {
  return (
    <ProtectedRoute>
      <ProgressContent />
    </ProtectedRoute>
  );
}