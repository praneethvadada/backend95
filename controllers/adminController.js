const multer = require('multer');
const { MCQDomain, CodingQuestionDomain, Admin, AllowedLanguage } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { CodingQuestion, PracticeQuestion, MCQQuestion, Batch, BatchPracticeQuestion} = require('../models');

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
exports.updateCodingQuestionApprovalStatus = async (req, res) => {
  try {
    const { question_id } = req.params;  // Get question ID from URL
    const {  approval_status } = req.body;

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

    // If approved and it's a practice question, add to PracticeQuestions table
    if (approval_status === 'approved' && codingQuestion.question_type === 'practice') {
      await PracticeQuestion.create({
        coding_question_id: codingQuestion.id,
        created_by: req.user.id
      });
    }

    res.status(200).json({ message: 'Coding Question approval status updated successfully', codingQuestion });
  } catch (error) {
    console.error('Error updating coding question approval status:', error);
    res.status(500).json({ message: 'Error updating coding question approval status', error });
  }
};



// Admin updates the approval status of an MCQ question
exports.updateMCQQuestionApprovalStatus = async (req, res) => {
  try {
    const { question_id } = req.params;  // Get question ID from URL

    const {  approval_status } = req.body;

    // Validate approval_status
    if (!['approved', 'rejected', 'pending'].includes(approval_status)) {
      return res.status(400).json({ message: 'Invalid approval status' });
    }

    // Find the MCQ question by ID
    const mcqQuestion = await MCQQuestion.findByPk(question_id);

    if (!mcqQuestion) {
      return res.status(404).json({ message: 'MCQ Question not found' });
    }

    // Update approval status
    mcqQuestion.approval_status = approval_status;
    await mcqQuestion.save();

    // If approved and it's a practice question, add to PracticeQuestions table
    if (approval_status === 'approved' && mcqQuestion.question_type === 'practice') {
      await PracticeQuestion.create({
        mcq_question_id: mcqQuestion.id,
        created_by: req.user.id
      });
    }

    res.status(200).json({ message: 'MCQ Question approval status updated successfully', mcqQuestion });
  } catch (error) {
    console.error('Error updating MCQ question approval status:', error);
    res.status(500).json({ message: 'Error updating MCQ question approval status', error });
  }
};


// Admin fetches all pending coding questions
exports.getAllPendingCodingQuestions = async (req, res) => {
  try {
    // Fetch all coding questions with approval_status set to 'pending'
    const pendingCodingQuestions = await CodingQuestion.findAll({
      where: { approval_status: 'pending' }
    });

    if (!pendingCodingQuestions.length) {
      return res.status(404).json({ message: 'No pending coding questions found' });
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
      return res.status(404).json({ message: 'No pending MCQ questions found' });
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


exports.addQuestionsToBatch = async (req, res) => {
  try {
    const { batch_id } = req.params; // Get batch_id from params
    const { coding_question_ids, mcq_question_ids } = req.body; // Get the question IDs from the request body

    // Log the incoming data for debugging
    console.log('Batch ID:', batch_id);
    console.log('Coding Question IDs:', coding_question_ids);
    console.log('MCQ Question IDs:', mcq_question_ids);

    // Process Coding Questions
    if (coding_question_ids && coding_question_ids.length > 0) {
      for (let codingQuestionId of coding_question_ids) {
        // Log each coding question ID being processed
        console.log('Processing Coding Question ID:', codingQuestionId);

        const [batchPracticeQuestion, created] = await BatchPracticeQuestion.findOrCreate({
          where: {
            batch_id: batch_id,
            coding_question_id: codingQuestionId,
          },
          defaults: {
            created_by: req.user.id, // Assuming req.user.id holds the admin's ID
          },
        });

        // Log the result of each insert
        if (created) {
          console.log(`Coding Question ID ${codingQuestionId} added to batch ${batch_id}`);
        } else {
          console.log(`Coding Question ID ${codingQuestionId} already exists in batch ${batch_id}`);
        }
      }
    }

    // Process MCQ Questions
    if (mcq_question_ids && mcq_question_ids.length > 0) {
      for (let mcqQuestionId of mcq_question_ids) {
        // Log each MCQ question ID being processed
        console.log('Processing MCQ Question ID:', mcqQuestionId);

        const [batchPracticeQuestion, created] = await BatchPracticeQuestion.findOrCreate({
          where: {
            batch_id: batch_id,
            mcq_question_id: mcqQuestionId,
          },
          defaults: {
            created_by: req.user.id,
          },
        });

        // Log the result of each insert
        if (created) {
          console.log(`MCQ Question ID ${mcqQuestionId} added to batch ${batch_id}`);
        } else {
          console.log(`MCQ Question ID ${mcqQuestionId} already exists in batch ${batch_id}`);
        }
      }
    }

    res.status(201).json({ message: 'Questions added to batch successfully' });

  } catch (error) {
    // Log the error
    console.error('Error adding questions to batch:', error);
    res.status(500).json({ message: 'Error adding questions to batch', error });
  }
};
