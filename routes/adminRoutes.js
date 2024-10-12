// Routes for admin API
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin, verifyTrainer } = require('../middleware/authMiddleware');
const trainerController = require('../controllers/trainerController');

router.post('/register', adminController.createAdmin);
router.post('/login', adminController.adminLogin);
router.put('/edit/:id',verifyAdmin, adminController.updateAdmin);
router.delete('/delete/:id', verifyAdmin, adminController.deleteAdmin);

//Route to add a new programming languages
router.post('/add-language', verifyAdmin, adminController.addLanguage);


// //Domain Management
router.post('/add-mcq-domain', verifyAdmin, adminController.addMCQDomain);
router.post('/add-coding-domain', verifyAdmin, adminController.addCodingDomain);

router.put('/edit-mcq-domain/:id', verifyAdmin, adminController.editMCQDomain);
router.delete('/delete-mcq-domain/:id', verifyAdmin, adminController.deleteMCQDomain);

router.put('/edit-coding-domain/:id', verifyAdmin, adminController.editCodingDomain);
router.delete('/delete-coding-domain/:id', verifyAdmin, adminController.deleteCodingDomain);


//Approve, Reject Questions
router.post('/update-coding-question-approval-status/:question_id', verifyAdmin, adminController.updateCodingQuestionApprovalStatus);
router.post('/update-mcq-question-approval-status/:question_id', verifyAdmin, adminController.updateMCQQuestionApprovalStatus);



// Fetch coding question by ID (for admin)
router.get('/admin-coding-question/:question_id', verifyAdmin, trainerController.getCodingQuestionById);



// Fetch MCQ question by ID (for admin)
router.get('/admin-mcq-question/:question_id', verifyAdmin, trainerController.getMCQQuestionById);



router.get('/pending-coding-questions', verifyAdmin, adminController.getAllPendingCodingQuestions);
router.get('/pending-mcq-questions', verifyAdmin, adminController.getAllPendingMCQQuestions);

router.post('/add-questions-to-batch/:batch_id', verifyAdmin, adminController.addQuestionsToBatch);
router.post('/remove-questions-from-batch/:batch_id', verifyAdmin, adminController.removeQuestionsFromBatch);



module.exports = router;