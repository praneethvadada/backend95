const { Trainer, MCQQuestion } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { CodingQuestion, AllowedLanguage , CodingQuestionLanguage } = require('../models');
const crypto = require('crypto');
// const {  } = require('../models');
const nodemailer = require('nodemailer');
// Admin adds a new trainer
exports.createTrainer = async (req, res) => {
  try 
  {
    const { name, email, password, admin_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new trainer
    const trainer = await Trainer.create({
      name,
      email,
      password: hashedPassword,
      admin_id
    });
    
    res.status(201).json({ message: 'Trainer created successfully', trainer });
  } catch (error) {
    res.status(500).json({ message: 'Error creating trainer', error });
  }
};

// Trainer login
exports.trainerLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const trainer = await Trainer.findOne({ where: { email } });
  
      if (!trainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }
  
      const isMatch = await bcrypt.compare(password, trainer.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate token with TRAINER secret
      const token = jwt.sign({ id: trainer.id, role: 'trainer' }, process.env.TRAINER_JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Login error', error });
    }
  };



// Add MCQ Question
// exports.addMCQQuestion = async (req, res) => {
//   try {
//     const { title, options, correct_answers, is_single_answer, mcqdomain_id, code_snippets, question_type, round_id } = req.body;

//     // Create new MCQ question
//     const mcqQuestion = await MCQQuestion.create({
//       title,
//       options,
//       correct_answers,
//       is_single_answer: is_single_answer || true,  // Default to true
//       mcqdomain_id: mcqdomain_id || null,  // Optional domain ID
//       code_snippets: code_snippets || null,  // Optional code snippets
//       question_type,
//       approval_status: 'Pending',  // Automatically set to 'Pending' for Admin review
//       created_by: req.user.id,  // Trainer's ID, assuming it's stored in req.user.id
//       round_id: round_id || null  // Add round_id, allow it to be null if not provided
//     }); 

//     res.status(201).json({ message: 'MCQ Question created successfully', mcqQuestion });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating MCQ Question', error });
//   }
// };


exports.addMCQQuestion = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { 
      title, 
      options, 
      correct_answers, 
      is_single_answer, 
      mcqdomain_id, 
      difficulty,
      code_snippets, 
      question_type, 
      round_id 
    } = req.body;

    // Debugging: log the incoming request body
    console.log('Received MCQ question data:', {
      title,
      options,
      correct_answers,
      is_single_answer,
      mcqdomain_id,
      difficulty,
      code_snippets,
      question_type,
      round_id
    });

    // Ensure the required fields are present
    if (!title || !options || !correct_answers || !question_type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Further validation for options and correct answers
    if (!Array.isArray(options) || !Array.isArray(correct_answers)) {
      return res.status(400).json({ message: 'Options and correct_answers must be arrays' });
    }

    // Default values: setting 'is_single_answer' to true if not provided
    const isSingleAnswer = typeof is_single_answer !== 'undefined' ? is_single_answer : true;

    // Create new MCQ question
    const mcqQuestion = await MCQQuestion.create({
      title,
      options,
      correct_answers,
      is_single_answer: isSingleAnswer,
      mcqdomain_id: mcqdomain_id || null,  // Optional domain ID, defaults to null
      code_snippets: code_snippets || null,  // Optional code snippets
      question_type,
      difficulty: difficulty || 'Level1', // Default difficulty is Level1 if not provided
      approval_status: 'Pending',  // Automatically set to 'Pending' for Admin review
      created_by: req.user.id,  // Assuming req.user.id holds the Trainer's ID
      round_id: round_id || null  // Optional round_id, defaults to null if not provided
    });

    // Debugging: log the created MCQ question
    console.log('MCQ question created successfully:', mcqQuestion);

    // Respond with success message and the created question
    res.status(200).json({ 
      message: 'MCQ Question created successfully', 
      mcqQuestion 
    });

  } catch (error) {
    // Debugging: log the error encountered
    console.error('Error creating MCQ Question:', error);

    // Return server error response
    res.status(500).json({ 
      message: 'Error creating MCQ Question', 
      error 
    });
  }
};



// Trainer adds a new coding question
exports.addCodingQuestion = async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log("Received request body:", req.body);

    const {
      title,
      description,
      input_format,
      output_format,
      test_cases,
      constraints,
      difficulty,
      solutions,
      allowed_languages,
      codingquestiondomain_id,
      question_type,
      round_id,
    } = req.body;

    // Debugging - log the allowed_languages before proceeding
    console.log("Allowed languages received:", allowed_languages);

    // Check if allowed_languages is present, fallback to default if not
    const languages = allowed_languages && allowed_languages.length > 0 ? allowed_languages : ["Python"];  // Default to Python if empty
    console.log("Languages used for creation:", languages);  // Debugging

    // Check for codingquestiondomain_id and ensure it's null if not provided
    const domainId = codingquestiondomain_id || null;
    console.log("Domain ID used for creation:", domainId);  // Debugging

    // Create the coding question
    const codingQuestion = await CodingQuestion.create({
      title,
      description,
      input_format,
      output_format,
      test_cases,
      constraints: constraints || null,
      difficulty: difficulty || null,
      solutions: solutions || null,
      allowed_languages: languages,  // Debugging point to see what gets passed here
      codingquestiondomain_id: domainId,  // Explicitly set to null if not provided
      question_type,
      approval_status: 'pending',
      created_by: req.user.id,
      round_id: round_id || null  // Add round_id, allow it to be null if not provided

    });

    // Debugging - confirm successful creation
    console.log("Coding question created:", codingQuestion);

    res.status(201).json({ message: 'Coding Question created successfully', codingQuestion });
  } catch (error) {
    // Debugging - log the error if something fails
    console.error("Error creating Coding Question:", error);

    res.status(500).json({ message: 'Error creating coding question', error });
  }
};


// exports.addCodingQuestion = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       input_format,
//       output_format,
//       test_cases,
//       constraints,
//       difficulty,
//       solutions, // Multiple solutions from the request body
//       allowed_languages,
//       codingquestiondomain_id,
//       question_type,
//       round_id
//     } = req.body;

//     // Debugging: Log the request body
//     console.log('Received coding question data:', req.body);

//     // Ensure required fields are present
//     if (!title || !description || !input_format || !output_format || !test_cases || !allowed_languages || !solutions) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Ensure solutions is an array of objects
//     if (!Array.isArray(solutions) || solutions.length === 0) {
//       return res.status(400).json({ message: 'Solutions must be a non-empty array' });
//     }

//     // Ensure test cases are in the correct format (array of objects)
//     if (!Array.isArray(test_cases)) {
//       return res.status(400).json({ message: 'Test cases must be a valid array' });
//     }

//     // Create a new coding question
//     const codingQuestion = await CodingQuestion.create({
//       title,
//       description,
//       input_format,
//       output_format,
//       test_cases, // Save test cases as a JSON array
//       constraints: constraints || null, // Optional constraints
//       difficulty: difficulty || 'Level1', // Default difficulty is Level1 if not provided
//       solutions, // Save the array of solutions in the 'solutions' field
//       allowed_languages, // Store allowed languages as a JSON array
//       codingquestiondomain_id: codingquestiondomain_id || null, // Optional domain ID
//       question_type,
//       approval_status: 'pending', // Set approval status to 'pending'
//       created_by: req.user.id, // Assume `req.user.id` is the ID of the trainer
//       round_id: round_id || null // Optional round ID
//     });

//     // Log the newly created coding question for debugging
//     console.log('Coding question created successfully:', codingQuestion);

//     // Return a success response with the created coding question
//     res.status(201).json({
//       message: 'Coding Question created successfully',
//       codingQuestion
//     });
//   } catch (error) {
//     // Log the error for debugging
//     console.error('Error creating coding question:', error);

//     // Return a 500 Internal Server Error response
//     res.status(500).json({
//       message: 'Error creating coding question',
//       error
//     });
//   }
// };


// exports.addCodingQuestion = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       input_format,
//       output_format,
//       test_cases,
//       constraints,
//       difficulty,
//       solutions, // Multiple solutions from the request body
//       allowed_languages, // Expecting array of language IDs
//       codingquestiondomain_id,
//       question_type,
//       round_id
//     } = req.body;

//     // Log received coding question data for debugging
//     console.log('Received coding question data:', req.body);

//     // Ensure required fields are present
//     if (!title || !description || !input_format || !output_format || !test_cases || !allowed_languages || !solutions) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Ensure solutions is an array of objects
//     if (!Array.isArray(solutions) || solutions.length === 0) {
//       return res.status(400).json({ message: 'Solutions must be a non-empty array' });
//     }

//     // Ensure test cases are in the correct format (array of objects)
//     if (!Array.isArray(test_cases)) {
//       return res.status(400).json({ message: 'Test cases must be a valid array' });
//     }

//     // Fetch the allowed languages from the database to validate them
//     const existingLanguages = await AllowedLanguage.findAll({
//       where: { id: allowed_languages },
//       attributes: ['id', 'language_name']
//     });

//     // Check if all provided languages exist in the AllowedLanguages table
//     if (existingLanguages.length !== allowed_languages.length) {
//       return res.status(400).json({ message: 'One or more selected languages are not allowed' });
//     }

//     // Create the coding question with validated allowed languages
//     const codingQuestion = await CodingQuestion.create({
//       title,
//       description,
//       input_format,
//       output_format,
//       test_cases, // Save test cases as a JSON array
//       constraints: constraints || null, // Optional constraints
//       difficulty: difficulty || 'Level1', // Default difficulty is Level1 if not provided
//       solutions, // Save the array of solutions in the 'solutions' field
//       allowed_languages: existingLanguages.map(lang => lang.language_name), // Use language names for display purposes
//       codingquestiondomain_id: codingquestiondomain_id || null, // Optional domain ID
//       question_type,
//       approval_status: 'pending', // Set approval status to 'pending'
//       created_by: req.user.id, // Assume `req.user.id` is the ID of the trainer
//       round_id: round_id || null // Optional round ID
//     });

//     // Log the newly created coding question for debugging
//     console.log('Coding question created successfully:', codingQuestion);

//     // Return a success response with the created coding question
//     res.status(201).json({
//       message: 'Coding Question created successfully',
//       codingQuestion
//     });
//   } catch (error) {
//     // Log the error for debugging
//     console.error('Error creating coding question:', error);

//     // Return a 500 Internal Server Error response
//     res.status(500).json({
//       message: 'Error creating coding question',
//       error
//     });
//   }
// };


// exports.addCodingQuestion = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       input_format,
//       output_format,
//       test_cases,
//       constraints,
//       difficulty,
//       solutions, // Multiple solutions from the request body
//       allowed_languages, // Expecting array of language IDs
//       codingquestiondomain_id,
//       question_type,
//       round_id
//     } = req.body;

//     // Log received coding question data for debugging
//     console.log('Received coding question data:', req.body);

//     // Detailed validation with logs
//     if (!title) {
//       console.error("Missing title");
//       return res.status(400).json({ message: 'Missing required field: title' });
//     }
//     if (!description) {
//       console.error("Missing description");
//       return res.status(400).json({ message: 'Missing required field: description' });
//     }
//     if (!input_format) {
//       console.error("Missing input_format");
//       return res.status(400).json({ message: 'Missing required field: input_format' });
//     }
//     if (!output_format) {
//       console.error("Missing output_format");
//       return res.status(400).json({ message: 'Missing required field: output_format' });
//     }
//     if (!test_cases || !Array.isArray(test_cases)) {
//       console.error("Invalid test_cases", test_cases);
//       return res.status(400).json({ message: 'Test cases must be a valid array' });
//     }
//     if (!allowed_languages || !Array.isArray(allowed_languages)) {
//       console.error("Invalid allowed_languages", allowed_languages);
//       return res.status(400).json({ message: 'Allowed languages must be a valid array' });
//     }
//     if (!solutions || !Array.isArray(solutions) || solutions.length === 0) {
//       console.error("Invalid solutions", solutions);
//       return res.status(400).json({ message: 'Solutions must be a non-empty array' });
//     }

