const {AllowedLanguage, Assessment, AssessmentRound, AssessmentQuestion, CodingQuestion, MCQQuestion } = require('../models');
const { Op } = require('sequelize');

// Get all live assessments for students
// exports.getLiveAssessments = async (req, res) => {
//   try {
//     const currentTime = new Date();

//     // Find all active assessments within the time window
//     const liveAssessments = await Assessment.findAll({
//       where: {
//         is_active: true,
//         start_window: { [Op.lte]: currentTime }, // Start window <= current time
//         end_window: { [Op.gte]: currentTime },  // End window >= current time
//       },
//       attributes: ['id', 'title', 'description', 'start_window', 'end_window', 'duration_minutes'],
//     });

//     if (!liveAssessments || liveAssessments.length === 0) {
//       return res.status(404).json({ message: 'No live assessments available at the moment' });
//     }

//     res.status(200).json({
//       message: 'Live assessments fetched successfully',
//       assessments: liveAssessments,
//     });
//   } catch (error) {
//     console.error('Error fetching live assessments:', error);
//     res.status(500).json({ message: 'Error fetching live assessments', error });
//   }
// };


exports.getLiveAssessments = async (req, res) => {
  try {
    const currentTime = new Date();

    // Fetch assessments that are active and within the valid time window
    const liveAssessments = await Assessment.findAll({
      where: {
        is_active: true, // Explicitly check that is_active is true
        start_window: { [Op.lte]: currentTime }, // start_window <= current time
        end_window: { [Op.gte]: currentTime },   // end_window >= current time
      },
      attributes: ['id', 'title', 'description', 'start_window', 'end_window', 'duration_minutes'],
    });

    // Check if no assessments are found
    if (!liveAssessments.length) {
      return res.status(404).json({ message: 'No live assessments available at the moment' });
    }

    // Return live assessments
    res.status(200).json({
      message: 'Live assessments fetched successfully',
      assessments: liveAssessments,
    });
  } catch (error) {
    console.error('Error fetching live assessments:', error);
    res.status(500).json({ message: 'Error fetching live assessments', error });
  }
};


// exports.getLiveAssessments = async (req, res) => {
//   try {
//     const currentTime = new Date();

//     // Fetch all assessments
//     const allAssessments = await Assessment.findAll({
//       attributes: ['id', 'is_active', 'start_window', 'end_window', 'is_single_answer'],
//     });

//     // Update `is_single_answer` for assessments not live
//     for (const assessment of allAssessments) {
//       const isLive = 
//         assessment.is_active &&
//         assessment.start_window <= currentTime &&
//         assessment.end_window >= currentTime;

//       if (!isLive && assessment.is_single_answer !== false) {
//         // Set `is_single_answer` to false if not live
//         await assessment.update({ is_single_answer: false });
//       }
//     }

//     // Fetch only live assessments
//     const liveAssessments = await Assessment.findAll({
//       where: {
//         is_active: true, // Explicitly check that is_active is true
//         start_window: { [Op.lte]: currentTime }, // start_window <= current time
//         end_window: { [Op.gte]: currentTime },   // end_window >= current time
//       },
//       attributes: ['id', 'title', 'description', 'start_window', 'end_window', 'duration_minutes'],
//     });

//     // Check if no assessments are found
//     if (!liveAssessments.length) {
//       return res.status(404).json({ message: 'No live assessments available at the moment' });
//     }

//     // Return live assessments
//     res.status(200).json({
//       message: 'Live assessments fetched successfully',
//       assessments: liveAssessments,
//     });
//   } catch (error) {
//     console.error('Error fetching live assessments:', error);
//     res.status(500).json({ message: 'Error fetching live assessments', error });
//   }
// };



// Get all rounds for a specific assessment
exports.getAssessmentRounds = async (req, res) => {
  try {
    const { assessmentId } = req.params;

    // Fetch rounds for the given assessment ID
    const rounds = await AssessmentRound.findAll({
      where: { assessment_id: assessmentId },
      attributes: ['id', 'round_type', 'round_order'],
      order: [['round_order', 'ASC']], // Order rounds by round_order
    });

    if (!rounds || rounds.length === 0) {
      return res.status(404).json({ message: 'No rounds found for this assessment' });
    }

    res.status(200).json({
      message: 'Rounds fetched successfully',
      rounds,
    });
  } catch (error) {
    console.error('Error fetching assessment rounds:', error);
    res.status(500).json({ message: 'Error fetching assessment rounds', error });
  }
};

// Get all questions for a specific round
// exports.getAssessmentQuestions = async (req, res) => {
//   try {
//     const { roundId } = req.params;

//     // Fetch questions for the given round ID
//     const questions = await AssessmentQuestion.findAll({
//       where: { round_id: roundId },
//       include: [
//         {
//           model: CodingQuestion,
//           as: 'codingQuestion',
//           // attributes: ['id', 'title', 'description', 'difficulty', 'createdAt'],
//           attributes: [
//             'id',
//             'title',
//             'description',
//             'input_format',
//             'output_format',
//             'test_cases',
//             'constraints',
//             'difficulty',
//             'allowed_languages',
//             'solutions',
//             'codingquestiondomain_id',
//           ],
//         },
//         {
//           model: MCQQuestion,
//           as: 'mcqQuestion',
//           // attributes: ['id', 'title', 'options', 'correct_answers', 'difficulty', 'is_single_answer'],
//           attributes: [
//             'id', 'title', 'options', 'correct_answers', 'is_single_answer',
//             'mcqdomain_id', 'code_snippets', 'question_type', 'approval_status',
//             'created_by', 'difficulty', 'round_id', 'createdAt', 'updatedAt'
//           ],
//         },
//       ],
//     });

//     if (!questions || questions.length === 0) {
//       return res.status(404).json({ message: 'No questions found for this round' });
//     }

//     // Format the response
//     const formattedQuestions = questions.map((q) => ({
//       id: q.id,
//       codingQuestion: q.codingQuestion || null,
//       mcqQuestion: q.mcqQuestion || null,
//     }));

//     res.status(200).json({
//       message: 'Questions fetched successfully',
//       questions: formattedQuestions,
//     });
//   } catch (error) {
//     console.error('Error fetching assessment questions:', error);
//     res.status(500).json({ message: 'Error fetching assessment questions', error });
//   }
// };



// exports.getAssessmentQuestions = async (req, res) => {
//   try {
//     const { roundId } = req.params;

//     const questions = await AssessmentQuestion.findAll({
//       where: { round_id: roundId },
//       include: [
//         {
//           model: CodingQuestion,
//           as: 'codingQuestion',
//           attributes: [
//             'id', 'title', 'description', 'input_format', 'output_format',
//             'test_cases', 'constraints', 'difficulty', 'solutions', 'codingquestiondomain_id',
//           ],
//           include: [
//             {
//               model: AllowedLanguage,
//               as: 'allowedLanguages',
//               attributes: ['id', 'language_name'],
//               through: { attributes: [] }, // Avoid intermediate table fields
//             },
//           ],
//         },
//         {
//           model: MCQQuestion,
//           as: 'mcqQuestion',
//           attributes: [
//             'id', 'title', 'options', 'correct_answers', 'is_single_answer',
//             'mcqdomain_id', 'code_snippets', 'question_type', 'approval_status',
//             'created_by', 'difficulty', 'round_id', 'createdAt', 'updatedAt',
//           ],
//         },
//       ],
//     });

//     if (!questions || questions.length === 0) {
//       return res.status(404).json({ message: 'No questions found for this round' });
//     }

//     const formattedQuestions = questions.map((q) => ({
//       id: q.id,
//       codingQuestion: q.codingQuestion
//         ? {
//             ...q.codingQuestion.toJSON(),
//             allowed_languages: q.codingQuestion.allowedLanguages.map((lang) => lang.language_name),
//           }
//         : null,
//       mcqQuestion: q.mcqQuestion || null,
//     }));

//     res.status(200).json({
//       message: 'Questions fetched successfully',
//       questions: formattedQuestions,
//     });
//   } catch (error) {
//     console.error('Error fetching assessment questions:', error);
//     res.status(500).json({ message: 'Error fetching assessment questions', error });
//   }
// };

// exports.getAssessmentQuestions = async (req, res) => {
//   try {
//     const { roundId } = req.params;

