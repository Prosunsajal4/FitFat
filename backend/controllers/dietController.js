const { getBangladeshiDietPlan, getDietTips } = require('../utils/dietPlan');
const User = require('../models/User');

const getDietPlan = async (req, res) => {
  try {
    const { workoutType, lang } = req.query;
    const user = await User.findById(req.user._id);

    const goal = user?.goal || 'maintenance';
    const weight = user?.body?.weight || 70;
    const language = lang === 'en' ? 'en' : 'bn';

    const plan = getBangladeshiDietPlan(goal, workoutType || 'Push', weight, language);

    res.json({
      goal,
      weight,
      workoutType,
      lang: language,
      plan,
      tips: getDietTips(goal, workoutType, language)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDietPlan };