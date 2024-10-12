const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyAdmin  } = require('../middleware/authMiddleware');

router.post('/add-student',verifyAdmin,  studentController.createStudent);
router.get('/get-students', verifyAdmin, studentController.getStudents);
router.get('/get/:id', studentController.getStudentById);
router.put('/update/:id', studentController.updateStudent);
router.delete('/delete/:id', studentController.deleteStudent);
router.get('/batch/:batch_id', studentController.getStudentsByBatchId);

module.exports = router;
