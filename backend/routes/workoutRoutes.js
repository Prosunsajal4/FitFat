const express = require('express');
const router = express.Router();
const {
  createWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats
} = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getWorkouts)
  .post(protect, createWorkout);

router.route('/stats').get(protect, getWorkoutStats);

router.route('/:id')
  .get(protect, getWorkout)
  .put(protect, updateWorkout)
  .delete(protect, deleteWorkout);

module.exports = router;