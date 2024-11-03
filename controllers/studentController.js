const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {StudentMcqAnswer , StudentSubmission, BatchPracticeQuestion, CodingQuestion, MCQQuestion, Student, Batch, College} = require('../models');
const db = require('../models');
const { Op } = require('sequelize');




// Controller to create a new student
exports.createStudent = async (req, res) => {
  const { name, email, password, batch_id, roll_no} = req.body;

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
      roll_no,
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

//Bulk adding the students
exports.bulkAddStudents = async (req, res) => {
  const { students } = req.body;  // Assuming the request body contains an array of student objects

  try {
    const createdStudents = [];

    for (const studentData of students) {
      const { name, email, password, batch_id, roll_no } = studentData;

      // Check if the email already exists
      const existingStudent = await Student.findOne({ where: { email } });
      if (existingStudent) {
        return res.status(400).json({
          message: `Email ${email} is already in use`,
          error: `Student with email ${email} already exists`
        });
      }

      // Check if the roll_no already exists
      const existingRollNo = await Student.findOne({ where: { roll_no } });
      if (existingRollNo) {
        return res.status(400).json({
          message: `Roll No ${roll_no} is already in use`,
          error: `Student with roll number ${roll_no} already exists`
        });
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
        roll_no,
      });

      createdStudents.push(student);
    }

    res.status(201).json({
      message: 'Students added successfully',
      students: createdStudents,
    });
  } catch (error) {
    console.error('Error adding students:', error);
    res.status(500).json({
      message: 'Error adding students',
      error,
    });
  }
};

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

//Fetch all Students by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findByPk(id, {
      include: [
        {
          model: Batch,
          attributes: ['name'],
          include: [
            {
              model: College, // Assuming Batch belongs to College
              attributes: ['name', 'email'], // Specify the college attributes you want to include
            }
          ]
        }
      ]
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
    const { name, email , roll_no} = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await student.update({ name, email, roll_no });
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

//Get all Students in a Batch
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

//Get Questions by batch
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

//Get Coding Questions by batch 
exports.getBatchCodingQuestions = async (req, res) => {
  try {
    const studentId = req.user.id;  // Get student ID from JWT payload
    const student = await Student.findByPk(studentId);  // Fetch student details

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const batchId = student.batch_id;  // Get batch ID of the student

    // Fetch batch practice coding questions based on the student's batch
    const batchCodingQuestions = await BatchPracticeQuestion.findAll({
      where: { batch_id: batchId },
      include: [
        { 
          model: CodingQuestion, 
          as: 'codingQuestion',  // Use the alias 'codingQuestion'
          where: { approval_status: 'approved' }, 
          attributes: ['id', 'title', 'description', 'difficulty', 'createdAt'] 
        }
      ]
    });

    if (!batchCodingQuestions || batchCodingQuestions.length === 0) {
      return res.status(404).json({ message: 'No coding questions found for this batch' });
    }

    res.status(200).json({
      message: 'Coding questions fetched successfully',
      codingQuestions: batchCodingQuestions
    });
  } catch (error) {
    console.error('Error fetching batch coding questions:', error);
    res.status(500).json({
      message: 'Error fetching batch coding questions',
      error
    });
  }
};

//Get MCQ Questions by Batch
exports.getBatchMCQQuestions = async (req, res) => {
  try {
    const studentId = req.user.id;  // Get student ID from JWT payload
    const student = await Student.findByPk(studentId);  // Fetch student details

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const batchId = student.batch_id;  // Get batch ID of the student

    // Fetch batch practice MCQ questions based on the student's batch
    const batchMCQQuestions = await BatchPracticeQuestion.findAll({
      where: { batch_id: batchId },
      include: [
        { 
          model: MCQQuestion, 
          as: 'mcqQuestion',  // Use the alias 'mcqQuestion'
          where: { approval_status: 'approved' }, 
          attributes: ['id', 'title', 'options', 'correct_answers', 'difficulty',] 
        }
      ]
    });

    if (!batchMCQQuestions || batchMCQQuestions.length === 0) {
      return res.status(404).json({ message: 'No MCQ questions found for this batch' });
    }

    res.status(200).json({
      message: 'MCQ questions fetched successfully',
      mcqQuestions: batchMCQQuestions
    });
  } catch (error) {
    console.error('Error fetching batch MCQ questions:', error);
    res.status(500).json({
      message: 'Error fetching batch MCQ questions',
      error
    });
  }
};

