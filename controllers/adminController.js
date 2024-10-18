const multer = require('multer');
const {AssessmentQuestion , MCQDomain, CodingQuestionDomain, Admin, AllowedLanguage } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AssessmentRound, Assessment, CodingQuestion, PracticeQuestion, MCQQuestion, Batch, BatchPracticeQuestion} = require('../models');

// Setup multer for file uploads
const storage = multer.memoryStorage();  // Storing file in memory as a buffer
const upload = multer({ storage });      // Initialize multer

exports.createAdmin = [
  upload.single('logo'),  // Handling the 'logo' field for file upload
  async (req, res) => {
    try {
      const { name, email, password, company_name } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const logo = req.file ? req.file.buffer : null;  // Get the logo from the uploaded file

      const admin = await Admin.create({
        name,
        email,
        password: hashedPassword,
        company_name,
        logo
      });
      res.status(201).json({ message: 'Admin created successfully', admin });
    } catch (error) {
      res.status(500).json({ message: 'Error creating admin', error });
    }
  }
];




exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token with ADMIN secret
    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.ADMIN_JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error });
  }
};


// Update admin details
exports.updateAdmin = [
  upload.single('logo'),  // Middleware to handle logo file upload (optional)
  async (req, res) => {
    try {
      const { id } = req.params;  // Admin ID from the request params
      const { name, email, password, company_name } = req.body;

      // Find the admin by ID
      const admin = await Admin.findByPk(id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      // Hash the new password if provided
      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      // Prepare the updated data
      const updatedData = {
        name: name || admin.name,
        email: email || admin.email,
        password: hashedPassword || admin.password,
        company_name: company_name || admin.company_name,
      };

      // If there's a new logo, update it
      if (req.file) {
        updatedData.logo = req.file.buffer;
      }

      // Update the admin details
      await admin.update(updatedData);
      res.json({ message: 'Admin updated successfully', admin });
    } catch (error) {
      res.status(500).json({ message: 'Error updating admin', error });
    }
  }
];


// Delete an admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the admin by ID
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Delete the admin
    await admin.destroy();
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin', error });
  }
};





// Admin adds a new language
exports.addLanguage = async (req, res) => {
  try {
    const { language_name } = req.body;

    const newLanguage = await AllowedLanguage.create({ language_name });
    res.status(201).json({ message: 'Language added successfully', newLanguage });
  } catch (error) {
    res.status(500).json({ message: 'Error adding language', error });
  }
};



// Add MCQ Domain
exports.addMCQDomain = async (req, res) => {
  try {
    const { name, parent_id } = req.body;  // Parent ID for subdomains (optional)
    
    // Create new MCQ domain
    const mcqDomain = await MCQDomain.create({
      name,
      parent_id: parent_id || null,  // Set parent_id to null if not provided
      admin_id: req.user.id  // Assume admin_id is from the logged-in admin
    });

    res.status(201).json({ message: 'MCQ Domain created successfully', mcqDomain });
  } catch (error) {
    res.status(500).json({ message: 'Error creating MCQ Domain', error });
  }
};

// Add Coding Domain
exports.addCodingDomain = async (req, res) => {
  try {
    const { name, parent_id } = req.body;  // Parent ID for subdomains (optional)
    
    // Create new Coding domain
    const codingDomain = await CodingQuestionDomain.create({
      name,
      parent_id: parent_id || null,  // Set parent_id to null if not provided
      admin_id: req.user.id  // Assume admin_id is from the logged-in admin
    });

    res.status(201).json({ message: 'Coding Domain created successfully', codingDomain });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Coding Domain', error });
  }
};


// Edit MCQ Domain
exports.editMCQDomain = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent_id } = req.body;

    // Find the domain by ID
    const mcqDomain = await MCQDomain.findByPk(id);
    if (!mcqDomain) {
      return res.status(404).json({ message: 'MCQ Domain not found' });
    }

    // Update domain details
    mcqDomain.name = name || mcqDomain.name;
    mcqDomain.parent_id = parent_id || mcqDomain.parent_id;
    
    await mcqDomain.save();
    res.status(200).json({ message: 'MCQ Domain updated successfully', mcqDomain });
  } catch (error) {
    res.status(500).json({ message: 'Error updating MCQ Domain', error });
  }
};

// Delete MCQ Domain
exports.deleteMCQDomain = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the domain by ID
    const mcqDomain = await MCQDomain.findByPk(id);
    if (!mcqDomain) {
      return res.status(404).json({ message: 'MCQ Domain not found' });
    }

    // Delete the domain
    await mcqDomain.destroy();
    res.status(200).json({ message: 'MCQ Domain deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting MCQ Domain', error });
  }
};


// Edit Coding Domain
exports.editCodingDomain = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent_id } = req.body;

    // Find the domain by ID
    const codingDomain = await CodingQuestionDomain.findByPk(id);
    if (!codingDomain) {
      return res.status(404).json({ message: 'Coding Domain not found' });
    }

    // Update domain details
    codingDomain.name = name || codingDomain.name;
    codingDomain.parent_id = parent_id || codingDomain.parent_id;

    await codingDomain.save();
    res.status(200).json({ message: 'Coding Domain updated successfully', codingDomain });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Coding Domain', error });
  }
};

// Delete Coding Domain
exports.deleteCodingDomain = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the domain by ID
    const codingDomain = await CodingQuestionDomain.findByPk(id);
    if (!codingDomain) {
      return res.status(404).json({ message: 'Coding Domain not found' });
    }

    // Delete the domain
    await codingDomain.destroy();
    res.status(200).json({ message: 'Coding Domain deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Coding Domain', error });
  }
};





// // Admin changes approval status of a question
// exports.updateApprovalStatus = async (req, res) => {
//   try {
//     const { question_id, question_type, question_category, approval_status } = req.body;

//     // Validate approval_status
//     if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
//       return res.status(400).json({ message: 'Invalid approval status' });
//     }

