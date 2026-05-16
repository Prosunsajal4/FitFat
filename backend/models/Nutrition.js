const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    default: 0
  },
  protein: {
    type: Number,
    default: 0
  },
  carbs: {
    type: Number,
    default: 0
  },
  fats: {
    type: Number,
    default: 0
  }
}, { _id: true });

const nutritionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  meals: [mealSchema],
  waterIntake: {
    type: Number,
    default: 0
  },
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFats: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

nutritionSchema.pre('save', function(next) {
  this.totalCalories = this.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  this.totalProtein = this.meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  this.totalCarbs = this.meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  this.totalFats = this.meals.reduce((sum, meal) => sum + (meal.fats || 0), 0);
  next();
});

nutritionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Nutrition', nutritionSchema);