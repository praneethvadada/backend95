const {AllowedLanguage, Assessment, AssessmentRound, AssessmentQuestion, CodingQuestion, MCQQuestion } = require('../models');
const { Op } = require('sequelize');
const { StudentResults } = require('../models');
const axios = require('axios'); // For Docker API communication




// const WebSocket = require('ws');
// const wsServer = new WebSocket.Server({ port: 8080 });

// wsServer.on('connection', (socket) => {
//   console.log('[DEBUG] WebSocket client connected.');

//   socket.on('message', async (message) => {
//     console.log('[DEBUG] Message received:', message);
//     const data = JSON.parse(message);

//     if (data.type === 'save_code') {
//       const { student_id, round_id, question_id, solution_code, language } = data;

//       // Save the code to the database
//       await StudentResults.upsert({
//         student_id,
//         round_id,
//         question_id,
//         solution_code,
//         language,
//         question_type: 'coding',
//         updatedAt: new Date(),
//       });
//       console.log('[DEBUG] Code saved to database.');
//     }
//   });

//   socket.on('close', () => {
//     console.log('[DEBUG] WebSocket client disconnected.');
//   });
// });

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('[DEBUG] WebSocket client connected.');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log('[DEBUG] Received WebSocket message:', data);

      if (data.event === 'autoSave') {
        // Handle autoSave event
        const payload = data.data;
        await StudentResults.upsert({
          student_id: payload.student_id, // Replace with actual student ID
          round_id: payload.round_id,
          question_id: payload.question_id,
          solution_code: payload.solution_code,
          language: payload.language,
          question_type: 'coding',
          updatedAt: new Date(),
        });
        console.log('[DEBUG] Auto-save successful');
      } else if (data.event === 'fetchCode') {
        // Handle fetchCode event
        const { round_id, question_id } = data.data;
        const savedCode = await StudentResults.findOne({
          where: { round_id, question_id },
        });
        if (savedCode) {
          ws.send(
            JSON.stringify({
              event: 'fetchCode',
              data: {
                solution_code: savedCode.solution_code,
                language: savedCode.language,
              },
            })
          );
        } else {
          ws.send(JSON.stringify({ event: 'fetchCode', data: {} }));
        }
        console.log('[DEBUG] Fetched saved code');
      }
    } catch (error) {
      console.error('[ERROR] WebSocket error:', error);
    }
  });

  ws.on('close', () => {
    console.log('[DEBUG] WebSocket client disconnected.');
  });
});





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
            'round_id',
            'codingquestiondomain_id',
          ],
        },
        {
          model: MCQQuestion,
          as: 'mcqQuestion',
          attributes: [
            'id', 'title', 'options', 'correct_answers', 'is_single_answer',
            'mcqdomain_id', 'code_snippets', 'question_type', 'approval_status',
            'created_by', 'difficulty', 'round_id', 'createdAt', 'updatedAt', 'round_id'
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









// exports.submitCode = async (req, res) => {
//   Console.log("Hello, Assessment Questions");
//   try {
//     const studentId = req.user.id; // Extracted from JWT
//     const { question_id, language, solution_code, mode } = req.body;

//     // Validate input
//     if (!question_id || !language || !solution_code || !mode) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Fetch question details
//     const question = await CodingQuestion.findByPk(question_id);
//     if (!question) {
//       return res.status(404).json({ message: "Coding question not found" });
//     }

//     // Prepare test cases
//     const testCases = req.body.testcases || question.test_cases; // Use provided or default test cases
//     if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
//       return res.status(400).json({ message: "Invalid or missing test cases" });
//     }

//     // Determine Docker API endpoint based on language
//     const dockerEndpoints = {
//       python: 'http://localhost:8084/compile',
//       java: 'http://localhost:8083/compile',
//       cpp: 'http://localhost:8081/compile',
//       c: 'http://localhost:8082/compile',
//     };
//     const dockerEndpoint = dockerEndpoints[language.toLowerCase()];
//     if (!dockerEndpoint) {
//       return res.status(400).json({ message: "Unsupported programming language" });
//     }

//     // Send request to Docker API for code execution
//     const dockerRequest = {
//       language: language.toLowerCase(),
//       code: solution_code,
//       testcases: testCases,
//     };

//     const dockerResponse = await axios.post(dockerEndpoint, dockerRequest);
//     const testResults = dockerResponse.data; // Expected array of test case results

//     // Validate Docker response
//     if (!Array.isArray(testResults) || testResults.length === 0) {
//       return res.status(500).json({ message: "Invalid response from Docker API" });
//     }

//     // Calculate score and determine status (for "submit" mode only)
//     if (mode === 'submit') {
//       const totalTests = testResults.length;
//       const passedTests = testResults.filter((result) => result.success).length;
//       const score = Math.round((passedTests / totalTests) * 100);
//       const status = score === 100 ? 'pass' : score > 0 ? 'partial' : 'fail';

//       // Save submission to StudentResults table
//       const submission = await StudentResults.create({
//         student_id: studentId,
//         assessment_id: question.assessment_id,
//         round_id: question.round_id,
//         question_id,
//         question_type: 'coding',
//         solution_code,
//         language,
//         submitted_options: null, // Not applicable for coding questions
//         question_points: question.question_points || 100,
//         score,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       return res.status(201).json({
//         message: "Code submitted successfully",
//         submission,
//         test_results: testResults,
//       });
//     }

//     // For "run" mode, return test results only
//     return res.status(200).json({
//       message: "Code executed successfully",
//       test_results: testResults,
//     });

//   } catch (error) {
//     console.error("Error in submitCode:", error);
//     res.status(500).json({ message: "Error processing request", error: error.message });
//   }
// };




// exports.submitCode = async (req, res) => {
//   try {
//     const studentId = req.user.id; // Extracted from JWT
//     const { round_id, question_id, language, solution_code, mode } = req.body;

//     // Validate input
//     if (!round_id || !question_id || !language || !solution_code || !mode) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Fetch question details
//     const question = await CodingQuestion.findByPk(question_id);
//     if (!question) {
//       return res.status(404).json({ message: "Coding question not found" });
//     }

//     // Prepare test cases
//     const testCases = req.body.testcases || question.test_cases; // Use provided or default test cases
//     if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
//       return res.status(400).json({ message: "Invalid or missing test cases" });
//     }

//     // Determine Docker API endpoint based on language
//     const dockerEndpoints = {
//       python: 'http://localhost:8084/compile',
//       java: 'http://localhost:8083/compile',
//       cpp: 'http://localhost:8081/compile',
//       c: 'http://localhost:8082/compile',
//     };
//     const dockerEndpoint = dockerEndpoints[language.toLowerCase()];
//     if (!dockerEndpoint) {
//       return res.status(400).json({ message: "Unsupported programming language" });
//     }

//     // Send request to Docker API for code execution
//     const dockerRequest = {
//       language: language.toLowerCase(),
//       code: solution_code,
//       testcases: testCases,
//     };

//     const dockerResponse = await axios.post(dockerEndpoint, dockerRequest);
//     const testResults = dockerResponse.data; // Expected array of test case results

//     // Validate Docker response
//     if (!Array.isArray(testResults) || testResults.length === 0) {
//       return res.status(500).json({ message: "Invalid response from Docker API" });
//     }

//     // Calculate score and determine status (for "submit" mode only)
//     if (mode === 'submit') {
//       const totalTests = testResults.length;
//       const passedTests = testResults.filter((result) => result.success).length;
//       const score = Math.round((passedTests / totalTests) * 100);
//       const status = score === 100 ? 'pass' : score > 0 ? 'partial' : 'fail';

//       // Save submission to StudentResults table
//       const submission = await StudentResults.create({
//         student_id: studentId,
//         assessment_id: question.assessment_id,
//         round_id, // Use round_id instead of domain_id
//         question_id,
//         question_type: 'coding',
//         solution_code,
//         language,
//         submitted_options: null, // Not applicable for coding questions
//         question_points: question.question_points || 100,
//         score,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       return res.status(201).json({
//         message: "Code submitted successfully",
//         submission,
//         test_results: testResults,
//       });
//     }

//     // For "run" mode, return test results only
//     return res.status(200).json({
//       message: "Code executed successfully",
//       test_results: testResults,
//     });

//   } catch (error) {
//     console.error("Error in submitCode:", error);
//     res.status(500).json({ message: "Error processing request", error: error.message });
//   }
// };




// exports.submitCode = async (req, res) => {
//   try {
//     const studentId = req.user.id; // Extracted from JWT
//     const { round_id, question_id, language, solution_code, mode } = req.body;

//     // Validate input
//     if (!round_id || !question_id || !language || !solution_code || !mode) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Fetch question details
//     const question = await CodingQuestion.findByPk(question_id);

//     // Handle case where the question is not found
//     if (!question) {
//       return res.status(404).json({ message: "Coding question not found for the provided ID" });
//     }

//     // Ensure the question belongs to the given round
//     if (question.round_id !== round_id) {
//       return res.status(400).json({ message: "Question does not belong to the specified round" });
//     }

//     // Prepare test cases
//     const testCases = req.body.testcases || question.test_cases;
//     if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
//       return res.status(400).json({ message: "Invalid or missing test cases" });
//     }

//     // Determine Docker API endpoint based on language
//     const dockerEndpoints = {
//       python: 'http://localhost:8084/compile',
//       java: 'http://localhost:8083/compile',
//       cpp: 'http://localhost:8081/compile',
//       c: 'http://localhost:8082/compile',
//     };
//     const dockerEndpoint = dockerEndpoints[language.toLowerCase()];
//     if (!dockerEndpoint) {
//       return res.status(400).json({ message: "Unsupported programming language" });
//     }

//     // Send request to Docker API for code execution
//     const dockerRequest = {
//       language: language.toLowerCase(),
//       code: solution_code,
//       testcases: testCases,
//     };

//     const dockerResponse = await axios.post(dockerEndpoint, dockerRequest);
//     const testResults = dockerResponse.data; // Expected array of test case results

//     // Validate Docker response
//     if (!Array.isArray(testResults) || testResults.length === 0) {
//       return res.status(500).json({ message: "Invalid response from Docker API" });
//     }

//     // Calculate score and determine status (for "submit" mode only)
//     if (mode === 'submit') {
//       const totalTests = testResults.length;
//       const passedTests = testResults.filter((result) => result.success).length;
//       const score = Math.round((passedTests / totalTests) * 100);
//       const status = score === 100 ? 'pass' : score > 0 ? 'partial' : 'fail';

//       // Save submission to StudentResults table
//       const submission = await StudentResults.create({
//         student_id: studentId,
//         assessment_id: question.assessment_id,
//         round_id, // Use round_id instead of domain_id
//         question_id,
//         question_type: 'coding',
//         solution_code,
//         language,
//         submitted_options: null, // Not applicable for coding questions
//         question_points: question.question_points || 100,
//         score,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       return res.status(201).json({
//         message: "Code submitted successfully",
//         submission,
//         test_results: testResults,
//       });
//     }

//     // For "run" mode, return test results only
//     return res.status(200).json({
//       message: "Code executed successfully",
//       test_results: testResults,
//     });

//   } catch (error) {
//     console.error("Error in submitCode:", error);
//     res.status(500).json({ message: "Error processing request", error: error.message });
//   }
// };



// exports.submitCode = async (req, res) => {
//   try {
//     console.log("[DEBUG] Starting submitCode");
//     console.log("[DEBUG] Request Body:", req.body);
//     console.log("[DEBUG] Authenticated User ID:", req.user.id);

//     const studentId = req.user.id; // Extracted from JWT
//     const { round_id, question_id, language, solution_code, mode } = req.body;

//     // Validate input
//     if (!round_id || !question_id || !language || !solution_code || !mode) {
//       console.error("[DEBUG] Missing required fields");
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     console.log("[DEBUG] Input validated successfully");

//     // Fetch question details
//     console.log("[DEBUG] Fetching question details for question_id:", question_id);
//     const question = await CodingQuestion.findByPk(question_id);

//     // Handle case where the question is not found
//     if (!question) {
//       console.error("[DEBUG] Coding question not found for ID:", question_id);
//       return res.status(404).json({ message: "Coding question not found for the provided ID" });
//     }
//     console.log("[DEBUG] Question fetched successfully:", question);

//     // Ensure the question belongs to the given round
//     if (question.round_id !== round_id) {
//       console.error("[DEBUG] Question does not belong to the specified round. Question round_id:", question.round_id);
//       return res.status(400).json({ message: "Question does not belong to the specified round" });
//     }
//     console.log("[DEBUG] Round ID validated successfully");

//     // Prepare test cases
//     const testCases = req.body.testcases || question.test_cases;
//     if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
//       console.error("[DEBUG] Invalid or missing test cases");
//       return res.status(400).json({ message: "Invalid or missing test cases" });
//     }
//     console.log("[DEBUG] Test cases prepared successfully");

//     // Determine Docker API endpoint
//     console.log("[DEBUG] Determining Docker API endpoint for language:", language);
//     const dockerEndpoints = {
//       python: 'http://localhost:8084/compile',
//       java: 'http://localhost:8083/compile',
//       cpp: 'http://localhost:8081/compile',
//       c: 'http://localhost:8082/compile',
//     };
//     const dockerEndpoint = dockerEndpoints[language.toLowerCase()];
//     if (!dockerEndpoint) {
//       console.error("[DEBUG] Unsupported programming language:", language);
//       return res.status(400).json({ message: "Unsupported programming language" });
//     }
//     console.log("[DEBUG] Docker endpoint determined:", dockerEndpoint);

//     // Send request to Docker API
//     console.log("[DEBUG] Sending request to Docker API");
//     const dockerRequest = {
//       language: language.toLowerCase(),
//       code: solution_code,
//       testcases: testCases,
//     };
//     const dockerResponse = await axios.post(dockerEndpoint, dockerRequest);
//     const testResults = dockerResponse.data;

//     // Validate Docker response
//     if (!Array.isArray(testResults) || testResults.length === 0) {
//       console.error("[DEBUG] Invalid response from Docker API:", testResults);
//       return res.status(500).json({ message: "Invalid response from Docker API" });
//     }
//     console.log("[DEBUG] Docker API response received:", testResults);

//     // Handle submission mode
//     if (mode === 'submit') {
//       console.log("[DEBUG] Handling submission mode");
//       const totalTests = testResults.length;
//       const passedTests = testResults.filter((result) => result.success).length;
//       const score = Math.round((passedTests / totalTests) * 100);
//       const status = score === 100 ? 'pass' : score > 0 ? 'partial' : 'fail';

//       console.log("[DEBUG] Calculated Score:", score, "Status:", status);

//       // Save submission
//       const submission = await StudentResults.create({
//         student_id: studentId,
//         assessment_id: question.assessment_id,
//         round_id,
//         question_id,
//         question_type: 'coding',
//         solution_code,
//         language,
//         question_points: question.question_points || 100,
//         score,
//       });
//       console.log("[DEBUG] Submission saved:", submission);

//       return res.status(201).json({
//         message: "Code submitted successfully",
//         submission,
//         test_results: testResults,
//       });
//     }

//     console.log("[DEBUG] Handling run mode");
//     return res.status(200).json({
//       message: "Code executed successfully",
//       test_results: testResults,
//     });
//   } catch (error) {
//     console.error("[DEBUG] Error in submitCode:", error);
//     res.status(500).json({ message: "Error processing request", error: error.message });
//   }
// };




// exports.submitCode = async (req, res) => {
//   try {
//     console.log("[DEBUG] Starting submitCode");
//     console.log("[DEBUG] Request Body:", req.body);
//     console.log("[DEBUG] Authenticated User ID:", req.user.id);

//     const studentId = req.user.id; // Extracted from JWT
//     const { round_id, question_id, language, solution_code, mode } = req.body;

//     // Validate input
//     if (!round_id || !question_id || !language || !solution_code || !mode) {
//       console.error("[DEBUG] Missing required fields");
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     console.log("[DEBUG] Input validated successfully");

//     // Fetch question details
//     console.log("[DEBUG] Fetching question details for question_id:", question_id);
//     const question = await CodingQuestion.findByPk(question_id);

//     // Handle case where the question is not found
//     if (!question) {
//       console.error("[DEBUG] Coding question not found for ID:", question_id);
//       return res.status(404).json({ message: "Coding question not found for the provided ID" });
//     }
//     console.log("[DEBUG] Question fetched successfully:", question);

//     // Ensure the question belongs to the given round
//     if (question.round_id !== round_id) {
//       console.error("[DEBUG] Question does not belong to the specified round. Question round_id:", question.round_id);
//       return res.status(400).json({ message: "Question does not belong to the specified round" });
//     }
//     console.log("[DEBUG] Round ID validated successfully");

//     // Prepare test cases
//     const testCases = req.body.testcases || question.test_cases;
//     if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
//       console.error("[DEBUG] Invalid or missing test cases");
//       return res.status(400).json({ message: "Invalid or missing test cases" });
//     }
//     console.log("[DEBUG] Test cases prepared successfully");

//     // Determine Docker API endpoint
//     console.log("[DEBUG] Determining Docker API endpoint for language:", language);
//     const dockerEndpoints = {
//       python: 'http://localhost:8084/compile',
//       java: 'http://localhost:8083/compile',
//       cpp: 'http://localhost:8081/compile',
//       c: 'http://localhost:8082/compile',
//     };
//     const dockerEndpoint = dockerEndpoints[language.toLowerCase()];
//     if (!dockerEndpoint) {
//       console.error("[DEBUG] Unsupported programming language:", language);
//       return res.status(400).json({ message: "Unsupported programming language" });
//     }
//     console.log("[DEBUG] Docker endpoint determined:", dockerEndpoint);

//     // Send request to Docker API
//     console.log("[DEBUG] Sending request to Docker API");
//     const dockerRequest = {
//       language: language.toLowerCase(),
//       code: solution_code,
//       testcases: testCases,
//     };
//     const dockerResponse = await axios.post(dockerEndpoint, dockerRequest);
//     const testResults = dockerResponse.data;

//     // Validate Docker response
//     if (!Array.isArray(testResults) || testResults.length === 0) {
//       console.error("[DEBUG] Invalid response from Docker API:", testResults);
//       return res.status(500).json({ message: "Invalid response from Docker API" });
//     }
//     console.log("[DEBUG] Docker API response received:", testResults);

//     // Handle submission mode
//     if (mode === 'submit') {
//       console.log("[DEBUG] Handling submission mode");
//       const totalTests = testResults.length;
//       const passedTests = testResults.filter((result) => result.success).length;
//       const score = Math.round((passedTests / totalTests) * 100);
//       const status = score === 100 ? 'pass' : score > 0 ? 'partial' : 'fail';

//       console.log("[DEBUG] Calculated Score:", score, "Status:", status);

//       // Save submission
//       const submission = await StudentResults.create({
//         student_id: studentId,
//         assessment_id: question.assessment_id,
//         round_id,
//         question_id,
//         question_type: 'coding',
//         solution_code,
//         language,
//         question_points: question.question_points || 100,
//         score,
//       });
//       console.log("[DEBUG] Submission saved:", submission);

//       return res.status(201).json({
//         message: "Code submitted successfully",
//         submission,
//         test_results: testResults,
//       });
//     }

//     console.log("[DEBUG] Handling run mode");
//     return res.status(200).json({
//       message: "Code executed successfully",
//       test_results: testResults,
//     });
//   } catch (error) {
//     console.error("[DEBUG] Error in submitCode:", error);
//     res.status(500).json({ message: "Error processing request", error: error.message });
//   }
// };



// exports.submitCode = async (req, res) => {
//   try {
//     console.log("[DEBUG] Starting submitCode");
//     console.log("[DEBUG] Request Body:", req.body);

//     const studentId = req.user?.id; // Extracted from JWT
//     if (!studentId) {
//       console.error("[DEBUG] User ID is undefined");
//       return res.status(401).json({ message: "Unauthorized: User ID is required" });
//     }
//     console.log("[DEBUG] Authenticated User ID:", studentId);

//     const { round_id, question_id, language, solution_code, mode } = req.body;

//     // Validate input
//     if (!round_id || !question_id || !language || !solution_code || !mode) {
//       console.error("[DEBUG] Missing required fields");
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     console.log("[DEBUG] Input validated successfully");

//     // Fetch question details
//     console.log("[DEBUG] Fetching question details for question_id:", question_id);
//     const question = await CodingQuestion.findByPk(question_id);

//     // Handle case where the question is not found
//     if (!question) {
//       console.error("[DEBUG] Coding question not found for ID:", question_id);
//       return res.status(404).json({ message: "Coding question not found for the provided ID" });
//     }
//     console.log("[DEBUG] Question fetched successfully:", question);

//     // Ensure the question belongs to the given round
//     if (question.round_id !== round_id) {
//       console.error("[DEBUG] Question does not belong to the specified round. Question round_id:", question.round_id);
//       return res.status(400).json({ message: "Question does not belong to the specified round" });
//     }
//     console.log("[DEBUG] Round ID validated successfully");

//     // Prepare test cases
//     const testCases = req.body.testcases || question.test_cases;
//     if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
//       console.error("[DEBUG] Invalid or missing test cases");
//       return res.status(400).json({ message: "Invalid or missing test cases" });
//     }
//     console.log("[DEBUG] Test cases prepared successfully");

//     // Determine Docker API endpoint
//     console.log("[DEBUG] Determining Docker API endpoint for language:", language);
//     const dockerEndpoints = {
//       python: 'http://localhost:8084/compile',
//       java: 'http://localhost:8083/compile',
//       cpp: 'http://localhost:8081/compile',
//       c: 'http://localhost:8082/compile',
//     };
//     const dockerEndpoint = dockerEndpoints[language.toLowerCase()];
//     if (!dockerEndpoint) {
//       console.error("[DEBUG] Unsupported programming language:", language);
//       return res.status(400).json({ message: "Unsupported programming language" });
//     }
//     console.log("[DEBUG] Docker endpoint determined:", dockerEndpoint);

//     // Send request to Docker API
//     console.log("[DEBUG] Sending request to Docker API");
//     const dockerRequest = {
//       language: language.toLowerCase(),
//       code: solution_code,
//       testcases: testCases,
//     };
//     const dockerResponse = await axios.post(dockerEndpoint, dockerRequest);
//     const testResults = dockerResponse.data;

//     // Validate Docker response
//     if (!Array.isArray(testResults) || testResults.length === 0) {
//       console.error("[DEBUG] Invalid response from Docker API:", testResults);
//       return res.status(500).json({ message: "Invalid response from Docker API" });
//     }
//     console.log("[DEBUG] Docker API response received:", testResults);

//     // Handle submission mode
//     if (mode === 'submit') {
//       console.log("[DEBUG] Handling submission mode");
//       const totalTests = testResults.length;
//       const passedTests = testResults.filter((result) => result.success).length;
//       const score = Math.round((passedTests / totalTests) * 100);
//       const status = score === 100 ? 'pass' : score > 0 ? 'partial' : 'fail';

//       console.log("[DEBUG] Calculated Score:", score, "Status:", status);

//       // Save submission
//       const submission = await StudentResults.create({
//         student_id: studentId,
//         // assessment_id: question.assessment_id,
//         round_id,
//         question_id,
//         question_type: 'coding',
//         solution_code,
//         language,
//         question_points: question.question_points || 100,
//         score,
//       });
//       console.log("[DEBUG] Submission saved:", submission);

//       return res.status(201).json({
//         message: "Code submitted successfully",
//         submission,
//         test_results: testResults,
//       });
//     }

//     console.log("[DEBUG] Handling run mode");
//     return res.status(200).json({
//       message: "Code executed successfully",
//       test_results: testResults,
//     });
//   } catch (error) {
//     console.error("[DEBUG] Error in submitCode:", error);
//     res.status(500).json({ message: "Error processing request", error: error.message });
//   }
// };


// exports.submitCode = async (req, res) => {
//   try {
//     console.log("[DEBUG] Starting submitCode");
//     console.log("[DEBUG] Request Body:", req.body);

//     const studentId = req.user?.id; // Extracted from JWT payload
//     if (!studentId) {
//       console.error("[DEBUG] User ID is undefined");
//       return res.status(401).json({ message: "Unauthorized: User ID is required" });
//     }
//     console.log("[DEBUG] Authenticated User ID:", studentId);

//     const { round_id, question_id, language, solution_code, mode } = req.body;

//     // Validate input
//     if (!round_id || !question_id || !language || !solution_code || !mode) {
//       console.error("[DEBUG] Missing required fields");
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     console.log("[DEBUG] Input validated successfully");

//     // Fetch question details
//     console.log("[DEBUG] Fetching question details for question_id:", question_id);
//     const question = await CodingQuestion.findByPk(question_id);

//     // Handle case where the question is not found
//     if (!question) {
//       console.error("[DEBUG] Coding question not found for ID:", question_id);
//       return res.status(404).json({ message: "Coding question not found for the provided ID" });
//     }
//     console.log("[DEBUG] Question fetched successfully:", question);

//     // Ensure the question belongs to the given round
//     if (question.round_id !== round_id) {
//       console.error("[DEBUG] Question does not belong to the specified round. Question round_id:", question.round_id);
//       return res.status(400).json({ message: "Question does not belong to the specified round" });
//     }
//     console.log("[DEBUG] Round ID validated successfully");

//     // Prepare test cases
//     const testCases = req.body.testcases || question.test_cases;
//     if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
//       console.error("[DEBUG] Invalid or missing test cases");
//       return res.status(400).json({ message: "Invalid or missing test cases" });
//     }
//     console.log("[DEBUG] Test cases prepared successfully");

//     // Determine Docker API endpoint
//     console.log("[DEBUG] Determining Docker API endpoint for language:", language);
//     const dockerEndpoints = {
//       python: 'http://localhost:8084/compile',
//       java: 'http://localhost:8083/compile',
//       cpp: 'http://localhost:8081/compile',
//       c: 'http://localhost:8082/compile',
//     };
//     const dockerEndpoint = dockerEndpoints[language.toLowerCase()];
//     if (!dockerEndpoint) {
//       console.error("[DEBUG] Unsupported programming language:", language);
//       return res.status(400).json({ message: "Unsupported programming language" });
//     }
//     console.log("[DEBUG] Docker endpoint determined:", dockerEndpoint);

//     // Send request to Docker API
//     console.log("[DEBUG] Sending request to Docker API");
//     const dockerRequest = {
//       language: language.toLowerCase(),
//       code: solution_code,
//       testcases: testCases,
//     };
//     const dockerResponse = await axios.post(dockerEndpoint, dockerRequest);
//     const testResults = dockerResponse.data;

//     // Validate Docker response
//     if (!Array.isArray(testResults) || testResults.length === 0) {
//       console.error("[DEBUG] Invalid response from Docker API:", testResults);
//       return res.status(500).json({ message: "Invalid response from Docker API" });
//     }
//     console.log("[DEBUG] Docker API response received:", testResults);

//     // Handle submission mode
//     if (mode === 'submit') {
//       console.log("[DEBUG] Handling submission mode");
//       const totalTests = testResults.length;
//       const passedTests = testResults.filter((result) => result.success).length;
//       const score = Math.round((passedTests / totalTests) * 100);
//       const status = score === 100 ? 'pass' : score > 0 ? 'partial' : 'fail';

//       console.log("[DEBUG] Calculated Score:", score, "Status:", status);

//       // Save submission
//       const submission = await StudentResults.create({
//         student_id: studentId,
//         round_id, // Round ID for the assessment
//         question_id,
//         question_type: 'coding',
//         solution_code,
//         language,
//         question_points: question.question_points || 100,
//         score,
//       });
//       console.log("[DEBUG] Submission saved:", submission);

//       return res.status(201).json({
//         message: "Code submitted successfully",
//         submission,
//         test_results: testResults,
//       });
//     }

//     console.log("[DEBUG] Handling run mode");
//     return res.status(200).json({
//       message: "Code executed successfully",
//       test_results: testResults,
//     });
//   } catch (error) {
//     console.error("[DEBUG] Error in submitCode:", error);
//     res.status(500).json({ message: "Error processing request", error: error.message });
//   }
// };



// exports.submitCode = async (req, res) => {
//   try {
//     console.log("[DEBUG] Starting submitCode");
//     console.log("[DEBUG] Request Body:", req.body);

//     const studentId = req.user?.id; // Extracted from JWT payload
//     if (!studentId) {
//       console.error("[DEBUG] User ID is undefined");
//       return res.status(401).json({ message: "Unauthorized: User ID is required" });
//     }
//     console.log("[DEBUG] Authenticated User ID:", studentId);

//     const { round_id, question_id, language, solution_code, mode } = req.body;

//     // Validate input
//     if (!round_id || !question_id || !language || !solution_code || !mode) {
//       console.error("[DEBUG] Missing required fields");
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     console.log("[DEBUG] Input validated successfully");

//     // Fetch question details
//     console.log("[DEBUG] Fetching question details for question_id:", question_id);
//     const question = await CodingQuestion.findByPk(question_id);

//     if (!question) {
//       console.error("[DEBUG] Coding question not found for ID:", question_id);
//       return res.status(404).json({ message: "Coding question not found for the provided ID" });
//     }
//     console.log("[DEBUG] Question fetched successfully:", question);

//     if (question.round_id !== round_id) {
//       console.error("[DEBUG] Question does not belong to the specified round. Question round_id:", question.round_id);
//       return res.status(400).json({ message: "Question does not belong to the specified round" });
//     }
//     console.log("[DEBUG] Round ID validated successfully");

//     const testCases = req.body.testcases || question.test_cases;
//     if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
//       console.error("[DEBUG] Invalid or missing test cases");
//       return res.status(400).json({ message: "Invalid or missing test cases" });
//     }
//     console.log("[DEBUG] Test cases prepared successfully");

//     const dockerEndpoints = {
//       python: "http://localhost:8084/compile",
//       java: "http://localhost:8083/compile",
//       cpp: "http://localhost:8081/compile",
//       c: "http://localhost:8082/compile",
//     };
//     const dockerEndpoint = dockerEndpoints[language.toLowerCase()];
//     if (!dockerEndpoint) {
//       console.error("[DEBUG] Unsupported programming language:", language);
//       return res.status(400).json({ message: "Unsupported programming language" });
//     }
//     console.log("[DEBUG] Docker endpoint determined:", dockerEndpoint);

//     console.log("[DEBUG] Sending request to Docker API");
//     const dockerRequest = {
//       language: language.toLowerCase(),
//       code: solution_code,
//       testcases: testCases,
//     };
//     const dockerResponse = await axios.post(dockerEndpoint, dockerRequest);
//     const testResults = dockerResponse.data;

//     if (!Array.isArray(testResults) || testResults.length === 0) {
//       console.error("[DEBUG] Invalid response from Docker API:", testResults);
//       return res.status(500).json({ message: "Invalid response from Docker API" });
//     }
//     console.log("[DEBUG] Docker API response received:", testResults);

//     if (mode === "submit") {
//       console.log("[DEBUG] Handling submission mode");
//       const totalTests = testResults.length;
//       const passedTests = testResults.filter((result) => result.success).length;
//       const score = Math.round((passedTests / totalTests) * 100);
//       const status = score === 100 ? "pass" : score > 0 ? "partial" : "fail";

//       console.log("[DEBUG] Calculated Score:", score, "Status:", status);

//       // Check for existing submission
//       console.log("[DEBUG] Checking for existing submission");
//       const existingSubmission = await StudentResults.findOne({
//         where: {
//           student_id: studentId,
//           round_id,
//           question_id,
//         },
//       });

//       if (existingSubmission) {
//         console.log("[DEBUG] Existing submission found. Updating...");
//         await existingSubmission.update({
//           solution_code,
//           language,
//           score,
//           question_points: question.question_points || 100,
//           updatedAt: new Date(),
//         });
//         return res.status(200).json({
//           message: "Submission updated successfully",
//           submission: existingSubmission,
//           test_results: testResults,
//         });
//       }

//       console.log("[DEBUG] No existing submission found. Creating new...");
//       const newSubmission = await StudentResults.create({
//         student_id: studentId,
//         round_id,
//         question_id,
//         question_type: "coding",
//         solution_code,
//         language,
//         question_points: question.question_points || 100,
//         score,
//       });
//       console.log("[DEBUG] New submission saved:", newSubmission);

//       return res.status(201).json({
//         message: "Code submitted successfully",
//         submission: newSubmission,
//         test_results: testResults,
//       });
//     }

//     console.log("[DEBUG] Handling run mode");
//     return res.status(200).json({
    
//       message: "Code executed successfully",
      
//       test_results: testResults,
      
//     });
//     console.log("[DEBUG] Test Results being sent:", testResults);
//   } catch (error) {
//     console.error("[DEBUG] Error in submitCode:", error);
//     res.status(500).json({ message: "Error processing request", error: error.message });
//   }
// };



// exports.submitCode = async (req, res) => {
//   try {
//     console.log("[DEBUG] Starting submitCode");
//     console.log("[DEBUG] Request Body:", req.body);

//     const studentId = req.user?.id; // Extracted from JWT payload
//     if (!studentId) {
//       console.error("[DEBUG] User ID is undefined");
//       return res.status(401).json({ message: "Unauthorized: User ID is required" });
//     }
//     console.log("[DEBUG] Authenticated User ID:", studentId);

//     const { round_id, question_id, language, solution_code, mode } = req.body;

//     // Validate input
//     if (!round_id || !question_id || !language || !solution_code || !mode) {
//       console.error("[DEBUG] Missing required fields");
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     console.log("[DEBUG] Input validated successfully");

//     // Fetch question details
//     console.log("[DEBUG] Fetching question details for question_id:", question_id);
//     const question = await CodingQuestion.findByPk(question_id);

//     if (!question) {
//       console.error("[DEBUG] Coding question not found for ID:", question_id);
//       return res.status(404).json({ message: "Coding question not found for the provided ID" });
//     }
//     console.log("[DEBUG] Question fetched successfully:", question);

//     if (question.round_id !== round_id) {
//       console.error("[DEBUG] Question does not belong to the specified round. Question round_id:", question.round_id);
//       return res.status(400).json({ message: "Question does not belong to the specified round" });
//     }
//     console.log("[DEBUG] Round ID validated successfully");

//     const testCases = req.body.testcases || question.test_cases;
//     if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
//       console.error("[DEBUG] Invalid or missing test cases");
//       return res.status(400).json({ message: "Invalid or missing test cases" });
//     }
//     console.log("[DEBUG] Test cases prepared successfully");

//     const dockerEndpoints = {
//       python: "http://localhost:8084/compile",
//       java: "http://localhost:8083/compile",
//       cpp: "http://localhost:8081/compile",
//       c: "http://localhost:8082/compile",
//     };
//     const dockerEndpoint = dockerEndpoints[language.toLowerCase()];
//     if (!dockerEndpoint) {
//       console.error("[DEBUG] Unsupported programming language:", language);
//       return res.status(400).json({ message: "Unsupported programming language" });
//     }
//     console.log("[DEBUG] Docker endpoint determined:", dockerEndpoint);

//     console.log("[DEBUG] Sending request to Docker API");
//     const dockerRequest = {
//       language: language.toLowerCase(),
//       code: solution_code,
//       testcases: testCases,
//     };
//     const dockerResponse = await axios.post(dockerEndpoint, dockerRequest);
//     const testResults = dockerResponse.data;

//     if (!Array.isArray(testResults) || testResults.length === 0) {
//       console.error("[DEBUG] Invalid response from Docker API:", testResults);
//       return res.status(500).json({ message: "Invalid response from Docker API" });
//     }
//     console.log("[DEBUG] Docker API response received:", testResults);

//     if (mode === "submit") {
//       console.log("[DEBUG] Handling submission mode");
//       const totalTests = testResults.length;
//       const passedTests = testResults.filter((result) => result.success).length;
//       const score = Math.round((passedTests / totalTests) * 100);
//       const status = score === 100 ? "pass" : score > 0 ? "partial" : "fail";

//       console.log("[DEBUG] Calculated Score:", score, "Status:", status);

//       // Check for existing submission
//       console.log("[DEBUG] Checking for existing submission");
//       const existingSubmission = await StudentResults.findOne({
//         where: {
//           student_id: studentId,
//           round_id,
//           question_id,
//         },
//       });

//       if (existingSubmission) {
//         console.log("[DEBUG] Existing submission found. Updating...");
//         await existingSubmission.update({
//           solution_code,
//           language,
//           score,
//           question_points: question.question_points || 100,
//           updatedAt: new Date(),
//         });
//         console.log("[DEBUG] Updated submission successfully");
//         console.log("[DEBUG] Returning test results to frontend:", testResults);
//         return res.status(200).json({
//           message: "Submission updated successfully",
//           submission: existingSubmission,
//           test_results: testResults,
//         });
//       }

//       console.log("[DEBUG] No existing submission found. Creating new...");
//       const newSubmission = await StudentResults.create({
//         student_id: studentId,
//         round_id,
//         question_id,
//         question_type: "coding",
//         solution_code,
//         language,
//         question_points: question.question_points || 100,
//         score,
//       });
//       console.log("[DEBUG] New submission saved:", newSubmission);

//       console.log("[DEBUG] Returning test results to frontend:", testResults);
//       return res.status(201).json({
//         message: "Code submitted successfully",
//         submission: newSubmission,
//         test_results: testResults,
//       });
//     }

//     console.log("[DEBUG] Handling run mode");
//     console.log("[DEBUG] Returning test results to frontend:", testResults);
//     return res.status(200).json({
//       message: "Code executed successfully",
//       test_results: testResults,
//     });
//   } catch (error) {
//     console.error("[DEBUG] Error in submitCode:", error);
//     res.status(500).json({ message: "Error processing request", error: error.message });
//   }
// };


// exports.submitCode = async (req, res) => {
//   try {
//     console.log("[DEBUG] Starting submitCode");
//     console.log("[DEBUG] Request Body:", req.body);

//     const studentId = req.user?.id; // Extracted from JWT payload
//     if (!studentId) {
//       console.error("[DEBUG] User ID is undefined");
//       return res.status(401).json({ message: "Unauthorized: User ID is required" });
//     }
//     console.log("[DEBUG] Authenticated User ID:", studentId);

//     const { round_id, question_id, language, solution_code, mode, question_points } = req.body;

//     // Validate input
//     if (!round_id || !question_id || !language || !solution_code || !mode || !question_points) {
//       console.error("[DEBUG] Missing required fields");
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     console.log("[DEBUG] Input validated successfully");

//     // Fetch question details
//     console.log("[DEBUG] Fetching question details for question_id:", question_id);
//     const question = await CodingQuestion.findByPk(question_id);

//     if (!question) {
//       console.error("[DEBUG] Coding question not found for ID:", question_id);
//       return res.status(404).json({ message: "Coding question not found for the provided ID" });
//     }
//     console.log("[DEBUG] Question fetched successfully:", question);

//     if (question.round_id !== round_id) {
//       console.error("[DEBUG] Question does not belong to the specified round. Question round_id:", question.round_id);
//       return res.status(400).json({ message: "Question does not belong to the specified round" });
//     }
//     console.log("[DEBUG] Round ID validated successfully");

//     const testCases = req.body.testcases || question.test_cases;
//     if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
//       console.error("[DEBUG] Invalid or missing test cases");
//       return res.status(400).json({ message: "Invalid or missing test cases" });
//     }
//     console.log("[DEBUG] Test cases prepared successfully");

//     // Docker API logic...

//     if (mode === "submit") {
//       console.log("[DEBUG] Handling submission mode");

//       const existingSubmission = await StudentResults.findOne({
//         where: { student_id: studentId, round_id, question_id },
//       });

//       if (existingSubmission) {
//         console.log("[DEBUG] Existing submission found. Updating...");
//         await existingSubmission.update({
//           solution_code,
//           language,
//           question_points, // Store the points
//           score, // Pass calculated score
//         });
//         console.log("[DEBUG] Updated submission successfully");
//       } else {
//         console.log("[DEBUG] Creating new submission...");
//         const newSubmission = await StudentResults.create({
//           student_id: studentId,
//           round_id,
//           question_id,
//           solution_code,
//           language,
//           question_points, // Store the points
//           score, // Pass calculated score
//         });
//         console.log("[DEBUG] Created new submission successfully:", newSubmission);
//       }
//     }

//     console.log("[DEBUG] Returning test results to frontend");
//     return res.status(200).json({
//       message: "Code executed successfully",
//       test_results: testResults,
//     });
//   } catch (error) {
//     console.error("[DEBUG] Error in submitCode:", error);
//     return res.status(500).json({ message: "Error processing request", error: error.message });
//   }
// };



// exports.submitCode = async (req, res) => {
//   try {
//     console.log("[DEBUG] Starting submitCode");
//     console.log("[DEBUG] Request Body:", req.body);

//     const studentId = req.user?.id; // Extracted from JWT payload
//     if (!studentId) {
//       console.error("[DEBUG] User ID is undefined");
//       return res.status(401).json({ message: "Unauthorized: User ID is required" });
//     }
//     console.log("[DEBUG] Authenticated User ID:", studentId);

//     const { round_id, question_id, language, solution_code, mode, question_points } = req.body;

//     // Validate input
//     if (!round_id || !question_id || !language || !solution_code || !mode || !question_points) {
//       console.error("[DEBUG] Missing required fields");
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     console.log("[DEBUG] Input validated successfully");

//     // Fetch question details
//     console.log("[DEBUG] Fetching question details for question_id:", question_id);
//     const question = await CodingQuestion.findByPk(question_id);

//     if (!question) {
//       console.error("[DEBUG] Coding question not found for ID:", question_id);
//       return res.status(404).json({ message: "Coding question not found for the provided ID" });
//     }
//     console.log("[DEBUG] Question fetched successfully:", question);

//     if (question.round_id !== round_id) {
//       console.error("[DEBUG] Question does not belong to the specified round. Question round_id:", question.round_id);
//       return res.status(400).json({ message: "Question does not belong to the specified round" });
//     }
//     console.log("[DEBUG] Round ID validated successfully");

//     const testCases = req.body.testcases || question.test_cases;
//     if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
//       console.error("[DEBUG] Invalid or missing test cases");
//       return res.status(400).json({ message: "Invalid or missing test cases" });
//     }
//     console.log("[DEBUG] Test cases prepared successfully");

//     const dockerEndpoints = {
//       python: "http://localhost:8084/compile",
//       java: "http://localhost:8083/compile",
//       cpp: "http://localhost:8081/compile",
//       c: "http://localhost:8082/compile",
//     };
//     const dockerEndpoint = dockerEndpoints[language.toLowerCase()];
//     if (!dockerEndpoint) {
//       console.error("[DEBUG] Unsupported programming language:", language);
//       return res.status(400).json({ message: "Unsupported programming language" });
//     }
//     console.log("[DEBUG] Docker endpoint determined:", dockerEndpoint);

//     console.log("[DEBUG] Sending request to Docker API");
//     const dockerRequest = {
//       language: language.toLowerCase(),
//       code: solution_code,
//       testcases: testCases,
//     };
//     const dockerResponse = await axios.post(dockerEndpoint, dockerRequest);
//     const testResults = dockerResponse.data;

//     if (!Array.isArray(testResults) || testResults.length === 0) {
//       console.error("[DEBUG] Invalid response from Docker API:", testResults);
//       return res.status(500).json({ message: "Invalid response from Docker API" });
//     }
//     console.log("[DEBUG] Docker API response received:", testResults);

//     if (mode === "submit") {
//       console.log("[DEBUG] Handling submission mode");

//       // Calculate score and status
//       const totalTests = testResults.length;
//       const passedTests = testResults.filter((result) => result.success).length;
//       const score = Math.round((passedTests / totalTests) * 100);
//       const status = score === 100 ? "pass" : score > 0 ? "partial" : "fail";

//       console.log("[DEBUG] Calculated Score:", score, "Status:", status);

//       // Check for existing submission
//       console.log("[DEBUG] Checking for existing submission");
//       const existingSubmission = await StudentResults.findOne({
//         where: {
//           student_id: studentId,
//           round_id,
//           question_id,
//         },
//       });

//       if (existingSubmission) {
//         console.log("[DEBUG] Existing submission found. Updating...");
//         await existingSubmission.update({
//           solution_code,
//           language,
//           score,
//           question_points,
//           updatedAt: new Date(),
//         });
//         console.log("[DEBUG] Updated submission successfully");
//         return res.status(200).json({
//           message: "Submission updated successfully",
//           submission: existingSubmission,
//           test_results: testResults,
//         });
//       }

//       console.log("[DEBUG] No existing submission found. Creating new...");
//       const newSubmission = await StudentResults.create({
//         student_id: studentId,
//         round_id,
//         question_id,
//         question_type: "coding",
//         solution_code,
//         language,
//         question_points,
//         score,
//       });
//       console.log("[DEBUG] New submission saved:", newSubmission);

//       return res.status(201).json({
//         message: "Code submitted successfully",
//         submission: newSubmission,
//         test_results: testResults,
//       });
//     }

//     console.log("[DEBUG] Handling run mode");
//     return res.status(200).json({
//       message: "Code executed successfully",
//       test_results: testResults,
//     });
//   } catch (error) {
//     console.error("[DEBUG] Error in submitCode:", error);
//     res.status(500).json({ message: "Error processing request", error: error.message });
//   }
// };



exports.submitCode = async (req, res) => {
  try {
    console.log("[DEBUG] Starting submitCode");
    console.log("[DEBUG] Request Body:", req.body);

    const studentId = req.user?.id; // Extracted from JWT payload
    if (!studentId) {
      console.error("[DEBUG] User ID is undefined");
      return res.status(401).json({ message: "Unauthorized: User ID is required" });
    }
    console.log("[DEBUG] Authenticated User ID:", studentId);

    const {
      round_id,
      question_id,
      language,
      solution_code,
      mode, // "run" or "submit"
      question_points,
    } = req.body;

    // Validate input
    if (!round_id || !question_id || !language || !solution_code || !mode) {
      console.error("[DEBUG] Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }
    console.log("[DEBUG] Input validated successfully");

    // Fetch question details
    console.log("[DEBUG] Fetching question details for question_id:", question_id);
    const question = await CodingQuestion.findByPk(question_id);

    if (!question) {
      console.error("[DEBUG] Coding question not found for ID:", question_id);
      return res.status(404).json({ message: "Coding question not found for the provided ID" });
    }
    console.log("[DEBUG] Question fetched successfully:", question);

    if (question.round_id !== round_id) {
      console.error("[DEBUG] Question does not belong to the specified round. Question round_id:", question.round_id);
      return res.status(400).json({ message: "Question does not belong to the specified round" });
    }
    console.log("[DEBUG] Round ID validated successfully");

    // Prepare test cases
    const testCases = req.body.testcases || question.test_cases;
    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      console.error("[DEBUG] Invalid or missing test cases");
      return res.status(400).json({ message: "Invalid or missing test cases" });
    }
    console.log("[DEBUG] Test cases prepared successfully");

    // Determine the Docker API endpoint based on language
    const dockerEndpoints = {
      python: "http://localhost:8084/compile",
      java: "http://localhost:8083/compile",
      cpp: "http://localhost:8081/compile",
      c: "http://localhost:8082/compile",
    };
    const dockerEndpoint = dockerEndpoints[language.toLowerCase()];
    if (!dockerEndpoint) {
      console.error("[DEBUG] Unsupported programming language:", language);
      return res.status(400).json({ message: "Unsupported programming language" });
    }
    console.log("[DEBUG] Docker endpoint determined:", dockerEndpoint);

    // Execute the code via Docker API if in "run" or "submit" mode
    console.log("[DEBUG] Sending request to Docker API");
    const dockerRequest = {
      language: language.toLowerCase(),
      code: solution_code,
      testcases: testCases,
    };
    const dockerResponse = await axios.post(dockerEndpoint, dockerRequest);
    const testResults = dockerResponse.data;

    if (!Array.isArray(testResults) || testResults.length === 0) {
      console.error("[DEBUG] Invalid response from Docker API:", testResults);
      return res.status(500).json({ message: "Invalid response from Docker API" });
    }
    console.log("[DEBUG] Docker API response received:", testResults);

    // Handle "submit" mode
    if (mode === "submit") {
      console.log("[DEBUG] Handling submission mode");

      // Calculate score
      const totalTests = testResults.length;
      const passedTests = testResults.filter((result) => result.success).length;
      const score = Math.round((passedTests / totalTests) * 100);
      const status = score === 100 ? "pass" : score > 0 ? "partial" : "fail";

      console.log("[DEBUG] Calculated Score:", score, "Status:", status);

      // Check for existing submission
      console.log("[DEBUG] Checking for existing submission");
      const existingSubmission = await StudentResults.findOne({
        where: {
          student_id: studentId,
          round_id,
          question_id,
        },
      });

      if (existingSubmission) {
        console.log("[DEBUG] Existing submission found. Updating...");
        await existingSubmission.update({
          solution_code,
          language,
          score,
          question_points,
          updatedAt: new Date(),
        });
        console.log("[DEBUG] Updated submission successfully");
        return res.status(200).json({
          message: "Submission updated successfully",
          submission: existingSubmission,
          test_results: testResults,
        });
      }

      console.log("[DEBUG] No existing submission found. Creating new...");
      const newSubmission = await StudentResults.create({
        student_id: studentId,
        round_id,
        question_id,
        question_type: "coding",
        solution_code,
        language,
        question_points,
        score,
      });
      console.log("[DEBUG] New submission saved:", newSubmission);

      return res.status(201).json({
        message: "Code submitted successfully",
        submission: newSubmission,
        test_results: testResults,
      });
    }

    // Handle "run" mode
    console.log("[DEBUG] Handling run mode");
    return res.status(200).json({
      message: "Code executed successfully",
      test_results: testResults,
    });
  } catch (error) {
    console.error("[DEBUG] Error in submitCode:", error);
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
};



// exports.submitMcqAnswer = async (req, res) => {
//   try {
//     console.log("[DEBUG] Starting submitMcqAnswer");
//     console.log("[DEBUG] Request Body:", req.body);

//     const { student_id, round_id, question_id, submitted_options, points } = req.body;

//     // Validate the input
//     if (!student_id || !round_id || !question_id || !submitted_options || points === undefined) {
//       console.error("[DEBUG] Missing required fields");
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     console.log("[DEBUG] Input validated successfully");

//     // Check if the answer already exists for this round and question
//     console.log("[DEBUG] Checking for existing submission");
//     let answer = await StudentResults.findOne({
//       where: {
//         student_id,
//         round_id,
//         question_id,
//         question_type: "mcq",
//       },
//     });

//     if (answer) {
//       console.log("[DEBUG] Existing submission found. Updating...");
//       await answer.update({
//         submitted_options,
//         score: points,
//         updatedAt: new Date(),
//       });
//       console.log("[DEBUG] Submission updated successfully");
//     } else {
//       console.log("[DEBUG] No existing submission found. Creating new...");
//       answer = await StudentResults.create({
//         student_id,
//         round_id,
//         question_id,
//         question_type: "mcq",
//         submitted_options,
//         score: points,
//         question_points: points, // Assuming full points for correct answers
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//       console.log("[DEBUG] New submission saved:", answer);
//     }

//     return res.status(200).json({ message: "Answer submitted successfully", answer });
//   } catch (error) {
//     console.error("[DEBUG] Error in submitMcqAnswer:", error);
//     res.status(500).json({ message: "Error submitting answer", error: error.message });
//   }
// };



// exports.submitMcqAnswer = async (req, res) => {
//   try {
//     console.log("[DEBUG] Starting submitMcqAnswer");
//     console.log("[DEBUG] Request Body:", req.body);

//     // Extract student_id from JWT or request body
//     const student_id = req.user?.id || req.body.student_id;

//     // Log extracted student_id for debugging
//     console.log("[DEBUG] Extracted Student ID:", student_id);

//     const { round_id, question_id, submitted_options, points } = req.body;

//     // Validate the input
//     if (!student_id || !round_id || !question_id || !submitted_options || points === undefined) {
//       console.error("[DEBUG] Missing required fields:", {
//         student_id,
//         round_id,
//         question_id,
//         submitted_options,
//         points,
//       });
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     console.log("[DEBUG] Input validated successfully");

//     // Check if the answer already exists for this round and question
//     console.log("[DEBUG] Checking for existing submission");
//     let answer = await StudentResults.findOne({
//       where: {
//         student_id,
//         round_id,
//         question_id,
//         question_type: "mcq",
//       },
//     });

//     if (answer) {
//       console.log("[DEBUG] Existing submission found. Updating...");
//       await answer.update({
//         submitted_options,
//         score: points,
//         updatedAt: new Date(),
//       });
//       console.log("[DEBUG] Submission updated successfully");
//     } else {
//       console.log("[DEBUG] No existing submission found. Creating new...");
//       answer = await StudentResults.create({
//         student_id,
//         round_id,
//         question_id,
//         question_type: "mcq",
//         submitted_options,
//         score: points,
//         question_points: points,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//       console.log("[DEBUG] New submission saved:", answer);
//     }

//     return res
//       .status(200)
//       .json({ message: "Answer submitted successfully", answer });
//   } catch (error) {
//     console.error("[DEBUG] Error in submitMcqAnswer:", error);
//     res
//       .status(500)
//       .json({ message: "Error submitting answer", error: error.message });
//   }
// };



// exports.submitMcqAnswer = async (req, res) => {
//   try {
//     console.log("[DEBUG] Starting submitMcqAnswer");
//     console.log("[DEBUG] Request Body:", req.body);

//     // Extract student_id from JWT or request body
//     const student_id = req.user?.id || req.body.student_id;

//     console.log("[DEBUG] Extracted Student ID:", student_id);

//     const { round_id, question_id, submitted_options } = req.body;

//     // Validate the input
//     if (!student_id || !round_id || !question_id || !submitted_options) {
//       console.error("[DEBUG] Missing required fields:", {
//         student_id,
//         round_id,
//         question_id,
//         submitted_options,
//       });
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     console.log("[DEBUG] Input validated successfully");

//     // Fetch the correct answers from the MCQQuestion table
//     console.log("[DEBUG] Fetching correct answers for question_id:", question_id);
//     const mcqQuestion = await MCQQuestion.findByPk(question_id, {
//       attributes: ['correct_answers', 'is_single_answer', 'difficulty'],
//     });

//     if (!mcqQuestion) {
//       console.error("[DEBUG] MCQ question not found for ID:", question_id);
//       return res.status(404).json({ message: "MCQ question not found" });
//     }

//     const correctAnswers = mcqQuestion.correct_answers || [];
//     const isSingleAnswer = mcqQuestion.is_single_answer;
//     const difficulty = mcqQuestion.difficulty;

//     console.log("[DEBUG] Correct Answers:", correctAnswers);
//     console.log("[DEBUG] Is Single Answer:", isSingleAnswer);

//     // Determine points based on difficulty
//     const difficultyMapping = {
//       Level1: 100,
//       Level2: 200,
//       Level3: 300,
//       Level4: 400,
//       Level5: 500,
//     };
//     let points = difficultyMapping[difficulty] || 100;

//     // Check if the submitted answers are correct
//     let isAnswerCorrect = false;

//     if (isSingleAnswer) {
//       isAnswerCorrect =
//         submitted_options.length === 1 &&
//         correctAnswers.includes(submitted_options[0]);
//     } else {
//       isAnswerCorrect =
//         submitted_options.length === correctAnswers.length &&
//         submitted_options.every((option) => correctAnswers.includes(option));
//     }

//     if (!isAnswerCorrect) {
//       points = 0; // Set points to 0 for incorrect answers
//     }

//     console.log("[DEBUG] Is Answer Correct:", isAnswerCorrect);
//     console.log("[DEBUG] Points Awarded:", points);

//     // Check if the answer already exists for this round and question
//     console.log("[DEBUG] Checking for existing submission");
//     let answer = await StudentResults.findOne({
//       where: {
//         student_id,
//         round_id,
//         question_id,
//         question_type: "mcq",
//       },
//     });

//     if (answer) {
//       console.log("[DEBUG] Existing submission found. Updating...");
//       await answer.update({
//         submitted_options,
//         score: points,
//         updatedAt: new Date(),
//       });
//       console.log("[DEBUG] Submission updated successfully");
//     } else {
//       console.log("[DEBUG] No existing submission found. Creating new...");
//       answer = await StudentResults.create({
//         student_id,
//         round_id,
//         question_id,
//         question_type: "mcq",
//         submitted_options,
//         score: points,
//         question_points: points,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//       console.log("[DEBUG] New submission saved:", answer);
//     }

//     return res.status(200).json({
//       message: "Answer submitted successfully",
//       score: points, // Only return the score to the frontend
//     });
//   } catch (error) {
//     console.error("[DEBUG] Error in submitMcqAnswer:", error);
//     res.status(500).json({ message: "Error submitting answer", error: error.message });
//   }
// };



exports.submitMcqAnswer = async (req, res) => {
  try {
    console.log("[DEBUG] Starting submitMcqAnswer");
    console.log("[DEBUG] Request Body:", req.body);

    const student_id = req.user?.id || req.body.student_id;
    const { round_id, question_id, submitted_options } = req.body;

    if (!student_id || !round_id || !question_id || !submitted_options) {
      console.error("[DEBUG] Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("[DEBUG] Input validated successfully");

    // Process the submission
    console.log("[DEBUG] Checking for existing submission");
    let answer = await StudentResults.findOne({
      where: {
        student_id,
        round_id,
        question_id,
        question_type: "mcq",
      },
    });

    if (answer) {
      console.log("[DEBUG] Existing submission found. Updating...");
      await answer.update({
        submitted_options,
        updatedAt: new Date(),
      });
      console.log("[DEBUG] Submission updated successfully");
    } else {
      console.log("[DEBUG] No existing submission found. Creating new...");
      answer = await StudentResults.create({
        student_id,
        round_id,
        question_id,
        question_type: "mcq",
        submitted_options,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("[DEBUG] New submission saved:", answer);
    }

    return res.status(200).json({ message: "Answer submitted successfully" });
  } catch (error) {
    console.error("[DEBUG] Error in submitMcqAnswer:", error);
    res.status(500).json({ message: "Error submitting answer", error: error.message });
  }
};



// Fetch saved code for a student and question
// exports.fetchCode = async (req, res) => {
//   try {
//     const { student_id, question_id, round_id } = req.query;

//     if (!student_id || !question_id || !round_id) {
//       return res.status(400).json({ error: 'Missing required parameters' });
//     }

//     const result = await StudentResult.findOne({
//       where: {
//         student_id: student_id,
//         question_id: question_id,
//         round_id: round_id,
//       },
//       attributes: ['solution_code', 'language'],
//     });

//     if (!result) {
//       return res.status(404).json({ message: 'Solution not found' });
//     }

//     res.status(200).json({
//       solution_code: result.solution_code || '',
//       language: result.language || 'Please select a Language',
//     });
//   } catch (error) {
//     console.error('Error fetching solution code:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// Fetch saved code
exports.fetchCode = async (req, res) => {
  const { question_id, round_id } = req.query;
  const { student_id } = req.user; // Extracted from JWT

  if (!question_id || !round_id) {
    return res.status(400).json({ error: 'Missing question_id or round_id' });
  }

  try {
    const result = await StudentResult.findOne({
      where: { student_id, question_id, round_id },
      attributes: ['solution_code', 'language'],
    });

    if (!result) {
      return res.status(404).json({ solution_code: '', language: '' });
    }

    res.status(200).json({
      solution_code: result.solution_code,
      language: result.language,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch code' });
  }
};





// // Save code for a student and question
// exports.saveCode = async (req, res) => {
//   try {
//     const { student_id, question_id, round_id, solution_code, language } = req.body;

//     if (!student_id || !question_id || !round_id || !solution_code || !language) {
//       return res.status(400).json({ error: 'Missing required parameters' });
//     }

//     const [result, created] = await StudentResult.findOrCreate({
//       where: {
//         student_id: student_id,
//         question_id: question_id,
//         round_id: round_id,
//       },
//       defaults: {
//         solution_code: solution_code,
//         language: language,
//       },
//     });

//     if (!created) {
//       // If record already exists, update it
//       await result.update({ solution_code, language });
//     }

//     res.status(200).json({ message: 'Code saved successfully' });
//   } catch (error) {
//     console.error('Error saving solution code:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// Save code
exports.saveCode = async (req, res) => {
  const { question_id, round_id, solution_code, language } = req.body;
  const { student_id } = req.user; // Extracted from JWT

  if (!question_id || !round_id || !solution_code || !language) {
    return res
      .status(400)
      .json({ error: 'Missing question_id, round_id, solution_code, or language' });
  }

  try {
    const [result, created] = await StudentResult.findOrCreate({
      where: { student_id, question_id, round_id },
      defaults: { solution_code, language },
    });

    if (!created) {
      await result.update({ solution_code, language });
    }

    res.status(200).json({ message: 'Code saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save code' });
  }
};

