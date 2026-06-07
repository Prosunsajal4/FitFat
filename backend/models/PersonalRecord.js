const mongoose = require('mongoose');

const personalRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exercise: {
    type: String,
    required: true,
    trim: true
  },
  muscleGroup: {
    type: String,
    default: 'other'
  },
  bestWeight: {
    type: Number,
    default: 0
  },
  bestVolume: {
    type: Number,
    default: 0
  },
  bestReps: {
    type: Number,
    default: 0
  },
  estimated1RM: {
    type: Number,
    default: 0
  },
  lastDate: {
    type: Date,
    default: Date.now
  },
  history: [{
    weight: Number,
    reps: Number,
    sets: Number,
    volume: Number,
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

personalRecordSchema.index({ user: 1, exercise: 1 }, { unique: true });

module.exports = mongoose.model('PersonalRecord', personalRecordSchema);