const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { verifyAdmin, verifyTrainer  } = require('../middleware/authMiddleware');


router.post('/add', verifyAdmin, trainerController.createTrainer);
router.post('/login', trainerController.trainerLogin);  // Public route


router.post('/add-mcq-question', verifyTrainer, trainerController.addMCQQuestion);
router.post('/add-coding-question', verifyTrainer, trainerController.addCodingQuestion);

module.exports = router;
