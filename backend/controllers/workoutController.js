const Workout = require('../models/Workout');
const User = require('../models/User');
const PersonalRecord = require('../models/PersonalRecord');

const createWorkout = async (req, res) => {
  try {
    const { name, exercises, date } = req.body;

    const workout = await Workout.create({
      user: req.user._id,
      name,
      exercises: exercises || [],
      date: date || new Date()
    });

    await updateUserStats(req.user._id);

    for (const ex of (exercises || [])) {
      if (ex.name && ex.weight > 0) {
        try {
          const pr = await PersonalRecord.findOne({ user: req.user._id, exercise: ex.name });
          if (!pr || ex.weight > pr.bestWeight) {
            const volume = ex.sets * ex.reps * ex.weight;
            const estimated1RM = ex.reps === 1 ? ex.weight : Math.round(ex.weight * (1 + ex.reps / 30));
            if (pr) {
              pr.bestWeight = ex.weight;
              if (volume > pr.bestVolume) pr.bestVolume = volume;
              if (ex.reps > pr.bestReps) pr.bestReps = ex.reps;
              if (estimated1RM > pr.estimated1RM) pr.estimated1RM = estimated1RM;
              pr.history.push({ weight: ex.weight, reps: ex.reps, sets: ex.sets, volume, date: new Date() });
              pr.lastDate = new Date();
              await pr.save();
            } else {
              await PersonalRecord.create({
                user: req.user._id,
                exercise: ex.name,
                muscleGroup: ex.muscleGroup || 'other',
                bestWeight: ex.weight,
                bestVolume: volume,
                bestReps: ex.reps,
                estimated1RM,
                lastDate: new Date(),
                history: [{ weight: ex.weight, reps: ex.reps, sets: ex.sets, volume, date: new Date() }]
              });
            }
          }
        } catch (prErr) {}
      }
    }

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getWorkouts = async (req, res) => {
  try {
    const { limit = 20, page = 1, startDate, endDate } = req.query;

    const query = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const workouts = await Workout.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Workout.countDocuments(query);

    res.json({
      workouts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    workout.name = req.body.name || workout.name;
    workout.exercises = req.body.exercises || workout.exercises;
    workout.duration = req.body.duration || workout.duration;

    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    await workout.deleteOne();
    res.json({ message: 'Workout removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getWorkoutStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyWorkouts = await Workout.find({
      user: req.user._id,
      date: { $gte: startOfWeek }
    });

    const totalWorkouts = await Workout.countDocuments({ user: req.user._id });

    const muscleGroups = {
      chest: 0,
      back: 0,
      legs: 0,
      shoulders: 0,
      arms: 0,
      core: 0,
      other: 0
    };

    const allWorkouts = await Workout.find({ user: req.user._id }).sort({ date: -1 }).limit(50);

    allWorkouts.forEach(workout => {
      workout.exercises.forEach(ex => {
        const muscle = (ex.muscleGroup || 'other').toLowerCase();
        if (muscleGroups[muscle] !== undefined) {
          muscleGroups[muscle] += ex.sets * ex.reps;
        } else {
          muscleGroups.other += ex.sets * ex.reps;
        }
      });
    });

    const weeklyCalories = weeklyWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

    const lastWorkout = await Workout.findOne({ user: req.user._id }).sort({ date: -1 });

    const workoutFrequency = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await Workout.countDocuments({
        user: req.user._id,
        date: { $gte: date, $lt: nextDate }
      });
      workoutFrequency.push({ date: date.toISOString().split('T')[0], count });
    }

    res.json({
      totalWorkouts,
      weeklyWorkouts: weeklyWorkouts.length,
      weeklyCalories,
      muscleGroups,
      lastWorkoutDate: lastWorkout?.date,
      workoutFrequency,
      userStats: user.stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserStats = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const allWorkouts = await Workout.find({ user: userId }).sort({ date: -1 }).limit(2);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (allWorkouts.length > 0) {
    const mostRecent = new Date(allWorkouts[0].date);
    mostRecent.setHours(0, 0, 0, 0);
    const dayDiffFromMostRecent = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));

    if (allWorkouts.length >= 2) {
      const secondRecent = new Date(allWorkouts[1].date);
      secondRecent.setHours(0, 0, 0, 0);
      const gapBetween = Math.floor((mostRecent - secondRecent) / (1000 * 60 * 60 * 24));

      if (dayDiffFromMostRecent === 0) {
        if (gapBetween === 1) {
          user.stats.streak = (user.stats.streak || 0) + 1;
        } else {
          user.stats.streak = Math.max(user.stats.streak || 0, 1);
        }
      } else if (dayDiffFromMostRecent === 1) {
        user.stats.streak = (user.stats.streak || 0) + 1;
      } else if (dayDiffFromMostRecent > 1) {
        user.stats.streak = 1;
      }
    } else {
      if (dayDiffFromMostRecent === 0) {
        user.stats.streak = Math.max(user.stats.streak || 0, 1);
      } else if (dayDiffFromMostRecent === 1) {
        user.stats.streak = (user.stats.streak || 0) + 1;
      } else {
        user.stats.streak = 1;
      }
    }

    if ((user.stats.streak || 0) > (user.stats.bestStreak || 0)) {
      user.stats.bestStreak = user.stats.streak;
    }

    user.stats.lastWorkoutDate = allWorkouts[0].date;
  }

  user.stats.totalWorkouts = await Workout.countDocuments({ user: userId });
  user.stats.xp = user.stats.totalWorkouts * 50 + (user.stats.streak || 0) * 20;
  user.stats.level = user.calculateLevel();

  checkAndAwardBadges(user);

  await user.save();
};

const checkAndAwardBadges = async (user) => {
  const badges = user.stats.badges || [];

  if (user.stats.streak >= 7 && !badges.includes('7-day-streak')) {
    badges.push('7-day-streak');
  }

  if (user.stats.totalWorkouts >= 30 && !badges.includes('30-workouts')) {
    badges.push('30-workouts');
  }

  if (user.stats.totalWorkouts >= 10 && !badges.includes('first-10-workouts')) {
    badges.push('first-10-workouts');
  }

  user.stats.badges = badges;
};

module.exports = {
  createWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats
};