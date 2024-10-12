const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { BatchPracticeQuestion, CodingQuestion, MCQQuestion, Student, Batch} = require('../models');
const db = require('../models');




// Controller to create a new student
exports.createStudent = async (req, res) => {
  const { name, email, password, batch_id } = req.body;

  try {
    // Check if the email already exists
    const existingStudent = await Student.findOne({ where: { email } });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new student
    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      batch_id,
    });

    res.status(201).json({
      message: 'Student created successfully',
      student,
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      message: 'Error creating student',
      error,
    });
  }
};

// // Add a new student
// exports.createStudent = async (req, res) => {
//   try {
//     const { name, email,        hashedPassword = await bcrypt.hash(password, 10), batch_id } = req.body;

//     // Check if batch exists before creating a student
//     const batch = await Batch.findByPk(batch_id);
//     if (!batch) {
//       return res.status(404).json({ message: 'Batch not found' });
//     }

//     // Create the student
//     const student = await Student.create({ name, email,password: hashedPassword, batch_id });
//     res.status(201).json({ message: 'Student created successfully', student });
//   } catch (error) {
//     console.error('Error creating student:', error);
//     res.status(500).json({ message: 'Error creating student', error });
//   }
// };

// Fetch all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [{ model: Batch, attributes: ['name'] }]
    });
    res.status(200).json({ message: 'Students fetched successfully', students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error });
  }
};

// Fetch student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
      include: [{ model: Batch, attributes: ['name'] }]
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student fetched successfully', student });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Error fetching student', error });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await student.update({ name, email, password });
    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student', error });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', error });
  }
};


exports.getStudentsByBatchId = async (req, res) => {
  try {
    const { batch_id } = req.params;

    // Find the batch by ID
    const batch = await Batch.findByPk(batch_id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Find all students in the batch
    const students = await Student.findAll({
      where: { batch_id },
      include: [{ model: Batch, attributes: ['name'] }]  // No reference to college_id here
    });

    res.status(200).json({ message: 'Students fetched successfully', students });
  } catch (error) {
    console.error('Error fetching students by batch:', error);
    res.status(500).json({ message: 'Error fetching students by batch', error });
  }
};



// // Controller for Student Login
// exports.studentLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the student by email
//     const student = await Student.findOne({ where: { email } });
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     // Check password
//     const passwordIsValid = bcrypt.compareSync(password, student.password);
//     if (!passwordIsValid) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: student.id, email: student.email, role: 'student' },
//       process.env.STUDENT_JWT_SECRET,
//       { expiresIn: '1h' } // Token expires in 1 hour
//     );

//     res.status(200).json({
//       message: 'Student login successful',
//       token,
//     });
//   } catch (error) {
//     console.error('Error during student login:', error);
//     res.status(500).json({ message: 'Internal server error', error });
//   }
// };



// exports.studentLogin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const student = await Student.findOne({ where: { email } });
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     const isMatch = await bcrypt.compare(password, student.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     const token = jwt.sign({ id: student.id, role: 'student' }, process.env.STUDENT_JWT_SECRET, { expiresIn: '1h' });

//     res.status(200).json({ message: 'Login successful', token });
//   } catch (error) {
//     console.error('Error during student login:', error);
//     res.status(500).json({ message: 'Server error during student login', error });
//   }
// };



// Student login
exports.studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student by email
    const student = await Student.findOne({ where: { email } });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Add batch_id to the token payload
    const tokenPayload = {
      id: student.id,
      email: student.email,
      batch_id: student.batch_id,  // Include batch_id here
      role: 'student'
    };

    // Generate JWT token
    const token = jwt.sign(tokenPayload, process.env.STUDENT_JWT_SECRET, { expiresIn: '1h' });

    // Send token back to client
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during student login:', error);
    res.status(500).json({ message: 'Error during student login', error });
  }
};


// // Fetch questions for a student based on their batch
// exports.getBatchQuestions = async (req, res) => {
//   try {
//     const studentId = req.user.id; // Assuming req.user contains the logged-in student's data
//     const studentBatchId = req.user.batch_id; // Assuming batch_id is available in req.user

