const multer = require('multer');
const {AssessmentQuestion , MCQDomain, CodingQuestionDomain, Admin, AllowedLanguage,Trainer,StudentMcqAnswer   } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { CodingQuestion,  } = require('../models');
const { AssessmentRound, Assessment, CodingQuestion, PracticeQuestion, MCQQuestion, StudentSubmission, Batch} = require('../models');

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
      res.status(200).json({ message: 'Admin created successfully', admin });
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
    res.status(200).json({ message: 'Language added successfully', newLanguage });
  } catch (error) {
    res.status(500).json({ message: 'Error adding language', error });
  }
};




// Fetch all MCQ Domains in a tree structure
exports.getAllMCQDomains = async (req, res) => {
  try {
    // Fetch all MCQ domains from the database
    const mcqDomains = await MCQDomain.findAll();

    // Helper function to build the tree structure
    const buildTree = (domains, parentId = null) => {
      return domains
        .filter(domain => domain.parent_id === parentId)
        .map(domain => {
          return {
            id: domain.id,
            name: domain.name,
            admin_id: domain.admin_id,
            parent_id: domain.parent_id,
            children: buildTree(domains, domain.id) // Recursively build children
          };
        });
    };

    // Build the tree structure starting from the root nodes (parent_id = null)
    const domainTree = buildTree(mcqDomains);

    res.status(200).json({
      message: 'MCQ Domains fetched successfully',
      domains: domainTree
    });
  } catch (error) {
    console.error('Error fetching MCQ Domains:', error);
    res.status(500).json({ message: 'Error fetching MCQ Domains', error });
  }
};






// Fetch all Coding Domains in a tree structure
exports.getAllCodingDomains = async (req, res) => {
  try {
    // Fetch all Coding domains from the database
    const codingDomains = await CodingQuestionDomain.findAll();

    // Helper function to build the tree structure
    const buildTree = (domains, parentId = null) => {
      return domains
        .filter(domain => domain.parent_id === parentId)
        .map(domain => {
          return {
            id: domain.id,
            name: domain.name,
            admin_id: domain.admin_id,
            parent_id: domain.parent_id,
            children: buildTree(domains, domain.id) // Recursively build children
          };
        });
    };

    // Build the tree structure starting from the root nodes (parent_id = null)
    const domainTree = buildTree(codingDomains);

    res.status(200).json({
      message: 'Coding Domains fetched successfully',
      domains: domainTree
    });
  } catch (error) {
    console.error('Error fetching Coding Domains:', error);
    res.status(500).json({ message: 'Error fetching Coding Domains', error });
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

    res.status(200).json({ message: 'MCQ Domain created successfully', mcqDomain });
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

    res.status(200).json({ message: 'Coding Domain created successfully', codingDomain });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Coding Domain', error });
  }
};




// // Add MCQ Domain
// exports.addMCQDomain = async (req, res) => {
//   try {
//     const { name, parent_id } = req.body;  
    
//     // Create new MCQ domain
//     const mcqDomain = await MCQDomain.create({
//       name,
//       parent_id: parent_id || null,  
//       admin_id: req.user.id  
//     });

//     // Fetch the newly created domain with its children
//     const newDomain = await MCQDomain.findByPk(mcqDomain.id);

//     res.status(200).json({ message: 'MCQ Domain created successfully', mcqDomain: newDomain });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating MCQ Domain', error });
//   }
// };

// // Add Coding Domain
// exports.addCodingDomain = async (req, res) => {
//   try {
//     const { name, parent_id } = req.body;

//     // Create new Coding domain
//     const codingDomain = await CodingQuestionDomain.create({
//       name,
//       parent_id: parent_id || null,
//       admin_id: req.user.id
//     });

//     // Fetch the newly created domain with its children
//     const newDomain = await CodingQuestionDomain.findByPk(codingDomain.id);

//     res.status(200).json({ message: 'Coding Domain created successfully', codingDomain: newDomain });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating Coding Domain', error });
//   }
// };


