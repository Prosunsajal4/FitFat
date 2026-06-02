import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { dietAPI } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

const workoutTypes = [
  { id: 'Push', name: 'Push Day', icon: '💪', desc: 'Chest, Shoulders, Triceps' },
  { id: 'Pull', name: 'Pull Day', icon: '🏋️', desc: 'Back, Biceps' },
  { id: 'Legs', name: 'Leg Day', icon: '🦵', desc: 'Quads, Hamstrings, Calves' },
  { id: 'Full', name: 'Full Body', icon: '🔥', desc: 'Full Body Workout' },
  { id: 'Cardio', name: 'Cardio Day', icon: '🏃', desc: 'Running, Cycling, HIIT' },
  { id: 'Rest', name: 'Rest Day', icon: '😴', desc: 'Recovery & Rest' },
];

function DietContent() {
  const { user } = useAuth();
  const [selectedWorkout, setSelectedWorkout] = useState('Push');
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('bn');

  useEffect(() => {
    fetchDietPlan(selectedWorkout);
  }, [selectedWorkout, lang]);

  const fetchDietPlan = async (workoutType) => {
    setLoading(true);
    try {
      const res = await dietAPI.getDietPlan(workoutType, lang);
      setDietPlan(res.data);
    } catch (error) {
      console.error('Error fetching diet plan:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">{lang === 'bn' ? 'বাংলাদেশি ডায়েট প্ল্যান 🇧🇩' : 'Bangladeshi Diet Plan 🇧🇩'}</h1>
          <p className="text-gray-400">{lang === 'bn' ? 'আপনার ওয়ার্কআউট অনুযায়ী খাবার পরিকল্পনা' : 'Meal plan based on your workout'}</p>
        </div>
        <div className="flex items-center gap-2 bg-dark-card p-1 rounded-lg">
          <button
            onClick={() => setLang('bn')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${lang === 'bn' ? 'bg-neon-green text-black' : 'text-gray-400 hover:text-white'}`}
          >
            বাংলা
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${lang === 'en' ? 'bg-neon-green text-black' : 'text-gray-400 hover:text-white'}`}
          >
            English
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {workoutTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedWorkout(type.id)}
            className={`p-4 rounded-xl text-center transition-all ${
              selectedWorkout === type.id
                ? 'bg-neon-green/20 border-2 border-neon-green text-neon-green'
                : 'glass-card hover:bg-dark-card'
            }`}
          >
            <div className="text-2xl mb-1">{type.icon}</div>
            <p className="text-sm font-bold">{type.name}</p>
            <p className="text-xs text-gray-400">{type.desc}</p>
          </button>
        ))}
      </div>

      {dietPlan?.plan && (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 border-l-4 border-neon-green"
          >
            <h3 className="text-xl font-bold mb-2">{dietPlan.plan.name}</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="px-3 py-1 bg-neon-green/20 rounded-full text-neon-green">
                🎯 Goal: {lang === 'bn' ? (dietPlan.goal === 'bulking' ? 'বাল্কিং' : dietPlan.goal === 'cutting' ? 'কাটিং' : 'মেইনটেনেন্স') : dietPlan.goal}
              </span>
              <span className="px-3 py-1 bg-neon-purple/20 rounded-full text-neon-purple">
                ⚖️ Weight: {dietPlan.weight}kg
              </span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(dietPlan.plan)
              .filter(([key]) => key !== 'totals' && key !== 'name')
              .map(([key, meal], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">
                      {key === 'breakfast' ? '🌅' : key === 'lunch' ? '🍛' : key === 'dinner' ? '🌙' : '🍎'}
                    </span>
                    <div>
                      <h4 className="font-bold capitalize">{key}</h4>
                      <p className="text-sm text-neon-green">{meal.name}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{meal.items}</p>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-dark-bg p-2 rounded">
                      <p className="text-neon-green font-bold">{meal.calories}</p>
                      <p className="text-gray-500">kcal</p>
                    </div>
                    <div className="bg-dark-bg p-2 rounded">
                      <p className="text-neon-purple font-bold">{meal.protein}g</p>
                      <p className="text-gray-500">protein</p>
                    </div>
                    <div className="bg-dark-bg p-2 rounded">
                      <p className="text-cyan-400 font-bold">{meal.carbs}g</p>
                      <p className="text-gray-500">carbs</p>
                    </div>
                    <div className="bg-dark-bg p-2 rounded">
                      <p className="text-yellow-400 font-bold">{meal.fats}g</p>
                      <p className="text-gray-500">fats</p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>

          {dietPlan.plan.totals && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 bg-gradient-to-r from-neon-green/10 to-neon-purple/10"
            >
              <h3 className="text-xl font-bold mb-4">{lang === 'bn' ? '📊 দৈনিক মোট' : '📊 Daily Totals'}</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-neon-green">{dietPlan.plan.totals.calories}</p>
                  <p className="text-gray-400">Calories</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-neon-purple">{dietPlan.plan.totals.protein}g</p>
                  <p className="text-gray-400">Protein</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-cyan-400">{dietPlan.plan.totals.carbs}g</p>
                  <p className="text-gray-400">Carbs</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-400">{dietPlan.plan.totals.fats}g</p>
                  <p className="text-gray-400">Fats</p>
                </div>
              </div>
            </motion.div>
          )}

          {dietPlan.tips && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border-l-4 border-neon-purple"
            >
              <h3 className="text-xl font-bold mb-4">{lang === 'bn' ? '💡 টিপস' : '💡 Tips'}</h3>
              <ul className="space-y-2">
                {dietPlan.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-neon-green mt-1">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Diet() {
  return (
    <ProtectedRoute>
      <DietContent />
    </ProtectedRoute>
  );
}