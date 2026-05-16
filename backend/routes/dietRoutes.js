const express = require('express');
const router = express.Router();
const { getDietPlan } = require('../controllers/dietController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getDietPlan);

module.exports = router;