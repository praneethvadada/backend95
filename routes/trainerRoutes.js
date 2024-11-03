const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { verifyAdmin, verifyTrainer  } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');



router.post('/add', verifyAdmin, trainerController.createTrainer);
router.post('/login', trainerController.trainerLogin);  // Public route

router.get('/fetch-all-Trainers', verifyAdmin, trainerController.getAllTrainers);


router.get('/fetch-Trainer/:id', verifyAdmin, trainerController.fetchtrainerbyid);
router.put('/edit-Trainer/:id', verifyAdmin, trainerController.editTrainer);
router.delete('/delete-Trainer/:id', verifyAdmin, trainerController.deleteTrainers);


router.post('/add-mcq-question', verifyTrainer, trainerController.addMCQQuestion);
router.post('/add-coding-question', verifyTrainer, trainerController.addCodingQuestion);



router.get('/rejected-questions', verifyTrainer, trainerController.getRejectedQuestions);
router.delete('/delete-rejected-coding-question/:question_id', verifyTrainer, trainerController.deleteRejectedCodingQuestion);
router.delete('/delete-rejected-mcq-question/:question_id', verifyTrainer, trainerController.deleteRejectedMCQQuestion);



router.put('/edit-rejected-coding-question/:question_id', verifyTrainer, trainerController.editRejectedCodingQuestionById);
router.put('/edit-rejected-mcq-question/:question_id', verifyTrainer, trainerController.editRejectedMCQQuestionById);
router.get('/approved-questions', verifyTrainer, trainerController.getApprovedQuestions);

router.get('/coding-question/:question_id', verifyTrainer, trainerController.getCodingQuestionById);

router.get('/mcq-question/:question_id', verifyTrainer, trainerController.getMCQQuestionById);





router.post('/request-password-reset-otp', trainerController.requestPasswordResetOTP);
router.post('/reset-password-otp', trainerController.resetPasswordWithOTP);





router.get('/mcq-domains', verifyTrainer, adminController.getAllMCQDomains);
router.get('/coding-domains',verifyTrainer, adminController.getAllCodingDomains);









router.get('/assessments', verifyTrainer, adminController.getAllAssessments);
router.get('/assessment-rounds/round-ids/:assessment_id', verifyAdmin, adminController.getRoundIdsByAssessmentId);


module.exports = router;
