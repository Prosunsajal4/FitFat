const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    default: 0
  },
  chest: {
    type: Number,
    default: 0
  },
  arms: {
    type: Number,
    default: 0
  },
  waist: {
    type: Number,
    default: 0
  },
  bodyFat: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  photos: {
    front: { type: String, default: '' },
    side: { type: String, default: '' },
    back: { type: String, default: '' }
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

progressSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Progress', progressSchema);