//     const questions = await AssessmentQuestion.findAll({
//       where: { round_id: roundId },
//       include: [
//         {
//           model: CodingQuestion,
//           as: 'codingQuestion',
//           attributes: [
//             'id', 'title', 'description', 'input_format', 'output_format',
//             'test_cases', 'constraints', 'difficulty', 'solutions', 'codingquestiondomain_id',
//           ],
//           include: [
//             {
//               model: AllowedLanguage,
//               as: 'allowedLanguages', // Ensure this matches the alias in the association
//               attributes: ['id', 'language_name'],
//               through: { attributes: [] }, // Exclude join table fields
//             },
//           ],
//         },
//         {
//           model: MCQQuestion,
//           as: 'mcqQuestion',
//           attributes: [
//             'id', 'title', 'options', 'correct_answers', 'is_single_answer',
//             'mcqdomain_id', 'code_snippets', 'question_type', 'approval_status',
//             'created_by', 'difficulty', 'round_id', 'createdAt', 'updatedAt',
//           ],
//         },
//       ],
//     });

//     if (!questions || questions.length === 0) {
//       return res.status(404).json({ message: 'No questions found for this round' });
//     }

//     const formattedQuestions = questions.map((q) => ({
//       id: q.id,
//       codingQuestion: q.codingQuestion
//         ? {
//             ...q.codingQuestion.toJSON(),
//             allowed_languages: q.codingQuestion.allowedLanguages.map((lang) => lang.language_name),
//           }
//         : null,
//       mcqQuestion: q.mcqQuestion || null,
//     }));

//     res.status(200).json({
//       message: 'Questions fetched successfully',
//       questions: formattedQuestions,
//     });
//   } catch (error) {
//     console.error('Error fetching assessment questions:', error);
//     res.status(500).json({ message: 'Error fetching assessment questions', error: error.message });
//   }
// };

// exports.getAssessmentQuestions = async (req, res) => {
//   try {
//     const { roundId } = req.params;

//     const questions = await AssessmentQuestion.findAll({
//       where: { round_id: roundId },
//       include: [
//         {
//           model: CodingQuestion,
//           as: 'codingQuestion',
//           attributes: [
//             'id', 'title', 'description', 'input_format', 'output_format',
//             'test_cases', 'constraints', 'difficulty', 'solutions', 'codingquestiondomain_id',
//           ],
//           include: [
//             {
//               model: AllowedLanguage,
//               as: 'allowedLanguages', // Match this to the alias in the association
//               attributes: ['id', 'language_name'],
//               through: { attributes: [] }, // Exclude join table fields
//             },
//           ],
//         },
//         {
//           model: MCQQuestion,
//           as: 'mcqQuestion',
//           attributes: [
//             'id', 'title', 'options', 'correct_answers', 'is_single_answer',
//             'mcqdomain_id', 'code_snippets', 'question_type', 'approval_status',
//             'created_by', 'difficulty', 'round_id', 'createdAt', 'updatedAt',
//           ],
//         },
//       ],
//     });

//     if (!questions || questions.length === 0) {
//       return res.status(404).json({ message: 'No questions found for this round' });
//     }

//     const formattedQuestions = questions.map((q) => ({
//       id: q.id,
//       codingQuestion: q.codingQuestion
//         ? {
//             ...q.codingQuestion.toJSON(),
//             allowed_languages: q.codingQuestion.allowedLanguages.map((lang) => lang.language_name),
//           }
//         : null,
//       mcqQuestion: q.mcqQuestion || null,
//     }));

//     res.status(200).json({
//       message: 'Questions fetched successfully',
//       questions: formattedQuestions,
//     });
//   } catch (error) {
//     console.error('Error fetching assessment questions:', error);
//     res.status(500).json({ message: 'Error fetching assessment questions', error: error.message });
//   }
// };







// exports.getAssessmentQuestions = async (req, res) => {
//   try {
//     const { roundId } = req.params;

//     // Fetch questions for the given round ID
//     const questions = await AssessmentQuestion.findAll({
//       where: { round_id: roundId },
//       include: [
//         {
//           model: CodingQuestion,
//           as: 'codingQuestion',
//           attributes: [
//             'id',
//             'title',
//             'description',
//             'input_format',
//             'output_format',
//             'test_cases',
//             'constraints',
//             'difficulty',
//             'allowed_languages',
//             'solutions',
//             'codingquestiondomain_id',
//           ],
//         },
//         {
//           model: MCQQuestion,
//           as: 'mcqQuestion',
//           attributes: [
//             'id',
//             'title',
//             'options',
//             'correct_answers',
//             'is_single_answer',
//             'mcqdomain_id',
//             'code_snippets',
//             'question_type',
//             'approval_status',
//             'created_by',
//             'difficulty',
//             'round_id',
//             'createdAt',
//             'updatedAt',
//           ],
//         },
//       ],
//     });

//     if (!questions || questions.length === 0) {
//       return res.status(404).json({ message: 'No questions found for this round' });
//     }

//     console.log(`[DEBUG] Fetched ${questions.length} assessment questions.`);

//     // Safe JSON parsing helper function
//     // const safeParseJSON = (input, fallback = []) => {
//     //   try {
//     //     return typeof input === 'string' ? JSON.parse(input) : input;
//     //   } catch (error) {
//     //     console.error(`[ERROR] Failed to parse JSON:`, input);
//     //     return fallback;
//     //   }
//     // };
//     const safeParseJSON = (input, fallback = []) => {
//       try {
//         return typeof input === "string" ? JSON.parse(input) : input;
//       } catch (err) {
//         console.error("Failed to parse JSON:", input);
//         return fallback;
//       }
//     };
    
//     // Example:

    

//     // Map and format questions (similar to getCodingQuestionsByDomain)
//     const formattedQuestions = questions.map((q) => {
//       const codingQuestion = q.codingQuestion
//         ? {
//             ...q.codingQuestion.toJSON(),
//             test_cases: safeParseJSON(q.codingQuestion.test_cases),
//             allowed_languages: safeParseJSON(q.codingQuestion.allowed_languages, []),
//             solutions: safeParseJSON(q.codingQuestion.solutions),
//           }
//         : null;

//       return {
//         id: q.id,
//         codingQuestion,
//         mcqQuestion: q.mcqQuestion ? q.mcqQuestion.toJSON() : null,
//       };
//     });

//     console.log(`[DEBUG] Formatted assessment questions:`, formattedQuestions);

//     res.status(200).json({
//       message: 'Questions fetched successfully',
//       questions: formattedQuestions,
//     });
//   } catch (error) {
//     console.error('Error fetching assessment questions:', error);
//     res.status(500).json({ message: 'Error fetching assessment questions', error });
//   }
// };


// exports.getAssessmentQuestions = async (req, res) => {
//   try {
//     const { roundId } = req.params;

//     // Fetch questions for the given round ID
//     const questions = await AssessmentQuestion.findAll({
//       where: { round_id: roundId },
//       include: [
//         {
//           model: CodingQuestion,
//           as: 'codingQuestion',
//           attributes: [
//             'id',
//             'title',
//             'description',
//             'input_format',
//             'output_format',
//             'test_cases',
//             'constraints',
//             'difficulty',
//             'allowed_languages',
//             'solutions',
//             'codingquestiondomain_id',
//           ],
//         },
//         {
//           model: MCQQuestion,
//           as: 'mcqQuestion',
//           attributes: [
//             'id',
//             'title',
//             'options',
//             'correct_answers',
//             'is_single_answer',
//             'mcqdomain_id',
//             'code_snippets',
//             'question_type',
//             'approval_status',
//             'created_by',
//             'difficulty',
//             'round_id',
//             'createdAt',
//             'updatedAt',
//           ],
//         },
//       ],
//     });

//     if (!questions || questions.length === 0) {
//       return res.status(404).json({ message: 'No questions found for this round' });
//     }

//     // Safe JSON parsing helper function
//     // const safeParseJSON = (input, fallback = []) => {
//     //   try {
//     //     return typeof input === 'string' ? JSON.parse(input) : input;
//     //   } catch (error) {
//     //     console.error(`[ERROR] Failed to parse JSON:`, input);
//     //     return fallback;
//     //   }
//     // };

//     // // Map and format questions (similar to getCodingQuestionsByDomain)
//     // const formattedQuestions = questions.map((q) => {
//     //   const codingQuestion = q.codingQuestion
//     //     ? {
//     //         ...q.codingQuestion.toJSON(),
//     //         test_cases: safeParseJSON(q.codingQuestion.test_cases, []),
//     //         allowed_languages: safeParseJSON(q.codingQuestion.allowed_languages, []),
//     //         solutions: safeParseJSON(q.codingQuestion.solutions, []),
//     //       }
//     //     : null;

//     //   return {
//     //     id: q.id,
//     //     codingQuestion,
//     //     mcqQuestion: q.mcqQuestion ? q.mcqQuestion.toJSON() : null,
//     //   };
//     // });

//     const safeParseJSON = (input, fallback = []) => {
//       try {
//         return typeof input === 'string' ? JSON.parse(input) : input;
//       } catch (error) {
//         console.error(`[ERROR] Failed to parse JSON:`, input);
//         return fallback;
//       }
//     };
    
//     const formattedQuestions = questions.map((q) => {
//       const codingQuestion = q.codingQuestion
//         ? {
//             ...q.codingQuestion.toJSON(),
//             test_cases: safeParseJSON(q.codingQuestion.test_cases, []),
//             allowed_languages: safeParseJSON(q.codingQuestion.allowed_languages, []),
//             solutions: safeParseJSON(q.codingQuestion.solutions, []),
//           }
//         : null;
    
//       return {
//         id: q.id,
//         codingQuestion,
//         mcqQuestion: q.mcqQuestion ? q.mcqQuestion.toJSON() : null,
//       };
//     });

//     console.log(`[DEBUG] Formatted assessment questions:`, formattedQuestions);

//     res.status(200).json({
//       message: 'Questions fetched successfully',
//       questions: formattedQuestions,
//     });
//   } catch (error) {
//     console.error('Error fetching assessment questions:', error);
//     res.status(500).json({ message: 'Error fetching assessment questions', error });
//   }
// };



// exports.getAssessmentQuestions = async (req, res) => {
//   try {
//     const { roundId } = req.params;

//     // Fetch questions for the given round ID
//     // const questions = await AssessmentQuestion.findAll({
//     //   where: { round_id: roundId },
//     //   include: [
//     //     {
//     //       model: CodingQuestion,
//     //       as: 'codingQuestion',
//     //       attributes: [
//     //         'id',
//     //         'title',
//     //         'description',
//     //         'input_format',
//     //         'output_format',
//     //         'test_cases',
//     //         'constraints',
//     //         'difficulty',
//     //         'solutions',
//     //         'codingquestiondomain_id',
//     //       ],
//     //       include: [
//     //         {
//     //           model: AllowedLanguage, // Join AllowedLanguage table
//     //           as: 'allowedLanguages',
//     //           attributes: ['language_name'], // Fetch only language_name
//     //           through: { attributes: [] }, // Exclude junction table attributes
//     //         },
//     //       ],
//     //     },
//     //     {
//     //       model: MCQQuestion,
//     //       as: 'mcqQuestion',
//     //       attributes: [
//     //         'id', 'title', 'options', 'correct_answers', 'is_single_answer',
//     //         'mcqdomain_id', 'code_snippets', 'question_type', 'approval_status',
//     //         'created_by', 'difficulty', 'round_id', 'createdAt', 'updatedAt'
//     //       ],
//     //     },
//     //   ],
//     // });
//     const questions = await AssessmentQuestion.findAll({
//       where: { round_id: roundId },
//       include: [
//         {
//           model: CodingQuestion,
//           as: 'codingQuestion',
//           attributes: [
//             'id',
//             'title',
//             'description',
//             'input_format',
//             'output_format',
//             'test_cases',
//             'constraints',
//             'difficulty',
//             'solutions',
//             'codingquestiondomain_id',
//           ],
//           include: [
//             {
//               model: AllowedLanguage,
//               as: 'allowedLanguages', // Join the AllowedLanguage table
//               attributes: ['language_name'], // Fetch language names
//               through: { attributes: [] }, // Exclude junction table attributes
//             },
//           ],
//         },
//         {
//           model: MCQQuestion,
//           as: 'mcqQuestion',
//           attributes: [
//             'id', 'title', 'options', 'correct_answers', 'is_single_answer',
//             'mcqdomain_id', 'code_snippets', 'question_type', 'approval_status',
//             'created_by', 'difficulty', 'round_id', 'createdAt', 'updatedAt'
//           ],
//         },
//       ],
//     });
    

//     if (!questions || questions.length === 0) {
//       return res.status(404).json({ message: 'No questions found for this round' });
//     }

//     // Format the response
//     const formattedQuestions = questions.map((q) => {
//       const questionData = q.toJSON();
//       if (questionData.codingQuestion) {
//         // Map allowed languages for coding questions
//         questionData.codingQuestion.allowed_languages = 
//           questionData.codingQuestion.allowedLanguages.map((lang) => lang.language_name);
//         delete questionData.codingQuestion.allowedLanguages; // Remove raw allowedLanguages data
//       }
//       return questionData;
//     });