//     // Update coding question or mcq question depending on the category
//     let question;
//     if (question_category === 'coding') {
//       question = await CodingQuestion.findByPk(question_id);
//     } else if (question_category === 'mcq') {
//       question = await MCQQuestion.findByPk(question_id);
//     }

//     if (!question) {
//       return res.status(404).json({ message: 'Question not found' });
//     }

//     // Update approval status
//     question.approval_status = approval_status;
//     await question.save();

//     // If the question is approved and is a practice question, add it to PracticeQuestions table
//     if (approval_status === 'approved' && question.question_type === 'practice') {
//       await PracticeQuestion.create({
//         coding_question_id: question_category === 'coding' ? question.id : null,
//         mcq_question_id: question_category === 'mcq' ? question.id : null,
//         created_by: req.user.id  // Assume admin's ID is attached to req.user.id
//       });
//     }

//     res.status(200).json({ message: 'Approval status updated successfully', question });
//   } catch (error) {
//     console.error('Error updating approval status:', error);
//     res.status(500).json({ message: 'Error updating approval status', error });
//   }
// };


// // Admin updates the approval status of a coding question
// exports.updateCodingQuestionApprovalStatus = async (req, res) => {
//   try {
//     const { question_id, approval_status } = req.body;

//     // Validate approval_status
//     if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
//       return res.status(400).json({ message: 'Invalid approval status' });
//     }

//     // Find the coding question by ID
//     const codingQuestion = await CodingQuestion.findByPk(question_id);

//     if (!codingQuestion) {
//       return res.status(404).json({ message: 'Coding Question not found' });
//     }

//     // Update approval status
//     codingQuestion.approval_status = approval_status;
//     await codingQuestion.save();

//     // If the question is approved and is a practice question, add it to PracticeQuestions table
//     if (approval_status === 'approved' && codingQuestion.question_type === 'practice') {
//       await PracticeQuestion.create({
//         coding_question_id: codingQuestion.id,
//         created_by: req.user.id  // Assume admin's ID is attached to req.user.id
//       });
//     }

//     res.status(200).json({ message: 'Coding Question approval status updated successfully', codingQuestion });
//   } catch (error) {
//     console.error('Error updating coding question approval status:', error);
//     res.status(500).json({ message: 'Error updating coding question approval status', error });
//   }
// };




// // Admin updates the approval status of an MCQ question
// exports.updateMCQQuestionApprovalStatus = async (req, res) => {
//   try {
//     const { question_id, approval_status } = req.body;

//     // Validate approval_status
//     if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
//       return res.status(400).json({ message: 'Invalid approval status' });
//     }

//     // Find the MCQ question by ID
//     const mcqQuestion = await MCQQuestion.findByPk(question_id);

//     if (!mcqQuestion) {
//       return res.status(404).json({ message: 'MCQ Question not found' });
//     }

//     // Update approval status
//     mcqQuestion.approval_status = approval_status;
//     await mcqQuestion.save();

//     // If the question is approved and is a practice question, add it to PracticeQuestions table
//     if (approval_status === 'approved' && mcqQuestion.question_type === 'practice') {
//       await PracticeQuestion.create({
//         mcq_question_id: mcqQuestion.id,
//         created_by: req.user.id  // Assume admin's ID is attached to req.user.id
//       });
//     }

//     res.status(200).json({ message: 'MCQ Question approval status updated successfully', mcqQuestion });
//   } catch (error) {
//     console.error('Error updating MCQ question approval status:', error);
//     res.status(500).json({ message: 'Error updating MCQ question approval status', error });
//   }
// };


// // Admin updates the approval status of a coding question
// exports.updateCodingQuestionApprovalStatus = async (req, res) => {
//   try {
//     const { question_id, approval_status } = req.body;

//     // Validate approval_status
//     if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
//       return res.status(400).json({ message: 'Invalid approval status' });
//     }

//     // Find the coding question by ID
//     const codingQuestion = await CodingQuestion.findByPk(question_id);

//     if (!codingQuestion) {
//       return res.status(404).json({ message: 'Coding Question not found' });
//     }

//     // Update approval status
//     codingQuestion.approval_status = approval_status;
//     await codingQuestion.save();

//     // If approved and it's a practice question, add to PracticeQuestions table
//     if (approval_status === 'approved' && codingQuestion.question_type === 'practice') {
//       await PracticeQuestion.create({
//         coding_question_id: codingQuestion.id,
//         created_by: req.user.id
//       });
//     }

//     res.status(200).json({ message: 'Coding Question approval status updated successfully', codingQuestion });
//   } catch (error) {
//     console.error('Error updating coding question approval status:', error);
//     res.status(500).json({ message: 'Error updating coding question approval status', error });
//   }
// };


// // Admin updates the approval status of an MCQ question
// exports.updateMCQQuestionApprovalStatus = async (req, res) => {
//   try {
//     const { question_id, approval_status } = req.body;

//     // Validate approval_status
//     if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
//       return res.status(400).json({ message: 'Invalid approval status' });
//     }

//     // Find the MCQ question by ID
//     const mcqQuestion = await MCQQuestion.findByPk(question_id);

//     if (!mcqQuestion) {
//       return res.status(404).json({ message: 'MCQ Question not found' });
//     }

//     // Update approval status
//     mcqQuestion.approval_status = approval_status;
//     await mcqQuestion.save();

//     // If approved and it's a practice question, add to PracticeQuestions table
//     if (approval_status === 'approved' && mcqQuestion.question_type === 'practice') {
//       await PracticeQuestion.create({
//         mcq_question_id: mcqQuestion.id,
//         created_by: req.user.id
//       });
//     }

//     res.status(200).json({ message: 'MCQ Question approval status updated successfully', mcqQuestion });
//   } catch (error) {
//     console.error('Error updating MCQ question approval status:', error);
//     res.status(500).json({ message: 'Error updating MCQ question approval status', error });
//   }
// };



// Admin updates the approval status of a coding question
// exports.updateCodingQuestionApprovalStatus = async (req, res) => {
//   try {
//     const { question_id } = req.params;  // Get question ID from URL
//     const {  approval_status } = req.body;

