const Nutrition = require('../models/Nutrition');
const User = require('../models/User');

const getTodayNutrition = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let nutrition = await Nutrition.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (!nutrition) {
      nutrition = await Nutrition.create({
        user: req.user._id,
        date: today,
        meals: [],
        waterIntake: 0
      });
    }

    const user = await User.findById(req.user._id);
    const targets = user?.settings || { dailyCalorieTarget: 2000, proteinTarget: 150, waterGoal: 8 };

    res.json({
      ...nutrition.toObject(),
      targets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addMeal = async (req, res) => {
  try {
    const { type, name, calories, protein, carbs, fats } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let nutrition = await Nutrition.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (!nutrition) {
      nutrition = await Nutrition.create({
        user: req.user._id,
        date: today,
        meals: [],
        waterIntake: 0
      });
    }

    nutrition.meals.push({
      type,
      name,
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0
    });

    await nutrition.save();

    res.status(201).json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateWater = async (req, res) => {
  try {
    const { waterIntake } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let nutrition = await Nutrition.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (!nutrition) {
      nutrition = await Nutrition.create({
        user: req.user._id,
        date: today,
        meals: [],
        waterIntake: waterIntake || 0
      });
    } else {
      nutrition.waterIntake = waterIntake;
      await nutrition.save();
    }

    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getNutritionHistory = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const nutrition = await Nutrition.find({
      user: req.user._id,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTargets = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.settings.dailyCalorieTarget = req.body.dailyCalorieTarget || user.settings.dailyCalorieTarget;
      user.settings.proteinTarget = req.body.proteinTarget || user.settings.proteinTarget;
      user.settings.waterGoal = req.body.waterGoal || user.settings.waterGoal;

      await user.save();
      res.json(user.settings);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getWeeklyStats = async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    const nutrition = await Nutrition.find({
      user: req.user._id,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayData = nutrition.find(n =>
        new Date(n.date).toDateString() === date.toDateString()
      );

      dailyData.push({
        date: date.toISOString().split('T')[0],
        calories: dayData?.totalCalories || 0,
        protein: dayData?.totalProtein || 0,
        carbs: dayData?.totalCarbs || 0,
        fats: dayData?.totalFats || 0
      });
    }

    const totals = dailyData.reduce((acc, day) => ({
      calories: acc.calories + day.calories,
      protein: acc.protein + day.protein,
      carbs: acc.carbs + day.carbs,
      fats: acc.fats + day.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    res.json({
      daily: dailyData,
      averages: {
        calories: Math.round(totals.calories / 7),
        protein: Math.round(totals.protein / 7),
        carbs: Math.round(totals.carbs / 7),
        fats: Math.round(totals.fats / 7)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteMeal = async (req, res) => {
  try {
    const { mealId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nutrition = await Nutrition.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (!nutrition) return res.status(404).json({ message: 'No nutrition data found' });

    nutrition.meals = nutrition.meals.filter(m => m._id.toString() !== mealId);
    await nutrition.save();

    res.json(nutrition);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTodayNutrition,
  addMeal,
  updateWater,
  getNutritionHistory,
  updateTargets,
  getWeeklyStats,
  deleteMeal
};