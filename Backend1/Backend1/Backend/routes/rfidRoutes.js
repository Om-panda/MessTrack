const express = require('express');
const router = express.Router();
const { receiveScannedCard, getScannedCard, queueRFIDWrite, getPendingWrite } = require( '../controllers/rfidController' );

router.post( '/receive-scan', receiveScannedCard );
router.get( '/get-scan', getScannedCard );
router.post( '/queue-write', queueRFIDWrite );
router.get( '/get-write', getPendingWrite );

module.exports = router;