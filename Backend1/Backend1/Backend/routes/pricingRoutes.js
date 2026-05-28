const express = require('express');
const router = express.Router();
const { setPriceController } = require('../controllers/pricingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getAllPricesController } = require('../controllers/pricingController');

router.post('/set', authMiddleware, roleMiddleware('admin'), setPriceController);
router.get('/all', getAllPricesController);
module.exports = router;