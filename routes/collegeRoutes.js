const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/collegeController');
const { verifyAdmin  } = require('../middleware/authMiddleware');

router.post('/add-college', verifyAdmin, collegeController.createCollege);
router.get('/get-colleges',verifyAdmin, collegeController.getColleges);
router.get('/get/:id', collegeController.getCollegeById);
router.put('/update/:id', collegeController.updateCollege);
router.delete('/delete/:id', collegeController.deleteCollege);

module.exports = router;
