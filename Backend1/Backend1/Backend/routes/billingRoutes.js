const express = require('express');
const router = express.Router();
const { calculateBillController, getMyBillController } = require('../controllers/billingController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post( '/calculate', authMiddleware, roleMiddleware('admin'), calculateBillController );
router.post( '/my-bill', authMiddleware, roleMiddleware('student'), getMyBillController );
module.exports = router;