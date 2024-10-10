const { Trainer, MCQQuestion } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { CodingQuestion, AllowedLanguage, CodingQuestionLanguage } = require('../models');

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
    const { title, options, correct_answers, is_single_answer, mcqdomain_id, code_snippets, question_type } = req.body;

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
      created_by: req.user.id  // Trainer's ID, assuming it's stored in req.user.id
    });

    res.status(201).json({ message: 'MCQ Question created successfully', mcqQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Error creating MCQ Question', error });
  }
};



// const { CodingQuestion } = require('../models');  // Import the CodingQuestion model

// // Add Coding Question
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
//       solution,
//       allowed_languages,
//       codingquestiondomain_id,
//       question_type
//     } = req.body;

//     // Create new Coding question
//     const codingQuestion = await CodingQuestion.create({
//       title,
//       description,
//       input_format,
//       output_format,
//       test_cases,
//       constraints: constraints || null,  // Optional field
//       difficulty: difficulty || null,  // Optional field
//       solution: solution || null,  // Optional field
//       allowed_languages,
//       codingquestiondomain_id: codingquestiondomain_id || null,  // Optional domain ID
//       question_type,
//       approval_status: 'pending',  // Automatically set to 'pending' for Admin approval
//       created_by: req.user.id  // Trainer's ID, assuming it's stored in req.user.id
//     });

//     res.status(201).json({ message: 'Coding Question created successfully', codingQuestion });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating Coding Question', error });
//   }
// };



// Add Coding Question
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
//       solution,
//       codingquestiondomain_id,
//       question_type,
//       allowed_languages
//     } = req.body;

//     // Create new Coding question
//     const codingQuestion = await CodingQuestion.create({
//       title,
//       description,
//       input_format,
//       output_format,
//       test_cases,
//       constraints: constraints || null,
//       difficulty: difficulty || null,
//       solution: solution || null,
//       codingquestiondomain_id: codingquestiondomain_id || null,
//       question_type,
//       approval_status: 'pending',
//       created_by: req.user.id
//     });

//     // Map selected languages
//     if (allowed_languages && allowed_languages.length) {
//       const languages = await AllowedLanguage.findAll({
//         where: { id: allowed_languages }
//       });

//       await codingQuestion.setAllowedLanguages(languages);
//     }

//     res.status(201).json({ message: 'Coding Question created successfully', codingQuestion });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating Coding Question', error });
//   }
// };

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
        question_type
      } = req.body;
  
      // Debugging - log the allowed_languages before proceeding
      console.log("Allowed languages received:", allowed_languages);
  
      // Check if allowed_languages is present, fallback to default if not
      const languages = allowed_languages && allowed_languages.length > 0 ? allowed_languages : ["Python"];  // Default to Python if empty
      console.log("Languages used for creation:", languages);  // Debugging
  
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
        codingquestiondomain_id: codingquestiondomain_id || null,
        question_type,
        approval_status: 'pending',
        created_by: req.user.id  // Assuming req.user.id is set based on the authenticated trainer
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