//     // Fetch the allowed languages from the database to validate them
//     const existingLanguages = await AllowedLanguage.findAll({
//       where: { id: allowed_languages },
//       attributes: ['id', 'language_name']
//     });

//     if (existingLanguages.length !== allowed_languages.length) {
//       console.error("One or more selected languages are not allowed");
//       return res.status(400).json({ message: 'One or more selected languages are not allowed' });
//     }

//     // Create the coding question
//     const codingQuestion = await CodingQuestion.create({
//       title,
//       description,
//       input_format,
//       output_format,
//       test_cases,
//       constraints: constraints || null,
//       difficulty: difficulty || 'Level1',
//       solutions,
//       allowed_languages: existingLanguages.map(lang => lang.language_name),
//       codingquestiondomain_id: codingquestiondomain_id || null,
//       question_type,
//       approval_status: 'pending',
//       created_by: req.user.id,
//       round_id: round_id || null
//     });

//     console.log('Coding question created successfully:', codingQuestion);

//     res.status(201).json({
//       message: 'Coding Question created successfully',
//       codingQuestion
//     });
//   } catch (error) {
//     console.error('Error creating coding question:', error);
//     res.status(500).json({
//       message: 'Error creating coding question',
//       error
//     });
//   }
// };





// Trainer fetches all rejected questions they have created
exports.getRejectedQuestions = async (req, res) => {
  try {
    const rejectedCodingQuestions = await CodingQuestion.findAll({
      where: { created_by: req.user.id, approval_status: 'rejected' }
    });

    const rejectedMCQQuestions = await MCQQuestion.findAll({
      where: { created_by: req.user.id, approval_status: 'rejected' }
    });

    res.status(200).json({
      message: 'Rejected questions fetched successfully',
      codingQuestions: rejectedCodingQuestions,
      mcqQuestions: rejectedMCQQuestions
    });
  } catch (error) {
    console.error('Error fetching rejected questions:', error);
    res.status(500).json({ message: 'Error fetching rejected questions', error });
  }
};










// Trainer deletes a rejected coding question by ID
exports.deleteRejectedCodingQuestion = async (req, res) => {
  try {
    const { question_id } = req.params;  // Get question ID from URL

    // Find the rejected coding question
    const codingQuestion = await CodingQuestion.findOne({
      where: { id: question_id, created_by: req.user.id, approval_status: 'rejected' }
    });

    if (!codingQuestion) {
      return res.status(404).json({ message: 'Coding question not found or not rejected' });
    }

    // Delete the rejected coding question
    await codingQuestion.destroy();

    res.status(200).json({ message: 'Rejected coding question deleted successfully' });
  } catch (error) {
    console.error('Error deleting rejected coding question:', error);
    res.status(500).json({ message: 'Error deleting rejected coding question', error });
  }
};



// Trainer deletes a rejected MCQ question by ID
exports.deleteRejectedMCQQuestion = async (req, res) => {
  try {
    const { question_id } = req.params;  // Get question ID from URL

    // Find the rejected MCQ question
    const mcqQuestion = await MCQQuestion.findOne({
      where: { id: question_id, created_by: req.user.id, approval_status: 'rejected' }
    });

    if (!mcqQuestion) {
      return res.status(404).json({ message: 'MCQ question not found or not rejected' });
    }

    // Delete the rejected MCQ question
    await mcqQuestion.destroy();

    res.status(200).json({ message: 'Rejected MCQ question deleted successfully' });
  } catch (error) {
    console.error('Error deleting rejected MCQ question:', error);
    res.status(500).json({ message: 'Error deleting rejected MCQ question', error });
  }
};











