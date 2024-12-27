const express = require('express');
const router = express.Router();
const ExamSessionsController = require('../controllers/examsessionsController');
const { verifyStudent } = require('../middleware/authMiddleware');
require('dotenv').config(); // Ensure environment variables are loaded

// Routes for exam session management

/**
 * @route POST /exam/start
 * @desc Start a new exam session
 * @access Student
 */
router.post('/exam/start', verifyStudent, ExamSessionsController.startSession);

/**
 * @route POST /exam/pause
 * @desc Pause an active exam session
 * @access Student
 */
router.post('/exam/pause', verifyStudent, ExamSessionsController.pauseSession);

/**
 * @route POST /exam/resume
 * @desc Resume a paused exam session
 * @access Student
 */
router.post('/exam/resume', verifyStudent, ExamSessionsController.resumeSession);

/**
 * @route POST /exam/complete
 * @desc Mark an exam session as completed
 * @access Student
 */
router.post('/exam/complete', verifyStudent, ExamSessionsController.completeSession);

/**
 * @route POST /exam/expire
 * @desc Expire active sessions where end_time has passed (manual trigger)
 * @access Student (Optional for cron-like execution)
 */
router.post('/exam/expire', verifyStudent, ExamSessionsController.expireSessions);



/**
 * @route GET /exam/session
 * @desc Fetch active session for a user and assessment
 * @access Student
 */
router.get('/exam/active', verifyStudent, ExamSessionsController.getActiveSession);
router.post('/exam/update-remaining', verifyStudent, ExamSessionsController.updateRemainingTime);
router.post('/exam/end', verifyStudent, ExamSessionsController.endSession);

module.exports = router;





// const express = require('express');
// const router = express.Router();
// const ExamSessionsController = require('../controllers/examsessionsController');
// const bcrypt = require('bcryptjs');
// const { verifyAdmin, verifyStudent  } = require('../middleware/authMiddleware');
// require('dotenv').config();
// // Routes
// router.post('/exam/start', verifyStudent, ExamSessionsController.startSession);
// router.post('/exam/pause', verifyStudent, ExamSessionsController.pauseSession);
// router.post('/exam/resume', verifyStudent, ExamSessionsController.resumeSession);
// router.post('/exam/complete', verifyStudent, ExamSessionsController.completeSession);
// router.post('/exam/expire', verifyStudent, ExamSessionsController.expireSessions); // Optionally run via cron

// module.exports = router;