//Get all students by College Id
exports.allStudentsByCollegeid = async (req, res) => {
  try {
    const { college_id } = req.params;

    // Find all students associated with the specified college
    const students = await Student.findAll({
      include: {
        model: Batch,
        where: { college_id }, // Assuming the Batch table has a college_id field
        required: true // Ensures only batches associated with the college are included
      }
    });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for this college' });
    }

    res.status(200).json({ message: 'Students fetched successfully', students });
  } catch (error) {
    console.error('Error fetching students by college:', error);
    res.status(500).json({ message: 'Error fetching students by college', error });
  }
};

//Fetch all Students
exports.getAllStudents = async (req, res) => {
  try {
    // Find all students
    const students = await Student.findAll();

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    res.status(200).json({ message: 'All students fetched successfully', students });
  } catch (error) {
    console.error('Error fetching all students:', error);
    res.status(500).json({ message: 'Error fetching all students', error });
  }
};

// Search Students within a College
exports.searchStudentsByCollege = async (req, res) => {
  try {
    const { college_id } = req.params;
    const { name, email, roll_no } = req.query;

    const students = await Student.findAll({
      include: {
        model: Batch,
        where: { college_id }, // Assuming that batch is associated with college
        include: [{ model: College }],
      },
      where: {
        [Op.and]: [
          name ? { name: { [Op.like]: `%${name}%` } } : {},
          email ? { email: { [Op.like]: `%${email}%` } } : {},
          roll_no ? { roll_no: { [Op.like]: `%${roll_no}%` } } : {},
        ],
      },
    });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for this college.' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('Error searching students by college:', error);
    res.status(500).json({ message: 'Error searching students by college', error });
  }
};

