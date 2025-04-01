const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyAdmin, verifyStudent  } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');
const assessmentController = require('../controllers/assessmentController');



router.post('/login', studentController.studentLogin);
router.post('/add-student',verifyAdmin,  studentController.createStudent);

router.post('/bulk-add-students', verifyAdmin, studentController.bulkAddStudents);

router.get('/get-students', verifyAdmin, studentController.getStudents);



router.get('/get/:id', verifyAdmin, studentController.getStudentById);
router.get('/getbyID/:id', verifyStudent, studentController.getStudentById);

router.put('/update/:id',verifyAdmin,  studentController.updateStudent);
router.delete('/delete/:id',verifyAdmin,  studentController.deleteStudent);
router.get('/batch/:batch_id',verifyAdmin,  studentController.getStudentsByBatchId);



router.get('/batch-questions', verifyStudent, studentController.getBatchQuestions);
router.get('/batch-mcq-questions', verifyStudent, studentController.getBatchMCQQuestions);
router.get('/batch-coding-questions', verifyStudent, studentController.getBatchCodingQuestions);
router.get('/college-level-fetch/:college_id', verifyAdmin, studentController.allStudentsByCollegeid);
router.get('/overall-students-fetch', verifyAdmin, studentController.getAllStudents);






router.get('/search-students-collegewise/:college_id', studentController.searchStudentsByCollege);

router.get('/search-students-batchwise/:batch_id', studentController.searchStudentsByBatch);

router.get('/search-all-students', studentController.searchAllStudents);

router.get('/mcq-domains',verifyStudent , adminController.getAllMCQDomains);
router.get('/coding-domains',verifyStudent, adminController.getAllCodingDomains);

// router.get('/mcq-questions/domain/:domain_id', verifyStudent, studentController.getMCQQuestionsByDomainForStudents);
// router.get('/get-coding-questions/domains/:domain_id',verifyStudent, studentController.getCodingQuestionsByDomainForStudents);



router.get('/mcq-questions/domain/:domain_id',verifyStudent,  adminController.getMCQQuestionsByDomain);
router.get('/coding-questions/domain/:domain_id',verifyStudent, adminController.getCodingQuestionsByDomain);
//adminController.getCodingQuestionsByDomain
// router.get('/admin/coding-questions/domain/:domain_id',verifyAdmin, adminController.getCodingQuestionsByDomain);
 
router.post('/practice-coding-question-submit',verifyStudent, studentController.submitCode);

router.post('/submit-answer', verifyStudent, studentController.submitAnswer);
router.post('/mark-question', studentController.toggleMarkQuestion);
router.post('/report-question', studentController.reportQuestion);
router.post('/auto-save-code',verifyStudent , studentController.saveCode);

// getAssessmentQuestionsByRoundId


router.get('/student-get-all-assessments', verifyStudent, studentController.getAllAssessments);
router.get('/student-assessment-rounds/round-ids/:assessment_id', verifyStudent, studentController.getRoundIdsByAssessmentId);
router.get('/assessment-question/round_id/:roundId',verifyStudent, studentController.getAssessmentQuestionsByRoundId);



router.post('/assessment-mcq-question-submit',verifyStudent, assessmentController.submitMcqAnswer);
module.exports = router;