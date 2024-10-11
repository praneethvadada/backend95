const multer = require('multer');
const { MCQDomain, CodingQuestionDomain, Admin, AllowedLanguage } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { CodingQuestion, PracticeQuestion, MCQQuestion } = require('../models');

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