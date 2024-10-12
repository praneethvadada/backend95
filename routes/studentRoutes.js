const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyAdmin, verifyStudent  } = require('../middleware/authMiddleware');


router.post('/login', studentController.studentLogin);
router.post('/add-student',verifyAdmin,  studentController.createStudent);
router.get('/get-students', verifyAdmin, studentController.getStudents);
router.get('/get/:id', studentController.getStudentById);
router.put('/update/:id', studentController.updateStudent);
router.delete('/delete/:id', studentController.deleteStudent);
router.get('/batch/:batch_id', studentController.getStudentsByBatchId);
router.get('/batch-questions', verifyStudent, studentController.getBatchQuestions);

module.exports = router;