//     // Validate approval_status
//     if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
//       return res.status(400).json({ message: 'Invalid approval status' });
//     }

//     // Find the coding question by ID
//     const codingQuestion = await CodingQuestion.findByPk(question_id);

//     if (!codingQuestion) {
//       return res.status(404).json({ message: 'Coding Question not found' });
//     }

//     // Update approval status
//     codingQuestion.approval_status = approval_status;
//     await codingQuestion.save();

//     // If approved and it's a practice question, add to PracticeQuestions table
//     if (approval_status === 'approved' && codingQuestion.question_type === 'practice') {
//       await PracticeQuestion.create({
//         coding_question_id: codingQuestion.id,
//         created_by: req.user.id
//       });
//     }
//  // Handle assessment questions: If approved and domain_id is null, add to AssessmentQuestions table
//  if (approval_status === 'approved' && codingQuestion.question_type === 'assessment' && !codingQuestion.domain_id) {
//   await AssessmentQuestion.create({
//     coding_question_id: codingQuestion.id,
//     created_by: req.user.id  // Admin ID from token
//   });
// }

    

//     res.status(200).json({ message: 'Coding Question approval status updated successfully', codingQuestion });
//   } catch (error) {
//     console.error('Error updating coding question approval status:', error);
//     res.status(500).json({ message: 'Error updating coding question approval status', error });
//   }
// };

// Admin updates the approval status of a coding question
exports.updateCodingQuestionApprovalStatus = async (req, res) => {
  try {
    const { question_id } = req.params;  // Get question ID from URL
    const { approval_status } = req.body;

    // Validate approval_status
    if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
      return res.status(400).json({ message: 'Invalid approval status' });
    }

    // Find the coding question by ID
    const codingQuestion = await CodingQuestion.findByPk(question_id);

    if (!codingQuestion) {
      return res.status(404).json({ message: 'Coding Question not found' });
    }

    // Update approval status
    codingQuestion.approval_status = approval_status;
    await codingQuestion.save();

    // Handle practice questions: If approved, add to PracticeQuestions table
    if (approval_status === 'approved' && codingQuestion.question_type === 'practice') {
      await PracticeQuestion.create({
        coding_question_id: codingQuestion.id,
        created_by: req.user.id  // Admin ID from token
      });
    }

    // Handle assessment questions: If approved and domain_id is null, add to AssessmentQuestions table
    if (approval_status === 'approved' && codingQuestion.question_type === 'assessment' && !codingQuestion.domain_id) {
      await AssessmentQuestion.create({
        coding_question_id: codingQuestion.id,
        created_by: req.user.id,  // Admin ID from token
        round_id: codingQuestion.round_id,  // Use the round_id from the coding question
      });
    }

    res.status(200).json({
      message: 'Coding Question approval status updated successfully',
      codingQuestion
    });
  } catch (error) {
    console.error('Error updating coding question approval status:', error);
    res.status(500).json({
      message: 'Error updating coding question approval status',
      error
    });
  }
};



// Admin updates the approval status of an MCQ question
// exports.updateMCQQuestionApprovalStatus = async (req, res) => {
//   try {
//     const { question_id } = req.params;  // Get question ID from URL

//     const {  approval_status } = req.body;

//     // Validate approval_status
//     if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
//       return res.status(400).json({ message: 'Invalid approval status' });
//     }

//     // Find the MCQ question by ID
//     const mcqQuestion = await MCQQuestion.findByPk(question_id);

//     if (!mcqQuestion) {
//       return res.status(404).json({ message: 'MCQ Question not found' });
//     }

//     // Update approval status
//     mcqQuestion.approval_status = approval_status;
//     await mcqQuestion.save();

//     // If approved and it's a practice question, add to PracticeQuestions table
//     if (approval_status === 'approved' && mcqQuestion.question_type === 'practice') {
//       await PracticeQuestion.create({
//         mcq_question_id: mcqQuestion.id,
//         created_by: req.user.id
//       });
//     }

//     res.status(200).json({ message: 'MCQ Question approval status updated successfully', mcqQuestion });
//   } catch (error) {
//     console.error('Error updating MCQ question approval status:', error);
//     res.status(500).json({ message: 'Error updating MCQ question approval status', error });
//   }
// };


// Admin updates the approval status of an MCQ question
// exports.updateMCQQuestionApprovalStatus = async (req, res) => {
//   try {
//     const { question_id } = req.params;  // Get question ID from URL
//     const { approval_status, batch_id } = req.body;  // Include batch_id in the request for batch association

//     // Validate approval_status
//     if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
//       return res.status(400).json({ message: 'Invalid approval status' });
//     }

//     // Find the MCQ question by ID
//     const mcqQuestion = await MCQQuestion.findByPk(question_id);

//     if (!mcqQuestion) {
//       return res.status(404).json({ message: 'MCQ Question not found' });
//     }

//     // Update approval status
//     mcqQuestion.approval_status = approval_status;
//     await mcqQuestion.save();

//     // If approved and it's a practice question, add to BatchPracticeQuestions table
//     if (approval_status === 'approved' && mcqQuestion.question_type === 'practice') {
//       // Check if batch_id is provided, as we need to associate the question with a batch
//       if (!batch_id) {
//         return res.status(400).json({ message: 'Batch ID is required for adding practice questions' });
//       }

//       // Check if the question already exists in the BatchPracticeQuestions table
//       const existingBatchQuestion = await BatchPracticeQuestion.findOne({
//         where: {
//           batch_id: batch_id,
//           mcq_question_id: mcqQuestion.id,
//         },
//       });

//       if (!existingBatchQuestion) {
//         // Add the question to the BatchPracticeQuestions table
//         await BatchPracticeQuestion.create({
//           batch_id: batch_id,
//           mcq_question_id: mcqQuestion.id,
//           created_by: req.user.id  // Admin ID from token
//         });
//       }
//     }