// Trainer edits a rejected coding question by ID
exports.editRejectedCodingQuestionById = async (req, res) => {
  try {
    const { question_id } = req.params;  // Get question_id from URL
    const updated_fields = req.body;  // Directly use the body as updated fields

    // Log the incoming body to debug
    console.log('Received updated fields for Coding question:', updated_fields);

    // Check if updated_fields is provided and has any properties to update
    if (!updated_fields || Object.keys(updated_fields).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Find the rejected coding question
    const codingQuestion = await CodingQuestion.findOne({
      where: { id: question_id, created_by: req.user.id, approval_status: 'rejected' }
    });

    if (!codingQuestion) {
      return res.status(404).json({ message: 'Coding Question not found or not rejected' });
    }

    // Update the fields that were passed in the request body
    codingQuestion.set(updated_fields);

    // Automatically set the approval_status back to 'pending' after edit
    codingQuestion.approval_status = 'pending';

    await codingQuestion.save();

    res.status(200).json({ message: 'Rejected coding question updated and set to pending', codingQuestion });
  } catch (error) {
    console.error('Error editing rejected coding question:', error);  // Log the error for debugging
    res.status(500).json({ message: 'Error editing rejected coding question', error: error.message || error });
  }
};








// Trainer edits a rejected MCQ question by ID
exports.editRejectedMCQQuestionById = async (req, res) => {
  try {
    const { question_id } = req.params;  // Get question_id from URL
    const updated_fields = req.body;  // Directly use the body as updated fields

    // Log the incoming body to debug
    console.log('Received updated fields for MCQ question:', updated_fields);

    // Check if updated_fields is provided and has any properties to update
    if (!updated_fields || Object.keys(updated_fields).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Find the rejected MCQ question
    const mcqQuestion = await MCQQuestion.findOne({
      where: { id: question_id, created_by: req.user.id, approval_status: 'rejected' }
    });

    if (!mcqQuestion) {
      return res.status(404).json({ message: 'MCQ Question not found or not rejected' });
    }

    // Update the fields that were passed in the request body
    mcqQuestion.set(updated_fields);

    // Automatically set the approval_status back to 'pending' after edit
    mcqQuestion.approval_status = 'pending';

    await mcqQuestion.save();

    res.status(200).json({ message: 'Rejected MCQ question updated and set to pending', mcqQuestion });
  } catch (error) {
    console.error('Error editing rejected MCQ question:', error);  // Log the error for debugging
    res.status(500).json({ message: 'Error editing rejected MCQ question', error: error.message || error });
  }
};




// Trainer fetches all approved questions they created
exports.getApprovedQuestions = async (req, res) => {
  try {
    // Fetch approved coding questions created by the trainer
    const approvedCodingQuestions = await CodingQuestion.findAll({
      where: { created_by: req.user.id, approval_status: 'approved' }
    });

    // Fetch approved MCQ questions created by the trainer
    const approvedMCQQuestions = await MCQQuestion.findAll({
      where: { created_by: req.user.id, approval_status: 'approved' }
    });

    res.status(200).json({
      message: 'Approved questions fetched successfully',
      codingQuestions: approvedCodingQuestions,
      mcqQuestions: approvedMCQQuestions
    });
  } catch (error) {
    console.error('Error fetching approved questions:', error);
    res.status(500).json({ message: 'Error fetching approved questions', error });
  }
};



exports.getCodingQuestionById = async (req, res) => {
  try {
    const { question_id } = req.params;  // Get question ID from URL

    // Find the coding question by ID
    const codingQuestion = await CodingQuestion.findByPk(question_id);

    if (!codingQuestion) {
      return res.status(404).json({ message: 'Coding question not found' });
    }

    res.status(200).json({ message: 'Coding question fetched successfully', codingQuestion });
  } catch (error) {
    console.error('Error fetching coding question:', error);
    res.status(500).json({ message: 'Error fetching coding question', error });
  }
};



exports.getMCQQuestionById = async (req, res) => {
  try {
    const { question_id } = req.params;  // Get question ID from URL

    // Find the MCQ question by ID
    const mcqQuestion = await MCQQuestion.findByPk(question_id);

    if (!mcqQuestion) {
      return res.status(404).json({ message: 'MCQ question not found' });
    }

    res.status(200).json({ message: 'MCQ question fetched successfully', mcqQuestion });
  } catch (error) {
    console.error('Error fetching MCQ question:', error);
    res.status(500).json({ message: 'Error fetching MCQ question', error });
  }
};




// Trainer requests password reset via OTP
exports.requestPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const trainer = await Trainer.findOne({ where: { email } });

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    const otpExpiry = Date.now() + 600000; // OTP valid for 10 minutes

    // Store OTP and expiry in database
    trainer.resetPasswordOTP = otp;
    trainer.resetPasswordExpires = otpExpiry;
    await trainer.save();

    // Send OTP via email
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'praneethvadada25@gmail.com',  // Your personal Gmail
        pass: 'Praneeth123@',  // Your Gmail password or App password if using 2FA
      },
    });
    

    const mailOptions = {
      from: '"CODEABHYAN" <praneethvadada24@gmail.com>',
      to: email,
      subject: 'Your Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending OTP', error });
      }
      res.status(200).json({ message: 'OTP sent successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting password reset', error });
  }
};



