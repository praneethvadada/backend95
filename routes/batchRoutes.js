const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const { verifyAdmin  } = require('../middleware/authMiddleware');

router.post('/add-batch',verifyAdmin,  batchController.createBatch);
router.get('/get-batches', verifyAdmin, batchController.getBatches);
router.get('/get/:id', batchController.getBatchById);
router.put('/update/:id', batchController.updateBatch);
router.delete('/delete/:id', batchController.deleteBatch);
router.get('/batchesbycollegeid/:college_id', verifyAdmin, batchController.getBatchesByCollegeId);


module.exports = router;