//     // If approved and it's an assessment question with domain_id being null, add to AssessmentQuestions table
//     if (approval_status === 'approved' && mcqQuestion.question_type === 'assessment' && !mcqQuestion.domain_id) {
//       await AssessmentQuestion.create({
//         mcq_question_id: mcqQuestion.id,
//         created_by: req.user.id  // Admin ID from token
//       });
//     }

//     res.status(200).json({
//       message: 'MCQ Question approval status updated successfully',
//       mcqQuestion
//     });
//   } catch (error) {
//     console.error('Error updating MCQ question approval status:', error);
//     res.status(500).json({
//       message: 'Error updating MCQ question approval status',
//       error
//     });
//   }
// };


// Admin updates the approval status of an MCQ question
// exports.updateMCQQuestionApprovalStatus = async (req, res) => {
//   try {
//     const { question_id } = req.params;  // Get question ID from URL
//     const { approval_status } = req.body;

//     // Validate approval_status
//     if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
//       return res.status(400).json({ message: 'Invalid approval status' });
//     }

//     // Find the MCQ question by ID
//     const mcqQuestion = await MCQQuestion.findByPk(question_id);

//     if (!mcqQuestion) {
//       return res.status(404).json({ message: 'MCQ Question not found' });
//     }

//     // Update the approval status
//     mcqQuestion.approval_status = approval_status;
//     await mcqQuestion.save();

//     // If the question is approved and is a practice question, add it to the PracticeQuestions table
//     if (approval_status === 'approved' && mcqQuestion.question_type === 'practice') {
//       await PracticeQuestion.create({
//         mcq_question_id: mcqQuestion.id,
//         created_by: req.user.id  // Admin ID from token
//       });
//     }

//     // If the question is approved, is an assessment question, and the domain ID is null,
//     // add it to the AssessmentQuestions table
//     if (approval_status === 'approved' && mcqQuestion.question_type === 'assessment' && !mcqQuestion.domain_id) {
//       await AssessmentQuestion.create({
//         mcq_question_id: mcqQuestion.id,
//         created_by: req.user.id  // Admin ID from token
//       });
//     }

//     res.status(200).json({
//       message: 'MCQ Question approval status updated successfully',
//       mcqQuestion
//     });
//   } catch (error) {
//     console.error('Error updating MCQ question approval status:', error);
//     res.status(500).json({
//       message: 'Error updating MCQ question approval status',
//       error
//     });
//   }
// };


// Admin updates the approval status of an MCQ question
// exports.updateMCQQuestionApprovalStatus = async (req, res) => {
//   try {
//     const { question_id } = req.params;  // Get question ID from URL
//     const { approval_status } = req.body;

//     // Validate approval_status
//     if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
//       return res.status(400).json({ message: 'Invalid approval status' });
//     }

//     // Find the MCQ question by ID
//     const mcqQuestion = await MCQQuestion.findByPk(question_id);

//     if (!mcqQuestion) {
//       return res.status(404).json({ message: 'MCQ Question not found' });
//     }

//     // Update the approval status
//     mcqQuestion.approval_status = approval_status;
//     await mcqQuestion.save();

//     // If the question is approved and is a practice question, add it to the PracticeQuestions table
//     if (approval_status === 'approved' && mcqQuestion.question_type === 'practice') {
//       await PracticeQuestion.create({
//         mcq_question_id: mcqQuestion.id,
//         created_by: req.user.id  // Admin ID from token
//       });
//     }

//     // If the question is approved, is an assessment question, and the domain ID is null,
//     // add it to the AssessmentQuestions table
//     if (approval_status === 'approved' && mcqQuestion.question_type === 'assessment' && !mcqQuestion.mcqdomain_id) {
//       await AssessmentQuestion.create({
//         mcq_question_id: mcqQuestion.id,
//         created_by: req.user.id  // Admin ID from token
//       });
//     }

//     res.status(200).json({
//       message: 'MCQ Question approval status updated successfully',
//       mcqQuestion
//     });
//   } catch (error) {
//     console.error('Error updating MCQ question approval status:', error);
//     res.status(500).json({
//       message: 'Error updating MCQ question approval status',
//       error
//     });
//   }
// };


// Admin updates the approval status of an MCQ question
exports.updateMCQQuestionApprovalStatus = async (req, res) => {
  try {
    const { question_id } = req.params;  // Get question ID from URL
    const { approval_status } = req.body;

    console.log(`Updating approval status for MCQ question ID: ${question_id}`);
    console.log(`New approval status: ${approval_status}`);

    // Validate approval_status
    if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
      console.log(`Invalid approval status provided: ${approval_status}`);
      return res.status(400).json({ message: 'Invalid approval status' });
    }

    // Find the MCQ question by ID
    const mcqQuestion = await MCQQuestion.findByPk(question_id);

    if (!mcqQuestion) {
      console.log(`MCQ Question not found for ID: ${question_id}`);
      return res.status(404).json({ message: 'MCQ Question not found' });
    }

    // Log the current MCQ question data for debugging
    console.log(`MCQ Question found: ${JSON.stringify(mcqQuestion)}`);

    // Update the approval status
    mcqQuestion.approval_status = approval_status;
    await mcqQuestion.save();

    // Log after updating the approval status
    console.log(`Approval status updated for MCQ Question ID: ${question_id}`);

    // If the question is approved and is a practice question, add to PracticeQuestions table
    if (approval_status === 'approved' && mcqQuestion.question_type === 'practice') {
      console.log(`Adding MCQ Question ID ${mcqQuestion.id} to PracticeQuestions table`);
      await PracticeQuestion.create({
        mcq_question_id: mcqQuestion.id,
        created_by: req.user.id  // Admin ID from token
      });
      console.log(`MCQ Question ID ${mcqQuestion.id} added to PracticeQuestions`);
    }

    // If approved and it's an assessment question without a domain, add to AssessmentQuestions table
    if (approval_status === 'approved' && mcqQuestion.question_type === 'assessment' && !mcqQuestion.mcqdomain_id) {
      console.log(`Adding MCQ Question ID ${mcqQuestion.id} to AssessmentQuestions table`);
      await AssessmentQuestion.create({
        mcq_question_id: mcqQuestion.id,
        created_by: req.user.id,  // Admin ID from token
        round_id: mcqQuestion.round_id,
      });
      console.log(`MCQ Question ID ${mcqQuestion.id} added to AssessmentQuestions`);
    }

    res.status(200).json({
      message: 'MCQ Question approval status updated successfully',
      mcqQuestion
    });
  } catch (error) {
    console.error('Error updating MCQ question approval status:', error);
    res.status(500).json({
      message: 'Error updating MCQ question approval status',
      error
    });
  }
};



