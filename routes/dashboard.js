const express = require('express');
const { getDashboardData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/stats', protect, getDashboardData);

module.exports = router;
