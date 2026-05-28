const express = require('express');
const router = express.Router();
const { markAttendanceController } = require('../controllers/attendanceController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/mark', authMiddleware, roleMiddleware('student'), markAttendanceController);
module.exports = router;