// // Admin updates the approval status of an MCQ question
// exports.updateMCQQuestionApprovalStatus = async (req, res) => {
//   try {
//     const { question_id } = req.params;  // Get question ID from URL
//     const { approval_status } = req.body;

//     // Validate approval_status
//     if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
//       return res.status(400).json({ message: 'Invalid approval status' });
//     }

//     // Find the MCQ question by ID
//     const mcqQuestion = await MCQQuestion.findByPk(question_id);

//     if (!mcqQuestion) {
//       return res.status(404).json({ message: 'MCQ Question not found' });
//     }

//     // Update approval status
//     mcqQuestion.approval_status = approval_status;
//     await mcqQuestion.save();

//     // If approved and it's a practice question, add to PracticeQuestions table
//     if (approval_status === 'approved' && mcqQuestion.question_type === 'practice') {
//       await PracticeQuestion.create({
//         mcq_question_id: mcqQuestion.id,
//         created_by: req.user.id  // Admin ID from token
//       });
//     }

//     // If approved and it's an assessment question with domain_id being null, add to AssessmentQuestions table
//     if (approval_status === 'approved' && mcqQuestion.question_type === 'assessment' && !mcqQuestion.domain_id) {
//       await AssessmentQuestion.create({
//         mcq_question_id: mcqQuestion.id,
//         created_by: req.user.id  // Admin ID from token
//       });
//     }

//     res.status(200).json({
//       message: 'MCQ Question approval status updated successfully',
//       mcqQuestion
//     });
//   } catch (error) {
//     console.error('Error updating MCQ question approval status:', error);
//     res.status(500).json({
//       message: 'Error updating MCQ question approval status',
//       error
//     });
//   }
// };





// Admin fetches all pending coding questions
exports.getAllPendingCodingQuestions = async (req, res) => {
  try {
    // Fetch all coding questions with approval_status set to 'pending'
    const pendingCodingQuestions = await CodingQuestion.findAll({
      where: { approval_status: 'pending' }
    });

    if (!pendingCodingQuestions.length) {
      return res.status(200).json({ message: 'No pending coding questions found' });
    }

    res.status(200).json({ message: 'Pending coding questions fetched successfully', pendingCodingQuestions });
  } catch (error) {
    console.error('Error fetching pending coding questions:', error);
    res.status(500).json({ message: 'Error fetching pending coding questions', error });
  }
};

// Admin fetches all pending MCQ questions
exports.getAllPendingMCQQuestions = async (req, res) => {
  try {
    // Fetch all MCQ questions with approval_status set to 'pending'
    const pendingMCQQuestions = await MCQQuestion.findAll({
      where: { approval_status: 'pending' }
    });

    if (!pendingMCQQuestions.length) {
      return res.status(200).json({ message: 'No pending MCQ questions found' });
    }

    res.status(200).json({ message: 'Pending MCQ questions fetched successfully', pendingMCQQuestions });
  } catch (error) {
    console.error('Error fetching pending MCQ questions:', error);
    res.status(500).json({ message: 'Error fetching pending MCQ questions', error });
  }
};




// // Add multiple questions (coding or mcq) to a batch
// exports.addQuestionsToBatch = async (req, res) => {
//   try {
//     const { batch_id } = req.params;
//     const { coding_question_ids, mcq_question_ids } = req.body;

//     // Check if the batch exists
//     const batch = await Batch.findByPk(batch_id);
//     if (!batch) {
//       return res.status(404).json({ message: 'Batch not found' });
//     }

//     // Ensure at least one list of questions is provided
//     if ((!coding_question_ids || coding_question_ids.length === 0) && (!mcq_question_ids || mcq_question_ids.length === 0)) {
//       return res.status(400).json({ message: 'No questions provided to add' });
//     }

//     // Add coding questions if provided
//     if (coding_question_ids && coding_question_ids.length > 0) {
//       for (let coding_question_id of coding_question_ids) {
//         const codingQuestion = await CodingQuestion.findByPk(coding_question_id);
//         if (codingQuestion && codingQuestion.approval_status === 'approved') {
//           await BatchPracticeQuestion.create({
//             batch_id,
//             coding_question_id,
//             mcq_question_id: null
//           });
//         }
//       }
//     }

//     // Add MCQ questions if provided
//     if (mcq_question_ids && mcq_question_ids.length > 0) {
//       for (let mcq_question_id of mcq_question_ids) {
//         const mcqQuestion = await MCQQuestion.findByPk(mcq_question_id);
//         if (mcqQuestion && mcqQuestion.approval_status === 'approved') {
//           await BatchPracticeQuestion.create({
//             batch_id,
//             coding_question_id: null,
//             mcq_question_id
//           });
//         }
//       }
//     }

//     res.status(201).json({ message: 'Questions added to batch successfully' });
//   } catch (error) {
//     console.error('Error adding questions to batch:', error);
//     res.status(500).json({ message: 'Error adding questions to batch', error });
//   }
// };



