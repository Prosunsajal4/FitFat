const calculateCalories = (weightKg, heightCm, age, gender, activity = 'moderate') => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const tdee = gender === 'male' ? base + 5 : base - 161;
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extreme: 1.9,
  };
  return Math.round(tdee * (multipliers[activity] || 1.55));
};

const calculateMacros = (calories, goal = 'maintain') => {
  const ratios = {
    lose: { protein: 0.35, carbs: 0.35, fat: 0.30 },
    maintain: { protein: 0.30, carbs: 0.40, fat: 0.30 },
    gain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
    muscle: { protein: 0.35, carbs: 0.40, fat: 0.25 },
  };
  const r = ratios[goal] || ratios.maintain;
  return {
    protein: Math.round((calories * r.protein) / 4),
    carbs: Math.round((calories * r.carbs) / 4),
    fat: Math.round((calories * r.fat) / 9),
    calories,
  };
};

module.exports = { calculateCalories, calculateMacros };