//     res.status(200).json({
//       message: 'Questions fetched successfully',
//       questions: formattedQuestions,
//     });
//   } catch (error) {
//     console.error('Error fetching assessment questions:', error);
//     res.status(500).json({ message: 'Error fetching assessment questions', error });
//   }
// };



// exports.getAssessmentQuestions = async (req, res) => {
//   try {
//     const { roundId } = req.params;

//     // Fetch questions for the given round ID
//     const questions = await AssessmentQuestion.findAll({
//       where: { round_id: roundId },
//       include: [
//         {
//           model: CodingQuestion,
//           as: 'codingQuestion', // Ensure this matches your model definition
//           attributes: [
//             'id',
//             'title',
//             'description',
//             'input_format',
//             'output_format',
//             'test_cases',
//             'constraints',
//             'difficulty',
//             'solutions',
//             'codingquestiondomain_id',
//           ],
//           include: [
//             {
//               model: AllowedLanguage,
//               as: 'allowedLanguages', // Join AllowedLanguage table
//               attributes: ['language_name'], // Fetch only language names
//               through: { attributes: [] }, // Exclude junction table attributes
//             },
//           ],
//         },
//         {
//           model: MCQQuestion,
//           as: 'mcqQuestion',
//           attributes: [
//             'id', 'title', 'options', 'correct_answers', 'is_single_answer',
//             'mcqdomain_id', 'code_snippets', 'question_type', 'approval_status',
//             'created_by', 'difficulty', 'round_id', 'createdAt', 'updatedAt',
//           ],
//         },
//       ],
//     });

//     if (!questions || questions.length === 0) {
//       return res.status(404).json({ message: 'No questions found for this round' });
//     }

//     const formattedQuestions = questions.map((q) => {
//       const questionData = q.toJSON();
//       if (questionData.codingQuestion) {
//         questionData.codingQuestion.allowed_languages = 
//           questionData.codingQuestion.allowedLanguages.map((lang) => lang.language_name);
//         delete questionData.codingQuestion.allowedLanguages; // Remove raw data
//       }
//       return questionData;
//     });

//     res.status(200).json({
//       message: 'Questions fetched successfully',
//       questions: formattedQuestions,
//     });
//   } catch (error) {
//     console.error('Error fetching assessment questions:', error);
//     res.status(500).json({ message: 'Error fetching assessment questions', error: error.message });
//   }
// };


exports.getAssessmentQuestions = async (req, res) => {
  try {
    const { roundId } = req.params;

    // Define a manual mapping of allowed language IDs to names
    const allowedLanguageMapping = {
      1: 'Python',
      2: 'Java',
      3: 'C++',
      4: 'C',
    };

    // Fetch questions for the given round ID
    const questions = await AssessmentQuestion.findAll({
      where: { round_id: roundId },
      include: [
        {
          model: CodingQuestion,
          as: 'codingQuestion', // Alias for coding question
          attributes: [
            'id',
            'title',
            'description',
            'input_format',
            'output_format',
            'test_cases',
            'constraints',
            'difficulty',
            'allowed_languages', // Numeric IDs are fetched here
            'solutions',
            'codingquestiondomain_id',
          ],
        },
        {
          model: MCQQuestion,
          as: 'mcqQuestion',
          attributes: [
            'id', 'title', 'options', 'correct_answers', 'is_single_answer',
            'mcqdomain_id', 'code_snippets', 'question_type', 'approval_status',
            'created_by', 'difficulty', 'round_id', 'createdAt', 'updatedAt',
          ],
        },
      ],
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this round' });
    }

    // Process and format the response
    const formattedQuestions = questions.map((q) => {
      const questionData = q.toJSON();

      // Convert allowed_languages numeric IDs to names
      if (questionData.codingQuestion && questionData.codingQuestion.allowed_languages) {
        const allowedLanguagesIds = questionData.codingQuestion.allowed_languages;
        questionData.codingQuestion.allowed_languages = allowedLanguagesIds.map(
          (id) => allowedLanguageMapping[id] || `Unknown (${id})`
        );
      }

      return {
        id: q.id,
        codingQuestion: questionData.codingQuestion || null,
        mcqQuestion: questionData.mcqQuestion || null,
      };
    });

    res.status(200).json({
      message: 'Questions fetched successfully',
      questions: formattedQuestions,
    });
  } catch (error) {
    console.error('Error fetching assessment questions:', error);
    res.status(500).json({ message: 'Error fetching assessment questions', error: error.message });
  }
};