// Trainer resets password using OTP
exports.resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find trainer by email and check OTP and expiry
    const trainer = await Trainer.findOne({
      where: {
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { [Op.gt]: Date.now() }, // OTP is valid if expiry is greater than current time
      },
    });

    if (!trainer) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    trainer.password = hashedPassword;
    trainer.resetPasswordOTP = null;  // Remove OTP after use
    trainer.resetPasswordExpires = null;
    await trainer.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
};


// Fetch all trainers
exports.getAllTrainers = async (req, res) => {
  try {
    // Fetch all trainers from the database
    const trainers = await Trainer.findAll();

    // If no trainers found, send a message
    if (trainers.length === 0) {
      return res.status(404).json({ message: 'No trainers found' });
    }

    // Return the list of trainers
    res.status(200).json({
      message: 'Trainers fetched successfully',
      trainers,
    });
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: 'Error fetching trainers', error });
  }

  
};


// Assuming you are using Express.js

// Edit Trainer
exports.editTrainer =  async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
      // Find trainer by ID and update details
      const [updated] = await Trainer.update(
          { name, email }, // You might want to hash the password before saving
          {
              where: { id }
          }
      );

      if (updated) {
          const updatedTrainer = await Trainer.findOne({ where: { id } });
          return res.status(200).json({ message: 'Trainer updated successfully', trainer: updatedTrainer });
      }

      return res.status(404).json({ message: 'Trainer not found' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating trainer', error });
  }
};

// Delete Trainer
exports.deleteTrainers =  async (req, res) => {
  const { id } = req.params;

  try {
      const deleted = await Trainer.destroy({
          where: { id }
      });

      if (deleted) {
          return res.json({ message: 'Trainer deleted successfully' });
      }

      return res.status(404).json({ message: 'Trainer not found' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting trainer', error });
  }
};

// Fetch Trainer by ID
exports.fetchtrainerbyid =  async (req, res) => {
  const { id } = req.params;

  try {
      const trainer = await Trainer.findOne({ where: { id } });

      if (trainer) {
          return res.status(200).json({ message: 'Trainer fetched successfully', trainer });
      }

      return res.status(404).json({ message: 'Trainer not found' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching trainer', error });
  }
};
