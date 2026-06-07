const express = require('express');
const router = express.Router();
const {
  getTodayNutrition,
  addMeal,
  updateWater,
  getNutritionHistory,
  updateTargets,
  getWeeklyStats,
  deleteMeal
} = require('../controllers/nutritionController');
const { protect } = require('../middleware/auth');

router.get('/today', protect, getTodayNutrition);
router.post('/meal', protect, addMeal);
router.delete('/meal/:mealId', protect, deleteMeal);
router.put('/water', protect, updateWater);
router.get('/history', protect, getNutritionHistory);
router.put('/targets', protect, updateTargets);
router.get('/weekly', protect, getWeeklyStats);

module.exports = router;