// Remove multiple questions (coding or mcq) from a batch
exports.removeQuestionsFromBatch = async (req, res) => {
  try {
    const { batch_id } = req.params;
    const { coding_question_ids, mcq_question_ids } = req.body;

    // Ensure at least one list of questions is provided
    if ((!coding_question_ids || coding_question_ids.length === 0) && (!mcq_question_ids || mcq_question_ids.length === 0)) {
      return res.status(400).json({ message: 'No questions provided to remove' });
    }

    // Remove coding questions if provided
    if (coding_question_ids && coding_question_ids.length > 0) {
      for (let coding_question_id of coding_question_ids) {
        const batchQuestion = await BatchPracticeQuestion.findOne({
          where: { batch_id, coding_question_id }
        });
        if (batchQuestion) {
          await batchQuestion.destroy();
        }
      }
    }

    // Remove MCQ questions if provided
    if (mcq_question_ids && mcq_question_ids.length > 0) {
      for (let mcq_question_id of mcq_question_ids) {
        const batchQuestion = await BatchPracticeQuestion.findOne({
          where: { batch_id, mcq_question_id }
        });
        if (batchQuestion) {
          await batchQuestion.destroy();
        }
      }
    }

    res.status(200).json({ message: 'Questions removed from batch successfully' });
  } catch (error) {
    console.error('Error removing questions from batch:', error);
    res.status(500).json({ message: 'Error removing questions from batch', error });
  }
};


// exports.addQuestionsToBatch = async (req, res) => {
//   try {
//     const { batch_id } = req.params; // Get batch_id from params
//     const { coding_question_ids, mcq_question_ids } = req.body; // Get the question IDs from the request body

//     // Log the incoming data for debugging
//     console.log('Batch ID:', batch_id);
//     console.log('Coding Question IDs:', coding_question_ids);
//     console.log('MCQ Question IDs:', mcq_question_ids);

//     // Process Coding Questions
//     if (coding_question_ids && coding_question_ids.length > 0) {
//       for (let codingQuestionId of coding_question_ids) {
//         // Log each coding question ID being processed
//         console.log('Processing Coding Question ID:', codingQuestionId);

//         const [batchPracticeQuestion, created] = await BatchPracticeQuestion.findOrCreate({
//           where: {
//             batch_id: batch_id,
//             coding_question_id: codingQuestionId,
//           },
//           defaults: {
//             created_by: req.user.id, // Assuming req.user.id holds the admin's ID
//           },
//         });

//         // Log the result of each insert
//         if (created) {
//           console.log(`Coding Question ID ${codingQuestionId} added to batch ${batch_id}`);
//         } else {
//           console.log(`Coding Question ID ${codingQuestionId} already exists in batch ${batch_id}`);
//         }
//       }
//     }

//     // Process MCQ Questions
//     if (mcq_question_ids && mcq_question_ids.length > 0) {
//       for (let mcqQuestionId of mcq_question_ids) {
//         // Log each MCQ question ID being processed
//         console.log('Processing MCQ Question ID:', mcqQuestionId);

//         const [batchPracticeQuestion, created] = await BatchPracticeQuestion.findOrCreate({
//           where: {
//             batch_id: batch_id,
//             mcq_question_id: mcqQuestionId,
//           },
//           defaults: {
//             created_by: req.user.id,
//           },
//         });

//         // Log the result of each insert
//         if (created) {
//           console.log(`MCQ Question ID ${mcqQuestionId} added to batch ${batch_id}`);
//         } else {
//           console.log(`MCQ Question ID ${mcqQuestionId} already exists in batch ${batch_id}`);
//         }
//       }
//     }

//     res.status(201).json({ message: 'Questions added to batch successfully' });

//   } catch (error) {
//     // Log the error
//     console.error('Error adding questions to batch:', error);
//     res.status(500).json({ message: 'Error adding questions to batch', error });
//   }
// };


// // Add questions (both coding and MCQ) to a batch
// exports.addQuestionsToBatch = async (req, res) => {
//   const { batch_id } = req.params;
//   const { coding_question_ids, mcq_question_ids } = req.body;

//   try {
//     // Initialize an array to store all questions to be added
//     let questionsToAdd = [];

//     // Process Coding Questions
//     if (coding_question_ids && coding_question_ids.length > 0) {
//       for (let coding_question_id of coding_question_ids) {
//         const codingQuestion = await CodingQuestion.findOne({
//           where: { id: coding_question_id, approval_status: 'approved' }
//         });

//         if (codingQuestion) {
//           questionsToAdd.push({
//             batch_id,
//             coding_question_id: codingQuestion.id,
//             created_by: req.user.id  // Assuming admin or authorized user
//           });
//         }
//       }
//     }

//     // Process MCQ Questions
//     if (mcq_question_ids && mcq_question_ids.length > 0) {
//       for (let mcq_question_id of mcq_question_ids) {
//         const mcqQuestion = await MCQQuestion.findOne({
//           where: { id: mcq_question_id, approval_status: 'approved' }
//         });

//         if (mcqQuestion) {
//           questionsToAdd.push({
//             batch_id,
//             mcq_question_id: mcqQuestion.id,
//             created_by: req.user.id
//           });
//         }
//       }
//     }

//     // Bulk insert questions to BatchPracticeQuestions
//     if (questionsToAdd.length > 0) {
//       await BatchPracticeQuestion.bulkCreate(questionsToAdd);
//       res.status(201).json({ message: 'Questions added to batch successfully' });
//     } else {
//       res.status(400).json({ message: 'No approved questions to add to batch' });
//     }

//   } catch (error) {
//     console.error('Error adding questions to batch:', error);
//     res.status(500).json({ message: 'Error adding questions to batch', error });
//   }
// };



// exports.addQuestionsToBatch = async (req, res) => {
//   const { batch_id } = req.params; // Get batch_id from URL
//   const { coding_question_ids, mcq_question_ids } = req.body; // Get question IDs from the body

//   try {
//     // Validate coding questions
//     if (coding_question_ids && coding_question_ids.length > 0) {
//       for (let questionId of coding_question_ids) {
//         const codingQuestion = await CodingQuestion.findByPk(questionId);

//         // Ensure the question exists and is of type 'practice'
//         if (!codingQuestion || codingQuestion.question_type !== 'practice') {
//           return res.status(400).json({ message: `Coding question ID ${questionId} is either not found or is not a practice question.` });
//         }

//         // Add to BatchPracticeQuestion table
//         await BatchPracticeQuestion.findOrCreate({
//           where: { batch_id, coding_question_id: questionId },
//           defaults: { created_by: req.user.id }
//         });
//       }
//     }

//     // Validate MCQ questions
//     if (mcq_question_ids && mcq_question_ids.length > 0) {
//       for (let questionId of mcq_question_ids) {
//         const mcqQuestion = await MCQQuestion.findByPk(questionId);

//         // Ensure the question exists and is of type 'practice'
//         if (!mcqQuestion || mcqQuestion.question_type !== 'practice') {
//           return res.status(400).json({ message: `MCQ question ID ${questionId} is either not found or is not a practice question.` });
//         }

//         // Add to BatchPracticeQuestion table
//         await BatchPracticeQuestion.findOrCreate({
//           where: { batch_id, mcq_question_id: questionId },
//           defaults: { created_by: req.user.id }
//         });
//       }
//     }

//     res.status(201).json({ message: 'Questions added to batch successfully' });
//   } catch (error) {
//     console.error('Error adding questions to batch:', error);
//     res.status(500).json({ message: 'Error adding questions to batch', error });
//   }
// };


exports.addQuestionsToBatch = async (req, res) => {
  const { batch_id } = req.params; // Get batch_id from URL
  const { coding_question_ids, mcq_question_ids } = req.body; // Get question IDs from the body

  try {
    // Validate coding questions
    if (coding_question_ids && coding_question_ids.length > 0) {
      for (let questionId of coding_question_ids) {
        const codingQuestion = await CodingQuestion.findByPk(questionId);

        // Ensure the question exists and is of type 'practice'
        if (!codingQuestion || codingQuestion.question_type !== 'practice') {
          return res.status(400).json({ message: `Coding question ID ${questionId} is either not found or is not a practice question.` });
        }

        // Add to BatchPracticeQuestion table
        await BatchPracticeQuestion.findOrCreate({
          where: { batch_id, coding_question_id: questionId },
          defaults: { created_by: req.user.id }
        });
      }
    }

    // Validate MCQ questions
    if (mcq_question_ids && mcq_question_ids.length > 0) {
      for (let questionId of mcq_question_ids) {
        const mcqQuestion = await MCQQuestion.findByPk(questionId);

        // Ensure the question exists and is of type 'practice'
        if (!mcqQuestion || mcqQuestion.question_type !== 'practice') {
          return res.status(400).json({ message: `MCQ question ID ${questionId} is either not found or is not a practice question.` });
        }

        // Add to BatchPracticeQuestion table
        await BatchPracticeQuestion.findOrCreate({
          where: { batch_id, mcq_question_id: questionId },
          defaults: { created_by: req.user.id }
        });
      }
    }

    res.status(201).json({ message: 'Questions added to batch successfully' });
  } catch (error) {
    console.error('Error adding questions to batch:', error);
    res.status(500).json({ message: 'Error adding questions to batch', error });
  }
};


// Controller to create a new assessment
exports.createAssessment = async (req, res) => {
  const { title, description, start_window, end_window, duration_minutes, is_active } = req.body;

  try {
    // Input validation (ensure required fields are filled)
    if (!title || !start_window || !end_window || !duration_minutes) {
      return res.status(400).json({ message: 'Title, Start Window, End Window, and Duration are required.' });
    }

    // Create the assessment
    const assessment = await Assessment.create({
      title,
      description,
      start_window,
      end_window,
      duration_minutes,
      is_active: is_active !== undefined ? is_active : true  // Default is_active to true if not provided
    });

    res.status(201).json({
      message: 'Assessment created successfully',
      assessment
    });
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({
      message: 'Error creating assessment',
      error
    });
  }
};




// Controller to create an assessment round
// exports.createAssessmentRound = async (req, res) => {
//   try {
//     const { assessment_id, round_type, round_order } = req.body;
//     const adminId = req.user.id;  // Assuming admin authentication provides admin ID

//     // Check if the assessment exists
//     const assessment = await Assessment.findByPk(assessment_id);
//     if (!assessment) {
//       return res.status(404).json({ message: 'Assessment not found' });
//     }

//     // Create a new assessment round
//     const assessmentRound = await AssessmentRound.create({
//       assessment_id,
//       round_type,
//       created_by: adminId
//     });

//     res.status(201).json({
//       message: 'Assessment round created successfully',
//       assessmentRound
//     });
//   } catch (error) {
//     console.error('Error creating assessment round:', error);
//     res.status(500).json({ message: 'Error creating assessment round', error });
//   }
// };


