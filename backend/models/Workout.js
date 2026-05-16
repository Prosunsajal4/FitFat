const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  notes: { type: String, default: '' },
  muscleGroup: { type: String, default: 'other' }
}, { _id: true });

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  exercises: [exerciseSchema],
  totalVolume: {
    type: Number,
    default: 0
  },
  caloriesBurned: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['completed', 'in_progress', 'planned'],
    default: 'completed'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

workoutSchema.pre('save', function(next) {
  let totalVolume = 0;
  this.exercises.forEach(exercise => {
    totalVolume += exercise.sets * exercise.reps * (exercise.weight || 0);
  });
  this.totalVolume = totalVolume;
  this.caloriesBurned = Math.round(totalVolume / 100) + 50;
  next();
});

workoutSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema);