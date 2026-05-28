const express = require('express');
const router = express.Router();

const { getTodayMeals, getMonthlyReport } = require('../controllers/catererController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { dashboardController } = require('../controllers/dashboardController');
const { getCatererStudentsController } = require('../controllers/catererController');

router.get( '/today-meals', authMiddleware, roleMiddleware('caterer'), getTodayMeals );
router.post( '/monthly-report', authMiddleware, roleMiddleware('caterer'), getMonthlyReport );
router.get('/students-dashboard', authMiddleware, roleMiddleware('caterer'), dashboardController );
router.get("/students", authMiddleware, roleMiddleware('caterer'), getCatererStudentsController);

module.exports = router;