exports.createAssessmentRound = async (req, res) => {
  try {
    const { assessment_id, round_type } = req.body;
    const adminId = req.user.id;  // Assuming admin authentication provides admin ID

    // Check if the assessment exists
    const assessment = await Assessment.findByPk(assessment_id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Get the highest round_order for this assessment
    const lastRound = await AssessmentRound.findOne({
      where: { assessment_id },
      order: [['round_order', 'DESC']]
    });

    // If no round exists, set the round_order to 1, else increment the highest round_order
    const round_order = lastRound ? lastRound.round_order + 1 : 1;

    // Create a new assessment round
    const assessmentRound = await AssessmentRound.create({
      assessment_id,
      round_type,
      round_order,
      created_by: adminId
    });

    res.status(201).json({
      message: 'Assessment round created successfully',
      assessmentRound
    });
  } catch (error) {
    console.error('Error creating assessment round:', error);
    res.status(500).json({ message: 'Error creating assessment round', error });
  }
};




// Controller to fetch all rounds for an assessment
exports.getRoundsByAssessmentId = async (req, res) => {
  try {
    const { assessment_id } = req.params;

    // Fetch all rounds for the specified assessment
    const assessmentRounds = await AssessmentRound.findAll({
      where: { assessment_id },
      order: [['round_order', 'ASC']]
    });

    if (!assessmentRounds.length) {
      return res.status(404).json({ message: 'No rounds found for this assessment' });
    }

    res.status(200).json({
      message: 'Rounds fetched successfully',
      assessmentRounds
    });
  } catch (error) {
    console.error('Error fetching assessment rounds:', error);
    res.status(500).json({ message: 'Error fetching assessment rounds', error });
  }
};

// Controller to update an assessment round
exports.updateAssessmentRound = async (req, res) => {
  try {
    const { round_id } = req.params;
    const { round_type, round_order } = req.body;

    // Find the assessment round by ID
    const assessmentRound = await AssessmentRound.findByPk(round_id);
    if (!assessmentRound) {
      return res.status(404).json({ message: 'Assessment round not found' });
    }

    // Update the round details
    await assessmentRound.update({
      round_type,
      round_order
    });

    res.status(200).json({
      message: 'Assessment round updated successfully',
      assessmentRound
    });
  } catch (error) {
    console.error('Error updating assessment round:', error);
    res.status(500).json({ message: 'Error updating assessment round', error });
  }
};

// Controller to delete an assessment round
exports.deleteAssessmentRound = async (req, res) => {
  try {
    const { round_id } = req.params;

    // Find the assessment round by ID
    const assessmentRound = await AssessmentRound.findByPk(round_id);
    if (!assessmentRound) {
      return res.status(404).json({ message: 'Assessment round not found' });
    }

    // Delete the round
    await assessmentRound.destroy();

    res.status(200).json({ message: 'Assessment round deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment round:', error);
    res.status(500).json({ message: 'Error deleting assessment round', error });
  }
};



exports.updateAllRoundOrders = async (req, res) => {
  try {
    const { assessment_id } = req.params; // Assessment ID from URL
    const { rounds } = req.body; // Dictionary of round_id and their new round_order

    // Check if the assessment exists
    const assessment = await Assessment.findByPk(assessment_id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Extract all provided round orders and ensure they are unique
    const newRoundOrders = rounds.map(round => round.round_order);
    const uniqueRoundOrders = [...new Set(newRoundOrders)];

    if (newRoundOrders.length !== uniqueRoundOrders.length) {
      return res.status(400).json({ message: 'Duplicate round_order values found. Each round_order must be unique.' });
    }

    // Fetch all rounds for this assessment
    const existingRounds = await AssessmentRound.findAll({
      where: { assessment_id },
      order: [['round_order', 'ASC']]
    });

    // Validate that all round_ids provided exist within the fetched rounds
    const existingRoundIds = existingRounds.map(round => round.id);
    const providedRoundIds = rounds.map(round => round.round_id);

    if (!providedRoundIds.every(id => existingRoundIds.includes(id))) {
      return res.status(400).json({ message: 'Invalid round_id provided. Ensure all round_ids are valid for this assessment.' });
    }

    // Update round_order for each round
    for (let round of rounds) {
      await AssessmentRound.update(
        { round_order: round.round_order },  // Update the round_order
        { where: { id: round.round_id, assessment_id } }  // Ensure the round belongs to the correct assessment
      );
    }

    // Fetch updated rounds
    const updatedRounds = await AssessmentRound.findAll({
      where: { assessment_id },
      order: [['round_order', 'ASC']]
    });

    res.status(200).json({
      message: 'Round orders updated successfully',
      updatedRounds
    });
  } catch (error) {
    console.error('Error updating round orders:', error);
    res.status(500).json({ message: 'Error updating round orders', error });
  }
};



// Controller to fetch round IDs and round orders for a specific assessment
exports.getRoundIdsByAssessmentId = async (req, res) => {
  try {
    const { assessment_id } = req.params; // Get assessment_id from the request params

    // Fetch all rounds for the given assessment_id
    const assessmentRounds = await AssessmentRound.findAll({
      where: { assessment_id },
      attributes: ['id', 'round_order', 'round_type'], // Only fetch round id and round order
      order: [['round_order', 'ASC']] // Order rounds by their round order
    });

    if (!assessmentRounds.length) {
      return res.status(404).json({ message: 'No rounds found for this assessment' });
    }

    res.status(200).json({
      message: 'Rounds fetched successfully',
      rounds: assessmentRounds
    });
  } catch (error) {
    console.error('Error fetching round IDs:', error);
    res.status(500).json({ message: 'Error fetching round IDs', error });
  }
};



// Fetch a specific coding question by ID
exports.getCodingQuestionById = async (req, res) => {
  try {
    const { question_id } = req.params;

    // Find the coding question by ID
    const codingQuestion = await CodingQuestion.findByPk(question_id);

    if (!codingQuestion) {
      return res.status(404).json({ message: 'Coding Question not found' });
    }

    res.status(200).json({
      message: 'Coding Question fetched successfully',
      codingQuestion
    });
  } catch (error) {
    console.error('Error fetching coding question by ID:', error);
    res.status(500).json({
      message: 'Error fetching coding question',
      error
    });
  }
};



// Fetch a specific MCQ question by ID
exports.getMCQQuestionById = async (req, res) => {
  try {
    const { question_id } = req.params;

    // Find the MCQ question by ID
    const mcqQuestion = await MCQQuestion.findByPk(question_id);

    if (!mcqQuestion) {
      return res.status(404).json({ message: 'MCQ Question not found' });
    }

    res.status(200).json({
      message: 'MCQ Question fetched successfully',
      mcqQuestion
    });
  } catch (error) {
    console.error('Error fetching MCQ question by ID:', error);
    res.status(500).json({
      message: 'Error fetching MCQ question',
      error
    });
  }
};


// Controller to fetch all assessments
exports.getAllAssessments = async (req, res) => {
  try {
    // Fetch all assessments from the database
    const assessments = await Assessment.findAll();

    if (!assessments || assessments.length === 0) {
      return res.status(404).json({ message: 'No assessments found' });
    }

    // Return the list of assessments
    res.status(200).json({
      message: 'Assessments fetched successfully',
      assessments
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Error fetching assessments', error });
  }
};