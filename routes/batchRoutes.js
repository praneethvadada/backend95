const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const { verifyAdmin  } = require('../middleware/authMiddleware');

router.post('/add-batch',verifyAdmin,  batchController.createBatch);
router.get('/get-batches', verifyAdmin, batchController.getBatches);

module.exports = router;