//     // Find all questions (both coding and mcq) for this student's batch
//     const batchQuestions = await BatchPracticeQuestions.findAll({
//       where: { batch_id: studentBatchId },
//       include: [
//         {
//           model: CodingQuestion,
//           attributes: ['id', 'title', 'description', 'difficulty', 'createdAt'],
//         },
//         {
//           model: MCQQuestion,
//           attributes: ['id', 'title', 'description', 'difficulty', 'createdAt'],
//         }
//       ]
//     });

//     if (!batchQuestions || batchQuestions.length === 0) {
//       return res.status(404).json({ message: 'No questions found for this batch' });
//     }

//     res.status(200).json({ message: 'Questions fetched successfully', batchQuestions });
//   } catch (error) {
//     console.error('Error fetching batch questions:', error);
//     res.status(500).json({ message: 'Error fetching batch questions', error });
//   }
// };



// const { BatchPracticeQuestions, CodingQuestion, MCQQuestion } = require('../models');

// Fetch questions for a student based on their batch
// exports.getBatchQuestions = async (req, res) => {
//   try {
//     const studentId = req.user.id; // Assuming req.user contains the logged-in student's data
//     const studentBatchId = req.user.batch_id; // Assuming batch_id is available in req.user

//     console.log(`Student ID: ${studentId}`);
//     console.log(`Batch ID: ${studentBatchId}`);

//     if (!studentBatchId) {
//       return res.status(400).json({ message: 'Batch ID not found for the student' });
//     }

//     // Find all questions (both coding and mcq) for this student's batch
//     const batchQuestions = await BatchPracticeQuestions.findAll({
//       where: { batch_id: studentBatchId },
//       include: [
//         {
//           model: CodingQuestion,
//           attributes: ['id', 'title', 'description', 'difficulty', 'createdAt'],
//         },
//         {
//           model: MCQQuestion,
//           attributes: ['id', 'title', 'description', 'difficulty', 'createdAt'],
//         }
//       ]
//     });

//     console.log('Batch questions:', batchQuestions);

//     if (!batchQuestions || batchQuestions.length === 0) {
//       return res.status(404).json({ message: 'No questions found for this batch' });
//     }

//     res.status(200).json({ message: 'Questions fetched successfully', batchQuestions });
//   } catch (error) {
//     console.error('Error fetching batch questions:', error);
//     res.status(500).json({ message: 'Error fetching batch questions', error });
//   }
// };

// exports.getBatchQuestions = async (req, res) => {
//   try {
//     const studentId = req.user.id; // Extract student ID from the decoded JWT token
//     const batchId = req.user.batch_id; // Extract batch ID from the decoded token

//     console.log(`Student ID: ${studentId}`);
//     console.log(`Batch ID: ${batchId}`);
//     console.log(db.BatchPracticeQuestion);  // Check if it's defined properly


//     // Find questions assigned to the batch
//     const batchQuestions = await BatchPracticeQuestion.findAll({
//       where: { batch_id: batchId },
//       include: [
//         // {
//         //   model: CodingQuestion,
//         //   attributes: ['id', 'title', 'description', 'difficulty'], // Select relevant fields
//         // },
//         // {
//         //   model: MCQQuestion,
//         //   attributes: ['id', 'title', 'description', 'difficulty'], // Select relevant fields
//         // },
//         { model: db.CodingQuestion, as: 'codingQuestion' },
//     { model: db.MCQQuestion, as: 'mcqQuestion' }
//       ],
//     });

//     if (!batchQuestions || batchQuestions.length === 0) {
//       return res.status(404).json({ message: 'No questions found for this batch' });
//     }

//     res.status(200).json({ message: 'Batch questions fetched successfully', batchQuestions });
//   } catch (error) {
    
//     console.error('Error fetching batch questions:', error);
//     res.status(500).json({ message: 'Error fetching batch questions', error });
//   }
// };


// exports.getBatchQuestions = async (req, res) => {
//   try {
//     const studentId = req.user.id;
    
