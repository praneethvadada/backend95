const express = require('express');
const assessmentController = require('../controllers/assessmentController');
const router = express.Router();
const { verifyStudent  } = require('../middleware/authMiddleware');

// Routes for assessments
router.get('/live', assessmentController.getLiveAssessments);
router.get('/:assessmentId/rounds', assessmentController.getAssessmentRounds);
router.get('/round/:roundId/questions', assessmentController.getAssessmentQuestions);

router.post('/assessment-coding-question-submit',verifyStudent, assessmentController.submitCode);
router.get('/fetch-code', verifyStudent, assessmentController.fetchCode);
router.post('/save-code', verifyStudent, assessmentController.saveCode);


module.exports = router;
