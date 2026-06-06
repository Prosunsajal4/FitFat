const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  goal: {
    type: String,
    enum: ['bulking', 'cutting', 'maintenance', 'strength', 'fat_loss'],
    default: 'maintenance'
  },
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  stats: {
    streak: { type: Number, default: 0 },
    totalWorkouts: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{ type: String }],
    lastWorkoutDate: { type: Date, default: null },
    weeklyCaloriesBurned: { type: Number, default: 0 }
  },
  body: {
    weight: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    age: { type: Number, default: 0 },
    bodyFat: { type: Number, default: 0 },
    chest: { type: Number, default: 0 },
    arms: { type: Number, default: 0 },
    waist: { type: Number, default: 0 }
  },
  settings: {
    dailyCalorieTarget: { type: Number, default: 2000 },
    proteinTarget: { type: Number, default: 150 },
    waterGoal: { type: Number, default: 8 }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.calculateLevel = function() {
  const xp = this.stats.xp;
  if (xp >= 5001) return 6;
  if (xp >= 2501) return 5;
  if (xp >= 1001) return 4;
  if (xp >= 501) return 3;
  if (xp >= 101) return 2;
  return 1;
};

userSchema.methods.getLevelName = function() {
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Pro', 'Beast', 'Legend'];
  return levels[this.calculateLevel() - 1];
};

module.exports = mongoose.model('User', userSchema);