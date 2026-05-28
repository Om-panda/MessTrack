const express = require('express');
const router = express.Router();
const deviceAuth = require('../middleware/deviceAuthMiddleware');
const { syncStudents } = require('../controllers/syncController');
const { syncBlockedMeals } = require('../controllers/blockSyncController');
const { uploadAttendance } = require('../controllers/attendanceSyncController');


router.get( '/students', deviceAuth, syncStudents );
router.get( '/blocked-meals', deviceAuth, syncBlockedMeals );
router.post( '/attendance', deviceAuth, uploadAttendance );

module.exports = router;