const Progress = require('../models/Progress');
const User = require('../models/User');

const addProgress = async (req, res) => {
  try {
    const { weight, chest, arms, waist, bodyFat, notes, date } = req.body;

    const progress = await Progress.create({
      user: req.user._id,
      weight,
      chest,
      arms,
      waist,
      bodyFat,
      notes,
      date: date || new Date()
    });

    const user = await User.findById(req.user._id);
    if (user && weight) {
      user.body.weight = weight;
      if (chest) user.body.chest = chest;
      if (arms) user.body.arms = arms;
      if (waist) user.body.waist = waist;
      if (bodyFat) user.body.bodyFat = bodyFat;
      await user.save();
    }

    res.status(201).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProgress = async (req, res) => {
  try {
    const { limit = 30 } = req.query;

    const progress = await Progress.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getLatestProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user._id })
      .sort({ date: -1 });

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProgressChart = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const progress = await Progress.find({
      user: req.user._id,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    const chartData = {
      labels: progress.map(p => new Date(p.date).toLocaleDateString()),
      weight: progress.map(p => p.weight),
      chest: progress.map(p => p.chest),
      arms: progress.map(p => p.arms),
      waist: progress.map(p => p.waist),
      bodyFat: progress.map(p => p.bodyFat)
    };

    res.json(chartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }

    await progress.deleteOne();
    res.json({ message: 'Progress entry removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPredictions = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30);

    if (progress.length < 2) {
      return res.json({
        message: 'Not enough data for predictions',
        predictions: []
      });
    }

    const recentWeight = progress.slice(0, 7);
    const olderWeight = progress.slice(7, 14);

    const recentAvg = recentWeight.reduce((sum, p) => sum + (p.weight || 0), 0) / recentWeight.length;
    const olderAvg = olderWeight.length > 0
      ? olderWeight.reduce((sum, p) => sum + (p.weight || 0), 0) / olderWeight.length
      : recentAvg;

    const weightChange = recentAvg - olderAvg;
    const weeklyTrend = weightChange * 2;

    const predictions = [];

    if (weeklyTrend > 0.5) {
      predictions.push({
        type: 'weight_gain',
        message: `You're gaining approximately ${weeklyTrend.toFixed(1)}kg per week. At this rate, you could gain ${(weeklyTrend * 4).toFixed(1)}kg in a month.`,
        confidence: 'high'
      });
    } else if (weeklyTrend < -0.5) {
      predictions.push({
        type: 'weight_loss',
        message: `You're losing approximately ${Math.abs(weeklyTrend).toFixed(1)}kg per week. At this rate, you could lose ${Math.abs(weeklyTrend * 4).toFixed(1)}kg in a month.`,
        confidence: 'high'
      });
    } else {
      predictions.push({
        type: 'stable',
        message: 'Your weight is relatively stable. Keep up the good work!',
        confidence: 'medium'
      });
    }

    const consistency = await calculateConsistency(req.user._id);
    predictions.push({
      type: 'consistency',
      message: `Your consistency is ${consistency.toFixed(0)}%. ${consistency >= 70 ? 'Great job keeping up with your workouts!' : 'Try to maintain a more regular workout schedule.'}`,
      confidence: 'high'
    });

    res.json({ predictions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const calculateConsistency = async (userId) => {
  const Workout = require('../models/Workout');
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const workouts = await Workout.countDocuments({
    user: userId,
    date: { $gte: thirtyDaysAgo }
  });

  const expectedWorkouts = 12;
  return Math.min((workouts / expectedWorkouts) * 100, 100);
};

module.exports = {
  addProgress,
  getProgress,
  getLatestProgress,
  getProgressChart,
  deleteProgress,
  getPredictions
};