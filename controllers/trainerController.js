const { Trainer, MCQQuestion } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { CodingQuestion, AllowedLanguage, CodingQuestionLanguage } = require('../models');
const crypto = require('crypto');
// const {  } = require('../models');
const nodemailer = require('nodemailer');
// Admin adds a new trainer
exports.createTrainer = async (req, res) => {
  try {
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
exports.addMCQQuestion = async (req, res) => {
  try {
    const { title, options, correct_answers, is_single_answer, mcqdomain_id, code_snippets, question_type, round_id } = req.body;

    // Create new MCQ question
    const mcqQuestion = await MCQQuestion.create({
      title,
      options,
      correct_answers,
      is_single_answer: is_single_answer || true,  // Default to true
      mcqdomain_id: mcqdomain_id || null,  // Optional domain ID
      code_snippets: code_snippets || null,  // Optional code snippets
      question_type,
      approval_status: 'Pending',  // Automatically set to 'Pending' for Admin review
      created_by: req.user.id,  // Trainer's ID, assuming it's stored in req.user.id
      round_id: round_id || null  // Add round_id, allow it to be null if not provided

    });

    res.status(201).json({ message: 'MCQ Question created successfully', mcqQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Error creating MCQ Question', error });
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
      solution,
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
      solution: solution || null,
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
