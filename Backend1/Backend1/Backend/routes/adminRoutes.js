const express = require('express');
const router = express.Router();
const { adminDashboard, searchStudentController, updateStudentController, 
    deleteStudentController, studentReportController,getStudentsListController, getCaterersController } = require('../controllers/adminController');

const { addCaterer, deleteCaterer } = require('../controllers/catererController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');






router.post('/dashboard', authMiddleware, roleMiddleware('admin'), adminDashboard);
router.post('/search-student',authMiddleware,roleMiddleware('admin'),searchStudentController);
router.put('/update-student',authMiddleware,roleMiddleware('admin'),updateStudentController);
router.delete("/delete-student", authMiddleware, roleMiddleware('admin'), deleteStudentController);
router.post( '/student-report', authMiddleware, roleMiddleware('admin'), studentReportController );
router.post("/students-list", authMiddleware,roleMiddleware('admin'), getStudentsListController);
router.get("/caterers", authMiddleware, roleMiddleware('admin'), getCaterersController);
router.post('/add-caterer', authMiddleware, roleMiddleware('admin'), addCaterer);
router.delete('/delete-caterer', authMiddleware, roleMiddleware('admin'), deleteCaterer);


module.exports = router;