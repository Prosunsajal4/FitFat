const express = require('express');
const router = express.Router();
const { getPRs, getPR, updatePR, deletePR } = require('../controllers/prController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getPRs);
router.get('/:exercise', protect, getPR);
router.post('/', protect, updatePR);
router.delete('/:exercise', protect, deletePR);

module.exports = router;