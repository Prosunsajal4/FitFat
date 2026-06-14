import { useState } from 'react';
import { motion } from 'framer-motion';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import DBStatusBanner from '../components/DBStatusBanner';

function AIWorkoutContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState({
    goal: user?.goal || 'maintenance',
    weight: user?.body?.weight || 70,
    height: user?.body?.height || 170,
    age: user?.body?.age || 25,
    experience: user?.experience || 'beginner',
    equipment: 'full gym',
  });

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await aiAPI.generateWorkoutPlan(formData);
      setPlan(res.data.plan);
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGoalDescription = (goal) => {
    const descriptions = {
      bulking: 'Build muscle mass and increase strength',
      cutting: 'Burn fat while preserving muscle',
      strength: 'Increase maximum strength',
      fat_loss: 'Lose body fat through exercise',
      maintenance: 'Keep current fitness level',
    };
    return descriptions[goal] || '';
  };

  return (
    <div className="space-y-6">
      <DBStatusBanner />
      <div>
        <h1 className="text-3xl font-heading font-bold">AI Workout Generator</h1>
        <p className="text-gray-400">Get a personalized workout plan based on your goals</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-heading font-bold mb-4">Your Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Goal</label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                className="w-full px-4 py-2 rounded-lg"
              >
                <option value="bulking">💪 Muscle Building (Bulking)</option>
                <option value="cutting">🔥 Fat Loss (Cutting)</option>
                <option value="strength">🏋️ Strength Training</option>
                <option value="fat_loss">📉 Fat Loss</option>
                <option value="maintenance">⚖️ Maintenance</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">{getGoalDescription(formData.goal)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg"
                />
              </div>
              <div>
              <label className="block text-gray-400 mb-2">Experience</label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-2 rounded-lg"
              >
                <option value="beginner">🌱 Beginner</option>
                <option value="intermediate">🌿 Intermediate</option>
                <option value="advanced">🌳 Advanced</option>
              </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Equipment Available</label>
              <select
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                className="w-full px-4 py-2 rounded-lg"
              >
                <option value="full gym">Full Gym</option>
                <option value="dumbbells only">Dumbbells Only</option>
                <option value="home gym">Home Gym</option>
                <option value="bodyweight">Bodyweight Only</option>
              </select>
            </div>

            <button
              onClick={generatePlan}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-neon-green to-neon-purple text-black font-bold rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Generating...
                </span>
              ) : (
                '🤖 Generate AI Plan'
              )}
            </button>
          </div>
        </motion.div>

        <div className="lg:col-span-2">
          {plan ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="glass-card p-6 border-l-4 border-neon-green">
                <h3 className="text-xl font-heading font-bold mb-2">Your 7-Day Workout Plan</h3>
                <p className="text-gray-400 text-sm">
                  Goal: {formData.goal} | Level: {formData.experience}
                </p>
              </div>

              {plan.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card p-4 ${
                    day.exercises.length === 0 ? 'border-l-4 border-gray-600' : 'border-l-4 border-neon-purple'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-neon-purple">{day.day}</h4>
                    {day.exercises.length === 0 && (
                      <span className="text-gray-500 text-sm">Rest Day</span>
                    )}
                  </div>

                  {day.exercises.length > 0 && (
                    <div className="space-y-2">
                      {day.exercises.map((ex, i) => (
                        <div key={i} className="flex items-center justify-between bg-dark-bg p-3 rounded-lg">
                          <div>
                            <p className="font-medium">{ex.name}</p>
                            <p className="text-sm text-gray-400">{ex.notes}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-neon-green font-bold">{ex.sets} × {ex.reps}</p>
                            <p className="text-xs text-gray-500">{ex.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="glass-card p-12 text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-heading font-bold mb-2">AI Workout Generator</h3>
              <p className="text-gray-400 mb-4">
                Fill in your profile information and let AI create a personalized workout plan for you!
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="px-3 py-1 bg-dark-bg rounded-full">📊 Personalized</span>
                <span className="px-3 py-1 bg-dark-bg rounded-full">🎯 Goal-based</span>
                <span className="px-3 py-1 bg-dark-bg rounded-full">💪 Science-backed</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AIWorkout() {
  return (
    <ProtectedRoute>
      <AIWorkoutContent />
    </ProtectedRoute>
  );
}