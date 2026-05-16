const { getBangladeshiDietPlan } = require('../utils/dietPlan');
const User = require('../models/User');

const getDietPlan = async (req, res) => {
  try {
    const { workoutType } = req.query;
    const user = await User.findById(req.user._id);

    const goal = user?.goal || 'maintenance';
    const weight = user?.body?.weight || 70;

    const plan = getBangladeshiDietPlan(goal, workoutType || 'Push', weight);

    res.json({
      goal,
      weight,
      workoutType,
      plan,
      tips: getDietTips(goal, workoutType)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDietTips = (goal, workoutType) => {
  const tips = {
    bulking: [
      'প্রতিদিন ৫০০ ক্যালোরি বেশি খাও',
      'প্রোটিন বেশি নাও (মাছ, মুরগি, ডিম, দুধ)',
      'ভাতের পরিমাণ বাড়িয়ে দাও',
      'ঘুমানোর আগে দুধ + কলা খাও',
      'দিনে ৩-৪ লিটার পানি খাও'
    ],
    cutting: [
      'ভাতের পরিমাণ কমাও (১ কাপ)',
      'তেল কম ব্যবহার করো',
      'চিনি/মিষ্টি এড়িয়ে চলো',
      'সবজি বেশি খাও',
      'রাতে ভাতের বদলে রুটি খাও'
    ],
    maintenance: [
      'সুষম খাবার খাও',
      'প্রতিদিন ৩ লিটার পানি',
      'নিয়মিত ব্যায়াম করো',
      'পর্যাপ্ত ঘুমাও (৭-৮ ঘণ্টা)',
      'প্রক্রিয়াজাত খাবার এড়িয়ে চলো'
    ]
  };

  return tips[goal] || tips.maintenance;
};

module.exports = { getDietPlan };