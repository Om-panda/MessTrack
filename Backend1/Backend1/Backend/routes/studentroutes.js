const express = require('express');
const router = express.Router();
const { addStudent, studentReportSelfController } = require('../controllers/studentcontroller');
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/add', authMiddleware, roleMiddleware('admin'), addStudent);
router.post('/my-report', authMiddleware, roleMiddleware('student'), studentReportSelfController);

module.exports = router;