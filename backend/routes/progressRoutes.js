const express = require('express');
const router = express.Router();
const {
  addProgress,
  getProgress,
  getLatestProgress,
  getProgressChart,
  deleteProgress,
  getPredictions
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getProgress)
  .post(protect, addProgress);

router.get('/latest', protect, getLatestProgress);
router.get('/chart', protect, getProgressChart);
router.get('/predictions', protect, getPredictions);
router.delete('/:id', protect, deleteProgress);

module.exports = router;