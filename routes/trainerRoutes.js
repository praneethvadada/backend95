const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { verifyAdmin, verifyTrainer  } = require('../middleware/authMiddleware');


router.post('/add', verifyAdmin, trainerController.createTrainer);
router.post('/login', trainerController.trainerLogin);  // Public route


router.post('/add-mcq-question', verifyTrainer, trainerController.addMCQQuestion);
router.post('/add-coding-question', verifyTrainer, trainerController.addCodingQuestion);



router.get('/rejected-questions', verifyTrainer, trainerController.getRejectedQuestions);
router.delete('/delete-rejected-coding-question/:question_id', verifyTrainer, trainerController.deleteRejectedCodingQuestion);
router.delete('/delete-rejected-mcq-question/:question_id', verifyTrainer, trainerController.deleteRejectedMCQQuestion);


router.put('/edit-rejected-coding-question/:question_id', verifyTrainer, trainerController.editRejectedCodingQuestionById);
router.put('/edit-rejected-mcq-question/:question_id', verifyTrainer, trainerController.editRejectedMCQQuestionById);
router.get('/approved-questions', verifyTrainer, trainerController.getApprovedQuestions);

// Fetch coding question by ID (for trainer)
router.get('/coding-question/:question_id', verifyTrainer, trainerController.getCodingQuestionById);

// Fetch MCQ question by ID (for trainer)
router.get('/mcq-question/:question_id', verifyTrainer, trainerController.getMCQQuestionById);

module.exports = router;
