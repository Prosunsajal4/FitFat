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
import DBStatusBanner from '../components/DBStatusBanner';
import { useToast } from '../components/Toast';
import { SkeletonCard, SkeletonChart } from '../components/Skeleton';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Calendar({ progressData, selectedDate, onSelectDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const progressDates = {};
  progressData.forEach((entry) => {
    const d = new Date(entry.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    progressDates[key] = entry;
  });

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const today = new Date();

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-dark-card rounded-lg text-gray-400 hover:text-white">
          ◀
        </button>
        <h3 className="font-heading font-bold text-lg">{monthNames[currentMonth]} {currentYear}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-dark-card rounded-lg text-gray-400 hover:text-white">
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs text-gray-500 py-1">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;

          const key = `${currentYear}-${currentMonth}-${day}`;
          const hasProgress = progressDates[key];
          const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
          const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;

          return (
            <button
              key={day}
              onClick={() => onSelectDate(new Date(currentYear, currentMonth, day))}
              className={`relative p-2 rounded-lg text-sm transition-all ${
                isSelected
                  ? 'bg-neon-green text-black font-bold'
                  : isToday
                  ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50'
                  : hasProgress
                  ? 'bg-neon-green/10 text-neon-green hover:bg-neon-green/20'
                  : 'text-gray-400 hover:bg-dark-card hover:text-white'
              }`}
            >
              {day}
              {hasProgress && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-neon-green rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProgressContent() {
  const [progressData, setProgressData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [formData, setFormData] = useState({
    weight: '',
    chest: '',
    arms: '',
    waist: '',
    bodyFat: '',
  });
  const [photos, setPhotos] = useState({ front: '', side: '', back: '' });
  const [photoPreview, setPhotoPreview] = useState({ front: '', side: '', back: '' });
  const [zoomPhoto, setZoomPhoto] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const [progressRes, chartRes, predRes] = await Promise.all([
        progressAPI.getProgress({ limit: 365 }),
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

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const entry = progressData.find((p) => {
      const d = new Date(p.date);
      return d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
    });
    setSelectedEntry(entry || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await progressAPI.addProgress({ ...formData, photos });
      toast.success('Progress logged!');
      setShowModal(false);
      setFormData({ weight: '', chest: '', arms: '', waist: '', bodyFat: '' });
      setPhotos({ front: '', side: '', back: '' });
      setPhotoPreview({ front: '', side: '', back: '' });
      fetchProgress();
    } catch (error) {
      console.error('Error adding progress:', error);
      toast.error('Failed to save progress');
    }
  };

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => ({ ...prev, [type]: reader.result }));
        setPhotoPreview((prev) => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
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
      <div className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <div className="lg:col-span-2 grid lg:grid-cols-2 gap-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DBStatusBanner />
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
              <p className="text-sm text-gray-400 uppercase mb-1 flex items-center gap-2">
                <span>{pred.type === 'consistency' ? '🔥' : pred.type === 'weight_gain' ? '📈' : pred.type === 'weight_loss' ? '📉' : '💡'}</span>
                {pred.type}
              </p>
              <p className="text-gray-200">{pred.message}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Calendar progressData={progressData} selectedDate={selectedDate} onSelectDate={handleDateSelect} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedEntry && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border-l-4 border-neon-green"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg">📅 {new Date(selectedEntry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                <span className="text-xs text-gray-400">Logged Entry</span>
              </div>
              <div className="grid grid-cols-5 gap-4 text-center">
                {selectedEntry.weight && (
                  <div className="bg-dark-bg p-3 rounded-lg">
                    <p className="text-2xl font-bold text-neon-green">{selectedEntry.weight}</p>
                    <p className="text-xs text-gray-400">Weight (kg)</p>
                  </div>
                )}
                {selectedEntry.chest && (
                  <div className="bg-dark-bg p-3 rounded-lg">
                    <p className="text-2xl font-bold text-neon-purple">{selectedEntry.chest}</p>
                    <p className="text-xs text-gray-400">Chest (cm)</p>
                  </div>
                )}
                {selectedEntry.arms && (
                  <div className="bg-dark-bg p-3 rounded-lg">
                    <p className="text-2xl font-bold text-cyan-400">{selectedEntry.arms}</p>
                    <p className="text-xs text-gray-400">Arms (cm)</p>
                  </div>
                )}
                {selectedEntry.waist && (
                  <div className="bg-dark-bg p-3 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-400">{selectedEntry.waist}</p>
                    <p className="text-xs text-gray-400">Waist (cm)</p>
                  </div>
                )}
                {selectedEntry.bodyFat && (
                  <div className="bg-dark-bg p-3 rounded-lg">
                    <p className="text-2xl font-bold text-red-400">{selectedEntry.bodyFat}%</p>
                    <p className="text-xs text-gray-400">Body Fat</p>
                  </div>
                )}
              </div>
              {selectedEntry.photos && (selectedEntry.photos.front || selectedEntry.photos.side || selectedEntry.photos.back) && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-3">📸 Progress Photos</p>
                  <div className="grid grid-cols-3 gap-3">
                    {['front', 'side', 'back'].map((type) => (
                      selectedEntry.photos[type] && (
                        <div key={type} className="text-center">
                          <img src={selectedEntry.photos[type]} alt={type} className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setZoomPhoto(selectedEntry.photos[type])} />
                          <p className="text-xs text-gray-500 mt-1 capitalize">{type}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {selectedDate && !selectedEntry && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border-l-4 border-gray-600"
            >
              <p className="text-gray-400">No entry logged for {selectedDate.toLocaleDateString()}</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 px-4 py-2 bg-neon-green/20 text-neon-green rounded-lg text-sm hover:bg-neon-green/30"
              >
                + Add Entry
              </button>
            </motion.div>
          )}
        </div>
      </div>

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
                  <th className="text-right py-3"></th>
                </tr>
              </thead>
              <tbody>
                {progressData.slice(0, 10).map((entry, index) => {
                  const prevWeight = progressData[index + 1]?.weight;
                  const weightDiff = entry.weight && prevWeight ? (entry.weight - prevWeight).toFixed(1) : null;
                  return (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-3">{new Date(entry.date).toLocaleDateString()}</td>
                      <td className="py-3 text-right">
                        <span className="text-neon-green">{entry.weight || '-'}</span>
                        {weightDiff && (
                          <span className={`ml-1 text-xs ${parseFloat(weightDiff) > 0 ? 'text-red-400' : parseFloat(weightDiff) < 0 ? 'text-green-400' : 'text-gray-400'}`}>
                            {parseFloat(weightDiff) > 0 ? '▲' : parseFloat(weightDiff) < 0 ? '▼' : '—'}{Math.abs(parseFloat(weightDiff))}kg
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">{entry.chest || '-'} cm</td>
                      <td className="py-3 text-right">{entry.arms || '-'} cm</td>
                      <td className="py-3 text-right">{entry.waist || '-'} cm</td>
                      <td className="py-3 text-right">{entry.bodyFat || '-'}%</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={async () => {
                            try {
                              await progressAPI.deleteProgress(entry._id);
                              toast.success('Entry deleted');
                              fetchProgress();
                            } catch (error) {
                              toast.error('Failed to delete');
                            }
                          }}
                          className="text-gray-500 hover:text-red-400 text-sm"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
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

              <div>
                <label className="block text-gray-400 mb-2">📸 Progress Photos (optional, max 5MB each)</label>
                <div className="grid grid-cols-3 gap-3">
                  {['front', 'side', 'back'].map((type) => (
                    <div key={type} className="relative">
                      <label className="block cursor-pointer">
                        <div className="w-full h-24 bg-dark-bg rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center hover:border-neon-green transition-all overflow-hidden">
                          {photoPreview[type] ? (
                            <img src={photoPreview[type]} alt={type} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <span className="text-2xl">{type === 'front' ? '👤' : type === 'side' ? '↔️' : '🔙'}</span>
                              <span className="text-xs text-gray-500 capitalize">{type}</span>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(e, type)}
                        />
                      </label>
                    </div>
                  ))}
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

      {zoomPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomPhoto(null)}
        >
          <button onClick={() => setZoomPhoto(null)} className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300">✕</button>
          <img src={zoomPhoto} alt="Progress photo zoom" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
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