// Search students within a batch, excluding irrelevant fields
exports.searchStudentsByBatch = async (req, res) => {
  const { batch_id } = req.params;
  const { query } = req.query;

  try {
    // Define the query to search students by name, email, or roll_no within the batch
    const students = await Student.findAll({
      where: {
        batch_id: batch_id,
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
          { roll_no: { [Op.like]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'name', 'email', 'roll_no'],  // Only include these fields
      include: [
        {
          model: Batch,
          attributes: ['name']  // Only include batch name, no other fields
        }
      ]
    });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    res.status(200).json({ message: 'Students fetched successfully', students });
  } catch (error) {
    console.error('Error searching students in batch:', error);
    res.status(500).json({ message: 'Error searching students in batch', error });
  }
};

// Search All Students (Overall Search)
exports.searchAllStudents = async (req, res) => {
  try {
    const { name, email, roll_no } = req.query;

    const students = await Student.findAll({
      where: {
        [Op.and]: [
          name ? { name: { [Op.like]: `%${name}%` } } : {},
          email ? { email: { [Op.like]: `%${email}%` } } : {},
          roll_no ? { roll_no: { [Op.like]: `%${roll_no}%` } } : {},
        ],
      },
    });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found.' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ message: 'Error searching students', error });
  }
};

// Fetch MCQ Questions by Domain ID for Students
exports.getMCQQuestionsByDomainForStudents = async (req, res) => {
  try {
    const { domain_id } = req.params;

    // Fetch all approved MCQ questions that belong to the specified domain
    const mcqQuestions = await MCQQuestion.findAll({
      where: {
        mcqdomain_id: domain_id,
        approval_status: 'approved',  // Only approved questions
                question_type: 'practice'          // Only practice type questions

      },
      attributes: [
        'id',
        'title',
        'options',
        'difficulty',
        'is_single_answer',
        'code_snippets',
        'mcqdomain_id',
      ]
    });

    // if (!mcqQuestions || mcqQuestions.length === 0) {
    //   return res.status(404).json({ message: 'No approved MCQ questions found for this domain' });
    // }
    if (mcqQuestions === null) {
      // Indicates that something went wrong with the query (e.g., invalid domain_id)
      return res.status(500).json({ message: 'Error fetching MCQ questions for this domain' });
    }
    
    if (mcqQuestions.length === 0) {
      // Indicates the query was successful, but no results were found
      return res.status(404).json({ message: 'No approved MCQ questions found for this domain' });
    }
    

    res.status(200).json({
      message: 'MCQ Questions fetched successfully for students',
      mcqQuestions
    });
  } catch (error) {
    console.error('Error fetching MCQ questions for students:', error);
    res.status(500).json({
      message: 'Error fetching MCQ questions for students',
      error
    });
  }
};



// Fetch Approved Practice Coding Questions by Domain ID for Students
// exports.getCodingQuestionsByDomainForStudents = async (req, res) => {
//   try {
//     const { domain_id } = req.params;

//     // Fetch only approved and practice-type coding questions for the specified domain
//     const codingQuestions = await CodingQuestion.findAll({
//       where: {
//         codingquestiondomain_id: domain_id,
//         approval_status: 'approved',       // Only approved questions
//         question_type: 'practice'          // Only practice type questions
//       },
//       attributes: [
//         'id',
//         'title',
//         'description',
//         'input_format',
//         'output_format',
//         'test_cases',
//         'constraints',
//         'difficulty',
//         'allowed_languages'
//       ]
//     });

//     // if (!codingQuestions || codingQuestions.length === 0) {
//     //   return res.status(404).json({ message: 'No approved practice coding questions found for this domain' });
//     // }

//     if (codingQuestions === null) {
//       // Indicates that something went wrong with the query (e.g., invalid domain_id)
//       return res.status(500).json({ message: 'Error fetching Coding questions for this domain' });
//     }
    
//     if (codingQuestions.length === 0) {
//       // Indicates the query was successful, but no results were found
//       return res.status(200).json({ message: 'No Questions Found in this Domain' });
//     }

//     res.status(200).json({
//       message: 'Approved practice coding questions fetched successfully for students',
//       codingQuestions
//     });
//   } catch (error) {
//     console.error('Error fetching coding questions for students:', error);
//     res.status(500).json({
//       message: 'Error fetching coding questions for students',
//       error
//     });
//   }
// };
exports.getCodingQuestionsByDomainForStudents = async (req, res) => {
  try {
    const { domain_id } = req.params;

    // Fetch only approved and practice-type coding questions for the specified domain
    const codingQuestions = await CodingQuestion.findAll({
      where: {
        codingquestiondomain_id: domain_id,
        approval_status: 'approved',       // Only approved questions
        question_type: 'practice'          // Only practice type questions
      },
      attributes: [
        'id',
        'title',
        'description',
        'input_format',
        'output_format',
        'test_cases',
        'constraints',
        'difficulty',
        'allowed_languages',
        'solutions'
      ]
    });

    if (codingQuestions === null) {
      // Something went wrong with the query
      return res.status(500).json({
        message: 'Error fetching Coding questions for this domain',
        codingQuestions: []
      });
    }
    
    // Use 200 OK and provide an empty array if no results were found
    res.status(200).json({
      message: codingQuestions.length > 0
        ? 'Approved practice coding questions fetched successfully for students'
        : 'No approved practice coding questions found for this domain',
      codingQuestions
    });
  } catch (error) {
    console.error('Error fetching coding questions for students:', error);
    res.status(500).json({
      message: 'Error fetching coding questions for students',
      codingQuestions: [],
      error
    });
  }
};








// Fetch Coding Questions by Domain ID for Students
// exports.getCodingQuestionsByDomainForStudents = async (req, res) => {
//   try {
//     const { domain_id } = req.params;

//     // Fetch all approved coding questions that belong to the specified domain
//     const codingQuestions = await CodingQuestion.findAll({
//       where: {
//         codingquestiondomain_id: domain_id,
//         approval_status: 'approved'  // Only approved questions
//       },
//       attributes: [
//         'id',
//         'title',
//         'description',
//         'input_format',
//         'output_format',
//         'test_cases',
//         'constraints',
//         'difficulty',
//         'allowed_languages'
//       ]
//     });

//     if (!codingQuestions || codingQuestions.length === 0) {
//       return res.status(404).json({ message: 'No approved coding questions found for this domain' });
//     }

//     res.status(200).json({
//       message: 'Coding Questions fetched successfully for students',
//       codingQuestions
//     });
//   } catch (error) {
//     console.error('Error fetching coding questions for students:', error);
//     res.status(500).json({
//       message: 'Error fetching coding questions for students',
//       error
//     });
//   }
// };


// Fetch Coding Questions by Domain ID for Students
// exports.getCodingQuestionsByDomainForStudents = async (req, res) => {
//   try {
//     const { domain_id } = req.params;

//     console.log(`Fetching coding questions for domain ID: ${domain_id}`);

//     // Fetch all approved coding questions that belong to the specified domain
//     const codingQuestions = await CodingQuestion.findAll({
//       where: {
//         codingquestiondomain_id: domain_id,
//         approval_status: 'approved'  // Only approved questions
//       },
//       attributes: [
//         'id',
//         'title',
//         'description',
//         'input_format',
//         'output_format',
//         'test_cases',
//         'constraints',
//         'difficulty',
//         'allowed_languages',
//         'solutions',
//         ''

//       ]
//     });

//     console.log(`Fetched questions:`, codingQuestions);

//     if (!codingQuestions || codingQuestions.length === 0) {
//       console.log('No approved coding questions found for the specified domain');
//       return res.status(404).json({ message: 'No approved coding questions found for this domain' });
//     }

//     res.status(200).json({
//       message: 'Coding Questions fetched successfully for students',
//       codingQuestions
//     });
//   } catch (error) {
//     console.error('Error fetching coding questions for students:', error);
//     res.status(500).json({
//       message: 'Error fetching coding questions for students',
//       error
//     });
//   }
// };



// const axios = require('axios');
// const { StudentSubmission } = require('../models'); // Adjust to your model import path

// exports.submitCode = async (req, res) => {
//     try {
//         // Extract student ID from JWT
//         const studentId = req.user.id;

//         // Extract required data from the request body
//         const { domain_id, question_id, language, code, testcases } = req.body;

//         // Determine the Docker endpoint based on the language
//         let endpoint;
//         switch (language.toLowerCase()) {
//             case 'python':
//                 endpoint = 'http://localhost:8084/compile';
//                 break;
//             case 'java':
//                 endpoint = 'http://localhost:8083/compile';
//                 break;
//             case 'cpp':
//                 endpoint = 'http://localhost:8081/compile';
//                 break;
//             case 'c':
//                 endpoint = 'http://localhost:8082/compile';
//                 break;
//             default:
//                 return res.status(400).json({ message: "Unsupported language selected" });
//         }

//         // Prepare request payload for Docker API
//         const requestBody = {
//             language,
//             code,
//             testcases
//         };

//         // Send request to Docker container
//         const response = await axios.post(endpoint, requestBody, {
//             headers: { 'Content-Type': 'application/json' }
//         });

//         // Docker response contains an array of test case results
//         const testResults = response.data;

//         // Analyze test case results to calculate status and score
//         let passedTests = 0;
//         let totalTests = testResults.length;

//         testResults.forEach(result => {
//             if (result.success) {
//                 passedTests += 1;
//             }
//         });

//         // Calculate score and determine status
//         const score = Math.round((passedTests / totalTests) * 100);
//         let status;
//         if (score === 100) {
//             status = 'pass';
//         } else if (score === 0) {
//             status = 'fail';
//         } else {
//             status = 'partial';
//         }

//         // Store the submission data in Student_Submissions table
//         const submission = await StudentSubmission.create({
//             student_id: studentId,
//             domain_id,
//             question_id,
//             score,
//             solution_code: code,
//             status,
//             question_points: 100, // Example points, adjust based on your grading logic
//             language,
//             submitted_at: new Date(),
//             last_updated: new Date()
//         });

//         // Send response to the frontend
//         res.status(201).json({
//             message: 'Code submitted successfully',
//             submission,
//             testResults,
//             calculatedScore: `${score}%`,
//             finalStatus: status
//         });
//     } catch (error) {
//         console.error("Error submitting code:", error);
//         res.status(500).json({ message: 'Error submitting code', error: error.message });
//     }
// };

exports.submitCode = async (req, res) => {
  try {
      const studentId = req.user.id;
      const { domain_id, question_id, language, code, testcases, action } = req.body;

      // Determine Docker endpoint based on language
      let endpoint;
      switch (language.toLowerCase()) {
          case 'python': endpoint = 'http://localhost:8084/compile'; break;
          case 'java': endpoint = 'http://localhost:8083/compile'; break;
          case 'cpp': endpoint = 'http://localhost:8081/compile'; break;
          case 'c': endpoint = 'http://localhost:8082/compile'; break;
          default: return res.status(400).json({ message: "Unsupported language selected" });
      }

      if (action === "submit") {
          const response = await axios.post(endpoint, { language, code, testcases }, { headers: { 'Content-Type': 'application/json' } });
          const testResults = response.data;

          let passedTests = 0;
          const totalTests = testResults.length;
          testResults.forEach(result => { if (result.success) passedTests += 1; });

          const score = Math.round((passedTests / totalTests) * 100);
          const status = score === 100 ? 'pass' : score === 0 ? 'fail' : 'partial';

          const submission = await StudentSubmission.create({
              student_id: studentId,
              domain_id,
              question_id,
              score,
              solution_code: code,
              status,
              question_points: 0,
              language,
              submitted_at: new Date(),
              last_updated: new Date()
          });

          return res.status(201).json({
              message: 'Code submitted successfully',
              submission,
              testResults,
              calculatedScore: `${score}%`,
              finalStatus: status
          });
      } else {
          await StudentSubmission.upsert({
              student_id: studentId,
              domain_id,
              question_id,
              solution_code: code,
              status: "draft",
              last_updated: new Date()
          });

          return res.status(200).json({ message: 'Draft saved successfully' });
      }
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: 'Error submitting or saving code', error: error.message });
  }
};



