const express = require('express');
const router = express.Router();
const {
  generateWorkoutPlan,
  chatWithAI,
  getChatHistory,
  clearChatHistory,
  getRecommendations
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/workout-plan', protect, generateWorkoutPlan);
router.post('/chat', protect, chatWithAI);
router.get('/chat', protect, getChatHistory);
router.delete('/chat', protect, clearChatHistory);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;