// Fetch Child Domains of a Specific Domain
exports.getcodingChildDomains = async (req, res) => {
  try {
    const { parent_id } = req.params; // Get the parent_id from route parameters

    // Fetch all domains where the parent_id matches the provided ID
    const childDomains = await CodingQuestionDomain.findAll({
      where: { parent_id }, // Sequelize query to filter by parent_id
    });

    if (childDomains.length === 0) {
      return res.status(200).json({
        message: 'No child domains found for the provided parent ID',
        childDomains: [],
      });
    }

    res.status(200).json({
      message: 'Child domains fetched successfully',
      childDomains,
    });
  } catch (error) {
    console.error('Error fetching child domains:', error);
    res.status(500).json({ message: 'Error fetching child domains', error });
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
// exports.editCodingDomain = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, parent_id } = req.body;

//     // Find the domain by ID
//     const codingDomain = await CodingQuestionDomain.findByPk(id);
//     if (!codingDomain) {
//       return res.status(404).json({ message: 'Coding Domain not found' });
//     }

//     // Update domain details
//     codingDomain.name = name || codingDomain.name;
//     codingDomain.parent_id = parent_id || codingDomain.parent_id;

//     await codingDomain.save();
//     res.status(200).json({ message: 'Coding Domain updated successfully', codingDomain });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating Coding Domain', error });
//   }
// };


// Edit Coding Domain
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

    // Update domain details, ensuring parent_id can be set to null if explicitly provided
    if (name !== undefined) {
      codingDomain.name = name;
    }

    if (req.body.hasOwnProperty('parent_id')) {
      codingDomain.parent_id = parent_id; // Allows setting parent_id to a value, even null
    }

    await codingDomain.save();

    res.status(200).json({
      message: 'Coding Domain updated successfully',
      codingDomain,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating Coding Domain',
      error: error.message,
    });
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

    res.status(200).json({
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


// Controller to edit an existing assessment
exports.editAssessment = async (req, res) => {
  const { assessment_id } = req.params; // Assessment ID from URL params
  const { title, description, start_window, end_window, duration_minutes, is_active } = req.body;

  try {
    // Check if the assessment exists
    const assessment = await Assessment.findByPk(assessment_id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Update the assessment fields
    assessment.title = title || assessment.title;
    assessment.description = description || assessment.description;
    assessment.start_window = start_window || assessment.start_window;
    assessment.end_window = end_window || assessment.end_window;
    assessment.duration_minutes = duration_minutes || assessment.duration_minutes;
    assessment.is_active = is_active !== undefined ? is_active : assessment.is_active;

    // Save the updated assessment
    await assessment.save();

    res.status(200).json({
      message: 'Assessment updated successfully',
      assessment
    });
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({
      message: 'Error updating assessment',
      error
    });
  }
};
// Controller to delete an assessment
exports.deleteAssessment = async (req, res) => {
  const { assessment_id } = req.params; // Assessment ID from URL params

  try {
    // Check if the assessment exists
    const assessment = await Assessment.findByPk(assessment_id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Delete the assessment
    await assessment.destroy();

    res.status(200).json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({
      message: 'Error deleting assessment',
      error
    });
  }
};



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

    res.status(200).json({
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

exports.updateAssessmentRound = async (req, res) => {
  const { round_id } = req.params;
  const { round_type } = req.body;
  console.log(`Editing round ID: ${round_id} with data:`, req.body);  // Debug
  try {
    const round = await AssessmentRound.update(
      { round_type },
      { where: { id: round_id } }
    );
    console.log('Round updated:', round);  // Debug
    res.status(200).json({ message: 'Round updated successfully', round });
  } catch (error) {
    console.error('Error updating round:', error);  // Debug
    res.status(500).json({ message: 'Error updating round', error });
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
      // Return 200 status with a clear message if no rounds found
      return res.status(200).json({
        message: 'No rounds found for this assessment',
        rounds: []
      });
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



// exports.getCodingQuestionsByDomain = async (req, res) => {
//   try {
//       const { domain_id } = req.params;
//       const student_id = req.user.id; // Extracted from JWT token

//       // Fetch all Coding questions that belong to the specified domain
//       const codingQuestions = await CodingQuestion.findAll({
//           where: { codingquestiondomain_id: domain_id, approval_status: 'approved', question_type: 'practice' },
//           attributes: [
//               'id', 'title', 'description', 'input_format', 'output_format',
//               'test_cases', 'constraints', 'difficulty', 'allowed_languages', 'solutions'
//           ]
//       });

//       if (!codingQuestions || codingQuestions.length === 0) {
//           return res.status(204).json({ message: 'No coding questions found for this domain', codingQuestions: [] });
//       }

//       // Fetch student's submission details for each question in the specified domain
//       const questionIds = codingQuestions.map(q => q.id);
//       const studentSubmissions = await StudentSubmission.findAll({
//           where: {
//               student_id: student_id,
//               domain_id: domain_id,
//               question_id: questionIds
//           },
//           attributes: ['question_id', 'score', 'status', 'language', 'solution_code', 'question_points', 'is_reported', 'report_text']
//       });

//       // Organize submissions by question ID for easy lookup
//       const submissionMap = studentSubmissions.reduce((acc, submission) => {
//           acc[submission.question_id] = submission;
//           return acc;
//       }, {});

//       // Add submission details to each question object
//       const responseQuestions = codingQuestions.map(question => ({
//           id: question.id,
//           title: question.title,
//           description: question.description,
//           input_format: question.input_format,
//           output_format: question.output_format,
//           test_cases: question.test_cases,
//           constraints: question.constraints,
//           difficulty: question.difficulty,
//           allowed_languages: question.allowed_languages,
//           solutions: question.solutions,
//           // Additional fields from StudentSubmission
//           score: submissionMap[question.id]?.score || null,
//           status: submissionMap[question.id]?.status || 'not_attempted',
//           language: submissionMap[question.id]?.language || null,
//           solution_code: submissionMap[question.id]?.solution_code || null,
//           question_points: submissionMap[question.id]?.question_points || null,
//           is_reported: submissionMap[question.id]?.is_reported || false,
//           report_text: submissionMap[question.id]?.report_text || null
//       }));

//       // Return the found coding questions with submission details
//       res.status(200).json({ message: 'Coding Questions fetched successfully', codingQuestions: responseQuestions });
//   } catch (error) {
//       console.error('Error fetching Coding Questions:', error);
//       res.status(500).json({ message: 'Error fetching Coding Questions', error });
//   }
// };
















// exports.getCodingQuestionsByDomain = async (req, res) => {
//   try {
//     const { domain_id } = req.params; // Get the domain ID from the request params
//     const student_id = req.user.id; // Extract student ID from the JWT token

//     // Fetch all Coding Questions that belong to the specified domain and are approved for practice
//     const codingQuestions = await CodingQuestion.findAll({
//       where: {
//         codingquestiondomain_id: domain_id,
//         approval_status: 'approved',
//         question_type: 'practice',
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
//       ],
//     });

//     if (!codingQuestions || codingQuestions.length === 0) {
//       return res
//         .status(204)
//         .json({ message: 'No coding questions found for this domain', codingQuestions: [] });
//     }

//     // Map through the questions to parse and enrich the test cases and solutions
//     const responseQuestions = codingQuestions.map((question) => {
//       // Ensure test cases are parsed correctly
//       // const parsedTestCases = JSON.parse(question.test_cases).map((testCase) => ({
//       //   ...testCase,
//       //   input: isNaN(Number(testCase.input)) ? testCase.input : Number(testCase.input), // Convert numeric input to number if applicable
//       // }));

//       // // Ensure allowed languages are parsed correctly
//       // const parsedAllowedLanguages = Array.isArray(question.allowed_languages)
//       //   ? question.allowed_languages
//       //   : JSON.parse(question.allowed_languages);

//       // // Ensure solutions are parsed correctly
//       // const parsedSolutions = JSON.parse(question.solutions);

//       const safeParseJSON = (input, fallback = []) => {
//         try {
//           return typeof input === 'string' ? JSON.parse(input) : input;
//         } catch (e) {
//           console.error(`Failed to parse JSON: ${input}`, e);
//           return fallback;
//         }
//       };
      
//       // Safely parse fields
//       const parsedTestCases = safeParseJSON(question.test_cases).map((testCase) => ({
//         ...testCase,
//         input: isNaN(Number(testCase.input)) ? testCase.input : Number(testCase.input),
//       }));
      
//       const parsedAllowedLanguages = safeParseJSON(question.allowed_languages);
      
//       const parsedSolutions = safeParseJSON(question.solutions);
      
//       return {
//         ...question.toJSON(),
//         test_cases: parsedTestCases,
//         allowed_languages: parsedAllowedLanguages,
//         solutions: parsedSolutions,
//       };
//     });

//     // Fetch student's submission details for each question in the specified domain
//     const questionIds = responseQuestions.map((q) => q.id);
//     const studentSubmissions = await StudentSubmission.findAll({
//       where: {
//         student_id: student_id,
//         domain_id: domain_id,
//         question_id: questionIds,
//       },
//       attributes: [
//         'question_id',
//         'score',
//         'status',
//         'language',
//         'solution_code',
//         'question_points',
//         'is_reported',
//         'report_text',
//       ],
//     });

//     // Organize submissions by question ID for easy lookup
//     const submissionMap = studentSubmissions.reduce((acc, submission) => {
//       acc[submission.question_id] = submission;
//       return acc;
//     }, {});

//     // Add submission details to each question object
//     const enrichedQuestions = responseQuestions.map((question) => ({
//       ...question,
//       score: submissionMap[question.id]?.score || null,
//       status: submissionMap[question.id]?.status || 'not_attempted',
//       language: submissionMap[question.id]?.language || null,
//       solution_code: submissionMap[question.id]?.solution_code || null,
//       question_points: submissionMap[question.id]?.question_points || null,
//       is_reported: submissionMap[question.id]?.is_reported || false,
//       report_text: submissionMap[question.id]?.report_text || null,
//     }));

//     // Return the enriched questions
//     res.status(200).json({
//       message: 'Coding Questions fetched successfully',
//       codingQuestions: enrichedQuestions,
//     });
//   } catch (error) {
//     console.error('Error fetching Coding Questions:', error);
//     res.status(500).json({
//       message: 'Error fetching Coding Questions',
//       error: error.message,
//     });
//   }
// };











exports.getCodingQuestionsByDomain = async (req, res) => {
  try {
    const { domain_id } = req.params; // Extract domain ID from the request params
    const student_id = req.user.id; // Extract student ID from the JWT token

    // Debugging
    console.log(`[DEBUG] Fetching Coding Questions for Domain ID: ${domain_id} and Student ID: ${student_id}`);

    // Fetch all coding questions for the domain with approval and practice type
    const codingQuestions = await CodingQuestion.findAll({
      where: {
        codingquestiondomain_id: domain_id,
        approval_status: 'approved',
        question_type: 'practice',
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
        'solutions',
      ],
    });

    // Handle no coding questions found
    if (!codingQuestions || codingQuestions.length === 0) {
      console.log(`[DEBUG] No Coding Questions found for Domain ID: ${domain_id}`);
      return res.status(204).json({
        message: 'No coding questions found for this domain',
        codingQuestions: [],
      });
    }

    console.log(`[DEBUG] Found ${codingQuestions.length} Coding Questions`);

    // Function to safely parse JSON fields
    const safeParseJSON = (input, fallback = []) => {
      try {
        return typeof input === 'string' ? JSON.parse(input) : input;
      } catch (error) {
        console.error(`[ERROR] Failed to parse JSON for input: ${input}`, error);
        return fallback;
      }
    };

    // Process each question: Parse fields and handle test cases, solutions, etc.
    const responseQuestions = codingQuestions.map((question) => {
      const parsedTestCases = safeParseJSON(question.test_cases).map((testCase) => ({
        ...testCase,
        input: String(testCase.input), // Ensure input is always a string
      }));
      const parsedAllowedLanguages = safeParseJSON(question.allowed_languages);
      const parsedSolutions = safeParseJSON(question.solutions);

      // Debug parsed fields
      console.log(`[DEBUG] Parsed Test Cases for Question ID ${question.id}:`, parsedTestCases);
      console.log(`[DEBUG] Parsed Allowed Languages for Question ID ${question.id}:`, parsedAllowedLanguages);
      console.log(`[DEBUG] Parsed Solutions for Question ID ${question.id}:`, parsedSolutions);

      return {
        ...question.toJSON(),
        test_cases: parsedTestCases,
        allowed_languages: parsedAllowedLanguages,
        solutions: parsedSolutions,
      };
    });

    // Fetch student submissions for these questions
    const questionIds = responseQuestions.map((q) => q.id);
    const studentSubmissions = await StudentSubmission.findAll({
      where: {
        student_id: student_id,
        domain_id: domain_id,
        question_id: questionIds,
      },
      attributes: [
        'question_id',
        'score',
        'status',
        'language',
        'solution_code',
        'question_points',
        'is_reported',
        'report_text',
      ],
    });

    console.log(`[DEBUG] Found ${studentSubmissions.length} Student Submissions`);

    // Create a map of submissions by question ID for easy lookup
    const submissionMap = studentSubmissions.reduce((acc, submission) => {
      acc[submission.question_id] = submission;
      return acc;
    }, {});

    // Enrich the questions with submission details
    const enrichedQuestions = responseQuestions.map((question) => ({
      ...question,
      score: submissionMap[question.id]?.score || null,
      status: submissionMap[question.id]?.status || 'not_attempted',
      language: submissionMap[question.id]?.language || null,
      solution_code: submissionMap[question.id]?.solution_code || null,
      question_points: submissionMap[question.id]?.question_points || null,
      is_reported: submissionMap[question.id]?.is_reported || false,
      report_text: submissionMap[question.id]?.report_text || null,
    }));

    // Debug enriched questions
    console.log(`[DEBUG] Enriched Questions:`, enrichedQuestions);

    // Return the enriched questions
    res.status(200).json({
      message: 'Coding Questions fetched successfully',
      codingQuestions: enrichedQuestions,
    });
  } catch (error) {
    console.error('[ERROR] Error fetching Coding Questions:', error);
    res.status(500).json({
      message: 'Error fetching Coding Questions',
      error: error.message,
    });
  }
};



















exports.getMCQQuestionsByDomain = async (req, res) => {
  try {
    const { domain_id } = req.params;
    // const student_id = req.user?.student_id; // Extract student_id from req.user
    const student_id = req.user.id; // Use `id` instead of `student_id`

    // Check if student_id is correctly set
    if (!student_id) {
      console.error('Student ID is undefined.');
      return res.status(400).json({ message: 'Student ID is required' });
    }

    // Fetch all MCQ questions for the specified domain
    const mcqQuestions = await MCQQuestion.findAll({
      where: { mcqdomain_id: domain_id, approval_status: 'approved', question_type: 'practice'  },
      attributes: [
        'id', 'title', 'options', 'correct_answers', 'is_single_answer',
        'mcqdomain_id', 'code_snippets', 'question_type', 'approval_status',
        'created_by', 'difficulty', 'round_id', 'createdAt', 'updatedAt'
      ],
      raw: true
    });

    // Fetch StudentMcqAnswer data for the specified student and domain
    const studentAnswers = await StudentMcqAnswer.findAll({
      where: { student_id: student_id, domain_id: domain_id },
      attributes: [
        'question_id', 'submitted_options', 'is_attempted', 'points', 
        'marked', 'is_reported', 'reported_text'
      ],
      raw: true
    });

    // Map student answers to their respective question IDs for quick lookup
    const studentAnswersMap = studentAnswers.reduce((map, answer) => {
      map[answer.question_id] = answer;
      return map;
    }, {});

    // Combine MCQ question data with StudentMcqAnswer data and default values where missing
    const combinedData = mcqQuestions.map((question) => {
      // Find corresponding student answer or use default values if none exists
      const studentAnswer = studentAnswersMap[question.id] || {
        submitted_options: null,
        is_attempted: false,
        points: 0,
        marked: false,
        is_reported: false,
        reported_text: null,
      };

      return {
        ...question,
        submitted_options: studentAnswer.submitted_options,
        is_attempted: studentAnswer.is_attempted,
        points: studentAnswer.points,
        marked: studentAnswer.marked,
        is_reported: studentAnswer.is_reported,
        reported_text: studentAnswer.reported_text,
      };
    });

    res.status(200).json({ message: 'MCQ Questions fetched successfully', mcqQuestions: combinedData });
  } catch (error) {
    console.error('Error fetching MCQ Questions:', error);
    res.status(500).json({ message: 'Error fetching MCQ Questions', error });
  }
};



exports.updateCodingQuestionsDomain = async (req, res) => {
  try {
    const { question_ids, codingquestiondomain_id } = req.body; // Extract question IDs and new domain ID from request body

    // Check if both question_ids and codingquestiondomain_id are provided
    if (!question_ids || !Array.isArray(question_ids) || question_ids.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty question IDs array' });
    }

    if (!codingquestiondomain_id) {
      return res.status(400).json({ message: 'Coding question domain ID is required' });
    }

    // Update all coding questions with the provided IDs
    const updatedCount = await CodingQuestion.update(
      { codingquestiondomain_id }, // New domain ID to set
      { where: { id: question_ids } } // Filter questions by their IDs
    );

    // If no questions were updated, return an error
    if (updatedCount[0] === 0) {
      return res.status(404).json({ message: 'No matching coding questions found to update' });
    }

    res.status(200).json({
      message: 'Coding questions updated successfully',
      updatedCount: updatedCount[0], // Number of updated records
    });
  } catch (error) {
    console.error('Error updating coding questions domain:', error); // Log the error for debugging
    res.status(500).json({
      message: 'Error updating coding questions domain',
      error: error.message || error,
    });
  }
};



// Fetch Child MCQ Domains
exports.getmcqChildDomains = async (req, res) => {
  try {
    const { parent_id } = req.params; // Get the parent_id from route parameters

    // Fetch all MCQ domains where the parent_id matches the provided ID
    const childDomains = await MCQDomain.findAll({
      where: { parent_id }, // Sequelize query to filter by parent_id
    });

    if (childDomains.length === 0) {
      return res.status(200).json({
        message: 'No child domains found for the provided parent ID',
        childDomains: [],
      });
    }

    res.status(200).json({
      message: 'Child MCQ domains fetched successfully',
      childDomains,
    });
  } catch (error) {
    console.error('Error fetching child MCQ domains:', error);
    res.status(500).json({ message: 'Error fetching child MCQ domains', error });
  }
};



exports.updateMCQQuestionsDomain = async (req, res) => {
  try {
    const { question_ids, mcqdomain_id } = req.body; // Extract question IDs and new domain ID from request body

    // Validate input
    if (!question_ids || !Array.isArray(question_ids) || question_ids.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty question IDs array' });
    }

    if (!mcqdomain_id) {
      return res.status(400).json({ message: 'MCQ Domain ID is required' });
    }

    // Update all MCQ questions with the provided IDs
    const updatedCount = await MCQQuestion.update(
      { mcqdomain_id }, // New domain ID to set
      { where: { id: question_ids } } // Filter questions by their IDs
    );

    // If no questions were updated, return an error
    if (updatedCount[0] === 0) {
      return res.status(404).json({ message: 'No matching MCQ questions found to update' });
    }

    res.status(200).json({
      message: 'MCQ questions updated successfully',
      updatedCount: updatedCount[0], // Number of updated records
    });
  } catch (error) {
    console.error('Error updating MCQ questions domain:', error); // Log the error for debugging
    res.status(500).json({
      message: 'Error updating MCQ questions domain',
      error: error.message || error,
    });
  }
};
