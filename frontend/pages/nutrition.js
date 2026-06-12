import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { nutritionAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import DBStatusBanner from '../components/DBStatusBanner';
import { useToast } from '../components/Toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

function NutritionContent() {
  const [todayData, setTodayData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMealModal, setShowMealModal] = useState(false);
  const [mealForm, setMealForm] = useState({
    type: 'breakfast',
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });
  const toast = useToast();

  useEffect(() => {
    fetchNutrition();
  }, []);

  const fetchNutrition = async () => {
    try {
      const [todayRes, weeklyRes] = await Promise.all([
        nutritionAPI.getToday(),
        nutritionAPI.getWeekly(),
      ]);
      setTodayData(todayRes.data);
      setWeeklyData(weeklyRes.data);
    } catch (error) {
      console.error('Error fetching nutrition:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMeal = async (e) => {
    e.preventDefault();
    try {
      await nutritionAPI.addMeal(mealForm);
      toast.success('Meal added!');
      setShowMealModal(false);
      setMealForm({
        type: 'breakfast',
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
      });
      fetchNutrition();
    } catch (error) {
      toast.error('Failed to add meal');
    }
  };

  const updateWater = async (glasses) => {
    try {
      await nutritionAPI.updateWater({ waterIntake: glasses });
      fetchNutrition();
    } catch (error) {
      toast.error('Failed to update water');
    }
  };

  const targets = todayData?.targets || { dailyCalorieTarget: 2000, proteinTarget: 150, waterGoal: 8 };
  const totalCalories = todayData?.totalCalories || 0;
  const totalProtein = todayData?.totalProtein || 0;
  const totalCarbs = todayData?.totalCarbs || 0;
  const totalFats = todayData?.totalFats || 0;
  const waterIntake = todayData?.waterIntake || 0;

  const calorieChartData = {
    labels: ['Consumed', 'Remaining'],
    datasets: [
      {
        data: [Math.min(totalCalories, targets.dailyCalorieTarget), Math.max(0, targets.dailyCalorieTarget - totalCalories)],
        backgroundColor: ['#39ff14', 'rgba(57, 255, 20, 0.2)'],
        borderWidth: 0,
      },
    ],
  };

  const macroChartData = {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [
      {
        data: [totalProtein, totalCarbs, totalFats],
        backgroundColor: ['#39ff14', '#b026ff', '#ffaa00'],
        borderWidth: 0,
      },
    ],
  };

  const weeklyChartData = {
    labels: weeklyData?.daily?.map((d) => d.date.slice(5)) || [],
    datasets: [
      {
        label: 'Calories',
        data: weeklyData?.daily?.map((d) => d.calories) || [],
        backgroundColor: 'rgba(57, 255, 20, 0.5)',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#a0a0a0' } },
      y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a0a0a0' } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: '70%',
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Nutrition Tracker</h1>
          <p className="text-gray-400">Monitor your daily nutrition intake</p>
        </div>
        <button
          onClick={() => setShowMealModal(true)}
          className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90"
        >
          + Log Meal
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <div className="h-32 relative">
            <Doughnut data={calorieChartData} options={doughnutOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold">{Math.round((totalCalories / targets.dailyCalorieTarget) * 100)}%</p>
                <p className="text-xs text-gray-400">of goal</p>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">{totalCalories} kcal</span>
              <span className="text-gray-400">{targets.dailyCalorieTarget} kcal</span>
            </div>
            <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((totalCalories / targets.dailyCalorieTarget) * 100, 100)}%`,
                  background: totalCalories > targets.dailyCalorieTarget
                    ? 'linear-gradient(90deg, #ff4444, #ff6b6b)'
                    : 'linear-gradient(90deg, #39ff14, #00c8ff)',
                }}
              ></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <div className="h-32 relative">
            <Doughnut data={macroChartData} options={doughnutOptions} />
          </div>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <span className="text-neon-green">P: {totalProtein}g</span>
            <span className="text-neon-purple">C: {totalCarbs}g</span>
            <span className="text-yellow-400">F: {totalFats}g</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <h3 className="font-bold mb-3">Protein</h3>
          <div className="relative h-20">
            <div className="absolute inset-0 bg-dark-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-green transition-all"
                style={{ width: `${Math.min((totalProtein / targets.proteinTarget) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <p className="text-center mt-2">
            <span className="text-neon-green font-bold">{totalProtein}</span>
            <span className="text-gray-400"> / {targets.proteinTarget}g</span>
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
          <h3 className="font-bold mb-3">Water Intake</h3>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl">💧</span>
            <span className="text-3xl font-bold text-cyan-400">{waterIntake}</span>
            <span className="text-gray-400">/ {targets.waterGoal} glasses</span>
          </div>
          <div className="flex justify-center gap-1 mb-2">
            <button onClick={() => updateWater(Math.max(0, waterIntake - 1))} className="px-3 py-1 bg-gray-700 rounded">-</button>
            <button onClick={() => updateWater(waterIntake + 1)} className="px-3 py-1 bg-neon-green text-black rounded font-bold">+1</button>
            <button onClick={() => updateWater(waterIntake + 2)} className="px-3 py-1 bg-neon-green text-black rounded font-bold">+2</button>
          </div>
          <div className="flex justify-center gap-1">
            {[250, 500, 750].map(ml => (
              <button key={ml} onClick={() => updateWater(waterIntake + Math.round(ml / 250))} className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">{ml}ml</button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Today&apos;s Meals</h3>
          {todayData?.meals?.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No meals logged today</p>
          ) : (
            <div className="space-y-3">
              {mealTypes.map((type) => {
                const meals = todayData?.meals?.filter((m) => m.type === type) || [];
                return (
                  <div key={type} className="bg-dark-bg p-3 rounded-lg">
                    <h4 className="text-neon-purple capitalize mb-2">{type}</h4>
                    {meals.length === 0 ? (
                      <p className="text-gray-500 text-sm">No meals logged</p>
                    ) : (
                      meals.map((meal, i) => (
                        <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-gray-800 last:border-0">
                          <span>{meal.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">
                              {meal.calories}kcal | P:{meal.protein}g C:{meal.carbs}g F:{meal.fats}g
                            </span>
                            <button
                              onClick={async () => {
                                try {
                                  await nutritionAPI.deleteMeal(meal._id);
                                  toast.success('Meal deleted');
                                  fetchNutrition();
                                } catch (error) {
                                  toast.error('Failed to delete meal');
                                }
                              }}
                              className="text-gray-500 hover:text-red-400"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-heading font-bold text-lg mb-4">Weekly Overview</h3>
          <div className="h-64">
            <Bar data={weeklyChartData} options={chartOptions} />
          </div>
          {weeklyData?.averages && (
            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
              <div className="bg-dark-bg p-2 rounded">
                <p className="text-gray-400">Avg Cal</p>
                <p className="text-neon-green font-bold">{weeklyData.averages.calories}</p>
              </div>
              <div className="bg-dark-bg p-2 rounded">
                <p className="text-gray-400">Avg Protein</p>
                <p className="text-neon-green font-bold">{weeklyData.averages.protein}g</p>
              </div>
              <div className="bg-dark-bg p-2 rounded">
                <p className="text-gray-400">Avg Carbs</p>
                <p className="text-neon-purple font-bold">{weeklyData.averages.carbs}g</p>
              </div>
              <div className="bg-dark-bg p-2 rounded">
                <p className="text-gray-400">Avg Fats</p>
                <p className="text-yellow-400 font-bold">{weeklyData.averages.fats}g</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {totalProtein < targets.proteinTarget && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 border-l-4 border-neon-green">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-bold">Protein Recommendation</p>
              <p className="text-gray-400 text-sm">
                You need {targets.proteinTarget - totalProtein}g more protein today for optimal muscle growth!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {showMealModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowMealModal(false)}
        >
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-heading font-bold mb-4">Log Meal</h2>
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Quick Add (Bangladeshi)</p>
              <div className="flex flex-wrap gap-1">
                {[
                  { name: 'Chicken Rice', cal: 450, p: 35, c: 55, f: 8, t: 'lunch' },
                  { name: 'Fish + Rice', cal: 400, p: 30, c: 55, f: 7, t: 'lunch' },
                  { name: 'Dal + Rice', cal: 350, p: 15, c: 65, f: 4, t: 'lunch' },
                  { name: 'Eggs (2)', cal: 160, p: 14, c: 1, f: 11, t: 'breakfast' },
                  { name: 'Banana', cal: 105, p: 1, c: 27, f: 0, t: 'snack' },
                  { name: 'Milk', cal: 150, p: 8, c: 12, f: 8, t: 'snack' },
                  { name: 'Roti + Sabzi', cal: 250, p: 8, c: 40, f: 6, t: 'dinner' },
                  { name: 'Paratha', cal: 300, p: 6, c: 40, f: 14, t: 'breakfast' },
                ].map((q) => (
                  <button key={q.name} type="button" onClick={() => setMealForm({ name: q.name, calories: q.cal, protein: q.p, carbs: q.c, fats: q.f, type: q.t })} className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                    {q.name}
                  </button>
                ))}
              </div>
            </div>
            <form onSubmit={addMeal} className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Meal Type</label>
                <select value={mealForm.type} onChange={(e) => setMealForm({ ...mealForm, type: e.target.value })} className="w-full px-4 py-2 rounded-lg">
                  {mealTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Food Name</label>
                <input type="text" value={mealForm.name} onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })} className="w-full px-4 py-2 rounded-lg" placeholder="Chicken breast" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Calories</label>
                  <input type="number" value={mealForm.calories} onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })} className="w-full px-4 py-2 rounded-lg" placeholder="0" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Protein (g)</label>
                  <input type="number" value={mealForm.protein} onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })} className="w-full px-4 py-2 rounded-lg" placeholder="0" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Carbs (g)</label>
                  <input type="number" value={mealForm.carbs} onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })} className="w-full px-4 py-2 rounded-lg" placeholder="0" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Fats (g)</label>
                  <input type="number" value={mealForm.fats} onChange={(e) => setMealForm({ ...mealForm, fats: e.target.value })} className="w-full px-4 py-2 rounded-lg" placeholder="0" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowMealModal(false)} className="flex-1 py-3 bg-gray-700 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-neon-green text-black font-bold rounded-lg">
                  Save Meal
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h3 className="font-heading font-bold text-lg mb-4">📊 Daily Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-dark-bg rounded-lg">
            <p className="text-xs text-gray-400">Calories</p>
            <p className="text-xl font-bold text-neon-green">{totalCalories} / {targets.dailyCalorieTarget}</p>
            <p className="text-xs text-gray-500">{Math.max(0, targets.dailyCalorieTarget - totalCalories)} remaining</p>
          </div>
          <div className="text-center p-3 bg-dark-bg rounded-lg">
            <p className="text-xs text-gray-400">Protein</p>
            <p className="text-xl font-bold text-neon-purple">{totalProtein}g / {targets.proteinTarget}g</p>
            <p className="text-xs text-gray-500">{Math.max(0, targets.proteinTarget - totalProtein)}g remaining</p>
          </div>
          <div className="text-center p-3 bg-dark-bg rounded-lg">
            <p className="text-xs text-gray-400">Carbs</p>
            <p className="text-xl font-bold text-cyan-400">{totalCarbs}g</p>
            <p className="text-xs text-gray-500">{totalMeals} meals logged</p>
          </div>
          <div className="text-center p-3 bg-dark-bg rounded-lg">
            <p className="text-xs text-gray-400">Fats</p>
            <p className="text-xl font-bold text-yellow-400">{totalFats}g</p>
            <p className="text-xs text-gray-500">💧 {waterIntake} / {targets.waterGoal} glasses</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Nutrition() {
  return (
    <ProtectedRoute>
      <NutritionContent />
    </ProtectedRoute>
  );
}