exports.submitAnswer = async (req, res) => {
  try {
    const { student_id, domain_id, question_id, submitted_options, points } = req.body;

    // Check if the answer already exists
    let answer = await StudentMcqAnswer.findOne({
      where: { student_id, domain_id, question_id }
    });

    if (answer) {
      // Update existing answer
      await answer.update({
        submitted_options,
        is_attempted: true,
        points
      });
    } else {
      // Create new answer
      answer = await StudentMcqAnswer.create({
        student_id,
        domain_id,
        question_id,
        submitted_options,
        is_attempted: true,
        points
      });
    }

    res.status(200).json({ message: 'Answer submitted successfully', answer });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Error submitting answer', error });
  }
};


exports.toggleMarkQuestion = async (req, res) => {
  try {
    const { student_id, domain_id, question_id, marked } = req.body;

    // Check if the answer already exists
    let answer = await StudentMcqAnswer.findOne({
      where: { student_id, domain_id, question_id }
    });

    if (answer) {
      // Update marked status for the existing answer
      await answer.update({
        marked
      });
    } else {
      // Create new answer with marked status
      answer = await StudentMcqAnswer.create({
        student_id,
        domain_id,
        question_id,
        marked
      });
    }

    res.status(200).json({ message: 'Marked status updated successfully', answer });
  } catch (error) {
    console.error('Error updating marked status:', error);
    res.status(500).json({ message: 'Error updating marked status', error });
  }
};

exports.reportQuestion = async (req, res) => {
  try {
    const { student_id, domain_id, question_id, reported_text } = req.body;

    // Check if the answer already exists
    let answer = await StudentMcqAnswer.findOne({
      where: { student_id, domain_id, question_id }
    });

    if (answer) {
      // Update reported status for the existing answer
      await answer.update({
        is_reported: true,
        reported_text
      });
    } else {
      // Create new answer with reported status
      answer = await StudentMcqAnswer.create({
        student_id,
        domain_id,
        question_id,
        is_reported: true,
        reported_text
      });
    }

    res.status(200).json({ message: 'Question reported successfully', answer });
  } catch (error) {
    console.error('Error reporting question:', error);
    res.status(500).json({ message: 'Error reporting question', error });
  }
};