//     // Fetch the student's batch ID
//     const student = await Student.findByPk(studentId);
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     const batchId = student.batch_id;
//     console.log('Student ID:', studentId);
//     console.log('Batch ID:', batchId);

//     // Fetch batch practice questions and join with actual questions
//     const batchPracticeQuestions = await BatchPracticeQuestion.findAll({
//       where: { batch_id: batchId },
//       include: [
//         {
//           model: CodingQuestion,
//           as: 'coding_question',
//           attributes: ['id', 'title', 'description', 'difficulty']  // Select the fields you want from CodingQuestion
//         },
//         {
//           model: MCQQuestion,
//           as: 'mcq_question',
//           attributes: ['id', 'title', 'description', 'difficulty']  // Select the fields you want from MCQQuestion
//         }
//       ]
//     });

//     if (!batchPracticeQuestions || batchPracticeQuestions.length === 0) {
//       return res.status(404).json({ message: 'No questions found for this batch' });
//     }

//     res.status(200).json({
//       message: 'Batch questions fetched successfully',
//       batchPracticeQuestions
//     });
//   } catch (error) {
//     console.error('Error fetching batch questions:', error);
//     res.status(500).json({ message: 'Error fetching batch questions', error });
//   }
// };


// exports.getBatchQuestions = async (req, res) => {
//   try {
//     const studentId = req.user.id;
//     const student = await db.Student.findByPk(studentId);

//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     const batchId = student.batch_id;

//     // Fetch batch practice questions based on the student's batch
//     const batchPracticeQuestions = await BatchPracticeQuestion.findAll({
//       where: { batch_id: batchId },
//       include: [
//         { model: CodingQuestion, as: 'codingQuestion' },  // Including coding questions
//         { model: MCQQuestion, as: 'mcqQuestion' }  // Including mcq questions
//       ]
//     });

//     res.status(200).json({
//       message: 'Batch questions fetched successfully',
//       batchPracticeQuestions
//     });
//   } catch (error) {
//     console.error('Error fetching batch questions:', error);
//     res.status(500).json({
//       message: 'Error fetching batch questions',
//       error
//     });
//   }
// };



// exports.getBatchQuestions = async (req, res) => {
//   try {
//     const studentId = req.user.id;  // Get student ID from JWT payload
//     const student = await Student.findByPk(studentId);  // Fetch student details

//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     const batchId = student.batch_id;  // Get batch ID of the student

//     // Fetch batch practice questions based on the student's batch
//     const batchPracticeQuestions = await BatchPracticeQuestion.findAll({
//       where: { batch_id: batchId },
//       include: [
//         { model: CodingQuestion },  // Include coding questions
//         { model: MCQQuestion }  // Include mcq questions
//       ]
//     });

//     res.status(200).json({
//       message: 'Batch questions fetched successfully',
//       batchPracticeQuestions
//     });
//   } catch (error) {
//     console.error('Error fetching batch questions:', error);
//     res.status(500).json({
//       message: 'Error fetching batch questions',
//       error
//     });
//   }
// };



exports.getBatchQuestions = async (req, res) => {
  try {
    const studentId = req.user.id;  // Get student ID from JWT payload
    const student = await Student.findByPk(studentId);  // Fetch student details

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const batchId = student.batch_id;  // Get batch ID of the student

    // Fetch batch practice questions based on the student's batch
    const batchPracticeQuestions = await BatchPracticeQuestion.findAll({
      where: { batch_id: batchId },
      include: [
        { model: CodingQuestion, as: 'codingQuestion' },  // Include coding questions
        { model: MCQQuestion, as: 'mcqQuestion' }  // Include MCQ questions
      ]
    });

    if (!batchPracticeQuestions.length) {
      return res.status(404).json({ message: 'No questions found for this batch' });
    }

    res.status(200).json({
      message: 'Batch questions fetched successfully',
      batchPracticeQuestions
    });
  } catch (error) {
    console.error('Error fetching batch questions:', error);
    res.status(500).json({
      message: 'Error fetching batch questions',
      error
    });
  }
};
