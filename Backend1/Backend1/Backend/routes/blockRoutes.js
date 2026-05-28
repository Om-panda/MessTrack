const express = require('express');
const router = express.Router();
const { blockMealController } = require('../controllers/blockController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/block', authMiddleware, roleMiddleware('student'), blockMealController);

module.exports = router;