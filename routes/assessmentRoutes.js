const express = require('express');
const assessmentController = require('../controllers/assessmentController');
const router = express.Router();

// Routes for assessments
router.get('/live', assessmentController.getLiveAssessments);
router.get('/:assessmentId/rounds', assessmentController.getAssessmentRounds);
router.get('/round/:roundId/questions', assessmentController.getAssessmentQuestions);

module.exports = router;
